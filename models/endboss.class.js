class Endboss extends MovableObject {
    height = 500;
    width = 300;
    y = -35;
    speed = 3;

    isChasing = false;
    moving = false;
    moveInterval;
    animationInterval;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_HEALTH = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];

    constructor() {
        super().loadImage('img/4_enemie_boss_chicken/2_alert/G5.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HEALTH);
        this.x = 2600;
    }

    drawHealthBar(ctx) {
        const index = Math.ceil(this.energy / 20);
        const image = this.imageCache[this.IMAGES_HEALTH[index]];
        if (!image.complete || image.naturalWidth === 0) return;

        ctx.drawImage(image, ctx.canvas.width - 204, 6, 180, 48);
    }

    followCharacter(character) {
        this.moveInterval = setInterval(() => {
            this.moveTowardsCharacter(character);
        }, 1000 / 60);

        this.animate();
    }

    moveTowardsCharacter(character) {
        this.moving = false;
        if (this.isDead() || character.isDead()) return;

        const distance = character.x + character.width / 2 -
            (this.x + this.width / 2);

        if (!this.isChasing && Math.abs(distance) > 550) return;
        this.isChasing = true;

        if (Math.abs(distance) <= 180) return;
        this.moving = true;
        this.otherDiretion = distance > 0;

        if (this.otherDiretion) this.moveRight();
        else this.moveLeft();
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (this.moving) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }

    stop() {
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}