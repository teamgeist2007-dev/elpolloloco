/**
 * Verwaltet Spielgeräusche, Hintergrundmusik und die Tonsteuerung.
 */
class GameAudio {
    /**
     * Lädt die Audiodateien und verbindet die Bedienelemente.
     * @param {HTMLButtonElement} button - Schalter für alle Töne.
     * @param {HTMLDetailsElement} musicSettings - Menü für die Hintergrundmusik.
     */
    constructor(button, musicSettings) {
        this.button = button;
        this.musicInput = musicSettings.querySelector('input');
        this.musicLabel = musicSettings.querySelector('label');
        this.roundPlaying = false;

        const paths = {
            characterDamage: 'character/characterDamage.mp3',
            characterDead: 'character/characterDead.wav',
            characterJump: 'character/characterJump.wav',
            characterRun: 'character/characterRun.mp3',
            characterSnoring: 'character/characterSnoring.mp3',
            chickenDead: 'chicken/chickenDead.mp3',
            chickenDead2: 'chicken/chickenDead2.mp3',
            bottleCollect: 'collectibles/bottleCollectSound.wav',
            coinCollect: 'collectibles/collectSound.wav',
            endbossApproach: 'endboss/endbossApproach.wav',
            gameStart: 'game/gameStart.mp3',
            backgroundMusic: 'game/mexico-salsa.mp3',
            bottleBreak: 'throwable/bottleBreak.mp3',
            gameLose: 'win and lose sound/loseSound.mp3'
        };

        this.sounds = {};

        for (const name in paths) {
            this.sounds[name] = new Audio('audio/sounds/' + paths[name]);
        }

        this.sounds.characterRun.loop = true;
        this.sounds.characterSnoring.loop = true;
        this.sounds.backgroundMusic.loop = true;

        this.muted = localStorage.getItem('el-pollo-loco-muted') === 'true';
        this.updateButton();

        this.musicInput.value =
            localStorage.getItem('el-pollo-loco-music-volume') ?? '20';

        this.updateMusic();

        this.musicInput.addEventListener('input', () => {
            localStorage.setItem(
                'el-pollo-loco-music-volume',
                this.musicInput.value
            );
            this.updateMusic();
        });

        musicSettings.addEventListener('keydown', (event) => {
            event.stopPropagation();

            if (event.key === 'Escape' && musicSettings.open) {
                event.preventDefault();
                musicSettings.open = false;
            }
        });

        musicSettings.addEventListener('toggle', () => {
            if (!musicSettings.open) this.focusGame();
        });

        button.addEventListener('click', () => {
            this.toggle();
            this.focusGame();
        });

        button.addEventListener('keydown', (event) => {
            if (event.code === 'Space') event.stopPropagation();
        });

        window.addEventListener('keydown', () => this.allowPlayback());
        window.addEventListener('pointerup', () => this.allowPlayback());
    }

    /**
     * Setzt die Tonzustände zurück und startet den Ton einer neuen Runde.
     * @param {World} world - Neue Spielwelt.
     */
    startRound(world) {
        this.stopAllSounds();
        this.lastX = world.character.x;
        this.lastGroundStep = -Infinity;
        this.wasRising = false;
        this.bossSoundPlayed = false;
        this.roundPlaying = true;
        this.play('gameStart');
        this.updateMusic();
    }

    /**
     * Wählt die Geräusche für Bewegung, Schlafen und den nahenden Endboss.
     * @param {World} world - Laufende Spielwelt.
     */
    update(world) {
        const character = world.character;
        const now = performance.now();
        const rising = character.speedY > 0;
        const airborne = rising || character.isAboveGround();
        const moved = character.x !== this.lastX;

        if (rising && !this.wasRising) this.play('characterJump');
        if (moved && !airborne) this.lastGroundStep = now;

        const walking = (world.keyboard.LEFT || world.keyboard.RIGHT) &&
            !airborne && now - this.lastGroundStep < 80;

        this.setLoop('characterRun', walking);
        this.setLoop('characterSnoring', character.isSleeping);

        const boss = world.level.enemies.find((enemy) => enemy instanceof Endboss);

        if (boss?.isChasing && !this.bossSoundPlayed) {
            this.bossSoundPlayed = true;
            this.play('endbossApproach');
        }

        this.wasRising = rising;
        this.lastX = character.x;
    }

    /**
     * Spielt ein Geräusch von vorne ab.
     * @param {string} name - Name des Geräuschs.
     */
    play(name) {
        if (this.muted || this.waitingForInput) return;

        const sound = this.sounds[name];
        sound.currentTime = 0;

        sound.play().catch((error) => {
            if (error.name === 'NotAllowedError' && !this.muted) {
                this.waitingForInput = true;
                if (name === 'gameStart') this.startPending = true;
            }
        });
    }

