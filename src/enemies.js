module.exports = {
clock: 0,
waveX: 0,
waveDrop: 0,
spawnedRegularMiniboss: false,

waveOne(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('fairyBlue', globals.gameX + globals.gameWidth / 2, -globals.grid, enemy => {
			enemy.health = 2;
			enemy.initial = enemy.x;
			enemy.count = 2;
		}, enemy => {
			enemy.y += 1.5;
			enemy.x = enemy.initial - Math.sin(enemy.count) * globals.grid * 8;
			enemy.count += .05;
		});
	}, interval = 20, wait = 30;
	if(this.clock % interval == 0 && this.clock > wait && this.clock < interval * 7 + wait) spawnEnemy();
	if(this.clock == interval * 12) stageUtils.nextWave('waveTwo', this);
},

waveTwo(){
	const spawnEnemy = opposite => {
		let y = globals.gameHeight / 4 + Math.floor(Math.random() * globals.gameHeight / 4);
		if(opposite) y -= globals.gameHeight / 6;
		stageUtils.spawnEnemy('fairyGreen', opposite ? globals.gameX + globals.gameWidth + globals.grid : globals.gameX - globals.grid, y, enemy => {
			enemy.health = 2;
			enemy.speed = 3;
			enemy.speedInit = enemy.speed;
			if(opposite) enemy.opposite = true;
		}, enemy => {
			if(enemy.clock % 60 == 0){
				enemy.speed = enemy.speedInit;
				spawnBullet(enemy);
			}
			enemy.x += enemy.opposite ? -enemy.speed : enemy.speed;
			enemy.speed -= 0.05;
		});
	}, spawnBullet = enemy => {
		stageUtils.spawnBullet(enemy.opposite ? 'ring-red' : 'ring-blue', enemy.x, enemy.y, globals.getAngle(player.sprite, enemy), bullet => {
			const speed = 3;
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
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
	}, interval = 15, limit = 6;
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
				if(opposite) enemy.opposite = true;
				enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
			}, enemy => {
				if(enemy.clock == 90){
					const angle = enemy.opposite ? Math.PI * 1.25 : -Math.PI / 4;
					enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
					enemy.shotPos = {x: enemy.x, y: enemy.y};
				} else if(enemy.clock == 135){
					const angle = Math.PI / 2;
					enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
					enemy.shotPos = {x: enemy.x, y: enemy.y};
				}
				const limit = 10, bulletInterval = 6;
				if(enemy.clock % bulletInterval == 0){
					if(enemy.clock >= 90 && enemy.clock < 90 + limit) spawnBullet(enemy);
					else if(enemy.clock >= 135 && enemy.clock < 135 + limit) spawnBullet(enemy, true);
				}
			});
		};
		spawnEnemy();
		spawnEnemy(true);
	}, spawnBullet = (enemy, opposite) => {
		let angle = Math.PI / 4;
		if(enemy.opposite) angle += Math.PI / 2;
		if(opposite){
			angle += Math.PI / 2;
			if(enemy.opposite) angle -= Math.PI;
		}
		stageUtils.spawnBullet('ring-blue', enemy.shotPos.x, enemy.shotPos.y, angle, bullet => {
			bullet.rotation = bullet.angle + Math.PI / 2;
			bullet.speedX = 2.5;
			bullet.speedY = bullet.speedX;
		}, bullet => {
			bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speedX, y: Math.sin(bullet.angle) * bullet.speedY};
			bullet.speedY += 0.025
		});
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8) spawnEnemies();
	else if(this.clock == interval * 10) stageUtils.nextWave('waveFive', this);
},

