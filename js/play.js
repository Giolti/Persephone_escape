var playState = {
    create: function() {

        game.camera.flash('#000000', 500);

        /*init variabili*/
        camOffset = MAXCAMOFFSET;

        /*tilemap*/
        map = game.add.tilemap('map');
        map.addTilesetImage('tileset cave');

        bg = game.add.sprite(0, 0, 'bg');
        bg.fixedToCamera = true;

        pause = game.add.sprite(0, 0, 'pause');
        pause.fixedToCamera = true;
        pause.cameraOffset.setTo(game.width - 40 - pause.width, 30);
        pause.inputEnabled = true;
        pause.events.onInputUp.add(pauseMenu);

        pausebg = game.add.sprite(0,0, 'pausamenu');
        pausebg.fixedToCamera = true;
        pausebg.alpha = 0;

        pausemenu = game.add.sprite(0,0, 'pausatasti');
        pausemenu.fixedToCamera = true;
        pausemenu.alpha = 0;

        map.createLayer("sfondo");
        map.createLayer("tubi");
        map.createLayer("pilastri");
        map.createLayer("catene");
        layer = map.createLayer("cave");
        map.createLayer("ombra cave")
        map.createLayer("stalattiti");
        map.createLayer("troni");
        layer.resizeWorld();

        map.setCollisionBetween(0, 96, true, 'cave');


        /*player sprite*/{
        player = game.add.sprite(7*48, 159*48, 'player', 0);
        player.y -= player.height;

        player.startX = player.x;
        player.startY = player.y;

        player.lives = PLAYER_MAXLIVES;
        player.health = PLAYER_MAXHEALTH;
        player.invincible = false;
        player.canMove = true;
        player.canJump = true;

        player.facingRight = true;
        player.anchor.x = (42*3)/player.width;
        }

        /*stato animazioni*/
        player.status = {
            isWalking: false,
            isAttacking: false,
            isJumping: false,
            isClimbing: false,
            isAscending: false,
            isDescending: false,
            isShooting: false,
            isKnocked: false,
            respawning: false
        }

        black = game.add.sprite(0,0,'black');
        black.fixedToCamera = true;
        black.alpha = 0;

        player.respawn = function(){

            game.camera.flash(0xffffff, 400);

            player.status = {
                isWalking: false,
                isAttacking: false,
                isJumping: false,
                isClimbing: false,
                isAscending: false,
                isDescending: false,
                isShooting: false,
                isKnocked: false,
                respawning: true
            }

            player.invincible = true;
            player.canMove = false;

            black.bringToTop();
            player.bringToTop();

            player.animations.play('pre-death');

            patrols.forEach(function(patrol){patrol.respawn();});
            turrets.forEach(function(turret){turret.respawn();});

            petals.forEach(function(petal){petal.respawn();})

            hades.respawn();

            var temp = game.add.tween(black).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true);
            temp.onComplete.addOnce(function(){
                player.animations.play('death').onComplete.addOnce(function(){
                    game.camera.fade(0x000000, 3000);
                    game.camera.onFadeComplete.addOnce(function(){

                        if(player.lives > 0){
                            player.x = player.startX;
                            player.y = player.startY;
                            player.status.respawning = false;

                            black.alpha = 0;

                            game.camera.flash(0xffffff, 1000);
                            game.camera.onFlashComplete.addOnce(function(){
                                player.canMove = true;
                                player.invincible = false;
                            })
                        }
                        else{
                            game.state.start('win')
                        }

                    });
                });
            });
        }

        /*player animations*/{
        player.animations.add('idle', [0,1,2,3], 4);
        player.animations.add('walk', [4,5,6,7,8,9,10,11], 15);
        player.animations.add('attack-run', [12,13,14,15,16,17,18,19], 15);
        player.animations.add('attack', [20,21,22,23,24,25,26,27], 15)
        player.animations.add('jump', [28,28,28], 60);
        player.animations.add('up', [29]);
        player.animations.add('down', [30]);
        player.animations.add('climb', [31,32,33,34,35,36], 8);
        player.animations.add('shoot', [37,38,39,40,41], 20);
        player.animations.add('shoot-up', [42,43,44,45,46], 20);
        player.animations.add('knock', [47], 5);
        player.animations.add('pre-death', [48,49,50,51,52,53,54,55,56,57,58,59,60], 10);
        player.animations.add('death', [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85], 10);

        player.animations.getAnimation('shoot').enableUpdate = true;
        player.animations.getAnimation('shoot').onUpdate.add(function(){
            if(player.frame == 39){
                if(player.facingRight){
                    player.weapon.fireAngle = Phaser.ANGLE_RIGHT;
                }
                else{
                    player.weapon.fireAngle = Phaser.ANGLE_LEFT;
                }
                player.weapon.fire();
            }
        });

        player.animations.getAnimation('shoot-up').enableUpdate = true;
        player.animations.getAnimation('shoot-up').onUpdate.add(function(){
            if(player.frame == 44){
                player.weapon.fireAngle = Phaser.ANGLE_UP;
                player.weapon.fire();
            }
        });
        }

        /*life hud*/
        healthbar = game.add.group();
        healthbar.fixedToCamera = true;
        healthbar.cameraOffset.setTo(40,30);

        for(var i = 0; i < PLAYER_MAXLIVES; i++){
            healthbar.create(i*16*3 + i*2*3, 0, 'fiore', 5);
            healthbar.getAt(i).num = i + 1;
        }


        /*physics enable*/{
        game.physics.arcade.enable(player);
        game.physics.arcade.enable(layer);
        }

        /*hitbox physics*/{
        hitbox = game.add.sprite();
        player.addChild(hitbox);

        game.physics.arcade.enable(hitbox);

        hitbox.body.setSize(52*3,19*3);
        hitbox.body.offset.setTo(5*3, 18*3);
        hitbox.active = false;
        }

        /*player physics*/{
        player.body.collideWorldBounds = true;
        player.body.gravity.y = GRAVITY;
        player.body.offset.setTo(36*3, 16*3);
        player.body.setSize(12*3, 38*3);
        player.body.maxVelocity.x = PLAYER_SPEED;
        }

        /*player weapon*/{
            player.hasWeapon = false;

            player.weapon = game.add.weapon(20, 'turret-bullet');
            player.weapon.fireRate = PLAYER_FIRERATE;
            player.weapon.trackSprite(player, 0, player.height/2);
            player.weapon.bulletSpeed = SHOT_SPEED;

            player.weapon.bullets.forEach(function(bullet){
                bullet.damage = SHOT_DAMAGE;
            })
        }

        /*petali*/{
        petals = game.add.physicsGroup();

        petals.create(12*48, 142*48, 'petal', 0);
        petals.create(75*48, 68*48, 'petal', 0);
        petals.create(33*48, 53*48, 'petal', 0);
        petals.create(87*48, 40*48, 'petal', 0);

        petals.forEach(function(petal){
            petal.animations.add('petal', [0,1,2,1], 5, true).play();

            petal.anchor.setTo(0.5, 0.5);

            petal.body.setSize(18, 18);
            petal.body.offset.setTo(23, 26);

            petal.active = true;

            petal.respawn = function(){
                petal.active = true;
                petal.alpha = true;
            }
        }, this);
        }

        /*fiori*/{
        flowers = game.add.physicsGroup();

        flowers.create(75*48, 163*48, 'flower', 0);
        flowers.create(28*48, 94*48, 'flower', 0);
        flowers.create(90*48, 59*48, 'flower', 0);

        flowers.forEach(function(flower){
            flower.animations.add('flower', [0,1,2,1], 5, true).play();

            flower.anchor.setTo(0.5, 0.5);

            flower.body.setSize(48, 48);
            flower.body.offset.setTo(72, 78);

            flower.active = true;
        })
        }

        /*piattaforme*/{
        platforms = game.add.physicsGroup();

        platform1 = platforms.create(40*48, 155*48, 'platform1', 0);
        platform2 = platforms.create(45*48, 110*48, 'platform1', 0);
        platform3 = platforms.create(39*48, 75*48, 'platform1', 0);
        platform4 = platforms.create(72*48, 61*48, 'platform1', 0);

        platforms.forEach(function(plat){
            plat.animations.add('plat', [0,1,2], 5, true);
            plat.animations.play('plat');
            plat.body.offset.setTo(1*3, 32*3);
            plat.body.setSize(62*3, 6*3);

            plat.active = true;

            plat.goingRight = false;
            plat.stop = false;
        }, this);

        platform1.startX = 38*48;
        platform1.endX = platform1.startX + 25*48;

        platform2.startX = 45*48;
        platform2.endX = platform2.startX + 40*48;

        platform3.startX = 24*48;
        platform3.endX = platform3.startX + 35*48;
        platform3.active = false;

        platform4.startX = 72*48;
        platform4.endX = platform4.startX + 11*48;

        platforms.setAll('body.immovable', true);

        platform3.button = game.add.sprite(62*48, 73*48, 'redbutton');
        game.physics.arcade.enable(platform3.button);
        }

        /*ascensore*/{
            elevator = game.add.sprite(94*48 + 24, 62*48, 'elevator');
            game.physics.arcade.enable(elevator);

            elevator.locked = true;
            elevator.stop = true;

            elevator.anchor.setTo(0, 96/144);

            elevator.body.immovable = true;
            elevator.body.setSize(288, 21);
            elevator.body.offset.setTo(0, 114);

            elevator.lowerY = 163*48;
            elevator.upperY = 62*48;

            elevator.buttons = game.add.physicsGroup();

            elevator.buttons.create(91*48, 63*48, 'bluebutton');
            elevator.buttons.create(91*48, 165*48, 'bluebutton');

            elevator.buttons.getAt(0).name = 'su';
            elevator.buttons.getAt(1).name = 'giu';

            elevator.buttons.getAt(1).text = game.add.text(0, 0, "Il meccanismo non si muove", {font: '18px lores-12', fontWeight: 700, fill: '#ffffff', wordWrap: true, wordWrapWidth: 48*3, boundsAlignH: "center"})
            elevator.buttons.getAt(1).text.setTextBounds(90*48, 162*48, 48*3, 48*1);
            elevator.buttons.getAt(1).text.alpha = 0;

            elevator.buttons.forEach(function(button){
                button.y -= 18;
                button.x -= 2;

                button.pressed = false;
            })
        }

        /*scale*/{
        stairs[0] = game.add.physicsGroup();
        stairs[1] = game.add.physicsGroup();
        stairs[2] = game.add.physicsGroup();
        stairs[3] = game.add.physicsGroup();

        stairs[0].x = 27*48;
        stairs[0].y = 115*48;

        stairs[1].x = 15*48;
        stairs[1].y = 84*48;

        stairs[2].x = 28*48;
        stairs[2].y = 17*48;

        stairs[3].x = 85*48;
        stairs[3].y = -2*48;

        stairs[0].createMultiple(29, 'rampicante', 1, true);
        stairs[1].createMultiple(30, 'rampicante', 1, true);
        stairs[2].createMultiple(38, 'rampicante', 1, true);
        stairs[3].createMultiple(17, 'rampicante', 1, true);

        for(var j = 0; j < stairs.length; j++){
            for(var i = 0; i < stairs[j].length; i++){
                stairs[j].getAt(i).y = i*16*3;
            }
            stairs[j].getAt(0).frame = 0;
            stairs[j].getAt(stairs[j].length - 1).frame = 2;

            stairs[j].active = true;
            stairs[j].setAll('alpha', 0);
        }


        stairs[2].active = true;
        stairs[3].active = true;

        stairs[2].setAll('alpha', 1);
        stairs[3].setAll('alpha', 1);
        }

        /*germogli*/{
        buds = game.add.physicsGroup();

        buds.create(27*48, 115*48, 'bud');
        buds.create(15*48, 84*48, 'bud');

        for(var i = 0; i < buds.length; i++){
            buds.getAt(i).active = true;
            buds.getAt(i).stairs = i;
        }
        }

        /*secret walls*/{
        walls = game.add.physicsGroup();

        wall1 = walls.create(70*48, 157*48, 'wall1');
        wall1.body.setSize(9*48, 12*48);
        wall1.body.offset.setTo(2*48, 0);

        walls.setAll('body.immovable', true);
        walls.forEach(function(wall)
        {
            wall.active = true;
        }, this);
        }

        /*creazione pattuglie*/{
        patrols = game.add.physicsGroup();

        patrols.create(42*48, 166*48, 'patrol');
        patrols.create(80*48, 148*48, 'patrol');
        patrols.create(25*48, 142*48, 'patrol');
        patrols.create(50*48, 130*48, 'patrol');
        patrols.create(82*48, 97*48, 'patrol');
        patrols.create(73*48, 52*48, 'patrol');
        patrols.create(42*48, 46*48, 'patrol');

        var patrolsMovePoints = [
            42, 56,
            79, 88,
            10, 20,
            40, 61,
            74, 91,
            72, 83,
            36, 53
        ];
        temp = 0;

        patrols.forEach(function(patrol)
        {
            patrol.facing = 1;

            patrol.leftX = patrolsMovePoints[2*temp]*48 + patrol.width/2 + 1;
            patrol.rightX = patrolsMovePoints[2*temp+1]*48 - 1;
            temp++;

            patrol.anchor.x = 0.5;
            patrol.body.setSize(30*3,28*3);
            patrol.body.offset.setTo(2*3,4*3);
            patrol.patrolling = true;
            patrol.active = true;

            patrol.health = PATROL_HEALTH;
            patrol.invincible = false;

            patrol.death = function (){
                this.body.velocity.x = 0;
                this.active = false;
                this.patrolling = false;
                this.alpha = 0;
            };

            patrol.updateLife = function(invtime){
                this.tint = 0xff0000;
                game.time.events.add(250, function(){
                    this.tint = 0xffffff;
                }, this)
                this.invincible = true;
                game.time.events.add(invtime, function(){this.invincible = false;}, this);
            }

            patrol.respawn = function(){
                this.active = true;
                this.patrolling = true;
                this.alpha = 1;
                this.health = PATROL_HEALTH;
                this.invincible = false;
            }

            patrol.hitbox = game.add.sprite();
            patrol.addChild(patrol.hitbox);
            game.physics.arcade.enable(patrol.hitbox);
            patrol.hitbox.body.setSize(50,20);
            patrol.hitbox.body.offset.setTo(patrol.body.width/2 - 15, patrol.height/2 - 10);
            patrol.hitbox.active = false;

            patrol.animations.add('move', [0,1,0,2], 5, true);
            patrol.animations.play('move');
        }, this);
        }

        /*creazione torrette*/{
        turrets = game.add.physicsGroup();

        turrets.create(103*48, 163*48 - 21, 'turret');
        turrets.create(57*48, 160*48 - 21, 'turret');
        turrets.create(40*48, 115*48 - 21, 'turret');
        turrets.create(83*48, 113*48 - 21, 'turret');
        turrets.create(102*48, 97*48 - 21, 'turret');
        turrets.create(86*48, 79*48 - 21, 'turret');
        turrets.create(21*48, 69*48 - 21, 'turret');
        turrets.create(34*48, 40*48 - 21, 'turret');
        turrets.create(30*48, 28*48 - 21, 'turret');

        turrets.forEach(function(turret)
        {
            turret.body.setSize(23*3,36*3);
            turret.body.offset.setTo(0*3,4*3);

            turret.animations.add('turret', [0,1,2,3,4,5], 5, true);
            turret.animations.play('turret');

            turret.active = true;

            turret.health = TURRET_HEALTH;
            turret.invincible = false;
            turret.death = function(){
                this.active = false;
                this.alpha = 0;
            }

            turret.updateLife = function(invtime){
                this.tint = 0xff0000;
                game.time.events.add(250, function(){
                    this.tint = 0xffffff;
                }, this)
                this.invincible = true;
                game.time.events.add(invtime, function(){this.invincible = false;}, this);
            }

            turret.respawn = function(){
                this.active = true;
                this.alpha = true;
                turret.health = TURRET_HEALTH;
                turret.invincible = false;
            }

            turret.weapon = game.add.weapon(20, 'turret-bullet');
            turret.weapon.trackSprite(turret, turret.width/2, 6*3);
            turret.weapon.fireRate = TURRET_FIRERATE;
            turret.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
            turret.weapon.bulletKillDistance = 800;

            turret.weapon.bullets.setAll('anchor.x', 0.5);
            turret.weapon.bullets.setAll('anchor.y', 0.5);
            turret.weapon.bullets.setAll('body.width', 2*3);
            turret.weapon.bullets.setAll('body.height', 2*3);
            turret.weapon.bullets.setAll('body.offset.x', 3*3);
            turret.weapon.bullets.setAll('body.offset.y', 3*3);

            turret.weapon.bullets.forEach(function(bullet){
                bullet.isBullet = true;
            })

            turret.rangeX = TURRET_RANGE_X;
            turret.rangeY = TURRET_RANGE_Y;
        }, this);
        }

        /*creazione miniboss*/{
            titans = game.add.physicsGroup();

            titans.create(47*48, 129*48, 'titan');
            titans.create(32*48, 96*48, 'titan');

            titans.forEach(function(titan){
                titan.y += 9;
                titan.animations.add('titan', [0,1,2,3,4,5,6,7], 15, true).play();

                titan.body.setSize(34*3, 33*3);
                titan.body.offset.setTo(0, 3*3);

                titan.active = true;
                titan.invincible = false;
                titan.health = TITAN_HEALTH;

                titan.death = function(){
                    this.active = false;
                    this.alpha = 0;
                };

                titan.updateLife = function(invtime){
                    this.tint = 0xff0000;
                    game.time.events.add(250, function(){
                        this.tint = 0xffffff;
                    }, this)
                    this.invincible = true;
                    game.time.events.add(invtime, function(){this.invincible = false;}, this);
                }

                titan.claw = game.add.sprite(40*3, 0, 'claw');
                titan.addChild(titan.claw);
                game.physics.arcade.enable(titan.claw);

                titan.knockback = true;
                titan.claw.knockback = true;

                titan.claw.animations.add('claw', [1,1,1,2,3,3,3,0], 10);
            });
        }

        /*cavi*/{
            cables = game.add.physicsGroup();

            for (var i = 0; i<3; i++){
                cables.create((93+i*3)*48, 166*48, 'cables');
            }

            for (var i = 0; i<9; i++){
                cables.create((33+i*3)*48, 82*48, 'cables');
            }

            for (var i = 0; i<2; i++){
                cables.create((36+i*3)*48, 98*48, 'cables');
            }

            function randomCable(){
                var temp = Math.floor(Math.random()*3) + 1;

                var time = Math.random()*800 + 200;

                game.time.events.add(time, function(){
                    this.animations.play('cable'+temp);
                }, this);
            }

            cables.forEach(function(cable){
                cable.animations.add('cable1', [1,2,0], 50).play().onComplete.add(randomCable, cable);
                cable.animations.add('cable2', [3,4,0], 50).play().onComplete.add(randomCable, cable);
                cable.animations.add('cable3', [5,6,0], 50).play().onComplete.add(randomCable, cable);
            });

            cableResp = game.add.physicsGroup();

            var cablePoint = [91, 165,
                              104, 165,
                              31, 81,
                              62, 81];

            cableResp.create(90*48, 156*48).body.setSize(3*48, 9*48);
            cableResp.create(102*48, 156*48).body.setSize(3*48, 9*48);

            cableResp.create(30*48, 69*48).body.setSize(3*48, 12*48);
            cableResp.create(60*48, 69*48).body.setSize(3*48, 12*48);

            for(var i = 0; i < cableResp.length; i++){
                var temp = cableResp.getAt(i);

                temp.respX = cablePoint[2*i]*48;
                temp.respY = cablePoint[2*i + 1]*48;
            }
        }

        /*scintille{
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
      }*/

        /*fiaccole speciali*/{
            torchesEx = game.add.physicsGroup();

            torchesEx.create(39*48, 19*48, 'torch', 2);
            torchesEx.create(45*48, 19*48, 'torch', 2);
            torchesEx.create(51*48, 19*48, 'torch', 2);
            torchesEx.create(57*48, 19*48, 'torch', 2);

            torchesEx.forEach(function(torch){
                torch.animations.add('torch', [0,1], 5, true);
            })

            torchesEx.setAll('anchor.x', 0.5);
            torchesEx.setAll('anchor.y', 37/58);
        }

        /*servers*/{
            servers = game.add.group();

            var positions = [3, 155,
                             5, 155,
                             8, 155,
                             16, 155,
                             19, 155,
                             22, 155,
                             105, 161,
                             107, 161,
                             110, 161];

            var offset = [0, 12, 8, 12, 8, 4, 0, 12, 8];

            for (var i = 0; i < positions.length; i++){
                servers.create(positions[2*i]*48 + offset[i]*3, positions[2*i+1]*48, 'server');
            }

            servers.forEach(function(server){
                server.playRandom = function(){
                    var time = Math.random()*200 + 100;
                    this.frame = Math.floor(Math.random()*3);

                    game.time.events.add(time, function(){
                        this.playRandom();
                    }, this);
                }

                server.playRandom();
            })

            servers.create()
        }

        /*schermi*/{
            movement = game.add.sprite(6*48, 151*48, 'movescreen');
            caution = game.add.sprite(35*48, 150*48, 'caution');
            screenJ = game.add.sprite(16*48, 151*48, 'screenJ');
            screenSPACE = game.add.sprite(11*48, 151*48, 'screenSPACE');
            screenGUN = game.add.sprite(85*48, 108*48, 'screenGUN');

            movement.animations.add('play', [0,1,2,3], 2, true).play();
            caution.animations.add('play', [0,1,2,3], 2, true).play();
            screenJ.animations.add('play', [0,1], 2, true).play();
            screenSPACE.animations.add('play', [0,1], 2, true).play();
            screenGUN.animations.add('play', [0,1,2,3], 2, true).play();
        }

        /*cameo*/{
            var pifferaio = game.add.sprite(43*48, 109*48, 'pifferaio');
            pifferaio.animations.add('pif', [0,1], 4, true).play();
        }

        /*pistola*/{
            gun = game.add.sprite(88*48, 113*48, 'gun');
            game.physics.arcade.enable(gun);

            gun.animations.add('gun', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 10, true).play();
        }

        /*porte*/{
            porte = game.add.physicsGroup();

            porte.create(27*48, 155*48, 'door');
            porte.create(60*48, 17*48, 'door');
            porte.create(81*48, 17*48, 'door');

            porte.forEach(function(porta){
                porta.active = false;
                porta.alpha = 0;

                porta.animations.add('open', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 10);
            })

            porte.getAt(0).active = true;
            porte.getAt(0).alpha = 1;

            porte.setAll('body.immovable', true);
        }

        /*ade*/{
            hades = game.add.sprite(71*48, 3*48, 'hades');
            hades.anchor.setTo(0.5, 1);

            hades.phase = 0;
            hades.fighting = false;
            hades.attacking = false;
            hades.firstTime = true;

            hades.animations.add('idle1', [0], 1, true);
            hades.animations.add('colonne1', [1,1,2,2,3,3,4,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 20);
            hades.animations.add('shot1', [25,26,27,27,27,28,29], 10);
            hades.animations.add('cover', [30,31,32], 5);
            hades.animations.add('teleport', [33,34,35,36,37,38], 5);
            hades.animations.add('idle2', [39,40], 4);
            hades.animations.add('shot2', [41,42,43], 10);
            hades.animations.add('colonne2', [44,45,46,47,48,49,50,51,52], 10);

            hades.textbox = game.add.sprite(72*48, 13*48);
            hades.text = game.add.text(0, 0, "", {font: '27px lores-9-narrow', fill: '#ffffff'});
            hades.textbox.addChild(hades.text);

            hades.textbox.next = game.add.sprite(0, 0, 'pressJ-2');
            hades.textbox.next.anchor.setTo(0.5, 1);
            hades.textbox.addChild(hades.textbox.next);
            hades.textbox.next.position.setTo(397/2, 80);
            hades.textbox.next.alpha = 0;
            hades.textbox.next.animations.add('pressJ-2', [0,1], 2, true).play();

            hades.plat = game.add.sprite(0, 0, 'hades-plat');
            game.physics.arcade.enable(hades.plat);
            hades.plat.anchor.setTo(0.5, 0);
            hades.addChild(hades.plat);
            hades.plat.body.setSize(35*3, 10*3);
            hades.plat.body.offset.setTo(33*3, 0);

            hades.plat.healthbar = game.add.sprite(0, 0, 'platbar');
            hades.plat.healthbar.width = game.width * 0.9;
            hades.plat.healthbar.fixedToCamera = true;
            hades.plat.healthbar.cameraOffset.setTo(game.width * 0.05, game.height - 24*3);
            hades.plat.healthbar.alpha = 0;

            hades.plat.animations.add('death', [1,2,3,4,5,6,7,8,9,10,11,12], 10);

            hades.plat.death = function(){

                player.canMove = false;
                hades.weapon.bullets.forEach(function(bullet){
                    bullet.kill();
                })
                if(colonne != null && colonne != undefined){
                    colonne.forEach(function(colonna){
                        colonna.kill();
                    })
                }

                hades.animations.play('cover').onComplete.addOnce(function(){
                    hades.animations.play('teleport');
                })
                hades.plat.active = false;
                hades.plat.animations.play('death').onComplete.addOnce(function(){
                    hades.plat.alpha = 0;
                });

                hades.alive = false;
                hades.fighting = false;
                hades.phase = 0;

                var temp = game.add.tween(game.camera).to({x: player.x - game.width/2 + MAXCAMOFFSET*(-1 + 2*player.facingRight), y: player.y - game.height/2}, 2000, Phaser.Easing.Linear.None, true)
                temp.onComplete.addOnce(function(){
                    player.canMove = true;

                    porte.getAt(1).alpha = 0;
                    porte.getAt(1).active = false;

                    porte.getAt(2).alpha = 0;
                    porte.getAt(2).active = false;
                });
            };

            hades.respawn = function(){
                hades.phase = 0;
                hades.fighting = false;
                hades.attacking = false;

                hades.plat.active = false;
                hades.plat.healthbar.alpha = 0;

                hades.plat.health = HADES_PLAT_HEALTH;

                if(!hades.firstTime){
                    trigger.x = 61*48;
                }

                porte.getAt(1).alpha = 0;
                porte.getAt(1).active = false;

                porte.getAt(2).alpha = 0;
                porte.getAt(2).active = false;
            };

            hades.health = HADES_HEALTH;
            hades.plat.health = HADES_PLAT_HEALTH;

            hades.alive = true;
            hades.active = false;
            hades.plat.active = false;

            hades.weapon = game.add.weapon(30, 'hades-bullet');
            hades.weapon.trackSprite(hades, -14, -116);
            hades.weapon.fireRate = 0;
            hades.weapon.bulletSpeed = HADES_FAN_SPEED;

            var bullets = hades.weapon.bullets;
            bullets.forEach(function(bullet){
                bullet.body.setCircle(10, bullet.width/2 - 10, bullet.height/2 - 10);
                bullet.animations.add('bullet', [0,1,2], 5, true).play();
            });

            hades.chooseMove = function(){
                var temp = Math.random();

                if(hades.phase == 1){
                    temp = Math.floor(temp*2);
                    switch(temp){
                        case 0:
                            hades.colonne();
                            break;
                        case 1:
                            hades.ventaglio();
                            break;
                        default:
                            break;
                    }
                    hades.attacking = true;
                }
            }

            hades.colonne = function(){
                var timer = 1000;
                var coltemp;

                colonne = game.add.physicsGroup();

                hades.animations.play('colonne'+hades.phase);

                for(var i = 0; i < 9; i++){
                    coltemp = colonne.create(62*48 + 2*i*48, 21*48, 'pillar', 0);

                    coltemp.animations.add('pillar', [3,4,5,6], 15);
                    coltemp.animations.add('startup', [1,2,1,2,1,2,1,2,1,2], 12);
                    coltemp.animations.add('end', [7,0], 15);

                    coltemp.active = false;

                    coltemp.animations.getAnimation('startup').onComplete.add(function(){
                        arguments[0].animations.play('pillar');
                        arguments[0].active = true;
                    });
                    coltemp.animations.getAnimation('pillar').onComplete.add(function(){
                        arguments[0].animations.play('end');
                        arguments[0].active = false;
                    });
                }
                colonne.setAll('anchor.y', 1);
                colonne.setAll('body.width', 24*3);
                colonne.setAll('body.height', 48*3);
                colonne.setAll('body.offset.x', 4*3);
                colonne.setAll('body.offset.y', 16*3);

                var temp = Math.round(Math.random());

                for(var i = 0; i < 9; i++){
                    if(i%2 == temp){
                        colonne.getAt(i).animations.play('startup');
                    }
                }

                game.time.events.add(timer, function(){
                    temp = 1 - temp;
                    for(var i = 0; i < 9; i++){
                        if(i%2 == temp){
                            coltemp = colonne.getAt(i);
                            coltemp.animations.play('startup');
                            coltemp.animations.getAnimation('pillar').onComplete.add(function(){
                                game.time.events.add(HADES_PILLAR_RECOVERY, function(){
                                    hades.attacking = false;
                                    colonne.forEach(function(colonna){
                                        colonna.kill();
                                    });
                                });
                            });
                        }
                    }
                });
            }

            hades.ventaglio = function(){
                var temp = 1 - 2*Math.round(Math.random());

                hades.animations.play('shot'+hades.phase);

                fireFan(hades, Phaser.ANGLE_DOWN + HADES_FAN_OFF*temp, HADES_FAN_NUMBER, HADES_FAN_STEP);
                game.time.events.add(HADES_FAN_TIMEOFF, function(){
                    fireFan(hades, Phaser.ANGLE_DOWN, HADES_FAN_NUMBER, HADES_FAN_STEP);
                    game.time.events.add(HADES_FAN_TIMEOFF, function(){
                        fireFan(hades, Phaser.ANGLE_DOWN - HADES_FAN_OFF*temp, HADES_FAN_NUMBER, HADES_FAN_STEP);
                        game.time.events.add(HADES_FAN_RECOVERY, function(){
                            hades.attacking = false;
                        });
                    });
                });
            }

            hades.plat.updateLife = function(){
                hades.plat.healthbar.width = game.width*0.9 * hades.plat.health/HADES_PLAT_HEALTH;
            }
        }

        /*bossfight*/{
            trigger = game.add.sprite(76*48, 14*48);

            game.physics.arcade.enable(trigger);
            trigger.body.setSize(2*48, 7*48);
        }

        /*vittoria*/{
            victory = game.add.sprite(85*48, 0);
            game.physics.arcade.enable(victory);

            victory.body.setSize(2*48, 3*48);
        }

        /*textbox inizio*/{
            player.textbox = game.add.sprite(0, 0, 'text');

            player.text = game.add.text(15, 10, "", {font: '10px lores-9-narrow', fontWeight: 700, fill: '#000000', wordWrap: true, wordWrapWidth: player.textbox.width - 30});
            player.textbox.addChild(player.text);
            player.text.lineSpacing = -5;

            player.textbox.next = game.add.sprite(player.textbox.width - 15, player.textbox.height - 35, 'pressJ');
            player.textbox.next.anchor.setTo(1, 1);
            player.textbox.addChild(player.textbox.next);
            player.textbox.next.alpha = 0;
            player.textbox.next.animations.add('pressJ', [0,1], 2, true).play();

            startText([
              `Ade se ne è andato, potrebbe essere l'occasione per scappare...`,
              `devo trovare il modo per tornare in superficie.`,
              `Devo stare attenta alle minacce degli inferi, potrebbero farmi perdere`,
              `petali dei miei fiori – la mia linfa vitale. Potrei difendermi con la mia frusta...`,
              `Demetra: "Tieniti stretta i tuoi fiori!”`,
              `Persefone: “Madre, sei tu? sento la tua voce!"`,
              `Demetra: “Se uscita dagli Inferi avrai:`,
              `tre o più fiori, vivremo per sempre insieme nell'Olimpo;`,
              `due o meno fiori, dovrai passare 6 mesi con Ade negli Inferi;`,
              `senza, non avrai più speranze di fuggire."`,
              `Demetra: "Tieni gli occhi aperti! Negli Inferi potresti trovare dei fiori nascosti`,
              `potrebbero essere la nostra salvezza!”`
            ], player.text);

            player.canMove = false;

        }

        /*setup camera*/
        player.bringToTop();
        game.camera.focusOnXY(player.x+camOffset, player.y);

        /*setup input*/
        leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
        upButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
        downButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        attackButton = game.input.keyboard.addKey(Phaser.Keyboard.J);
        shootButton = game.input.keyboard.addKey(Phaser.Keyboard.K);
        esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        player.jump = function(){
            if(player.canMove && player.canJump && !player.status.isJumping && !player.status.isClimbing){

                player.status.isJumping = true;

                if(!player.status.isAttacking && !player.status.isShooting){
                    player.animations.play('jump');
                }

                game.time.events.add(85, function(){
                    if (jumpButton.isDown){
                        player.body.velocity.y = -PLAYER_JUMP;
                    }
                    else{
                        player.body.velocity.y = -PLAYER_SHORTJUMP;
                    }
                    player.status.isAscending = true;
                });
            }
            else if(player.status.isClimbing){
                player.status.isClimbing = false;
            }
        }

        player.goRight = function(){
          //  if(player.canMove){
                player.facingRight = true;
          //  }
        }

        player.goLeft = function(){
          //if(player.canMove){
              player.facingRight = false;
          //}
        }

        player.move = function(){
            if(player.canMove){
                if(player.status.isJumping || player.status.isDescending){
                    player.body.velocity.x += PLAYER_ACC * (-1 + 2*player.facingRight);
                }
                else{
                    player.body.velocity.x = PLAYER_SPEED * (-1 + 2*player.facingRight);
                    player.status.isWalking = true;
                }
            }else{
                player.stop();
            }
        }

        player.stop = function(){
            if(!player.status.isKnocked && (player.canJump || player.status.isClimbing)){
                player.body.velocity.x = 0;
            }
            player.status.isWalking = false;
        }

        player.attack = function(){

            if(player.canMove && !player.status.isAttacking && !player.status.isClimbing && !player.status.isShooting)
            {
                player.status.isAttacking = true;

                if(player.isWalking){
                    player.animations.play('attack-run');
                }
                else{
                    player.animations.play('attack');
                }

                hitbox.scale.x = -1 + 2*player.facingRight;
            }

        }

        player.shoot = function(){
            if(player.hasWeapon && player.canMove && !player.status.isAttacking && !player.status.isClimbing && !player.status.isShooting){
                player.status.isShooting = true;

                if(upButton.isDown){
                    player.animations.play('shoot-up');
                }
                else{
                    player.animations.play('shoot');
                }
            }
        }

        attackButton.onDown.add(player.attack, this);
        jumpButton.onDown.add(player.jump, this);
        shootButton.onDown.add(player.shoot, this);

        rightButton.onDown.add(player.goRight, this);
        rightButton.onHoldCallback = player.move;
        rightButton.onUp.add(player.stop);

        leftButton.onDown.add(player.goLeft, this);
        leftButton.onHoldCallback = player.move;
        leftButton.onUp.add(player.stop);

        esc.onDown.add(pauseMenu);

        updateLife();

    },

    update: function() {

        game.world.bringToTop(healthbar);
        pause.bringToTop();

        player.textbox.position.setTo(player.x + 40, player.y - 30);

        //collisioni
        player.canJump = false;
        game.physics.arcade.collide(player, layer, function(){if(player.body.blocked.down)player.canJump = true;});
        game.physics.arcade.collide(patrols, layer);

        game.physics.arcade.overlap(player, platforms);
        game.physics.arcade.collide(player, platforms, function(){player.canJump = true;}, function(p, plat){
            return plat.body.touching.up;
        });

        if(!game.physics.arcade.overlap(player, elevator)){
            player.body.gravity.y = 3*GRAVITY;
            elevator.used = false;
        }
        else{
            player.body.gravity.y = GRAVITY;

        }
        game.physics.arcade.collide(player, elevator, function(){player.canJump = true; elevatorRide();}, function(p, plat){
            return plat.body.touching.up;
        });

        game.physics.arcade.collide(player, porte, null, function(p, porta){return porta.active});

        game.physics.arcade.overlap(player, cables, shock);
        game.physics.arcade.overlap(player, cableResp, checkPoint);

        game.physics.arcade.overlap(player, petals, pickPetal);
        game.physics.arcade.overlap(player, flowers, pickFlower);
        game.physics.arcade.overlap(player, gun, function(){player.hasWeapon = true; gun.alpha = 0;})

        game.physics.arcade.overlap(player, elevator.buttons, elevatorCall);

        game.physics.arcade.overlap(player, patrols, enemyHit, function(p, e){return e.active;});
        game.physics.arcade.overlap(player, titans, enemyHit, function(p, e){return e.active;});

        walls.forEach(function(wall)
        {
            if(wall.active)
                game.physics.arcade.collide(player, wall);
        }, this);

        game.physics.arcade.overlap(hitbox, buds, grow, function(){return hitbox.active;});
        game.physics.arcade.overlap(hitbox, patrols, this.hit, function(){return hitbox.active;});
        game.physics.arcade.overlap(hitbox, turrets, this.hit, function(){return hitbox.active;});
        game.physics.arcade.overlap(hitbox, titans, this.hit, function(){return hitbox.active;});
        game.physics.arcade.overlap(hitbox, porte.getAt(0), function(h, p){p.animations.play('open'); p.active = false;}, function(){return hitbox.active;})

        patrols.forEach(function(patrol){game.physics.arcade.overlap(patrol, player.weapon.bullets, shot);});
        turrets.forEach(function(turret){game.physics.arcade.overlap(turret, player.weapon.bullets, shot);});
        titans.forEach(function(titan){game.physics.arcade.overlap(titan, player.weapon.bullets, shot);});
        game.physics.arcade.overlap(hades.plat, player.weapon.bullets, shot, function(t, b){return t.active});

        game.physics.arcade.overlap(hitbox, walls, this.fadeWall, function(){return hitbox.active;});

        game.physics.arcade.overlap(platform3.button, player.weapon.bullets, function(button, bullet){button.frame = 1; bullet.kill(); platform3.active = true;})

        //inizio fight
        game.physics.arcade.overlap(player, torchesEx, function(p, t){
            t.animations.play('torch');
        })
        game.physics.arcade.overlap(player, trigger, function(){
            if(!hades.fighting && hades.alive){
                startFight();
            }
        })

        //bossfight update
        if(hades.fighting && !hades.attacking){
            hades.chooseMove();
        }

        if(!hades.fighting){
            game.camera.focusOnXY(player.x+camOffset, player.y);
        }

        //vittoria
        game.physics.arcade.overlap(player, victory, youWin);

        //collisioni colonne ade
        game.physics.arcade.overlap(player, colonne, enemyHit, function(p, c){return c.active;});

        //collisioni proiettili ade
        hades.weapon.bullets.forEach(function(bullet){
            game.physics.arcade.collide(bullet, layer, function(b){b.kill();});
            game.physics.arcade.overlap(player, bullet, enemyHit);
        });

        /*parallax*/
        bgParallax();

        /*comportamento pattuglie*/
        patrols.forEach(function(patrol){
            if(patrol.active){
                patrol.scale.x = patrol.facing;
                patrol.hitbox.scale.x = patrol.facing;
                patrol.body.velocity.x = 0;

                if (Math.abs(player.body.position.x + player.body.width/2 - patrol.body.position.x - patrol.body.width/2) < (patrol.hitbox.body.width + patrol.hitbox.body.offset.x)
                    && Math.abs(player.body.position.y - patrol.body.position.y) < 50
                    && ((player.body.position.x + player.body.width/2 - patrol.body.position.x - patrol.body.width/2) * patrol.facing) > 0
                    && patrol.patrolling)
                {
                    patrol.patrolling = false;
                    patrol.animations.stop();
                    patrol.animations.frame = 3;
                    game.time.events.add(400, function(){
                        patrol.hitbox.active = true;
                        patrol.animations.frame = 4;
                        game.time.events.add(400, function(){
                            patrol.hitbox.active = false;
                            patrol.animations.play('move');
                            game.time.events.add(1000, function(){
                                patrol.patrolling = true;
                            }, this);
                        }, this);
                    }, this);
                }

                if(patrol.hitbox.active){
                    game.physics.arcade.overlap(player, patrol.hitbox, enemyHit);
                }

                if(patrol.patrolling){

                    patrol.animations.play('move');

                    if(patrol.facing == 1) {
                        if(patrol.position.x >= patrol.rightX) {
                            patrol.facing = -1;
                        }
                        else
                            patrol.body.velocity.x = PATROL_SPEED;
                    }
                    else {
                        if(patrol.position.x <= patrol.leftX) {
                            patrol.facing = 1;
                        }
                        else
                            patrol.body.velocity.x = -PATROL_SPEED;
                    }
                }
            }
        }, this);

        /*comportamento torrette*/
        turrets.forEach(function(turret)
        {
            if(turret.active){
                if (Math.abs(player.body.position.x - turret.body.position.x) < turret.rangeX
                &&  Math.abs(player.body.position.y - turret.body.position.y) < turret.rangeY)
                {
                    turret.weapon.fire(null, player.body.position.x, player.body.position.y + player.body.height/2);
                }

                game.physics.arcade.overlap(player, turret.weapon.bullets, enemyHit);
            }
        }, this);

        /*comportamento miniboss*/{
        titans.forEach(function(titan){
            if(titan.active){
                if(player.x - (titan.x + titan.claw.x) > -30 &&
                   player.x - (titan.x + titan.claw.x) < 130 &&
                   Math.abs(player.y - titan.y) < 100 )
                {
                    titan.claw.animations.play('claw');

                    titan.active = false;
                    game.time.events.add(500, function(){titan.active = true;});
                }
            }
            if(titan.claw.frame == 2){
                game.physics.arcade.overlap(player, titan.claw, enemyHit);
            }
        })
        }

        //aggiorna stato animazioni

        //salendo/scendendo
        if(player.body.velocity.y > 0){
            player.status.isDescending = true;
            player.status.isAscending = false;
        }else if(player.body.velocity.y < 0){
            player.status.isAscending = true;
            player.status.isDescending = false;
        }

        //atterraggio
        if(player.status.isDescending && player.canJump){
            player.status.isDescending = false;
            player.status.isJumping = false;
        }

        //lascia liane
        if(!game.physics.arcade.overlap(player, stairs[0], this.climb) &&
           !game.physics.arcade.overlap(player, stairs[1], this.climb) &&
           !game.physics.arcade.overlap(player, stairs[2], this.climb) &&
           !game.physics.arcade.overlap(player, stairs[3], this.climb)){
            player.status.isClimbing = false;
        }

        //tieni liane
        if(player.status.isClimbing)
            player.body.gravity.y = 0;
        else
            player.body.gravity.y = GRAVITY;

        //fine attacco
        if([19,27].includes(player.frame)){
            player.status.isAttacking = false;
        }

        //fine sparo
        if([41,46].includes(player.frame)){
            player.status.isShooting = false;
        }

        //no input orizzontale
        if(rightButton.isUp && leftButton.isUp){
            player.stop();
        }

        /*movimento piattaforme*/{
        platforms.forEach(function(plat){
            if(plat.stop || !plat.active) {
                plat.body.velocity.x = 0;
            }
            else if(plat.goingRight) {
                if(plat.position.x > plat.endX) {
                    plat.stop = true;
                    game.time.events.add(PLATFORM_STOPTIME, function () { plat.goingRight = false; plat.stop = false; }, this);
                }
                else
                    plat.body.velocity.x = PLATFORM_SPEED;
            }
            else {
                if(plat.position.x < plat.startX) {
                    plat.stop = true;
                    game.time.events.add(PLATFORM_STOPTIME, function () { plat.goingRight = true; plat.stop = false; }, this);
                }
                else
                    plat.body.velocity.x = -PLATFORM_SPEED;
            }
        }, this);
        }

        /*ascensore*/{
            elevator.frame = 0;
            if(elevator.locked || elevator.stop){
                elevator.body.velocity.y = 0;
            }
            else if(elevator.direction == -1){
                if(elevator.position.y < elevator.upperY){
                    elevator.stop = true;
                    elevator.body.velocity.y = 0;
                }
                else{
                    elevator.body.velocity.y = ELEVATOR_CALL_SPEED*elevator.direction;
                }
                if(elevator.used){
                    player.body.velocity.y = elevator.body.velocity.y
                    elevator.frame = 1;
                }
            }else{
                if(elevator.position.y > elevator.lowerY){
                    elevator.stop = true;
                    elevator.body.velocity.y = 0;
                }
                else{
                    elevator.body.velocity.y = ELEVATOR_CALL_SPEED*elevator.direction;
                }
                if(elevator.used){
                    player.body.velocity.y = elevator.body.velocity.y
                    elevator.frame = 1;
                }
            }
        }

        //offset camera
        if(player.scale.x == 1)  {

            if(camOffset < MAXCAMOFFSET)
                camOffset += 5;

        }
        else {

            if(camOffset > -MAXCAMOFFSET)
                camOffset -= 5;
        }

        //esecuzione animazioni

        //direzione
        if(!player.status.isAttacking && !player.status.isShooting && player.canMove){
            player.scale.x = -1 + 2*player.facingRight;
        }

        //salendo
        if(!player.canJump && player.status.isAscending && !player.status.isAttacking && !player.status.isShooting && !player.status.isClimbing){
            player.animations.play('up');
        }

        //scendendo
        if(!player.canJump && player.status.isDescending && !player.status.isAttacking && !player.status.isShooting && !player.status.isClimbing){
            player.animations.play('down');
        }

        //arrampicata
        if(player.status.isClimbing){
            if(player.body.velocity.y != 0){
                player.animations.play('climb');
            }
            else{
                player.frame = 31;
            }
        }

        //camminata
        if(player.status.isWalking && !player.status.isAttacking && !player.status.isShooting && !player.status.isJumping && ((!player.status.isDescending && !player.status.isAscending) || elevator.used)){
            player.animations.play('walk');
        }

        //attacco
        if(player.status.isAttacking){
            if(player.status.isWalking && !player.status.isJumping){
                if(player.animations.currentAnim.name == 'attack'){
                    var temp = player.frame;

                    player.animations.play('attack-run').setFrame(temp - 8);
                }
            }
            else if(player.animations.currentAnim.name == 'attack-run'){
                var temp = player.frame;

                player.animations.play('attack').setFrame(temp + 8);
            }
        }

        //hitbox
        if([18,19,25,26].includes(player.frame)){
            hitbox.active = true;
        }
        else{
            hitbox.active = false;
        }

        //knockback
        if(player.status.isKnocked){
            player.animations.play('knock');
            player.status.isAttacking = false;
            player.status.isShooting = false;
        }

        //se non ci sono animazioni in corso, esegui idle
        if(!Object.values(player.status).includes(true) || ((player.status.isDescending || player.status.isAscending) && elevator.used && !player.status.isWalking && !player.status.isAttacking && !player.status.isShooting)){
            player.animations.play('idle');
        }
    },

    hit: function(hit, e) {
        if(!e.invincible){
            e.health -= WHIP_DAMAGE;
            if(e.health <= 0){
                e.death();
            }
            else{
                e.updateLife(HIT_INVTIME);
            }
        }
    },

    climb: function(p, s) {
        if(s.parent.active){
            if(player.status.isClimbing)
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
                    player.status.isClimbing = true;
                }
            }
        }
        else{
          player.status.isClimbing = false;
        }
    },

    fadeWall: function (h, w) {
        if(w.active)
        {
            w.active = false;
            game.add.tween(w).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
        }
    }
};

