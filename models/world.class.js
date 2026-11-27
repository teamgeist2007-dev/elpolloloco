/**
 * Verbindet die Spielrunde mit Zeichnung, Kollisionen und Gegenständen.
 */
class World {
    character = new Character();
    level;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];
    gameFinished = false;
    paused = false;
    coins = 0;
    bottles = 0;

    /**
     * Startet die Spielwelt und übernimmt gegebenenfalls bisherige Werte.
     * @param {HTMLCanvasElement} canvas - Spielfläche.
     * @param {Keyboard} keyboard - Zustand der Spieltasten.
     * @param {Level} level - Aufbau des aktuellen Levels.
     * @param {{energy: number, coins: number, bottles: number}|null} [progress=null] - Mitgenommene Werte.
     */
    constructor(canvas, keyboard, level, progress = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.level = level;

        this.renderer = new WorldRenderer(this.ctx);
        this.collisions = new WorldCollisions(this);
        this.items = new WorldItems(this);
        this.character.world = this;

        if (progress) {
            this.character.energy = progress.energy;
            this.coins = progress.coins;
            this.bottles = progress.bottles;
        }

        this.statusBar.setPercentage(this.character.energy);
        gameAudio.startRound(this);
        this.draw();
    }

    /**
     * Prüft die Spielregeln und zeichnet das nächste Spielbild.
     */
    draw() {
        if (this.gameFinished) return;

        this.animationFrame = requestAnimationFrame(() => this.draw());
        if (this.paused) return;

        this.collisions.checkCollisions();
        if (this.gameFinished) return;

        this.items.collectItems();
        this.collisions.checkBottleCollisions();
        if (this.gameFinished) return;

        this.items.checkThrowObjects();
        gameAudio.update(this);
        this.renderer.draw(this);
    }

    /**
     * Beendet die Runde und öffnet das folgende Bild.
     * @param {boolean} won - Ob der Endboss besiegt wurde.
     */
    finishGame(won) {
        if (this.gameFinished) return;

        this.stop();
        gameAudio.endRound();
        showGameResult(won);
    }

    /**
     * Berechnet Pepes Trefferfläche ohne transparente Bildränder.
     * @returns {{left: number, right: number, top: number, bottom: number}} Trefferfläche.
     */
    getCharacterHitbox() {
        const { x, y, width, height } = this.character;

        return {
            left: x + width * 0.22,
            right: x + width * 0.78,
            top: y + height * 0.4,
            bottom: y + height * 0.95
        };
    }

    /**
     * Berechnet die Trefferfläche eines Gegners.
     * @param {MovableObject} enemy - Geprüfter Gegner.
     * @returns {{left: number, right: number, top: number, bottom: number}} Trefferfläche.
     */
    getEnemyHitbox(enemy) {
        const { x, y, width, height } = enemy;
        const isEndboss = enemy instanceof Endboss;

        return {
            left: x + width * 0.15,
            right: x + width * 0.85,
            top: y + height * (isEndboss ? 0.2 : 0.1),
            bottom: y + height * (isEndboss ? 0.96 : 0.92)
        };
    }

    /**
     * Beendet alle Bewegungen und Timer der alten Runde.
     */
    stop() {
        this.gameFinished = true;
        cancelAnimationFrame(this.animationFrame);
        this.character.stop();
        this.level.enemies.forEach((enemy) => enemy.stop());
        this.throwableObjects.forEach((bottle) => bottle.stop());
    }
}