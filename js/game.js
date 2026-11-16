let canvas;
let world;
let keyboard = new Keyboard();

const gameKeys = {
    ArrowLeft: 'LEFT',
    ArrowRight: 'RIGHT',
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    Space: 'SPACE',
    KeyD: 'D'
};

function init() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard);
    bindMobileControls();
}

window.addEventListener('keydown', (event) => {
    const key = gameKeys[event.code];
    if (!key || !world || world.gameFinished) return;

    event.preventDefault();
    keyboard[key] = true;
});

window.addEventListener('keyup', (event) => {
    const key = gameKeys[event.code];
    if (key) keyboard[key] = false;
});

function bindMobileControls() {
    const buttons = {
        btnLeft: 'LEFT',
        btnRight: 'RIGHT',
        btnJump: 'SPACE',
        btnThrow: 'D'
    };

    Object.entries(buttons).forEach(([id, key]) => {
        const button = document.getElementById(id);

        button.addEventListener('pointerdown', (event) => {
            if (event.button !== 0 || world.gameFinished) return;

            event.preventDefault();
            button.setPointerCapture(event.pointerId);
            keyboard[key] = true;
        });

        ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) => {
            button.addEventListener(type, () => {
                keyboard[key] = false;
            });
        });
    });
}