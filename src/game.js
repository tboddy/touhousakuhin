// 東方作品!
// touhou sakuhin

const storage = require('electron-json-storage'),
	PIXI = require('pixi.js'),
	globals = require('./src/globals.js'),
	sprites = require('./src/sprites.js'),
	chrome = require('./src/chrome.js'),
	player = require('./src/player.js'),
	controls = require('./src/controls.js'),
	stage = require('./src/stage.js'),
	stageUtils = require('./src/stageutils.js'),
	background = require('./src/background.js'),
	collision = require('./src/collision.js'),
	explosion = require('./src/explosion.js'),
	start = require('./src/start.js'),
	chips = require('./src/chips.js'),
	sound = require('./src/sound.js'),
	graze = require('./src/graze.js'),
	pixiProjection = require('pixi-projection'),
	enemies = require('./src/enemies.js');

let bulletCount = 0, chipCount = 0;

const mainLoop = delta => {
	bulletCount = 0;
	globals.enemyCount = 0;
	for(var i = 0; i < globals.game.stage.children.length; i++){
		const child = globals.game.stage.children[i]
		if(child.type){
			switch(child.type){
				case 'player':
					player.update(child, i, delta);
					collision.placeItem(child, i);
					break;
				// case 'playerBullet':
				// 	if(!globals.paused) player.updateBullet(child, i, delta);
				// 	collision.placeItem(child, i);
				// 	bulletCount++;
				// 	break;
				// case 'enemy':
				// 	stageUtils.updateEnemy(child, i);
				// 	collision.placeItem(child, i);
				// 	globals.enemyCount++;
				// 	break;
				case 'chipPower':
					if(!globals.paused) chips.updatePower(child, i, delta);
					collision.placeItem(child, i);
					break;
				case 'graze': graze.update(child, i); break;
				case 'bossBorder': if(!globals.paused) stageUtils.updateBossBorder(child, i); break;
				case 'mapBlock':
					if(!globals.paused) stage.updateBlock(child, i);
					collision.placeItem(child, i);
					break;
			}
		}
	}
	stageUtils.updateEnemies();
	stageUtils.updateEnemyBullets();
	stage.update();
	collision.update();
	explosion.update();
	if(!globals.paused) globals.timeLeft--;
	if(globals.removeBullets){
		if(!globals.removeBulletsTime) globals.removeBulletsTime = 30;
		globals.removeBulletsTime--;
		if(!globals.removeBulletsTime) globals.removeBullets = false;
	}
	if(globals.gameOver) globals.gameOverClock++;
	sortZ();
	globals.gameClock++;
},

sortZ = () => {
	if(!globals.paused){
		globals.game.stage.children.sort((a, b) => {
	    a.zOrder = a.zOrder || 0;
	    b.zOrder = b.zOrder || 0;
	    return a.zOrder - b.zOrder;
		});
	}
},

init = () => {
	storage.get('savedData', (err, data) => {
		globals.savedData = data;
		if(globals.savedData.highScore) globals.highScore = globals.savedData.highScore;
		if(globals.savedData.fullscreen){
			controls.isFullscreen = true;
			controls.mainWindow.setFullScreen(true);
		} else globals.savedData.fullscreen = false;
		const loader = new PIXI.loaders.Loader();
		loader.add('goldbox', './fonts/goldbox.fnt');
		loader.add('goldboxdark', './fonts/goldboxdark.fnt');
		loader.add('goldboxorange', './fonts/goldboxorange.fnt');
		loader.add('goldboxbrown', './fonts/goldboxbrown.fnt');
		loader.load(loader => {
			sprites.load();
			globals.initGame();
			start.init();
			controls.init();
		});
	});
};

document.addEventListener('DOMContentLoaded', init);
