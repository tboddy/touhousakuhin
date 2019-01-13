module.exports = {

	interval: 4,
	spawnTime: 12,

	count: 0,

	spawn(bullet, blue, zOrder, big){
		if(this.count < 10 || player.bombClock){
			const suffix = blue ? '-blue' : '';
			const explosion = PIXI.Sprite.fromImage('img/explosions/explosion' + suffix + '01.png');
			explosion.textureB = PIXI.Texture.fromImage('img/explosions/explosion' + suffix + '02.png');
			explosion.textureC = PIXI.Texture.fromImage('img/explosions/explosion' + suffix + '03.png');
			explosion.textureD = PIXI.Texture.fromImage('img/explosions/explosion' + suffix + '04.png');
			explosion.textureE = PIXI.Texture.fromImage('img/explosions/explosion' + suffix + '05.png');
			explosion.anchor.set(0.5);
			explosion.x = bullet.x;
			explosion.y = bullet.y;
			explosion.clock = -1;
			explosion.zOrder = zOrder ? zOrder : 90;
			explosion.type = 'explosion';
			if(big) explosion.scale.set(2);
			globals.game.stage.addChild(explosion);
			this.count++;
			// sound.spawn('explosion');
		}
	},

	update(explosion, i){
		if(!globals.paused){
			explosion.clock++;
			const interval = 3;
			if(explosion.clock == interval) explosion.texture = explosion.textureB;
			else if(explosion.clock == interval * 2) explosion.texture = explosion.textureC;
			else if(explosion.clock == interval * 3) explosion.texture = explosion.textureD;
			else if(explosion.clock == interval * 4) explosion.texture = explosion.textureE;
			else if(explosion.clock == interval * 5){
				this.count--;
				globals.game.stage.removeChildAt(i);
			}
		}
	}

};