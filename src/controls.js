const mainWindow = require('electron').remote.getCurrentWindow();

module.exports = {

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

	toggleFullscreen(){
		this.isFullscreen = !this.isFullscreen;
		mainWindow.setFullScreen(this.isFullscreen);
	},

	updateGamepad(){
		if(navigator.getGamepads()[0]){
			this.gamepad = navigator.getGamepads()[0];
			const analogThresh = 0.15;
			if(this.gamepad.axes[9]){
				const dPad = this.gamepad.axes[9].toFixed(1);
				this.moving.up = dPad == '-1.0' || dPad == '1.0' || dPad == '-0.7' ? true : false;
				this.moving.down = dPad == '0.1' || dPad == '-0.1' || dPad == '0.4' ? true : false;
				this.moving.left = dPad == '0.7' || dPad == '1.0' || dPad == '0.4' ? true : false;
				this.moving.right = dPad == '-0.4' || dPad == '-0.1' || dPad == '-0.7' ? true : false; 
			} else {
				this.moving.up = this.gamepad.axes[1] < analogThresh * -1 ? true : false;
				this.moving.down = this.gamepad.axes[1] > analogThresh ? true : false;
				this.moving.left = this.gamepad.axes[0] < analogThresh * -1 ? true : false;
				this.moving.right = this.gamepad.axes[0] > analogThresh ? true : false;
			}
			this.shot = this.gamepad.buttons[0].pressed ? true : false;
			this.focus = this.gamepad.buttons[1].pressed ? true : false;
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
			} else if(globals.stageFinished){

			} else {
				switch(e.which){
					case 16: thisObj.focus = true; break;
					case 37: thisObj.moving.left = true; break;
					case 39: thisObj.moving.right = true; break;
					case 38: thisObj.moving.up = true; break;
					case 40: thisObj.moving.down = true; break;
					case 90:
						if(globals.gameOver) location.reload();
						else thisObj.shot = true;
						break;
				}
			}
		}, keysUp = e => {
			if(globals.starting){
				switch(e.which){
					case 90: start.selectOption(); break;
					case 82: location.reload(); break;
					case 70: thisObj.toggleFullscreen(); break;
					case 38: start.changeOption(); break;
					case 40: start.changeOption(); break;
				}
			} else if(globals.stageFinished){
				switch(e.which){
					case 90: stageUtils.nextStage(); break;
					case 82: location.reload(); break;
				}
			} else {
				switch(e.which){
					case 16: thisObj.focus = false; break;
					case 37: thisObj.moving.left = false; break;
					case 39: thisObj.moving.right = false; break;
					case 38: thisObj.moving.up = false; break;
					case 40: thisObj.moving.down = false; break;
					case 90:
						if(!globals.gameOver) thisObj.shot = false;
						break;
					case 82: location.reload(); break;
					case 70: thisObj.toggleFullscreen(); break;
					case 27: if(!globals.gameOver) globals.paused = !globals.paused; break;
				}
			}
		};
		document.addEventListener('keydown', keysDown);
		document.addEventListener('keyup', keysUp);
	}

}