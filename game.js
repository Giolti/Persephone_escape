/*costanti*/
GRAVITY = 3000;

PLAYER_MAXLIVES = 5;
PLAYER_MAXHEALTH = 5;
WHIP_DAMAGE = 4;
SHOT_DAMAGE = 5;
SHOT_SPEED = 1000;
PLAYER_FIRERATE = 400;

PLAYER_LOCKOUT = 500;
PLAYER_INVTIME = 1000;
ENEMY_INVTIME = 500;

PLAYER_SPEED = 500;
PLAYER_JUMP = 1100;
PLAYER_ACC = 40;
CLIMB_SPEED = 400;
JUMP_TIME = 250;

KNOCKBACK_X = 200;
KNOCKBACK_Y = 1000;

PATROL_SPEED = 250;

PATROL_HEALTH = 8;
TURRET_HEALTH = 4;

TURRET_RANGE_X = 600;
TURRET_RANGE_Y = 600;
TURRET_FIRERATE = 2000;

HADES_PLAT_HEALTH = 25;
HADES_HEALTH = 100;

HADES_PILLAR_RECOVERY = 1000;

HADES_FAN_OFF = 5;
HADES_FAN_STEP = 30;
HADES_FAN_NUMBER = 5;
HADES_FAN_TIMEOFF = 300;
HADES_FAN_RECOVERY = 2500;

PLATFORM_SPEED = 300;
PLATFORM_STOPTIME = 1000;

MAXCAMOFFSET = 100;

/*init variabili*/
 var player;
 var hitbox;

 var healthbar;

 var patrols;
 var turrets;

 var hades;
 var colonne;

 var petals;
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
 var shadow;
 var layer;
 var bg;

 var camOffset;
 var startJump;

 var temp;
 var canJump;

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('credit', creditState);
game.state.add('test', testState);

game.state.start('boot');
