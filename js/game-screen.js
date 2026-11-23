const gameScreen = document.getElementById('game-screen');
const gameScreenImage = document.getElementById('game-screen-image');
const gameScreenButton = document.getElementById('game-screen-button');
const gameHelp = document.getElementById('game-help');
const gameContainer = document.getElementById('game-container');
const fullscreenButton = document.getElementById('fullscreen-button');

const restartKey = 'el-pollo-loco-restart';
let gameStarted = false;

// Öffnet die Spielanleitung.
document.getElementById('game-help-button').addEventListener('click', () => {
    gameHelp.showModal();
});

// Startet die erste Runde oder lädt für einen Neustart die Seite neu.
gameScreenButton.addEventListener('click', () => {
    if (gameStarted) {
        sessionStorage.setItem(restartKey, '1');
        window.location.reload();
        return;
    }

    startGameFromScreen();
});

// Startet nach einem angeforderten Neustart direkt eine neue Runde.
window.addEventListener('load', () => {
    if (sessionStorage.getItem(restartKey) === '1') {
        sessionStorage.removeItem(restartKey);
        startGameFromScreen();
    }
}, { once: true });

/**
 * Startet das Spiel einmal und blendet das Startbild aus.
 */
function startGameFromScreen() {
    if (gameStarted) return;

    gameStarted = true;
    init();
    gameScreen.hidden = true;
}

/**
 * Zeigt das Ergebnisbild und spielt den passenden Sound.
 * @param {boolean} won - true für You Win, false für Game Over.
 */
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

// Zeigt den Vollbildbutton, wenn der Browser die Funktion unterstützt.
if (
    (document.fullscreenEnabled && gameContainer.requestFullscreen) ||
    (document.webkitFullscreenEnabled && gameContainer.webkitRequestFullscreen)
) {
    fullscreenButton.hidden = false;
    fullscreenButton.addEventListener('click', toggleFullscreen);

    fullscreenButton.addEventListener('keydown', (event) => {
        if (event.code === 'Space') event.stopPropagation();
    });

    document.addEventListener('fullscreenchange', updateFullscreenButton);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
}

/**
 * Schaltet zwischen normaler Ansicht und Vollbild um.
 * @returns {Promise<void>} Wird nach dem verarbeiteten Vollbildwechsel beendet.
 */
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

        if (world && !world.gameFinished) {
            world.canvas.tabIndex = -1;
            world.canvas.focus({ preventScroll: true });
        }
    } catch (error) {
        fullscreenButton.title = 'Vollbild nicht verfügbar';
        fullscreenButton.setAttribute('aria-label', 'Vollbild nicht verfügbar');
    }
}

/**
 * Aktualisiert das Layout und das Symbol des Vollbildbuttons.
 */
function updateFullscreenButton() {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    const isFullscreen = fullscreenElement === gameContainer;

    gameContainer.classList.toggle('fullscreen', isFullscreen);

    const label = isFullscreen ? 'Vollbild beenden' : 'Vollbild';
    fullscreenButton.textContent = isFullscreen ? '✕' : '⛶';
    fullscreenButton.title = label;
    fullscreenButton.setAttribute('aria-label', label);
}