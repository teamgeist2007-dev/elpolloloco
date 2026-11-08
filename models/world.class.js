class World {
    character = new Character();
    level = level1;

    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);

        this.ctx.translate(-this.camera_x, 0);

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

    addToMap(object) {
        const { img, x, y, width, height } = object;

        if (img.complete && img.naturalWidth > 0) {
            let drawX = x;

            if (object.otherDiretion) {
                this.ctx.save();
                this.ctx.translate(x + width, 0);
                this.ctx.scale(-1, 1);
                drawX = 0;
            }

            this.ctx.drawImage(img, drawX, y, width, height);

            if (object.otherDiretion) {
                this.ctx.restore();
            }
        }
    }
}