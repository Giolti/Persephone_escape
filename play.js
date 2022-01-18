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


        /*player hitbox sprite*/{
        player = game.add.sprite(9*48, 159*48, 'player', 0);
        player.y -= player.height;

        player.lives = PLAYER_MAXLIVES;
        player.health = PLAYER_MAXHEALTH;
        player.invincible = false;
        player.canMove = true;
        player.canJump = true;

        player.facingRight = true;
        player.anchor.x = (42*3)/player.width;

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

        hitbox = game.add.sprite();
        player.addChild(hitbox);
        hitbox.y = 54;
        }

        /*player animations*/{
        player.animations.add('idle', [0,1,2,3], 4);
        player.animations.add('walk', [4,5,6,7,8,9,10,11], 15);
        attackAnim = player.animations.add('attack', [12,13,14,15,16,17,18,19,20,21,22,23,24,25], 30);
        jumpAnim = player.animations.add('jump', [26,26,26], 60);
        player.animations.add('up', [27]);
        player.animations.add('down', [28]);

        /*hitbox activation*/{
        attackAnim.onStart.add(function () {
            game.time.events.add(250, function () { hitbox.active = true; }, this);
        }, this);
        }

        /*hitbox deactivation*/{
        attackAnim.onComplete.add(function () {
            hitbox.active = false;
            player.status.isAttacking = false;
            /*player.weapon = new Phaser.Rectangle;*/

        }, this);
        }
        }

        /*life hud*/
        healthbar = game.add.group();
        healthbar.fixedToCamera = true;
        healthbar.cameraOffset.setTo(40,30);

        for(var i = 0; i < PLAYER_MAXLIVES; i++){
            healthbar.create(i*16*3 + i*2*3, 0, 'fiore', 5);
            healthbar.getAt(i).num = i + 1;
        }


        /*graphics enable*/{
        game.physics.arcade.enable(player);
        game.physics.arcade.enable(hitbox);
        game.physics.arcade.enable(layer);
        }

        /*hitbox physics*/{
        hitbox.body.setSize(44*3,12*3);
        hitbox.body.offset.setTo(22*3, 0);
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

        petals.forEach(function(petal){
            petal.animations.add('petal', [0,1,2,1], 5, true);
            petal.animations.play('petal');

            petal.add
        }, this);

        petals.setAll('anchor.x', 0.5);
        petals.setAll('anchor.y', 0.5);

        }

        /*piattaforme*/{
        platforms = game.add.physicsGroup();

        platform1 = platforms.create(50*48, 155*48, 'platform1', 0);
        platform2 = platforms.create(45*48, 110*48, 'platform1', 0);

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

        platforms.setAll('body.immovable', true);
        }

        /*stairs*/{
        stairs = game.add.physicsGroup();

        stairs1 = stairs.create(27*48, 117*48, 'stairs1');
        stairs1.active = false;
        stairs1.alpha = 0;
        }

        /*buds*/{
        buds = game.add.physicsGroup();

        bud1 = buds.create(27*48, 115*48, 'bud');
        bud1.active = true;
        bud1.stairs = 0;
        }

        /*secret walls*/{
        walls = game.add.physicsGroup();

        wall1 = walls.create(71*48, 157*48, 'wall1');
        wall1.body.setSize(10*48, 10*48);
        wall1.body.offset.setTo(1*48, 0);

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

        var patrolsMovePoints = [
            42, 56,
            79, 88,
            10, 20,
            40, 61,
            74, 91
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

            turret.rangeX = TURRET_RANGE_X;
            turret.rangeY = TURRET_RANGE_Y;
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
                player.canMove = false;
                player.canJump = false;
                player.status.isAttacking = true;

                game.time.events.add(250, function () { hitbox.active = true; }, this);

                attackAnim.onComplete.add(function () {
                    hitbox.active = false;
                    player.canMove = true;
                    player.status.isAttacking = false;
                }, this);

                player.animations.play('attack');
                hitbox.scale.x = -1 + 2*player.facingRight;
            }

        }

        player.jump = function(){
            if(player.canMove && player.canJump && !player.status.isJumping && !player.status.isClimbing && !player.status.isAttacking){
                player.status.isJumping = true;
                jumpAnim.play();
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
        }

        player.goRight = function(){
            if(!player.status.isAttacking){
                if(player.canMove){
                    player.facingRight = true;
                    player.scale.x = 1;
                }
            }else{
                attackAnim.onComplete.addOnce(function(){
                    player.facingRight = true;
                    player.scale.x = 1;
                })
            }
        }

        player.goLeft = function(){
            if(!player.status.isAttacking){
                if(player.canMove){
                    player.facingRight = false;
                    player.scale.x = -1;
                }
            }else{
                attackAnim.onComplete.addOnce(function(){
                    player.facingRight = false;
                    player.scale.x = -1;
                })
            }
        }

        player.move = function(){
            if(player.canMove){
                if(player.status.isJumping){
                    player.body.velocity.x += PLAYER_ACC * (-1 + 2*player.facingRight);
                }
                else{
                    if(!player.status.isAttacking){
                        player.body.velocity.x = PLAYER_SPEED * (-1 + 2*player.facingRight);
                        player.status.isWalking = true;
                    }
                }
            }else{
                player.stop();
            }
        }

        player.stop = function(){
            if(player.canJump){
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

        walls.forEach(function(wall)
        {
            if(wall.active)
                game.physics.arcade.collide(player, wall);
        }, this);

        game.physics.arcade.overlap(hitbox, buds, this.grow, function(){return hitbox.active;});
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
        if(!game.physics.arcade.overlap(player, stairs, this.climb)){
            player.status.isClimbing = false;
        }

        //tieni liane
        if(player.status.isClimbing)
            player.body.gravity.y = 0;
        else
            player.body.gravity.y = GRAVITY;

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
        if(player.facingRight)  {

            if(camOffset < MAXCAMOFFSET)
                camOffset += 5;

        }
        else {

            if(camOffset > -MAXCAMOFFSET)
                camOffset -= 5;
        }

        //esecuzione animazioni

        //salendo
        if(player.status.isAscending && !player.status.isAttacking & !player.status.isClimbing){
            player.animations.play('up');
        }

        //scendendo
        if(player.status.isDescending && !player.status.isAttacking & !player.status.isClimbing){
            player.animations.play('down');
        }

        //camminata
        if(player.status.isWalking && !player.status.isAttacking && !player.status.isJumping){
            player.animations.play('walk');
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
                p.alpha = 0.8;
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
            }
            updateLife();
        }
    },

    climb: function(p, s) {
        if(s.active){
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

    grow: function(p, b) {
        if(b.active){
            activeStairs = stairs.getAt(b.stairs);

            b.active = false;
            activeStairs.active = true;
            activeStairs.alpha = 1;
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

        //game.debug.spriteBounds(player, '#0000ff', false);
        //game.debug.spriteBounds(hitbox, '#ffff00', false);
        //if(hitbox.active)
          //game.debug.body(hitbox, '#ff0000', false);
        game.debug.body(player, '#00ffff', false);
        platforms.forEach(function(plat){
            game.debug.body(plat, '#0000ff', false);
        }, this);
        patrols.forEach(function(patrol){
            game.debug.spriteBounds(patrol, '#ff00bb', false);
            game.debug.body(patrol, '#ff0000', false);
            if(patrol.hitbox.active)
                game.debug.body(patrol.hitbox, '#ff0000', false);
        }, this);
        turrets.forEach(function(turret){
            turret.weapon.bullets.forEach(function(bullet){
                game.debug.body(bullet, '#ff0000', true);
            }, this);
        }, this);
        //game.debug.body(patrols, '#00ffff', false);
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
