var menuState = {
    create: function() {
      var home = game.add.sprite(game.camera.x, game.camera.y, 'home');
      var tasti = game.add.sprite(game.camera.x, game.camera.y, 'menutasti');

      var storia = game.add.sprite(65, 408);
      storia.width = 296;
      storia.height = 62;

      var gioca = game.add.sprite(448, 316);
      gioca.width = 128;
      gioca.height = 28;
      gioca.inputEnabled = true;

      gioca.events.onInputUp.add(function() {
          storia.inputEnabled = false;
          crediti.inputEnabled = false;
          game.camera.fade(0x000000, 500);
          game.camera.onFadeComplete.addOnce(function(){
              game.state.start('play');
              game.camera.flash(0x000000, 500);
          })
      })

      gioca.events.onInputOver.add(function(){
          tasti.frame = 1;
      })
      gioca.events.onInputOut.add(function(){
          tasti.frame = 0;
      })

      var storia = game.add.sprite(439, 431);
      storia.width = 146;
      storia.height = 27;
      storia.inputEnabled = true;

      storia.events.onInputUp.add(function() {
          gioca.inputEnabled = false;
          crediti.inputEnabled = false;
          game.camera.fade('#000000', 500);
          game.camera.onFadeComplete.addOnce(function(){
              game.state.start('story');
              game.camera.flash('#000000', 500);
          })
      })

      storia.events.onInputOver.add(function(){
          tasti.frame = 2;
      })
      storia.events.onInputOut.add(function(){
          tasti.frame = 0;
      })

      var crediti = game.add.sprite(427, 544);
      crediti.width = 170;
      crediti.height = 28;
      crediti.inputEnabled = true;

      crediti.events.onInputUp.add(function() {
          gioca.inputEnabled = false;
          storia.inputEnabled = false;
          game.camera.fade('#000000', 500);
          game.camera.onFadeComplete.addOnce(function(){
              game.state.start('credit');
              game.camera.flash('#000000', 500);
          })
      })

      crediti.events.onInputOver.add(function(){
          tasti.frame = 3;
      })
      crediti.events.onInputOut.add(function(){
          tasti.frame = 0;
      })
    }
};
