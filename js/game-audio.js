// Verwaltet alle Spielgeräusche und den Tonknopf.
class GameAudio {
    // Lädt die Audiodateien und richtet den Tonknopf ein.
    constructor(button) {
        this.button = button;

        // Ordnet jedem Geräusch die passende Datei im Soundordner zu.
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
            bottleBreak: 'throwable/bottleBreak.mp3',
            gameWin: 'win and lose sound/winSound.mp3',
            gameLose: 'win and lose sound/loseSound.mp3'
        };

        // Hier landen die Audioobjekte, damit sie beim Spielen wiederverwendet werden können.
        this.sounds = {};

        for (const name in paths) {
            this.sounds[name] = new Audio('audio/sounds/' + paths[name]);
        }

        // Laufen und Schnarchen wiederholen sich, solange die Aktion aktiv ist.
        this.sounds.characterRun.loop = true;
        this.sounds.characterSnoring.loop = true;

        // Liest die gespeicherte Toneinstellung ein.
        this.muted = localStorage.getItem('el-pollo-loco-muted') === 'true';
        this.updateButton();

        // Schaltet den Ton um und gibt den Tastaturfokus an das Spielfeld zurück.
        button.addEventListener('click', () => {
            this.toggle();

            if (world && !world.gameFinished) {
                world.canvas.tabIndex = -1;
                world.canvas.focus({ preventScroll: true });
            }
        });

        // Wenn der Button fokussiert ist, bedient die Leertaste den Button.
        button.addEventListener('keydown', (event) => {
            if (event.code === 'Space') event.stopPropagation();
        });

        // Eine neue Eingabe kann die Audiowiedergabe erlauben, wenn der Browser sie zuvor blockiert hat.
        window.addEventListener('keydown', () => this.allowPlayback());
        window.addEventListener('pointerup', () => this.allowPlayback());
    }

    // Setzt die Tonzustände zurück und spielt den Startsound.
    startRound(world) {
        this.lastX = world.character.x;
        this.lastGroundStep = -Infinity;
        this.wasRising = false;
        this.bossSoundPlayed = false;
        this.play('gameStart');
    }

    // Prüft pro Spielbild, ob Pepe läuft, springt oder schnarcht und ob der Boss auftaucht.
    update(world) {
        const character = world.character;
        const now = performance.now();
        const rising = character.speedY > 0;
        const airborne = rising || character.isAboveGround();
        const moved = character.x !== this.lastX;

        // Spielt den Sprungsound einmal zu Beginn eines Sprungs.
        if (rising && !this.wasRising) this.play('characterJump');
        if (moved && !airborne) this.lastGroundStep = now;

        // Spielt das Laufgeräusch am Boden und lässt es zwischen zwei Bewegungsschritten weiterlaufen.
        const walking = (world.keyboard.LEFT || world.keyboard.RIGHT) &&
            !airborne && now - this.lastGroundStep < 80;

        this.setLoop('characterRun', walking);
        this.setLoop('characterSnoring', character.isSleeping);

        const boss = world.level.enemies.find((enemy) => enemy instanceof Endboss);

        // Spielt einmal pro Runde das Geräusch, wenn der Endboss mit der Verfolgung beginnt.
        if (boss?.isChasing && !this.bossSoundPlayed) {
            this.bossSoundPlayed = true;
            this.play('endbossApproach');
        }

        this.wasRising = rising;
        this.lastX = character.x;
    }

    // Spielt ein Geräusch von vorne ab, solange der Ton eingeschaltet ist.
    play(name) {
        if (this.muted || this.waitingForInput) return;

        const sound = this.sounds[name];
        sound.currentTime = 0;

        // Merkt sich beim Startsound, wenn der Browser erst eine Eingabe braucht.
        sound.play().catch((error) => {
            if (error.name === 'NotAllowedError' && !this.muted) {
                this.waitingForInput = true;
                if (name === 'gameStart') this.startPending = true;
            }
        });
    }

    // Startet ein wiederholtes Geräusch oder stoppt es, sobald die Aktion vorbei ist.
    setLoop(name, active) {
        const sound = this.sounds[name];

        if (active && sound.paused) {
            this.play(name);
        } else if (!active && !sound.paused) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    // Gibt den Ton nach einer Eingabe wieder frei und holt bei Bedarf den Startsound nach.
    allowPlayback() {
        this.waitingForInput = false;
        if (!this.startPending) return;

        this.startPending = false;
        this.play('gameStart');
    }

    // Stoppt Lauf- und Schlafgeräusche, sobald die Runde endet.
    endRound() {
        this.startPending = false;
        this.setLoop('characterRun', false);
        this.setLoop('characterSnoring', false);
    }

    // Schaltet den Ton um und speichert die Einstellung für den nächsten Seitenaufruf.
    toggle() {
        this.muted = !this.muted;
        localStorage.setItem('el-pollo-loco-muted', String(this.muted));
        this.updateButton();

        // Stoppt alle gerade laufenden Geräusche, wenn der Ton ausgeschaltet wird.
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

    // Zeigt auf dem Button an, welche Aktion mit dem nächsten Klick ausgeführt wird.
    updateButton() {
        this.button.textContent = this.muted ? 'Ton einschalten' : 'Ton ausschalten';
    }
}

// Erstellt die Tonsteuerung für dieses Spiel.
const gameAudio = new GameAudio(document.getElementById('sound-toggle'));