// Hier werden das Spielfeld, die laufende Runde und die Steuerung gespeichert.
let canvas;
let world;
let keyboard = new Keyboard();

// Verbindet die echten Tastencodes mit den Namen, die das Spiel intern benutzt.
const gameKeys = {
    ArrowLeft: 'LEFT',
    ArrowRight: 'RIGHT',
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    Space: 'SPACE',
    KeyD: 'D'
};

// Baut beim Klick auf Spiel starten eine neue Runde auf.
function init() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard);
    bindMobileControls();
}

// Merkt sich, welche Spieltaste gedrückt wurde.
window.addEventListener('keydown', (event) => {
    const key = gameKeys[event.code];
    if (!key || !world || world.gameFinished) return;

    event.preventDefault();
    keyboard[key] = true;
});

// Setzt die Taste nach dem Loslassen zurück.
window.addEventListener('keyup', (event) => {
    const key = gameKeys[event.code];
    if (key) keyboard[key] = false;
});

// Verbindet die vier Touch-Buttons mit Laufen, Springen und Werfen.
function bindMobileControls() {
    bindMobileButton('btnLeft', 'LEFT');
    bindMobileButton('btnRight', 'RIGHT');
    bindMobileButton('btnJump', 'SPACE');
    bindMobileButton('btnThrow', 'D');
}

// Richtet die Reaktion auf Drücken und Loslassen für einen einzelnen Button ein.
function bindMobileButton(id, key) {
    const button = document.getElementById(id);

    button.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 || world.gameFinished) return;

        event.preventDefault();
        // Der Button merkt das Loslassen auch dann, wenn der Finger über seinen Rand rutscht.
        button.setPointerCapture(event.pointerId);
        keyboard[key] = true;
    });

    // Stoppt die Aktion, wenn der Button losgelassen oder die Berührung abgebrochen wird.
    function releaseButton() {
        keyboard[key] = false;
    }

    button.addEventListener('pointerup', releaseButton);
    button.addEventListener('pointercancel', releaseButton);
    button.addEventListener('lostpointercapture', releaseButton);
}