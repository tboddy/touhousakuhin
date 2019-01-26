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
timeLabel: false,
timeLabelShadow: false,
bonusLabel: false,
bonusLabelShadow: false,
bonusScore: 0,
bonusClock: 0,
gameOverClock: 0,

timeLimit: 60 * 2,
fiveMinuteLimit: 60 * 5,
elapsed: 0,
fieldLabels: [],

label(input, x, y, color, large){
	let fontName = 'goldbox';
	if(color){
		if(color == 'dark'){
			y++;
			fontName = 'goldboxdark';
		} else if(color == 'orange') fontName = 'goldboxorange';
		else if(color == 'brown') fontName = 'goldboxbrown';
	}
	const label = new PIXI.extras.BitmapText(input, {font: '16px ' + fontName});
	label.x = x;
	label.y = y;
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
	const img = PIXI.Sprite.from(sprites.frame);
	img.x = 0;
	img.y = 0;
	globals.containers.chrome.addChild(img);
},

score(){
	const y = globals.grid, offset = globals.grid + 2;
	const highScore = () => {
		const x = globals.grid, str = 'HIGH SCORE';
		const title = this.label(str, x, y), titleShadow = this.label(str, x, y, 'dark');
		this.highScoreLabel = this.label(this.processScore(globals.highScore), x, y + offset);
		this.highScoreLabelShadow = this.label(this.processScore(globals.highScore), x, y + offset, 'dark');
		globals.containers.chrome.addChild(titleShadow);
		globals.containers.chrome.addChild(title);
		globals.containers.chrome.addChild(this.highScoreLabelShadow);
		globals.containers.chrome.addChild(this.highScoreLabel);
	}, playerScore = () => {
		const x = globals.winWidth - globals.grid * 4.5, str = 'SCORE';
		const title = this.label(str, x + globals.grid, y), titleShadow = this.label(str, x + globals.grid, y, 'dark');
		this.scoreLabel = this.label(this.processScore(globals.score), x, y + offset);
		this.scoreLabelShadow = this.label(this.processScore(globals.score), x, y + offset, 'dark');
		globals.containers.chrome.addChild(titleShadow);
		globals.containers.chrome.addChild(title);
		globals.containers.chrome.addChild(this.scoreLabelShadow);
		globals.containers.chrome.addChild(this.scoreLabel);
	};
	playerScore();
	highScore();
},

timeLeft(){
	const x = globals.winWidth - globals.grid * 3, y = globals.grid * 4, offset = globals.grid + 2, str = 'TIME';
	const title = this.label(str, x, y), titleShadow = this.label(str, x, y, 'dark');
	this.timeLabel = this.label(this.processTime(this.timeLimit), x, y + offset);
	this.timeLabelShadow = this.label(this.processTime(this.timeLimit), x, y + offset, 'dark');
	globals.containers.chrome.addChild(titleShadow);
	globals.containers.chrome.addChild(title);
	globals.containers.chrome.addChild(this.timeLabelShadow);
	globals.containers.chrome.addChild(this.timeLabel);
},

boss(){
	this.bossBar = new PIXI.extras.TilingSprite(sprites.bossBar);
	this.bossBar.x = globals.gameX + 8;
	this.bossBar.y = globals.grid + 8;
	this.bossBar.width = globals.gameWidth - globals.grid;
	this.bossBar.height = 8;
	this.bossBar.alpha = 0;
	globals.containers.chrome.addChild(this.bossBar);
},

pause(){
	this.pausedOverlay = new PIXI.extras.TilingSprite(sprites.pausedOverlay);
	this.pausedOverlay.x = globals.gameX;
	this.pausedOverlay.y = globals.grid;
	this.pausedOverlay.width = globals.gameWidth;
	this.pausedOverlay.height = globals.gameHeight;
	this.pausedOverlay.alpha = 0;
	globals.containers.chrome.addChild(this.pausedOverlay);
	this.pausedLabel = this.label('PAUSED', globals.gameWidth / 2 + globals.gameX, globals.winHeight / 2);
	this.pausedLabelShadow = this.label('PAUSED', globals.gameWidth / 2 + globals.gameX, globals.winHeight / 2, 'dark');
	this.pausedLabel.anchor.set(.5);
	this.pausedLabelShadow.anchor.set(.5);
	this.pausedLabel.alpha = 0;
	this.pausedLabelShadow.alpha = 0;
	globals.containers.chrome.addChild(this.pausedLabelShadow);
	globals.containers.chrome.addChild(this.pausedLabel);
},

