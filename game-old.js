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

    game.load.image('home', 'sprites/menu.png');

    game.load.spritesheet('player', 'sprites/player demo.png', 452, 216, 25);

    game.load.tilemap('map', 'sprites/tilemap/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset cave', 'sprites/tilemap/tileset cave.png');

    game.load.spritesheet('spark1', 'sprites/sparks/spark1.png', 76, 68, 3);
    game.load.spritesheet('spark2', 'sprites/sparks/spark2.png', 60, 60, 4);
    game.load.spritesheet('spark3', 'sprites/sparks/spark3.png', 60, 60, 4);

    game.load.spritesheet('platform1', 'sprites/moving plat.png', 64*4, 48*4, 2);

    game.load.image('stairs1', 'sprites/stairs demo 1.png');

    game.load.image('bud', 'sprites/bud demo.png');

    game.load.image('wall1', 'sprites/secrets/wall 1.png')

    //game.load.spritesheet('weapon', 'sprites/hitbox demo.png', 60, 20, 2);

    game.load.image('patrol', 'sprites/pattuglia.png');

    game.stage.scale.pageAlignHorizontally = true;
    game.stage.scale.pageAlignVeritcally = true;

    game.physics.arcade.TILE_BIAS = 64;

}

/*init variabili*/{
var player;
var hitbox;

var patrols;

var platforms;
var stairs;
var buds;
var walls;

var sparks1;
var sparks2;
var sparks3;

var cursors;
var jumpButton;
var attackButton;

var map;
var layer;

var camOffset = MAXCAMOFFSET;
var startJump = 0;

var temp;
}

/*costanti*/{
const GRAVITY = 3500;

const PLAYER_SPEED = 700;
const PLAYER_JUMP = 1300;
const PLAYER_ACC = 80;
const CLIMB_SPEED = 400;
const JUMP_TIME = 250;

const PATROL_SPEED = 300;

const PLATFORM_SPEED = 400;
const PLATFORM_STOPTIME = 1000;

const MAXCAMOFFSET = 100;
}

