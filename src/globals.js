module.exports = {

score: 0,
highScore: 0,
highScoreFiveMin: 0,
specialScore: 2000,
specialScoreInit: 2000,

gameClock: 0,

grid: 16,
winWidth: 640,
gameWidth: 384,
winHeight: 480,
idleInterval: 40,
waitTime: -40,

enemyCount: 0,

savedData: false,

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

isFiveMinute: false,

removeBullets: false,

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
	this.gameX = (this.winWidth - this.gameWidth) / 2;
	this.gameHeight = this.winHeight - this.grid * 2;
	for(color in this.colors) this.hex[color] = '0x' + this.colors[color].substring(1);
	this.game = new PIXI.Application({
		width: this.winWidth,
		height: this.winHeight,
		backgroundColor: '0x000000',
		roundPixels: true
	});
	PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
	document.body.appendChild(this.game.view);
	globals.resize()
},

setupContainers(){
	this.containers = {
		chrome: new PIXI.Container(),
		enemyBullets: new PIXI.Container(),
		blocks: new PIXI.Container(),
		background: new PIXI.Container(),
		explosions: new PIXI.Container(),
		playerBullets: new PIXI.Container(),
		enemies: new PIXI.Container(),
		collisionDebug: new PIXI.Container()
	};
	this.containers.chrome.zOrder = 200;
	this.containers.enemyBullets.zOrder = 70;
	this.containers.blocks.zOrder = 15;
	this.containers.explosions.zOrder = 90;
	this.containers.playerBullets.zOrder = 20;
	this.containers.enemies.zOrder = 50;
	this.containers.collisionDebug.zOrder = 201;
	for(container in this.containers){
		this.containers[container].x = 0;
		this.containers[container].y = 0;
		this.containers[container].width = this.winWidth;
		this.containers[container].height = this.winHeight;
		this.game.stage.addChild(this.containers[container]);
	}
},

startGame(){
	sound.playBgm('level');
	this.game.stage.removeChildren()
	this.setupContainers();
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

	location.reload()

	// enemyCount = 0;
	// bulletCount = 0;
	// chipCount = 0;
	// lastEnemyCount = 0;

	// this.starting = true;
	// this.score = 0;
	// this.gameOver = false;
	// this.lostGame = false;
	// this.wonGame = false;
	// this.timeOver = false;
	// this.paused = false;
	// this.gameClock = 0;
	// this.gameOverClock = 0;
	// this.specialScore = this.specialScoreInit;

	// background.wipe();
	// chrome.wipe();
	// player.wipe();
	// controls.wipe();

	// explosion.count = 0;

	// this.game.ticker.remove(mainLoop);
	// this.game.stage.removeChildren();
	// stageUtils.nextWave('waveOne', enemies);

	// start.init();

}

};