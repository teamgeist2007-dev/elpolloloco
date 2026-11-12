let canvas;
let world;
let keyboard;

function init() {
    canvas = document.getElementById('canvas');
    initLevel();

    keyboard = new Keyboard(() => world.checkThrowObjects());
    world = new World(canvas, keyboard);
}