module.exports = {
	clock: 0,
	waveX: 0,

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
				const angle = globals.getAngle(player.sprite, enemy), speed = 2;
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
	},

	waveFour(){
		const spawnEnemies = () => {
			const offset = globals.grid * 2, spawnEnemy = opposite => {
				stageUtils.spawnEnemy('fairyRed', opposite ? globals.gameX + globals.gameWidth - offset : globals.gameX + opposite, -globals.grid, enemy => {

				}, enemy => {
					
				});
			};
			spawnEnemy();
			spawnEnemy(true);
		}, interval = 30;
		if(this.clock % interval == 0) spawnEnemies();
	},

	currentWave(){
		this.waveOne();
		this.clock++;
	}
};