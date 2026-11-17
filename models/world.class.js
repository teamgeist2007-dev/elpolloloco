// Hier läuft das Spiel ab: Kollisionen, Würfe, Einsammeln und Spielende.
class World {
    // Pepe und das aktuelle Level, in dem er sich bewegt.
    character = new Character();
    level = level1;
    // Der seitliche Versatz für die Kamera.
    camera_x = 0;
    statusBar = new StatusBar();
    // Liste der Flaschen, die gerade durch die Luft fliegen.
    throwableObjects = [];
    // Pepes Fußhöhe aus dem vorherigen Bild. Damit erkennt das Spiel eine Landung auf einem Huhn.
    previousCharacterBottom;
    gameFinished = false;
    // Anzahl der gesammelten Münzen und der aktuell übrigen Flaschen.
    coins = 0;
    bottles = 0;
    // Ab diesem Zeitpunkt ist beim Gedrückthalten von D der nächste Wurf möglich.
    nextThrowAt = 0;

    // Verbindet Pepe, Steuerung, Zeichnen und Ton und startet die Spielrunde.
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.renderer = new WorldRenderer(this.ctx);

        this.character.world = this;
        gameAudio.startRound(this);
        this.draw();
    }

    // Beendet die Runde und zeigt das passende Bild für Sieg oder Niederlage.
    finishGame(won) {
        if (this.gameFinished) return;

        this.gameFinished = true;
        gameAudio.endRound();
        showGameResult(won);
    }

    // Prüft die Spielregeln, zeichnet das aktuelle Bild und plant das nächste.
    draw() {
        if (this.gameFinished) return;

        // Prüft zuerst, ob Pepe auf einem Huhn landet oder einen Gegner berührt.
        this.checkCollisions();
        if (this.gameFinished) return;

        this.collectItems();
        this.checkBottleCollisions();
        if (this.gameFinished) return;

        this.checkThrowObjects();
        gameAudio.update(this);
        this.renderer.draw(this);
        // Der Browser ruft draw für das nächste Spielbild wieder auf.
        requestAnimationFrame(() => this.draw());
    }

    // Wirft eine Flasche, wenn eine im Vorrat ist und die Wurftaste benutzt wird.
    checkThrowObjects() {
        if (this.bottles === 0) {
            this.keyboard.takeThrow();
            return;
        }

        // Wartet, bis das Flaschenbild geladen ist, damit der Wurf sichtbar ist.
        const image = ThrowableObject.image;
        if (!image.complete || image.naturalWidth === 0) return;

        const now = performance.now();
        // Holt einen kurzen Tastendruck ab. Gedrückthalten ermöglicht weitere Würfe.
        const pressed = this.keyboard.takeThrow();
        if (!pressed && (!this.keyboard.D || now < this.nextThrowAt)) return;

        const pepe = this.character;
        let direction = 1;
        let x = pepe.x + pepe.width;

        // Wählt die linke Seite und die linke Flugrichtung, wenn Pepe nach links schaut.
        if (pepe.otherDirection) {
            direction = -1;
            x = pepe.x;
        }

        const bottle = new ThrowableObject(x, pepe.y + 100, direction);

        this.throwableObjects.push(bottle);
        this.bottles--;
        this.nextThrowAt = now + 200;
    }

    // Prüft, ob die fliegenden Flaschen einen Gegner treffen oder aus dem Spielfeld fallen.
    checkBottleCollisions() {
        this.throwableObjects = this.throwableObjects.filter((bottle) => {
            const enemy = this.level.enemies.find((enemy) =>
                this.bottleHitsEnemy(bottle, enemy)
            );

            if (enemy) this.hitEnemy(enemy);
            if (!enemy && bottle.y < this.canvas.height) return true;

            bottle.stop();
            gameAudio.play('bottleBreak');
            return false;
        });
    }

    // Prüft, ob sich die Trefferflächen von Flasche und Gegner überlappen.
    bottleHitsEnemy(bottle, enemy) {
        const side = enemy instanceof Endboss ? 25 : 5;
        const top = enemy instanceof Endboss ? 100 : 5;

        return bottle.x + bottle.width - 12 > enemy.x + side &&
            bottle.x + 12 < enemy.x + enemy.width - side &&
            bottle.y + bottle.height - 4 > enemy.y + top &&
            bottle.y + 4 < enemy.y + enemy.height;
    }

    // Zieht dem Gegner Leben ab und entfernt ihn, wenn er besiegt ist.
    hitEnemy(enemy) {
        const isEndboss = enemy instanceof Endboss;
        enemy.hit(isEndboss ? 20 : 100);

        if (enemy.isDead()) {
            enemy.stop?.();
            this.level.enemies = this.level.enemies.filter((item) => item !== enemy);

            // Kleine und große Hühner haben unterschiedliche Geräusche.
            if (enemy instanceof Chicken) {
                gameAudio.play(enemy.width < 70 ? 'chickenDead2' : 'chickenDead');
            }

            if (isEndboss) {
                this.finishGame(true);
            }
        }
    }

    // Entfernt eingesammelte Münzen und Flaschen aus dem Level und erhöht die Zähler.
    collectItems() {
        this.level.coins = this.level.coins.filter((coin) => {
            if (!this.touchesCollectible(coin)) return true;

            this.coins++;
            gameAudio.play('coinCollect');
            return false;
        });

        this.level.bottles = this.level.bottles.filter((bottle) => {
            if (!this.touchesCollectible(bottle)) return true;

            this.bottles++;
            gameAudio.play('bottleCollect');
            return false;
        });
    }

    // Prüft, ob Pepe eine Flasche oder Münze berührt.
    touchesCollectible(item) {
        const character = this.character;

        return character.x + character.width - 12 > item.x + 20 &&
            character.x + 12 < item.x + item.width - 20 &&
            character.y + character.height > item.y + 20 &&
            character.y + 100 < item.y + item.height - 12;
    }

    // Berechnet Pepes Trefferfläche mit etwas Abstand zu den transparenten Bildrändern.
    getCharacterHitbox() {
        const { x, y, width, height } = this.character;

        return {
            left: x + width * 0.22,
            right: x + width * 0.78,
            top: y + height * 0.4,
            bottom: y + height * 0.95
        };
    }

    // Berechnet die Trefferfläche eines Gegners. Beim Endboss sind die Ränder anders.
    getEnemyHitbox(enemy) {
        const { x, y, width, height } = enemy;
        const isEndboss = enemy instanceof Endboss;

        return {
            left: x + width * 0.15,
            right: x + width * 0.85,
            top: y + height * (isEndboss ? 0.2 : 0.1),
            bottom: y + height * (isEndboss ? 0.96 : 0.92)
        };
    }

    // Prüft, ob Pepe beim Fallen von oben auf einem Huhn landet.
    checkChickenStomps() {
        const pepe = this.getCharacterHitbox();
        // Vergleicht Pepes vorherige und aktuelle Fußhöhe, um einen Treffer von oben zu erkennen.
        const previousBottom = this.previousCharacterBottom ?? pepe.bottom;
        this.previousCharacterBottom = pepe.bottom;

        if (this.character.isDead() || this.character.speedY >= 0 || pepe.bottom <= previousBottom) return;

        const chicken = this.level.enemies.find((enemy) => {
            if (!(enemy instanceof Chicken)) return false;

            const target = this.getEnemyHitbox(enemy);

            return previousBottom <= target.top &&
                pepe.bottom >= target.top &&
                pepe.right > target.left &&
                pepe.left < target.right;
        });

        if (chicken) this.hitEnemy(chicken);
    }

    // Berührt Pepe einen Gegner, verliert er Leben. Ein Endbosstreffer zählt stärker.
    checkCollisions() {
        this.checkChickenStomps();
        const pepe = this.getCharacterHitbox();

        // Speichert den Schaden für diesen Kontakt, bevor Pepes Trefferschutz geprüft wird.
        let damage = 0;

        for (const enemy of this.level.enemies) {
            const target = this.getEnemyHitbox(enemy);

            const touchesPepe = pepe.right > target.left &&
                pepe.left < target.right &&
                pepe.bottom > target.top &&
                pepe.top < target.bottom;

            if (touchesPepe && enemy instanceof Endboss) {
                damage = 20;
                break;
            }

            if (touchesPepe) damage = 5;
        }

        if (damage === 0 || !this.character.hit(damage)) return;

        this.statusBar.setPercentage(this.character.energy);

        if (this.character.isDead()) {
            gameAudio.play('characterDead');
            this.finishGame(false);
        } else {
            gameAudio.play('characterDamage');
        }
    }
}