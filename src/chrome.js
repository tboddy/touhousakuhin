module.exports = {

started: false,
zOrder: 5000,
offset: globals.grid / 2,
highScoreLabel: false,
highScoreLabelShadow: false,
scoreLabel: false,
scoreLabelShadow: false,
pausedOverlay: false,
pausedLabel: false,
pausedLabelShadow: false,
debugTimeLabel: false,
debugBulletLabel: false,
timeLabel: false,
timeLabelShadow: false,
bonusLabel: false,
bonusLabelShadow: false,
bonusScore: 0,
bonusClock: 0,
gameOverClock: 0,

timeLimit: 120,
baseTimeLimit: 120,
elapsed: 0,
fieldLabels: [],

label(input, x, y, color, large){
	let fontName = 'goldbox', zOrder = this.zOrder + 20;
	if(color){
		if(color == 'dark'){
			y++;
			fontName = 'goldboxdark';
			zOrder--;
		} else if(color == 'orange') fontName = 'goldboxorange';
		else if(color == 'brown') fontName = 'goldboxbrown';
	}
	const label = new PIXI.extras.BitmapText(input, {font: '16px ' + fontName});
	label.x = x;
	label.y = y;
	label.zOrder = zOrder;
	return label;
},

processScore(input){
	input = String(input);
	for(let i = input.length; i < 7; i++){
		input = '0' + input;
	}
	return input;
},

processTime(input){
	return String(input);
},

frame(){
	const frameLeft = PIXI.Sprite.fromImage('img/frame/bg-left.png'), frameRight = PIXI.Sprite.fromImage('img/frame/bg-right.png'),
		logo = PIXI.Sprite.fromImage('img/frame/logo.png');

	frameLeft.zOrder = this.zOrder - 11;
	frameRight.zOrder = this.zOrder - 11;
	frameLeft.x = 0;
	frameLeft.y = 0;
	frameRight.x = globals.gameX + globals.gameWidth;
	frameRight.y = 0;

	logo.anchor.set(.5, 1);
	logo.zOrder = this.zOrder;
	logo.x = globals.gameX * 1.5 + globals.gameWidth
	logo.y = globals.gameHeight -globals.grid;

	globals.game.stage.addChild(frameLeft);
	globals.game.stage.addChild(frameRight);
	globals.game.stage.addChild(logo);

},

score(){
	const y = globals.grid, offset = globals.grid + 2;
	const highScore = () => {
		const x = globals.grid, str = 'HIGH SCORE';
		const title = this.label(str, x, y), titleShadow = this.label(str, x, y, 'dark');
		this.highScoreLabel = this.label(this.processScore(globals.highScore), x, y + offset);
		this.highScoreLabelShadow = this.label(this.processScore(globals.highScore), x, y + offset, 'dark');
		globals.game.stage.addChild(title);
		globals.game.stage.addChild(titleShadow);
		globals.game.stage.addChild(this.highScoreLabel);
		globals.game.stage.addChild(this.highScoreLabelShadow);
	}, playerScore = () => {
		const x = globals.winWidth - globals.grid * 4.5, str = 'SCORE';
		const title = this.label(str, x + globals.grid, y), titleShadow = this.label(str, x + globals.grid, y, 'dark');
		this.scoreLabel = this.label(this.processScore(globals.score), x, y + offset);
		this.scoreLabelShadow = this.label(this.processScore(globals.score), x, y + offset, 'dark');
		// this.scoreLabel.anchor.set(0, 1)
		// this.scoreLabelShadow.anchor.set(0, 1)
		globals.game.stage.addChild(title);
		globals.game.stage.addChild(titleShadow);
		globals.game.stage.addChild(this.scoreLabel);
		globals.game.stage.addChild(this.scoreLabelShadow);
	};
	playerScore();
	highScore();
},

timeLeft(){
	const x = globals.winWidth - globals.grid * 3, y = globals.grid * 4, offset = globals.grid + 2, str = 'TIME';
	const title = this.label(str, x, y), titleShadow = this.label(str, x, y, 'dark');
	this.timeLabel = this.label(this.processTime(this.timeLimit), x, y + offset);
	this.timeLabelShadow = this.label(this.processTime(this.timeLimit), x, y + offset, 'dark');
	globals.game.stage.addChild(title);
	globals.game.stage.addChild(titleShadow);
	globals.game.stage.addChild(this.timeLabel);
	globals.game.stage.addChild(this.timeLabelShadow);
},

boss(){

},

pause(){
	this.pausedOverlay = new PIXI.extras.TilingSprite(new PIXI.Texture.fromImage('img/pausedoverlay.png'));
	this.pausedOverlay.x = globals.gameX;
	this.pausedOverlay.y = 0;
	this.pausedOverlay.width = globals.gameWidth;
	this.pausedOverlay.height = globals.gameHeight;
	this.pausedOverlay.alpha = 0;
	this.pausedOverlay.zOrder = this.zOrder + 10;
	globals.game.stage.addChild(this.pausedOverlay);
	this.pausedLabel = this.label('PAUSED', globals.gameWidth / 2 + globals.gameX, globals.gameHeight / 2);
	this.pausedLabelShadow = this.label('PAUSED', globals.gameWidth / 2 + globals.gameX, globals.gameHeight / 2, 'dark');
	this.pausedLabel.anchor.set(.5);
	this.pausedLabelShadow.anchor.set(.5);
	this.pausedLabel.alpha = 0;
	this.pausedLabelShadow.alpha = 0;
	this.pausedLabel.zOrder = this.zOrder + 11;
	this.pausedLabelShadow.zOrder = this.zOrder + 10;
	globals.game.stage.addChild(this.pausedLabel);
	globals.game.stage.addChild(this.pausedLabelShadow);
},

bonus(){
	const x = globals.gameX + globals.gameWidth / 2, y = globals.gameHeight / 2, bonusString = 'Bonus ' + this.bonusScore;
	this.bonusLabel = this.label(bonusString, x, y);
	this.bonusLabelShadow = this.label(bonusString, x, y, 'dark');
	this.bonusLabel.anchor.set(.5);
	this.bonusLabelShadow.anchor.set(.5);
	globals.game.stage.addChild(this.bonusLabel);
	globals.game.stage.addChild(this.bonusLabelShadow);
},

debug(){
	this.debugTimeLabel = this.label('0', globals.gameWidth - globals.grid / 2, globals.gameHeight - globals.grid / 2, 'red');
	this.debugTimeLabel.anchor.set(1);
	this.debugTimeLabel.zOrder = this.zOrder;
	// globals.game.stage.addChild(this.debugTimeLabel);
	this.debugBulletLabel = this.label('0', globals.gameWidth - globals.grid / 2, globals.gameHeight - 16 - 4, 'red');
	this.debugBulletLabel.anchor.set(1);
	this.debugBulletLabel.zOrder = this.zOrder;
	// globals.game.stage.addChild(this.debugBulletLabel);
},

didGameOver: false,

gameOver(){
	const overlay = new PIXI.extras.TilingSprite(new PIXI.Texture.fromImage('img/pausedoverlay.png'));
	overlay.x = globals.gameX;
	overlay.y = 0;
	overlay.width = globals.gameWidth;
	overlay.height = globals.gameHeight;
	overlay.zOrder = this.zOrder - 1;
	globals.game.stage.addChild(overlay);
	const gameOverString = () => {
		const x = globals.gameWidth / 2 + globals.gameX, y = globals.gameHeight / 2 - globals.grid * 2 - 4 * 2,
			str = 'GAME OVER';
		const label = this.label(str, x, y, false, true), shadow = this.label(str, x, y, 'dark', true);
		label.anchor.set(.5)
		shadow.anchor.set(.5)
		globals.game.stage.addChild(label);
		globals.game.stage.addChild(shadow);
	}, endResult = () => {
		const x = globals.gameX + globals.gameWidth / 2, y = globals.gameHeight / 2 - globals.grid - 4;
		if(globals.wonGame){
			const wonScore = 200000, wonStr = 'BEAT TIME LIMIT! BONUS ' + (wonScore + 5000)
			const wonLabel = this.label(wonStr, x, y),
				wonLabelShadow = this.label(wonStr, x, y, 'dark');
			globals.score += wonScore;
			wonLabel.anchor.set(.5);
			wonLabelShadow.anchor.set(.5);
			globals.game.stage.addChild(wonLabel);
			globals.game.stage.addChild(wonLabelShadow);
		} else if(player.lives <= 1){
			const endString = this.timeLimit - this.elapsed ? 'YOU LOSE...' : 'TIME OUT...';
			const lostLabel = this.label(endString, x, y),
				lostLabelShadow = this.label(endString, x, y, 'dark');
			lostLabel.anchor.set(.5);
			lostLabelShadow.anchor.set(.5);
			globals.game.stage.addChild(lostLabel);
			globals.game.stage.addChild(lostLabelShadow);
		} else {
			const str = 'OUT OF TIME';
			const wonLabel = this.label(str, x, y),
				wonLabelShadow = this.label(str, x, y, 'dark');
			wonLabel.anchor.set(.5);
			wonLabelShadow.anchor.set(.5);
			globals.game.stage.addChild(wonLabel);
			globals.game.stage.addChild(wonLabelShadow);
		}
	}, scoreResult = () => {
		const scoreString = globals.score >= globals.highScore ? 'NEW HIGH SCORE!' : 'NO HIGH SCORE',
			x = globals.gameX + globals.gameWidth / 2, y = globals.gameHeight / 2;
		const label = this.label(scoreString, x, y, globals.score >= globals.highScore ? 'orange' : 'light'),
			shadow = this.label(scoreString, x, y, 'dark');
		label.anchor.set(.5);
		shadow.anchor.set(.5);
		globals.game.stage.addChild(label);
		globals.game.stage.addChild(shadow);
		if(globals.score >= globals.highScore){
			globals.savedData.highScore = globals.score;
			storage.set('savedData', globals.savedData);
			sound.spawn('timeOut');
		} else if(globals.wonGame){
			sound.spawn('timeOut');
		} else {
			player.lives <= 1 ? sound.spawn('gameOver') : sound.spawn('timeOut');
		}
	}, restartString = () => {
		const scoreString = 'SHOOT TO RETURN TO MENU',
			x = globals.gameX + globals.gameWidth / 2, y = globals.gameHeight / 2 + globals.grid * 2 + 4 * 2;
		const label = this.label(scoreString, x, y), shadow = this.label(scoreString, x, y, 'dark');
		label.anchor.set(.5);
		shadow.anchor.set(.5);
		globals.game.stage.addChild(label);
		globals.game.stage.addChild(shadow);
	}
	sound.stopBgm();
	gameOverString();
	endResult();
	scoreResult();
	restartString();
},

addFieldLabel(input, pos){
	input = String(input);
	let fieldLabel = this.label(input, globals.gameX + globals.gameWidth / 2, globals.gameHeight / 2),
		fieldLabelShadow = this.label(input, globals.gameX + globals.gameWidth / 2, globals.gameHeight / 2, 'dark');

	fieldLabel.x = pos.x;
	fieldLabel.y = pos.y;
	fieldLabel.hasPos = true;
	fieldLabelShadow.x = pos.x + 1;
	fieldLabelShadow.y = pos.y + 1;
	fieldLabelShadow.hasPos = true;

	fieldLabel.type = 'fieldLabel';
	fieldLabel.clock = 0;
	fieldLabel.anchor.set(.5);

	fieldLabelShadow.type = 'fieldLabel';
	fieldLabelShadow.clock = 0;
	fieldLabelShadow.anchor.set(.5);

	globals.game.stage.addChild(fieldLabel);
	globals.game.stage.addChild(fieldLabelShadow);
	this.fieldLabels.push(fieldLabel);
	this.fieldLabels.push(fieldLabelShadow);

},

showBonus(score){
	this.bonusScore = score;
	this.bonusLabel.text = 'BONUS ' + this.bonusScore;
	this.bonusLabelShadow.text = 'BONUS ' + this.bonusScore;
	this.bonusClock = 90;
},

updateFieldLabel(label, i){
	label.clock++;
	label.y -= .5;
	if(label.clock >= 45) globals.game.stage.removeChildAt(i);
},

update(){
	const updateScore = () => {
		const score = this.processScore(globals.score);
		if(this.scoreLabel.text != score){
			this.scoreLabel.text = score;
			this.scoreLabelShadow.text = score;
			if(globals.score >= globals.highScore){
				globals.highScoreLabel = globals.score;
				this.highScoreLabel.text = this.processScore(globals.score);
				this.highScoreLabelShadow.text = this.processScore(globals.score);
			}
		}
	}, updateGameOver = () => {
		if(globals.gameOver && !this.didGameOver){
			this.bonusClock = 0;
			this.didGameOver = true;
			this.gameOver();
		}
	}, updatePaused = () => {
		if(globals.paused && !this.pausedOverlay.alpha){
			this.pausedOverlay.alpha = 1;
			this.pausedLabel.alpha = 1;
			this.pausedLabelShadow.alpha = 1;
		} else if(!globals.paused && this.pausedOverlay.alpha) {
			this.pausedOverlay.alpha = 0
			this.pausedLabel.alpha = 0;
			this.pausedLabelShadow.alpha = 0;
		}
	}, updateDebug = () => {
		this.debugBulletLabel.text = bulletCount + ' B';
		this.debugTimeLabel.text = (globals.gameClock / 60).toFixed(0) + ' T';
	}, updateTimeLeft = () => {
		let timeLeft = this.timeLimit - this.elapsed / 60;
		if(timeLeft <= 0){
			if(!globals.gameOver) globals.gameOver = true;
			timeLeft = 0;
		}
		let minString = timeLeft > 60 ? '1' : '0';
		if(timeLeft == 120) minString = '2';
		let secString = Math.floor(timeLeft % 60);
		if(secString < 10) secString = '0' + secString
		let timeString = minString + ':' + secString;
		if(this.timeLabel.text != timeString){
			this.timeLabel.text = timeString;
			this.timeLabelShadow.text = timeString;
		}
		if(!globals.paused && !globals.wonGame && !globals.gameOver) this.elapsed++;
	}, updateBonus = () => {
		if(this.bonusClock){
			if(this.bonusLabel.alpha != 1){
				this.bonusLabel.alpha = 1;
				this.bonusLabelShadow.alpha = 1;
			}
			this.bonusClock--;
		} else if(this.bonusLabel.alpha != 0){
			this.bonusLabel.alpha = 0;
			this.bonusLabelShadow.alpha = 0;
			this.bonusLabel.text = '';
			this.bonusLabelShadow.text = '';
		}
	};
	if(!globals.starting){
		updateScore();
		updateDebug();
		updateTimeLeft();
		updatePaused();
		updateGameOver();
		updateBonus();
	}
},

init(){
	this.frame();
	this.score();
	this.pause();
	this.debug();
	this.timeLeft();
	this.bonus();
	if(!this.started){
		this.started = true;
		globals.game.ticker.add(() => {
			this.update()
		});
	}
},

wipe(){

	this.highScoreLabel = false;
	this.highScoreLabelShadow = false;
	this.scoreLabel = false;
	this.scoreLabelShadow = false;
	this.pausedOverlay = false;
	this.pausedLabel = false;
	this.pausedLabelShadow = false;
	this.debugTimeLabel = false;
	this.debugBulletLabel = false;
	this.timeLabel = false;
	this.timeLabelShadow = false;
	this.bonusLabel = false;
	this.bonusLabelShadow = false;
	this.bonusScore = 0;
	this.bonusClock = 0;
	this.timeLimit = 120;
	this.elapsed = 0;
	this.fieldLabels = [];
	this.didGameOver = false;

}

}