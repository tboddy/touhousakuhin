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
powerUpLabel: false,
powerUpOffset: 0,
chipClock: 0,
chipClockTime: 60,
showPowerUp: false,
timeLabel: false,
timeLabelShadow: false,
rankDownLabel: false,
rankDownClock: 0,
timeLimit: 120,
elapsed: 0,

processScore(input){
	input = String(input);
	for(let i = input.length; i < 8; i++){
		input = '0' + input;
	}
	return input;
},

processTime(input){
	return String(input);
},

frame(){
	const frameLeft = PIXI.Sprite.fromImage('img/frame.png'), frameRight = PIXI.Sprite.fromImage('img/frame.png'),
		borders = new PIXI.Graphics(), logo = PIXI.Sprite.fromImage('img/frame-logo.png'), pr = PIXI.Sprite.fromImage('img/frame-pr.png');

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

	logo.anchor.set(1);
	logo.zOrder = this.zOrder;
	logo.x = globals.winWidth - globals.grid;
	logo.y = globals.gameHeight - globals.grid;

	pr.anchor.set(0, 1);
	pr.zOrder = this.zOrder;
	pr.x = globals.grid;
	pr.y = globals.gameHeight - globals.grid;

	globals.game.stage.addChild(frameLeft);
	globals.game.stage.addChild(frameRight);
	globals.game.stage.addChild(borders);
	globals.game.stage.addChild(logo);
	globals.game.stage.addChild(pr);
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

rankDown(){
	this.rankDownLabel = PIXI.Sprite.fromImage('img/rankdown.png');
	this.rankDownLabel.anchor.set(.5);
	this.rankDownLabel.x = globals.gameX + globals.gameWidth / 2;
	this.rankDownLabel.y = globals.gameHeight / 2;
	this.rankDownLabel.zOrder = this.zOrder - 1;
	globals.game.stage.addChild(this.rankDownLabel);
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
	const gameOverLabel = this.label('Game Over', globals.gameWidth / 2 + globals.gameX, globals.gameHeight / 2 - globals.grid - 2, false, true),
		gameOverLabelShadow = this.label('Game Over', globals.gameWidth / 2 + globals.gameX, globals.gameHeight / 2 - globals.grid - 2, 'dark', true);
	gameOverLabel.anchor.set(.5)
	gameOverLabelShadow.anchor.set(.5)
	globals.game.stage.addChild(gameOverLabel);
	globals.game.stage.addChild(gameOverLabelShadow);
	const endResult = () => {
		if(player.lives <= 1){
			const lostLabel = this.label('OUT OF LIVES!', globals.gameWidth / 2, globals.gameHeight / 2 + globals.grid),
				lostLabelShadow = this.label('OUT OF LIVES!', globals.gameWidth / 2, globals.gameHeight / 2 + globals.grid, 'dark');
			lostLabel.anchor.set(.5);
			lostLabelShadow.anchor.set(.5);
			globals.game.stage.addChild(lostLabel);
			globals.game.stage.addChild(lostLabelShadow);
		} else if(globals.wonGame){
			const wonLabel = this.label('BEAT BEFORE TIME!', globals.gameWidth / 2, globals.gameHeight / 2 + globals.grid),
				wonLabelShadow = this.label('BEAT BEFORE TIME!', globals.gameWidth / 2, globals.gameHeight / 2 + globals.grid, 'dark');
			wonLabel.anchor.set(.5);
			wonLabelShadow.anchor.set(.5);
			globals.game.stage.addChild(wonLabel);
			globals.game.stage.addChild(wonLabelShadow);
		} else {
			const wonLabel = this.label('Out of Time', globals.gameWidth / 2 + globals.gameX, globals.gameHeight / 2),
				wonLabelShadow = this.label('Out of Time', globals.gameWidth / 2 + globals.gameX, globals.gameHeight / 2, 'dark');
			wonLabel.anchor.set(.5);
			wonLabelShadow.anchor.set(.5);
			globals.game.stage.addChild(wonLabel);
			globals.game.stage.addChild(wonLabelShadow);
		}
	}, scoreResult = () => {
		let scoreString = globals.score >= globals.highScore ? 'High Score Get!' : 'No High Score...'
		const scoreLabel = this.label(scoreString, globals.gameWidth / 2 + globals.gameX, globals.gameHeight / 2 + globals.grid + 2),
			scoreLabelShadow = this.label(scoreString, globals.gameWidth / 2 + globals.gameX, globals.gameHeight / 2 + globals.grid + 2, 'dark');
		scoreLabel.anchor.set(.5);
		scoreLabelShadow.anchor.set(.5);
		globals.game.stage.addChild(scoreLabel);
		globals.game.stage.addChild(scoreLabelShadow);
	};
	endResult();
	scoreResult();
},

powerUp(){
	this.powerUpLabel = this.label('power up', 0, 0);
	this.powerUpLabel.anchor.set(.5);
	this.powerUpLabel.alpha = 0;
	// this.powerUpLabel.scale.set(2)
	globals.game.stage.addChild(this.powerUpLabel);
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
	}, updateChipClock = () => {
		if(this.showPowerUp){
			this.powerUpOffset = 0;
			this.showPowerUp = false;
		}
		if(!this.powerUpLabel.alpha) this.powerUpLabel.alpha = 1;
		this.powerUpLabel.x = player.sprite.x;
		this.powerUpLabel.y = player.sprite.y - 20 - this.powerUpOffset;
		this.powerUpOffset += 0.5;
		if(this.chipClock <= 1){
			this.powerUpLabel.alpha = 0;
			this.powerUpOffset = 0;
		}
		this.chipClock--;
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
		if(!globals.paused) this.elapsed++;
	}, updateRankDown = () => {
		if(this.rankDownClock){
			if(!this.rankDownLabel.alpha) this.rankDownLabel.alpha = 1;
			this.rankDownClock--;
		} else if(this.rankDownLabel.alpha) this.rankDownLabel.alpha = 0;
	};
	updateScore();
	updateBoss();
	updateDebug();
	updateTimeLeft();
	updatePaused();
	updateGameOver();
	updateRankDown();
	if(globals.stageFinished){
		if(!this.didFinished) this.finishStage();
		updateFinishStage();
	}
	if(this.chipClock > 0) updateChipClock();
},

init(){
	this.frame();
	this.score();
	this.boss();
	this.pause();
	this.debug();
	this.powerUp();
	this.timeLeft();
	this.rankDown();
	globals.game.ticker.add(() => {
		this.update()
	});
}

}