/**
 * Basisklasse für bewegliche Spielfiguren und Flaschen.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    /**
     * Startet die Schwerkraft und berücksichtigt die Spielpause.
     * @returns {number} Nummer des Timers.
     */
    applyGravity() {
        return setInterval(() => {
            if (world?.paused) return;

            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Prüft, ob sich das Objekt in der Luft befindet.
     * @returns {boolean} Ob die Schwerkraft weiter wirken soll.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }

        return this.y < 180;
    }

    /**
     * Zieht Lebenspunkte ab und merkt sich den Trefferzeitpunkt.
     * @param {number} [damage=5] - Abzuziehende Lebenspunkte.
     */
    hit(damage = 5) {
        this.energy -= damage;

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Prüft, ob der letzte Treffer weniger als eine Sekunde her ist.
     * @returns {boolean} Ob das Objekt gerade getroffen wurde.
     */
    isHurt() {
        return Date.now() - this.lastHit < 1000;
    }

    /**
     * Prüft, ob keine Lebenspunkte mehr übrig sind.
     * @returns {boolean} Ob das Objekt besiegt ist.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Zeigt das nächste Bild einer wiederholten Animation.
     * @param {string[]} images - Bilder der Animation.
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;
        const path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Bewegt das Objekt nach rechts.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Bewegt das Objekt nach links.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Startet den Sprung mit einer Geschwindigkeit nach oben.
     */
    jump() {
        this.speedY = 30;
    }
}