/**
 * Pepe ist die vom Spieler gesteuerte Figur.
 */
class Character extends MovableObject {
    height = 250;
    y = 80;
    speed = 10;
    lastActiveAt = performance.now();
    isSleeping = false;
    world;

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

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

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

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

        this.gravityInterval = this.applyGravity();
        this.animate();
    }

    /**
     * Zieht Leben ab und verhindert Treffer direkt hintereinander.
     * @param {number} [damage=5] - Schaden durch den Gegner.
     * @returns {boolean} Ob der Treffer Leben abgezogen hat.
     */
    hit(damage = 5) {
        const now = Date.now();
        const hitInterval = damage === 5 ? 500 : 1000;

        if (this.isDead() || now - this.lastHit < hitInterval) return false;

        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = now;
        this.lastActiveAt = performance.now();
        this.isSleeping = false;
        return true;
    }

    /**
     * Startet getrennte Timer für Bewegung und Bilder.
     */
    animate() {
        this.moveInterval = setInterval(() => this.updateMovement(), 1000 / 60);
        this.animationInterval = setInterval(() => this.updateAnimation(), 50);
    }

    /**
     * Bewegt Pepe und führt die Kamera nach.
     */
    updateMovement() {
        if (!this.world || this.world.gameFinished || this.world.paused) return;

        this.moveCharacter();
        this.updateIdleTime();
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Verarbeitet die Tasten zum Laufen und Springen.
     */
    moveCharacter() {
        const { keyboard, level } = this.world;

        if (keyboard.RIGHT && this.x < level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }

        if (keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }

        if (keyboard.SPACE && !this.isAboveGround()) this.jump();
    }

    /**
     * Setzt bei Bewegung die Wartezeit fürs Einschlafen zurück.
     */
    updateIdleTime() {
        const { LEFT, RIGHT } = this.world.keyboard;

        if (LEFT || RIGHT || this.isAboveGround() || this.speedY > 0) {
            this.lastActiveAt = performance.now();
            this.isSleeping = false;
        }
    }

    /**
     * Wählt die passende Animation für Pepes Zustand.
     */
    updateAnimation() {
        if (!this.world || this.world.gameFinished || this.world.paused) return;

        this.isSleeping = false;

        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (Date.now() - this.lastHit < 250) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround() || this.speedY > 0) {
            this.showJumpImage();
        } else {
            this.showGroundAnimation();
        }
    }

    /**
     * Ordnet dem Aufsteigen und Fallen einmalig die neun Sprungbilder zu.
     */
    showJumpImage() {
        const progress = (30 - this.speedY) / 60;
        const index = Math.max(0, Math.min(8, Math.floor(progress * 9)));
        this.img = this.imageCache[this.IMAGES_JUMPING[index]];
    }

    /**
     * Zeigt am Boden Laufen, Schlafen oder die normale Standpose.
     */
    showGroundAnimation() {
        const { LEFT, RIGHT } = this.world.keyboard;

        if (LEFT || RIGHT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (performance.now() - this.lastActiveAt >= 5000) {
            this.playAnimation(this.IMAGES_SLEEPING);
            this.isSleeping = true;
        } else {
            this.img = this.standingImage;
        }
    }

    /**
     * Beendet alle Timer von Pepe vor dem Neustart.
     */
    stop() {
        clearInterval(this.gravityInterval);
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}