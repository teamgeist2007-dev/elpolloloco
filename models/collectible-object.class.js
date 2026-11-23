/**
 * Beschreibt Münzen und Flaschen, die Pepe einsammeln kann.
 */
class CollectibleObject extends DrawableObject {
    width = 80;
    height = 80;

    /**
     * Lädt das Bild und setzt den Gegenstand an seine Position.
     * @param {string} imagePath - Bild der Münze oder Flasche.
     * @param {number} x - Waagerechte Position.
     * @param {number} y - Senkrechte Position.
     */
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
    }
}