function updateLife() {
    healthbar.forEach(function(flower){
        if(flower.num < player.lives){
            flower.frame = 5;
        }
        else if(flower.num == player.lives){
            flower.frame = player.health;
        }
        else{
            flower.frame = 0;
        }
    });
}

function bgParallax() {
    var maxOffX = bg.width - game.width;
    var maxOffY = bg.height - game.height;

    var offX = game.camera.x/game.world.width * maxOffX;
    var offY = game.camera.y/game.world.height * maxOffY;
    bg.cameraOffset.setTo(-offX, -offY);
}

function nextLine(content, textbox, callback) {

    if (content.lineIndex === content.text.length)
    {
        endText(textbox, callback);
        return;
    }

    textbox.text = "";

    content.line = content.text[content.lineIndex].split(' ');

    content.wordIndex = 0;

    game.time.events.repeat(content.wordDelay, content.line.length, nextWord, this, content, textbox, callback);

    content.lineIndex++;

}

function nextWord(content, textbox, callback) {

    textbox.text = textbox.text.concat(content.line[content.wordIndex] + " ");

    content.wordIndex++;

    //  Last word?
    if (content.wordIndex === content.line.length)
    {
        //  Add a carriage return
        textbox.text = textbox.text.concat("\n");

        //  Get the next line after the lineDelay amount of ms has elapsed
        textbox.parent.next.alpha = 1;
        attackButton.onDown.addOnce(function(){nextLine(arguments[1], arguments[2], arguments[3]); textbox.parent.next. alpha = 0;}, this, 0, content, textbox, callback);
    }

}

