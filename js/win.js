winState = {
    create: function(){


        var scene;

        if(player.lives > 2){
            game.camera.flash(0xffffff, 1000);
            scene = game.add.sprite(0,0,'win');
        }else if(player.lives > 0){
            game.camera.flash(0xffffff, 1000);
            scene = game.add.sprite(0,0,'badend');
        }else{
            game.camera.flash(0x000000, 1000);
            scene = game.add.sprite(0,0, 'gameover');
        }

        var menubutton = game.add.sprite(0, 0);
        menubutton.width = 1024;
        menubutton.height = 768;
        menubutton.inputEnabled = true;
        menubutton.events.onInputUp.add(function() {
            game.camera.fade('#000000', 500);
            game.camera.onFadeComplete.addOnce(function(){
                game.state.start('menu');
                game.camera.flash('#000000', 500);
            })
        })
    }
}
