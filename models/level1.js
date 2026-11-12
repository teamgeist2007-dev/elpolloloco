let level1;

function initLevel() {
    const coinImage = 'img/8_coin/coin_1.png';
    const bottleImage = 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png';

    const clouds = [
        [-140, 15],
        [300, 55],
        [740, 25],
        [1180, 65],
        [1620, 15],
        [2060, 45],
        [2500, 25]
    ].map(([x, y]) => {
        const cloud = new Cloud();
        cloud.x = x;
        cloud.y = y;
        return cloud;
    });

    level1 = new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(480, true),
            new Chicken(840, true),
            new Chicken(1240, true),
            new Chicken(1650, true),
            new Chicken(1950, true),
            new Endboss()
        ],
        clouds,
        [
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
            new CollectibleObject(bottleImage, 250, 340),
            new CollectibleObject(bottleImage, 690, 340),
            new CollectibleObject(bottleImage, 1130, 340),
            new CollectibleObject(bottleImage, 1570, 340),
            new CollectibleObject(bottleImage, 2010, 340),
            new CollectibleObject(bottleImage, 2210, 340)
        ]
    );
}