/**
 * Verwaltet das Einsammeln und Werfen von Gegenständen.
 */
class WorldItems {
    nextThrowAt = 0;

    /**
     * Verbindet die Gegenstände mit der Spielwelt.
     * @param {World} world - Zugehörige Spielrunde.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Wirft eine verfügbare Flasche in Pepes Blickrichtung.
     */
    checkThrowObjects() {
        if (this.world.bottles === 0) {
            this.world.keyboard.takeThrow();
            return;
        }

        const image = ThrowableObject.image;
        if (!image.complete || image.naturalWidth === 0) return;

        const now = performance.now();
        const pressed = this.world.keyboard.takeThrow();

        if (!pressed && (!this.world.keyboard.D || now < this.nextThrowAt)) return;

        const pepe = this.world.character;
        let direction = 1;
        let x = pepe.x + pepe.width;

        if (pepe.otherDirection) {
            direction = -1;
            x = pepe.x;
        }

        const bottle = new ThrowableObject(x, pepe.y + 100, direction);

        this.world.throwableObjects.push(bottle);
        this.world.bottles--;
        this.nextThrowAt = now + 200;
    }

    /**
     * Entfernt eingesammelte Gegenstände und erhöht ihre Zähler.
     */
    collectItems() {
        this.world.level.coins = this.world.level.coins.filter((coin) => {
            if (!this.touchesCollectible(coin)) return true;

            this.world.coins++;
            gameAudio.play('coinCollect');
            return false;
        });

        this.world.level.bottles = this.world.level.bottles.filter((bottle) => {
            if (!this.touchesCollectible(bottle)) return true;

            this.world.bottles++;
            gameAudio.play('bottleCollect');
            return false;
        });
    }

    /**
     * Prüft, ob Pepe eine Münze oder Flasche berührt.
     * @param {CollectibleObject} item - Geprüfter Gegenstand.
     * @returns {boolean} Ob Pepe den Gegenstand einsammelt.
     */
    touchesCollectible(item) {
        const character = this.world.character;

        return character.x + character.width - 12 > item.x + 20 &&
            character.x + 12 < item.x + item.width - 20 &&
            character.y + character.height > item.y + 20 &&
            character.y + 100 < item.y + item.height - 12;
    }
}