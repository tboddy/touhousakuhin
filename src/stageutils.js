module.exports = {

canSpawn: true,
bossPosition: {x: 0, y: 0},
bossBorder: false,

spawnEnemy(type, x, y, initFunc, updateFunc){
	let enemy;
	switch(type){
		case 'fairyBlue':
			enemy = PIXI.Sprite.from(sprites.enemies.fairyBlue.center0);
			enemy.textureCenter0 = sprites.enemies.fairyBlue.center0;
			enemy.textureCenter1 = sprites.enemies.fairyBlue.center1;
			enemy.textureCenter2 = sprites.enemies.fairyBlue.center2;
			enemy.textureLeft0 = sprites.enemies.fairyBlue.left0;
			enemy.textureLeft1 = sprites.enemies.fairyBlue.left1;
			enemy.textureLeft2 = sprites.enemies.fairyBlue.left2;
			enemy.textureRight0 = sprites.enemies.fairyBlue.right0;
			enemy.textureRight1 = sprites.enemies.fairyBlue.right1;
			enemy.textureRight2 = sprites.enemies.fairyBlue.right2;
			enemy.enemyType = 'fairy';
			enemy.idleClock = 0;
			break;
		case 'fairyRed':
			enemy = PIXI.Sprite.from(sprites.enemies.fairyRed.center0);
			enemy.textureCenter0 = sprites.enemies.fairyRed.center0;
			enemy.textureCenter1 = sprites.enemies.fairyRed.center1;
			enemy.textureCenter2 = sprites.enemies.fairyRed.center2;
			enemy.textureLeft0 = sprites.enemies.fairyRed.left0;
			enemy.textureLeft1 = sprites.enemies.fairyRed.left1;
			enemy.textureLeft2 = sprites.enemies.fairyRed.left2;
			enemy.textureRight0 = sprites.enemies.fairyRed.right0;
			enemy.textureRight1 = sprites.enemies.fairyRed.right1;
			enemy.textureRight2 = sprites.enemies.fairyRed.right2;
			enemy.enemyType = 'fairy';
			enemy.idleClock = 0;
			break;
		case 'fairyGreen':
			enemy = PIXI.Sprite.from(sprites.enemies.fairyGreen.center0);
			enemy.textureCenter0 = sprites.enemies.fairyGreen.center0;
			enemy.textureCenter1 = sprites.enemies.fairyGreen.center1;
			enemy.textureCenter2 = sprites.enemies.fairyGreen.center2;
			enemy.textureLeft0 = sprites.enemies.fairyGreen.left0;
			enemy.textureLeft1 = sprites.enemies.fairyGreen.left1;
			enemy.textureLeft2 = sprites.enemies.fairyGreen.left2;
			enemy.textureRight0 = sprites.enemies.fairyGreen.right0;
			enemy.textureRight1 = sprites.enemies.fairyGreen.right1;
			enemy.textureRight2 = sprites.enemies.fairyGreen.right2;
			enemy.enemyType = 'fairy';
			enemy.idleClock = 0;
			break;
		case 'fairyYellow':
			enemy = PIXI.Sprite.from(sprites.enemies.fairyYellow.center0);
			enemy.textureCenter0 = sprites.enemies.fairyYellow.center0;
			enemy.textureCenter1 = sprites.enemies.fairyYellow.center1;
			enemy.textureCenter2 = sprites.enemies.fairyYellow.center2;
			enemy.textureLeft0 = sprites.enemies.fairyYellow.left0;
			enemy.textureLeft1 = sprites.enemies.fairyYellow.left1;
			enemy.textureLeft2 = sprites.enemies.fairyYellow.left2;
			enemy.textureRight0 = sprites.enemies.fairyYellow.right0;
			enemy.textureRight1 = sprites.enemies.fairyYellow.right1;
			enemy.textureRight2 = sprites.enemies.fairyYellow.right2;
			enemy.enemyType = 'fairy';
			enemy.idleClock = 0;
			break;
		case 'fairyBig':
			enemy = PIXI.Sprite.from(sprites.enemies.fairyBig.center0);
			enemy.textureCenter0 = sprites.enemies.fairyBig.center0;
			enemy.textureCenter1 = sprites.enemies.fairyBig.center1;
			enemy.textureCenter2 = sprites.enemies.fairyBig.center2;
			enemy.enemyType = 'fairyBig';
			enemy.idleClock = 0;
			break;

		case 'lily':
			enemy = PIXI.Sprite.fromImage('img/enemies/lily-00.png');
			enemy.textureCenter0 = PIXI.Texture.fromImage('img/enemies/lily-00.png');
			enemy.textureCenter1 = PIXI.Texture.fromImage('img/enemies/lily-01.png');
			enemy.textureCenter2 = PIXI.Texture.fromImage('img/enemies/lily-02.png');
			enemy.enemyType = 'fairy';
			enemy.idleClock = 0;
			break;

		case 'komachi':
			enemy = PIXI.Sprite.fromImage('img/boss/komachi-center00.png');
			enemy.textureCenter0 = PIXI.Texture.fromImage('img/boss/komachi-center00.png');
			enemy.textureCenter1 = PIXI.Texture.fromImage('img/boss/komachi-center01.png');
			enemy.textureCenter2 = PIXI.Texture.fromImage('img/boss/komachi-center02.png');
			enemy.idleClock = 0;
			enemy.enemyType = 'boss';
			enemy.isBoss = true;
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
	enemy.lastX = enemy.x;
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
	}
},

updateEnemy(enemy, index){
	globals.enemyCount++;
	if(!globals.paused){
		switch(enemy.enemyType){
			case 'fairy':
				if(enemy.idleClock % globals.idleInterval == 0){
					if(enemy.x < enemy.lastX) enemy.texture = enemy.textureLeft1;
					else if(enemy.x > enemy.lastX) enemy.texture = enemy.textureRight1;
					else enemy.texture = enemy.textureCenter1;
				} else if(enemy.idleClock % globals.idleInterval == globals.idleInterval / 4 || enemy.idleClock % globals.idleInterval == globals.idleInterval / 4 * 3){
					if(enemy.x < enemy.lastX) enemy.texture = enemy.textureLeft0;
					else if(enemy.x > enemy.lastX) enemy.texture = enemy.textureRight0;
					else enemy.texture = enemy.textureCenter0;
				} else if(enemy.idleClock % globals.idleInterval == globals.idleInterval / 2){
					if(enemy.x < enemy.lastX) enemy.texture = enemy.textureLeft2;
					else if(enemy.x > enemy.lastX) enemy.texture = enemy.textureRight2;
					else enemy.texture = enemy.textureCenter2;
				}
				enemy.idleClock++;
				break;
			case 'fairyBig':
				if(enemy.idleClock % globals.idleInterval == 0){
					enemy.texture = enemy.textureCenter1;
				} else if(enemy.idleClock % globals.idleInterval == globals.idleInterval / 4 || enemy.idleClock % globals.idleInterval == globals.idleInterval / 4 * 3){
					enemy.texture = enemy.textureCenter0;
				} else if(enemy.idleClock % globals.idleInterval == globals.idleInterval / 2){
					enemy.texture = enemy.textureCenter2;
				}
				enemy.idleClock++;
				break;
			case 'boss':
				if(enemy.idleClock % globals.idleInterval == 0) enemy.texture = enemy.textureCenter0;
				else if(enemy.idleClock % globals.idleInterval == globals.idleInterval / 4 || enemy.idleClock % globals.idleInterval == globals.idleInterval / 4 * 3) enemy.texture = enemy.textureCenter1;
				else if(enemy.idleClock % globals.idleInterval == globals.idleInterval / 2) enemy.texture = enemy.textureCenter2;
				enemy.idleClock++;
				break;
		}
		enemy.lastX = enemy.x;
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
			enemy.x <= globals.gameWidth + globals.gameX && enemy.y <= globals.winHeight && !enemy.seen) enemy.seen = true;
		if(enemy.seen && (enemy.y >= globals.winHeight + enemy.height / 2 || enemy.y <= -enemy.height / 2 ||
			enemy.x >= globals.gameWidth + enemy.width / 2 + globals.gameX ||
			enemy.x <= -enemy.width / 2 + globals.gameX)) globals.game.stage.removeChildAt(index);
	}
},

