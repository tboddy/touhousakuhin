// 東方作品 ～ Rank Down!
// touhou sakuhin

const storage = require('electron-json-storage'),
	PIXI = require('pixi.js'),
	globals = require('./src/globals.js'),
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
	pixiProjection = require('pixi-projection');

let enemyCount = 0, bulletCount = 0, chipCount = 0, lastEnemyCount = 0;

const mainLoop = delta => {
	// if(sound.list.bgmOne.playing()) sound.list.bgmOne.stop();
	enemyCount = 0;
	globals.enemyCount = 0;
	bulletCount = 0;
	let enemyDistances = [];
	for(var i = 0; i < globals.game.stage.children.length; i++){
		const child = globals.game.stage.children[i]
		if(child.type){
			switch(child.type){
				case 'player':
					player.update(child, i, delta);
					collision.placeItem(child, i);
					break;
				case 'playerBullet':
					if(!globals.paused) player.updateBullet(child, i, delta);
					collision.placeItem(child, i);
					bulletCount++;
					break;
				case 'enemy':
					stageUtils.updateEnemy(child, i, delta);
					collision.placeItem(child, i);
					if(child.seen){
						enemyDistances.push({
							enemy: child,
							distance: Math.hypot(child.x - player.sprite.x, child.y - player.sprite.y)
						})
					}
					enemyCount++;
					break;
				case 'bullet':
					if(!globals.paused) stageUtils.updateBullet(child, i, delta);
					collision.placeItem(child, i);
					bulletCount++;
					break;
				case 'chip':
					if(!globals.paused) chips.update(child, i, delta);
					collision.placeItem(child, i);
					break;
				case 'chipPower':
					if(!globals.paused) chips.updatePower(child, i, delta);
					collision.placeItem(child, i);
					break;
				case 'debugEnemies': chrome.updateDebugEnemies(child); break;
				case 'debugBullets': chrome.updateDebugBullets(child); break;
				case 'debugFps': chrome.updateDebugFps(child); break;
				case 'explosion': explosion.update(child, i); break;
				case 'graze': graze.update(child, i); break;
				case 'bossBorder': if(!globals.paused) stageUtils.updateBossBorder(child, i); break;
				case 'mapBlock':
					if(!globals.paused) stage.updateBlock(child, i);
					collision.placeItem(child, i);
					break;
				// case 'lifeImage': globals.game.stage.removeChildAt(i); break;
				// case 'bombImage': globals.game.stage.removeChildAt(i); break;
			}
		}
	}
	collision.update();
	stage.update();
	sortZ();
	controls.updateGamepad();
	if(enemyDistances.length){
		enemyDistances.forEach(enemy => {
			if(enemy.enemy.y < globals.gameHeight - enemy.enemy.height / 2){
				if(!globals.lowestDistance) globals.lowestDistance = enemy.enemy;
				else if(enemy.distance < globals.lowestDistance.distance) globals.lowestDistance = enemy.enemy;
			}
		});
	} else globals.lowestDistance = false;
	if(!globals.paused) globals.timeLeft--;
	if(globals.removeBullets){
		if(!globals.removeBulletsTime) globals.removeBulletsTime = 30;
		globals.removeBulletsTime--;
		if(!globals.removeBulletsTime) globals.removeBullets = false;
	}
	if(globals.gameClock % 2 == 0) lastEnemyCount = enemyCount;
	globals.gameClock++;
},

sortZ = () => {
	if(!globals.paused){
		globals.game.stage.children.sort((a, b) => {
	    a.zOrder = a.zOrder || 0;
	    b.zOrder = b.zOrder || 0;
	    return a.zOrder - b.zOrder
		});
	}
},

init = () => {
	storage.get('savedData', (err, data) => {
		globals.savedData = data;
		if(globals.savedData.highScore) globals.highScore = globals.savedData.highScore;
			globals.initGame();
			start.init();
			controls.init();
	});
};

setTimeout(init, 500)
