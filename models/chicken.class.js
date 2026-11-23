/**
 * Erstellt ein normales oder ein kleines Huhn.
 */
class Chicken extends MovableObject {
    /**
     * Legt Bilder, Größe und Startposition fest.
     * @param {number} [x] - Startposition oder eine zufällige Position.
     * @param {boolean} [small=false] - Ob ein kleines Huhn erstellt wird.
     */
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

    /**
     * Bewegt und animiert das Huhn, solange das Spiel läuft.
     */
    animate() {
        this.moveInterval = setInterval(() => {
            if (!world?.paused && !world?.gameFinished) this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (!world?.paused && !world?.gameFinished) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Stoppt beide Timer, wenn das Huhn besiegt oder die Runde beendet ist.
     */
    stop() {
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}