spawnBullet(type, x, y, angle, initFunc, updateFunc){
	if(x >= -globals.gameWidth / 2 && x <= globals.gameWidth * 1.5 && y >= -globals.winHeight / 2 && y <= globals.winHeight * 1.5 &&
		!globals.gameOver){
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
		bullet.y >= globals.grid - bullet.height / 2 &&
		bullet.x < globals.gameX + globals.gameWidth + bullet.width / 2 &&
		bullet.y < globals.winHeight + bullet.height / 2 - globals.grid && !bullet.seen) bullet.seen = true;
	if(bullet.seen && (bullet.y >= globals.grid + globals.winHeight + globals.winHeight / 8 ||
		bullet.y <= globals.grid - globals.winHeight / 8 ||
		bullet.x >= globals.gameX + globals.gameWidth + globals.gameWidth / 8 ||
		bullet.x <= globals.gameX - globals.gameWidth / 8)) globals.game.stage.removeChildAt(index);
	if(globals.removeBullets){
		explosion.spawn(bullet, bullet.texture.baseTexture.imageUrl.indexOf('blue') > -1, false, false, true)
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
	for(i = 0; i < globals.game.stage.children.length; i++){
		if(globals.game.stage.children.length[i].type && (globals.game.stage.children.length[i].type == 'enemy') && !hasEnemies) hasEnemies = true;
	}
	return hasEnemies;
},

killBoss(enemy){
	globals.deadBoss = {x: enemy.x, y: enemy.y};
	globals.stageFinished = true;
	enemy.y = globals.winHeight * 2;
	this.bossBorder.kill = true;
	globals.bossActive = false;
},

nextStage(){
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