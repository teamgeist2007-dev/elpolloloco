// Zeigt Pepes verbleibende Lebenspunkte an.
class StatusBar extends DrawableObject {
    // Bilder der Anzeige von leer bis voll.
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    percentage = 100;

    // Lädt die Bilder und legt Position, Größe und Startwert der Anzeige fest.
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    // Speichert den neuen Lebenswert und wählt das Bild für die Anzeige aus.
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    // Ordnet Pepes Lebenswert einer der sechs Balkenstufen zu.
    resolveImageIndex() {
        return Math.floor(this.percentage / 20);
    }

    // Zeichnet den Balken und den genauen Wert, damit auch kleine Treffer sichtbar sind.
    draw(ctx) {
        super.draw(ctx);

        ctx.save();
        ctx.fillStyle = '#302016';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.percentage + '%', this.x + 109, this.y + 39);
        ctx.restore();
    }
}