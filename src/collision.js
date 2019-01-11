module.exports = {

	sects: false,
	collisionWidth: 18,
	collisionHeight: 24,
	size: 20,

	resetSects(){
		const sects = [];
		for(i = 0; i < this.collisionHeight; i++){
			const row = [];
			for(j = 0; j < this.collisionWidth + globals.gameX; j++) row.push({playerBullet: false, enemy: false, bullet: false});
			sects.push(row)
		};
		return sects;
	},

	placeItem(item, index){
		let x = Math.floor(item.x / this.size), y = Math.floor(item.y / this.size), thisObj = this;
		// console.log(x, y)
		if(x >= 0 && y >= 0 && this.sects[y] && (this.sects[y][x])){
			thisObj.sects[y][x][item.type] = index;
			if(item.type == 'enemy'){
				const widthDiff = Math.ceil(item.width / thisObj.size) - 1, heightDiff = Math.ceil(item.height / thisObj.size) - 1;
				if(thisObj.sects[y][x - 1]) thisObj.sects[y][x - 1].enemy = index;
				if(thisObj.sects[y - 1]){
					thisObj.sects[y - 1][x].enemy = index;
					if(thisObj.sects[y - 1][x - 1]) thisObj.sects[y - 1][x - 1].enemy = index;
				}
				if(widthDiff){
					for(i = 0; i < widthDiff; i++){
						if(thisObj.sects[y][x + i + 1]){
							thisObj.sects[y][x + i + 1].enemy = index;
							if(thisObj.sects[y - 1]) thisObj.sects[y - 1][x + i + 1].enemy = index;
						}
					}
				}
				if(heightDiff){
					for(i = 0; i < heightDiff; i++){
						if(thisObj.sects[y + i + 1]){
							thisObj.sects[y + i + 1][x].enemy = index;
							if(thisObj.sects[y + i + 1][x - 1]) thisObj.sects[y + i + 1][x - 1].enemy = index;
							if(thisObj.sects[y + i + 1][x + 1]) thisObj.sects[y + i + 1][x + 1].enemy = index;
						}
					}
				}
			} else {
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
		}
	},

	check(){
		let enemyHit = false, blockHit = false;
		const thisObj = this, checkPlayerBulletAgainstEnemy = (bullet, enemy, i, j) => {
			if(bullet.x + bullet.width / 2 >= enemy.x - enemy.width / 2 && bullet.x - bullet.height / 2 <= enemy.x + enemy.width - enemy.width / 2 &&
			  bullet.y + bullet.height / 2 >= enemy.y - enemy.height / 2 && bullet.y - bullet.height / 2 <= enemy.y + enemy.height - enemy.height / 2 &&
				bullet.y - bullet.height / 2 > 0){
				bullet.y = -globals.gameHeight;
				thisObj.sects[i][j].bullet = false;
				enemyHit = {
					enemy: enemy,
					sect: thisObj.sects[i][j]
				};
			}
		}, checkPlayerBulletAgainstBlock = (bullet, block, i, j) => {
			if(bullet.x + bullet.width / 2 >= block.x - block.width / 2 && bullet.x - bullet.height / 2 <= block.x + block.width - block.width / 2 &&
			  bullet.y + bullet.height / 2 >= block.y - block.height / 2 && bullet.y - bullet.height / 2 <= block.y + block.height - block.height / 2 &&
				bullet.y - bullet.height / 2 > 0){
				blockHit = {
					block: block,
					bullet: {x: bullet.x, y: bullet.y},
					sect: thisObj.sects[i][j]
				};
				bullet.y = -globals.gameHeight;
				thisObj.sects[i][j].bullet = false;
			}
		}, checkObjAgainstPlayer = obj => {
			const dx = player.sprite.x - obj.x, dy = player.sprite.y - obj.y, radii = (obj.width / 2) + (player.hitbox.width / 2 - 1);
			if(dx * dx + dy * dy < radii * radii){
				// if(!globals.gameOver && !player.bombClock){
				// 	explosion.spawn(player.sprite, false, false, true);
				// 	player.graze = 0;
				// 	globals.removeBullets = true;
				// 	if(!obj.isBoss) obj.y = -globals.gameHeight;
				// 	if(player.lives - 1){
				// 		player.invulnerableClock = 60 * 2;
				// 		player.lives--;
				// 	} else{
				// 		globals.gameOver = true;
				// 		globals.lostGame = true;
				// 	}
				// }
			}
		}, checkChip = chip => {
			if(chip.x + chip.width / 2 >= player.sprite.x - player.sprite.width / 2 && chip.x - chip.height / 2 <= player.sprite.x + player.sprite.width - player.sprite.width / 2 &&
			  chip.y + chip.height / 2 >= player.sprite.y - player.sprite.height / 2 && chip.y - chip.height / 2 <= player.sprite.y + player.sprite.height - player.sprite.height / 2 &&
				chip.y - chip.height / 2 > 0){
				chip.y = globals.gameHeight * 2;
				switch(chip.type){
					case 'chipPower':
						if(player.power < 3) player.power++;
						chrome.powerUpLabel.text = 'POW UP';
						if(player.power == 3){
							const amt = 50000;
							chrome.powerUpLabel.text + String(amt);
							globals.score += amt;
						} else globals.score += 5000;
						chrome.showPowerUp = true;
						thisObj.sects[i][j].powerChip = false;
						break;
				}
			}
		};
		for(i = 0; i < thisObj.sects.length; i++){
			for(j = 0; j < thisObj.sects[i].length; j++){
				if(thisObj.sects[i][j].enemy){
					if(thisObj.sects[i][j].playerBullet) checkPlayerBulletAgainstEnemy(globals.game.stage.getChildAt(thisObj.sects[i][j].playerBullet), globals.game.stage.getChildAt(thisObj.sects[i][j].enemy), i, j);
				} else if(thisObj.sects[i][j].mapBlock){
					if(thisObj.sects[i][j].playerBullet) checkPlayerBulletAgainstBlock(globals.game.stage.getChildAt(thisObj.sects[i][j].playerBullet), globals.game.stage.getChildAt(thisObj.sects[i][j].mapBlock), i, j);
				}
				if(thisObj.sects[i][j].player){
					if(!player.invulnerableClock){
						if(thisObj.sects[i][j].bullet){
							const bullet = globals.game.stage.getChildAt(thisObj.sects[i][j].bullet)
							checkObjAgainstPlayer(bullet);
							if(bullet.x + bullet.width / 2 >= player.sprite.x - player.sprite.width / 2 &&
								bullet.x - bullet.height / 2 <= player.sprite.x + player.sprite.width / 2 &&
								bullet.y + bullet.height / 2 >= player.sprite.y - player.sprite.height / 2 &&
								bullet.y - bullet.height / 2 <= player.sprite.y + player.sprite.height / 2) {
								if(!bullet.grazed){
									bullet.grazed = true;
									player.graze++;
									graze.spawn(bullet);
									sound.spawn('graze');
								}
							}
						}
						if(thisObj.sects[i][j].enemy) checkObjAgainstPlayer(globals.game.stage.getChildAt(thisObj.sects[i][j].enemy));
					}
					if(thisObj.sects[i][j].chipPower) checkChip(globals.game.stage.getChildAt(thisObj.sects[i][j].chipPower));
				}
			}
		}
		if(enemyHit){
			if(enemyHit.enemy.health){
				explosion.spawn(enemyHit.enemy, true);
				enemyHit.enemy.health--;
			} else {
				explosion.spawn(enemyHit.enemy, true, false, true);
				globals.score += 15;
				chips.spawn(enemyHit.enemy);
				enemyHit.enemy.y = globals.gameHeight * 2;
				enemyHit.sect.enemy = false;
			}
		}
		if(blockHit){
			if(blockHit.block.health){
				explosion.spawn(blockHit.bullet, true);
				blockHit.block.health--;
			}
			else {
				explosion.spawn(blockHit.bullet, true, false, true);
				if(blockHit.block.power){
					chips.spawnPower(blockHit.block);
				}
				globals.score += 1000;
				blockHit.block.hit = true;
			}
		}
	},

	update(){
		this.check();
		this.sects = this.resetSects();
	}

};