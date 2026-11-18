// Das ist Pepe, die Figur, die du steuerst.
class Character extends MovableObject {
    // Größe, Starthöhe und Lauftempo von Pepe.
    height = 250;
    y = 80;
    speed = 10;
    // Diese Zeit hilft dabei zu erkennen, wann Pepe lange genug stillsteht und einschläft.
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

    // Bilder für die kurze Trefferanimation.
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    // Bilder für die Schlafanimation mit geschlossenen Augen.
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

    // Hier merkt sich Pepe seine Spielwelt, damit er auf Steuerung und Kamera zugreifen kann.
    world;

    // Lädt Pepes Bilder, startet die Schwerkraft und schaltet die Steuerung ein.
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

    // Zieht Leben ab und weckt Pepe. Der Trefferschutz verhindert mehrere Treffer direkt hintereinander.
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

    // Steuert Pepes Bewegung und wählt regelmäßig das passende Bild aus.
    animate() {
        // Dieser Timer bewegt Pepe entsprechend den gedrückten Tasten.
        setInterval(() => {
            const { keyboard, level } = this.world;

            // Pepe läuft bis zur rechten Grenze des Levels und schaut nach rechts.
            if (keyboard.RIGHT && this.x < level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }

            // Pepe läuft nach links und dreht sich in Laufrichtung.
            if (keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }

            // Mit der Leertaste kann Pepe springen, wenn er am Boden ist.
            if (keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }

            // Beim Laufen oder Springen beginnt die Wartezeit fürs Einschlafen von vorne.
            if (keyboard.LEFT || keyboard.RIGHT || this.isAboveGround() || this.speedY > 0) {
                this.lastActiveAt = performance.now();
                this.isSleeping = false;
            }

            // Die Kamera folgt Pepe und hält ihn links im sichtbaren Spielfeld.
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        // Dieser Timer entscheidet, ob Pepe steht, läuft, springt, getroffen wurde oder schläft.
        setInterval(() => {
            const { keyboard } = this.world;
            this.isSleeping = false;

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            // Die Trefferpose wird für ungefähr eine Viertelsekunde angezeigt.
            } else if (Date.now() - this.lastHit < 250) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround() || this.speedY > 0) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (keyboard.RIGHT || keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            // Nach fünf Sekunden Stillstand spielt die Schlafanimation.
            } else if (performance.now() - this.lastActiveAt >= 5000) {
                this.playAnimation(this.IMAGES_SLEEPING);
                this.isSleeping = true;
            } else {
                this.img = this.standingImage;
            }
        }, 50);
    }
}