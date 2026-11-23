/**
 * Speichert die Objekte, die zu einem Level gehören.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;

    // Rechte Grenze für Pepes Bewegung.
    level_end_x = 2250;

    /**
     * Übernimmt Gegner, Landschaft und Sammelobjekte.
     * @param {MovableObject[]} enemies - Hühner und Endboss.
     * @param {Cloud[]} clouds - Wolken des Levels.
     * @param {BackgroundObject[]} backgroundObjects - Ebenen der Landschaft.
     * @param {CollectibleObject[]} [coins=[]] - Münzen im Level.
     * @param {CollectibleObject[]} [bottles=[]] - Flaschen im Level.
     */
    constructor(enemies, clouds, backgroundObjects, coins = [], bottles = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}