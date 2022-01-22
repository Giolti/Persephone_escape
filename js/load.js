var loadState = {
    preload: function() {

        var loading = game.add.text(game.width/2, game.height/2, 'loading...', {font: '30px lores-12', fill: '#ffffff'});
        loading.x -= loading.width/2;
        loading.y -= loading.height/2;

        game.load.crossOrigin = 'anonymous';

        game.load.image('home', 'sprites/storia/menu-sfondo.png');

        game.load.image('pause', 'sprites/misc/pause.png');

        game.load.spritesheet('pausatasti', 'sprites/storia/pausa-menu.png', 1024, 768, 3);
        game.load.image('pausamenu', 'sprites/storia/pausa-sfondo.png');

        game.load.spritesheet('menutasti', 'sprites/storia/menu-tasti.png', 1024, 768, 4);

        game.load.spritesheet('slides', 'sprites/storia/storia.png', 1024, 768, 3);

        game.load.spritesheet('player', 'sprites/persefone/persefone.png', 113*3, 54*3);
        game.load.spritesheet('fiore', 'sprites/persefone/fiore.png', 16*3, 16*3, 6);

        game.load.spritesheet('petal', 'sprites/petals/petal.png', 64, 70, 3);
        game.load.spritesheet('flower', 'sprites/petals/flower.png', 192, 210);
        game.load.spritesheet('gun', 'sprites/misc/gun.png', 48, 90, 16, 0, 1);

        game.load.image('black', 'sprites/persefone/deathscreen.png');

        game.load.tilemap('map', 'sprites/tilemap/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('test', 'sprites/tilemap/test.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset cave', 'sprites/tilemap/tileset cave.png');
        game.load.image('bg', 'sprites/sfondo.png');

        game.load.spritesheet('spark1', 'sprites/sparks/spark1.png', 76, 68, 3);
        game.load.spritesheet('spark2', 'sprites/sparks/spark2.png', 60, 60, 4);
        game.load.spritesheet('spark3', 'sprites/sparks/spark3.png', 60, 60, 4);
        game.load.spritesheet('cables', 'sprites/sparks/cavi.png', 48*3, 24*3);

        game.load.spritesheet('platform1', 'sprites/moving plat.png', 62*3, 48*3, 3, 0, 1);
        game.load.spritesheet('elevator', 'sprites/ascensore.png', 288, 180, 2, 0, 1);

        game.load.spritesheet('bluebutton', 'sprites/misc/bluebutton.png', 20*3, 17*3);
        game.load.spritesheet('redbutton', 'sprites/misc/redbutton.png', 20*3, 17*3);

        game.load.image('stairs1', 'sprites/stairs demo 1.png');
        game.load.spritesheet('rampicante', 'sprites/liane/rampicante.png', 32*3, 16*3);

        game.load.image('bud', 'sprites/liane/germoglio.png');

        game.load.image('wall1', 'sprites/secrets/wall 1.png')

        game.load.spritesheet('patrol', 'sprites/enemies/patrol.png', 40*3, 32*3, 5);
        game.load.spritesheet('turret', 'sprites/enemies/turret.png', 23*3, 37*3, 6);
        game.load.image('turret-bullet', 'sprites/enemies/turret-bullet.png');
        game.load.spritesheet('titan', 'sprites/enemies/titan.png', 43*3, 37*3);
        game.load.spritesheet('claw', 'sprites/enemies/claw.png', 34*3, 45*3);

        game.load.spritesheet('hades', 'sprites/hades/hades.png', 54*3, 98*3);
        game.load.spritesheet('hades-plat', 'sprites/hades/platform.png', 100*3, 75*3, -1, 0, 1);
        game.load.spritesheet('pillar', 'sprites/hades/pillar.png', 32*3, 64*3, 8);
        game.load.spritesheet('hades-bullet', 'sprites/hades/hades-bullet.png', 22*3, 13*3, 3);
        game.load.spritesheet('explosion', 'sprites/hades/explosion.png', 162, 183);
        game.load.image('bossbar', 'sprites/hades/healthbar.png');
        game.load.image('platbar', 'sprites/hades/platbar.png');

        game.load.spritesheet('torch', 'sprites/misc/torcia1.png', 56, 58);
        game.load.spritesheet('server', 'sprites/misc/server.png', 44*3, 64*3, 3, 0, 1);

        game.load.spritesheet('pifferaio', 'sprites/misc/pifferaio.png', 141, 144, 2, 0, 1);

        game.load.spritesheet('door', 'sprites/misc/porta.png', 48, 48*4, 16, 0, 1);

        game.load.spritesheet('movescreen', 'sprites/schermi/movement.png', 192, 144, 4, 0, 1);
        game.load.spritesheet('caution', 'sprites/schermi/enemies.png', 192, 144, 4, 0, 1);
        game.load.spritesheet('screenJ', 'sprites/schermi/screenJ.png', 192, 144, 2, 0, 1);
        game.load.spritesheet('screenSPACE', 'sprites/schermi/screenSPACE.png', 192, 144, 2, 0, 1);
        game.load.spritesheet('screenGUN', 'sprites/schermi/screenGUN.png', 192, 144, 4, 0, 1);

        game.load.image('text', 'sprites/text/textbox.png');
        game.load.spritesheet('pressJ', 'sprites/text/jbutton.png', 22, 22, 2);
        game.load.spritesheet('pressJ-2', 'sprites/text/jbutton2.png', 44, 44, 2);

        game.load.image('win', 'sprites/storia/win.png');
        game.load.image('badend', 'sprites/storia/finalemezzo.png');
        game.load.image('gameover', 'sprites/storia/gameover.png')

        game.load.image('credits', 'sprites/credits/crediti.png');
        game.load.image('exit', 'sprites/credits/exit.png');

        game.stage.scale.pageAlignHorizontally = true;
        game.stage.scale.pageAlignVeritcally = true;

        game.physics.arcade.TILE_BIAS = 96;

    },
    create: function() {
        game.state.start('menu');
    }
};
