module.exports = {
clock: 0,
waveX: 0,
waveY: 0,
waveDrop: 0,

waveOne(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('fairyGreen', globals.gameX + globals.gameWidth / 2, -globals.grid, enemy => {
			enemy.health = 1;
			enemy.initial = enemy.x;
			enemy.count = 2;
		}, enemy => {
			enemy.y += 1.5;
			enemy.x = enemy.initial - Math.sin(enemy.count) * globals.grid * 8;
			enemy.count += .05;
		});
	}, interval = 20, wait = 60;
	if(this.clock % interval == 0 && this.clock > wait && this.clock < interval * 7 + wait) spawnEnemy();
	if(this.clock == interval * 12) stageUtils.nextWave('waveTwo', this);
},

waveTwo(){
	const spawnEnemy = opposite => {
		let y = globals.winHeight / 4 + Math.floor(Math.random() * globals.winHeight / 4);
		if(opposite) y -= globals.winHeight / 6;
		stageUtils.spawnEnemy('fairyBlue', opposite ? globals.gameX + globals.gameWidth + globals.grid : globals.gameX - globals.grid, y, enemy => {
			enemy.health = 1;
			enemy.speed = 3;
			enemy.speedInit = enemy.speed;
			if(opposite) enemy.opposite = true;
		}, enemy => {
			const interval = 60;
			if(enemy.clock % interval == 0 && enemy.clock > 0){
				enemy.speed = enemy.speedInit;
				spawnBullet(enemy);
			}
			enemy.x += enemy.opposite ? -enemy.speed : enemy.speed;
			enemy.speed -= 0.05;
		});
	}, spawnBullet = enemy => {
		sound.spawn('bulletOne');
		stageUtils.spawnBullet('ring-red', enemy.x, enemy.y, globals.getAngle(player.sprite, enemy), bullet => {
			const speed = 3.5;
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
		stageUtils.spawnEnemy('fairyGreen', this.waveX, -globals.grid, enemy => {
			const angle = globals.getAngle(player.sprite, enemy), speed = 4;
			enemy.health = 1;
			enemy.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
		});
		this.waveX += opposite ? offset : -offset;
	}, interval = 15, limit = 4;
	if(this.clock == 0) this.waveX = globals.gameX + globals.gameWidth - offset;
	if(this.clock % interval == 0){
		if(this.clock < interval * limit) spawnEnemy();
		else if(this.clock >= interval * limit && this.clock < interval * (limit * 2)){
			if(this.clock == interval * limit) this.waveX = globals.gameX + offset;
			spawnEnemy(true);
		}
	}
	if(this.clock == interval * (limit * 2.25)) stageUtils.nextWave('waveFour', this);
},

waveFour(){
	const spawnEnemies = () => {
		const offset = globals.grid * 3, spawnEnemy = opposite => {
			stageUtils.spawnEnemy('fairyRed', opposite ? globals.gameX + globals.gameWidth - offset : globals.gameX + offset, -globals.grid, enemy => {
				const angle = Math.PI / 2;
				enemy.speed = 3;
				enemy.health = 1;
				if(opposite) enemy.opposite = true;
				if(!enemy.opposite) enemy.scale.set(-1, 1);
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
				const limit = 15, bulletInterval = 5;
				if(enemy.clock % bulletInterval == 0){
					if(enemy.clock >= 90 && enemy.clock < 90 + limit) spawnBullet(enemy);
					else if(enemy.clock >= 135 && enemy.clock < 135 + limit) spawnBullet(enemy, true);
				}
			});
		};
		spawnEnemy();
		spawnEnemy(true);
	}, spawnBullet = (enemy, opposite) => {
		const mod = 0.1;
		let angle = Math.PI / 4 - mod;
		angle += mod * 2 * Math.random()
		if(enemy.opposite) angle += Math.PI / 2;
		if(opposite){
			angle += Math.PI / 2;
			if(enemy.opposite) angle -= Math.PI;
		}
		sound.spawn('bulletTwo');
		stageUtils.spawnBullet('ring-blue', enemy.shotPos.x, enemy.shotPos.y, angle, bullet => {
			bullet.speed = 3.5;
			bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
		});
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8) spawnEnemies();
	else if(this.clock == interval * 10) stageUtils.nextWave('waveFive', this);
},

waveFive(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('fairyBlue', globals.gameX + globals.grid * 3.5, -globals.grid, enemy => {
			enemy.health = 4;
			enemy.speed = 4;
			enemy.angle = Math.PI / 2;
		}, enemy => {
			if(enemy.clock >= 60){
				if(enemy.clock == 60) spawnBullet(enemy);
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
		sound.spawn('bulletOne');
		stageUtils.spawnBullet('bullet-red', enemy.x, enemy.y, globals.getAngle(player.sprite, enemy), bullet => {
			const speed = 4;
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
		});
	}, interval = 20;
	if(this.clock % interval == 0 && this.clock < interval * 10) spawnEnemy();
	else if(this.clock == interval * 12) stageUtils.nextWave('waveSix', this);
},

waveSix(){
	const offset = globals.grid * 3, spawnEnemy = opposite => {
		stageUtils.spawnEnemy('fairyYellow', opposite ? globals.gameX + globals.gameWidth - offset : globals.gameX + offset, -globals.grid, enemy => {
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
		sound.spawn('bulletOne');
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
		stageUtils.spawnEnemy('fairyBig', globals.gameX + globals.grid * 5, -globals.grid, enemy => {
			enemy.speed = 6;
			enemy.health = 35;
			enemy.shotOpposite = false;
			enemy.suicide = () => {
				const score = 50000;
				chrome.showBonus(score);
				sound.spawn('bonus');
				globals.score += score;
				globals.removeBullets = true;
			};
		}, enemy => {
			enemy.y += enemy.speed;
			const mod = 0.1;
			enemy.speed -= enemy.speed > 0 ? mod : mod / 8;
			if(enemy.speed <= 0){
				if(!enemy.fired){
					enemy.clock = -1;
					enemy.fired = true;
				}
				const interval = 40;
				if(enemy.clock % interval < interval / 2){
					if(enemy.clock % interval == 0) enemy.bulletAngle = globals.getAngle(player.sprite, enemy)
					if(enemy.clock % 2 == 0 && enemy.y > globals.grid){
						arrows(enemy);
						spray(enemy);
					}
				}
			}
		});
	}, arrows = enemy => {
		const count = 7;
		let angle = enemy.bulletAngle - Math.PI / 2;
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('ring-red', enemy.x, enemy.y, angle, bullet => {
				const speed = 3.5;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
				bullet.rotation = bullet.angle;
			});
			angle += Math.PI / count;
		}
	}, spray = enemy => {
		const mod = Math.PI / 4;
		let angle = globals.getAngle(player.sprite, enemy) - mod;
		angle += mod * 2 * Math.random();
		stageUtils.spawnBullet('big-blue', enemy.x, enemy.y, angle, bullet => {
			const speed = 3;
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
		});
	};
	if(this.clock == 0) spawnEnemy();
	else if(this.clock == 60 * 4) stageUtils.nextWave('waveEight', this);
},

waveEight(){
	const offset = globals.grid * 2, spawnEnemy = opposite => {
		stageUtils.spawnEnemy('fairyGreen', this.waveX, -globals.grid, enemy => {
			const angle = globals.getAngle(player.sprite, enemy), speed = 4;
			enemy.health = 2;
			enemy.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
		});
		this.waveX += opposite ? offset : -offset;
	}, interval = 15, limit = 4;
	if(this.clock == 0) this.waveX = globals.gameX + offset;
	if(this.clock % interval == 0){
		if(this.clock < interval * limit) spawnEnemy(true);
		else if(this.clock >= interval * limit && this.clock < interval * (limit * 2)){
			if(this.clock == interval * limit) this.waveX = globals.gameX + globals.gameWidth - offset;
			spawnEnemy();
		}
	}
	if(this.clock == interval * (limit * 2.25)) stageUtils.nextWave('waveNine', this);
},

waveNine(){
	const spawnEnemy = opposite => {
		stageUtils.spawnEnemy('fairyRed',
			opposite ? globals.gameX + globals.gameWidth + globals.grid : globals.gameX - globals.grid,
			opposite ? globals.winHeight / 6 : globals.winHeight / 6 * 2, enemy => {
			enemy.angle = opposite ? Math.PI : 0;
			enemy.speed = 3;
			enemy.health = 6;
			if(opposite) enemy.opposite = true;
			else enemy.scale.set(-1, 1);
		}, enemy => {
			if(enemy.clock >= 45){
				if(!enemy.finished){
					const mod = .06;
					enemy.angle += enemy.opposite ? -mod : mod;
					if(enemy.opposite){
						if(enemy.angle <= 0){
							enemy.finished = true;
							if(enemy.angle != 0) enemy.angle = 0;
							enemy.scale.set(-1,1);
						}
					} else {
						if(enemy.angle >= Math.PI){
							enemy.finished = true;
							if(enemy.angle != Math.PI) enemy.angle = Math.PI;
							enemy.scale.set(1);
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
			sound.spawn('bulletOne');
			for(i = 0; i < count; i++){
				stageUtils.spawnBullet('bullet-blue', enemy.x, enemy.y, false, bullet => {
					const speed = 3.5;
					bullet.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
				});
				angle += Math.PI / (count / 2);
			}
		}, ball = () => {
			const mod = .1, count = 5;
			let angle = globals.getAngle(player.sprite, enemy) - mod * 2;
			for(i = 0; i < count; i++){
				stageUtils.spawnBullet('ring-red', enemy.x, enemy.y, angle , bullet => {
					const speed = 3;
					bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
				});
				angle += mod;
			}
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
		stageUtils.spawnEnemy('fairyBlue', x, -globals.grid, enemy => {
			enemy.speed = 3;
			enemy.speedInit = enemy.speed;
			enemy.health = 5;
			enemy.angle = Math.PI / 2;
		}, enemy => {
			if(!enemy.flipped){
				enemy.speed -= 0.05;
				if(enemy.speed <= 1){
					enemy.flipped = true;
					enemy.angle = globals.getAngle(player.sprite, enemy);
					enemy.speed = enemy.speedInit;
					spawnBullet(enemy);
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, spawnBullet = enemy => {
		sound.spawn('bulletOne');
		stageUtils.spawnBullet('big-red', enemy.x, enemy.y, globals.getAngle(player.sprite, enemy), bullet => {
			const speed = 5;
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
		});
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8)
		spawnEnemy(Math.floor(Math.random() * (globals.gameWidth - globals.grid * 6)) + globals.gameX + globals.grid * 3);
	else if(this.clock == interval * 8) stageUtils.nextWave('waveEleven', this);
},

waveEleven(){
	const spawnEnemy = first => {
		stageUtils.spawnEnemy('fairyRed', globals.gameX + globals.gameWidth / 2, -globals.grid, enemy => {
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
		sound.spawn('bulletTwo');
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('ring-blue', enemy.x, enemy.y, false, bullet => {
				const speed = 3.5;
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
		stageUtils.spawnEnemy('komachi', globals.gameX + globals.gameWidth / 2, -31, enemy => {
			enemy.speed = 2.5;
			enemy.speedMod = 0.025;
			enemy.health = 60;
			enemy.initHealth = enemy.health;
			enemy.spinnerAngle = 0;
			enemy.spinnerAngleTwo = Math.PI;
			enemy.spinnerDir = true;
			globals.bossHealth = enemy.health;
			globals.bossHealthInitial = enemy.health;
			enemy.suicide = () => {
				const score = 80000;
				chrome.showBonus(score);
				sound.spawn('bonus');
				globals.score += score;
				globals.removeBullets = true;
				stageUtils.bossBorder.kill = true;
				globals.bossActive = false;
			}
		}, enemy => {
			if(enemy.ready){
				if(enemy.finished){
					enemy.y += enemy.speed;
					enemy.speed -= enemy.speedMod;
					stageUtils.bossBorder.kill = true;
					globals.bossActive = false;
				} else if(!globals.gameOver){
					if(!globals.bossActive) globals.bossActive = true;
					const circleInterval = 60 * 3;
					if(enemy.clock % circleInterval == 0){
						enemy.spellAngleOne = Math.PI * Math.random();
						enemy.spellAngleTwo = Math.PI * Math.random();
					}
					if(enemy.clock % circleInterval < circleInterval / 3 && enemy.clock % 5 == 0){
						circle(enemy, enemy.clock % (circleInterval * 2) < circleInterval);
						if(enemy.clock >= circleInterval) laser(enemy);
					} else if(enemy.clock % circleInterval >= circleInterval / 3 && enemy.clock % circleInterval < circleInterval / 3 * 2 && enemy.clock % 5 == 0) circle2(enemy, enemy.clock % (circleInterval * 2) < circleInterval, enemy.clock % circleInterval);
					if(this.clock >= 60 * 10) enemy.finished = true;
				}
			} else {
				enemy.y += enemy.speed;
				enemy.speed -= enemy.speedMod;
				enemy.health = enemy.initHealth;
				if(enemy.speed <= 0){
					enemy.speed = 0;
					enemy.clock = -1;
					enemy.ready = true;
				}
			}
		});
	}, circle = (enemy, opposite) => {
		const count = 5;
		let angle = enemy.spellAngleOne;
		sound.spawn('bulletOne');
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('arrow-blue', enemy.x, enemy.y, angle, bullet => {
				bullet.speed = 6;
				bullet.rotation = angle;
			}, bullet => {
				bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
				if(bullet.finished){
					const limit = 4.5;
					if(bullet.speed < limit) bullet.speed += 0.05;
					else if(bullet.speed > limit) bullet.speed = limit;
				} else if(bullet.flipped){
					if(bullet.speed != 0) bullet.speed = 0;
					if(bullet.clock == 60) bullet.finished = true;
				} else {
					if(bullet.speed > 0) bullet.speed -= 0.2;
					else if(bullet.speed <= 0){
						bullet.clock = -1;
						bullet.flipped = true;
					}
				}
			});
			angle += Math.PI / (count / 2);
		}
		const mod = 0.105
		enemy.spellAngleOne += opposite ? mod : -mod;
	}, circle2 = (enemy, opposite, current) => {
		const count = 10;
		let angle = enemy.spellAngleTwo;
		current = (current - 60) / 5;
		sound.spawn('bulletTwo');
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('big-red', enemy.x, enemy.y, angle, bullet => {
				bullet.speed = 4.5;
				bullet.opposite = opposite;
				bullet.current = current;
			}, bullet => {
				bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
				if(bullet.finished){
					const limit = 4.5;
					if(bullet.speed < limit) bullet.speed += 0.05;
					else if(bullet.speed > limit) bullet.speed = limit;
				} else if(bullet.flipped){
					if(bullet.speed != 0) bullet.speed = 0;
					if(bullet.clock == 60){
						bullet.finished = true;
						const mod = bullet.current;
						bullet.angle += bullet.opposite ? -mod : mod;
					}
				} else {
					if(bullet.speed > 0) bullet.speed -= 0.2;
					else if(bullet.speed <= 0){
						bullet.clock = -1;
						bullet.flipped = true;
					}
				}
			});
			angle += Math.PI / (count / 2);
		}
		const mod = 0.105
		enemy.spellAngleTwo += opposite ? -mod : mod;
	}, laser = enemy => {
			const mod = .15;
			let angle = globals.getAngle(player.sprite, enemy) - mod;
			angle += mod * 2 * Math.random()
			stageUtils.spawnBullet('ring-blue', enemy.x, enemy.y, angle, bullet => {
				const speed = 3.5;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			});
	}
	if(this.clock == 0) spawnEnemy();
	if(this.clock == 60 * 11) stageUtils.nextWave('waveTwelve', this);
},

waveTwelve(){
	const spawnEnemy = x => {
		stageUtils.spawnEnemy('fairyYellow', x, -globals.grid, enemy => {
			enemy.speed = 5;
			enemy.health = 5;
			enemy.healthInit = enemy.health;
			enemy.angle = globals.getAngle(player.sprite, enemy);
		}, enemy => {
			if(!enemy.flipped){
				enemy.speed -= 0.1;
				if(enemy.speed <= 0){
					enemy.flipped = true;
					enemy.speed = 2;
					enemy.angle = globals.getAngle(player.sprite, enemy);
					spawnBullets(enemy);
				}
				enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
				// enemy.flipped = true;
				// enemy.angle = Math.PI / 2;
				// enemy.speed = 5;
			}
		});
	}, spawnBullets = enemy => {
		const count = 15;
		let angle = Math.random() * Math.PI;
		sound.spawn('bulletOne');
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('big-blue', enemy.x, enemy.y, angle, bullet => {
				const speed = 3;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			});
			angle += Math.PI / (count / 2);
		}
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 7)
		spawnEnemy(Math.floor(Math.random() * (globals.gameWidth - globals.grid * 5)) + globals.gameX + globals.grid * 3);
	else if(this.clock == interval * 9) stageUtils.nextWave('waveThirteen', this);
},

waveThirteen(){
	const spawnEnemy = opposite => {
		const x = opposite ? globals.gameX - globals.grid : globals.gameX + globals.gameWidth + globals.grid,
			y = Math.floor(Math.random() * (globals.gameHeight / 5));
		stageUtils.spawnEnemy('fairyGreen', x, y, enemy => {
			const speed = 3.5, angle = globals.getAngle(player.sprite, enemy);
			enemy.health = 1;
			enemy.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
		});
	}, interval = 30;
	if(this.clock % (interval / 2) == 0 && this.clock < interval * 5) spawnEnemy(this.clock % interval == 0);
	else if(this.clock == interval * 6) stageUtils.nextWave('waveFourteen', this);
},

waveFourteen(){
	const spawnEnemies = () => {
		const offset = globals.grid * 3, spawnEnemy = opposite => {
			stageUtils.spawnEnemy('fairyRed',
				opposite ? globals.gameX + globals.gameWidth - offset : globals.gameX + offset,
				globals.winHeight + globals.grid, enemy => {
				const angle = -Math.PI / 2;
				enemy.speed = 3;
				enemy.health = 2;
				if(opposite) enemy.opposite;
				else enemy.scale.set(-1, 1);
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
		const count = 7;
		let angle = Math.random() * Math.PI;
		sound.spawn('bulletTwo');
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('bullet-blue', enemy.x, enemy.y, angle, bullet => {
			}, bullet => {
				const speed = 3.5;
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
			enemy.speed = 3;
			enemy.health = 3;
			enemy.angle = Math.PI / 2;
		}, enemy => {
			if(!enemy.flipped){
				enemy.speed -= 0.03;
				if(enemy.speed <= 2){
					enemy.flipped = true;
					enemy.angle = globals.getAngle(player.sprite, enemy);
					enemy.speed = 2.75;
					spawnBullets(enemy);
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, spawnBullets = enemy => {
		const mod = .2;
		let angle = globals.getAngle(player.sprite, enemy) - mod * 2;
		const spawnBullet = () => {
			sound.spawn('bulletOne');
			stageUtils.spawnBullet('big-red', enemy.x, enemy.y, angle, bullet => {
				const speed = 3.5;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			});
		}
		for(i = 0; i < 5; i++){
			spawnBullet(i);
			angle += mod;
		}
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8)
		spawnEnemy(Math.floor(Math.random() * (globals.gameWidth - globals.grid * 6)) + globals.gameX + globals.grid * 3);
	else if(this.clock == interval * 10) stageUtils.nextWave('waveSixteen', this);
},

waveSixteen(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('fairyBig', globals.gameWidth + globals.gameX - globals.grid * 5, -globals.grid, enemy => {
			enemy.speed = 6;
			enemy.health = 35;
			enemy.shotOpposite = false;
			enemy.suicide = () => {
				const score = 50000;
				chrome.showBonus(score);
				sound.spawn('bonus');
				globals.score += score;
				globals.removeBullets = true;
			};
			enemy.bulletMod = 0.5;
		}, enemy => {
			enemy.y += enemy.speed;
			const mod = 0.1;
			enemy.speed -= enemy.speed > 0 ? mod : mod / 8;
			if(enemy.speed <= 0){
				if(!enemy.fired){
					enemy.clock = -1;
					enemy.fired = true;
				}
				if(enemy.clock == 0) enemy.bulletAngle = Math.PI / 2;
				if(enemy.clock % 15 == 0) splash(enemy);
				spray(enemy);
			}
		});
	}, spray = enemy => {
		stageUtils.spawnBullet('big-blue', enemy.x, enemy.y, enemy.bulletAngle, bullet => {
			const speed = 4;
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
		});
		enemy.bulletAngle += enemy.bulletMod;
		enemy.bulletMod += 0.0025;
	}, splash = enemy => {
		const count = 20;
		let angle = Math.PI * Math.random();
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('ring-red', enemy.x, enemy.y, angle, bullet => {
				const speed = 3;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			});
			angle += Math.PI / (count / 2);
		}
	}
	if(this.clock == 0) spawnEnemy();
	else if(this.clock == 60 * 4) stageUtils.nextWave('boss', this);
},

boss(){
	const spells = [
		enemy => {
			const interval = 30, splashOffset = globals.grid * 4.5;
			if(enemy.spellClock % interval < interval / 2){
				if(enemy.spellClock % interval == 0){
					enemy.spellAngleOne = enemy.spellFlipOne ? Math.PI / 3 : Math.PI / 3 * 2;
					enemy.spellAngleTwo = Math.PI * Math.random();
					enemy.spellFlipOne = !enemy.spellFlipOne;
				}
				const splash = (x, opposite) => {
					const count = 20;
					let angle = enemy.spellAngleTwo;
					for(i = 0; i < count; i++){
						stageUtils.spawnBullet('ring-blue', x, enemy.y, angle, bullet => {
							let mod = 0.005;
							if(opposite) mod = -mod;
							bullet.mod = enemy.spellFlipOne ? mod : -mod;
							bullet.speed = 3.25;
						}, bullet => {
							bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
							bullet.rotation = bullet.angle;
						});
						angle += Math.PI / (count / 2);
					}
				}, swash = () => {
					stageUtils.spawnBullet('big-red', enemy.x, enemy.y, enemy.spellAngleOne, bullet => {
						const speed = 3;
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
						bullet.scale.set(1.25)
					});
					const mod = Math.PI / 10;
					enemy.spellAngleOne += enemy.spellFlipOne ? -mod : mod
				};
				if(enemy.spellClock % interval == 0){
					explosion.spawn({x: globals.gameX + splashOffset, y: enemy.y}, true, true);
					explosion.spawn({x: globals.gameX + globals.gameWidth - splashOffset, y: enemy.y}, true, true);
				}
				if(enemy.spellClock % 3 == 0){
					splash(globals.gameX + splashOffset);
					splash(globals.gameX + globals.gameWidth - splashOffset, true);
				}
				if(enemy.spellClock % 6 == 3) swash();
				sound.spawn('bulletOne');
			}
		},
		enemy => {
			const interval = 30, circleOffset = globals.grid * 4, arrowsOffset = globals.grid * 4, circle = (x, type) => {
				let angle = enemy.spellAngleOne;
				const count = 20, speed = type == 'big-red' ? 3.5 : 3;
				if(type == 'big-red') angle += Math.PI / count
				sound.spawn('bulletTwo');
				for(i = 0; i < count; i++){
					stageUtils.spawnBullet('big-blue', x, enemy.y, angle, bullet => {
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
					});
					angle += Math.PI / (count / 2);
				}
			}, arrows = (x, yOffset) => {
				const mod = 0.4;
				let arrowAngle = enemy.spellAngleTwo - mod;
				const spawnArrow = i => {
					let y = enemy.y;
					if(yOffset) y -= globals.grid;
					stageUtils.spawnBullet('arrow-red', x, y, arrowAngle, bullet => {
						const speed = 3;
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
						bullet.rotation = bullet.angle;
					})
				};
				for(i = 0; i < 3; i++){
					spawnArrow(i);
					arrowAngle += mod;
				}
			};
			if(enemy.spellSubClock % (interval * 2) == 0) enemy.spellAngleOne = Math.PI * Math.random()
			if(enemy.spellSubClock % interval == 0) enemy.spellAngleTwo = globals.getAngle(player.sprite, enemy);
			switch(enemy.spellSubClock % (interval * 4)){
				case 0:
					explosion.spawn({x: globals.gameX + circleOffset, y: enemy.y}, true, true);
					circle(globals.gameX + circleOffset, 'big-blue');
					break;
				case interval:
					explosion.spawn({x: globals.gameX + circleOffset, y: enemy.y}, true, true);
					circle(globals.gameX + circleOffset, 'big-red');
					break;
				case interval * 2:
					explosion.spawn({x: globals.gameX + globals.gameWidth - circleOffset, y: enemy.y}, true, true);
					circle(globals.gameX + globals.gameWidth - circleOffset, 'big-blue');
					break;
				case interval * 3:
					explosion.spawn({x: globals.gameX + globals.gameWidth - circleOffset, y: enemy.y}, true, true);
					circle(globals.gameX + globals.gameWidth - circleOffset, 'big-red');
					break;
			}
			if(enemy.spellSubClock % (interval * 2) == interval){
				explosion.spawn({x: enemy.x - arrowsOffset, y: enemy.y}, false, true);
				explosion.spawn({x: enemy.x + arrowsOffset, y: enemy.y}, false, true);
			}
			if(enemy.spellSubClock % (interval * 2) >= interval && enemy.spellSubClock % (interval * 2) < interval * 1.5 && enemy.spellSubClock % 4 == 0){
				sound.spawn('bulletOne');
				arrows(enemy.x - arrowsOffset, true);
				arrows(enemy.x);
				arrows(enemy.x + arrowsOffset, true);
			}
		},
		enemy => {
 			const curvy = () => {
 				let angle = Math.PI / 4;
				const count = 15, speed = 3.5;
				for(i = 0; i < count; i++){
					stageUtils.spawnBullet('arrow-red', enemy.x, enemy.y, angle, bullet => {
						bullet.initial = bullet.angle;
						bullet.count = 0;
						bullet.scale.set(1.25)
					}, bullet => {
						bullet.angle = bullet.initial + Math.sin(bullet.count * 1.5);
						bullet.count += 0.05;
						bullet.rotation = bullet.angle;
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
					});
					angle += Math.PI / (count / 2);
				}
 			}, circle = () => {
				let angle = Math.PI * Math.random() * 2;
				const count = 35;
				sound.spawn('bulletOne');
				for(i = 0; i < count; i++){
					stageUtils.spawnBullet('big-blue', enemy.x, enemy.y, angle, bullet => {
						const speed = 2.75;
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
					});
					angle += Math.PI / (count / 2);
				}
 			}, circleInterval = 25, curvyInterval = 60;
 			if(enemy.spellSubClock % 3 == 0 && enemy.spellSubClock % curvyInterval < curvyInterval * .66) curvy();
 			if(enemy.spellSubClock % (3 * 15) == 0) sound.spawn('laser');
 			if(enemy.spellSubClock % circleInterval == 0 && enemy.spellSubClock > 0) circle();
		},
		enemy => {
			const spray = () => {
				const count = 60;
				let angle = Math.PI;
				for(i = 0; i < count; i++){
					stageUtils.spawnBullet('ring-blue', enemy.x, enemy.y, angle, bullet => {
						let mod = 0.005;
						bullet.speed = 5;
						bullet.speedMod = 0.15 - Math.random() * 0.075;
					}, bullet => {
						if(!bullet.flipped){
							bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
							bullet.speed -= bullet.speedMod;
							if(bullet.speed <= 0){
								bullet.speed = 0;
								bullet.clock = -1;
								bullet.velocity = false;
								bullet.flipped = true;
							}
						} else if(bullet.clock >= 60){
							if(bullet.clock == 60) bullet.angle = globals.getAngle(player.sprite, bullet);
							bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
							bullet.speed += 0.1;
						}
					});
					angle += Math.PI / (count / 2);
				}
			}, circle = () => {
				sound.spawn('bulletTwo');
				const count = 10;
				let angle = globals.getAngle(player.sprite, enemy) - Math.PI / 2;
				for(i = 0; i < count + 1; i++){
					stageUtils.spawnBullet('big-red', enemy.x, enemy.y, angle, bullet => {
						const speed = 3, mod = 0.03;
						bullet.angle = bullet.angle - mod + (Math.random() * (mod * 2))
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
					}, bullet => {
					});
					angle += Math.PI / count;
				}
			}, arrows = opposite => {
				const count = 20;
				let angle = globals.getAngle(player.sprite, enemy) - Math.PI / 2;
				for(i = 0; i < count + 1; i++){
					stageUtils.spawnBullet('arrow-red', enemy.x, enemy.y, angle, bullet => {
						bullet.speed = 3.25;
						bullet.initial = bullet.angle;
						if(opposite) bullet.opposite = true;
					}, bullet => {
						if(bullet.flipped){
							if(bullet.clock == 60){
								const speed = 2.5;
								bullet.angle += bullet.opposite ? Math.PI : bullet.mod;
								bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
								bullet.rotation = bullet.angle;
							}
						} else {
							const limit = bullet.initial + Math.PI;
							if(bullet.angle < limit){
								bullet.mod = Math.PI / 30;
								bullet.angle += bullet.mod;
								bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
								bullet.rotation = bullet.angle;
							} else if(bullet.angle >= limit){
								bullet.angle = limit;
								bullet.velocity = false;
								bullet.flipped = true;
								bullet.clock = -1;
							}
						}
					});
					angle += Math.PI / (count / 2);
				}
			}, sprayInterval = 60 * 3, circleInterval = 20, arrowInterval = 60;
			if(enemy.spellSubClock % sprayInterval == 0) spray();
			if(enemy.spellSubClock % circleInterval == 0 && enemy.spellClock > arrowInterval) circle();
			if(enemy.spellSubClock % arrowInterval == 0){
				sound.spawn('bulletOne');
				arrows();
				arrows(true);
			}
		}
	], spawnEnemy = () => {
		sound.playBgm('boss');
		stageUtils.spawnEnemy('eiki', globals.gameX + globals.gameWidth / 2, -31, enemy => {
			enemy.speed = 2.5;
			enemy.spellClock = 0;
			enemy.health = 400;
			enemy.initHealth = enemy.health;
			enemy.spellAngleOne = 0;
			enemy.spellAngleTwo = 0;
			enemy.spellFlipOne = false;
			enemy.initial = enemy.x;
			enemy.spellSubClock = 0;
			enemy.count = 0;
			globals.bossHealth = enemy.health;
			globals.bossHealthInitial = enemy.health;
			enemy.suicide = () => {
				if(globals.isFiveMinute) stageUtils.nextWave('waveSeventeen', this);
				else {
					globals.wonGame = true;
					globals.gameOver = true;
				}
				globals.removeBullets = true;
				stageUtils.bossBorder.kill = true;
				globals.bossActive = false;
			}
		}, enemy => {
			if(enemy.ready && !globals.gameOver){
				if(!globals.bossActive) globals.bossActive = true;
				if(enemy.health > globals.bossHealthInitial * .75){
					if(enemy.spellClock == 0) resetSpell(enemy);
					spells[0](enemy);
				} else if(enemy.health <= globals.bossHealthInitial * .75 && enemy.health > globals.bossHealthInitial * .5){
					if(enemy.spellClock == 0) resetSpell(enemy);
					spells[1](enemy);
				} else if(enemy.health <= globals.bossHealthInitial * .5 && enemy.health > globals.bossHealthInitial * .25){
					if(enemy.spellClock == 0) resetSpell(enemy);
					spells[2](enemy);
				} else if(enemy.health <= globals.bossHealthInitial * .25){
					if(enemy.spellClock == 0) resetSpell(enemy);
					spells[3](enemy);
				}
				enemy.x = enemy.initial - Math.sin(enemy.count) * globals.grid * 2;
				enemy.count += .005;
				enemy.spellClock++;
	 			enemy.spellSubClock++;
			} else if(!globals.gameOver) {
				enemy.y += enemy.speed;
				enemy.speed -= 0.025;
				enemy.health = enemy.initHealth;
				if(enemy.speed <= 0){
					enemy.speed = 0;
					enemy.ready = true;
				}
			}
			globals.bossHealth = enemy.health;
		});
	}, resetSpell = enemy => {
		enemy.spellAngleOne = 0;
		enemy.spellAngleTwo = 0;
		enemy.spellFlipOne = false;
		enemy.spellSubClock = -1;
	}
	if(this.clock == 0) spawnEnemy();
},

// begin 5 minute

waveSeventeen(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('fairyYellow', globals.gameX + globals.grid * 3.5, -globals.grid, enemy => {
			enemy.health = 10;
			enemy.speed = 4;
			enemy.angle = Math.PI / 2;
		}, enemy => {
			if(enemy.clock >= 60){
				if(enemy.clock == 60) spawnBullets(enemy);
				if(!enemy.finished){
					enemy.angle -= .03;
					if(enemy.angle <= -Math.PI){
						spawnBullets(enemy);
						enemy.finished = true;
						if(enemy.angle != -Math.PI) enemy.angle = -Math.PI
					}
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, spawnBullets = enemy => {
		sound.spawn('bulletOne');
		const mod = 0.2;
		let angle = globals.getAngle(player.sprite, enemy) - mod;
		for(i = 0; i < 3; i++){
			stageUtils.spawnBullet('bullet-blue', enemy.x, enemy.y, angle + i * mod, bullet => {
				const speed = 3.5;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			});
		}
	}, interval = 20, wait = 60;
	if(this.clock % interval == 0 && this.clock < interval * 10 + wait && this.clock >= wait) spawnEnemy();
	else if(this.clock == interval * 12 + wait) stageUtils.nextWave('waveEighteen', this);
},

waveEighteen(){
	const spawnSmall = () => {
		var flipY = this.waveY;
		stageUtils.spawnEnemy('fairyGreen', globals.gameX + globals.grid * 4, -globals.grid, enemy => {
			enemy.speed = 3.5;
			enemy.flipY = flipY;
			enemy.angle = Math.PI / 2;
			enemy.health = 2;
		}, enemy => {
			if(!enemy.flipped && enemy.y >= enemy.flipY){
				enemy.angle = globals.getAngle(player.sprite, enemy)
				enemy.flipped = true;
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
		this.waveY += globals.grid * 4
	}, spawnBig = () => {
		stageUtils.spawnEnemy('fairyBig', globals.gameX + globals.gameWidth - globals.grid * 4, -globals.grid, enemy => {
			enemy.speed = 6;
			enemy.mod = 0.1;
			enemy.limit = -1;
			enemy.health = 25;
		}, enemy => {
			enemy.y += enemy.speed;
			enemy.speed -= enemy.mod;
			if(enemy.speed < enemy.limit) enemy.speed = enemy.limit;
			if(enemy.speed <= 0){
				if(enemy.flipped){
					if(enemy.clock < 45 && enemy.clock % 4 == 0) spray(enemy);
				} else {
					enemy.flipped = true;
					enemy.bulletAngle = globals.getAngle(player.sprite, enemy);
					enemy.bulletAngle2 = globals.getAngle(player.sprite, enemy);
					enemy.clock = -1;
					blast(enemy);
				}
			}
		});
	}, spray = enemy => {
		const count = 15, speed = 3.5;
		const half = opposite => {
			let angle = opposite ? enemy.bulletAngle2 : enemy.bulletAngle;
			angle += opposite ? -Math.PI / (count * 2) : Math.PI / (count * 2);
			sound.spawn('bulletTwo');
			for(i = 0; i < count; i++){
				stageUtils.spawnBullet('arrow-red', enemy.x, enemy.y, angle, bullet => {
					bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
					bullet.rotation = bullet.angle;
				});
				angle += opposite ? -Math.PI / count : Math.PI / count;
			}
			const mod = 0.015;
			opposite ? enemy.bulletAngle2 -= mod : enemy.bulletAngle += mod;
		};
		half();
		half(true)
	}, blast = enemy => {
		sound.spawn('bulletOne');
		const count = 35;
		let angle = globals.getAngle({x: globals.gameX + globals.grid * 5, y: globals.grid + globals.gameHeight}, enemy) - Math.PI / 3;
		const mod =  Math.PI / (count * 1.5);
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('big-blue', enemy.x, enemy.y, angle, bullet => {
				bullet.speed = 6;
			}, bullet => {
				bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
				if(bullet.flipped){
					if(bullet.clock >= 30){
						if(bullet.clock == 30){
							bullet.angle = globals.getAngle(player.sprite, bullet) + Math.PI * Math.random() - Math.PI / 3 * 2;
						}
						if(bullet.speed < 4.5) bullet.speed += 0.05;
					} else if(bullet.speed != 0) bullet.speed = 0;
				} else {
					bullet.speed -= 0.2;
					if(bullet.speed <= 0){
						bullet.clock = -1;
						bullet.flipped = true;
					}
				}
			});
			angle += mod
		}
	}, smallInterval = 30;
	if(this.clock == 0) this.waveY = globals.gameHeight / 6;
	if(this.clock == smallInterval * 2) spawnBig();
	if(this.clock % smallInterval == 0 && this.clock < smallInterval * 5) spawnSmall();
	else if(this.clock == smallInterval * 9) stageUtils.nextWave('waveNineteen', this);
},

waveNineteen(){
	const offset = globals.grid * 2, spawnEnemy = opposite => {
		stageUtils.spawnEnemy('fairyGreen', this.waveX, -globals.grid, enemy => {
			const angle = globals.getAngle(player.sprite, enemy), speed = 4;
			enemy.health = 2;
			enemy.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
		});
		this.waveX += opposite ? offset : -offset;
	}, interval = 15, limit = 4;
	if(this.clock == 0) this.waveX = globals.gameX + globals.gameWidth - offset;
	if(this.clock % interval == 0){
		if(this.clock < interval * limit) spawnEnemy();
		else if(this.clock >= interval * limit && this.clock < interval * (limit * 2)){
			if(this.clock == interval * limit) this.waveX = globals.gameX + offset;
			spawnEnemy(true);
		}
	}
	if(this.clock == interval * (limit * 2.25)) stageUtils.nextWave('waveTwenty', this);
},

waveTwenty(){
	const interval = 15, spawnEnemy = () => {
		const x = globals.gameX + globals.grid * 2 + Math.floor(Math.random() * (globals.gameWidth - globals.grid * 4));
		stageUtils.spawnEnemy('fairyRed', x, -globals.grid, enemy => {
			enemy.speed = 4;
			enemy.health = 3;
		}, enemy => {
			enemy.y += enemy.speed;
			const speedLimit = 2;
			if(enemy.speed > speedLimit) enemy.speed -= 0.05;
			else if(enemy.speed != speedLimit) enemy.speed = speedLimit;
			if(enemy.speed == speedLimit && !enemy.fired){
				enemy.fired = true;
				spawnBullets(enemy);
			}
		});
	}, spawnBullets = enemy => {
		const count = 15, speed = 2;
		let angle = Math.random() * Math.PI;
		sound.spawn('bulletOne');
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('bullet-blue', enemy.x, enemy.y, false, bullet => {
				const speed = 3;
				bullet.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
			});
			angle += Math.PI / (count / 2);
		}
	}, limit = 60 * 4
	if(this.clock % interval == 0 && this.clock < limit) spawnEnemy();
	else if(this.clock == limit + 60) stageUtils.nextWave('waveTwentyOne', this);
},

waveTwentyOne(){
	const spawnEnemy = opposite => {
		let y = globals.winHeight / 4 + Math.floor(Math.random() * globals.winHeight / 4);
		if(opposite) y -= globals.winHeight / 6;
		stageUtils.spawnEnemy('fairyBlue', opposite ? globals.gameX + globals.gameWidth + globals.grid : globals.gameX - globals.grid, y, enemy => {
			enemy.health = 2;
			enemy.speed = 3;
			enemy.speedInit = enemy.speed;
			if(opposite) enemy.opposite = true;
		}, enemy => {
			if(enemy.clock % 60 == 0){
				enemy.speed = enemy.speedInit;
				spawnBullets(enemy);
			}
			enemy.x += enemy.opposite ? -enemy.speed : enemy.speed;
			enemy.speed -= 0.05;
		});
	}, spawnBullets = enemy => {
		sound.spawn('bulletTwo');
		const mod = .4;
		let angle = globals.getAngle(player.sprite, enemy) - mod;
		for(i = 0; i < 3; i++){
			stageUtils.spawnBullet('big-red', enemy.x, enemy.y, angle + mod * i, bullet => {
				const speed = 4;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			});
		}
	}, interval = 120;
	if(this.clock % 30 == 0){
		if(this.clock < interval) spawnEnemy();
		else if(this.clock >= interval && this.clock < interval * 2) spawnEnemy(true)
	}
	if(this.clock == interval * 2.75) stageUtils.nextWave('waveTwentyTwo', this);
},

waveTwentyTwo(){
	const spawnEnemy = () => {
		const x = globals.gameX - globals.grid * 2, y = globals.grid * 7;
		stageUtils.spawnEnemy('fairyBig', x, y, enemy => {
			enemy.health = 30;
			enemy.suicide = () => {
				const score = 20000;
				chrome.showBonus(score);
				sound.spawn('bonus');
				globals.score += score;
				globals.removeBullets = true;
			}
		}, enemy => {
			enemy.x += 1.25;
			const interval = 40;
			if(enemy.clock > 0){
				if(enemy.clock % interval == interval / 4){
					enemy.bulletAngle = -Math.PI * Math.random();
					enemy.bulletPosition = {x: enemy.x + globals.grid, y: enemy.y};
				}
				if(enemy.clock % interval >= interval / 4 && enemy.clock % interval < interval / 2 && enemy.clock % 4 == 0) spawnCircle(enemy);
				if(enemy.clock % interval == 0) enemy.bulletAngle2 = globals.getAngle(player.sprite, enemy)
				else if(enemy.clock % interval == interval / 2) enemy.bulletAngle3 = globals.getAngle(player.sprite, enemy)
				if(enemy.clock % interval < interval / 3 && enemy.clock % 4 == 0) laser(enemy);
				else if(enemy.clock % interval >= interval / 2 && enemy.clock % interval < interval / 2 + interval / 3 && enemy.clock % 4 == 0) laser(enemy, true);
			}
		});
	}, laser = (enemy, opposite) => {
		const speed = 4, mod = 0.075;
		let angle = opposite ? enemy.bulletAngle3 : enemy.bulletAngle2;
		angle -= mod;
		angle += mod * 2 * Math.random()
		stageUtils.spawnBullet('ring-blue', enemy.x, enemy.y, angle, bullet => {
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
		});
	}, spawnCircle = enemy => {
		sound.spawn('bulletTwo');
		const count = 150, interval = 15;
		let angle = enemy.bulletAngle;
		for(i = 0; i < count; i++){
			if(i % interval >= interval / 3){
				stageUtils.spawnBullet('bullet-red', enemy.bulletPosition.x, enemy.bulletPosition.y, angle, bullet => {
					const speed = 3;
					bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
				});
			}
			angle += Math.PI / (count / 2);
		}
	};
	if(this.clock == 0) spawnEnemy();
	else if(this.clock == 60 * 4.75) stageUtils.nextWave('waveTwentyThree', this);
},

waveTwentyThree(){
	const timeOne = 90, timeTwo = 135, spawnEnemies = () => {
		const offset = globals.grid * 3, spawnEnemy = opposite => {
			stageUtils.spawnEnemy('fairyRed', opposite ? globals.gameX + globals.gameWidth - offset : globals.gameX + offset, -globals.grid, enemy => {
				const angle = Math.PI / 2;
				enemy.speed = 3.5;
				enemy.health = 2;
				if(opposite) enemy.opposite = true;
				if(!enemy.opposite) enemy.scale.set(-1, 1);
				enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
			}, enemy => {
				if(enemy.clock == timeOne){
					const angle = enemy.opposite ? Math.PI * 1.25 : -Math.PI / 4;
					enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
					enemy.shotPos = {x: enemy.x, y: enemy.y};
				} else if(enemy.clock == timeTwo){
					const angle = Math.PI / 2;
					enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
					enemy.shotPos = {x: enemy.x, y: enemy.y};
				}
				const limit = 20, bulletInterval = 5;
				if(enemy.clock % bulletInterval == 0){
					if(enemy.clock == timeOne || enemy.clock == timeTwo){
						enemy.bulletAngle = globals.getAngle(player.sprite, enemy);
						sound.spawn('laser');
					}
					if((enemy.clock >= timeOne && enemy.clock < timeOne + limit) || (enemy.clock >= timeTwo && enemy.clock < timeTwo + limit)){
						spawnBullets(enemy);
					}
				}
			});
		};
		spawnEnemy();
		spawnEnemy(true);
	}, spawnBullets = enemy => {
		const speed = 4, mod = .15;
		let angle = enemy.bulletAngle - mod;
		angle += Math.random() * (mod * 2)
		stageUtils.spawnBullet('ring-blue', enemy.shotPos.x, enemy.shotPos.y, angle, bullet => {
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
		});
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8) spawnEnemies();
	else if(this.clock == interval * 10) stageUtils.nextWave('waveTwentyFour', this);
},

waveTwentyFour(){
	const spawnEnemy = x => {
		stageUtils.spawnEnemy('fairyBlue', x, -globals.grid, enemy => {
			enemy.speed = 3;
			enemy.speedInit = enemy.speed;
			enemy.health = 5;
			enemy.angle = Math.PI / 2;
		}, enemy => {
			if(!enemy.flipped){
				enemy.speed -= 0.05;
				if(enemy.speed <= 1){
					enemy.flipped = true;
					enemy.angle = globals.getAngle(player.sprite, enemy);
					enemy.speed = 2.5;
					spawnBullets(enemy);
					enemy.clock = -1;
				}
			} else if(enemy.flipped && enemy.clock < 60 && enemy.clock % 5 == 0) spawnLaser(enemy);
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, spawnBullets = enemy => {
		sound.spawn('bulletOne');
		const mod = .2, count = 13;
		let angle = globals.getAngle(player.sprite, enemy) + count / 2 * mod;
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('big-red', enemy.x, enemy.y, angle, bullet => {
				const speed = 4;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			});
			angle -= mod;
		}
	}, spawnLaser = enemy => {
		const speed = 5, mod = 0.03;
		let angle = enemy.angle - mod;
		angle += Math.random() * (mod * 2);
		stageUtils.spawnBullet('ring-blue', enemy.x, enemy.y, angle, bullet => {
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
		});
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8)
		spawnEnemy(Math.floor(Math.random() * (globals.gameWidth - globals.grid * 6)) + globals.gameX + globals.grid * 3);
	else if(this.clock == interval * 10) stageUtils.nextWave('waveTwentyFive', this);
},

waveTwentyFive(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('fairyBig', globals.gameWidth + globals.gameX - globals.grid * 4, -globals.grid, enemy => {
			enemy.speed = 6;
			enemy.health = 30;
			enemy.shotOpposite = false;
			enemy.suicide = () => {
				const score = 50000;
				chrome.showBonus(score);
				sound.spawn('bonus');
				globals.score += score;
				globals.removeBullets = true;
			};
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
				if(enemy.clock % interval < interval * .4 && enemy.y > globals.grid && enemy.clock % 3 == 0){
					spawnBullets(enemy);
				}
			}
		});
	}, spawnBullets = enemy => {
		sound.spawn('bulletTwo');
		let angle = Math.PI;
		const count = 25, mod = 0.01;
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('ring-blue', enemy.x, enemy.y, angle, bullet => {
				bullet.speed = 2.5;
				bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
			}, bullet => {
				if(bullet.clock >= 35){
					spawnSubBullets(bullet);
					bullet.y = globals.gameHeight * 3
				}
			});
			angle += Math.PI / (count / 2);
		}
	}, spawnSubBullets = parentBullet => {
		const mod = Math.PI / 4, speed = 3.5;
		stageUtils.spawnBullet('ring-blue', parentBullet.x, parentBullet.y, parentBullet.angle - mod, bullet => {
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			bullet.rotation = bullet.angle;
		});
		stageUtils.spawnBullet('ring-blue', parentBullet.x, parentBullet.y, parentBullet.angle + mod / 2, bullet => {
			bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
			bullet.rotation = bullet.angle;
		});
	}
	if(this.clock == 0) spawnEnemy();
	else if(this.clock == 60 * 2.5) stageUtils.nextWave('waveTwentySix', this);
},

waveTwentySix(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('fairyBlue', globals.gameX + globals.gameWidth - globals.grid * 3.5, -globals.grid, enemy => {
			enemy.health = 10;
			enemy.speed = 4;
			enemy.angle = Math.PI / 2;
		}, enemy => {
			if(enemy.clock >= 60){
				if(enemy.clock == 60) spawnBullet(enemy);
				if(!enemy.finished){
					enemy.angle += .03;
					const limit = Math.PI * 2;
					if(enemy.angle >= limit){
						spawnBullet(enemy);
						enemy.finished = true;
						if(enemy.angle != limit) enemy.angle = limit;
					}
				}
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
	}, spawnBullet = enemy => {
		sound.spawn('bulletOne');
		const count = 15;
		let angle = Math.PI * Math.random();
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('bullet-red', enemy.x, enemy.y, angle, bullet => {
				bullet.speed = 4;
			}, bullet => {
				bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
				if(bullet.speed > 2) bullet.speed -= 0.015;
			});
			angle += Math.PI / (count / 2);
		}
	}, interval = 20;
	if(this.clock % interval == 0 && this.clock < interval * 10) spawnEnemy();
	else if(this.clock == interval * 12) stageUtils.nextWave('waveTwentySeven', this);
},

waveTwentySeven(){
	const spawnEnemy = opposite => {
		const x = opposite ? globals.gameX - globals.grid : globals.gameX + globals.gameWidth + globals.grid,
			y = Math.floor(Math.random() * (globals.gameHeight / 5));
		stageUtils.spawnEnemy('fairyGreen', x, y, enemy => {
			const speed = 3.5, angle = globals.getAngle(player.sprite, enemy);
			enemy.health = 1;
			enemy.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
		});
	}, interval = 30;
	if(this.clock % (interval / 2) == 0 && this.clock < interval * 5) spawnEnemy(this.clock % interval == 0);
	else if(this.clock == interval * 6) stageUtils.nextWave('waveTwentyEight', this);
},

waveTwentyEight(){
	const spawnEnemy = opposite => {
		let y = globals.winHeight / 4 + Math.floor(Math.random() * globals.winHeight / 4);
		if(opposite) y -= globals.winHeight / 6;
		stageUtils.spawnEnemy('fairyYellow', opposite ? globals.gameX + globals.gameWidth + globals.grid : globals.gameX - globals.grid, y, enemy => {
			enemy.health = 2;
			enemy.speed = 3;
			enemy.speedInit = enemy.speed;
			if(opposite) enemy.opposite = true;
		}, enemy => {
			const interval = 60;
			if(enemy.clock % interval >= interval / 2 && enemy.clock % interval < interval * .75 && enemy.clock % 3 == 0){
				if(enemy.clock % interval == interval / 2){
					sound.spawn('laser');
					enemy.bulletAngle = globals.getAngle(player.sprite, enemy);
					enemy.bulletPosition = {x: enemy.x, y: enemy.y};
				}
				enemy.speed = enemy.speedInit;
				spawnBullet(enemy);
			}
			enemy.x += enemy.opposite ? -enemy.speed : enemy.speed;
			enemy.speed -= 0.05;
		});
	}, spawnBullet = enemy => {
		const mod = 0.2;
		let angle = enemy.bulletAngle - mod * 2;
		sound.spawn('bulletTwo');
		for(i = 0; i < 5; i++){
			stageUtils.spawnBullet('arrow-blue', enemy.bulletPosition.x, enemy.bulletPosition.y, angle, bullet => {
				const speed = 3.75;
				bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
				bullet.rotation = bullet.angle;
			});
			angle += mod;
		}
	}, interval = 120;
	if(this.clock % 30 == 0){
		if(this.clock < interval) spawnEnemy(true);
		else if(this.clock >= interval && this.clock < interval * 2) spawnEnemy()
	}
	if(this.clock == interval * 2.25) stageUtils.nextWave('waveTwentyNine', this);
},

waveTwentyNine(){
	const spawnEnemies = () => {
		const offset = globals.grid * 3, spawnEnemy = opposite => {
			stageUtils.spawnEnemy('fairyRed', opposite ? globals.gameX + globals.gameWidth - offset : globals.gameX + offset,
				opposite ? -globals.grid : globals.winHeight + globals.grid, enemy => {
				const angle = Math.PI / 2;
				enemy.speed = opposite ? 3 : -3;
				enemy.health = 2;
				if(opposite) enemy.opposite = true;
				if(!enemy.opposite) enemy.scale.set(-1, 1);
				enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
			}, enemy => {
				if(enemy.clock == 90){
					const angle = Math.PI * 1.25;
					enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
					enemy.shotPos = {x: enemy.x, y: enemy.y};
				} else if(enemy.clock == 135){
					const angle = Math.PI / 2;
					enemy.velocity = {x: Math.cos(angle) * enemy.speed, y: Math.sin(angle) * enemy.speed};
					enemy.shotPos = {x: enemy.x, y: enemy.y};
				}
				const limit = 15, bulletInterval = 5;
				if(enemy.clock % bulletInterval == 0){
					if(enemy.clock == 90) spawnBullets(enemy);
					else if(enemy.clock == 135) spawnBullets(enemy, true);
				}
			});
		};
		spawnEnemy();
		spawnEnemy(true);
	}, spawnBullets = (enemy, opposite) => {
		sound.spawn('bulletTwo');
		const count = 9;
		let angle = Math.PI * Math.random();
		for(i = 0; i < count; i ++){
			stageUtils.spawnBullet('big-blue', enemy.shotPos.x, enemy.shotPos.y, angle, bullet => {
				bullet.speed = 3;
			}, bullet => {
				bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
				if(bullet.speed > 2) bullet.speed -= 0.05;
			});
			angle += Math.PI / (count / 2);
		}
	}, interval = 30;
	if(this.clock % interval == 0 && this.clock < interval * 8) spawnEnemies();
	else if(this.clock == interval * 10) stageUtils.nextWave('waveThirty', this);
},

waveThirty(){
	const spawnSmall = () => {
		var flipY = this.waveY;
		stageUtils.spawnEnemy('fairyGreen', globals.gameX + globals.gameWidth - globals.grid * 4, -globals.grid, enemy => {
			enemy.speed = 3.5;
			enemy.flipY = flipY;
			enemy.angle = Math.PI / 2;
			enemy.health = 2;
		}, enemy => {
			if(!enemy.flipped && enemy.y >= enemy.flipY){
				enemy.angle = globals.getAngle(player.sprite, enemy)
				enemy.flipped = true;
			}
			enemy.velocity = {x: Math.cos(enemy.angle) * enemy.speed, y: Math.sin(enemy.angle) * enemy.speed};
		});
		this.waveY += globals.grid * 4
	}, spawnBig = () => {
		stageUtils.spawnEnemy('fairyBig', globals.gameX + globals.grid * 4, -globals.grid, enemy => {
			enemy.speed = 6;
			enemy.mod = 0.1;
			enemy.limit = -1;
			enemy.health = 25;
		}, enemy => {
			enemy.y += enemy.speed;
			enemy.speed -= enemy.mod;
			if(enemy.speed < enemy.limit) enemy.speed = enemy.limit;
			if(enemy.speed <= 0){
				if(enemy.flipped){
					if(enemy.clock < 45 && enemy.clock % 4 == 0) spray(enemy);
				} else {
					enemy.flipped = true;
					enemy.bulletAngle = globals.getAngle(player.sprite, enemy);
					enemy.bulletAngle2 = globals.getAngle(player.sprite, enemy);
					enemy.clock = -1;
					blast(enemy);
				}
			}
		});
	}, spray = enemy => {
		const count = 15, speed = 3.5;
		const half = opposite => {
			let angle = opposite ? enemy.bulletAngle2 : enemy.bulletAngle;
			angle += opposite ? -Math.PI / (count * 2) : Math.PI / (count * 2);
			sound.spawn('bulletTwo');
			for(i = 0; i < count; i++){
				stageUtils.spawnBullet('arrow-red', enemy.x, enemy.y, angle, bullet => {
					bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
					bullet.rotation = bullet.angle;
				});
				angle += opposite ? -Math.PI / count : Math.PI / count;
			}
			const mod = 0.015;
			opposite ? enemy.bulletAngle2 -= mod : enemy.bulletAngle += mod;
		};
		half();
		half(true)
	}, blast = enemy => {
		sound.spawn('bulletOne');
		const count = 20;
		let angle = globals.getAngle({x: globals.gameX + globals.gameWidth - globals.grid * 5, y: globals.grid + globals.gameHeight}, enemy) - Math.PI / 3;
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('big-blue', enemy.x, enemy.y, angle, bullet => {
				bullet.speed = 6;
			}, bullet => {
				bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
				if(bullet.flipped){
					if(bullet.clock == 30){
						subBullets({x: bullet.x, y: bullet.y});
						bullet.y = globals.gameHeight * 3;
					} else if(bullet.speed != 0) bullet.speed = 0;
				} else {
					bullet.speed -= 0.2;
					if(bullet.speed <= 0){
						bullet.clock = -1;
						bullet.flipped = true;
					}
				}
			});
			angle += Math.PI / (count * 1.5);
		}
	}, subBullets = parentBullet => {
		const count = 7;
		let angle = Math.PI * 2 * Math.random();
		for(i = 0; i < count; i++){
			stageUtils.spawnBullet('bullet-blue', parentBullet.x, parentBullet.y, angle, bullet => {
				bullet.speed = 0;
			}, bullet => {
				bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
				if(bullet.speed < 3) bullet.speed += 0.075;
			});
			angle += Math.PI / (count / 2);
		}
	}, smallInterval = 30;
	if(this.clock == 0) this.waveY = globals.gameHeight / 6;
	if(this.clock == smallInterval * 2) spawnBig();
	if(this.clock % smallInterval == 0 && this.clock < smallInterval * 5) spawnSmall();
	else if(this.clock == smallInterval * 9) stageUtils.nextWave('miniBoss2', this);
},

miniBoss2(){
	const spawnEnemy = () => {
		stageUtils.spawnEnemy('komachi', globals.gameX + globals.gameWidth / 2, -31, enemy => {
			enemy.speed = 2.5;
			enemy.speedMod = 0.025;
			enemy.health = 60;
			enemy.initHealth = enemy.health;
			enemy.spinnerAngle = 0;
			enemy.spinnerAngleTwo = Math.PI;
			enemy.spinnerDir = true;
			globals.bossHealth = enemy.health;
			globals.bossHealthInitial = enemy.health;
			enemy.suicide = () => {
				const score = 80000;
				chrome.showBonus(score);
				sound.spawn('bonus');
				globals.score += score;
				globals.removeBullets = true;
				stageUtils.bossBorder.kill = true;
				globals.bossActive = false;
			}
		}, enemy => {
			if(enemy.ready){
				if(enemy.finished){
					enemy.y += enemy.speed;
					enemy.speed -= enemy.speedMod;
					stageUtils.bossBorder.kill = true;
					globals.bossActive = false;
				} else if(!globals.gameOver){
					globals.bossActive = true;
					const starsInterval = 60 * 4;
					if(enemy.clock % 25 == 0 && enemy.clock > 0) circle(enemy);
					if(enemy.clock % starsInterval < starsInterval / 8 && enemy.clock % 3 == 0){
						if(enemy.clock % starsInterval == 0){
							enemy.spellAngleOne = Math.PI * Math.random()
							enemy.spellAngleTwo = Math.PI * Math.random()
						}
						stars(enemy, enemy.clock % starsInterval / 4);
					}
					if(this.clock >= 60 * 10) enemy.finished = true;
				}
			} else {
				enemy.y += enemy.speed;
				enemy.speed -= enemy.speedMod;
				enemy.health = enemy.initHealth;
				if(enemy.speed <= 0){
					enemy.speed = 0;
					enemy.clock = -1;
					enemy.ready = true;
				}
			}
		});
	}, circle = enemy => {
		sound.spawn('bulletTwo');
		const count = 25;
		let angle = Math.PI * Math.random();
		for(i = 0; i < count; i ++){
			stageUtils.spawnBullet('big-red', enemy.x, enemy.y, angle, bullet => {
				bullet.speed = 2.5;
				bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
			});
			angle += Math.PI / (count / 2);
		}
	}, stars = (enemy, clockIndex) => {
		const count = 5, diff = 128;
		let angle = enemy.spellAngleOne, subAngle = enemy.spellAngleTwo;
		for(i = 0; i < count; i ++){
			const x = enemy.x + Math.cos(angle) * diff, y = enemy.y + Math.sin(angle) * diff;
			for(j = 0; j < count; j ++){
				stageUtils.spawnBullet('ring-blue', x, y, subAngle, bullet => {
					bullet.speed = .35 + (clockIndex / 3);
				}, bullet => {
					if(bullet.clock == 40) bullet.speed = 0;
					else if(bullet.clock == 40 * 2){
						bullet.angle += Math.PI * Math.random();
						bullet.speed = 2.75;
					}
					bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
				});
				subAngle += Math.PI / (count / 2);
			}
			angle += Math.PI / (count / 2);
		}
	}

	if(this.clock == 0) spawnEnemy();
	if(this.clock == 60 * 11) stageUtils.nextWave('boss2', this);
},

waveThirtyOne(){

},

boss2(){
	const spells = [
		enemy => {
			const moveInterval = 60 * 6, xOffset = globals.grid * 6, xSpeed = 2, ySpeed = 1, timeOffset = 40,
			star = () => {
				if(enemy.spellClock % moveInterval == 0) enemy.spellAngle = globals.getAngle(player.sprite, enemy);
				const count = 450, interval = enemy.spellClock % (3 * timeOffset), speed = 6;
				let angle = enemy.spellAngle;
				for(i = 0; i < count; i++){
					if(i == 0 ||
						i == count / 2 - interval ||
						i == count / 2 + interval ||
						i == count / 3 - interval ||
						i == count / 3 * 2 + interval
						){
						stageUtils.spawnBullet('arrow-blue', enemy.x, enemy.y, angle, bullet => {
							bullet.scale.set(1.25);
							bullet.rotation = bullet.angle;
							bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
						});
					}
					angle += Math.PI / (count / 2);
				}
			}, burst = x => {
				const count = 5, speed = 4.5, mod = 0.025;
				let angle = enemy.spellAngle - Math.PI / 2 - mod * 2;
				angle += mod * 2 * Math.random();
				for(i = 0; i < count; i++){
					stageUtils.spawnBullet('big-red', x, enemy.y, angle, bullet => {
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
					});
					angle += Math.PI / count;
				}
			}, crazy = () => {
				const count = 5, speed = 2.5;
				let angle = globals.getAngle(player.sprite, enemy);
				for(i = 0; i < count; i++){
					stageUtils.spawnBullet('arrow-blue', enemy.x, enemy.y, angle, bullet => {
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
						bullet.rotation = bullet.angle;
					}, bullet => {
						if(bullet.clock % 15 == 0 && bullet.clock < 90) sub(bullet);
					});
					angle += Math.PI / (count / 2);
				}
				const sub = parentBullet => {
					const count = 9, speed = 3;
					let subAngle = Math.PI * Math.random()  * 2;
					for(i = 0; i < count; i++){
						stageUtils.spawnBullet('bullet-blue', parentBullet.x, parentBullet.y, subAngle, bullet => {
							bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
						});
						subAngle += Math.PI / (count / 2);
					}
				};
			}
			if(enemy.spellClock % moveInterval < moveInterval / 2 - timeOffset){
				if(enemy.spellClock % 6 == 0) star();
				if(enemy.spellClock % 12 == 0){
					burst(enemy.x - globals.grid * 2);
					burst(enemy.x + globals.grid * 2);
				}
			}
			else if(enemy.spellClock % moveInterval == moveInterval / 2) crazy();
		},
		enemy => {
			const spray = (x, opposite) => {
				let angle = x < enemy.x ? enemy.spellAngle1 : enemy.spellAngle2;
				const count = 5, speed = 4.5;
				angle -= Math.PI / (count / 2)
				for(i = 0; i < count; i++){
					stageUtils.spawnBullet(opposite ? 'big-blue' : 'big-red', x, enemy.y, angle, bullet => {
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
					});
					angle += Math.PI / count;
				}
				// console.log('ff')
			}, shower = () => {
				const speed = 2;
				let angle = Math.PI;
				angle += Math.random() * Math.PI;
				stageUtils.spawnBullet('ring-red', enemy.x, enemy.y, angle, bullet => {
					bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
				}, bullet => {
					bullet.y += bullet.clock / 20
				});
			}, sprayInterval = 64, xOffset = globals.grid * 4, current = enemy.spellClock % sprayInterval;
			if(enemy.spellClock % 2 == 0) shower();
			if(enemy.spellClock % 4 == 0){
				if(current == sprayInterval / 4 || current == sprayInterval *.75){
					enemy.spellAngle1 = globals.getAngle(player.sprite, {x: enemy.x - xOffset, y: enemy.y});
					enemy.spellAngle2 = globals.getAngle(player.sprite, {x: enemy.x + xOffset, y: enemy.y});
				}
				if(current >= sprayInterval / 4 && current < sprayInterval / 2){
					spray(enemy.x - xOffset);
					spray(enemy.x + xOffset);
				} else if(current >= sprayInterval *.75){
					spray(enemy.x - xOffset, true);
					spray(enemy.x + xOffset, true);
				}
			}
		},
		enemy => {
			const laser = () => {
				const interval = 50, mod = 0.1;
				if(enemy.spellClock % interval >= interval / 2 && enemy.spellClock % interval < interval / 2 + interval / 5){
					if(enemy.spellClock % interval == interval / 2){
						enemy.bulletAngle = globals.getAngle(player.sprite, enemy) - Math.PI / 2;
					}
					const count = 15, speed = 6
					let angle = enemy.bulletAngle;
					for(i = 0; i < count; i++){
						stageUtils.spawnBullet('bullet-blue', enemy.x, enemy.y, angle, bullet => {
							bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
						});
						angle += Math.PI / count;
					}
				}
			}, spray = () => {
				const speed = 3.5;
				let angle = Math.PI / 5 * 4;
				angle -= Math.PI / 5 * 3 * Math.random();
				stageUtils.spawnBullet('big-red', enemy.x, enemy.y, angle, bullet => {
					bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
				});
			};
			laser();
			if(enemy.spellClock % 2 == 0) spray();
		},
		enemy => {
			if(enemy.spellClock == 0){
				enemy.spellAngle1 = Math.PI;
				enemy.spellAngle2 = Math.PI;
			}
			const circle = (opposite, canDo) => {
				enemy.shootingLaser = false;
				const count = 15;
				let angle = opposite ? enemy.spellAngle2 : enemy.spellAngle1;
				for(i = 0; i < count; i++){
					if(!opposite || canDo){
						stageUtils.spawnBullet(opposite ? 'ring-red' : 'ring-blue', enemy.x, enemy.y, angle, bullet => {
							bullet.speed = 4;
							bullet.alpha = 0;
						}, bullet => {
							if(bullet.clock >= 9 && !bullet.alpha) bullet.alpha = 1
							bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
						});
					}
					angle += Math.PI / (count / 2);
				}
				const mod = Math.PI / 30;
				if(opposite) enemy.spellAngle2 += mod;
				else enemy.spellAngle1 -= mod;
			}, tracker = () => {
				if(enemy.spellSubClock == 0){
					enemy.tracker = new PIXI.extras.TilingSprite(sprites.bullets.tracker);
					enemy.tracker.width = 3;
					enemy.tracker.height = 0;
					enemy.tracker.clock = 0;
					enemy.tracker.destination = {x: player.sprite.x, y: player.sprite.y};
					globals.containers.enemyBullets.addChild(enemy.tracker)
				}
				enemy.tracker.x = enemy.x;
				enemy.tracker.y = enemy.y;
				enemy.tracker.angle = globals.getAngle(enemy.tracker.destination, enemy);
				enemy.tracker.rotation = enemy.tracker.angle - Math.PI / 2;
				if(enemy.tracker.height < globals.winHeight && enemy.tracker.clock >= 30) enemy.tracker.height += 10;
				enemy.tracker.clock++;
			}, laser = () => {
				enemy.shootingLaser = true;
				const speed = 12, mod = 0.065;
				stageUtils.spawnBullet('laser-red', enemy.laserPosition.x, enemy.laserPosition.y, enemy.tracker.angle, bullet => {
					bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
					bullet.rotation = bullet.angle - Math.PI / 2;
					bullet.scale.x += enemy.spellSubClock * mod;
					bullet.scale.y += enemy.spellSubClock * (mod / 2);
				}, bullet => {
					bullet.scale.x += mod;;
				});
			}
			const interval = 60 * 6;
			if(enemy.spellClock % interval < interval / 3 * 2){
				if(enemy.spellClock % interval == 0) enemy.spellSubClock = 0;
				if(enemy.spellClock % interval < interval / 2 - 20 && enemy.spellClock % 5 == 0){
					circle();
					circle(true, enemy.spellClock % 10 == 5);
				}
				tracker();
			} else if(enemy.spellClock % interval >= interval / 3 * 2){
				if(enemy.spellClock % interval == interval / 3 * 2){
					enemy.spellSubClock = 0;
					enemy.laserAngle = enemy.tracker.angle;
					enemy.laserPosition = {x: enemy.x, y: enemy.y};
					globals.containers.enemyBullets.removeChild(enemy.tracker)
				}
				laser();
			}
			enemy.spellSubClock++;
		}
	], spawnEnemy = () => {
		sound.playBgm('boss');
		stageUtils.spawnEnemy('eiki', globals.gameX + globals.gameWidth / 2, -31, enemy => {
			enemy.speed = 2.5;
			enemy.spellClock = 0;
			enemy.health = 300;
			enemy.initHealth = enemy.health;
			enemy.count = 0;
			globals.bossHealth = enemy.health;
			globals.bossHealthInitial = enemy.health;
			enemy.initial = enemy.x;
			enemy.suicide = () => {
				// if(globals.isFiveMinute) stageUtils.nextWave('waveSeventeen', this);
				// else {
				// 	globals.wonGame = true;
				// 	globals.gameOver = true;
				// }
				// globals.removeBullets = true;
				// stageUtils.bossBorder.kill = true;
				// globals.bossActive = false;
			}
		}, enemy => {
			if(enemy.ready && !globals.gameOver){
				if(!globals.bossActive) globals.bossActive = true;
				if(enemy.health > globals.bossHealthInitial * .75) spells[0](enemy);
				else if(enemy.health <= globals.bossHealthInitial * .75 && enemy.health > globals.bossHealthInitial * .5){
					if(!enemy.didSpellOne){
						enemy.didSpellOne = true;
						enemy.spellClock = 0;
						globals.removeBullets = true;
						chips.spawnPower(enemy);
					}
					spells[1](enemy);
				} else if(enemy.health <= globals.bossHealthInitial * .5 && enemy.health > globals.bossHealthInitial * .25){
					if(!enemy.didSpellTwo){
						enemy.didSpellTwo = true;
						enemy.spellClock = 0;
						globals.removeBullets = true;
						chips.spawnPower(enemy);
					}
					spells[2](enemy);
				} else if(enemy.health <= globals.bossHealthInitial * .25){
					if(!enemy.didSpellThree){
						enemy.didSpellThree = true;
						enemy.spellClock = 0;
						globals.removeBullets = true;
						chips.spawnPower(enemy);
					}
					spells[3](enemy);
				}
				if(!enemy.shootingLaser){
					enemy.x = enemy.initial - Math.sin(enemy.count) * globals.grid * 3;
					enemy.count += .01;
				}
	 			enemy.spellClock++;
			} else if(!globals.gameOver) {
				enemy.y += enemy.speed;
				enemy.speed -= 0.025;
				enemy.health = enemy.initHealth;
				if(enemy.speed <= 0){
					enemy.speed = 0;
					enemy.ready = true;
				}
			}
			globals.bossHealth = enemy.health;
		});
	};
	if(this.clock == 0) spawnEnemy();
},

currentWave(){
	stageUtils.nextWave('boss2', this);
}

};


/*
enemy => {
 			const curvy = initClock => {
				const speed = 3.5, count = 10, totalWidth = globals.gameX * 2 + globals.gameWidth;
				for(i = 0; i < totalWidth / count; i++){
					const x = totalWidth / count * i + globals.grid * 2 * enemy.curvyOffset;
					stageUtils.spawnBullet('ring-red', x, enemy.y, false, bullet => {
						bullet.initial = Math.PI / 2;
						bullet.count = 0;
						bullet.opposite = i % 2 == 0;
					}, bullet => {
						bullet.angle = bullet.initial + Math.sin(bullet.count);
						const mod = 0.1;
						bullet.count += bullet.opposite ? mod : -mod;
						bullet.rotation = bullet.angle;
						bullet.velocity = {x: Math.cos(bullet.angle) * speed, y: Math.sin(bullet.angle) * speed};
					});
				}
 			},  circle = () => {
				let angle = Math.PI * Math.random() * 2;
				const count = 35;
				sound.spawn('bulletOne');
				for(i = 0; i < count; i++){
					stageUtils.spawnBullet('big-blue', enemy.x, enemy.y, angle, bullet => {
						bullet.speed = 6;
					}, bullet => {
						bullet.velocity = {x: Math.cos(bullet.angle) * bullet.speed, y: Math.sin(bullet.angle) * bullet.speed};
						if(bullet.speed > 2.5) bullet.speed -= 0.1;
					});
					angle += Math.PI / (count / 2);
				}
 			}
 			circleInterval = 25, curvyInterval = 60;
 			if(enemy.spellSubClock % 3 == 0 && enemy.spellSubClock % curvyInterval < curvyInterval * .5){
 				if(enemy.spellSubClock % curvyInterval == 0) enemy.curvyOffset++;
 				curvy(enemy.spellSubClock % curvyInterval);
 			}
			if(enemy.spellSubClock % (3 * 15) == 0) sound.spawn('laser');
			if(enemy.spellSubClock % circleInterval == 0 && enemy.spellSubClock > 0) circle();
		}, 

		*/