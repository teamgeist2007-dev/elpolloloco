/**
 * Ergänzt zusätzliche Hühner, höheres Tempo und heilende Chips für Level 2.
 * @param {Level} level - Frischer Aufbau von Level 1.
 * @returns {Level} Fertiges zweites Level.
 */
function initLevel2(level) {
    level.enemies.push(
        new Chicken(920),
        new Chicken(1600),
        new Chicken(1120, true),
        new Chicken(1820, true)
    );

    level.enemies.forEach((enemy) => {
        if (enemy instanceof Chicken) {
            enemy.speed = 0.7 + Math.random() * 0.3;
        }

        if (enemy instanceof Endboss) {
            enemy.speed = 3.6;
        }
    });

    const positions = [
        [350, 375],
        [570, 210],
        [820, 310],
        [1010, 210],
        [1250, 330],
        [1450, 225],
        [1620, 230],
        [1770, 375],
        [1960, 245],
        [2110, 375]
    ];

    level.chips = positions.map(([x, y]) => {
        const chip = new CollectibleObject(
            'img/neueFutures/tortilla-chip.svg',
            x,
            y
        );

        chip.width = 36;
        chip.height = 36;
        return chip;
    });

    return level;
}