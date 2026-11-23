/**
 * Verwaltet Spielgeräusche, Hintergrundmusik und Tonsteuerung.
 */
class GameAudio {
    /**
     * Lädt die Audiodateien und verbindet Buttons und Musikregler.
     * @param {HTMLButtonElement} button - Button zum Umschalten aller Töne.
     * @param {HTMLDetailsElement} musicSettings - Aufklappbares Musikmenü.
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
            gameWin: 'win and lose sound/winSound.mp3',
            gameLose: 'win and lose sound/loseSound.mp3'
        };

        this.sounds = {};

        for (const name in paths) {
            this.sounds[name] = new Audio('audio/sounds/' + paths[name]);
        }

        // Diese Dateien werden bei Bedarf wiederholt.
        this.sounds.characterRun.loop = true;
        this.sounds.characterSnoring.loop = true;
        this.sounds.backgroundMusic.loop = true;

        this.muted = localStorage.getItem('el-pollo-loco-muted') === 'true';
        this.updateButton();

        this.musicInput.value = localStorage.getItem('el-pollo-loco-music-volume') ?? '20';
        this.updateMusic();

        this.musicInput.addEventListener('input', () => {
            localStorage.setItem('el-pollo-loco-music-volume', this.musicInput.value);
            this.updateMusic();
        });

        // Die Pfeiltasten bedienen im Musikmenü den Regler.
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

        // Nach einer Eingabe kann der Browser die Tonwiedergabe erlauben.
        window.addEventListener('keydown', () => this.allowPlayback());
        window.addEventListener('pointerup', () => this.allowPlayback());
    }

    /**
     * Bereitet den Ton für eine neue Runde vor und startet die Musik.
     * @param {World} world - Neu gestartete Spielwelt.
     */
    startRound(world) {
        this.lastX = world.character.x;
        this.lastGroundStep = -Infinity;
        this.wasRising = false;
        this.bossSoundPlayed = false;
        this.roundPlaying = true;
        this.play('gameStart');
        this.updateMusic();
    }

    /**
     * Prüft Bewegung, Schlaf und Verfolgung für die passenden Geräusche.
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
     * @param {string} name - Name des Geräuschs in der Soundliste.
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
     * Startet oder stoppt ein wiederholtes Geräusch.
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
     * Übernimmt die Musiklautstärke vom Regler und pausiert bei null.
     */
    updateMusic() {
        const percent = Number(this.musicInput.value);
        const shouldPlay = this.roundPlaying && !this.muted && percent > 0;

        this.musicLabel.textContent = percent === 0 ? 'Musik aus' : 'Musik ' + percent + ' %';

        if (shouldPlay) this.prepareMusicVolume();

        if (this.musicGain) {
            this.musicGain.gain.value = percent / 100;
        } else {
            this.sounds.backgroundMusic.volume = percent / 100;
        }

        this.setLoop('backgroundMusic', shouldPlay);
    }

    /**
     * Bereitet die Lautstärkeregelung über Web Audio vor.
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
     * Holt nach einer Eingabe gegebenenfalls die blockierte Tonwiedergabe nach.
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
     * Stoppt Musik, Laufgeräusch und Schnarchen nach dem Spielende.
     */
    endRound() {
        this.roundPlaying = false;
        this.startPending = false;
        this.setLoop('backgroundMusic', false);
        this.setLoop('characterRun', false);
        this.setLoop('characterSnoring', false);
    }

    /**
     * Schaltet den gesamten Ton um und speichert die Einstellung.
     */
    toggle() {
        this.muted = !this.muted;
        localStorage.setItem('el-pollo-loco-muted', String(this.muted));
        this.updateButton();

        if (this.muted) {
            this.startPending = false;

            for (const name in this.sounds) {
                const sound = this.sounds[name];
                sound.pause();
                sound.currentTime = 0;
            }
        } else {
            this.allowPlayback();
        }
    }

    /**
     * Gibt den Tastaturfokus an das laufende Spiel zurück.
     */
    focusGame() {
        if (world && !world.gameFinished) {
            world.canvas.tabIndex = -1;
            world.canvas.focus({ preventScroll: true });
        }
    }

    /**
     * Aktualisiert Symbol und Beschriftung des Tonbuttons.
     */
    updateButton() {
        const label = this.muted ? 'Ton einschalten' : 'Ton ausschalten';
        this.button.textContent = this.muted ? '🔇' : '🔊';
        this.button.title = label;
        this.button.setAttribute('aria-label', label);
    }
}

const gameAudio = new GameAudio(
    document.getElementById('sound-toggle'),
    document.getElementById('music-settings')
);