let canvas;
let world;
let keyboard = new Keyboard();

// Verbindet die Tastencodes mit den Namen in der Steuerung.
const gameKeys = {
    ArrowLeft: 'LEFT',
    ArrowRight: 'RIGHT',
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    Space: 'SPACE',
    KeyD: 'D'
};

/**
 * Baut das Level auf und startet eine neue Spielrunde.
 */
function init() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard);
    bindMobileControls();
}

// Speichert gedrückte Spieltasten.
window.addEventListener('keydown', (event) => {
    const key = gameKeys[event.code];
    if (!key || !world || world.gameFinished) return;

    event.preventDefault();
    keyboard[key] = true;
});

// Setzt losgelassene Spieltasten zurück.
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
 * Verbindet einen Touch-Button mit einer Spieltaste.
 * @param {string} id - ID des Buttons in der HTML-Datei.
 * @param {string} key - Name der zugehörigen Spieltaste.
 */
function bindMobileButton(id, key) {
    const button = document.getElementById(id);

    button.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 || world.gameFinished) return;

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