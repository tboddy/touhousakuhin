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
	const x = globals.winWidth / 2, y = globals.gameHeight / 2 + globals.grid * 1.25;
	this.optionItems.forEach((item, i) => {
		let color = item.active ? 'orange' : 'light';
		item.label = chrome.label(item.text, x, y + i * (globals.grid + 2), color);
		const shadow = chrome.label(item.text, x, y + i * (globals.grid + 2), 'dark');
		item.label.anchor.set(.5, 0);
		shadow.anchor.set(.5, 0)
		globals.game.stage.addChild(shadow);
		globals.game.stage.addChild(item.label);
	});
},

credit(){
	const logo = PIXI.Sprite.fromImage('img/start/logo.png');
	logo.anchor.set(.5, 1);
	logo.x = globals.winWidth / 2;
	logo.y = globals.gameHeight - globals.grid * 5;
	logo.zOrder = 2;
	globals.game.stage.addChild(logo);
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
	sound.playBgm('title');
	this.bg();
	this.title();
	this.options();
	this.credit();
	this.version();
	globals.startGame();
}

};