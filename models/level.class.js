/**
 * Speichert Gegner, Hintergrund und Gegenstände eines Levels.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    chips = [];
    level_end_x = 2250;

    /**
     * Übernimmt die Listen für den Aufbau eines Levels.
     * @param {MovableObject[]} enemies - Hühner und Endboss.
     * @param {Cloud[]} clouds - Wolken des Levels.
     * @param {BackgroundObject[]} backgroundObjects - Hintergrundebenen.
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