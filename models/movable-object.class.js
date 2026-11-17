// Basis für bewegliche Objekte wie Pepe, Hühner und geworfene Flaschen.
class MovableObject extends DrawableObject {
    // Wie weit sich das Objekt bei einer Bewegung nach links oder rechts verschiebt.
    speed = 0.15;
    // Wenn der Wert true ist, wird das Bild beim Zeichnen gespiegelt.
    otherDirection = false;
    // Vertikale Geschwindigkeit. Ein positiver Wert bewegt das Objekt nach oben.
    speedY = 0;
    // Um diesen Wert ändert sich die vertikale Geschwindigkeit durch die Schwerkraft.
    acceleration = 2.5;
    // Lebenspunkte des Objekts.
    energy = 100;
    // Zeitpunkt des letzten Treffers, in Millisekunden.
    lastHit = 0;

    // Lässt das Objekt regelmäßig steigen oder fallen und gibt den Timer zurück.
    applyGravity() {
        return setInterval(() => {
            // Die Schwerkraft wirkt in der Luft und während des Starts eines Sprungs.
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    // Prüft, ob das Objekt über dem Boden ist. Geworfene Flaschen fallen weiter, bis die Spielwelt sie entfernt.
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }

        return this.y < 180;
    }

    // Zieht Schaden von den Lebenspunkten ab und merkt sich den Trefferzeitpunkt.
    hit(damage = 5) {
        this.energy -= damage;

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    // Prüft, ob der letzte Treffer weniger als eine Sekunde her ist.
    isHurt() {
        return Date.now() - this.lastHit < 1000;
    }

    // Prüft, ob keine Lebenspunkte mehr übrig sind.
    isDead() {
        return this.energy == 0;
    }

    // Zeigt das nächste Bild der Animation. Nach dem letzten Bild geht es wieder beim ersten los.
    playAnimation(images) {
        const index = this.currentImage % images.length;
        const path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    // Bewegt das Objekt nach rechts.
    moveRight() {
        this.x += this.speed;
    }

    // Bewegt das Objekt nach links.
    moveLeft() {
        this.x -= this.speed;
    }

    // Gibt dem Objekt eine Geschwindigkeit nach oben und startet so den Sprung.
    jump() {
        this.speedY = 30;
    }
}