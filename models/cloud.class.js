// Eine Wolke ist ein Bild an einer festen Position im Level.
class Cloud extends DrawableObject {
    // Größe der Wolke beim Zeichnen.
    width = 500;
    height = 250;

    // Lädt das Wolkenbild und merkt sich die Position, die im Level angegeben ist.
    constructor(x, y) {
        super();
        this.loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = x;
        this.y = y;
    }
}