function startText(content, textbox, callback) {

    textbox.alpha = 1;

    content.text = content;
    content.line = [];

    content.wordIndex = 0;
    content.lineIndex = 0;

    content.wordDelay = 70;
    content.lineDelay = 1000;

    nextLine(content, textbox, callback);

}

function endText(textbox, callback) {
    textbox.parent.alpha = 0;
    textbox.text = "";

    player.canMove = true;
    if(callback != null){
        callback();
    }
}

function shock(){
    if(!player.invincible){
        player.health -= 1;
        if (player.health <= 0){
            player.lives -= 1;
            player.health = PLAYER_MAXHEALTH;
            player.respawn();
        }
        else{
            player.invincible = true;
            player.canMove = false;

            game.camera.shake(0.01, 300);
            game.camera.flash(0x5ec4ff, 500);
            game.camera.onFlashComplete.addOnce(function(){
                player.invincible = false;
                player.canMove = true;
            })

            player.x = player.respX;
            player.y = player.respY - player.height;
        }
    }
    updateLife();
}

function checkPoint(p, check){
    p.respX = check.respX;
    p.respY = check.respY;
}

function pickPetal(p, petal){
    if(p.health < PLAYER_MAXHEALTH && petal.active){
        p.health += 1;
        updateLife();

        petal.active = false;
        petal.alpha = 0;
    }
}

