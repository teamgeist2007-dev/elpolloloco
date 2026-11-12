let canvas;
let world;
let keyboard;

function init() {
    canvas = document.getElementById('canvas');
    initLevel();

    keyboard = new Keyboard(() => world.checkThrowObjects());
    world = new World(canvas, keyboard);

    const endboss = level1.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss) {
        endboss.followCharacter(world.character);
    }
}