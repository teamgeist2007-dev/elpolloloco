// Basis für alle Objekte, die auf dem Spielfeld gezeichnet werden.
class DrawableObject {
    // Das Bild, das gerade angezeigt wird.
    img;
    // Hier werden geladene Bilder für die Animationen gespeichert.
    imageCache = {};
    // Zählt mit, welches Bild in einer Animation als Nächstes dran ist.
    currentImage = 0;
    // Startposition und Größe. Die einzelnen Klassen können diese Werte überschreiben.
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    // Lädt ein einzelnes Bild, zum Beispiel Pepes Standbild.
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    // Zeichnet das aktuelle Bild an der Position und in der Größe des Objekts.
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    // Lädt mehrere Bilder vor und speichert sie unter ihrem Dateipfad.
    loadImages(paths) {
        for (const path of paths) {
            const image = new Image();
            image.src = path;
            this.imageCache[path] = image;
        }
    }
}