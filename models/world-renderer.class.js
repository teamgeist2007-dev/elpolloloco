class WorldRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.coinIcon = this.createInventoryIcon('img/7_statusbars/3_icons/icon_coin.png', 260);
        this.bottleIcon = this.createInventoryIcon('img/7_statusbars/3_icons/icon_salsa_bottle.png', 350);
    }

    draw(world) {
        const { canvas, camera_x, level } = world;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.ctx.translate(camera_x, 0);
        this.addObjectsToMap(level.backgroundObjects);
        this.addToMap(world.character);
        this.addObjectsToMap(level.clouds);
        this.addObjectsToMap(level.enemies);
        this.addObjectsToMap(level.coins);
        this.addObjectsToMap(level.bottles);
        this.addObjectsToMap(world.throwableObjects);
        this.ctx.translate(-camera_x, 0);

        this.addToMap(world.statusBar);
        this.drawInventory(world.coins, world.bottles);

        const endboss = level.enemies.find((enemy) => enemy instanceof Endboss);
        if (endboss?.isChasing) {
            endboss.drawHealthBar(this.ctx);
        }
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

    drawInventory(coins, bottles) {
        this.ctx.save();
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.drawInventoryItem(this.coinIcon, coins);
        this.drawInventoryItem(this.bottleIcon, bottles);

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

    addObjectsToMap(objects) {
        objects.forEach((object) => this.addToMap(object));
    }

    addToMap(object) {
        if (!object.img.complete || object.img.naturalWidth === 0) return;

        if (!object.otherDiretion) {
            object.draw(this.ctx);
            return;
        }

        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = -object.x;
        object.draw(this.ctx);
        object.x = -object.x;
        this.ctx.restore();
    }
}