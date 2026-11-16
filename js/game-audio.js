class GameAudio {
    constructor(button) {
        this.button = button;

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

        this.sounds = Object.fromEntries(
            Object.entries(paths).map(([name, path]) => [
                name,
                new Audio('audio/sounds/' + path)
            ])
        );

        this.sounds.characterRun.loop = true;
        this.sounds.characterSnoring.loop = true;

        this.muted = localStorage.getItem('el-pollo-loco-muted') === 'true';
        this.updateButton();

        button.addEventListener('click', () => {
            this.toggle();

            if (world && !world.gameFinished) {
                world.canvas.tabIndex = -1;
                world.canvas.focus({ preventScroll: true });
            }
        });

        button.addEventListener('keydown', (event) => {
            if (event.code === 'Space') event.stopPropagation();
        });

        window.addEventListener('keydown', () => this.allowPlayback());
        window.addEventListener('pointerup', () => this.allowPlayback());
    }

    startRound(world) {
        this.lastX = world.character.x;
        this.lastGroundStep = -Infinity;
        this.wasRising = false;
        this.bossSoundPlayed = false;
        this.play('gameStart');
    }

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

    setLoop(name, active) {
        const sound = this.sounds[name];

        if (active && sound.paused) {
            this.play(name);
        } else if (!active && !sound.paused) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    allowPlayback() {
        this.waitingForInput = false;
        if (!this.startPending) return;

        this.startPending = false;
        this.play('gameStart');
    }

    endRound() {
        this.startPending = false;
        this.setLoop('characterRun', false);
        this.setLoop('characterSnoring', false);
    }

    toggle() {
        this.muted = !this.muted;
        localStorage.setItem('el-pollo-loco-muted', String(this.muted));
        this.updateButton();

        if (this.muted) {
            this.startPending = false;

            Object.values(this.sounds).forEach((sound) => {
                sound.pause();
                sound.currentTime = 0;
            });
        } else {
            this.allowPlayback();
        }
    }

    updateButton() {
        this.button.textContent = this.muted ? 'Ton einschalten' : 'Ton ausschalten';
    }
}

const gameAudio = new GameAudio(document.getElementById('sound-toggle'));