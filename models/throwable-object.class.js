class ThrowableObject extends MovableObject {
    constructor() {
        super().loadImage('img/7_statusbars/3_icons/icon_salsa_bottle.png');
        this.x = 100;
        this.y = 100;
        this.height = 60;
        this.width = 50;
        this.trow(100, 150);
    }

    trow(x, y) {
        this.x = x;
        this.y = y;
        this.speedY = 30;
        this.applyGravity();

        setInterval(() => {
            this.x += 10;
        }, 50);
    }
}