module.exports = {

score: 0,
highScore: 0,
specialScore: 2000,
specialScoreInit: 2000,

gameClock: 0,

grid: 16,
winWidth: 640,
gameWidth: 360,
gameHeight: 480,

enemyCount: 0,

savedData: false,

timeLeft: 150 * 60,

game: false,

bossActive: false,
bossHealth: 0,
bossX: 0,
bossName: false,

starting: true,
gameOver: false,
lostGame: false,
wonGame: false,
timeOver: false,
gameOverClock: false,
paused: false,
deadBoss: false,
currentStage: 1,
currentLoop: 1,

removeBullets: false,

gameLayer: false,

idleInterval: 40,
waitTime: -45,

colors: {
	dark: '#000000',
	indigo: '#222034',
	purpleDark: '#45283c',
	blueLight: '#6dc2ca',
	blue: '#597dce',
	blueDark: '#30346d',
	green: '#6daa2c',
	greenDark: '#346524',
	red: '#d95763',
	peach: '#eec39a',
	light: '#ffffff',
	lighter: '#cbdbfc',
	purple: '#442434',
	orange: '#d27d2c',
	yellow: '#dad45e',
	brown: '#854c30',
	grayLight: '#8595a1',
	gray: '#757161',
	grayDark: '#4e4a4e',
	pink: '#d77bba'
},

hex: {},

initGame(){
	this.gameX = (this.winWidth - this.gameWidth) / 2
	for(color in this.colors) this.hex[color] = '0x' + this.colors[color].substring(1);
	this.game = new PIXI.Application({
		width: this.winWidth,
		height: this.gameHeight,
		backgroundColor: '0x000000',
		roundPixels: true
	});
	PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
	document.body.appendChild(this.game.view);
	globals.resize()
},

startGame(){
	sound.playBgm('level');
	globals.game.stage.removeChildren()
	this.starting = false;
	globals.game.ticker.add(mainLoop);
	background.init();
	chrome.init();
	player.init();
	stage.init();
},

getAngle(a, b){
	const angle = Math.atan2(a.y - b.y, a.x - b.x);
	return angle;
},

homingAngle: false,
lowestDistance: false,

resize(){
	const canvasEl = document.getElementsByTagName('CANVAS')[0];
	if(window.innerHeight > window.innerWidth * .75){
		canvasEl.style.width = window.innerWidth + 'px';
		canvasEl.style.height = window.innerWidth * .75 + 'px';
	} else {
		canvasEl.style.width = window.innerHeight * (1 + 1 / 3) + 'px';
		canvasEl.style.height = window.innerHeight + 'px';
	}
},

returnToTitle(){

	enemyCount = 0;
	bulletCount = 0;
	chipCount = 0;
	lastEnemyCount = 0;

	this.starting = true;
	this.score = 0;
	this.gameOver = false;
	this.lostGame = false;
	this.wonGame = false;
	this.timeOver = false;
	this.paused = false;
	this.gameClock = 0;
	this.gameOverClock = 0;
	this.specialScore = this.specialScoreInit;

	background.wipe();
	chrome.wipe();
	player.wipe();
	controls.wipe();

	explosion.count = 0;

	this.game.ticker.remove(mainLoop);
	this.game.stage.removeChildren();
	stageUtils.nextWave('waveOne', enemies);

	start.init();
}

};