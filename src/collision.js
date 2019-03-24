module.exports = {

sects: false,
collisionWidth: 12,
collisionHeight: 14,
size: 32,

resetSects(){
	const sects = [];
	for(i = 0; i < this.collisionHeight; i++){
		const row = [];
		for(j = 0; j < this.collisionWidth; j++) row.push({playerBullet: false, enemy: false, bullet: false});
		sects.push(row)
	};
	return sects;
},

drawSects(){
	const lines = new PIXI.Graphics();
	lines.beginFill(globals.hex.green);
	for(i = 0; i < this.sects.length; i++){
		for(j = 0; j < this.sects[i].length; j++){
			if(i == 0) lines.drawRect(this.size * j + globals.gameX, this.size * i + globals.grid, this.size, 1);
			lines.drawRect(this.size * j + globals.gameX, this.size * i + this.size + globals.grid, this.size, 1);
			if(j == 0) lines.drawRect(this.size * j + globals.gameX, this.size * i + globals.grid, 1, this.size);
			lines.drawRect(this.size * j + globals.gameX + this.size, this.size * i + globals.grid, 1, this.size);
		}
	}
	globals.containers.collisionDebug.addChild(lines);
},

placeItem(item, index){
	const x = Math.floor((item.x - globals.gameX) / this.size), y = Math.floor((item.y - globals.grid) / this.size), thisObj = this;
	if(this.sects[y] && (this.sects[y][x])){
		index = String(index);
		thisObj.sects[y][x][item.type] = index;
		if(thisObj.sects[y][x - 1]) thisObj.sects[y][x - 1][item.type] = index;
		if(thisObj.sects[y][x + 1]) thisObj.sects[y][x + 1][item.type] = index;
		if(thisObj.sects[y - 1]){
			thisObj.sects[y - 1][x][item.type] = index;
			if(thisObj.sects[y - 1][x - 1]) thisObj.sects[y - 1][x - 1][item.type] = index;
			if(thisObj.sects[y - 1][x + 1]) thisObj.sects[y - 1][x + 1][item.type] = index;
		}
		if(thisObj.sects[y + 1]){
			thisObj.sects[y + 1][x][item.type] = index;
			if(thisObj.sects[y + 1][x - 1]) thisObj.sects[y + 1][x - 1][item.type] = index;
			if(thisObj.sects[y + 1][x + 1]) thisObj.sects[y + 1][x + 1][item.type] = index;
		}
	}
},

check(){
	let enemyHit = false, blockHit = false;
	const thisObj = this, checkPlayerBulletAgainstEnemy = (bullet, enemy, i, j) => {
		if(bullet.x + bullet.width / 2 >= enemy.x - enemy.width / 2 &&
			bullet.x - bullet.height / 2 <= enemy.x + enemy.width - enemy.width / 2 &&
		  bullet.y + bullet.height / 2 >= enemy.y - enemy.height / 2 &&
		  bullet.y - bullet.height / 2 <= enemy.y + enemy.height - enemy.height / 2 &&
			bullet.y - bullet.height / 2 > 0){
			enemyHit = {
				enemy: enemy,
				bullet: {x: bullet.x, y: bullet.y},
				sect: thisObj.sects[i][j],
				isBlue: bullet.isBlue,
				damage: bullet.damage
			};
			bullet.y = -globals.winHeight;
			thisObj.sects[i][j].bullet = false;
		}
	}, checkPlayerBulletAgainstBlock = (bullet, block, i, j) => {
		if(bullet.x + bullet.width / 2 >= block.x - block.width / 2 && bullet.x - bullet.height / 2 <= block.x + block.width - block.width / 2 &&
		  bullet.y + bullet.height / 2 >= block.y - block.height / 2 && bullet.y - bullet.height / 2 <= block.y + block.height - block.height / 2 &&
			bullet.y - bullet.height / 2 > 0){
			blockHit = {
				block: block,
				bullet: {x: bullet.x, y: bullet.y},
				sect: thisObj.sects[i][j],
				isBlue: bullet.isBlue
			};
			bullet.y = -globals.winHeight;
			thisObj.sects[i][j].bullet = false;
		}
	}, checkObjAgainstPlayer = obj => {
		const dx = player.sprite.x - obj.x, dy = player.sprite.y - obj.y, radii = obj.width / 2;
		if(dx * dx + dy * dy < radii * radii){
			if(!globals.gameOver && !player.invincible){
				explosion.spawn(player.sprite, false, true);
				player.graze = 0;
				globals.removeBullets = true;
				if(!obj.isBoss) obj.y = -globals.winHeight;
				if(player.power > 0){
					player.invulnerableClock = 60 * 2;
					player.power--;
				} else{
					player.lives = 0;
					globals.gameOver = true;
				}
			}
		}
	}, checkChip = chip => {
		if(chip.x + chip.width / 2 >= player.sprite.x - player.sprite.width / 2 && chip.x - chip.height / 2 <= player.sprite.x + player.sprite.width - player.sprite.width / 2 &&
		  chip.y + chip.height / 2 >= player.sprite.y - player.sprite.height / 2 && chip.y - chip.height / 2 <= player.sprite.y + player.sprite.height - player.sprite.height / 2 &&
			chip.y - chip.height / 2 > 0){
			chip.y = globals.winHeight * 2;
			switch(chip.type){
				case 'chipPower':
					let amt = 5000;
					if(player.power < 3){
						player.power++;
						sound.spawn('powerUp');
						chrome.addFieldLabel('POWER+', player.sprite);
					} else {
						amt *= 10;
						chrome.showBonus(Math.round(amt));
						sound.spawn('bonus');
					}
					globals.score += amt;
					thisObj.sects[i][j].powerChip = false;
					break;
			}
		}
	};
	for(i = 0; i < this.sects.length; i++){
		for(j = 0; j < this.sects[0].length; j++){
			if(thisObj.sects[i][j].enemy && thisObj.sects[i][j].playerBullet &&
				(thisObj.sects[i][j].playerBullet < globals.containers.playerBullets.children.length &&
				thisObj.sects[i][j].enemy < globals.containers.enemies.children.length)){
					checkPlayerBulletAgainstEnemy(
						globals.containers.playerBullets.getChildAt(thisObj.sects[i][j].playerBullet),
						globals.containers.enemies.getChildAt(thisObj.sects[i][j].enemy), i, j);
			} else if(thisObj.sects[i][j].mapBlock && thisObj.sects[i][j].playerBullet && 
				(thisObj.sects[i][j].playerBullet < globals.containers.playerBullets.children.length &&
				thisObj.sects[i][j].mapBlock < globals.containers.blocks.children.length))
				checkPlayerBulletAgainstBlock(
					globals.containers.playerBullets.getChildAt(thisObj.sects[i][j].playerBullet),
					globals.containers.blocks.getChildAt(thisObj.sects[i][j].mapBlock), i, j);
			if(thisObj.sects[i][j].player){
				if(!player.invulnerableClock){
					if(thisObj.sects[i][j].bullet && thisObj.sects[i][j].bullet < globals.containers.enemyBullets.children.length){
						const bullet = globals.containers.enemyBullets.getChildAt(thisObj.sects[i][j].bullet)
						checkObjAgainstPlayer(bullet);
						if(bullet.x + bullet.width / 2 >= player.sprite.x - player.sprite.width / 2 &&
							bullet.x - bullet.height / 2 <= player.sprite.x + player.sprite.width / 2 &&
							bullet.y + bullet.height / 2 >= player.sprite.y - player.sprite.height / 2 &&
							bullet.y - bullet.height / 2 <= player.sprite.y + player.sprite.height / 2) {
							if(!bullet.grazed){
								bullet.grazed = true;
								player.graze++;
								graze.spawn(bullet);
							}
						}
					}
					if(thisObj.sects[i][j].enemy && thisObj.sects[i][j].enemy < globals.containers.enemies.children.length)
						checkObjAgainstPlayer(globals.containers.enemies.getChildAt(thisObj.sects[i][j].enemy));
				}
				if(thisObj.sects[i][j].chipPower) checkChip(globals.game.stage.getChildAt(thisObj.sects[i][j].chipPower));
			}
		}
	}
	if(enemyHit){
		if(enemyHit.enemy.health > 0){
			explosion.spawn(enemyHit.bullet, enemyHit.isBlue);
			enemyHit.enemy.health -= enemyHit.damage;
		} else {
			explosion.spawn(enemyHit.bullet, enemyHit.isBlue, true);
			globals.score += 5000;
			if(enemyHit.enemy.suicide) enemyHit.enemy.suicide(enemyHit.enemy);
			enemyHit.enemy.y = globals.winHeight * 2;
			enemyHit.sect.enemy = false;
		}
	}
	if(blockHit){
		if(blockHit.block.health){
			explosion.spawn(blockHit.bullet, blockHit.isBlue);
			blockHit.block.health--;
			if(blockHit.block.special){
				if(blockHit.block.hitCount == 2 && blockHit.block.alpha != 1) blockHit.block.alpha = 1;
				blockHit.block.hitCount++;
			}
		}
		else {
			explosion.spawn(blockHit.bullet, blockHit.isBlue, true);
			if(blockHit.block.power) chips.spawnPower(blockHit.block);
			else {
				const blockScore = blockHit.block.special ? globals.specialScore : 1000;
				if(blockHit.block.special){
					chrome.showBonus(globals.specialScore);
					sound.spawn('bonus');
					globals.specialScore *= 1.25;
					globals.specialScore = Math.round(globals.specialScore)
				}
				globals.score += blockScore;
			}
			blockHit.block.hit = true;
		}
	}
},

update(){
	this.check();
	this.sects = this.resetSects();
	// if(globals.gameClock == 0) this.drawSects();
}

};