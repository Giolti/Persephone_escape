var testState = {
    create: function() {

        /*tilemap*/
        map = game.add.tilemap('test');
        map.addTilesetImage('tileset cave');

        map.createLayer("sfondo");
        shadow = map.createLayer("ombra");
        layer = map.createLayer("cave");
        layer.resizeWorld();

        map.setCollisionBetween(0, 27, true, 'cave');
        map.setCollisionBetween(64, 82, true, 'cave');

        game.camera.x = game.world.bounds.width/2 - game.width/2;

        /*player hitbox sprite*/{
        player = game.add.sprite(2*48, 14*48, 'player', 0);
        player.y -= player.height;

        player.lives = PLAYER_MAXLIVES;
        player.health = PLAYER_MAXHEALTH;
        player.invincible = false;
        player.canMove = true;

        player.facingRight = true;
        player.jumping = false;
        player.climbing = false;
        player.anchor.x = (42*3)/player.width;

        player.respawn = function(){
            player.x = 2*48;
            player.y = 14*48 - player.height;
        }
        /*player weapon*/
        player.weapon = game.add.weapon(20, 'turret-bullet');
        player.weapon.fireRate = PLAYER_FIRERATE;
        player.weapon.trackSprite(player, 0, player.height/2);
        player.weapon.bulletSpeed = SHOT_SPEED;

        player.weapon.bullets.forEach(function(bullet){
            bullet.damage = SHOT_DAMAGE;
        })

        hitbox = game.add.sprite();
        player.addChild(hitbox);
        hitbox.y = 54;
        }

        /*player animations*/{
        player.animations.add('idle', [0,1,2,3], 4);
        player.animations.add('walk', [4,5,6,7,8,9,10,11], 15);
        attackAnim = player.animations.add('attack', [12,13,14,15,16,17,18,19,20,21,22,23,24,25], 30);
        player.animations.add('startjump', [0,0,0], 30);
        }

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

        /*ade*/{
        hades = game.add.sprite(11*48, 4*48, 'hades', 0);
        hades.anchor.setTo(0.5, 1);

        game.physics.arcade.enable(hades);

        hades.platform = game.add.sprite(0, 0, 'hades-plat');
        hades.platform.anchor.setTo(0.5, 1);
        hades.addChild(hades.platform);
        hades.platform.y = hades.height/2;
        hades.platform.animations.add('plat', [0,1], 5, true).play();
        hades.platform.animations.add('death', [2,3,4,5], 10);

        game.physics.arcade.enable(hades.platform);
        hades.platform.body.setSize(126, 26);
        hades.platform.body.offset.setTo(54, 305);

        hades.phase = 1;
        hades.health = HADES_HEALTH;
        hades.platform.health = HADES_PLAT_HEALTH;

        hades.phase1_leftX = 8*48;
        hades.phase1_rightX = 14*48;

        hades.weapon = game.add.weapon(30, 'hades-bullet');
        hades.weapon.trackSprite(hades, 0, 76);
        hades.weapon.fireRate = 0;

        var bullets = hades.weapon.bullets;
        bullets.forEach(function(bullet){
            bullet.body.setCircle(10, bullet.width/2 - 10, bullet.height/2 - 10);
            bullet.animations.add('bullet', [0,1,2], 5, true).play();
        });

        hades.hitboxes = game.add.physicsGroup();

        hades.healthbar = game.add.sprite(0, 0, 'bossbar');
        hades.healthbar.width = game.width * 0.9;
        hades.healthbar.fixedToCamera = true;
        hades.healthbar.cameraOffset.setTo(game.width * 0.05, game.height - 24*3);

        hades.platform.healthbar = game.add.sprite(0, 0, 'platbar');
        hades.platform.healthbar.width = game.width * 0.9;
        hades.platform.healthbar.fixedToCamera = true;
        hades.platform.healthbar.cameraOffset.setTo(game.width * 0.05, game.height - 24*3);

        hades.platform.updateLife = function(){
            hades.platform.healthbar.width = game.width*0.9 * hades.platform.health/HADES_PLAT_HEALTH;
        }

        hades.platform.death = function(){
            hades.frame = 1;
            hades.weapon.bullets.forEach(function(bullet){
                bullet.kill();
            });
            game.camera.shake(0.03, 600);
            hades.phase = 2;
            hades.platform.animations.play('death').onComplete.addOnce(function(){
                game.time.events.add(500, function(){
                    hades.platform.boom = game.add.sprite(0, 0, 'explosion');
                    hades.platform.boom.anchor.setTo(0.5, 0.5);
                    hades.platform.addChild(hades.platform.boom);
                    hades.platform.boom.y = -10;
                    hades.platform.boom.animations.add('boom', [0,1,2,3,4], 15);
                    hades.platform.boom.animations.play('boom').onComplete.addOnce(function(){
                        hades.platform.kill();
                        hades.platform.boom.kill();
                    });
                });
            });
        }

        hades.attacking = false;

        hades.direction = 1;

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
            }

            hades.attacking = true;
        }

        hades.colonne = function(){
            var timer = 1000;
            var coltemp;

            colonne = game.add.physicsGroup();

            for(var i = 0; i < 9; i++){
                coltemp = colonne.create(2*48 + 2*i*48, 14*48, 'pillar', 0);

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
        }

        /*setup input*/
        leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
        upButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
        downButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        attackButton = game.input.keyboard.addKey(Phaser.Keyboard.J);
        shootButton = game.input.keyboard.addKey(Phaser.Keyboard.K);
    },

    update: function() {

        game.world.bringToTop(healthbar);
        game.world.bringToTop(hades.healthbar);
        game.world.bringToTop(hades.platform.healthbar);

        //collisioni
        canJump = false;
        game.physics.arcade.collide(player, layer, function(){if(player.body.blocked.down)canJump = true;});

        game.physics.arcade.overlap(player, colonne, enemyHit, function(p, c){return c.active;});

        game.physics.arcade.overlap(hades.platform, player.weapon.bullets, shot);

        hades.weapon.bullets.forEach(function(bullet){
            game.physics.arcade.collide(bullet, layer, function(b){b.kill();});
            game.physics.arcade.overlap(player, bullet, enemyHit);
        });

        if (leftButton.isDown && !player.isAttacking && player.canMove)
        {
            player.facingRight = false;
            player.scale.x = -1;

            if(canJump && !player.climbing)
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
        else if (rightButton.isDown && !player.isAttacking && player.canMove)
        {
            player.facingRight = true;
            player.scale.x = 1;

            if(canJump  && !player.climbing)
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

            if(canJump && player.canMove)
                player.body.velocity.x = 0;
        }

        if (canJump && !player.climbing)
        {
            player.jumping = false;
        }

        if (jumpButton.isDown && canJump && !player.climbing)
        {
            player.jumping = true;
            startJump = game.time.now;
            player.body.position.y -= 1;
            game.time.events.add(JUMP_TIME, function () { player.jumping = false;}, this);

        }

        if (player.jumping && jumpButton.isDown)
        {
            player.body.velocity.y = - (PLAYER_JUMP * Math.sqrt((game.time.now - startJump)/JUMP_TIME));
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
            hitbox.scale.x = -1 + 2*player.facingRight;
        }

        if(shootButton.isDown && !player.isAttacking) {
            if(upButton.isDown) {
                player.weapon.fireAngle = Phaser.ANGLE_UP;
            }
            else if(player.facingRight){
                player.weapon.fireAngle = Phaser.ANGLE_RIGHT;
            }
            else{
                player.weapon.fireAngle = Phaser.ANGLE_LEFT;
            }

            player.weapon.fire();
        }

        /*ade comportamento*/{
        if(!hades.attacking){
            hades.chooseMove();
        }
        }
    },

    render: function(){
        game.debug.body(hades.platform, '#0000ff', false);
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
                    p.canMove = false;
                }
                else{
                    p.body.velocity.x = KNOCKBACK_X;
                    p.canMove = false;
                }
                p.body.velocity.y = -KNOCKBACK_Y;
                p.jumping = true;
                game.time.events.add(PLAYER_LOCKOUT, function(){p.canMove = true;})
            }
        }
        updateLife();
    }
}

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

function fireFan(sprite, angle, number, step){
    for(var i = 0; i < number; i++){
        sprite.weapon.fireAngle = angle + (i - (number-1)/2) * step;
        sprite.weapon.fire();
    }
}

function shot(target, bullet){
    target.health -= bullet.damage;
    bullet.kill();
    target.updateLife();
    if(target.health == 0){
        target.death();
    }
}
