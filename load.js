var loadState = {
    preload: function() {

        var loading = game.add.text(80, 150, 'loading...', {font: '30px Clarendon', fill: '#ffffff'});

        game.load.crossOrigin = 'anonymous';

        game.load.image('home', 'sprites/menu.png');

        game.load.spritesheet('player', 'sprites/player demo.png', 113*3, 54*3, 26);
        game.load.spritesheet('fiore', 'sprites/persefone/fiore.png', 16*3, 16*3, 6);

        game.load.spritesheet('petal', 'sprites/petals/petal.png', 16*3, 16*3, 3);
        game.load.image('petal', 'sprites/petals/petal light.png')

        game.load.tilemap('map', 'sprites/tilemap/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('test', 'sprites/tilemap/test.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset cave', 'sprites/tilemap/tileset cave.png');
        game.load.image('bg', 'sprites/background.png');

        game.load.spritesheet('spark1', 'sprites/sparks/spark1.png', 76, 68, 3);
        game.load.spritesheet('spark2', 'sprites/sparks/spark2.png', 60, 60, 4);
        game.load.spritesheet('spark3', 'sprites/sparks/spark3.png', 60, 60, 4);

        game.load.spritesheet('platform1', 'sprites/moving plat.png', 64*3, 48*3, 4);

        game.load.image('stairs1', 'sprites/stairs demo 1.png');

        game.load.image('bud', 'sprites/bud demo.png');

        game.load.image('wall1', 'sprites/secrets/wall 1.png')

        game.load.spritesheet('patrol', 'sprites/enemies/patrol.png', 40*3, 32*3, 5);
        game.load.spritesheet('turret', 'sprites/enemies/turret.png', 23*3, 37*3, 6);
        game.load.image('turret-bullet', 'sprites/enemies/turret-bullet.png');

        game.load.spritesheet('hades', 'sprites/hades/hades-big.png', 50*3, 60*3, 24);
        game.load.spritesheet('hades-plat', 'sprites/hades/platform.png', 225, 414, 6);
        game.load.spritesheet('pillar', 'sprites/hades/pillar.png', 32*3, 64*3, 8);
        game.load.spritesheet('hades-bullet', 'sprites/hades/hades-bullet.png', 22*3, 13*3, 3);
        game.load.spritesheet('explosion', 'sprites/hades/explosion.png', 162, 183);
        game.load.image('bossbar', 'sprites/hades/healthbar.png');
        game.load.image('platbar', 'sprites/hades/platbar.png');

        game.stage.scale.pageAlignHorizontally = true;
        game.stage.scale.pageAlignVeritcally = true;

        game.physics.arcade.TILE_BIAS = 64;

    },
    create: function() {
        game.state.start('menu');
    }
};
