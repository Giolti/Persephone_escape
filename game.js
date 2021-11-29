/**
 * Generated from the Phaser Sandbox
 *
 * //phaser.io/sandbox/GNtOKwPt
 *
 * This source requires Phaser 2.6.2
 */

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    //game.stage.backgroundColor = '#85b5e1';
    //game.load.baseURL = 'http://examples.phaser.io/assets/';
    game.load.crossOrigin = 'anonymous';


    game.load.spritesheet('player', 'sprites/player demo.png', 226, 108, 23);
    game.load.tilemap('map', 'sprites/tilemap/tilemap demo.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset demo', 'sprites/tilemap/tileset demo.png');
    game.load.image('platform1', 'sprites/moving plat.png');

    //game.load.spritesheet('weapon', 'sprites/hitbox demo.png', 60, 20, 2);

    game.load.image('enemy', 'sprites/enemy demo.png');

    game.stage.scale.pageAlignHorizontally = true;
    game.stage.scale.pageAlignVeritcally = true;

    game.physics.arcade.TILE_BIAS = 64;

}

var player;
var platforms;
var cursors;
var jumpButton;
var attackButton;
var hitbox;
var map;
var layer;

const GRAVITY = 2000;

const PLAYER_SPEED = 800;
const PLAYER_JUMP = 1100;
const JUMP_TIME = 250;

const PLATFORM_SPEED = 400;
const PLATFORM_STOPTIME = 1000;

const MAXCAMOFFSET = 100;

function create() {

    map = game.add.tilemap('map');
    map.addTilesetImage('tileset demo');

    layer = map.createLayer("cave");
    layer.resizeWorld();
    //layer.debug = true;

    map.setCollisionBetween(1,16);

    player = game.add.sprite(448, 6784, 'player', 0);
    player.y -= player.height;

    hitbox = game.add.sprite();
    player.addChild(hitbox);
    hitbox.y = 36;

    enemy = game.add.sprite(768, 6784, 'enemy');
    enemy.y -= enemy.height;

    player.animations.add('idle', [0]);
    player.animations.add('walk', [1,2,3,4,5,6,7,8], 20);
    attackAnim = player.animations.add('attack', [9,10,11,12,13,14,15,16,17,18,19,20,21,22], 40);

    attackAnim.onStart.add(function () {
        //player.weapon = new Phaser.Rectangle(player.x, player.y, 44, 12);
        game.time.events.add(250, function () { hitbox.active = true; }, this);
    }, this);

    attackAnim.onComplete.add(function () {
        hitbox.active = false;
        player.isAttacking = false;
        player.animations.play('idle');
        /*player.weapon = new Phaser.Rectangle;*/

    }, this);

    player.facingRight = true;
    player.jumping = false;
    player.anchor.x = 94/player.width;

    game.physics.arcade.enable(player);
    game.physics.arcade.enable(hitbox);
    game.physics.arcade.enable(enemy);
    game.physics.arcade.enable(layer);

    hitbox.body.setSize(88,24);
    hitbox.body.offset.setTo(44, 0);
    hitbox.active = false;

    player.body.collideWorldBounds = true;
    player.body.gravity.y = GRAVITY;
    player.body.offset.setTo(78, 18);
    player.body.setSize(36, 88);

    platforms = game.add.physicsGroup();

    platform1 = platforms.create(24*64, 102*64, 'platform1');
    platform1.startX = platform1.position.x;
    platform1.endX = 38*64;
    platform1.goingRight = true;
    platform1.stop = false;

    platforms.setAll('body.immovable', true);

    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    attackButton = game.input.keyboard.addKey(Phaser.Keyboard.J);

}

var camOffset = MAXCAMOFFSET;
var startJump = 0;

function update () {

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(enemy, layer);
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(hitbox, enemy, hit);

    game.camera.focusOnXY(player.x+camOffset, player.y);

    if(platform1.stop) {
      platform1.body.velocity.x = 0;
    }
    else if(platform1.goingRight) {

        if(platform1.position.x > platform1.endX) {
            platform1.stop = true;
            game.time.events.add(PLATFORM_STOPTIME, function () { platform1.goingRight = false; platform1.stop = false; }, this);
        }
        else
            platform1.body.velocity.x = PLATFORM_SPEED;

    }
    else {

        if(platform1.position.x < platform1.startX) {
            platform1.stop = true;
            game.time.events.add(PLATFORM_STOPTIME, function () { platform1.goingRight = true; platform1.stop = false; }, this);
        }
        else
            platform1.body.velocity.x = -PLATFORM_SPEED;

    }

    if(player.facingRight)  {

        if(camOffset < MAXCAMOFFSET)
            camOffset += 5;

    }
    else {

        if(camOffset > -MAXCAMOFFSET)
            camOffset -= 5;
    }

    if (leftButton.isDown)
    {
        player.body.velocity.x = -PLAYER_SPEED;

        if((player.body.onFloor() || player.body.touching.down)  && !player.isAttacking)
        {
            player.facingRight = false;
            player.scale.x = -1;
            player.animations.play('walk');
        }
    }
    else if (rightButton.isDown)
    {
        player.body.velocity.x = PLAYER_SPEED;

        if((player.body.onFloor() || player.body.touching.down)  && !player.isAttacking)
        {
          player.facingRight = true;
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

    if (player.body.onFloor() || player.body.touching.down)
    {
        player.jumping = false;
        console.log('stop');
    }

    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down))
    {
        player.jumping = true;
        startJump = game.time.now;
        player.body.position.y -= 1;
        game.time.events.add(JUMP_TIME, function () { player.jumping = false; console.log('going down')}, this);
        console.log('starting jump')

    }

    if (player.jumping && jumpButton.isDown)
    {
        player.body.velocity.y = - (PLAYER_JUMP * Math.sqrt((game.time.now - startJump)/JUMP_TIME));
        console.log('going up');
    }
    else
    {
        player.jumping = false;
    }

    if(attackButton.isDown && !player.isAttacking)
    {
        player.isAttacking = true;
        player.animations.play('attack');
    }

    if(player.isAttacking)
    {
        //  player.weapon.y = player.y + player.height * 0.4;

        if (player.facingRight)
        {
            //player.weapon.x = player.x + 23;
            hitbox.scale.x = 1;
        }
        else
        {
            //player.weapon.x = player.x - 23 - player.weapon.width;
            hitbox.scale.x = -1;
        }
    }
}

function hit(hit, e) {

    if(hitbox.active)
        e.kill();
        game.time.events.add(1500, function () { e.position.x = 800; e.revive(); }, this);

}

function render () {

  game.debug.spriteBounds(player, '#0000ff', false);
  game.debug.spriteBounds(hitbox, '#ffff00', false);
  game.debug.body(enemy, '#000000', false);
  if(hitbox.active)
    game.debug.body(hitbox, '#ff0000', false);
  game.debug.body(player, '#00ffff', false);

}
