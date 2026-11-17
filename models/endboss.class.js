// Hier stehen Bewegung, Treffer und Lebensanzeige des Endgegners.
class Endboss extends MovableObject {
    // Position und Größe des Endbosses am Ende des Levels.
    x = 2600;
    y = -35;
    width = 300;
    height = 500;
    speed = 3;
    // Wird true, sobald Pepe nahe genug am Endboss ist.
    isChasing = false;

    // Bilder für die Animation des Endbosses.
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    // Je nach Lebenspunkten wird ein anderes Bild für die orange Anzeige benutzt.
    IMAGES_HEALTH = [0, 20, 40, 60, 80, 100].map((energy) =>
        `img/7_statusbars/2_statusbar_endboss/orange/orange${energy}.png`
    );

    // Lädt die Bilder und startet die Timer des Endbosses.
    constructor() {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HEALTH);
        this.img = this.imageCache[this.IMAGES_WALKING[0]];
        this.animate();
    }

    // Lässt den Endboss regelmäßig nach Pepe suchen und seine Animation abspielen.
    animate() {
        this.moveInterval = setInterval(() => {
            this.followCharacter();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (this.isChasing && !world?.gameFinished) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }

    // Verfolgt Pepe, sobald er nahe genug ist, und läuft bis zum Kontakt.
    followCharacter() {
        if (!world || world.gameFinished || this.isDead()) return;

        // Diese Rechtecke geben an, wo Pepe und der Endboss sich berühren können.
        const pepe = world.getCharacterHitbox();
        const boss = world.getEnemyHitbox(this);
        const distance = (pepe.left + pepe.right - boss.left - boss.right) / 2;

        // Sobald Pepe höchstens 500 Pixel entfernt ist, beginnt die Verfolgung.
        if (Math.abs(distance) <= 500) this.isChasing = true;
        if (!this.isChasing) return;

        this.otherDirection = distance > 0;

        // Die Lücke zwischen den Figuren bestimmt, wie weit der Endboss noch laufen muss.
        const gap = distance < 0 ? boss.left - pepe.right : pepe.left - boss.right;

        if (gap >= 0) {
            this.x += Math.sign(distance) * Math.min(this.speed, gap + 1);
        }
    }

    // Zieht dem Endboss bei einem Flaschentreffer Lebenspunkte ab.
    hit(damage = 20) {
        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();
    }

    // Zeichnet die Lebensanzeige des Endbosses oben rechts.
    drawHealthBar(ctx) {
        const index = Math.ceil(this.energy / 20);
        const image = this.imageCache[this.IMAGES_HEALTH[index]];

        if (image.complete && image.naturalWidth > 0) {
            ctx.drawImage(image, 515, 6, 180, 48);
        }
    }

    // Beendet die Bewegungs- und Animations-Timer des Endbosses.
    stop() {
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}