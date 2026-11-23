/**
 * Beschreibt eine Flasche, die Pepe geworfen hat.
 */
class ThrowableObject extends MovableObject {
    // Alle Flaschen verwenden dasselbe vorgeladene Bild.
    static image = new Image();

    static {
        this.image.src = 'img/7_statusbars/3_icons/icon_salsa_bottle.png';
    }

    height = 60;
    width = 50;

    /**
     * Setzt die Flasche neben Pepe und startet den Flug.
     * @param {number} x - Startkante neben Pepe.
     * @param {number} y - Starthöhe der Flasche.
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
     * Startet die Schwerkraft und die seitliche Bewegung der Flasche.
     */
    startThrow() {
        this.speedY = 30;
        this.gravityInterval = this.applyGravity();

        this.moveInterval = setInterval(() => {
            this.x += 10 * this.direction;
        }, 25);
    }

    /**
     * Stoppt die Bewegung und Schwerkraft der Flasche.
     */
    stop() {
        clearInterval(this.gravityInterval);
        clearInterval(this.moveInterval);
    }
}