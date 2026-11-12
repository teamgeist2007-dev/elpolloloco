class Chicken extends MovableObject {
    constructor(x, small = false) {
        super();

        const folder = small ? 'chicken_small' : 'chicken_normal';
        const path = `img/3_enemies_chicken/${folder}/1_walk`;

        this.IMAGES_WALKING = [
            `${path}/1_w.png`,
            `${path}/2_w.png`,
            `${path}/3_w.png`
        ];

        this.height = small ? 38 : 55;
        this.width = small ? 45 : 70;
        this.y = small ? 377 : 360;
        this.x = x ?? 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;

        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
        this.moveInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    stop() {
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}