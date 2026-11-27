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
     * Entfernt eingesammelte Münzen und Flaschen und erhöht ihre Zähler.
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

        this.collectChips();
    }

    /**
     * Heilt Pepe um fünf Prozentpunkte und entfernt eingesammelte Chips.
     */
    collectChips() {
        this.world.level.chips = this.world.level.chips.filter((chip) => {
            if (!this.touchesCollectible(chip)) return true;

            const character = this.world.character;
            character.energy = Math.min(100, character.energy + 5);

            this.world.statusBar.setPercentage(character.energy);
            gameAudio.play('coinCollect');
            return false;
        });
    }

    /**
     * Prüft die Berührung passend zur Größe des Gegenstands.
     * @param {CollectibleObject} item - Münze, Flasche oder Chip.
     * @returns {boolean} Ob Pepe den Gegenstand einsammelt.
     */
    touchesCollectible(item) {
        const character = this.world.character;
        const side = Math.min(20, item.width / 4);
        const top = Math.min(20, item.height / 4);
        const bottom = Math.min(12, item.height / 4);

        return character.x + character.width - 12 > item.x + side &&
            character.x + 12 < item.x + item.width - side &&
            character.y + character.height > item.y + top &&
            character.y + 100 < item.y + item.height - bottom;
    }
}