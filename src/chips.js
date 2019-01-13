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
}

};