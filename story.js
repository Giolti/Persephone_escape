storyState = {
    create: function(){
        game.camera.flash('#000000', 500);
        slides = game.add.sprite(0, 0, 'slides', 0);

        slides.index = 0;
        slides.inputEnabled = true;
        slides.events.onInputUp.add(function(){
            slides.inputEnabled = false;
            if(slides.index < 3){
                slides.index++;
                game.camera.fade('#000000', 500, true);
                game.camera.onFadeComplete.addOnce(function(){
                    slides.inputEnabled = true;
                    slides.frame = slides.index;
                    game.camera.flash('#000000', 500, true);
                });
            }
            if(slides.index == 3){
                var home = game.add.sprite(73, 650);
                home.width = 129;
                home.height = 79;

                home.inputEnabled = true;
                home.events.onInputUp.add(function(){
                    game.camera.fade('#000000', 500, true);
                    game.camera.onFadeComplete.addOnce(function(){
                        game.state.start('menu');
                    });
                });

                var play = game.add.sprite(869, 646);
                play.width = 93;
                play.height = 94;

                play.inputEnabled = true;
                play.events.onInputUp.add(function(){
                    game.camera.fade('#000000', 500, true);
                    game.camera.onFadeComplete.addOnce(function(){
                        game.state.start('play');
                    });
                });
            }
        });
    }
}
