// Beschreibt eine Flasche, die Pepe geworfen hat.
class ThrowableObject extends MovableObject {
    // Alle geworfenen Flaschen verwenden dasselbe vorgeladene Bild.
    static image = new Image();

    static {
        this.image.src = 'img/7_statusbars/3_icons/icon_salsa_bottle.png';
    }

    // Größe der Flasche beim Zeichnen.
    height = 60;
    width = 50;

    // Setzt die Startposition links oder rechts von Pepe und startet den Flug.
    constructor(x, y, direction = 1) {
        super();
        this.img = ThrowableObject.image;
        // Bei einem Wurf nach links beginnt das ganze Flaschenbild links von Pepe.
        this.x = direction === -1 ? x - this.width : x;
        this.y = y;
        this.direction = direction;
        this.startThrow();
    }

    // Startet die Schwerkraft und bewegt die Flasche in Wurfrichtung.
    startThrow() {
        this.speedY = 30;
        this.gravityInterval = this.applyGravity();

        // Dieser Timer verschiebt die Flasche in ihrer Flugrichtung von links nach rechts oder umgekehrt.
        this.moveInterval = setInterval(() => {
            this.x += 10 * this.direction;
        }, 25);
    }

    // Stoppt den Flug, nachdem die Flasche getroffen hat oder aus dem Spielfeld gefallen ist.
    stop() {
        clearInterval(this.gravityInterval);
        clearInterval(this.moveInterval);
    }
}