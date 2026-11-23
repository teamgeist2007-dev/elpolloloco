/**
 * Verbindet die Spielrunde mit Zeichnung, Kollisionen und Gegenständen.
 */
class World {
    character = new Character();
    level = level1;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];
    gameFinished = false;
    paused = false;
    coins = 0;
    bottles = 0;

    /**
     * Verbindet die einzelnen Spielbereiche und startet die Runde.
     * @param {HTMLCanvasElement} canvas - Spielfläche.
     * @param {Keyboard} keyboard - Zustand der Spieltasten.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;

        this.renderer = new WorldRenderer(this.ctx);
        this.collisions = new WorldCollisions(this);
        this.items = new WorldItems(this);

        this.character.world = this;
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
     * Beendet die Runde und zeigt das passende Endbild.
     * @param {boolean} won - Ob der Spieler gewonnen hat.
     */
    finishGame(won) {
        if (this.gameFinished) return;

        this.stop();
        gameAudio.endRound();
        showGameResult(won);
    }

    /**
     * Berechnet Pepes Trefferfläche ohne die transparenten Bildränder.
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
     * Stoppt alle Bewegungen und Timer der alten Runde.
     */
    stop() {
        this.gameFinished = true;
        cancelAnimationFrame(this.animationFrame);
        this.character.stop();
        this.level.enemies.forEach((enemy) => enemy.stop());
        this.throwableObjects.forEach((bottle) => bottle.stop());
    }
}