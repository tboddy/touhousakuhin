module.exports = {

currentOption: 0,

optionItems: [
	{text: '2 Minute Mode', active: true},
	{text: 'Quit', active: false}
],

bg(){
	const bg = PIXI.Sprite.fromImage('img/start/bg.png');
	bg.x = 0;
	bg.y = 0;
	bg.zOrder = 1;
	globals.game.stage.addChild(bg);
},

title(){
	const header = PIXI.Sprite.fromImage('img/start/header.png'),
		title = PIXI.Sprite.fromImage('img/start/title.png');
	title.anchor.set(.5, 0);
	title.x = globals.winWidth / 2;
	title.y = globals.grid * 7.5;
	title.zOrder = 2;
	header.anchor.set(.5, 0);
	header.x = globals.winWidth / 2;
	header.y = globals.grid * 5
	header.zOrder = 2;
	globals.game.stage.addChild(title);
	globals.game.stage.addChild(header);
},

options(){
	const x = globals.winWidth / 2, y = globals.gameHeight / 2 + globals.grid ;
	this.optionItems.forEach((item, i) => {
		let color = item.active ? 'orange' : 'light';
		item.label = chrome.label(item.text, x, y + i * (globals.grid + 4), color);
		const shadow = chrome.label(item.text, x, y + i * (globals.grid + 4), 'dark');
		item.label.anchor.set(.5, 0);
		shadow.anchor.set(.5, 0)
		globals.game.stage.addChild(shadow);
		globals.game.stage.addChild(item.label);
	});
},

credit(){
	const text = '2019 Peace Research Circle', x = globals.grid * 2, y = globals.gameHeight - globals.grid,
		copyleft = PIXI.Sprite.fromImage('img/start/copyleft.png');
	const label = chrome.label(text, x, y), shadow = chrome.label(text, x, y, 'dark');
	copyleft.anchor.set(0, 1);
	label.anchor.set(0, 1);
	shadow.anchor.set(0, 1);
	copyleft.x = globals.grid;
	copyleft.y = globals.gameHeight - globals.grid - 1;
	copyleft.zOrder = this.zOrder;
	globals.game.stage.addChild(copyleft);
	globals.game.stage.addChild(shadow);
	globals.game.stage.addChild(label);
},

version(){
	const versionText = 'v0.01', x = globals.winWidth - globals.grid, y = globals.gameHeight - globals.grid;
	const label = chrome.label(versionText, x, y),
		shadow = chrome.label(versionText, x, y, 'dark');
	label.anchor.set(1);
	shadow.anchor.set(1);
	globals.game.stage.addChild(shadow);
	globals.game.stage.addChild(label);
},

highScore(){
	const text = 'Current High Score', scoreText = chrome.processScore(globals.highScore), x = globals.winWidth / 2,
		y = globals.gameHeight * .75 - globals.grid * 1.25;
	const label = chrome.label(text, x, y), shadow = chrome.label(text, x, y, 'dark'),
		scoreLabel = chrome.label(scoreText, x, y + globals.grid + 4), scoreShadow = chrome.label(scoreText, x, y + globals.grid + 4, 'dark');
	label.anchor.set(.5, 0);
	shadow.anchor.set(.5, 0);
	scoreLabel.anchor.set(.5, 0);
	scoreShadow.anchor.set(.5, 0);
	globals.game.stage.addChild(shadow);
	globals.game.stage.addChild(label);
	globals.game.stage.addChild(scoreShadow);
	globals.game.stage.addChild(scoreLabel);
},

changeOption(){
	const changeStyle = index => {
		const other = index == 1 ? 0 : 1;
		this.optionItems[index].active = false;
		this.optionItems[other].active = true;
		this.optionItems[index].label.style.fill = globals.hex.light;
		this.optionItems[other].label.style.fill = globals.hex.orange;
	}
	this.optionItems[0].active ? changeStyle(0) : changeStyle(1);
},

selectOption(){
	this.optionItems[0].active ? globals.startGame() : require('electron').remote.app.quit();
},

init(){
	// sound.playBgm('title');
	this.bg();
	this.title();
	this.options();
	this.credit();
	this.version();
	if(globals.highScore) this.highScore();
	globals.startGame();
}

};