function pickFlower(p, flower){
    if(flower.active){
        var i = healthbar.length;
        healthbar.create(i*16*3 + i*2*3, 0, 'fiore', 5);
        healthbar.getAt(i).num = i + 1;

        flower.active = false;
        flower.alpha = 0;

        p.lives += 1;

        updateLife();
    }
}

function grow(p, b) {
    if(b.active){
        activeStairs = stairs[b.stairs];

        b.active = false;
        b.alpha = 0;

        activeStairs.active = true;

        growStep(activeStairs, activeStairs.length)
    }
}

function growStep(stairs, n){
    stairs.getAt(stairs.length - n).alpha = 1;

    if(n > 1){
        game.time.events.add(100, growStep, this, stairs, n-1);
    }
}

function elevatorCall(p, b){

    if(!elevator.locked){
        elevator.buttons.setAll('frame', 0);
        b.frame = 1;

        elevator.buttons.setAll('pressed', false);
        b.pressed = true;

        elevator.stop = false;
        if(b.name == 'su'){
            elevator.direction = -1;
        }
        else{
            elevator.direction = 1;
        }
    }
    else{
        if(b.name == 'su'){
            elevator.locked = false;

            elevatorCall(p, b);
        }
        else{
            if(b.text.alpha == 0){
                b.text.alpha = 1;
                game.add.tween(b.text).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
            }
        }
    }
}

