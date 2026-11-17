// Eine Hintergrundebene, zum Beispiel der Himmel oder die Landschaft.
class BackgroundObject extends MovableObject {
    // Eine Hintergrundkachel ist so breit und hoch wie das Spielfeld.
    width = 720;
    height = 480;

    // Lädt das Bild und setzt die Kachel an ihre Position im Level.
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}