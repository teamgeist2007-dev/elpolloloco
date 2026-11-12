class World {
    character = new Character();
    level = level1;

    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];
    previousCharacterBottom;

    coins = 0;
    bottles = 0;

    coinIcon = this.createInventoryIcon('img/7_statusbars/3_icons/icon_coin.png', 260);
    bottleIcon = this.createInventoryIcon('img/7_statusbars/3_icons/icon_salsa_bottle.png', 350);

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 200);
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.bottles > 0) {
            let bottle = new ThrowableObject(
                this.character.x + 100,
                this.character.y + 100
            );

            this.throwableObjects.push(bottle);
            this.bottles--;
        }
    }

    checkBottleCollisions() {
        this.throwableObjects = this.throwableObjects.filter((bottle) => {
            const enemy = this.level.enemies.find((enemy) =>
                this.bottleHitsEnemy(bottle, enemy)
            );

            if (enemy) this.hitEnemy(enemy);
            if (!enemy && bottle.y < this.canvas.height) return true;

            bottle.stop();
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
        enemy.hit(enemy instanceof Endboss ? 20 : 100);

        if (enemy.isDead()) {
            enemy.stop?.();
            this.level.enemies = this.level.enemies.filter((item) => item !== enemy);
        }
    }

    collectItems() {
        this.level.coins = this.level.coins.filter((coin) => {
            if (!this.touchesCollectible(coin)) return true;

            this.coins++;
            return false;
        });

        this.level.bottles = this.level.bottles.filter((bottle) => {
            if (!this.touchesCollectible(bottle)) return true;

            this.bottles++;
            return false;
        });
    }

    touchesCollectible(item) {
        const character = this.character;

        // Die transparenten Bildränder zählen beim Einsammeln nicht mit.
        return character.x + character.width - 12 > item.x + 20 &&
            character.x + 12 < item.x + item.width - 20 &&
            character.y + character.height > item.y + 20 &&
            character.y + 100 < item.y + item.height - 12;
    }

    checkChickenStomps() {
        const character = this.character;
        const bottom = character.y + character.height;
        const previousBottom = this.previousCharacterBottom ?? bottom;
        this.previousCharacterBottom = bottom;

        if (character.isDead() || character.speedY >= 0 || bottom <= previousBottom) return;

        const chicken = this.level.enemies.find((enemy) =>
            enemy instanceof Chicken &&
            previousBottom <= enemy.y &&
            bottom >= enemy.y &&
            character.x + character.width - 12 > enemy.x + 5 &&
            character.x + 12 < enemy.x + enemy.width - 5
        );

        if (chicken) this.hitEnemy(chicken);
    }

    checkCollisions() {
        this.checkChickenStomps();

        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    createInventoryIcon(path, x) {
        const icon = new DrawableObject();
        icon.loadImage(path);
        icon.x = x;
        icon.y = 10;
        icon.width = 40;
        icon.height = 40;
        return icon;
    }

    drawInventory() {
        this.ctx.save();
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.drawInventoryItem(this.coinIcon, this.coins);
        this.drawInventoryItem(this.bottleIcon, this.bottles);

        this.ctx.restore();
    }

    drawInventoryItem(icon, count) {
        this.ctx.beginPath();
        this.ctx.roundRect(icon.x - 4, icon.y, 80, icon.height, 20);
        this.ctx.fillStyle = 'rgba(43, 26, 18, 0.85)';
        this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#e6b95c';
        this.ctx.stroke();

        this.addToMap(icon);
        this.ctx.fillStyle = '#ffda78';
        this.ctx.fillText(count, icon.x + 55, icon.y + icon.height / 2);
    }

    drawEndbossHealthBar() {
        const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);

        if (endboss?.isChasing) {
            endboss.drawHealthBar(this.ctx);
        }
    }

    draw() {
        this.checkChickenStomps();
        this.collectItems();
        this.checkBottleCollisions();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);

        // ------ Space for fixed objects ------
        this.addToMap(this.statusBar);
        this.drawInventory();
        this.drawEndbossHealthBar();

        // Draw() wird immer wieder aufgerufen.
        const self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    addToMap(mo) {
        if (mo.img.complete && mo.img.naturalWidth > 0) {
            if (mo.otherDiretion) {
                this.flipImage(mo);
            }

            mo.draw(this.ctx);

            if (mo.otherDiretion) {
                this.flipImageBack(mo);
            }
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}