function elevatorRide(p, e){
    if(elevator.stop && !elevator.used){
        if(elevator.direction == -1){
            elevator.direction = 1;
            elevator.stop = false;

            elevator.buttons.getByName('su').frame = 0;
            elevator.buttons.getByName('giu').frame = 1;
        }
        else{
            elevator.direction = -1;
            elevator.stop = false;

            elevator.buttons.getByName('su').frame = 1;
            elevator.buttons.getByName('giu').frame = 0;
        }
        elevator.used = true;
    }
}

function enemyHit(p, h) {
    if(!p.invincible){
        p.health -= 1;
        if (p.health <= 0){
            p.lives -= 1;
            p.health = PLAYER_MAXLIVES;
            p.respawn();
        }
        else{
            p.invincible = true;
            p.alpha = 0.6;
            game.camera.shake(0.01, 300);
            game.time.events.add(PLAYER_INVTIME, function(){p.invincible = false; p.alpha = 1;})

            if(h.knockback != null){
                if(p.facingRight){
                    p.body.velocity.x = -KNOCKBACK_X;
                    p.status.isKnocked = true;
                    p.canMove = false;
                }
                else{
                    p.body.velocity.x = KNOCKBACK_X;
                    p.status.isKnocked = true;
                    p.canMove = false;
                }
                p.body.velocity.y = -KNOCKBACK_Y;
                p.canJump = false;
                p.status.isJumping = true;
                game.time.events.add(300, function(){p.canMove = true; p.status.isKnocked = false;})
            }
            if(h.isBullet != null){
                h.kill();
            }
        }
        updateLife();
    }
}

