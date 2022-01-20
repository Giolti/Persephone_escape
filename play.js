    var playState = {
    create: function() {

        game.camera.flash('#000000', 500);

        /*init variabili*/
        camOffset = MAXCAMOFFSET;
        startJump = 0;

        /*tilemap*/
        map = game.add.tilemap('map');
        map.addTilesetImage('tileset cave');

        bg = game.add.sprite(0, 0, 'bg');
        bg.fixedToCamera = true;

        map.createLayer("sfondo");
        shadow = map.createLayer("ombra");
        layer = map.createLayer("cave");
        map.createLayer("ombra cave")
        map.createLayer("dettagli");
        layer.resizeWorld();

        map.setCollisionBetween(0, 43, true, 'cave');
        map.setCollisionBetween(88, 120, true, 'cave');


        /*player sprite*/{
        player = game.add.sprite(9*48, 159*48, 'player', 0);
        player.y -= player.height;

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
            isDescending: false
        }

        player.respawn = function(){
            player.x = 9*48;
            player.y = 159*48 - player.height;
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
        platform3 = platforms.create(39*48, 74*48, 'platform1', 0);
        platform4 = platforms.create(72*48, 61*48, 'platform1', 0);

        platforms.forEach(function(plat){
            plat.animations.add('plat', [0,1,2,3], 5, true);
            plat.animations.play('plat');
            plat.body.offset.setTo(1*3, 32*3);
            plat.body.setSize(62*3, 6*3);

            plat.goingRight = false;
            plat.stop = false;
        }, this);

        platform1.startX = 38*48;
        platform1.endX = platform1.startX + 25*48;

        platform2.startX = 45*48;
        platform2.endX = platform2.startX + 40*48;

        platform3.startX = 24*48;
        platform3.endX = platform3.startX + 35*48;

        platform4.startX = 72*48;
        platform4.endX = platform4.startX + 11*48;

        platforms.setAll('body.immovable', true);
        }

        /*ascensore*/{

        }

        /*scale*/{
        stairs[0] = game.add.physicsGroup();
        stairs[1] = game.add.physicsGroup();

        stairs[0].x = 27*48;
        stairs[0].y = 115*48;

        stairs[1].x = 15*48;
        stairs[1].y = 84*48;

        stairs[0].createMultiple(29, 'rampicante', 1, true);
        stairs[1].createMultiple(30, 'rampicante', 1, true);

        for(var j = 0; j < stairs.length; j++){
            for(var i = 0; i < stairs[j].length; i++){
                stairs[j].getAt(i).y = i*16*3;
            }
            stairs[j].getAt(0).frame = 0;
            stairs[j].getAt(stairs[j].length - 1).frame = 2;

            stairs[j].active = false;
            stairs[j].setAll('alpha', 0);
            }
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
                this.active = false;
                this.alpha = 0;
            };

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

        /*cavi*/{
            cables = game.add.physicsGroup();

            for (var i = 0; i<3; i++){
                cables.create((93+i*3)*48, 166*48, 'cables');
            }

            for (var i = 0; i<9; i++){
                cables.create((33+i*3)*48, 82*48, 'cables');
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

        /*scintille*/{
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

        /*textbox inizio*/{
            player.textbox = game.add.sprite(0, 0, 'text');

            player.text = game.add.text(5, 5, "", {font: '12px lores-9-narrow', fontWeight: 700, fill: '#000000', wordWrap: true, wordWrapWidth: player.textbox.width - 10});
            player.textbox.addChild(player.text);
            player.text.lineSpacing = 0;

            player.textbox.next = game.add.sprite(player.textbox.width - 5, player.textbox.height - 5, 'pressJ');
            player.textbox.next.anchor.setTo(1, 1);
            player.textbox.addChild(player.textbox.next);
            player.textbox.next.alpha = 0;
            player.textbox.next.animations.add('pressJ', [0,1], 2, true).play();

            startText([
                "Testo molto lungo davvero lunghissimo infinito biblico",
                "va",
                "qui"
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

        player.attack = function(){

            if(player.canMove && !player.status.isAttacking && !player.status.isClimbing)
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

        player.jump = function(){
            if(player.canMove && player.canJump && !player.status.isJumping && !player.status.isClimbing){

                player.status.isJumping = true;

                if(!player.status.isAttacking){
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
            if(player.canMove){
                player.facingRight = true;
            }
        }

        player.goLeft = function(){
          if(player.canMove){
              player.facingRight = false;
          }
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
            if(player.canJump || player.status.isClimbing){
                player.body.velocity.x = 0;
            }
            player.status.isWalking = false;
        }

        attackButton.onDown.add(player.attack, this);
        jumpButton.onDown.add(player.jump, this);

        rightButton.onDown.add(player.goRight, this);
        rightButton.onHoldCallback = player.move;
        rightButton.onUp.add(player.stop);

        leftButton.onDown.add(player.goLeft, this);
        leftButton.onHoldCallback = player.move;
        leftButton.onUp.add(player.stop);

        updateLife();

    },

    update: function() {

        game.world.bringToTop(healthbar);

        player.textbox.position.setTo(player.x + 80, player.y - 10);

        //collisioni
        player.canJump = false;
        game.physics.arcade.collide(player, layer, function(){if(player.body.blocked.down)player.canJump = true;});
        game.physics.arcade.collide(patrols, layer);

        game.physics.arcade.overlap(player, platforms);
        game.physics.arcade.collide(player, platforms, function(){player.canJump = true;}, function(p, plat){
            return plat.body.touching.up;
        });

        game.physics.arcade.overlap(player, cables, shock);
        game.physics.arcade.overlap(player, cableResp, checkPoint);

        game.physics.arcade.overlap(player, petals, pickPetal);
        game.physics.arcade.overlap(player, flowers, pickFlower);

        game.physics.arcade.overlap(player, patrols, this.enemyHit);

        walls.forEach(function(wall)
        {
            if(wall.active)
                game.physics.arcade.collide(player, wall);
        }, this);

        game.physics.arcade.overlap(hitbox, buds, grow, function(){return hitbox.active;});
        game.physics.arcade.overlap(hitbox, patrols, this.hit, function(){return hitbox.active;});
        game.physics.arcade.overlap(hitbox, turrets, this.hit, function(){return hitbox.active;});
        game.physics.arcade.overlap(hitbox, walls, this.fadeWall, function(){return hitbox.active;});

        game.camera.focusOnXY(player.x+camOffset, player.y);

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
                    game.physics.arcade.overlap(player, patrol.hitbox, this.enemyHit);
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

                game.physics.arcade.overlap(player, turret.weapon.bullets, this.enemyHit);
            }
        }, this);

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
        if(!game.physics.arcade.overlap(player, stairs[0], this.climb)){
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

        //no input orizzontale
        if(rightButton.isUp && leftButton.isUp){
            player.stop();
        }

        /*movimento piattaforme*/{
        platforms.forEach(function(plat){
            if(plat.stop) {
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
        if(!player.status.isAttacking){
            player.scale.x = -1 + 2*player.facingRight;
        }

        //salendo
        if(player.status.isAscending && !player.status.isAttacking & !player.status.isClimbing){
            player.animations.play('up');
        }

        //scendendo
        if(player.status.isDescending && !player.status.isAttacking & !player.status.isClimbing){
            player.animations.play('down');
        }

        if(player.status.isClimbing){
            if(player.body.velocity.y != 0){
                player.animations.play('climb');
            }
            else{
                player.frame = 29;
            }
        }

        //camminata
        if(player.status.isWalking && !player.status.isAttacking && !player.status.isJumping && !player.status.isDescending && !player.status.isAscending){
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

        //se non ci sono animazioni in corso, esegui idle
        if(Object.values(player.status).find(element => element == true) === undefined){
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
                e.invincible = true;
                game.time.events.add(ENEMY_INVTIME, function(){e.invincible = false;});
            }
        }
    },

    enemyHit: function(p, h) {
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
                game.time.events.add(PLAYER_INVTIME, function(){p.invincible = false; p.alpha = 1; p.canMove = true;})

                if(h.knockback != null){
                    if(p.facingRight){
                        p.body.velocity.x = -KNOCKBACK_X;
                        p.canMove = false;
                    }
                    else{
                        p.body.velocity.x = KNOCKBACK_X;
                        p.canMove = false;
                    }
                    p.body.velocity.y = -KNOCKBACK_Y;
                    p.canJump = false;
                    p.status.isJumping = true;
                }
                if(h.isBullet != null){
                    h.kill();
                }
            }
            updateLife();
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
    },

    render: function() {

        if(hitbox.active){
            game.debug.body(hitbox, '#ff0000', false);
        }
        game.debug.text('isAscending: '+player.status.isAscending, 5, 100);
        game.debug.text('isDescending: '+player.status.isDescending, 5, 115);
        game.debug.text('isJumping: '+player.status.isJumping, 5, 130);
        game.debug.text('isWalking: '+player.status.isWalking, 5, 145);
        game.debug.text('canJump:  '+player.canJump, 5, 160);
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

function nextLine(content, textbox) {

    if (content.lineIndex === content.text.length)
    {
        endText(textbox);
        return;
    }

    textbox.text = "";

    content.line = content.text[content.lineIndex].split(' ');

    content.wordIndex = 0;

    game.time.events.repeat(content.wordDelay, content.line.length, nextWord, this, content, textbox);

    content.lineIndex++;

}

function nextWord(content, textbox) {

    textbox.text = textbox.text.concat(content.line[content.wordIndex] + " ");

    content.wordIndex++;

    //  Last word?
    if (content.wordIndex === content.line.length)
    {
        //  Add a carriage return
        textbox.text = textbox.text.concat("\n");

        //  Get the next line after the lineDelay amount of ms has elapsed
        textbox.parent.next. alpha = 1;
        attackButton.onDown.addOnce(function(){nextLine(arguments[1], arguments[2]); textbox.parent.next. alpha = 0;}, this, 0, content, textbox);
    }

}

function startText(content, textbox) {

    textbox.parent.alpha = 1;

    content.text = content;
    content.line = [];

    content.wordIndex = 0;
    content.lineIndex = 0;

    content.wordDelay = 120;
    content.lineDelay = 1000;

    nextLine(content, textbox);

}

function endText(textbox) {
    textbox.parent.alpha = 0;
    textbox.text = "";

    player.canMove = true;
}

function shock(){
    player.health -= 1;
    if (player.health <= 0){
        player.lives -= 1;
        player.health = PLAYER_MAXLIVES;
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
    console.log(arguments);

    if(n > 1){
        game.time.events.add(100, growStep, this, stairs, n-1);
    }
}
