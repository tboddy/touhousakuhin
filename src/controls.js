module.exports = {

started: false,

mainWindow: require('electron').remote.getCurrentWindow(),

focus: false,
moving: {
	left: false,
	right: false,
	up: false,
	down: false
},
movingStart: {
	left: false,
	right: false,
	up: false,
	down: false
},
shot: false,
isFullscreen: false,
gamepad: false,
pausingGamepad: false,
changingGamepad: false,

toggleFullscreen(){
	this.isFullscreen = !this.isFullscreen;
	this.mainWindow.setFullScreen(this.isFullscreen);
	globals.savedData.fullscreen = this.isFullscreen;
	storage.set('savedData', globals.savedData);
},

updateGamepad(){
	if(navigator.getGamepads()[0]){
		const gamepad = navigator.getGamepads()[0];
		if(globals.starting){
			if(gamepad.buttons[0].pressed) start.selectOption();
			if(gamepad.axes[1] == -1 || gamepad.axes[1] == 1){
				if(!controls.changingGamepad){
					start.changeOption();
					controls.changingGamepad = true;
				}
			} else if(controls.changingGamepad) controls.changingGamepad = false;
		} else {
			controls.moving.up = gamepad.axes[1] == -1 ? true : false;
			controls.moving.down = gamepad.axes[1] == 1 ? true : false;
			controls.moving.left = gamepad.axes[0] == -1 ? true : false;
			controls.moving.right = gamepad.axes[0] == 1 ? true : false; 
			if(globals.gameOver){
				if(gamepad.buttons[0].pressed) globals.returnToTitle();
			} else {
				controls.shot = gamepad.buttons[0].pressed ? true : false;
				controls.focus = gamepad.buttons[1].pressed ? true : false;
				if(gamepad.buttons[4].pressed){
					if(!controls.pausingGamepad){
						globals.paused = !globals.paused;
						controls.pausingGamepad = true;
					}
				} else if(controls.pausingGamepad) controls.pausingGamepad = false;
			}
			if(gamepad.buttons[5].pressed) globals.returnToTitle();
		}
	}
},

init(){
	const thisObj = this,
	keysDown = e => {
		if(globals.starting){
			switch(e.which){
				case 38: thisObj.movingStart.up = true; break;
				case 40: thisObj.movingStart.down = true; break;
			}
		} else {
			switch(e.which){
				case 16: thisObj.focus = true; break;
				case 37: thisObj.moving.left = true; break;
				case 39: thisObj.moving.right = true; break;
				case 38: thisObj.moving.up = true; break;
				case 40: thisObj.moving.down = true; break;
				case 90: thisObj.shot = true; break;
			}
		}
	}, keysUp = e => {
		if(globals.starting){
			switch(e.which){
				case 90: start.selectOption(); break;
				case 70: thisObj.toggleFullscreen(); break;
				case 38: start.changeOption(); break;
				case 40: start.changeOption(true); break;
			}
		} else {
			switch(e.which){
				case 16: thisObj.focus = false; break;
				case 37: thisObj.moving.left = false; break;
				case 39: thisObj.moving.right = false; break;
				case 38: thisObj.moving.up = false; break;
				case 40: thisObj.moving.down = false; break;
				case 90:
					if(globals.gameOver) globals.returnToTitle();
					else thisObj.shot = false;
					break;
				case 82: globals.returnToTitle(); break;
				case 70: thisObj.toggleFullscreen(); break;
				case 27: if(!globals.gameOver) globals.paused = !globals.paused; break;
			}
		}
	};
	document.addEventListener('keydown', keysDown);
	document.addEventListener('keyup', keysUp);
	if(!this.started){
		this.started = true;
		globals.game.ticker.add(this.updateGamepad);
	}
},

wipe(){
	controls.focus = false;
	controls.moving.left = false;
	controls.moving.right = false;
	controls.moving.up = false;
	controls.moving.down = false;
	controls.movingStart.left = false;
	controls.movingStart.right = false;
	controls.movingStart.up = false;
	controls.movingStart.down = false;
	controls.shot = false;
	controls.isFullscreen = false;
	controls.gamepad = false;
	controls.pausingGamepad = false;
	controls.changingGamepad = false;
}

}