    /**
     * Startet oder beendet ein wiederholtes Geräusch.
     * @param {string} name - Name des Geräuschs.
     * @param {boolean} active - Ob das Geräusch laufen soll.
     */
    setLoop(name, active) {
        const sound = this.sounds[name];

        if (active && sound.paused) {
            this.play(name);
        } else if (!active && !sound.paused) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    /**
     * Regelt nur die Hintergrundmusik. Kleine Werte werden deutlich leiser.
     */
    updateMusic() {
        const percent = Number(this.musicInput.value);
        const shouldPlay = this.roundPlaying && !world?.paused &&
            !this.muted && percent > 0;

        const volume = (percent / 100) ** 2 * 0.4;

        this.musicLabel.textContent = percent === 0
            ? 'Hintergrundmusik aus'
            : 'Hintergrundmusik ' + percent + ' %';

        if (shouldPlay) this.prepareMusicVolume();

        if (this.musicGain) {
            this.musicGain.gain.value = volume;
        } else {
            this.sounds.backgroundMusic.volume = volume;
        }

        this.setLoop('backgroundMusic', shouldPlay);
    }

    /**
     * Ermöglicht die Musiklautstärke auch über Web Audio auf dem Handy.
     */
    prepareMusicVolume() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext || this.musicContextFailed) return;

        if (!this.musicContext) {
            try {
                const context = new AudioContext();
                const gain = context.createGain();
                const music = this.sounds.backgroundMusic;
                const source = context.createMediaElementSource(music);

                music.volume = 1;
                source.connect(gain);
                gain.connect(context.destination);

                this.musicContext = context;
                this.musicGain = gain;
            } catch {
                this.musicContextFailed = true;
                return;
            }
        }

        if (this.musicContext.state !== 'running') {
            this.musicContext.resume().catch(() => {});
        }
    }

    /**
     * Versucht nach einer Benutzereingabe erneut, die Wiedergabe zu starten.
     */
    allowPlayback() {
        this.waitingForInput = false;

        if (this.startPending) {
            this.startPending = false;
            this.play('gameStart');
        }

        this.updateMusic();
    }

    /**
     * Stoppt die dauerhaft laufenden Geräusche beim Ende der Runde.
     */
    endRound() {
        this.roundPlaying = false;
        this.startPending = false;
        this.setLoop('backgroundMusic', false);
        this.setLoop('characterRun', false);
        this.setLoop('characterSnoring', false);
    }

    /**
     * Schaltet alle Töne um und speichert die Einstellung.
     */
    toggle() {
        this.muted = !this.muted;
        localStorage.setItem('el-pollo-loco-muted', String(this.muted));
        this.updateButton();

        if (this.muted) {
            this.startPending = false;
            this.stopAllSounds();
        } else {
            this.allowPlayback();
        }
    }

    /**
     * Stoppt alle Audiodateien und einen noch klingenden Siegeston.
     */
    stopAllSounds() {
        for (const name in this.sounds) {
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0;
        }

        if (this.winGain) this.winGain.gain.value = 0;
    }

    /**
     * Spielt statt des alten Gewinnsounds drei kurze, leise Töne.
     */
    playWinSound() {
        if (this.muted) return;

        this.prepareMusicVolume();
        const context = this.musicContext;
        if (!context) return;

        this.winGain = context.createGain();
        this.winGain.gain.value = 0.12;
        this.winGain.connect(context.destination);

        [523.25, 659.25, 783.99].forEach((frequency, index) => {
            this.playWinNote(frequency, context.currentTime + index * 0.18);
        });
    }

    /**
     * Spielt einen weich ein- und ausklingenden Ton.
     * @param {number} frequency - Tonhöhe in Hertz.
     * @param {number} start - Startzeit im Audiokontext.
     */
    playWinNote(frequency, start) {
        const context = this.musicContext;
        const tone = context.createOscillator();
        const envelope = context.createGain();

        tone.type = 'sine';
        tone.frequency.value = frequency;

        envelope.gain.setValueAtTime(0, start);
        envelope.gain.linearRampToValueAtTime(0.5, start + 0.02);
        envelope.gain.linearRampToValueAtTime(0, start + 0.3);

        tone.connect(envelope);
        envelope.connect(this.winGain);

        tone.onended = () => {
            tone.disconnect();
            envelope.disconnect();
        };

        tone.start(start);
        tone.stop(start + 0.31);
    }

    /**
     * Gibt den Tastaturfokus nach der Tonbedienung ans Spielfeld zurück.
     */
    focusGame() {
        if (world && !world.gameFinished) {
            world.canvas.tabIndex = -1;
            world.canvas.focus({ preventScroll: true });
        }
    }

    /**
     * Aktualisiert Beschriftung und Zustand des Schalters für alle Töne.
     */
    updateButton() {
        const label = this.muted
            ? 'Alle Töne einschalten: Musik und Spielgeräusche'
            : 'Alle Töne ausschalten: Musik und Spielgeräusche';

        this.button.textContent = this.muted ? '🔇 Ton aus' : '🔊 Ton an';
        this.button.setAttribute('aria-pressed', String(this.muted));
        this.button.title = label;
        this.button.setAttribute('aria-label', label);
    }
}

const gameAudio = new GameAudio(
    document.getElementById('sound-toggle'),
    document.getElementById('music-settings')
);