/**
 * Prüft Berührungen, Sprungtreffer und Flaschentreffer.
 */
class WorldCollisions {
    previousCharacterBottom;

    /**
     * Verbindet die Kollisionsprüfung mit der Spielwelt.
     * @param {World} world - Zugehörige Spielrunde.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Prüft Sprungtreffer und Schaden durch seitliche Berührungen.
     */
    checkCollisions() {
        this.checkChickenStomps();
        const damage = this.getContactDamage();
        if (damage > 0) this.damageCharacter(damage);
    }

    /**
     * Prüft, ob Pepe beim Fallen von oben auf einem Huhn landet.
     */
    checkChickenStomps() {
        const pepe = this.world.getCharacterHitbox();
        const previousBottom = this.previousCharacterBottom ?? pepe.bottom;
        this.previousCharacterBottom = pepe.bottom;

        if (this.world.character.isDead() ||
            this.world.character.speedY >= 0 ||
            pepe.bottom <= previousBottom) return;

        const chicken = this.world.level.enemies.find((enemy) => {
            if (!(enemy instanceof Chicken)) return false;

            const target = this.world.getEnemyHitbox(enemy);

            return previousBottom <= target.top &&
                pepe.bottom >= target.top &&
                pepe.right > target.left &&
                pepe.left < target.right;
        });

        if (chicken) this.hitEnemy(chicken);
    }

    /**
     * Bestimmt den Kontaktschaden mit Vorrang für den Endboss.
     * @returns {number} Null, fünf oder zwanzig Lebenspunkte Schaden.
     */
    getContactDamage() {
        let damage = 0;

        for (const enemy of this.world.level.enemies) {
            if (!this.touchesEnemy(enemy)) continue;
            if (enemy instanceof Endboss) return 20;
            damage = 5;
        }

        return damage;
    }

    /**
     * Prüft, ob Pepe einen Gegner berührt.
     * @param {MovableObject} enemy - Geprüfter Gegner.
     * @returns {boolean} Ob sich beide Trefferflächen überlappen.
     */
    touchesEnemy(enemy) {
        const pepe = this.world.getCharacterHitbox();
        const target = this.world.getEnemyHitbox(enemy);

        return pepe.right > target.left &&
            pepe.left < target.right &&
            pepe.bottom > target.top &&
            pepe.top < target.bottom;
    }

    /**
     * Zieht Leben ab und aktualisiert Anzeige und Treffergeräusch.
     * @param {number} damage - Schaden durch den Kontakt.
     */
    damageCharacter(damage) {
        if (!this.world.character.hit(damage)) return;

        this.world.statusBar.setPercentage(this.world.character.energy);

        if (this.world.character.isDead()) {
            gameAudio.play('characterDead');
            this.world.finishGame(false);
        } else {
            gameAudio.play('characterDamage');
        }
    }

    /**
     * Entfernt Flaschen nach einem Treffer oder Verlassen des Spielfelds.
     */
    checkBottleCollisions() {
        this.world.throwableObjects = this.world.throwableObjects.filter((bottle) => {
            const enemy = this.world.level.enemies.find((enemy) =>
                this.bottleHitsEnemy(bottle, enemy)
            );

            if (enemy) this.hitEnemy(enemy);
            if (!enemy && bottle.y < this.world.canvas.height) return true;

            bottle.stop();
            gameAudio.play('bottleBreak');
            return false;
        });
    }

    /**
     * Prüft, ob eine Flasche einen Gegner trifft.
     * @param {ThrowableObject} bottle - Geworfene Flasche.
     * @param {MovableObject} enemy - Geprüfter Gegner.
     * @returns {boolean} Ob sich die Trefferflächen überlappen.
     */
    bottleHitsEnemy(bottle, enemy) {
        const side = enemy instanceof Endboss ? 25 : 5;
        const top = enemy instanceof Endboss ? 100 : 5;

        return bottle.x + bottle.width - 12 > enemy.x + side &&
            bottle.x + 12 < enemy.x + enemy.width - side &&
            bottle.y + bottle.height - 4 > enemy.y + top &&
            bottle.y + 4 < enemy.y + enemy.height;
    }

    /**
     * Zieht Gegnerleben ab und entfernt besiegte Gegner.
     * @param {MovableObject} enemy - Getroffener Gegner.
     */
    hitEnemy(enemy) {
        const isEndboss = enemy instanceof Endboss;
        enemy.hit(isEndboss ? 20 : 100);

        if (enemy.isDead()) {
            enemy.stop?.();

            this.world.level.enemies = this.world.level.enemies.filter(
                (item) => item !== enemy
            );

            if (enemy instanceof Chicken) {
                gameAudio.play(enemy.width < 70 ? 'chickenDead2' : 'chickenDead');
            }

            if (isEndboss) this.world.finishGame(true);
        }
    }
}