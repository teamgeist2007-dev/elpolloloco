/**
 * Ergänzt zusätzliche Hühner, höheres Tempo und acht Flaschen für Level 3.
 * @param {Level} level - Frischer Aufbau von Level 2.
 * @returns {Level} Fertiges drittes Level.
 */
function initLevel3(level) {
    level.enemies.push(
        new Chicken(1180),
        new Chicken(2030),
        new Chicken(1460, true),
        new Chicken(2100, true)
    );

    level.enemies.forEach((enemy) => {
        if (enemy instanceof Chicken) {
            enemy.speed = 1.05 + Math.random() * 0.35;
        }

        if (enemy instanceof Endboss) {
            enemy.speed = 4.2;
        }
    });

    const bottleImage = 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png';

    level.bottles.push(
        new CollectibleObject(bottleImage, 840, 340),
        new CollectibleObject(bottleImage, 1850, 340)
    );

    // Verschiebt den dritten Chip weg von der zusätzlichen Flasche.
    level.chips[2].x = 800;
    level.chips[2].y = 260;

    return level;
}