bonus(){
	const x = globals.gameX + globals.gameWidth / 2, y = globals.winHeight / 2, bonusString = 'Bonus ' + this.bonusScore;
	this.bonusLabel = this.label(bonusString, x, y);
	this.bonusLabelShadow = this.label(bonusString, x, y, 'dark');
	this.bonusLabel.anchor.set(.5);
	this.bonusLabelShadow.anchor.set(.5);
	globals.containers.chrome.addChild(this.bonusLabelShadow);
	globals.containers.chrome.addChild(this.bonusLabel);
},

didGameOver: false,

gameOver(){
	const overlay = new PIXI.extras.TilingSprite(sprites.pausedOverlay);
	overlay.x = globals.gameX;
	overlay.y = globals.grid;
	overlay.width = globals.gameWidth;
	overlay.height = globals.gameHeight;
	overlay.zOrder = this.zOrder - 1;
	globals.containers.chrome.addChild(overlay);
	const gameOverString = () => {
		const x = globals.gameWidth / 2 + globals.gameX, y = globals.winHeight / 2 - globals.grid * 2 - 4 * 2,
			str = 'GAME OVER';
		const label = this.label(str, x, y, false, true), shadow = this.label(str, x, y, 'dark', true);
		label.anchor.set(.5)
		shadow.anchor.set(.5);
		globals.containers.chrome.addChild(shadow);
		globals.containers.chrome.addChild(label);
	}, endResult = () => {
		const x = globals.gameX + globals.gameWidth / 2, y = globals.winHeight / 2 - globals.grid - 4;
		if(globals.wonGame){
			const wonScore = 200000, wonStr = 'BEAT TIME LIMIT! BONUS ' + (wonScore + 5000)
			const wonLabel = this.label(wonStr, x, y),
				wonLabelShadow = this.label(wonStr, x, y, 'dark');
			globals.score += wonScore;
			wonLabel.anchor.set(.5);
			wonLabelShadow.anchor.set(.5);
			globals.containers.chrome.addChild(wonLabelShadow);
			globals.containers.chrome.addChild(wonLabel);
		} else if(player.lives <= 1){
			const endString = this.timeLimit - this.elapsed ? 'YOU LOSE...' : 'TIME OUT...';
			const lostLabel = this.label(endString, x, y),
				lostLabelShadow = this.label(endString, x, y, 'dark');
			lostLabel.anchor.set(.5);
			lostLabelShadow.anchor.set(.5);
			globals.containers.chrome.addChild(lostLabelShadow);
			globals.containers.chrome.addChild(lostLabel);
		} else {
			const str = 'OUT OF TIME';
			const wonLabel = this.label(str, x, y),
				wonLabelShadow = this.label(str, x, y, 'dark');
			wonLabel.anchor.set(.5);
			wonLabelShadow.anchor.set(.5);
			globals.containers.chrome.addChild(wonLabelShadow);
			globals.containers.chrome.addChild(wonLabel);
		}
	}, scoreResult = () => {
		const scoreString = globals.score >= globals.highScore ? 'NEW HIGH SCORE!' : 'NO HIGH SCORE',
			x = globals.gameX + globals.gameWidth / 2, y = globals.winHeight / 2;
		const label = this.label(scoreString, x, y, globals.score >= globals.highScore ? 'orange' : 'light'),
			shadow = this.label(scoreString, x, y, 'dark');
		label.anchor.set(.5);
		shadow.anchor.set(.5);
		globals.containers.chrome.addChild(shadow);
		globals.containers.chrome.addChild(label);
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
			x = globals.gameX + globals.gameWidth / 2, y = globals.winHeight / 2 + globals.grid * 2 + 4 * 2;
		const label = this.label(scoreString, x, y), shadow = this.label(scoreString, x, y, 'dark');
		label.anchor.set(.5);
		shadow.anchor.set(.5);
		globals.containers.chrome.addChild(shadow);
		globals.containers.chrome.addChild(label);
	}
	sound.stopBgm();
	gameOverString();
	endResult();
	scoreResult();
	restartString();
},