waveFive(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('fairyBlue', globals.gameX + globals.grid * 3, -globals.grid, enemy => {
			enemy.health = 10;
			enemy.speed = 4;
			enemy.angle = Math.PI / 2;
		}, enemy => {
			if(enemy.clock >= 70){
				if(enemy.clock == 70) spawnBullet(enemy);
				if(!enemy.finished){
					enemy.angle -= .03;
					if(enemy.angle <= -Math.PI){
						spawnBullet(enemy);
						enemy.finished = true;
						if(enemy.angle != -Math.PI) enemy.angle = -Math.PI
					}
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, spawnBullet = enemy => {
		stageUtils.spawnBullet('bullet-red', enemy.x, enemy.y, globals.getAngle(player.sprite, enemy), bullet => {
			const speed = 3;
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
		});
	}, interval = 20;
	if(this.clock % interval == 0 && this.clock < interval * 10) spawnEnemy();
	else if(this.clock == interval * 12) stageUtils.nextWave('waveSix', this);
},

waveSix(){
	const offset = globals.grid * 3, spawnEnemy = opposite => {
		stageUtils.spawnEnemy('fairyGreen', opposite ? globals.gameX + globals.gameWidth - offset : globals.gameX + offset, -globals.grid, enemy => {
			enemy.speed = 3;
			enemy.health = 2;
			enemy.angle = Math.PI / 2;
			enemy.opposite = opposite;
			enemy.drop = this.waveDrop;
		}, enemy => {
			if(enemy.clock == 20) spawnBullet(enemy);
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
	}, spawnBullet = enemy => {
		stageUtils.spawnBullet('ring-red', enemy.x, enemy.y, globals.getAngle(player.sprite, enemy), bullet => {
			const speed = 3.5;
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
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
		stageUtils.spawnEnemy('fairyRed', globals.gameX + globals.grid * 3, globals.gameHeight + globals.grid, enemy => {
			enemy.speed = 3;
			enemy.speedInit = enemy.speed;
			enemy.health = 25;
			enemy.bulletAngle = Math.PI / 4;
			enemy.bulletDirection = false;
		}, enemy => {
			enemy.y -= enemy.speed;
			enemy.speed -= 0.05;
			if(enemy.clock % 4 == 0) spawnBullet(enemy);
			if(enemy.speed <= 1) enemy.speed = enemy.speedInit;
		});
	}, spawnBullet = enemy => {
		stageUtils.spawnBullet('ring-blue', enemy.x, enemy.y, enemy.bulletAngle, bullet => {
			const speed = 3;
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
		});
		const mod = .4
		enemy.bulletAngle += enemy.bulletDirection ? mod : -mod;
		if(enemy.bulletAngle <= -Math.PI / 3 || enemy.bulletAngle >= Math.PI / 3) enemy.bulletDirection = !enemy.bulletDirection;
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
	}, interval = 15, limit = 6;
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
		stageUtils.spawnEnemy('fairyGreen',
			opposite ? globals.gameX + globals.gameWidth + globals.grid : globals.gameX - globals.grid,
			opposite ? globals.gameHeight / 6 : globals.gameHeight / 6 * 2, enemy => {
			enemy.angle = opposite ? Math.PI : 0;
			enemy.speed = 3;
			enemy.health = 6;
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
					if(enemy.clock % 20 == 0 && !enemy.fired){
						enemy.fired = true;
						spawnBullets(enemy);
					}
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, spawnBullets = enemy => {
		const circle = () => {
			const count = 9, speed = 2;
			let angle = Math.random() * Math.PI;
			for(i = 0; i < count; i++){
				stageUtils.spawnBullet('bullet-blue', enemy.x, enemy.y, false, bullet => {
					const speed = 3;
					bullet.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
				});
				angle += Math.PI / (count / 2);
			}
		}, ball = () => {
			stageUtils.spawnBullet('big-red', enemy.x, enemy.y, globals.getAngle(player.sprite, enemy), bullet => {
				const speed = 2.5;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			});
		}
		circle();
		ball();
	}, interval = 30;
	if(this.clock < interval * 4){
		if(this.clock % interval == 0) spawnEnemy();
		else if(this.clock % interval == interval / 2) spawnEnemy(true);
	}
	else if(this.clock == interval * 6) stageUtils.nextWave('waveTen', this);
},

waveTen(){
	const spawnEnemy = x => {
		stageUtils.spawnEnemy('fairyRed', x, -globals.grid, enemy => {
			enemy.speed = 4;
			enemy.speedInit = enemy.speed;
			enemy.health = 6;
			enemy.angle = Math.PI / 2;
		}, enemy => {
			if(!enemy.flipped){
				enemy.speed -= 0.05;
				if(enemy.speed <= 2){
					enemy.flipped = true;
					enemy.angle = globals.getAngle(player.sprite, enemy);
					enemy.speed = enemy.speedInit;
					spawnBullet(enemy);
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, spawnBullet = enemy => {
		stageUtils.spawnBullet('big-blue', enemy.x, enemy.y, globals.getAngle(player.sprite, enemy), bullet => {
			const speed = 3;
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
		});
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8)
		spawnEnemy(Math.floor(Math.random() * (globals.gameWidth - globals.grid * 6)) + globals.gameX + globals.grid * 3);
	else if(this.clock == interval * 8) stageUtils.nextWave('waveEleven', this);
},

waveEleven(){
	const spawnEnemy = first => {
		stageUtils.spawnEnemy('fairyBlue', globals.gameX + globals.gameWidth / 2, -globals.grid, enemy => {
			enemy.health = 2;
			enemy.initial = enemy.x;
			enemy.count = 2;
		}, enemy => {
			enemy.y += 1.5;
			enemy.x = enemy.initial - Math.sin(enemy.count) * globals.grid * 8;
			enemy.count += .05;
			const count = Math.round(enemy.count * 1000) / 1000;
			if(count % 3 == 0) spawnBullets(enemy)
		});
	}, spawnBullets = enemy => {
		const count = 11;
		let angle = Math.random() * Math.PI;
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('ring-red', enemy.x, enemy.y, false, bullet => {
				const speed = 3;
				bullet.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
			});
			angle += Math.PI / (count / 2);
		}
	}, interval = 20;
	if(this.clock % interval == 0 && this.clock < interval * 7) spawnEnemy(this.clock == 0);
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
				enemy.bulletAngle = 0;
			}, enemy => {
				const speed = 1.5, interval = 60, mod = Math.PI / 10, diff = Math.PI / 4;
				enemy.rotation += 0.025
				if(enemy.clock < interval){
					if(enemy.clock == 0) enemy.bulletAngle = globals.getAngle(player.sprite, enemy) - diff;
					enemy.x += speed;
					spawnBullet(enemy);
					enemy.bulletAngle += mod;
				} else if(enemy.clock >= interval * 2 && enemy.clock < interval * 4){
					if(enemy.clock == interval * 2) enemy.bulletAngle = globals.getAngle(player.sprite, enemy) + diff;
					enemy.x -= speed;
					spawnBullet(enemy);
					enemy.bulletAngle -= mod;
				} else if(enemy.clock >= interval * 5 && enemy.clock < interval * 6){
					if(enemy.clock == interval * 5) enemy.bulletAngle = globals.getAngle(player.sprite, enemy) - diff;
					enemy.x += speed;
					spawnBullet(enemy);
					enemy.bulletAngle += mod;
				} else if(enemy.clock >= interval * 7) enemy.y += speed;

			});
		}
		for(i = 0; i < 4; i++){
			spawnQuad(i)
		}
	}, spawnBullet = enemy => {
		const circle = () => {
			stageUtils.spawnBullet('big-red', enemy.x, enemy.y, enemy.bulletAngle, bullet => {
				bullet.speed = 3.5;
			}, bullet => {
				bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
			});
		}, spray = () => {
			const mod = .2;
			let angle = globals.getAngle(player.sprite, enemy) - mod;
			angle += Math.random() * (mod * 2)
			stageUtils.spawnBullet('bullet-blue', enemy.x, enemy.y, angle, bullet => {
				const speed = 2.75;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
				bullet.zOrder++;
			});
		};
		circle();
		if(enemy.clock % 8 == 0) spray();
	};
	if(this.clock == 0) spawnEnemy();
	if(this.clock == 60 * 10.5) stageUtils.nextWave('waveTwelve', this);
},

waveTwelve(){
	const spawnEnemy = x => {
		stageUtils.spawnEnemy('fairyRed', x, -globals.grid, enemy => {
			enemy.speed = 2;
			enemy.health = 6;
			enemy.healthInit = enemy.health;
			enemy.angle = globals.getAngle(player.sprite, enemy);
		}, enemy => {
			if(enemy.health < enemy.healthInit && !enemy.flipped){
				enemy.flipped = true;
				enemy.angle = Math.PI / 2;
				enemy.speed = 5;
				spawnBullets(enemy);
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, spawnBullets = enemy => {
		const count = 11;
		let angle = Math.random() * Math.PI;
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('big-blue', enemy.x, enemy.y, angle, bullet => {
				const speed = 2.5;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			});
			angle += Math.PI / (count / 2);
		}
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8)
		spawnEnemy(Math.floor(Math.random() * (globals.gameWidth - globals.grid * 5)) + globals.gameX + globals.grid * 3);
	else if(this.clock == interval * 10) stageUtils.nextWave('waveThirteen', this);
},

waveThirteen(){
	const spawnEnemy = () => {
		const x = globals.gameX + globals.grid * 3 + Math.floor(Math.random() * (globals.gameWidth - globals.grid * 6));
		stageUtils.spawnEnemy('fairyGreen', x, globals.gameHeight + globals.grid, enemy => {
			enemy.speed = 0;
			enemy.health = 2;
		}, enemy => {
			enemy.y -= enemy.speed;
			if(enemy.speed < 3){
				enemy.speed += 0.05;
			}
		});
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 10) spawnEnemy();
	else if(this.clock == interval * 12) stageUtils.nextWave('waveFourteen', this);
},

waveFourteen(){
	const spawnEnemies = () => {
		const offset = globals.grid * 3, spawnEnemy = opposite => {
			stageUtils.spawnEnemy('fairyRed',
				opposite ? globals.gameX + globals.gameWidth - offset : globals.gameX + offset,
				globals.gameHeight + globals.grid, enemy => {
				const angle = -Math.PI / 2;
				enemy.speed = 3;
				enemy.health = 2;
				if(opposite) enemy.opposite;
				enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
			}, enemy => {
				const offset = 15;
				if(enemy.clock == 90 + offset){
					const angle = opposite ? Math.PI * .75 : Math.PI / 4;
					enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
					spawnBullets(enemy);
				} else if(enemy.clock == 135 + offset){
					const angle = -Math.PI / 2;
					enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
					spawnBullets(enemy);
				}
			});
		};
		spawnEnemy();
		spawnEnemy(true);
	}, spawnBullets = enemy => {
		const count = 9;
		let angle = Math.random() * Math.PI;
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('bullet-blue', enemy.x, enemy.y, angle, bullet => {
			}, bullet => {
				const speed = 3;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			});
			angle += Math.PI / (count / 2);
		}
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8) spawnEnemies();
	else if(this.clock == interval * 12) stageUtils.nextWave('waveFifteen', this);
},

waveFifteen(){
	const spawnEnemy = x => {
		stageUtils.spawnEnemy('fairyBlue', x, -globals.grid, enemy => {
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
					spawnBullets(enemy);
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, spawnBullets = enemy => {
		const mod = .2;
		let angle = globals.getAngle(player.sprite, enemy) - mod * 2;
		const spawnBullet = () => {
			stageUtils.spawnBullet('big-red', enemy.x, enemy.y, angle, bullet => {
				const speed = 3;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
				bullet.zOrder += i;
			});
		}
		for(i = 0; i < 5; i++){
			spawnBullet(i);
			angle += mod;
		}
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8)
		spawnEnemy(Math.floor(Math.random() * (globals.gameWidth - globals.grid * 6)) + globals.gameX + globals.grid * 3);
	else if(this.clock == interval * 9) stageUtils.nextWave('waveSixteen', this);
},

waveSixteen(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('fairyGreen', globals.gameWidth + globals.gameX - globals.grid * 4, -globals.grid, enemy => {
			enemy.speed = 6;
			enemy.health = 20;
			enemy.shotOpposite = false;
		}, enemy => {
			enemy.y += enemy.speed;
			const mod = 0.1;
			enemy.speed -= enemy.speed > 0 ? mod : mod / 4;
			if(enemy.speed <= 0){
				if(!enemy.fired){
					enemy.clock = -1;
					enemy.fired = true;
				}
				const interval = 10 * 4;
				if(enemy.clock % interval == 0){
					enemy.shotPos = {x: enemy.x, y: enemy.y};
					enemy.shotOpposite = !enemy.shotOpposite;
				}
				if(enemy.clock % interval < interval * .75){
					spawnBullets(enemy);
				}
			}
		});
	}, spawnBullets = enemy => {
		const circle = () => {
			let angle = Math.PI;
			const count = 17, mod = 0.01;
			for(i = 0; i < count; i++){
				stageUtils.spawnBullet('big-red', enemy.shotPos.x, enemy.shotPos.y, angle, bullet => {
					bullet.speed = 3.5;
					bullet.opposite = enemy.shotOpposite;
				}, bullet => {
					bullet.angle += bullet.opposite ? mod : -mod;
					bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
				});
				angle += Math.PI / (count / 2);
			}
		}, spray = () => {
			const mod = .2;
			let angle = globals.getAngle(player.sprite, enemy) - mod;
			angle += Math.random() * (mod * 2)
			stageUtils.spawnBullet('ring-blue', enemy.shotPos.x, enemy.shotPos.y, angle, bullet => {
				const speed = 4;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
				bullet.zOrder++;
			});
		};
		if(enemy.clock % 10 == 0) circle();
		if(enemy.clock % 5 == 0) spray();
	};
	if(this.clock == 0) spawnEnemy();
	else if(this.clock == 180) stageUtils.nextWave('boss', this);
},

boss(){
	const spells = [
		enemy => {
			const interval = 60;
			if(enemy.spellClock % interval < interval / 2 && enemy.spellClock % 6 == 0){
				if(enemy.spellClock % interval == 0){
					enemy.spellAngleOne = enemy.spellFlipOne ? Math.PI / 3 : Math.PI / 3 * 2;
					enemy.spellAngleTwo = Math.PI * Math.random();
					enemy.spellFlipOne = !enemy.spellFlipOne;
				}
				const splash = (x, opposite) => {
					const count = 20;
					let angle = enemy.spellAngleTwo;
					for(i = 0; i < count; i++){
						stageUtils.spawnBullet('arrow-blue', x, enemy.y, angle, bullet => {
							let mod = 0.005;
							if(opposite) mod = -mod;
							bullet.mod = enemy.spellFlipOne ? mod : -mod;
							bullet.speed = 3.5;
							bullet.scale.set(1.25)
						}, bullet => {
							bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
							bullet.rotation = bullet.angle;
							bullet.angle += bullet.mod;
						});
						angle += Math.PI / (count / 2);
					}
				}, swash = () => {
					stageUtils.spawnBullet('big-red', enemy.x, enemy.y, enemy.spellAngleOne, bullet => {
						const speed = 2.5;
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
						bullet.scale.set(1.5)
						bullet.zOrder++;
					});
					const mod = Math.PI / 10;
					enemy.spellAngleOne += enemy.spellFlipOne ? -mod : mod
				}, offset = globals.grid * 5;
				splash(enemy.x - offset);
				splash(enemy.x + offset, true);
				swash();
			}
		},
		enemy => {
			const interval = 30, offset = globals.grid * 8, arrowsOffset = globals.grid * 5, circle = (x, type) => {
				let angle = enemy.spellAngleOne;
				const count = 20, speed = type == 'big-red' ? 3.75 : 2;
				for(i = 0; i < count; i++){
					stageUtils.spawnBullet('big-blue', x, enemy.y, angle, bullet => {
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
						if(type == 'big-red') bullet.zOrder++;
					});
					angle += Math.PI / (count / 2);
				}
			}, arrows = (x, yOffset) => {
				const mod = 0.25;
				let arrowAngle = enemy.spellAngleTwo - mod;
				const spawnArrow = () => {
					let y = enemy.y;
					if(yOffset) y -= globals.grid;
					stageUtils.spawnBullet('arrow-red', x, y, arrowAngle, bullet => {
						const speed = 2.75;
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
						bullet.rotation = bullet.angle;
						bullet.scale.set(1.25);
						bullet.zOrder--;
					})
				};
				for(i = 0; i < 3; i++){
					spawnArrow();
					arrowAngle += mod;
				}
			};
			if(enemy.spellClock % (interval * 2) == 0) enemy.spellAngleOne = Math.PI * Math.random()
			if(enemy.spellClock % interval == 0) enemy.spellAngleTwo = globals.getAngle(player.sprite, enemy);
			switch(enemy.spellClock % (interval * 4)){
				case 0:
					circle(enemy.x - offset, 'big-blue');
					break;
				case interval:
					circle(enemy.x - offset, 'big-red');
					break;
				case interval * 2:
					circle(enemy.x + offset, 'big-blue');
					break;
				case interval * 3:
					circle(enemy.x + offset, 'big-red');
					break;
			}
			if(enemy.spellClock % (interval * 2) < interval / 2 && enemy.spellClock % 6 == 0){
				arrows(enemy.x - arrowsOffset, true);
				arrows(enemy.x);
				arrows(enemy.x + arrowsOffset, true);
			}
		}, enemy => {

		}
	], spawnEnemy = () => {
		stageUtils.spawnEnemy('yuka', globals.gameX + globals.gameWidth / 2, -31, enemy => {
			enemy.speed = 2.75;
			enemy.spellClock = 0;
			enemy.health = 500;
			enemy.spellAngleOne = 0;
			enemy.spellAngleTwo = 0;
			enemy.spellFlipOne = false;
		}, enemy => {
			if(enemy.ready){
				const spellInterval = 60 * 8, wait = 30;
				// if(enemy.spellClock < spellInterval) spells[0](enemy);
				// else if(enemy.spellClock >= spellInterval + wait && enemy.spellClock < spellInterval * 2 + wait) spells[1](enemy);
				spells[2](enemy);
				enemy.spellClock++;
			} else {
				enemy.y += enemy.speed;
				enemy.speed -= 0.03;
				if(enemy.speed <= 0){
					enemy.speed = 0;
					enemy.ready = true;
				}
			}
		});
	};
	if(this.clock == 0) spawnEnemy();
},

currentWave(){
	this.boss();
	if(!globals.paused) this.clock++;
}

};