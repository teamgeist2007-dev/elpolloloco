// Ein Level speichert, welche Gegner, Wolken, Hintergrundbilder und Gegenstände zur Runde gehören.
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    // So weit darf Pepe nach rechts laufen.
    level_end_x = 2250;

    // Übernimmt die Listen für den Aufbau eines Levels.
    constructor(enemies, clouds, backgroundObjects, coins = [], bottles = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}