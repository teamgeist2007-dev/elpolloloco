class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    constructor(throwBottle) {
        this.bindKeyPressEvents();
        this.bindBtsPressEvents(throwBottle);
    }

    bindKeyPressEvents() {
        const keys = {
            37: 'LEFT',
            38: 'UP',
            39: 'RIGHT',
            40: 'DOWN',
            32: 'SPACE',
            68: 'D'
        };

        window.addEventListener('keydown', (e) => {
            const key = keys[e.keyCode];

            if (key) {
                this[key] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = keys[e.keyCode];

            if (key) {
                this[key] = false;
            }
        });
    }

    bindBtsPressEvents(throwBottle) {
        this.bindActionButton('btnLeft', 'LEFT');
        this.bindActionButton('btnRight', 'RIGHT');
        this.bindActionButton('btnJump', 'SPACE');

        const throwButton = document.getElementById('btnThrow');

        throwButton.addEventListener('click', () => {
            const wasPressed = this.D;
            this.D = true;
            throwBottle();
            this.D = wasPressed;
        });
    }

    bindActionButton(id, key) {
        const button = document.getElementById(id);

        button.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;

            button.setPointerCapture(e.pointerId);
            this[key] = true;
        });

        button.addEventListener('lostpointercapture', () => {
            this[key] = false;
        });
    }
}