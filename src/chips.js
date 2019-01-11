module.exports = {

zOrder: 900,

spawnPower(block){
	const chip = PIXI.Sprite.fromImage('img/chips/power.png');
	chip.anchor.set(.5);
	chip.zOrder = this.zOrder;
	chip.type = 'chipPower';
	chip.x = block.x;
	chip.y = block.y;
	chip.initial = block.x;
	chip.count = 0;
	globals.game.stage.addChild(chip);
},

updatePower(chip, index){
	chip.y += 1.5;
	chip.x = chip.initial - Math.sin(chip.count) * globals.grid * 3.5;
	chip.count += .075;
	if(chip.y - chip.height / 2 > globals.gameHeight) globals.game.stage.removeChildAt(index)
},

spawn(enemy){
	// const chip = PIXI.Sprite.fromImage('img/chip.png');
	// chip.anchor.set(0.5);
	// chip.zOrder = 999;
	// chip.x = enemy.x;
	// chip.y = enemy.y + enemy.height / 2;
	// chip.type = 'chip';
	// chip.speed = -3;
	// chip.speedMod = 0.05;
	// chip.speedMax = 3;
	// chip.flipSpeed = chip.speedMax;
	// chip.flipMod = 0.5;
	// globals.game.stage.addChild(chip);
},

update(chip, index){
	// if(chip.flipped && chip.y <= globals.gameHeight + chip.height / 2){
	// 	const angle = globals.getAngle(player.sprite, chip);
	// 	chip.x += Math.cos(angle) * chip.flipSpeed;
	// 	chip.y += Math.sin(angle) * chip.flipSpeed;
	// 	chip.flipSpeed += chip.flipMod;
	// } else {
	// 	chip.y += chip.speed;
	// 	if(chip.speed < chip.speedMax) chip.speed += chip.speedMod;
	// 	else if(chip.speed > chip.speedMax) chip.speed = chip.speedMax;
	// 	if(player.sprite.y <= Math.floor(globals.gameHeight / 5 * 2)) chip.flipped = true;
	// 	if(chip.y - chip.height / 2 > globals.gameHeight) globals.game.stage.removeChildAt(index)
	// }
}

};