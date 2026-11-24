const gameScreen = document.getElementById('game-screen');
const gameScreenImage = document.getElementById('game-screen-image');
const gameScreenButton = document.getElementById('game-screen-button');
const gameHelp = document.getElementById('game-help');
const gameHelpButton = document.getElementById('game-help-button');
const gameContainer = document.getElementById('game-container');
const fullscreenButton = document.getElementById('fullscreen-button');

let restartTimer;

gameHelpButton.addEventListener('click', () => {
    gameHelp.showModal();
    updateGamePause();
});

gameHelp.addEventListener('close', updateGamePause);
gameScreenButton.addEventListener('click', startGameFromScreen);

/**
 * Startet direkt eine neue Runde und beendet einen offenen Neustart-Timer.
 */
function startGameFromScreen() {
    clearTimeout(restartTimer);
    gameScreen.hidden = true;
    init();
    gameAudio.focusGame();
}

/**
 * Zeigt das Endbild und startet nach einer Niederlage automatisch neu.
 * @param {boolean} won - Ob der Spieler gewonnen hat.
 */
function showGameResult(won) {
    gameScreenImage.src = won
        ? 'img/Win and lose/youWin.png'
        : 'img/Win and lose/gameOver.png';

    gameScreenImage.alt = won ? 'You Win' : 'Game Over';

    clearTimeout(restartTimer);
    gameScreenButton.textContent = 'Neues Spiel starten';
    gameScreenButton.hidden = !won;
    gameHelpButton.hidden = !won;
    gameScreen.hidden = false;

    if (won) {
        gameScreenButton.focus();
        gameAudio.playWinSound();
    } else {
        gameAudio.play('gameLose');
        restartTimer = setTimeout(startGameFromScreen, 5000);
    }
}

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
 * Wechselt zwischen normaler Ansicht und Vollbild.
 * @returns {Promise<void>} Abschluss des Vollbildwechsels.
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
 * Aktualisiert das Symbol und die Beschriftung des Vollbildbuttons.
 */
function updateFullscreenButton() {
    const fullscreenElement = document.fullscreenElement ||
        document.webkitFullscreenElement;

    const isFullscreen = fullscreenElement === gameContainer;
    gameContainer.classList.toggle('fullscreen', isFullscreen);

    const label = isFullscreen ? 'Vollbild beenden' : 'Vollbild';
    fullscreenButton.textContent = isFullscreen ? '✕' : '⛶';
    fullscreenButton.title = label;
    fullscreenButton.setAttribute('aria-label', label);
}