function startFight(){
    hades.fighting = true;

    porte.getAt(1).alpha = 1;
    porte.getAt(1).active = true;

    porte.getAt(2).alpha = 1;
    porte.getAt(2).active = true;

    if(hades.firstTime){
        player.canMove = false;
        player.stop();
        hades.textbox.position.setTo(72*48, 13*48);

        game.camera.shake(0.01, 300);
        startText(["DOVE CREDI DI ANDARE?"], hades.text, function(){
            var temp = game.add.tween(game.camera).to({x: 71*48 - game.width/2, y: 16*48 - game.height/2}, 1000, Phaser.Easing.Linear.None, true);
            temp.onComplete.addOnce(function(){
                game.add.tween(hades).to({y: 12*48}, 1000, Phaser.Easing.Linear.None, true).onComplete.addOnce(function(){
                    game.time.events.add(1000, function(){
                        hades.phase = 1;
                        hades.attacking = false;
                        hades.plat.active = true;
                        hades.plat.healthbar.alpha = 1;
                    })
                });
                player.canMove = true;
                hades.firstTime = false;
            });
        });
    }
    else{
        var temp = game.add.tween(game.camera).to({x: 71*48 - game.width/2, y: 16*48 - game.height/2}, 1000, Phaser.Easing.Linear.None, true);
        temp.onComplete.addOnce(function(){
            hades.phase = 1;
            hades.attacking = false;
            hades.plat.active = true;
            hades.plat.healthbar.alpha = 1;


        });
    }
}

