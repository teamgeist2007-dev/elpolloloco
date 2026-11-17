// So werden Münzen und Flaschen dargestellt, die Pepe einsammeln kann.
class CollectibleObject extends DrawableObject {
    // Größe eines Sammelobjekts auf dem Spielfeld.
    width = 80;
    height = 80;

    // Lädt das Bild der Münze oder Flasche und setzt das Objekt an seine Position.
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
    }
}