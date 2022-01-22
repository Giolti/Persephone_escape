winState = {
    create: function(){
        game.camera.flash(0xffffff, 1000);

        var scene;

        if(player.lives > 2){
            scene = game.add.sprite(0,0,'win');
        }else{
            scene = game.add.sprite(0,0,'badend');
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