function shot(target, bullet){
    if(target.active){
        target.health -= bullet.damage;
        bullet.kill();
        if(target.updateLife != null && target.updateLife != undefined){
            target.updateLife(SHOT_INVTIME);
        }
        if(target.health <= 0){
            target.death();
        }
    }
}

function fireFan(sprite, angle, number, step){
    for(var i = 0; i < number; i++){
        sprite.weapon.fireAngle = angle + (i - (number-1)/2) * step;
        sprite.weapon.fire();
    }
}

function youWin(){
    player.canMove = false;
    game.camera.fade(0xffffff, 2000);
    game.camera.onFadeComplete.addOnce(function(){
        game.state.start('win');
    })
}

function pauseMenu(){
    if(!game.paused){
        game.paused = true;

        pausebg.bringToTop();
        pausemenu.bringToTop();

        pausebg.alpha = 1;
        pausemenu.alpha = 1;
        pausemenu.frame = 0;

        pausemenu.esci = game.add.sprite(game.camera.x + 467, game.camera.y +  422);
        pausemenu.esci.width = 90;
        pausemenu.esci.height = 23;

        pausemenu.riprendi = game.add.sprite(game.camera.x + 412, game.camera.y +  315);
        pausemenu.riprendi.width = 199;
        pausemenu.riprendi.height = 23;

        pausemenu.esci.inputEnabled = true;
        pausemenu.riprendi.inputEnabled = true;

        pausemenu.riprendi.events.onInputOver.add(function(){
            pausemenu.frame = 2;
        })
        pausemenu.esci.events.onInputOver.add(function(){
            pausemenu.frame = 1;
        })

        pausemenu.riprendi.events.onInputOut.add(function(){
            pausemenu.frame = 0;
        })
        pausemenu.esci.events.onInputOut.add(function(){
            pausemenu.frame = 0;
        })

        pausemenu.riprendi.events.onInputDown.add(function(){
            console.log("unpause")
            game.paused = false;

            pausebg.alpha = 0;
            pausemenu.alpha = 0;

            pausemenu.esci.destroy();
            pausemenu.riprendi.destroy();
        })
        pausemenu.esci.events.onInputDown.add(function(){
            console.log("esci")
            game.paused = false;
            game.state.start('menu');
        })
    }
    else{
        game.paused = false;

        pausebg.alpha = 0;
        pausemenu.alpha = 0;

        pausemenu.esci.destroy();
        pausemenu.riprendi.destroy();
    }
}
