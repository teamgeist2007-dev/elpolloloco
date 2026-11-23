/**
 * Beschreibt Pepe, die vom Spieler gesteuerte Figur.
 */
class Character extends MovableObject {
    height = 250;
    y = 80;
    speed = 10;

    // Zeitpunkt der letzten Bewegung oder eines Treffers.
    lastActiveAt = performance.now();
    isSleeping = false;

    // Bilder für Pepes Laufanimation.
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    // Bilder für Pepes Sprung.
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    // Bilder für Pepes Niederlage.
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    // Bilder für die Trefferanimation.
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    // Bilder für Pepes Schlafanimation.
    IMAGES_SLEEPING = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    world;

    /**
     * Lädt die Bilder und startet Schwerkraft, Bewegung und Animation.
     */
    constructor() {
        super();
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.standingImage = this.img;

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_SLEEPING);
        this.applyGravity();
        this.animate();
    }

    /**
     * Zieht bei einem gültigen Treffer Leben ab und weckt Pepe.
     * @param {number} [damage=5] - Schaden durch den Gegner.
     * @returns {boolean} Ob der Treffer tatsächlich Leben abgezogen hat.
     */
    hit(damage = 5) {
        const now = Date.now();

        // Hühner treffen alle 500 ms, der Endboss alle 1000 ms.
        const hitInterval = damage === 5 ? 500 : 1000;

        if (this.isDead() || now - this.lastHit < hitInterval) return false;

        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = now;
        this.lastActiveAt = performance.now();
        this.isSleeping = false;
        return true;
    }

    /**
     * Steuert Pepes Bewegung und wählt die passende Animation aus.
     */
    animate() {
        // Dieser Timer verarbeitet die gedrückten Spieltasten.
        setInterval(() => {
            const { keyboard, level } = this.world;

            if (keyboard.RIGHT && this.x < level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }

            if (keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }

            if (keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }

            // Bewegung startet die Wartezeit fürs Einschlafen neu.
            if (keyboard.LEFT || keyboard.RIGHT || this.isAboveGround() || this.speedY > 0) {
                this.lastActiveAt = performance.now();
                this.isSleeping = false;
            }

            // Die Kamera folgt Pepe.
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        // Dieser Timer wählt Pepes aktuelles Bild.
        setInterval(() => {
            const { keyboard } = this.world;
            this.isSleeping = false;

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (Date.now() - this.lastHit < 250) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround() || this.speedY > 0) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (keyboard.RIGHT || keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            } else if (performance.now() - this.lastActiveAt >= 5000) {
                this.playAnimation(this.IMAGES_SLEEPING);
                this.isSleeping = true;
            } else {
                this.img = this.standingImage;
            }
        }, 50);
    }
}