function create() {

    /*tilemap*/{
    map = game.add.tilemap('map');
    map.addTilesetImage('tileset cave');

    map.createLayer("sfondo");
    layer = map.createLayer("cave");
    layer.resizeWorld();
    //layer.debug = true;
    //layer.debugSettings.collidingTileOverfill = '#ff0000';

    map.setCollisionBetween(0, 27, true, 'cave');
    map.setCollisionBetween(64, 82, true, 'cave');
    }

    /*player hitbox sprite*/{
    player = game.add.sprite(448, 6784, 'player', 0);
    player.y -= player.height;

    player.facingRight = true;
    player.jumping = false;
    player.climbing = false;
    player.anchor.x = 188/player.width;

    hitbox = game.add.sprite();
    player.addChild(hitbox);
    hitbox.y = 72;
    }

    /*player animations*/{
    player.animations.add('idle', [0,1], 2);
    player.animations.add('walk', [2,3,4,5,6,7,8,9], 15);
    attackAnim = player.animations.add('attack', [10,11,12,13,14,15,16,17,18,19,20,21,22,23], 40);

    /*hitbox activation*/{
    attackAnim.onStart.add(function () {
        //player.weapon = new Phaser.Rectangle(player.x, player.y, 44, 12);
        game.time.events.add(250, function () { hitbox.active = true; }, this);
    }, this);
    }

    /*hitbox deactivation*/{
    attackAnim.onComplete.add(function () {
        hitbox.active = false;
        player.isAttacking = false;
        player.animations.play('idle');
        /*player.weapon = new Phaser.Rectangle;*/

    }, this);
    }
    }

    /*graphics enable*/{
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(hitbox);
    game.physics.arcade.enable(layer);
    }

    /*hitbox physics*/{
    hitbox.body.setSize(176,48);
    hitbox.body.offset.setTo(88, 0);
    hitbox.active = false;
    }

    /*player physics*/{
    player.body.collideWorldBounds = true;
    player.body.gravity.y = GRAVITY;
    player.body.offset.setTo(34*4, 13*4);
    player.body.setSize(16*4, 41*4);
    }

    /*platforms*/{
    platforms = game.add.physicsGroup();

    platform1 = platforms.create(24*64, 103*64, 'platform1', 0);
    platform1.animations.add('plat', [0,1], 5, true);
    platform1.animations.play('plat');
    platform1.body.offset.setTo(1*4, 32*4);
    platform1.body.setSize(62*4, 6*4);
    platform1.startX = platform1.position.x;
    platform1.endX = 38*64;
    platform1.goingRight = true;
    platform1.stop = false;

    platforms.setAll('body.immovable', true);
    }

    /*stairs*/{
    stairs = game.add.physicsGroup();

    stairs1 = stairs.create(18*64, 76*64, 'stairs1');
    stairs1.active = false;
    stairs1.alpha = 0;
    }

    /*buds*/{
    buds = game.add.physicsGroup();

    bud1 = buds.create(18*64, 74*64, 'bud');
    bud1.active = true;
    bud1.stairs = 0;
    }

    /*secret walls*/{
    walls = game.add.physicsGroup();

    wall1 = walls.create(48*64, 103*64, 'wall1');
    walls.setAll('body.immovable', true);
    walls.forEach(function(wall)
    {
        wall.active = true;
    }, this);
    }

    /*patrols*/{
    patrols = game.add.physicsGroup();

    patrols.create(30*64, 110*64, 'patrol');
    patrols.create(54*64, 98*64, 'patrol');
    patrols.create(40*64, 78*64, 'patrol');
    patrols.create(16*64, 94*64, 'patrol');

    var patrolsMovePoints = [
      28, 38,
      51, 60,
      34, 61,
      6, 20
    ];
    temp = 0;

    patrols.forEach(function(patrol)
    {
        patrol.facing = 1;

        patrol.leftX = patrolsMovePoints[2*temp]*64 + patrol.width/2 + 1;
        patrol.rightX = patrolsMovePoints[2*temp+1]*64 - patrol.width/2 - 1;
        temp++;

        patrol.anchor.x = 0.5;
        console.log(patrol);
    }, this);
    }

    /*sparks*/{
    sparks1 = game.add.group();
    sparks1.create(23*64, 109*64, 'spark1', 1);


    sparks1.forEach(function(spark)
    {
        spark.y -= 28;

        temp = spark.animations.add('spark1', [1,0,1,2,1], 20);
        temp.onComplete.add(function()
        {
            game.time.events.add(500 + Math.random() * 2500, function()
            {
                spark.play('spark1');
            }, this);
        }, this);
        game.time.events.add(500 + Math.random() * 2500, function()
        {
            spark.play('spark1');
        }, this);
    }, this);

    sparks2 = game.add.group();
    sparks2.create(0, 102*64, 'spark2');
    sparks2.create(4*64, 108*64, 'spark2');
    sparks2.create(17*64, 101*64, 'spark2');

    sparks2.forEach(function(spark){
        spark.x += 20;
        spark.y -= 4;

        temp = spark.animations.add('spark2', [0,1,2,3,0], 20);
        temp.onComplete.add(function(){
            game.time.events.add(500 + Math.random() * 2500, function(){
                spark.play('spark2');
            }, this);
        }, this);
        game.time.events.add(500 + Math.random() * 2500, function(){
            spark.play('spark2');
        }, this);
    }, this);

    sparks3 = game.add.group();

    sparks3.create(13*64, 107*64, 'spark3', 3);

    sparks3.forEach(function(spark){
        spark.x -= 4;
        spark.y += 12;

        temp = spark.animations.add('spark3', [3,0,1,2,3], 20);
        temp.onComplete.add(function(){
            game.time.events.add(500 + Math.random() * 2500, function(){
                spark.play('spark3');
            }, this);
        }, this);
        game.time.events.add(500 + Math.random() * 2500, function(){
            spark.play('spark3');
        }, this);
    }, this);
    }

    /*setup camera*/
    player.bringToTop();
    game.camera.focusOnXY(player.x+camOffset, player.y);

    /*setup menu*/{
    home = game.add.sprite(game.camera.x, game.camera.y, 'home');
    game.started = false;

    var storia = game.add.sprite(home.x+65, home.y+408);
    storia.width = 296;
    storia.height = 62;

    var gioca = game.add.sprite(home.x+444, home.y+292);
    gioca.width = 138;
    gioca.height = 26;
    gioca.inputEnabled = true;
    gioca.events.onInputUp.add(function() {
        if(!game.started){
            game.started = true;
            game.paused = false;

            home.alpha = 0;
        }
    })
    }

    /*setup input*/{
    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
    upButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    attackButton = game.input.keyboard.addKey(Phaser.Keyboard.J);
    }

}

