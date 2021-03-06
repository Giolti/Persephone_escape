/*costanti*/
GRAVITY = 3000;

PLAYER_MAXLIVES = 5;
PLAYER_MAXHEALTH = 5;
WHIP_DAMAGE = 4;
SHOT_DAMAGE = 1;
SHOT_SPEED = 1000;
PLAYER_FIRERATE = 100;

PLAYER_LOCKOUT = 500;
PLAYER_INVTIME = 1000;
SHOT_INVTIME = 100;
HIT_INVTIME = 500;

PLAYER_SPEED = 500;
PLAYER_JUMP = 1400;
PLAYER_SHORTJUMP = 800;
PLAYER_ACC = 40;
CLIMB_SPEED = 400;
JUMP_TIME = 250;

KNOCKBACK_X = 300;
KNOCKBACK_Y = 700;

PATROL_SPEED = 250;

PATROL_HEALTH = 8;
TURRET_HEALTH = 4;
TITAN_HEALTH = 20;

TURRET_RANGE_X = 600;
TURRET_RANGE_Y = 600;
TURRET_FIRERATE = 2000;

HADES_PLAT_HEALTH = 40;
HADES_HEALTH = 100;

HADES_PILLAR_RECOVERY = 1000;

HADES_FAN_SPEED = 500;
HADES_FAN_OFF = 8;
HADES_FAN_STEP = 25;
HADES_FAN_NUMBER = 5;
HADES_FAN_TIMEOFF = 200;
HADES_FAN_RECOVERY = 2500;

PLATFORM_SPEED = 300;
PLATFORM_STOPTIME = 1000;

ELEVATOR_CALL_SPEED = 700;

MAXCAMOFFSET = 100;

/*init variabili*/
var slides;

var player;
var hitbox;

var healthbar;

var patrols;
var turrets;
var titans;

var hades;
var colonne;

var trigger;
var torchesEx;

var victory;

var petals;
var flowers;

var pause;
var pausemenu;
var pausebg;

var gun;

var platforms;
var stairs = [];
var buds;
var walls;
var elevator;

var sparks1;
var sparks2;
var sparks3;
var cables;
var cableResp;

var servers;
var movement;
var caution;
var screenJ;
var screenSPACE;

var porte;

var black;

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

var text;

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('story', storyState);
game.state.add('credit', creditState);
game.state.add('win', winState);

game.state.start('boot');
