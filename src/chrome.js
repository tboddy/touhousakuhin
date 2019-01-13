module.exports = {

zOrder: 5000,
offset: globals.grid / 2,

label(input, x, y, color, large){
	const style = {
		fill: color ? globals.colors[color] : globals.colors.light,
		fontFamily: 'socket',
		fontSize: 16
	}
	if(color && (color == 'dark')) style.fill = globals.colors.indigo;
	const label = new PIXI.Text(input, style);
	label.x = x;
	label.y = y;
	label.zOrder = this.zOrder + 20;
	if(color && (color == 'dark')){
		label.zOrder--;
		label.x++;
		label.y++;
	}
	return label;
},

highScoreLabel: false,
highScoreLabelShadow: false,
scoreLabel: false,
scoreLabelShadow: false,
transitionTime: 0.5,
bossBar: false,
bossBarContainer: false,
bossBarNotchA: false,
bossBarNotchB: false,
bossBarNotchC: false,
bossIndicator: false,
initialBossHealth: false,
bossMax: globals.grid * 9 - 2,
spellTitle: false,
spellTitleShadow: false,
pausedOverlay: false,
pausedLabel: false,
pausedLabelShadow: false,
lastLives: false,
lastBombs: false,
debugTimeLabel: false,
debugBulletLabel: false,
timeLabel: false,
timeLabelShadow: false,
bonusLabel: false,
bonusLabelShadow: false,
bonusScore: 0,
bonusClock: 0,

timeLimit: 120,
elapsed: 0,
fieldLabels: [],

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
		borders = new PIXI.Graphics(), logo = PIXI.Sprite.fromImage('img/frame/logo.png');

	frameLeft.zOrder = this.zOrder - 11;
	frameRight.zOrder = this.zOrder - 11;
	frameLeft.x = 0;
	frameLeft.y = 0;
	frameRight.x = globals.gameX + globals.gameWidth;
	frameRight.y = 0;

	borders.zOrder = this.zOrder - 10;
	borders.beginFill(globals.hex.indigo);
	borders.drawRect(globals.gameX - 1, 0, 1, globals.gameHeight);
	borders.drawRect(globals.gameX + globals.gameWidth, 0, 1, globals.gameHeight);
	borders.endFill();

	logo.anchor.set(.5, 1);
	logo.zOrder = this.zOrder;
	logo.x = globals.gameX * 1.5 + globals.gameWidth
	logo.y = globals.gameHeight -globals.grid;

	globals.game.stage.addChild(frameLeft);
	globals.game.stage.addChild(frameRight);
	globals.game.stage.addChild(borders);
	globals.game.stage.addChild(logo);

},

score(){
	const y = globals.grid, offset = globals.grid + 2;
	const highScore = () => {
		const x = globals.grid;
		const title = this.label('Hi Score', x, y), titleShadow = this.label('Hi Score', x, y, 'dark');
		this.highScoreLabel = this.label(this.processScore(globals.highScore), x, y + offset);
		this.highScoreLabelShadow = this.label(this.processScore(globals.highScore), x, y + offset, 'dark');
		globals.game.stage.addChild(title);
		globals.game.stage.addChild(titleShadow);
		globals.game.stage.addChild(this.highScoreLabel);
		globals.game.stage.addChild(this.highScoreLabelShadow);
	}, playerScore = () => {
		const x = globals.gameX + globals.gameWidth + globals.grid;
		const title = this.label('Score', x, y), titleShadow = this.label('Score', x, y, 'dark');
		this.scoreLabel = this.label(this.processScore(globals.score), x, y + offset);
		this.scoreLabelShadow = this.label(this.processScore(globals.score), x, y + offset, 'dark');
		globals.game.stage.addChild(title);
		globals.game.stage.addChild(titleShadow);
		globals.game.stage.addChild(this.scoreLabel);
		globals.game.stage.addChild(this.scoreLabelShadow);
	};
	playerScore();
	highScore();
},

timeLeft(){
	const x = globals.gameX + globals.gameWidth + globals.grid, y = globals.grid * 4, offset = globals.grid + 2;
	const title = this.label('Time', x, y), titleShadow = this.label('Time', x, y, 'dark');
	this.timeLabel = this.label(this.processTime(this.timeLimit), x, y + offset);
	this.timeLabelShadow = this.label(this.processTime(this.timeLimit), x, y + offset, 'dark');
	globals.game.stage.addChild(title);
	globals.game.stage.addChild(titleShadow);
	globals.game.stage.addChild(this.timeLabel);
	globals.game.stage.addChild(this.timeLabelShadow);
},

