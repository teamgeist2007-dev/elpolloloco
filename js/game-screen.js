// Diese Elemente gehören zum Startbild, den Endbildern, der Anleitung und dem Vollbild.
const gameScreen = document.getElementById('game-screen');
const gameScreenImage = document.getElementById('game-screen-image');
const gameScreenButton = document.getElementById('game-screen-button');
const gameHelp = document.getElementById('game-help');
const gameContainer = document.getElementById('game-container');
const fullscreenButton = document.getElementById('fullscreen-button');
// Mit diesem Schlüssel merkt sich die Seite, dass nach einem Neuladen direkt eine neue Runde starten soll.
const restartKey = 'el-pollo-loco-restart';
let gameStarted = false;

// Öffnet das Fenster mit der Spielanleitung.
document.getElementById('game-help-button').addEventListener('click', () => {
    gameHelp.showModal();
});

// Startet die erste Runde oder lädt nach dem Spielende eine neue Runde.
gameScreenButton.addEventListener('click', () => {
    // Beim Neustart lädt die Seite neu, damit die alte Runde endet und alle Werte frisch beginnen.
    if (gameStarted) {
        sessionStorage.setItem(restartKey, '1');
        window.location.reload();
        return;
    }

    startGameFromScreen();
});

// Startet nach dem Neuladen direkt, wenn vorher auf Neues Spiel starten geklickt wurde.
window.addEventListener('load', () => {
    if (sessionStorage.getItem(restartKey) === '1') {
        sessionStorage.removeItem(restartKey);
        startGameFromScreen();
    }
}, { once: true });

// Startet das Spiel einmal und blendet das Startbild aus.
function startGameFromScreen() {
    if (gameStarted) return;

    gameStarted = true;
    init();
    gameScreen.hidden = true;
}

// Zeigt Sieg oder Niederlage an und spielt den passenden Sound.
function showGameResult(won) {
    gameScreenImage.src = won
        ? 'img/Win and lose/youWin.png'
        : 'img/Win and lose/gameOver.png';

    gameScreenImage.alt = won ? 'You Win' : 'Game Over';
    gameScreenButton.textContent = 'Neues Spiel starten';
    gameScreen.hidden = false;
    gameScreenButton.focus();

    gameAudio.play(won ? 'gameWin' : 'gameLose');
}

if (
    // Der Vollbildbutton erscheint, wenn der Browser die Vollbildfunktion unterstützt.
    (document.fullscreenEnabled && gameContainer.requestFullscreen) ||
    (document.webkitFullscreenEnabled && gameContainer.webkitRequestFullscreen)
) {
    fullscreenButton.hidden = false;
    fullscreenButton.addEventListener('click', toggleFullscreen);

    fullscreenButton.addEventListener('keydown', (event) => {
        if (event.code === 'Space') event.stopPropagation();
    });

    // Aktualisiert den Button auch dann, wenn Vollbild mit Escape beendet wird.
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
}

// Schaltet zwischen normaler Ansicht und Vollbild um.
async function toggleFullscreen() {
    try {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        } else if (document.webkitFullscreenElement) {
            await document.webkitExitFullscreen();
        } else if (document.fullscreenEnabled && gameContainer.requestFullscreen) {
            await gameContainer.requestFullscreen();
        } else {
            await gameContainer.webkitRequestFullscreen();
        }

        // Gibt nach dem Umschalten die Tastatursteuerung wieder ans Spielfeld.
        if (world && !world.gameFinished) {
            world.canvas.tabIndex = -1;
            world.canvas.focus({ preventScroll: true });
        }
    } catch (error) {
        fullscreenButton.title = 'Vollbild nicht verfügbar';
        fullscreenButton.setAttribute('aria-label', 'Vollbild nicht verfügbar');
    }
}

// Passt das Layout und die Beschriftung des Vollbildbuttons an.
function updateFullscreenButton() {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    const isFullscreen = fullscreenElement === gameContainer;

    gameContainer.classList.toggle('fullscreen', isFullscreen);

    const label = isFullscreen ? 'Vollbild beenden' : 'Vollbild';
    fullscreenButton.textContent = isFullscreen ? '✕' : '⛶';
    fullscreenButton.title = label;
    fullscreenButton.setAttribute('aria-label', label);
}