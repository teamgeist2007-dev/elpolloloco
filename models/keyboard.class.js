class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    throwHeld = false;
    throwPressed = false;

    get D() {
        return this.throwHeld;
    }

    set D(pressed) {
        if (pressed && !this.throwHeld) {
            this.throwPressed = true;
        }

        this.throwHeld = pressed;
    }

    takeThrow() {
        const pressed = this.throwPressed;
        this.throwPressed = false;
        return pressed;
    }
}