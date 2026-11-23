/**
 * Basis für bewegliche Objekte wie Pepe, Hühner und Flaschen.
 */
class MovableObject extends DrawableObject {
    // Geschwindigkeit nach links oder rechts.
    speed = 0.15;

    // Bei true wird die Figur gespiegelt.
    otherDirection = false;

    // Positive Werte bewegen das Objekt nach oben.
    speedY = 0;

    // Veränderung der vertikalen Geschwindigkeit durch die Schwerkraft.
    acceleration = 2.5;

    energy = 100;
    lastHit = 0;

    /**
     * Lässt das Objekt durch die Schwerkraft steigen oder fallen.
     * @returns {number} Nummer des Timers, damit er gestoppt werden kann.
     */
    applyGravity() {
        return setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Prüft, ob das Objekt in der Luft ist.
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
     * Prüft die Zeit seit dem letzten Treffer.
     * @returns {boolean} Ob der letzte Treffer weniger als eine Sekunde her ist.
     */
    isHurt() {
        return Date.now() - this.lastHit < 1000;
    }

    /**
     * Prüft die verbleibenden Lebenspunkte.
     * @returns {boolean} Ob die Lebenspunkte auf null stehen.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Zeigt das nächste Bild der ausgewählten Animation.
     * @param {string[]} images - Dateipfade der Animationsbilder.
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
     * Startet einen Sprung mit einer Geschwindigkeit nach oben.
     */
    jump() {
        this.speedY = 30;
    }
}