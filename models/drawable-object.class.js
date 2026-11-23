/**
 * Basis für alle Objekte, die auf dem Spielfeld gezeichnet werden.
 */
class DrawableObject {
    // Das Bild, das gerade angezeigt wird.
    img;

    // Speichert die vorgeladenen Bilder.
    imageCache = {};

    // Zählt die Bilder einer Animation.
    currentImage = 0;

    // Startposition und Größe des Objekts.
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    /**
     * Lädt ein einzelnes Bild.
     * @param {string} path - Dateipfad des Bildes.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Zeichnet das aktuelle Bild auf das Spielfeld.
     * @param {CanvasRenderingContext2D} ctx - Zeichenbereich des Spielfeldes.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Lädt mehrere Bilder vor und speichert sie unter ihrem Dateipfad.
     * @param {string[]} paths - Dateipfade der Animationsbilder.
     */
    loadImages(paths) {
        for (const path of paths) {
            const image = new Image();
            image.src = path;
            this.imageCache[path] = image;
        }
    }
}