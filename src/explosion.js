module.exports = {

	count: 0,

	spawn(bullet, blue, big){
		const suffix = blue ? 'blue' : 'red';
		const explosion = PIXI.Sprite.from(sprites.explosion[suffix][0]);
		explosion.textureB = sprites.explosion[suffix][1];
		explosion.textureC = sprites.explosion[suffix][2];
		explosion.textureD = sprites.explosion[suffix][3];
		explosion.textureE = sprites.explosion[suffix][4];
		explosion.anchor.set(0.5);
		explosion.x = bullet.x;
		explosion.y = bullet.y;
		explosion.clock = -1;
		explosion.type = 'explosion';
		if(big) explosion.scale.set(2);
		if(Math.round(Math.random())) explosion.scale.x = big ? -2 : -1;
		if(Math.round(Math.random())) explosion.scale.y = big ? -2 : -1;
		globals.containers.explosions.addChild(explosion);
		this.count++;
		sound.spawn('explosion');
	},

	update(explosion, i){
		if(globals.containers.explosions.children.length && !globals.paused){
			for(i = 0; i < globals.containers.explosions.children.length; i++){
				const explosion = globals.containers.explosions.children[i];
				explosion.clock++;
				const interval = 4;
				if(explosion.clock == interval) explosion.texture = explosion.textureB;
				else if(explosion.clock == interval * 2) explosion.texture = explosion.textureC;
				else if(explosion.clock == interval * 3) explosion.texture = explosion.textureD;
				else if(explosion.clock == interval * 4) explosion.texture = explosion.textureE;
				else if(explosion.clock == interval * 5){
					this.count--;
					globals.containers.explosions.removeChildAt(i);
				}
			}
		}
	}

};