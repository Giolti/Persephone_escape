storyState = {
    create: function(){
        game.camera.flash('#000000', 500);
        slides = game.add.sprite(0, 0, 'slides', 0);

        slides.index = 0;
        slides.inputEnabled = true;
        slides.events.onInputUp.add(function(){
            slides.inputEnabled = false;
            if(slides.index < 2){
                slides.index++;
                game.camera.fade('#000000', 500, true);
                game.camera.onFadeComplete.addOnce(function(){
                    slides.inputEnabled = true;
                    slides.frame = slides.index;
                    game.camera.flash('#000000', 500, true);
                });
            }
            else if(slides.index == 2){
                game.camera.fade('#000000', 500, true);
                game.camera.onFadeComplete.addOnce(function(){
                    game.state.start('play');
                });
            }
        });
    }
}