function update () {

    if(!game.started){
        game.paused = true;
    }
    else{
        game.paused = false;
    }

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(patrols, layer);
    game.physics.arcade.collide(player, platforms);

    walls.forEach(function(wall)
    {
        if(wall.active)
            game.physics.arcade.collide(player, wall);
    }, this);

    game.physics.arcade.overlap(hitbox, buds, grow, function(){return hitbox.active;});
    game.physics.arcade.overlap(hitbox, walls, fadeWall, function(){return hitbox.active;});

    game.camera.focusOnXY(player.x+camOffset, player.y);

    patrols.forEach(function(patrol)
    {
      if(patrol.facing == 1) {
          if(patrol.position.x >= patrol.rightX) {
              patrol.facing = -1;
              patrol.scale.x = patrol.facing;
          }
          else
              patrol.body.velocity.x = PATROL_SPEED;
      }
      else {
          if(patrol.position.x <= patrol.leftX) {
              patrol.facing = 1;
              patrol.scale.x = patrol.facing;
          }
          else
              patrol.body.velocity.x = -PATROL_SPEED;
      }
    }, this);

    if(!game.physics.arcade.overlap(player, stairs, climb))
    {
        player.climbing = false;
    }

    if(player.climbing)
        player.body.gravity.y = 0;
    else
        player.body.gravity.y = GRAVITY;

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

    if (leftButton.isDown && !player.isAttacking)
    {
        player.facingRight = false;
        player.scale.x = -1;

        if((player.body.onFloor() || player.body.touching.down) && !player.climbing)
        {
            player.body.velocity.x = -PLAYER_SPEED;
            player.animations.play('walk');
        }
        else if(player.climbing)
        {
            player.body.velocity.x = -PLAYER_SPEED;
        }
        else
        {
            if(player.body.velocity.x > -PLAYER_SPEED)
            {
                player.body.velocity.x += -PLAYER_ACC;
            }
            else
            {
                player.body.velocity.x = -PLAYER_SPEED;
            }
        }
    }
    else if (rightButton.isDown && !player.isAttacking)
    {
        player.facingRight = true;
        player.scale.x = 1;

        if((player.body.onFloor() || player.body.touching.down)  && !player.climbing)
        {
            player.body.velocity.x = PLAYER_SPEED;
            player.animations.play('walk');
        }
        else if(player.climbing)
        {
            player.body.velocity.x = PLAYER_SPEED;
        }
        else{
            if(player.body.velocity.x < PLAYER_SPEED){
                player.body.velocity.x += PLAYER_ACC;
            }
            else{
                player.body.velocity.x = PLAYER_SPEED;
            }
        }
    }
    else
    {
        if(!player.isAttacking && !player.climbing)
            player.animations.play('idle');

        if(player.body.onFloor() || player.body.touching.down)
            player.body.velocity.x = 0;
    }

    if ((player.body.onFloor() || player.body.touching.down) && !player.climbing)
    {
        player.jumping = false;
    }

    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down) && !player.climbing)
    {
        player.jumping = true;
        startJump = game.time.now;
        player.body.position.y -= 1;
        game.time.events.add(JUMP_TIME, function () { player.jumping = false;}, this);

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

    if (jumpButton.isDown && player.climbing)
    {

        player.climbing = false;
        player.jumping = true;
        startJump = game.time.now;
        game.time.events.add(JUMP_TIME, function () { player.jumping = false;}, this);

    }

    if(attackButton.isDown && !player.isAttacking && !player.climbing)
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

    e.kill();
    game.time.events.add(1500, function () { e.parent.alpha = 0; e.revive(); e.x = 800; e.parent.alpha = 1;}, this);
}

function climb(p, s) {

    if(s.active){
        if(player.climbing)
        {
            if(upButton.isDown){
                player.body.velocity.y = -CLIMB_SPEED;
            }
            else if(downButton.isDown){
                player.body.velocity.y = CLIMB_SPEED;
            }
            else{
              player.body.velocity.y = 0;
            }

        }
        else {

            if(upButton.isDown){
                player.climbing = true;
            }

        }
    }
    else{
      player.climbing = false;
    }
}

function grow(p, b) {

    if(b.active){

        var activeStairs = stairs.getAt(b.stairs);

        b.active = false;
        activeStairs.active = true;
        activeStairs.alpha = 1;

    }

}

function fadeWall(h, w) {
    if(w.active)
    {
        w.active = false;
        game.add.tween(w).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
    }
}

function render () {

  //game.debug.spriteBounds(player, '#0000ff', false);
  //game.debug.spriteBounds(hitbox, '#ffff00', false);
  //if(hitbox.active)
    //game.debug.body(hitbox, '#ff0000', false);
  //game.debug.body(player, '#00ffff', false);
  //game.debug.body(patrols, '#00ffff', false);

}
