let canvas;
let world;
let keyboard = new Keyboard();
let mobileControlsBound = false;
let currentLevel = 1;

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
 * Baut das gewählte Level auf und übernimmt bisherige Werte.
 * @param {number} [levelNumber=1] - Nummer des Levels.
 * @param {{energy: number, coins: number, bottles: number}|null} [progress=null] - Mitgenommene Werte.
 */
function init(levelNumber = 1, progress = null) {
    world?.stop();
    resetGamePause();
    keyboard = new Keyboard();
    canvas = document.getElementById('canvas');
    currentLevel = levelNumber;

    initLevel();

    let level = level1;
    if (levelNumber >= 2) level = initLevel2(level);
    if (levelNumber === 3) level = initLevel3(level);

    world = new World(canvas, keyboard, level, progress);

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
 * Verbindet die Touch-Buttons mit den Spielaktionen.
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
 * Verbindet die manuelle Pause mit Hochformat, Hintergrund und Anleitung.
 */
function updateGamePause() {
    if (!world || world.gameFinished) return;

    world.paused = manuallyPaused || portraitScreen.matches ||
        document.hidden || document.getElementById('game-help').open;

    world.keyboard = keyboard = new Keyboard();
    gameAudio.setLoop('characterRun', false);
    gameAudio.setLoop('characterSnoring', false);
    gameAudio.updateMusic();
    updatePauseUI();
}

portraitScreen.addEventListener('change', updateGamePause);
document.addEventListener('visibilitychange', updateGamePause);

window.addEventListener('blur', () => {
    keyboard = new Keyboard();
    if (world) world.keyboard = keyboard;
});