module.exports = {

canSpawn: true,
bossPosition: {x: 0, y: 0},
bossBorder: false,
bossBorderShadow: false,

spawnEnemy(type, x, y, initFunc, updateFunc){
	let enemy;
	switch(type){
		case 'fairyBlue':
			enemy = PIXI.Sprite.fromImage('img/enemies/fairy-blue-center00.png');
			enemy.textureCenter0 = PIXI.Texture.fromImage('img/enemies/fairy-blue-center00.png');
			enemy.textureCenter1 = PIXI.Texture.fromImage('img/enemies/fairy-blue-center01.png');
			enemy.textureCenter2 = PIXI.Texture.fromImage('img/enemies/fairy-blue-center02.png');
			enemy.enemyType = 'fairy';
			enemy.idleClock = 0;
			break;
		case 'fairyRed':
			enemy = PIXI.Sprite.fromImage('img/enemies/fairy-red-center00.png');
			enemy.textureCenter0 = PIXI.Texture.fromImage('img/enemies/fairy-red-center00.png');
			enemy.textureCenter1 = PIXI.Texture.fromImage('img/enemies/fairy-red-center01.png');
			enemy.textureCenter2 = PIXI.Texture.fromImage('img/enemies/fairy-red-center02.png');
			enemy.enemyType = 'fairy';
			enemy.idleClock = 0;
			break;
		case 'fairyGreen':
			enemy = PIXI.Sprite.fromImage('img/enemies/fairy-green-center00.png');
			enemy.textureCenter0 = PIXI.Texture.fromImage('img/enemies/fairy-green-center00.png');
			enemy.textureCenter1 = PIXI.Texture.fromImage('img/enemies/fairy-green-center01.png');
			enemy.textureCenter2 = PIXI.Texture.fromImage('img/enemies/fairy-green-center02.png');
			enemy.enemyType = 'fairy';
			enemy.idleClock = 0;
			break;
		case 'yinyangTopLeft':
			enemy = PIXI.Sprite.fromImage('img/enemies/yinyang-topleft.png');
			break;
		case 'yinyangTopRight':
			enemy = PIXI.Sprite.fromImage('img/enemies/yinyang-topright.png');
			break;
		case 'yinyangBottomLeft':
			enemy = PIXI.Sprite.fromImage('img/enemies/yinyang-bottomleft.png');
			break;
		case 'yinyangBottomRight':
			enemy = PIXI.Sprite.fromImage('img/enemies/yinyang-bottomright.png');
			break;
		case 'yinyang':
			enemy = PIXI.Sprite.fromImage('img/enemies/yinyang.png');
			break;
		case 'komachi':
			enemy = PIXI.Sprite.fromImage('img/boss/komachi-center00.png');
			enemy.textureCenter0 = PIXI.Texture.fromImage('img/boss/komachi-center00.png');
			enemy.textureCenter1 = PIXI.Texture.fromImage('img/boss/komachi-center01.png');
			enemy.textureCenter2 = PIXI.Texture.fromImage('img/boss/komachi-center02.png');
			enemy.idleClock = 0;
			enemy.enemyType = 'boss';
			globals.bossName = 'komachi';
			break;
		case 'eiki':
			enemy = PIXI.Sprite.fromImage('img/boss/eiki-center00.png');
			enemy.textureCenter0 = PIXI.Texture.fromImage('img/boss/eiki-center00.png');
			enemy.textureCenter1 = PIXI.Texture.fromImage('img/boss/eiki-center01.png');
			enemy.textureCenter2 = PIXI.Texture.fromImage('img/boss/eiki-center02.png');
			enemy.idleClock = 0;
			enemy.enemyType = 'boss';
			enemy.isBoss = true;
			globals.bossName = 'eiki';
			break;
	}
	enemy.anchor.set(.5);
	enemy.type = 'enemy';
	enemy.x = Math.round(x);
	enemy.y = Math.round(y);
	enemy.clock = 0;
	enemy.zOrder = 50;
	enemy.updateFunc = updateFunc;
	initFunc(enemy);
	globals.game.stage.addChild(enemy);
	if(enemy.isBoss){
		this.bossBorder = PIXI.Sprite.fromImage('img/boss/border-' + globals.bossName + '.png');
		this.bossBorder.anchor.set(.5);
		this.bossBorder.type = 'bossBorder';
		this.bossBorder.x = x;
		this.bossBorder.y = y - 1;
		this.bossBorder.zOrder = 17;
		this.bossBorder.clock = 0;
		this.bossBorder.scaleUp = false;
		globals.game.stage.addChild(this.bossBorder);
		this.bossBorderShadow = PIXI.Sprite.fromImage('img/boss/border-shadow.png');
		this.bossBorderShadow.anchor.set(.5);
		this.bossBorderShadow.type = 'bossBorder';
		this.bossBorderShadow.isShadow = true;
		this.bossBorderShadow.x = x;
		this.bossBorderShadow.y = y - 1;
		this.bossBorderShadow.zOrder = 16.5;
		this.bossBorderShadow.clock = 0;
		this.bossBorderShadow.scaleUp = false;
		globals.game.stage.addChild(this.bossBorderShadow);
	}
},

updateEnemy(enemy, index){
	globals.enemyCount++;
	if(!globals.paused){
		switch(enemy.enemyType){
			case 'fairy':
				const color = enemy.texture.baseTexture.imageUrl.indexOf('red') > -1 ? 'red' : 'blue';
				if(enemy.angle == Math.PI / 2 && enemy.texture.baseTexture.imageUrl.indexOf('center') == -1){
					enemy.textureCenter0 = PIXI.Texture.fromImage('img/enemies/fairy-' + color + '-center00.png');
					enemy.textureCenter1 = PIXI.Texture.fromImage('img/enemies/fairy-' + color + '-center01.png');
					enemy.textureCenter2 = PIXI.Texture.fromImage('img/enemies/fairy-' + color + '-center02.png');
				}
				if(enemy.idleClock % globals.idleInterval == 0) enemy.texture = enemy.textureCenter0;
				else if(enemy.idleClock % globals.idleInterval == globals.idleInterval / 4 || enemy.idleClock % globals.idleInterval == globals.idleInterval / 4 * 3) enemy.texture = enemy.textureCenter1;
				else if(enemy.idleClock % globals.idleInterval == globals.idleInterval / 2) enemy.texture = enemy.textureCenter2;
				enemy.idleClock++;
				break;
			case 'boss':
				if(enemy.idleClock % globals.idleInterval == 0) enemy.texture = enemy.textureCenter0;
				else if(enemy.idleClock % globals.idleInterval == globals.idleInterval / 4 || enemy.idleClock % globals.idleInterval == globals.idleInterval / 4 * 3) enemy.texture = enemy.textureCenter1;
				else if(enemy.idleClock % globals.idleInterval == globals.idleInterval / 2) enemy.texture = enemy.textureCenter2;
				enemy.idleClock++;
				break;
		}
		if(enemy.isBoss){
			if(!globals.bossActive) globals.bossActive = true;
			this.bossPosition.x = enemy.x;
			this.bossPosition.y = enemy.y;
			globals.bossHealth = enemy.health;
		} else if(globals.bossActive) globals.bossActive = false;
		if(enemy.velocity){
			enemy.x += enemy.velocity.x;
			enemy.y += enemy.velocity.y;
		}
		if(enemy.updateFunc) enemy.updateFunc(enemy, index);
		enemy.clock++;
		if(enemy.x >= globals.gameX && enemy.y >= 0 &&
			enemy.x <= globals.gameWidth + globals.gameX && enemy.y <= globals.gameHeight && !enemy.seen) enemy.seen = true;
		if(enemy.seen && (enemy.y >= globals.gameHeight + enemy.height / 2 || enemy.y <= -enemy.height / 2 ||
			enemy.x >= globals.gameWidth + enemy.width / 2 + globals.gameX ||
			enemy.x <= -enemy.width / 2 + globals.gameX)) globals.game.stage.removeChildAt(index);
	}
},

spawnBullet(type, x, y, angle, initFunc, updateFunc){
	if(x >= -globals.gameWidth / 2 && x <= globals.gameWidth * 1.5 && y >= -globals.gameHeight / 2 && y <= globals.gameHeight * 1.5){
		const bullet = PIXI.Sprite.fromImage('img/bullets/' + type + '.png');
		bullet.anchor.set(.5);
		bullet.type = 'bullet';
		bullet.x = x;
		bullet.y = y;
		bullet.clock = 0;
		if(angle) bullet.angle = angle;
		bullet.updateFunc = updateFunc;
		bullet.zOrder = 70;
		if(initFunc) initFunc(bullet);
		globals.game.stage.addChild(bullet);
	}
},

updateBullet(bullet, index){
	if(bullet.updateFunc) bullet.updateFunc(bullet, index);
	if(bullet.velocity){
		bullet.x += bullet.velocity.x;
		bullet.y += bullet.velocity.y;
	}
	bullet.zOrder += 0.001;
	bullet.clock++;
	if(bullet.x >= globals.gameX - bullet.width / 2 &&
		bullet.y >= 0 - bullet.height / 2 &&
		bullet.x < globals.gameX + globals.gameWidth + bullet.width / 2 &&
		bullet.y < globals.gameHeight + bullet.height / 2 && !bullet.seen) bullet.seen = true;
	if(bullet.seen && (bullet.y >= globals.gameHeight + globals.gameHeight / 4 ||
		bullet.y <= -globals.gameHeight / 4 ||
		bullet.x >= globals.gameX + globals.gameWidth + globals.gameWidth / 4 ||
		bullet.x <= globals.gameX - globals.gameWidth / 4)) globals.game.stage.removeChildAt(index);
	if(globals.removeBullets){
		if(bullet.clock > 10) explosion.spawn(bullet, bullet.texture.baseTexture.imageUrl.indexOf('blue') > -1)
		globals.game.stage.removeChildAt(index);
	}
},

updateBossBorder(border, index){
	border.x = this.bossPosition.x;
	border.y = this.bossPosition.y;
	if(border.isShadow) border.y++;
	border.rotation += .01;
	border.clock++;
	const mod = 0.0015;
	border.scaleUp ? border.scale.set(border.scale.x += mod) : border.scale.set(border.scale.x -= mod);
	if(border.scale.x >= 1.2) border.scaleUp = false;
	else if(border.scale.x <= 1) border.scaleUp = true;
	if(border.kill) globals.game.stage.removeChildAt(index);
},

checkEnemies(){
	let hasEnemies = false;
	globals.game.stage.children.forEach(child => {
		if(child.type && (child.type == 'enemy') && !hasEnemies) hasEnemies = true;
	});
	return hasEnemies;
},

killBoss(enemy){
	globals.deadBoss = {x: enemy.x, y: enemy.y};
	globals.stageFinished = true;
	enemy.y = globals.gameHeight * 2;
	this.bossBorder.kill = true;
	globals.bossActive = false;
},

nextStage(){
	// if(chrome.finishedBg.y == 0){
	// 	player.sprite.x = globals.gameWidth / 2 - player.hitbox.width / 2;
	// 	player.sprite.y = globals.gameHeight - 30 - player.hitbox.height / 2;
	// 	stages.currentStage++;
	// 	globals.stageFinished = false;
	// 	background.reset();
	// 	globals.game.stage.removeChild(chrome.finishedBg);
	// 	globals.game.stage.removeChild(chrome.finishedTitle);
	// 	globals.game.stage.removeChild(chrome.finishedTitleShadow);
	// 	globals.game.stage.removeChild(chrome.finishedNoMissLabel);
	// 	globals.game.stage.removeChild(chrome.finishedNoMissLabelShadow);
	// 	globals.game.stage.removeChild(chrome.finishedBombLabel);
	// 	globals.game.stage.removeChild(chrome.finishedBombLabelShadow);
	// 	globals.game.stage.removeChild(chrome.finishedGrazeLabel);
	// 	globals.game.stage.removeChild(chrome.finishedGrazeLabelShadow);
	// 	globals.game.stage.removeChild(chrome.finishedTotalLabel);
	// 	globals.game.stage.removeChild(chrome.finishedTotalLabelShadow);
	// }
},

nextWave(wave, thisObj){
	thisObj.clock = -1;
	thisObj.currentWave = () => {
		if(!globals.gameOver){
			thisObj[wave]();
			if(!globals.paused) thisObj.clock++;
		}
	}
}

}