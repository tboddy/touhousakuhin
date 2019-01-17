module.exports = {

	spawn(bullet){
		const item = PIXI.Sprite.fromImage('img/player/graze.png');
		item.x = player.sprite.x;
		item.y = player.sprite.y;
		item.zOrder = 70;
		item.type = 'graze';
		item.scale.set(1.5)
		const angle = globals.getAngle(bullet, player.sprite), speed = 2;
		item.velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
		item.clock = 0;
		globals.game.stage.addChild(item);
		globals.score += 25;
		sound.spawn('graze');
	},

	update(item, index){
		if(!globals.paused){
			item.x += item.velocity.x;
			item.y += item.velocity.y;
			item.clock++;
			if(item.clock >= 20) globals.game.stage.removeChildAt(index);
		}
	}

};