let canvas;
let world;
let keyboard = new Keyboard();
let mobileControlsBound = false;

const portraitScreen = window.matchMedia(
    '(orientation: portrait) and (any-pointer: coarse)'
);

const gameKeys = {
    ArrowLeft: 'LEFT',
    ArrowRight: 'RIGHT',
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    Space: 'SPACE',
    KeyD: 'D'
};

/**
 * Baut eine neue Runde auf und verbindet die Steuerung.
 */
function init() {
    world?.stop();
    keyboard = new Keyboard();
    canvas = document.getElementById('canvas');

    initLevel();
    world = new World(canvas, keyboard);

    if (!mobileControlsBound) {
        bindMobileControls();
        mobileControlsBound = true;
    }

    updateGamePause();
}

window.addEventListener('keydown', (event) => {
    const key = gameKeys[event.code];
    if (!key || !world || world.gameFinished || world.paused) return;

    event.preventDefault();
    keyboard[key] = true;
});

window.addEventListener('keyup', (event) => {
    const key = gameKeys[event.code];
    if (key) keyboard[key] = false;
});

/**
 * Verbindet die vier Touch-Buttons mit den Spielaktionen.
 */
function bindMobileControls() {
    bindMobileButton('btnLeft', 'LEFT');
    bindMobileButton('btnRight', 'RIGHT');
    bindMobileButton('btnJump', 'SPACE');
    bindMobileButton('btnThrow', 'D');
}

/**
 * Verarbeitet Drücken und Loslassen eines Touch-Buttons.
 * @param {string} id - ID des Buttons.
 * @param {string} key - Zugehörige Spieltaste.
 */
function bindMobileButton(id, key) {
    const button = document.getElementById(id);

    button.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 || world.gameFinished || world.paused) return;

        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        keyboard[key] = true;
    });

    /**
     * Beendet die Aktion beim Loslassen oder Abbrechen der Berührung.
     */
    function releaseButton() {
        keyboard[key] = false;
    }

    button.addEventListener('pointerup', releaseButton);
    button.addEventListener('pointercancel', releaseButton);
    button.addEventListener('lostpointercapture', releaseButton);
}

/**
 * Pausiert das Spiel im Hochformat, im Hintergrund oder in der Anleitung.
 */
function updateGamePause() {
    if (!world || world.gameFinished) return;

    world.paused = portraitScreen.matches || document.hidden ||
        document.getElementById('game-help').open;

    world.keyboard = keyboard = new Keyboard();
    gameAudio.setLoop('characterRun', false);
    gameAudio.setLoop('characterSnoring', false);
    gameAudio.updateMusic();
}

portraitScreen.addEventListener('change', updateGamePause);
document.addEventListener('visibilitychange', updateGamePause);

window.addEventListener('blur', () => {
    keyboard = new Keyboard();
    if (world) world.keyboard = keyboard;
});