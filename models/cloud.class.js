/**
 * Beschreibt eine Wolke an einer festen Position im Level.
 */
class Cloud extends DrawableObject {
    width = 500;
    height = 250;

    /**
     * Lädt das Wolkenbild und setzt seine Position.
     * @param {number} x - Waagerechte Position.
     * @param {number} y - Senkrechte Position.
     */
    constructor(x, y) {
        super();
        this.loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = x;
        this.y = y;
    }
}