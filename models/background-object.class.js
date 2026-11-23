/**
 * Beschreibt eine Hintergrundebene, zum Beispiel Himmel oder Landschaft.
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Lädt ein Hintergrundbild und setzt es an seine Position.
     * @param {string} imagePath - Dateipfad des Hintergrundbildes.
     * @param {number} x - Position im Level.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}