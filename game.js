/**
 * Generated from the Phaser Sandbox
 *
 * //phaser.io/sandbox/GNtOKwPt
 *
 * This source requires Phaser 2.6.2
 */

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.stage.backgroundColor = '#85b5e1';

    //game.load.baseURL = 'http://examples.phaser.io/assets/';
    game.load.crossOrigin = 'anonymous';

    game.load.spritesheet('player', 'sprites/player demo.png', 113, 54, 23);
    game.load.image('platform', 'http://examples.phaser.io/assets/sprites/platform.png');
    game.load.spritesheet('weapon', 'sprites/hitbox demo.png', 60, 20, 2);

    game.stage.scale.pageAlignHorizontally = true;
    game.stage.scale.pageAlignVeritcally = true;

}

var player;
var platforms;
var cursors;
var jumpButton;
var attackButton;

function create() {

    player = game.add.sprite(100, 400, 'player', 0);

    player.weapon = new Phaser.Rectangle();

    player.animations.add('idle', [0]);
    player.animations.add('walk', [1,2,3,4,5,6,7,8], 20);
    attackAnim = player.animations.add('attack', [9,10,11,12,13,14,15,16,17,18,19,20,21,22], 40);
    attackAnim.onStart.add(function () {player.weapon = new Phaser.Rectangle(player.x, player.y, 44, 12);}, this);
    attackAnim.onComplete.add(function () {player.isAttacking = false; player.weapon = new Phaser.Rectangle; console.log("completed");}, this);

    player.facingRight = true;
    player.anchor.x = 46/player.width;

    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true;
    player.body.gravity.y = 1000;

    platforms = game.add.physicsGroup();

    platforms.create(0, 450, 'platform').scale.setTo(3);

    platforms.setAll('body.immovable', true);

    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    attackButton = game.input.keyboard.addKey(Phaser.Keyboard.J);

}

function update () {

    game.physics.arcade.collide(player, platforms);

    if (leftButton.isDown)
    {
        player.body.velocity.x = -250;

        if((player.body.onFloor() || player.body.touching.down)  && !player.isAttacking)
        {
            player.facingRight = false;
            console.log(player.width);
            player.scale.x = -1;
            player.animations.play('walk');
        }
    }
    else if (rightButton.isDown)
    {
        player.body.velocity.x = 250;

        if((player.body.onFloor() || player.body.touching.down)  && !player.isAttacking)
        {
          player.facingRight = true;
          console.log(player.width);
          player.scale.x = 1;
          player.animations.play('walk');
        }
    }
    else
    {
        if(!player.isAttacking)
            player.animations.play('idle');

        player.body.velocity.x = 0;
    }

    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down))
    {
        player.body.velocity.y = -400;
    }

    if(attackButton.isDown && !player.isAttacking)
    {
        player.isAttacking = true;
        player.animations.play('attack');
    }

    if(player.isAttacking)
    {
        player.weapon.y = player.y + player.height * 0.4;

        if (player.facingRight)
        {
            player.weapon.x = player.x + 23;
        }
        else
        {
            player.weapon.x = player.x - 23 - player.weapon.width;
        }
    }
}

function render () {

    game.debug.geom(player.weapon,'#ff0000', false);

}.
