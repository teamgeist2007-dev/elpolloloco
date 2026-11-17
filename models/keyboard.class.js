// Speichert, welche Spieltasten gerade gedrückt werden.
class Keyboard {
    // Diese Werte sind true, solange die zugehörige Taste oder der Touch-Button gedrückt ist.
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    // Merkt sich, ob die Wurftaste gerade gehalten wird.
    throwHeld = false;
    // Merkt sich einen neuen Wurf, auch wenn D sofort wieder losgelassen wird.
    throwPressed = false;

    // Gibt zurück, ob die Wurftaste gerade gedrückt ist.
    get D() {
        return this.throwHeld;
    }

    // Speichert den Tastenzustand und merkt sich den Beginn eines neuen Tastendrucks.
    set D(pressed) {
        if (pressed && !this.throwHeld) {
            this.throwPressed = true;
        }

        this.throwHeld = pressed;
    }

    // Liest den gemerkten Tastendruck einmal aus und löscht ihn danach.
    takeThrow() {
        const pressed = this.throwPressed;
        this.throwPressed = false;
        return pressed;
    }
}