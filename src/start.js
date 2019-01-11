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
	bg.type = 'start';
	globals.game.stage.addChild(bg);
},

options(){
	const x = globals.winWidth / 2, y = globals.gameHeight / 2;
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

version(){
	const versionString = '2019 Peace Research', x = globals.winWidth - globals.grid, y = globals.gameHeight - globals.grid;
	const version = chrome.label(versionString, x, y), versionShadow = chrome.label(versionString, x, y, 'dark');
	version.anchor.set(1);
	versionShadow.anchor.set(1);
	globals.game.stage.addChild(versionShadow);
	globals.game.stage.addChild(version);
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
	this.bg();
	this.options();
	this.version();
	globals.startGame();
}

};