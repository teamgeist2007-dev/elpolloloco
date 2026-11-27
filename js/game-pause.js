const pauseButton = document.getElementById('pause-button');
const pauseScreen = document.getElementById('pause-screen');
const resumeButton = document.getElementById('resume-button');

let manuallyPaused = false;
let pausedAt = 0;
let musicPosition = 0;

pauseButton.addEventListener('click', toggleGamePause);
resumeButton.addEventListener('click', toggleGamePause);

pauseButton.addEventListener('keydown', (event) => {
    if (event.code === 'Space') event.stopPropagation();
});

window.addEventListener('keydown', (event) => {
    if (event.code !== 'KeyP' || event.repeat) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (document.getElementById('game-help').open) return;

    event.preventDefault();
    toggleGamePause();
}, true);

/**
 * Hält die Runde an oder setzt sie an derselben Stelle fort.
 */
function toggleGamePause() {
    if (!world || world.gameFinished) return;

    manuallyPaused = !manuallyPaused;

    if (manuallyPaused) {
        pausedAt = performance.now();
        musicPosition = gameAudio.sounds.backgroundMusic.currentTime;
        gameAudio.startPending = false;
        gameAudio.stopAllSounds();
    } else {
        const duration = performance.now() - pausedAt;
        world.character.lastActiveAt += duration;
        world.character.lastHit += duration;
    }

    updateGamePause();

    if (manuallyPaused) {
        resumeButton.focus();
    } else {
        gameAudio.sounds.backgroundMusic.currentTime = musicPosition;
        gameAudio.focusGame();
    }
}

/**
 * Zeigt Pause und Weiterspielen während einer laufenden Runde.
 */
function updatePauseUI() {
    const playing = !!world && !world.gameFinished;

    pauseButton.hidden = !playing;
    pauseScreen.hidden = !playing || !manuallyPaused;
    pauseButton.textContent = manuallyPaused ? '▶' : '⏸';
    pauseButton.title = manuallyPaused
        ? 'Weiterspielen (P)'
        : 'Spiel pausieren (P)';

    pauseButton.setAttribute('aria-label', pauseButton.title);
    pauseButton.setAttribute('aria-pressed', String(manuallyPaused));
}

/**
 * Setzt die Pause beim Spielende oder Neustart zurück.
 */
function resetGamePause() {
    manuallyPaused = false;
    pausedAt = 0;
    musicPosition = 0;
    updatePauseUI();
}