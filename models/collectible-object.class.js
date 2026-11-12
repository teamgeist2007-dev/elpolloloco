class CollectibleObject extends DrawableObject {
    width = 80;
    height = 80;

    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
    }
}