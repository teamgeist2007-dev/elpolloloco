class ThrowableObject extends MovableObject {
    static image = new Image();

    static {
        this.image.src = 'img/7_statusbars/3_icons/icon_salsa_bottle.png';
    }

    height = 60;
    width = 50;

    constructor(x, y, direction = 1) {
        super();
        this.img = ThrowableObject.image;
        this.x = direction === -1 ? x - this.width : x;
        this.y = y;
        this.direction = direction;
        this.trow();
    }

    trow() {
        this.speedY = 30;

        this.gravityInterval = setInterval(() => {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }, 1000 / 25);

        this.moveInterval = setInterval(() => {
            this.x += 10 * this.direction;
        }, 25);
    }

    stop() {
        clearInterval(this.gravityInterval);
        clearInterval(this.moveInterval);
    }
}