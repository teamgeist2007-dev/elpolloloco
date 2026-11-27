const gameScreen = document.getElementById('game-screen');
const gameScreenImage = document.getElementById('game-screen-image');
const gameScreenButton = document.getElementById('game-screen-button');
const gameHelp = document.getElementById('game-help');
const gameHelpButton = document.getElementById('game-help-button');
const gameContainer = document.getElementById('game-container');
const fullscreenButton = document.getElementById('fullscreen-button');
const screenDelay = 2500;

let screenMode = 'menu';
let nextLevel = 1;
let savedProgress = null;
let levelTimer;

gameHelpButton.addEventListener('click', () => {
    gameHelp.showModal();
    updateGamePause();
});

gameHelp.addEventListener('close', updateGamePause);
gameScreenButton.addEventListener('click', handleScreenButton);

/**
 * Zeigt beim ersten Start das Levelbild und startet sonst die nächste Runde.
 */
function handleScreenButton() {
    if (screenMode === 'win') return;

    if (screenMode === 'menu') {
        gameAudio.prepareMusicVolume();
        showLevelIntro(1);
    } else {
        startGameFromScreen();
    }
}

/**
 * Zeigt das Levelbild. Level 1 startet automatisch, weitere Level über Weiter.
 * @param {number} levelNumber - Nummer des folgenden Levels.
 */
function showLevelIntro(levelNumber) {
    clearTimeout(levelTimer);
    nextLevel = levelNumber;
    screenMode = 'intro';
    gameScreenImage.src = `img/levelStarts/Level ${levelNumber}_ Start.png`;
    gameScreenImage.alt = `Level ${levelNumber}`;
    gameScreenButton.textContent = 'Weiter';
    gameScreenButton.hidden = levelNumber === 1;
    gameHelpButton.hidden = true;
    gameScreen.hidden = false;

    if (levelNumber === 1) {
        levelTimer = setTimeout(startGameFromScreen, screenDelay);
    } else {
        gameScreenButton.focus();
    }
}

/**
 * Startet das gewählte Level direkt mit den gespeicherten Werten.
 */
function startGameFromScreen() {
    clearTimeout(levelTimer);
    screenMode = 'playing';
    gameScreen.hidden = true;
    init(nextLevel, savedProgress);
    savedProgress = null;
    gameAudio.focusGame();
}

/**
 * Zeigt das Ergebnis. Nach einer Niederlage startet das Spiel nach 2,5 Sekunden neu.
 * @param {boolean} won - Ob der Spieler den Endboss besiegt hat.
 */
function showGameResult(won) {
    clearTimeout(levelTimer);
    resetGamePause();

    const hasNextLevel = won && currentLevel < 3;

    screenMode = hasNextLevel ? 'win' : 'result';
    nextLevel = hasNextLevel ? currentLevel + 1 : 1;

    savedProgress = hasNextLevel ? {
        energy: world.character.energy,
        coins: world.coins,
        bottles: world.bottles
    } : null;

    gameScreenImage.src = won
        ? 'img/Win and lose/youWin.png'
        : 'img/Win and lose/gameOver.png';

    gameScreenImage.alt = won ? 'You Win' : 'Game Over';
    gameScreenButton.textContent = hasNextLevel ? 'Weiter' : 'Neues Spiel starten';
    gameScreenButton.hidden = hasNextLevel || !won;
    gameHelpButton.hidden = !won || hasNextLevel;
    gameScreen.hidden = false;

    if (hasNextLevel) {
        levelTimer = setTimeout(() => showLevelIntro(nextLevel), screenDelay);
    } else if (!won) {
        levelTimer = setTimeout(startGameFromScreen, 2500);
    } else {
        gameScreenButton.focus();
    }

    if (won) gameAudio.playWinSound();
    else gameAudio.play('gameLose');
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
 * Schaltet zwischen normaler Ansicht und Vollbild um.
 * @returns {Promise<void>} Wird beendet, sobald der Vollbildwechsel verarbeitet wurde.
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
 * Passt das Layout und die Beschriftung des Vollbildbuttons an.
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