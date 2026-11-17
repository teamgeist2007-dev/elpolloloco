// Baut ein normales oder ein kleines Huhn.
class Chicken extends MovableObject {
    // Wählt die Bilder, Größe und Startposition und startet die Animation.
    constructor(x, small = false) {
        super();

        // Die kleinen und großen Hühner haben unterschiedliche Bildordner.
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
        // Jedes Huhn bekommt eine leicht unterschiedliche Laufgeschwindigkeit.
        this.speed = 0.15 + Math.random() * 0.5;

        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    // Lässt das Huhn nach links laufen und wechselt regelmäßig sein Bild.
    animate() {
        // Dieser Timer bewegt das Huhn nach links.
        this.moveInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        // Dieser Timer wechselt das Bild für die Laufanimation.
        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    // Stoppt beide Timer, wenn das Huhn besiegt ist.
    stop() {
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}