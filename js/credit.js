var exit;
var text;
var noi;

var creditState = {
    create: function() {

        /*setup*/{
        game.camera.flash(0x000000, 500);
        camOffset = MAXCAMOFFSET;

        player = game.add.sprite(93*3, 573, 'player', 0);
        player.y -= player.height;

        player.facingRight = true;
        player.anchor.x = (42*3)/player.width;

        player.animations.add('idle', [0,1,2,3], 4);
        player.animations.add('walk', [4,5,6,7,8,9,10,11], 15);

        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
        player.body.offset.setTo(42*3, 16*3);
        player.body.setSize(2, 38*3);
        player.body.maxVelocity.x = PLAYER_SPEED;

        leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
        upButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
        downButton = game.input.keyboard.addKey(Phaser.Keyboard.S);

        player.goRight = function(){
            player.facingRight = true;
            player.scale.x = 1;
            player.body.velocity.x = PLAYER_SPEED;
        }

        player.goLeft = function(){
            player.facingRight = false;
            player.scale.x = -1;
            player.body.velocity.x = -PLAYER_SPEED;
        }

        player.stop = function(){
            player.body.velocity.x = 0;
        }
        }

        var bg = game.add.sprite(0,0, 'credits');
        game.world.setBounds(0, 0, bg.width, bg.height);

        player.bringToTop();

        exit = game.add.sprite(0, 0, 'exit');
        exit.x = game.world.width - exit.width;
        game.physics.arcade.enable(exit);

        noi = game.add.physicsGroup();

        noi.create(200*3, 0).text = 'DAVIDE AGOSTINELLI\n3D Artist';
        noi.create(247*3, 0).text = 'BIANCA BURATTI\n3D Artist';
        noi.create(272*3, 0).text = 'IRENE BENECCHI\nPixel Artist';
        noi.create(598*3, 0).text = 'MARCO CORETTI\nPixel Artist';
        noi.create(628*3, 0).text = 'ELISA DE BENEDETTIS\nProgrammer/Pixel Artist';
        noi.create(667*3, 0).text = 'ALICE DEZIO\n3D Artist';
        noi.create(756*3, 0).text = 'SIMONE FUMAGALLI\n3D Texture';
        noi.create(831*3, 0).text = 'GIULIA GNESSI\nPixel Artist';
        noi.create(860*3, 0).text = 'MARTA GAGGI\n3D Artist';
        noi.create(980*3, 0).text = 'EMANUELE GRANDI\nGame Designer/Pixel Artist';
        noi.create(1084*3, 0).text = 'ENRICO ISIDORI\nPixel Artist';
        noi.create(1111*3, 0).text = 'TOMMASO ZOCCHE\n3D Artist';

        noi.setAll('height', 768);
        noi.setAll('width', 72);


        text = game.add.text(0, 0, 'il meccanismo\nnon si muove', {font: '30px lores-12', fontWeight: 700, fill: '#ffffff', boundsAlignH: 'center', align: 'center'})
        text.setTextBounds(0, 600, 1024, 168);
        text.fixedToCamera = true;

    },

    update: function() {

        game.physics.arcade.overlap(player, exit, function(){
            game.camera.fade(0x000000, 1000);
            game.camera.onFadeComplete.addOnce(function(){
                game.state.start('menu');
            })
        })

        text.text = '';

        if(leftButton.isDown){
            player.goLeft();
            player.play('walk');
        }
        else if(rightButton.isDown){
            player.goRight();
            player.play('walk');
        }
        else {
            player.stop();
            player.play('idle');
        }

        //camera
        if(player.scale.x == 1)  {

            if(camOffset < MAXCAMOFFSET)
                camOffset += 5;

        }
        else {

            if(camOffset > -MAXCAMOFFSET)
                camOffset -= 5;
        }


        game.camera.focusOnXY(player.x+camOffset, player.y);
    },

    preRender: function() {

        game.physics.arcade.overlap(player, noi, function(p, noi){text.text = noi.text;});
    }
};