gameStartLabel: false,
gameStartShadow: false,

gameStart(){
	const x = globals.gameWidth / 2 + globals.gameX, y = globals.winHeight / 2,
		str = globals.isFiveMinute ? 'START 5 MINUTE MODE' : 'START 2 MINUTE MODE';
	this.gameStartLabel = this.label(str, x, y, false, true);
	this.gameStartShadow = this.label(str, x, y, 'dark', true);
	this.gameStartLabel.anchor.set(.5)
	this.gameStartShadow.anchor.set(.5)
	globals.containers.chrome.addChild(this.gameStartShadow);
	globals.containers.chrome.addChild(this.gameStartLabel);
},

addFieldLabel(input, pos){
	input = String(input);
	let fieldLabel = this.label(input, globals.gameX + globals.gameWidth / 2, globals.winHeight / 2),
		fieldLabelShadow = this.label(input, globals.gameX + globals.gameWidth / 2, globals.winHeight / 2, 'dark');

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

	globals.containers.chrome.addChild(fieldLabelShadow);
	globals.containers.chrome.addChild(fieldLabel);
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
	}, updateTimeLeft = () => {
		let timeLeft = this.timeLimit - this.elapsed / 60;
		if(timeLeft <= 0){
			if(!globals.gameOver) globals.gameOver = true;
			timeLeft = 0;
		}
		let minString = timeLeft > 60 ? '1' : '0';
		if(timeLeft >= 60 * 2 && timeLeft < 60 * 3) minString = '2';
		else if(timeLeft >= 60 * 3 && timeLeft < 60 * 4) minString = '3';
		else if(timeLeft >= 60 * 4 && timeLeft < 60 * 5) minString = '4';
		else if(timeLeft == 60 * 5) minString = '5';
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
	}, updateGameStart = () => {
		if(globals.gameClock > 60 * 1.5 && this.gameStartLabel.alpha){
			this.gameStartLabel.alpha = 0;
			this.gameStartShadow.alpha = 0;
		}
	}, updateBoss = () => {
		if(globals.bossActive){
			if(!this.bossBar.alpha) this.bossBar.alpha = 1;
			const num = Math.floor(globals.bossHealth / globals.bossHealthInitial * (globals.gameWidth - globals.grid));
			if(this.bossBar.width != num) this.bossBar.width = num;
		} else if(this.bossBar.alpha) this.bossBar.alpha = 0;
	}, updateFieldLabel = (label, i) => {
		label.clock++;
		label.y -= .5;
		if(label.clock >= 45) globals.containers.chrome.removeChildAt(i);
	}
	if(!globals.starting){
		updateScore();
		updateTimeLeft();
		updatePaused();
		updateGameOver();
		updateBonus();
		updateBoss();
		updateGameStart();
		if(!globals.paused){
			for(i = 0; i < globals.containers.chrome.children.length; i++){
				if(globals.containers.chrome.children[i].type){
					switch(globals.containers.chrome.children[i].type){
						case 'fieldLabel':
							updateFieldLabel(globals.containers.chrome.children[i], i)
							break;
					}
				}
			}
		}
	}
},

init(){
	if(globals.isFiveMinute) this.timeLimit = this.fiveMinuteLimit;
	this.frame();
	this.score();
	this.pause();
	this.timeLeft();
	this.bonus();
	this.gameStart();
	this.boss();
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
	this.timeLabel = false;
	this.timeLabelShadow = false;
	this.bonusLabel = false;
	this.bonusLabelShadow = false;
	this.bonusScore = 0;
	this.bonusClock = 0;
	this.timeLimit = 60 * 2;
	this.fiveMinuteLimit = 60 * 5;
	this.elapsed = 0;
	this.fieldLabels = [];
	this.didGameOver = false;
}

}