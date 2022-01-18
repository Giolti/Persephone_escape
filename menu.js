var menuState = {
    create: function() {
      var home = game.add.sprite(game.camera.x, game.camera.y, 'home');

      var storia = game.add.sprite(65, 408);
      storia.width = 296;
      storia.height = 62;

      var gioca = game.add.sprite(444, 292);
      gioca.width = 138;
      gioca.height = 26;
      gioca.inputEnabled = true;
      gioca.events.onInputUp.add(function() {
          storia.inputEnabled = false;
          crediti.inputEnabled = false;
          game.camera.fade('#000000', 500);
          game.camera.onFadeComplete.addOnce(function(){
              game.state.start('play');
              game.camera.flash('#000000', 500);
          })
      })

      var storia = game.add.sprite(431, 433);
      storia.width = 161;
      storia.height = 26;
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

      var crediti = game.add.sprite(419, 574);
      crediti.width = 187;
      crediti.height = 26;
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

      var test = game.add.sprite(448, 656);
      test.width = 129;
      test.height = 26;
      test.inputEnabled = true;
      test.events.onInputUp.add(function(){
          game.state.start('test');
      })
    }
};
