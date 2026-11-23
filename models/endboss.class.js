/**
 * Verwaltet Bewegung, Animation und Lebensanzeige des Endbosses.
 */
class Endboss extends MovableObject {
    x = 2600;
    y = -35;
    width = 300;
    height = 500;
    speed = 3;
    isChasing = false;
    isMoving = false;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_HEALTH = [0, 20, 40, 60, 80, 100].map((energy) =>
        `img/7_statusbars/2_statusbar_endboss/orange/orange${energy}.png`
    );

    /**
     * Lädt die Bilder und startet die Timer.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_HEALTH);
        this.img = this.imageCache[this.IMAGES_ALERT[0]];
        this.animate();
    }

    /**
     * Prüft regelmäßig Bewegung und Animation.
     */
    animate() {
        this.moveInterval = setInterval(() => {
            this.followCharacter();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => this.updateAnimation(), 150);
    }

    /**
     * Zeigt beim Laufen die Laufbilder und im Stand die Alarmbilder.
     */
    updateAnimation() {
        if (!world || world.gameFinished || world.paused || !this.isChasing) return;

        this.playAnimation(this.isMoving ? this.IMAGES_WALKING : this.IMAGES_ALERT);
    }

    /**
     * Verfolgt Pepe, sobald er nahe genug ist, und läuft bis zum Kontakt.
     */
    followCharacter() {
        this.isMoving = false;
        if (!world || world.gameFinished || world.paused || this.isDead()) return;

        const pepe = world.getCharacterHitbox();
        const boss = world.getEnemyHitbox(this);
        const distance = (pepe.left + pepe.right - boss.left - boss.right) / 2;

        if (Math.abs(distance) <= 500) this.isChasing = true;
        if (!this.isChasing) return;

        this.otherDirection = distance > 0;
        const gap = distance < 0 ? boss.left - pepe.right : pepe.left - boss.right;

        if (gap >= 0) {
            this.isMoving = true;
            this.x += Math.sign(distance) * Math.min(this.speed, gap + 1);
        }
    }

    /**
     * Zieht bei einem Flaschentreffer Lebenspunkte ab.
     * @param {number} [damage=20] - Schaden des Treffers.
     */
    hit(damage = 20) {
        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();
    }

    /**
     * Zeichnet die feste Lebensanzeige oben im Spielfeld.
     * @param {CanvasRenderingContext2D} ctx - Zeichenbereich.
     */
    drawHealthBar(ctx) {
        const index = Math.ceil(this.energy / 20);
        const image = this.imageCache[this.IMAGES_HEALTH[index]];

        if (image.complete && image.naturalWidth > 0) {
            ctx.drawImage(image, 442, 6, 166, 46);
        }
    }

    /**
     * Beendet die Bewegungs- und Animationstimer.
     */
    stop() {
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}