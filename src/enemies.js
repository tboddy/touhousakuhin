module.exports = {
clock: 0,
waveX: 0,
waveDrop: 0,
spawnedRegularMiniboss: false,

waveOne(){
	const spawnEnemy = opposite => {
		stageUtils.spawnEnemy('fairyBlue', globals.gameX + globals.gameWidth / 2, -globals.grid, enemy => {
			enemy.health = 2;
			enemy.initial = enemy.x;
			enemy.count = opposite ? 4 : 2;
		}, enemy => {
			enemy.y += 1.5;
			enemy.x = enemy.initial - Math.sin(enemy.count) * globals.grid * 8;
			enemy.count += .05;
		});
	}, interval = 20, wait = 30;
	if(this.clock % interval == 0){
		if(this.clock > wait && this.clock < interval * 7 + wait) spawnEnemy();
		else if(this.clock >= interval * 10 + wait && this.clock < interval * 17 + wait) spawnEnemy(true);
	}
	if(this.clock == interval * 25) stageUtils.nextWave('waveTwo', this);
},

waveTwo(){
	const spawnEnemy = opposite => {
		let y = globals.gameHeight / 4 + Math.floor(Math.random() * globals.gameHeight / 4);
		if(opposite) y -= globals.gameHeight / 6;
		stageUtils.spawnEnemy('fairyRed', opposite ? globals.gameX + globals.gameWidth + globals.grid : globals.gameX - globals.grid, y, enemy => {
			enemy.health = 2;
			enemy.speed = 3;
			enemy.speedInit = enemy.speed;
			if(opposite) enemy.opposite = true;
		}, enemy => {
			if(enemy.clock % 60 == 0) enemy.speed = enemy.speedInit;
			enemy.x += enemy.opposite ? -enemy.speed : enemy.speed;
			enemy.speed -= 0.05;
		});
	}, interval = 120;
	if(this.clock % 30 == 0){
		if(this.clock < interval) spawnEnemy();
		else if(this.clock >= interval && this.clock < interval * 2) spawnEnemy(true)
	}
	if(this.clock == interval * 2.25) stageUtils.nextWave('waveThree', this);
},

waveThree(){
	const offset = globals.grid * 2, spawnEnemy = opposite => {
		stageUtils.spawnEnemy('fairyBlue', this.waveX, -globals.grid, enemy => {
			const angle = globals.getAngle(player.sprite, enemy), speed = 4;
			enemy.health = 2;
			enemy.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
		});
		this.waveX += opposite ? offset : -offset;
	}, interval = 15, limit = 10;
	if(this.clock == 0) this.waveX = globals.gameX + globals.gameWidth - offset;
	if(this.clock % interval == 0){
		if(this.clock < interval * limit) spawnEnemy();
		else if(this.clock >= interval * limit && this.clock < interval * (limit * 2)){
			if(this.clock == interval * limit) this.waveX = globals.gameX + offset;
			spawnEnemy(true);
		}
	}
	if(this.clock == interval * (limit * 2.5)) stageUtils.nextWave('waveFour', this);
},

waveFour(){
	const spawnEnemies = () => {
		const offset = globals.grid * 3, spawnEnemy = opposite => {
			stageUtils.spawnEnemy('fairyRed', opposite ? globals.gameX + globals.gameWidth - offset : globals.gameX + offset, -globals.grid, enemy => {
				const angle = Math.PI / 2;
				enemy.speed = 3;
				enemy.health = 2;
				if(opposite) enemy.opposite;
				enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
			}, enemy => {
				if(enemy.clock == 90){
					const angle = opposite ? Math.PI * 1.25 : -Math.PI / 4;
					enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
				} else if(enemy.clock == 135){
					const angle = Math.PI / 2;
					enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
				}
			});
		};
		spawnEnemy();
		spawnEnemy(true);
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8) spawnEnemies();
	else if(this.clock == interval * 10) stageUtils.nextWave('waveFive', this);
},

waveFive(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('fairyBlue', globals.gameX + globals.grid * 3, -globals.grid, enemy => {
			enemy.health = 2;
			enemy.speed = 4;
			enemy.angle = Math.PI / 2;
		}, enemy => {
			if(enemy.clock >= 70){
				if(!enemy.finished){
					enemy.angle -= .03;
					if(enemy.angle <= -Math.PI){
						enemy.finished = true;
						if(enemy.angle != -Math.PI) enemy.angle = -Math.PI
					}
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, interval = 20;
	if(this.clock % interval == 0 && this.clock < interval * 10) spawnEnemy();
	else if(this.clock == interval * 12) stageUtils.nextWave('waveSix', this);
},

waveSix(){
	const offset = globals.grid * 3, spawnEnemy = opposite => {
		stageUtils.spawnEnemy('fairyRed', opposite ? globals.gameX + globals.gameWidth - offset : globals.gameX + offset, -globals.grid, enemy => {
			enemy.speed = 3;
			enemy.health = 2;
			enemy.angle = Math.PI / 2;
			enemy.opposite = opposite;
			enemy.drop = this.waveDrop;
		}, enemy => {
			if(enemy.clock >= 120 * enemy.drop){
				if(!enemy.finished){
					const mod = .1;
					enemy.angle += opposite ? mod : -mod;
					if(enemy.opposite){
						if(enemy.angle >= Math.PI){
							enemy.finished = true;
							if(enemy.angle != Math.PI) enemy.angle = Math.PI;
						}
					} else {
						if(enemy.angle <= 0){
							enemy.finished = true;
							if(enemy.angle != 0) enemy.angle = 0;
						}
					}
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, interval = 30;
	if(this.clock == 0) this.waveDrop = 1;
	if(this.clock % interval == 0 && this.clock < interval * 6){
		spawnEnemy();
		spawnEnemy(true);
		this.waveDrop -= 0.15;
	}
	else if(this.clock == interval * 8) stageUtils.nextWave('waveSeven', this);
},

waveSeven(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('fairyRed', globals.gameX + globals.grid * 5, globals.gameHeight + globals.grid, enemy => {
			enemy.speed = 2.5;
			enemy.speedInit = enemy.speed;
			enemy.health = 25;
		}, enemy => {
			enemy.y -= enemy.speed;
			enemy.speed -= 0.025;
			if(enemy.speed <= 1){
				enemy.speed = enemy.speedInit;
				spawnBullets(enemy);
			}
		});
	}, spawnBullets = enemy => {
		let angle = Math.PI;
		const count = 20, speed = 2.5;
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('bullet', enemy.x, enemy.y, angle, bullet => {
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			});
			angle += Math.PI / (count / 2);
		}
	};
	if(this.clock == 0) spawnEnemy();
	else if(this.clock == 200) stageUtils.nextWave('waveEight', this);
},

waveEight(){
	const offset = globals.grid * 2, spawnEnemy = opposite => {
		stageUtils.spawnEnemy('fairyBlue', this.waveX, -globals.grid, enemy => {
			const angle = globals.getAngle(player.sprite, enemy), speed = 4;
			enemy.health = 2;
			enemy.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
		});
		this.waveX += opposite ? offset : -offset;
	}, interval = 15, limit = 10;
	if(this.clock == 0) this.waveX = globals.gameX + offset;
	if(this.clock % interval == 0){
		if(this.clock < interval * limit) spawnEnemy(true);
		else if(this.clock >= interval * limit && this.clock < interval * (limit * 2)){
			if(this.clock == interval * limit) this.waveX = globals.gameX + globals.gameWidth - offset;
			spawnEnemy();
		}
	}
	if(this.clock == interval * (limit * 2.5)) stageUtils.nextWave('waveNine', this);
},

waveNine(){
	const spawnEnemy = opposite => {
		stageUtils.spawnEnemy('fairyBlue',
			opposite ? globals.gameX + globals.gameWidth + globals.grid : globals.gameX - globals.grid,
			opposite ? globals.gameHeight / 6 : globals.gameHeight / 6 * 2, enemy => {
			enemy.angle = opposite ? Math.PI : 0;
			enemy.speed = 3;
			enemy.health = 4;
			if(opposite) enemy.opposite = true;
		}, enemy => {
			if(enemy.clock >= 45){
				if(!enemy.finished){
					const mod = .06;
					enemy.angle += enemy.opposite ? -mod : mod;
					if(enemy.opposite){
						if(enemy.angle <= 0){
							enemy.finished = true;
							if(enemy.angle != 0) enemy.angle = 0;
						}
					} else {
						if(enemy.angle >= Math.PI){
							enemy.finished = true;
							if(enemy.angle != Math.PI) enemy.angle = Math.PI;
						}
					}
					if(enemy.clock % 20 == 0) spawnBullet(enemy);
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, spawnBullet = enemy => {
		stageUtils.spawnBullet('bullet', enemy.x, enemy.y, false, bullet => {
			const speed = 3.5, angle = globals.getAngle(player.sprite, bullet);
			bullet.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
		});
	}, interval = 30;
	if(this.clock < interval * 4){
		if(this.clock % interval == 0) spawnEnemy();
		else if(this.clock % interval == interval / 2) spawnEnemy(true);
	}
	else if(this.clock == interval * 6.5) stageUtils.nextWave('waveTen', this);
},

waveTen(){
	const spawnEnemy = x => {
		stageUtils.spawnEnemy('fairyRed', x, -globals.grid, enemy => {
			enemy.speed = 5;
			enemy.speedInit = enemy.speed;
			enemy.health = 6;
			enemy.angle = Math.PI / 2;
		}, enemy => {
			if(!enemy.flipped){
				enemy.speed -= 0.06;
				if(enemy.speed <= 2){
					enemy.flipped = true;
					enemy.angle = globals.getAngle(player.sprite, enemy);
					enemy.speed = enemy.speedInit;
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8)
		spawnEnemy(Math.floor(Math.random() * (globals.gameWidth - globals.grid * 6)) + globals.gameX + globals.grid * 3);
	else if(this.clock == interval * 9) stageUtils.nextWave('waveEleven', this);
},

waveEleven(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('fairyBlue', globals.gameX + globals.gameWidth / 2, -globals.grid, enemy => {
			enemy.health = 2;
			enemy.initial = enemy.x;
			enemy.count = 2;
			enemy.suicide = suicideEnemy => {
				spawnBullet(suicideEnemy);
			};
		}, enemy => {
			enemy.y += 1.5;
			enemy.x = enemy.initial - Math.sin(enemy.count) * globals.grid * 8;
			enemy.count += .05;
		});
	}, spawnBullet = enemy => {
		stageUtils.spawnBullet('ring', enemy.x, enemy.y, false, bullet => {
			const speed = 4, angle = globals.getAngle(player.sprite, bullet);
			bullet.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
		});
	}, interval = 20;
	if(this.clock % interval == 0 && this.clock < interval * 7) spawnEnemy();
	if(this.clock == interval * 12) stageUtils.nextWave('miniBoss', this);
},

miniBoss(){
	const spawnEnemy = () => {
		const spawnQuad = type => {
			let img = 'yinyang', x = globals.gameX, y = 0;
			switch(type){
				case 0:
					x += -globals.grid * 4;
					img += 'TopLeft';
					y = globals.gameHeight / 8;
					break;
				case 1:
					x += globals.gameWidth + globals.grid * 4;
					img += 'TopRight';
					y = globals.gameHeight / 8;
					break;
				case 2:
					x += -globals.grid * 4;
					img += 'BottomLeft';
					y = globals.gameHeight - globals.gameHeight / 8;
					break;
				case 3:
					x += globals.gameWidth + globals.grid * 4;
					img += 'BottomRight';
					y = globals.gameHeight - globals.gameHeight / 8;
					break;
			}
			stageUtils.spawnEnemy(img, x, y, enemy => {
				enemy.quadType = type;
				enemy.health = 50;
			}, enemy => {
				const speed = 1.75;
				if(enemy.finished){
					if(!this.spawnedRegularMiniboss) spawnRegular(enemy);
					enemy.y = globals.gameHeight * 2;
				} else {
					switch(enemy.quadType){
						case 0:
							if(enemy.flipped){
								if(enemy.y + enemy.height / 2 < globals.gameHeight / 2) enemy.y += speed;
								else if(enemy.y + enemy.height / 2 > globals.gameHeight / 2) enemy.y = globals.gameHeight / 2 - enemy.height / 2;
								if(enemy.y == globals.gameHeight / 2 - enemy.height / 2) enemy.finished = true;
							}
							if(enemy.x + enemy.width / 2 < globals.gameX + globals.gameWidth / 2) enemy.x += speed;
							else if(enemy.x + enemy.width / 2 > globals.gameX + globals.gameWidth / 2) enemy.x = globals.gameX + globals.gameWidth / 2 - enemy.width / 2
							if(enemy.x == globals.gameX + globals.gameWidth / 2 - enemy.width / 2) enemy.flipped = true;
							break;
						case 1:
							if(enemy.flipped){
								if(enemy.y + enemy.height / 2 < globals.gameHeight / 2) enemy.y += speed;
								else if(enemy.y + enemy.height / 2 > globals.gameHeight / 2) enemy.y = globals.gameHeight / 2 - enemy.height / 2;
								if(enemy.y == globals.gameHeight / 2 - enemy.height / 2) enemy.finished = true;
							}
							if(enemy.x - enemy.width / 2 > globals.gameX + globals.gameWidth / 2) enemy.x -= speed;
							else if(enemy.x - enemy.width / 2 < globals.gameX + globals.gameWidth / 2) enemy.x = globals.gameX + globals.gameWidth / 2 + enemy.width / 2
							if(enemy.x == globals.gameX + globals.gameWidth / 2 + enemy.width / 2) enemy.flipped = true;
							break;
						case 2:
							if(enemy.flipped){
								if(enemy.y - enemy.height / 2 > globals.gameHeight / 2) enemy.y -= speed;
								else if(enemy.y - enemy.height / 2 < globals.gameHeight / 2) enemy.y = globals.gameHeight / 2 + enemy.height / 2;
								if(enemy.y == globals.gameHeight / 2 + enemy.height / 2) enemy.finished = true;
							}
							if(enemy.x + enemy.width / 2 < globals.gameX + globals.gameWidth / 2) enemy.x += speed;
							else if(enemy.x + enemy.width / 2 > globals.gameX + globals.gameWidth / 2) enemy.x = globals.gameX + globals.gameWidth / 2 - enemy.width / 2;
							if(enemy.x == globals.gameX + globals.gameWidth / 2 - enemy.width / 2) enemy.flipped = true;
							break;
						case 3:
							if(enemy.flipped){
								if(enemy.y - enemy.height / 2 > globals.gameHeight / 2) enemy.y -= speed;
								else if(enemy.y - enemy.height / 2 < globals.gameHeight / 2) enemy.y = globals.gameHeight / 2 + enemy.height / 2;
								if(enemy.y == globals.gameHeight / 2 + enemy.height / 2) enemy.finished = true;
							}
							if(enemy.x - enemy.width / 2 > globals.gameX + globals.gameWidth / 2) enemy.x -= speed;
							else if(enemy.x - enemy.width / 2 < globals.gameX + globals.gameWidth / 2) enemy.x = globals.gameX + globals.gameWidth / 2 + enemy.width / 2
							if(enemy.x == globals.gameX + globals.gameWidth / 2 + enemy.width / 2) enemy.flipped = true;
							break;
					}
				}
			});
		}, spawnRegular = quadEnemy => {
			this.spawnedRegularMiniboss = true;
			let x, y;
			switch(quadEnemy.quadType){
				case 0:
					x = quadEnemy.x + quadEnemy.width / 2;
					y = quadEnemy.y + quadEnemy.height / 2;
					break;
				case 1:
					x = quadEnemy.x - quadEnemy.width / 2;
					y = quadEnemy.y + quadEnemy.height / 2;
					break;
				case 2:
					x = quadEnemy.x + quadEnemy.width / 2;
					y = quadEnemy.y - quadEnemy.height / 2;
					break;
				case 3:
					x = quadEnemy.x - quadEnemy.width / 2;
					y = quadEnemy.y - quadEnemy.height / 2;
					break;
			}
			stageUtils.spawnEnemy('yinyang', x, y, enemy => {
				enemy.health = 200;
			}, enemy => {
				const speed = 1.5, interval = 60;
				enemy.rotation += 0.025
				if(enemy.clock < interval){
					enemy.x += speed;
					if(enemy.clock % 5 == 0) spawnBullets(enemy);
				} else if(enemy.clock >= interval * 2 && enemy.clock < interval * 4){
					enemy.x -= speed;
					if(enemy.clock % 5 == 0) spawnBullets(enemy);
				} else if(enemy.clock >= interval * 5 && enemy.clock < interval * 6){
					enemy.x += speed;
					if(enemy.clock % 5 == 0) spawnBullets(enemy);
				} else if(enemy.clock >= interval * 7) enemy.y += speed;

			});
		}, spawnBullets = enemy => {
			let angle = 0;
			const count = 25, speed = 3;
			for(i = 0; i < count; i++){
				stageUtils.spawnBullet('bullet', enemy.x, enemy.y, angle, bullet => {
					bullet.speed = 3;
				}, bullet => {
					bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
					if(bullet.speed > 1) bullet.speed -= 0.01;
				});
				angle += Math.PI / (count / 2);
			}
		};
		for(i = 0; i < 4; i++){
			spawnQuad(i)
		}
	};
	if(this.clock == 0) spawnEnemy();
	if(this.clock == 60 * 10.5) stageUtils.nextWave('waveTwelve', this);
},

waveTwelve(){
	const spawnEnemy = x => {
		stageUtils.spawnEnemy('fairyRed', x, -globals.grid, enemy => {
			enemy.speed = 5;
			enemy.speedInit = enemy.speed;
			enemy.health = 6;
			enemy.angle = Math.PI / 2;
		}, enemy => {
			if(!enemy.flipped){
				enemy.speed -= 0.06;
				if(enemy.speed <= 2){
					enemy.flipped = true;
					enemy.angle = globals.getAngle(player.sprite, enemy);
					enemy.speed = enemy.speedInit;
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8)
		spawnEnemy(Math.floor(Math.random() * (globals.gameWidth - globals.grid * 6)) + globals.gameX + globals.grid * 3);
	else if(this.clock == interval * 9) stageUtils.nextWave('waveThirteen', this);
},

waveThirteen(){

},

currentWave(){
	this.waveOne();
	if(!globals.paused) this.clock++;
}

};