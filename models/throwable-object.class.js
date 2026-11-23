/**
 * Beschreibt eine geworfene Flasche.
 */
class ThrowableObject extends MovableObject {
    static image = new Image();

    static {
        this.image.src = 'img/7_statusbars/3_icons/icon_salsa_bottle.png';
    }

    height = 60;
    width = 50;

    /**
     * Setzt die Startposition und startet den Flug.
     * @param {number} x - Startkante neben Pepe.
     * @param {number} y - Starthöhe.
     * @param {number} [direction=1] - 1 für rechts, -1 für links.
     */
    constructor(x, y, direction = 1) {
        super();
        this.img = ThrowableObject.image;
        this.x = direction === -1 ? x - this.width : x;
        this.y = y;
        this.direction = direction;
        this.startThrow();
    }

    /**
     * Startet Schwerkraft und Bewegung in Wurfrichtung.
     */
    startThrow() {
        this.speedY = 30;
        this.gravityInterval = this.applyGravity();

        this.moveInterval = setInterval(() => {
            if (!world?.paused) this.x += 10 * this.direction;
        }, 25);
    }

    /**
     * Stoppt beide Timer der Flasche.
     */
    stop() {
        clearInterval(this.gravityInterval);
        clearInterval(this.moveInterval);
    }
}