/**
 * Verwaltet Pepes Bewegung, Sprünge und Lebenspunkte.
 */
class Character extends MovableObject {
    height = 250;
    y = 80;
    speed = 10;
    lastActiveAt = performance.now();
    isSleeping = false;
    world;

    /**
     * Lädt das Standbild und startet Animation, Schwerkraft und Bewegung.
     */
    constructor() {
        super();
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.standingImage = this.img;

        this.animation = new CharacterAnimation(this);
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
     * Startet die Bewegung und den getrennten Bildwechsel.
     */
    animate() {
        this.moveInterval = setInterval(() => this.updateMovement(), 1000 / 60);
        this.animation.start();
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
     * Beendet alle Timer von Pepe beim Ende der Runde.
     */
    stop() {
        clearInterval(this.gravityInterval);
        clearInterval(this.moveInterval);
        this.animation.stop();
    }
}