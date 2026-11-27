/**
 * Zeichnet die Spielwelt und die festen Anzeigen.
 */
class WorldRenderer {
    /**
     * Merkt sich den Zeichenbereich und lädt die Anzeigebilder.
     * @param {CanvasRenderingContext2D} ctx - Zeichenbereich.
     */
    constructor(ctx) {
        this.ctx = ctx;
        this.coinIcon = this.createInventoryIcon('img/8_coin/coin_1.png', 260);
        this.bottleIcon = this.createInventoryIcon(
            'img/6_salsa_bottle/salsa_bottle.png',
            350
        );
    }

    /**
     * Zeichnet ein vollständiges Spielbild.
     * @param {World} world - Aktuelle Spielwelt.
     */
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
        this.addObjectsToMap(level.chips);
        this.addObjectsToMap(world.throwableObjects);

        this.ctx.translate(-camera_x, 0);
        this.addToMap(world.statusBar);
        this.drawInventory(world.coins, world.bottles);

        const endboss = level.enemies.find((enemy) => enemy instanceof Endboss);
        if (endboss?.isChasing) endboss.drawHealthBar(this.ctx);
    }

    /**
     * Erstellt ein fest positioniertes Anzeigesymbol.
     * @param {string} path - Bildpfad.
     * @param {number} x - Horizontale Position.
     * @returns {DrawableObject} Fertiges Symbol.
     */
    createInventoryIcon(path, x) {
        const icon = new DrawableObject();
        icon.loadImage(path);
        icon.x = x;
        icon.y = 10;
        icon.width = 40;
        icon.height = 40;
        return icon;
    }

    /**
     * Zeichnet die Zähler für Münzen und Flaschen.
     * @param {number} coins - Gesammelte Münzen.
     * @param {number} bottles - Verfügbare Flaschen.
     */
    drawInventory(coins, bottles) {
        this.ctx.save();
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.drawInventoryItem(this.coinIcon, coins);
        this.drawInventoryItem(this.bottleIcon, bottles);

        this.ctx.restore();
    }

    /**
     * Zeichnet Hintergrund, Bildausschnitt und Anzahl eines Gegenstands.
     * @param {DrawableObject} icon - Anzeigebild.
     * @param {number} count - Angezeigte Anzahl.
     */
    drawInventoryItem(icon, count) {
        if (!icon.img.complete || !icon.img.naturalWidth) return;

        this.ctx.beginPath();
        this.ctx.roundRect(icon.x - 4, icon.y, 80, icon.height, 20);
        this.ctx.fillStyle = 'rgba(43, 26, 18, 0.85)';
        this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#e6b95c';
        this.ctx.stroke();

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        if (icon === this.coinIcon) {
            this.ctx.drawImage(icon.img, 96, 97, 108, 107, icon.x + 7, 17, 26, 26);
        } else {
            this.ctx.drawImage(icon.img, 162, 62, 76, 286, icon.x + 15, 13, 9, 34);
        }

        this.ctx.fillStyle = '#ffda78';
        this.ctx.fillText(count, icon.x + 55, icon.y + icon.height / 2);
    }

    /**
     * Zeichnet alle Objekte einer Liste.
     * @param {DrawableObject[]} objects - Zu zeichnende Objekte.
     */
    addObjectsToMap(objects) {
        for (const object of objects) {
            this.addToMap(object);
        }
    }

    /**
     * Zeichnet ein geladenes Objekt und spiegelt es bei Bedarf.
     * @param {DrawableObject} object - Einzelnes Spielobjekt.
     */
    addToMap(object) {
        if (!object.img.complete || object.img.naturalWidth === 0) return;

        if (!object.otherDirection) {
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