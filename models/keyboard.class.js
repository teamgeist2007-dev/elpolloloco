/**
 * Speichert die gedrückten Spieltasten.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;

    // Merkt sich das Gedrückthalten der Wurftaste.
    throwHeld = false;

    // Speichert auch einen sehr kurzen Tastendruck.
    throwPressed = false;

    /**
     * Gibt den aktuellen Zustand der Wurftaste zurück.
     * @returns {boolean} Ob D gerade gehalten wird.
     */
    get D() {
        return this.throwHeld;
    }

    /**
     * Speichert den Tastenzustand und erkennt einen neuen Tastendruck.
     * @param {boolean} pressed - Ob die Wurftaste gedrückt ist.
     */
    set D(pressed) {
        if (pressed && !this.throwHeld) {
            this.throwPressed = true;
        }

        this.throwHeld = pressed;
    }

    /**
     * Liest einen gemerkten Wurf aus und löscht ihn danach.
     * @returns {boolean} Ob ein neuer Tastendruck zum Werfen vorliegt.
     */
    takeThrow() {
        const pressed = this.throwPressed;
        this.throwPressed = false;
        return pressed;
    }
}