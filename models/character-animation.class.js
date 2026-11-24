/**
 * Lädt Pepes Bilder und wählt die passende Animation aus.
 */
class CharacterAnimation {
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
     * Verbindet die Animation mit Pepe und lädt seine Bilder.
     * @param {Character} character - Zugehörige Spielfigur.
     */
    constructor(character) {
        this.character = character;
        character.loadImages(this.IMAGES_WALKING);
        character.loadImages(this.IMAGES_JUMPING);
        character.loadImages(this.IMAGES_DEAD);
        character.loadImages(this.IMAGES_HURT);
        character.loadImages(this.IMAGES_SLEEPING);
    }

    /**
     * Startet den regelmäßigen Bildwechsel.
     */
    start() {
        this.interval = setInterval(() => this.updateAnimation(), 50);
    }

    /**
     * Wählt die passende Animation für Pepes aktuellen Zustand.
     */
    updateAnimation() {
        const character = this.character;

        if (!character.world ||
            character.world.gameFinished ||
            character.world.paused) return;

        character.isSleeping = false;

        if (character.isDead()) {
            character.playAnimation(this.IMAGES_DEAD);
        } else if (Date.now() - character.lastHit < 250) {
            character.playAnimation(this.IMAGES_HURT);
        } else if (character.isAboveGround() || character.speedY > 0) {
            this.showJumpImage();
        } else {
            this.showGroundAnimation();
        }
    }

    /**
     * Ordnet dem Aufsteigen und Fallen einmalig die neun Sprungbilder zu.
     */
    showJumpImage() {
        const character = this.character;
        const progress = (30 - character.speedY) / 60;
        const index = Math.max(0, Math.min(8, Math.floor(progress * 9)));

        character.img = character.imageCache[this.IMAGES_JUMPING[index]];
    }

    /**
     * Zeigt am Boden Laufen, Schlafen oder die normale Standpose.
     */
    showGroundAnimation() {
        const character = this.character;
        const { LEFT, RIGHT } = character.world.keyboard;

        if (LEFT || RIGHT) {
            character.playAnimation(this.IMAGES_WALKING);
        } else if (performance.now() - character.lastActiveAt >= 5000) {
            character.playAnimation(this.IMAGES_SLEEPING);
            character.isSleeping = true;
        } else {
            character.img = character.standingImage;
        }
    }

    /**
     * Beendet den Bildwechsel beim Ende der Runde.
     */
    stop() {
        clearInterval(this.interval);
    }
}