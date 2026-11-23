let level1;

/**
 * Baut das erste Level zu Beginn einer Runde neu auf.
 */
function initLevel() {
    const coinImage = 'img/8_coin/coin_1.png';
    const bottleImage = 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png';

    // Verteilt die Wolken über das Level.
    const clouds = [
        new Cloud(-140, 15),
        new Cloud(300, 55),
        new Cloud(740, 25),
        new Cloud(1180, 65),
        new Cloud(1620, 15),
        new Cloud(2060, 45),
        new Cloud(2500, 25)
    ];

    level1 = new Level(
        [
            // Die Zahl bestimmt die Position. true erstellt ein kleines Huhn.
            new Chicken(620),
            new Chicken(1000),
            new Chicken(1380),
            new Chicken(730, true),
            new Chicken(840, true),
            new Chicken(1240, true),
            new Chicken(1650, true),
            new Chicken(1950, true),
            new Endboss()
        ],
        clouds,
        [
            // Himmel und Landschaft werden in mehreren Ebenen gezeichnet.
            new BackgroundObject('img/5_background/layers/air.png', -719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

            new BackgroundObject('img/5_background/layers/air.png', 719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

            new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),

            new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3)
        ],
        [
            // Die zehn Münzen mit ihren Positionen.
            new CollectibleObject(coinImage, 350, 280),
            new CollectibleObject(coinImage, 500, 280),
            new CollectibleObject(coinImage, 650, 195),
            new CollectibleObject(coinImage, 950, 280),
            new CollectibleObject(coinImage, 1100, 280),
            new CollectibleObject(coinImage, 1250, 195),
            new CollectibleObject(coinImage, 1550, 280),
            new CollectibleObject(coinImage, 1700, 280),
            new CollectibleObject(coinImage, 1850, 195),
            new CollectibleObject(coinImage, 2150, 280)
        ],
        [
            // Die sechs Flaschen mit ihren Positionen.
            new CollectibleObject(bottleImage, 250, 340),
            new CollectibleObject(bottleImage, 690, 340),
            new CollectibleObject(bottleImage, 1130, 340),
            new CollectibleObject(bottleImage, 1570, 340),
            new CollectibleObject(bottleImage, 2010, 340),
            new CollectibleObject(bottleImage, 2210, 340)
        ]
    );
}