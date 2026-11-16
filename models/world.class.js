class World {
    character = new Character();
    level = level1;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];
    previousCharacterBottom;
    gameFinished = false;
    coins = 0;
    bottles = 0;
    nextThrowAt = 0;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.renderer = new WorldRenderer(this.ctx);

        this.character.world = this;
        gameAudio.startRound(this);
        this.draw();
    }

    finishGame(won) {
        if (this.gameFinished) return;

        this.gameFinished = true;
        gameAudio.endRound();
        showGameResult(won);
    }

    draw() {
        if (this.gameFinished) return;

        this.checkCollisions();
        if (this.gameFinished) return;

        this.collectItems();
        this.checkBottleCollisions();
        if (this.gameFinished) return;

        this.checkThrowObjects();
        gameAudio.update(this);
        this.renderer.draw(this);
        requestAnimationFrame(() => this.draw());
    }

    checkThrowObjects() {
        if (this.bottles === 0) {
            this.keyboard.takeThrow();
            return;
        }

        const image = ThrowableObject.image;
        if (!image.complete || image.naturalWidth === 0) return;

        const now = performance.now();
        const pressed = this.keyboard.takeThrow();
        if (!pressed && (!this.keyboard.D || now < this.nextThrowAt)) return;

        const character = this.character;
        const direction = character.otherDiretion ? -1 : 1;
        const x = direction === -1 ? character.x : character.x + character.width;
        const bottle = new ThrowableObject(x, character.y + 100, direction);

        this.throwableObjects.push(bottle);
        this.bottles--;
        this.nextThrowAt = now + 200;
    }

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

    bottleHitsEnemy(bottle, enemy) {
        const side = enemy instanceof Endboss ? 25 : 5;
        const top = enemy instanceof Endboss ? 100 : 5;

        return bottle.x + bottle.width - 12 > enemy.x + side &&
            bottle.x + 12 < enemy.x + enemy.width - side &&
            bottle.y + bottle.height - 4 > enemy.y + top &&
            bottle.y + 4 < enemy.y + enemy.height;
    }

    hitEnemy(enemy) {
        const isEndboss = enemy instanceof Endboss;
        enemy.hit(isEndboss ? 20 : 100);

        if (enemy.isDead()) {
            enemy.stop?.();
            this.level.enemies = this.level.enemies.filter((item) => item !== enemy);

            if (enemy instanceof Chicken) {
                gameAudio.play(enemy.width < 70 ? 'chickenDead2' : 'chickenDead');
            }

            if (isEndboss) {
                this.finishGame(true);
            }
        }
    }

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

    touchesCollectible(item) {
        const character = this.character;

        return character.x + character.width - 12 > item.x + 20 &&
            character.x + 12 < item.x + item.width - 20 &&
            character.y + character.height > item.y + 20 &&
            character.y + 100 < item.y + item.height - 12;
    }

    getCharacterHitbox() {
        const { x, y, width, height } = this.character;

        return {
            left: x + width * 0.22,
            right: x + width * 0.78,
            top: y + height * 0.4,
            bottom: y + height * 0.95
        };
    }

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

    checkChickenStomps() {
        const pepe = this.getCharacterHitbox();
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

    checkCollisions() {
        this.checkChickenStomps();
        const pepe = this.getCharacterHitbox();

        const touchingEnemies = this.level.enemies.filter((enemy) => {
            const target = this.getEnemyHitbox(enemy);

            return pepe.right > target.left &&
                pepe.left < target.right &&
                pepe.bottom > target.top &&
                pepe.top < target.bottom;
        });

        if (touchingEnemies.length === 0) return;

        const bossIsTouching = touchingEnemies.some((enemy) => enemy instanceof Endboss);
        if (!this.character.hit(bossIsTouching ? 20 : 5)) return;

        this.statusBar.setPercentage(this.character.energy);

        if (this.character.isDead()) {
            gameAudio.play('characterDead');
            this.finishGame(false);
        } else {
            gameAudio.play('characterDamage');
        }
    }
}