boss(){

	const containerY = globals.grid + 7, containerX = globals.grid * 3;

	this.bossBarContainer = new PIXI.Graphics();
	this.bossBarContainer.beginFill(globals.hex.light);

	this.bossBarContainer.drawRect(containerX + 1, containerY, globals.grid * 9 - 2, 1);
	this.bossBarContainer.drawRect(containerX, containerY + 1, 1, 7);
	this.bossBarContainer.drawRect(globals.grid * 12 - 1, containerY + 1, 1, 7);
	this.bossBarContainer.drawRect(containerX + 1, containerY + 8, globals.grid * 9 - 2, 1);

	this.bossBarContainer.endFill();
	this.bossBarContainer.beginFill(globals.hex.dark);
	this.bossBarContainer.drawRect(containerX + 1, containerY + 1, globals.grid * 9 - 2, 1);
	this.bossBarContainer.drawRect(containerX + 1, containerY + 9, globals.grid * 9 - 2, 1);
	this.bossBarContainer.drawRect(containerX, containerY + 8, 1, 1);
	this.bossBarContainer.drawRect(globals.grid * 12 - 1, containerY + 8, 1, 1);

	this.bossBarContainer.zOrder = this.zOrder;
	this.bossBarContainer.alpha = 0;
	globals.game.stage.addChild(this.bossBarContainer);

	this.bossBar = new PIXI.extras.TilingSprite(new PIXI.Texture.fromImage('img/bossbar.png'));
	this.bossBar.x = containerX + 1;
	this.bossBar.y = containerY + 1;
	this.bossBar.zOrder = this.zOrder + 1;
	this.bossBar.width = 100;
	this.bossBar.height = 7;
	this.bossBar.alpha = 0;

	globals.game.stage.addChild(this.bossBar);

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

finishedBg: false,
finishedTitle: false,
finishedTitleShadow: false,
finishedNoMissLabel: false,
finishedNoMissLabelShadow: false,
finishedBombLabel: false,
finishedBombLabelShadow: false,
finishedGrazeLabel: false,
finishedGrazeLabelShadow: false,
finishedTotalLabel: false,
finishedTotalLabelShadow: false,
didFinished: false,
finishedClock: 0,

finishStage(){
	this.didFinished = true;
	controls.shot = false;
	const y = globals.gameHeight + globals.grid * 7, x = globals.grid * 3.75;

	this.finishedBg = PIXI.Sprite.fromImage('img/stagefinished.png');
	this.finishedBg.x = 0;
	this.finishedBg.y = globals.gameHeight;
	this.finishedBg.zOrder = this.zOrder - 2;
	globals.game.stage.addChild(this.finishedBg);

	this.finishedTitle = this.label('STAGE ' + (stages.currentStage + 1) + ' CLEAR', globals.gameWidth / 2, y);
	this.finishedTitleShadow = this.label('STAGE ' + (stages.currentStage + 1) + ' CLEAR', globals.gameWidth / 2, y, 'dark');
	this.finishedTitle.anchor.set(.5, 0);
	this.finishedTitleShadow.anchor.set(.5, 0);
	globals.game.stage.addChild(this.finishedTitle);
	globals.game.stage.addChild(this.finishedTitleShadow);

	this.finishedNoMissLabel = this.label('NO-MISS', x, y + globals.grid * 2);
	this.finishedNoMissLabelShadow = this.label('NO-MISS', x, y + globals.grid * 2, 'dark');
	globals.game.stage.addChild(this.finishedNoMissLabel);
	globals.game.stage.addChild(this.finishedNoMissLabelShadow);

	this.finishedBombLabel = this.label('   BOMB', x, y + globals.grid * 3);
	this.finishedBombLabelShadow = this.label('   BOMB', x, y + globals.grid * 3, 'dark');
	globals.game.stage.addChild(this.finishedBombLabel);
	globals.game.stage.addChild(this.finishedBombLabelShadow);

	this.finishedGrazeLabel = this.label('  GRAZE', x, y + globals.grid * 4);
	this.finishedGrazeLabelShadow = this.label('  GRAZE', x, y + globals.grid * 4, 'dark');
	globals.game.stage.addChild(this.finishedGrazeLabel);
	globals.game.stage.addChild(this.finishedGrazeLabelShadow);

	this.finishedTotalLabel = this.label('  TOTAL', x, y + globals.grid * 5.5);
	this.finishedTotalLabelShadow = this.label('  TOTAL', x, y + globals.grid * 5.5, 'dark');
	globals.game.stage.addChild(this.finishedTotalLabel);
	globals.game.stage.addChild(this.finishedTotalLabelShadow);

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
		const x = globals.gameWidth / 2 + globals.gameX, y = globals.gameHeight / 2 - globals.grid * 2 - 4 * 2;
		const label = this.label('Game Over', x, y, false, true), shadow = this.label('Game Over', x, y, 'dark', true);
		label.anchor.set(.5)
		shadow.anchor.set(.5)
		globals.game.stage.addChild(label);
		globals.game.stage.addChild(shadow);
	}, endResult = () => {
		const x = globals.gameX + globals.gameWidth / 2, y = globals.gameHeight / 2 - globals.grid - 4;
		if(globals.wonGame){
			const wonScore = 80000;
			const wonLabel = this.label('Beat Time Limit! Bonus ' + (wonScore + 5000), x, y),
				wonLabelShadow = this.label('Beat Time Limit! Bonus ' + (wonScore + 5000), x, y, 'dark');
			globals.score += wonScore;
			wonLabel.anchor.set(.5);
			wonLabelShadow.anchor.set(.5);
			globals.game.stage.addChild(wonLabel);
			globals.game.stage.addChild(wonLabelShadow);
		} else if(player.lives <= 1){
			const endString = this.timeLimit - this.elapsed ? 'You Died' : 'Time Over';
			const lostLabel = this.label(endString, x, y),
				lostLabelShadow = this.label(endString, x, y, 'dark');
			lostLabel.anchor.set(.5);
			lostLabelShadow.anchor.set(.5);
			globals.game.stage.addChild(lostLabel);
			globals.game.stage.addChild(lostLabelShadow);
		} else {
			const wonLabel = this.label('Out of Time', x, y),
				wonLabelShadow = this.label('Out of Time', x, y, 'dark');
			wonLabel.anchor.set(.5);
			wonLabelShadow.anchor.set(.5);
			globals.game.stage.addChild(wonLabel);
			globals.game.stage.addChild(wonLabelShadow);
		}
	}, scoreResult = () => {
		const scoreString = globals.score >= globals.highScore ? 'New High Score!' : 'No High Score...',
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
			sound.spawn('highScore');
		} else {
			sound.spawn('gameOver');
		}
	}, restartString = () => {
		const scoreString = 'Shoot to Return to Menu',
			x = globals.gameX + globals.gameWidth / 2, y = globals.gameHeight / 2 + globals.grid * 2 + 4 * 2;
		const label = this.label(scoreString, x, y), shadow = this.label(scoreString, x, y, 'dark');
		label.anchor.set(.5);
		shadow.anchor.set(.5);
		globals.game.stage.addChild(label);
		globals.game.stage.addChild(shadow);
	}
	gameOverString();
	endResult();
	scoreResult();
	restartString();
	sound.stopBgm();
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
	this.bonusLabel.text = 'Bonus ' + this.bonusScore;
	this.bonusLabelShadow.text = 'Bonus ' + this.bonusScore;
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
				this.highScoreLabel.text = score;
				this.highScoreLabelShadow.text = score;
			}
		}
	}, updateBoss = () => {
		if(globals.bossActive){
			if(!this.initialBossHealth) this.initialBossHealth = globals.bossHealth;
			if(this.bossBarContainer.alpha != 1){
				this.bossBarContainer.alpha = 1;
				this.bossBar.alpha = 1;
			}
			const num = Math.floor(globals.bossHealth / this.initialBossHealth * this.bossMax);
			if(this.bossBar.width != num) this.bossBar.width = num;
			// if(this.bossIndicator.alpha != 1) this.bossIndicator.alpha = 1;
		} else if(this.bossBarContainer.alpha) {
			this.bossBarContainer.alpha = 0;
			this.bossBar.alpha = 0;
			this.initialBossHealth = false;
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
	}, updateFinishStage = () => {
		const mod = 8;
		if(this.finishedClock < 60 && this.finishedClock % 5 == 0){
			const explosionMod = globals.grid * 2;
			explosion.spawn({
				x: globals.deadBoss.x - explosionMod + Math.random() * (explosionMod * 2),
				y: globals.deadBoss.y - explosionMod + Math.random() * (explosionMod * 2)
			}, false, false, true)
		}
		else if(this.finishedBg.y > 0 && this.finishedClock >= 90){
			this.finishedBg.y -= mod;
			this.finishedTitle.y -= mod;
			this.finishedTitleShadow.y -= mod;
			this.finishedNoMissLabel.y -= mod;
			this.finishedNoMissLabelShadow.y -= mod;
			this.finishedBombLabel.y -= mod;
			this.finishedBombLabelShadow.y -= mod;
			this.finishedGrazeLabel.y -= mod;
			this.finishedGrazeLabelShadow.y -= mod;
			this.finishedTotalLabel.y -= mod;
			this.finishedTotalLabelShadow.y -= mod;
		}
		this.finishedClock++
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
		if(!globals.paused && !globals.wonGame) this.elapsed++;
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
	updateScore();
	updateBoss();
	updateDebug();
	updateTimeLeft();
	updatePaused();
	updateGameOver();
	updateBonus();
	if(globals.stageFinished){
		if(!this.didFinished) this.finishStage();
		updateFinishStage();
	}
},

init(){
	this.frame();
	this.score();
	this.boss();
	this.pause();
	this.debug();
	this.timeLeft();
	this.bonus();
	globals.game.ticker.add(() => {
		this.update()
	});
}

}