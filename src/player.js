module.exports = {

zIndex: 20,
speed: 5,
shotClock: 0,
didShootClock: 0,
skewDiff: .1,
power: 2,
graze: 0,
invulnerableClock: 0,
removed: false,
bulletSpeed: 30,
didShoot: false,
lives: 3,
livesInit: 1,
spriteInit: false,
focusClock: 0,
idleClock: 0,
leftClock: 0,
rightClock: 0,

move(){
	let speed = controls.focus ? this.speed / 2 : this.speed;
	const currentImage = this.sprite.texture.baseTexture.imageUrl;
	if(controls.moving.left){
		this.sprite.x -= speed;
		this.sprite.texture = this.leftClock < globals.idleInterval / 4 ? sprites.player.left0 : sprites.player.left1;
		this.leftClock++;
		if(this.idleClock) this.idleClock = 0;
		if(this.rightClock) this.rightClock = 0;
	} else if(controls.moving.right){
		this.sprite.x += speed;
		this.sprite.texture = this.rightClock < globals.idleInterval / 4 ? sprites.player.right0 : sprites.player.right1;
		this.rightClock++;
		if(this.idleClock) this.idleClock = 0;
		if(this.leftClock) this.leftClock = 0;
	} else if(!controls.moving.left && !controls.moving.right){
		if(this.idleClock % globals.idleInterval == 0) this.sprite.texture = sprites.player.center0;
		else if(this.idleClock % globals.idleInterval == globals.idleInterval / 4 || this.idleClock % globals.idleInterval == globals.idleInterval / 4 * 3) this.sprite.texture = sprites.player.center1;
		else if(this.idleClock % globals.idleInterval == globals.idleInterval / 2) this.sprite.texture = sprites.player.center2;
		this.idleClock++;
		if(this.leftClock) this.leftClock = 0;
		if(this.rightClock) this.rightClock = 0;
	}
	if(controls.moving.up) this.sprite.y -= speed;
	else if(controls.moving.down) this.sprite.y += speed;
	this.hitbox.x = this.sprite.x;
	this.hitbox.y = this.sprite.y + 2;
	if(this.hitbox.x - this.hitbox.width / 2 < globals.gameX) this.sprite.x = this.hitbox.width / 2 + globals.gameX;
	else if(this.hitbox.x + this.hitbox.width / 2 > globals.gameWidth + globals.gameX) this.sprite.x = globals.gameWidth - this.hitbox.width / 2 + globals.gameX;
	if(this.hitbox.y - this.hitbox.height / 2 < globals.grid) this.sprite.y = this.hitbox.height / 2 - 2 + globals.grid;
	else if(this.hitbox.y + this.hitbox.height / 2 > globals.winHeight - globals.grid) this.sprite.y = globals.winHeight - this.hitbox.height / 2 - 2 - globals.grid;
	this.hitbox.x = this.sprite.x;
	this.hitbox.y = this.sprite.y + 2;
	this.focus.x = this.sprite.x;
	this.focus.y = this.sprite.y;
	if(controls.focus && this.hitbox.alpha != 1){
		this.hitbox.alpha = 1;
		this.focus.alpha = 1;
	} else if(!controls.focus && this.hitbox.alpha == 1){
		this.hitbox.alpha = 0;
		this.focus.alpha = 0;
		this.focusClock = 0;
		this.focus.scale.set(.25)
	}
	if(this.focus.alpha && this.focus.scale.x < 1){
		const mod = 0.125;
		this.focus.scale.x += mod;
		this.focus.scale.y += mod;
	} else if (this.focus.scale > 1) this.focus.scale.set(1);
},

shot(){
	const startShot = () => {
		if(this.shotClock % 6 == 1){
			this.spawnBullets();
			sound.spawn('playerBullet');
		}
		this.didShootClock++;
	};
	controls.shot ? this.shotClock++ : this.shotClock = 0;
	if(this.shotClock) startShot();
},

spawnBullets(){
	const base = Math.PI / 2;
	const mainBullet = (rotation, xMod, yMod, double) => {
		const img = double ? 'double' : 'single';
		const bullet = new PIXI.Sprite.fromImage('img/player/bullet-' + img + '.png', PIXI.SCALE_MODES.NEAREST);
		bullet.anchor.set(.5);
		bullet.x = this.sprite.x + xMod;
		bullet.y = this.sprite.y + yMod - 6;
		bullet.baseX = bullet.x;
		bullet.baseY = bullet.y;
		const bulletMod = this.sprite.height / 4;
		bullet.type = 'playerBullet';
		bullet.alpha = 1;
		bullet.rotation = rotation - Math.PI / 2;
		bullet.velocity = {
			x: Math.cos(rotation) * this.bulletSpeed,
			y: Math.sin(rotation) * this.bulletSpeed
		}
		globals.containers.playerBullets.addChild(bullet);
	};
	const offset = 0.125, xOffset = 12, yOffset = 4;
	mainBullet(base, 0, 0, true);
	if(this.power > 0){
		mainBullet(base - offset, -xOffset - 1, yOffset, false);
		mainBullet(base + offset, xOffset + 1, yOffset, false);
	}
	if(this.power > 1){
		mainBullet(base - offset * 2, -xOffset * 1.5 - 1, yOffset + 6, false);
		mainBullet(base + offset * 2, xOffset * 1.5 + 1, yOffset + 6, false);
	}
	// if(this.power > 2){
	// 	mainBullet(base - offset * 3, -xOffset * 1.5 - 6, yOffset + 14, false);
	// 	mainBullet(base + offset * 3, xOffset * 1.5 + 6, yOffset + 14, false);
	// }
},

die(){
	if(this.invulnerableClock > 0){
		if(!this.removed) this.removed = true;
		const interval = globals.grid;
		if(this.invulnerableClock % interval < interval / 2){
			this.sprite.alpha = 0;
			this.hitbox.alpha = 0;
			this.focus.alpha = 0;
		} else if(!this.sprite.alpha){
			this.sprite.alpha = 1;
			this.hitbox.alpha = 1;
			this.focus.alpha = 1;
		}
		this.invulnerableClock--;
	} else {
		if(!this.sprite.alpha){
			this.sprite.alpha = 1;
			this.hitbox.alpha = 1;
			this.focus.alpha = 1;
		}
		if(this.removed) this.removed = false;
	}
},

update(){
	if(!globals.gameOver){
		if(!globals.paused){
			this.move();
			this.shot();
			this.die();
			if(globals.containers.playerBullets.children.length){
				for(i = 0; i < globals.containers.playerBullets.children.length; i++) this.updateBullet(globals.containers.playerBullets.children[i], i);
			}
		}
	} else{
		if(this.sprite.alpha != 0){
			this.sprite.alpha = 0;
			this.hitbox.alpha = 0;
			this.focus.alpha = 0;
			this.sprite.x = globals.gameWidth / 2;
			this.sprite.y = globals.winHeight * 2;
		}
	}
},

updateBullet(bullet, index){
	bullet.y -= bullet.velocity.y;
	bullet.x -= bullet.velocity.x;
	if(bullet.y < -bullet.height ||
		bullet.x < -bullet.width + globals.gameX ||
		bullet.x > globals.gameWidth + bullet.width + globals.gameX)
		globals.containers.playerBullets.removeChildAt(index);
	collision.placeItem(bullet, index);
},

draw(){
	this.sprite = new PIXI.Sprite.from(sprites.player.center0);
	this.hitbox = new PIXI.Sprite.from(sprites.player.hitbox);
	this.focus = new PIXI.Sprite.from(sprites.player.focus);

	this.spriteInit = {x: globals.gameX + globals.gameWidth / 2, y: globals.gameHeight - globals.grid * 2.75};

	this.sprite.anchor.set(.5);
	this.sprite.x = this.spriteInit.x;
	this.sprite.y = this.spriteInit.y;
	this.sprite.type = 'player';
	this.sprite.zOrder = this.zIndex;

	this.hitbox.anchor.set(.5);
	this.hitbox.zOrder = this.zIndex + 2;
	this.hitbox.alpha = 0;

	this.focus.anchor.set(.5);
	this.focus.zOrder = this.zIndex + 2;
	this.focus.alpha = 0;
	this.focus.scale.set(.25);

	globals.game.stage.addChild(this.sprite);
	globals.game.stage.addChild(this.hitbox);
	globals.game.stage.addChild(this.focus);
},

init(){
	this.draw();
},

wipe(){
	this.shotClock = 0;
	this.didShootClock = 0;
	this.power = 0;
	this.graze = 0;
	this.removed = false;
	this.didShoot = false;
	this.lives = this.livesInit;
}

};