const gameScreen = document.getElementById('game-screen');
const gameScreenImage = document.getElementById('game-screen-image');
const gameScreenButton = document.getElementById('game-screen-button');
const restartKey = 'el-pollo-loco-restart';
let gameStarted = false;

gameScreenButton.addEventListener('click', () => {
    if (gameStarted) {
        sessionStorage.setItem(restartKey, '1');
        window.location.reload();
        return;
    }

    startGameFromScreen();
});

window.addEventListener('load', () => {
    if (sessionStorage.getItem(restartKey) === '1') {
        sessionStorage.removeItem(restartKey);
        startGameFromScreen();
    }
}, { once: true });

function startGameFromScreen() {
    if (gameStarted) return;

    gameStarted = true;
    init();
    gameScreen.hidden = true;
}

function showGameResult(won) {
    gameScreenImage.src = won
        ? 'img/Win and lose/youWin.png'
        : 'img/Win and lose/gameOver.png';

    gameScreenImage.alt = won ? 'You Win' : 'Game Over';
    gameScreenButton.textContent = 'Neues Spiel starten';
    gameScreen.hidden = false;
    gameScreenButton.focus();
}