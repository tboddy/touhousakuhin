module.exports = {

currentOption: 0,

optionItems: [
	{text: '2 MINUTE MODE'},
	{text: '5 MINUTE MODE'},
	{text: 'EXIT GAME'}
],

bg(){
	const bg = PIXI.Sprite.fromImage('img/start/bg.png');
	bg.x = 0;
	bg.y = 0;
	bg.zOrder = 1;
	globals.game.stage.addChild(bg);
},

title(){
	const y = globals.grid * 5.5, headerText = 'WINTER CARNIVAL \'19';
	const header = chrome.label(headerText, globals.winWidth / 2, y),
		headerShadow = chrome.label(headerText, globals.winWidth / 2, y, 'dark'),
		title = PIXI.Sprite.fromImage('img/start/title.png');

	header.anchor.set(.5, 0);
	header.zOrder = 2;
	headerShadow.anchor.set(.5, 0);
	headerShadow.zOrder = 2;

	title.anchor.set(.5, 0);
	title.x = globals.winWidth / 2;
	title.y = y + globals.grid * 2.25
	title.zOrder = 2;

	globals.game.stage.addChild(title);
	globals.game.stage.addChild(headerShadow);
	globals.game.stage.addChild(header);
},

options(){
	const x = globals.winWidth / 2, y = globals.gameHeight / 2 + globals.grid;
	this.optionItems.forEach((item, i) => {
		item.label = chrome.label(item.text, x, y + i * (globals.grid + 4));
		item.activeLabel = chrome.label(item.text, x, y + i * (globals.grid + 4), 'orange');
		const shadow = chrome.label(item.text, x, y + i * (globals.grid + 4), 'dark');
		item.label.anchor.set(.5, 0);
		item.activeLabel.anchor.set(.5, 0);
		item.activeLabel.zOrder++;
		item.activeLabel.alpha = i == 0 ? 1 : 0;
		item.index = i;
		shadow.anchor.set(.5, 0)
		globals.game.stage.addChild(shadow);
		globals.game.stage.addChild(item.label);
		globals.game.stage.addChild(item.activeLabel);
	});
},

credit(){
	const text = '2019 PEACE RESEARCH', x = globals.grid * 2 + 2, y = globals.gameHeight - globals.grid,
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
	const versionText = 'v0.02', x = globals.winWidth - globals.grid, y = globals.gameHeight - globals.grid;
	const label = chrome.label(versionText, x, y),
		shadow = chrome.label(versionText, x, y, 'dark');
	label.anchor.set(1);
	shadow.anchor.set(1);
	globals.game.stage.addChild(shadow);
	globals.game.stage.addChild(label);
},

highScore(){
	const text = 'HIGH SCORE: ' + chrome.processScore(globals.highScore), x = globals.winWidth / 2,
		y = globals.gameHeight - globals.grid;
	const label = chrome.label(text, x, y), shadow = chrome.label(text, x, y, 'dark');
	label.anchor.set(.5, 1);
	shadow.anchor.set(.5, 1);
	globals.game.stage.addChild(shadow);
	globals.game.stage.addChild(label);
},

changeOption(down){
	if(down) this.currentOption++;
	else this.currentOption--;
	if(this.currentOption == this.optionItems.length) this.currentOption = 0;
	if(this.currentOption == -1) this.currentOption = this.optionItems.length - 1;
	this.optionItems.forEach((item, i) => {
		if(i == this.currentOption) item.activeLabel.alpha = 1;
		else if(item.activeLabel.alpha) item.activeLabel.alpha = 0;
	});
	sound.spawn('changeSelect');
},

controlText(){
	const y = globals.grid * 19.5,
		labels = [
			'Arrow Keys / D-Pad: Move            ',
			'Z / Btn 1: Shoot  ',
			'Shift / Btn 2: Focus      ',
			'Esc / Btn 5: Pause    ',
			'         R / Btn 6: Return to Title',
			'            F: Fullscreen'

		],
		x = globals.winWidth / 2,
		addLabel = (input, i) => {
			const offset = (globals.grid * 1 + 4) * i;
			const label = chrome.label(input, x, y + offset, 'brown'), shadow = chrome.label(input, x, y + offset, 'dark');
			label.anchor.set(.5, 0);
			shadow.anchor.set(.5, 0);
			globals.game.stage.addChild(shadow);
			globals.game.stage.addChild(label);
		}
	labels.forEach(addLabel);
},

selectOption(){
	switch(this.currentOption){
		case 0:
			sound.spawn('startGame');
			globals.startGame();
			break;
		case 1:
			sound.spawn('startGame');
			globals.startGame();
			break;
		case 2:
			require('electron').remote.app.quit();
			break;
	}
},

init(){
	sound.playBgm('title');
	this.bg();
	this.title();
	this.options();
	this.credit();
	this.version();
	// this.controlText();
	this.highScore();
	globals.startGame();
}

};