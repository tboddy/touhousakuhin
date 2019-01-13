module.exports = {

type: 'marisa',

zIndex: 20,
speed: 5,
shotClock: 0,
didShootClock: 0,
skewDiff: .1,
lives: 1,
bombsInit: 2,
bombs: 2,
power: 0,
graze: 0,
invulnerableClock: 0,
removed: false,
bombClock: 0,
bombY: globals.gameHeight,
bulletSpeed: 35,
didShoot: false,

sprite: false,
hitbox: new PIXI.Sprite.fromImage('img/player/hitbox.png'),
sideLeft: false,
sideRight: false,

textureCenter: false,
textureLeft: false,
textureRight: false,

move(){
	let speed = controls.focus ? this.speed / 2 : this.speed;
	const currentImage = this.sprite.texture.baseTexture.imageUrl;
	if(controls.moving.left){
		this.sprite.x -= speed;
		if(currentImage.indexOf('left') == -1) this.sprite.texture = this.textureLeft;
	} else if(controls.moving.right){
		this.sprite.x += speed;
		if(currentImage.indexOf('right') == -1) this.sprite.texture = this.textureRight;
	} else if(!controls.moving.left && !controls.moving.right){
		this.sprite.texture = this.textureCenter;
	}
	if(controls.moving.up) this.sprite.y -= speed;
	else if(controls.moving.down) this.sprite.y += speed;
	this.hitbox.x = this.sprite.x;
	this.hitbox.y = this.sprite.y + 2;
	if(this.hitbox.x - this.hitbox.width / 2 < globals.gameX){
		this.sprite.x = this.hitbox.width / 2 + globals.gameX;
		this.hitbox.x = this.sprite.x;
	} else if(this.hitbox.x + this.hitbox.width / 2 > globals.gameWidth + globals.gameX){
		this.sprite.x = globals.gameWidth - this.hitbox.width / 2 + globals.gameX;
		this.hitbox.x = this.sprite.x;
	}
	if(this.hitbox.y - this.hitbox.height / 2 < 0){
		this.sprite.y = this.hitbox.height / 2 - 2;
		this.hitbox.y = this.sprite.y + 2;
	} else if(this.hitbox.y + this.hitbox.height / 2 > globals.gameHeight){
		this.sprite.y = globals.gameHeight - this.hitbox.height / 2 - 2;
		this.hitbox.y = this.sprite.y + 2;
	}
	if(controls.focus && this.hitbox.alpha != 1) this.hitbox.alpha = 1;
	else if(!controls.focus && this.hitbox.alpha == 1) this.hitbox.alpha = 0;
	const doSide = opposite => {
		let mod = .75;
		const pos = opposite ? this.sideLeft : this.sideRight;
		pos.rotation += opposite ? Math.PI / 90 : -(Math.PI / 90)
		if(pos.flipped) mod *= -1;
		if(mod > 0) pos.zOrder = this.zIndex + (opposite ? 1 : -1); 
		else if(mod < 0) pos.zOrder = this.zIndex + (opposite ? -1 : 1); 
		pos.offset += opposite ? mod : -mod;
		pos.x = this.sprite.x - pos.offset;
		pos.y = this.sprite.y + 4;
		if(opposite){
			if(pos.x < this.sprite.x - pos.offsetNeg && !pos.flipped) pos.flipped = true;
			else if(pos.x > this.sprite.x + pos.offsetNeg) pos.flipped = false;
		} else {
			if(pos.x > this.sprite.x + pos.offsetNeg && !pos.flipped) pos.flipped = true;
			else if(pos.x < this.sprite.x - pos.offsetNeg) pos.flipped = false;
		}
	};
	// doSide();
	// doSide(true);
},

shot(){
	const interval = 30, check = () => {
		if(controls.shot){
			if(this.shotClock % interval == 0){
				this.didShootClock = 0;
				this.didShoot = true;
			}
			this.shotClock++;
		} else if(this.shotClock) this.shotClock = 0;
	}, startShot = () => {
		if(this.didShootClock < interval / 3 * 2 && this.didShootClock % 4 == 0){
			this.spawnBullets();
			sound.spawn('playerBullet');
		}
		if(this.didShootClock >= interval){
			this.didShootClock = 0;
			this.didShoot = false;
		}
		this.didShootClock++;
	};
	check();
	if(this.didShoot) startShot();
},

spawnBullets(){
	const base = Math.PI / 2;
	const mainBullet = (rotation, xMod, yMod, zOrder, double, top) => {
		const img = double ? 'double' : 'single';
		const bullet = new PIXI.Sprite.fromImage('img/player/bullet-' + img + '.png', PIXI.SCALE_MODES.NEAREST);
		bullet.anchor.set(.5);
		bullet.x = this.sprite.x + (globals.grid * 1.5 + 2) * xMod;
		bullet.y = this.sprite.y;
		bullet.baseX = bullet.x;
		bullet.baseY = bullet.y;
		const bulletMod = this.sprite.height / 4;
		// bullet.y += top ? -bulletMod : bulletMod;
		if(yMod) bullet.y += 16
		bullet.type = 'playerBullet';
		bullet.alpha = 1;
		bullet.rotation = rotation - Math.PI / 2;
		bullet.zOrder = zOrder;
		bullet.velocity = {
			x: Math.cos(rotation) * this.bulletSpeed,
			y: Math.sin(rotation) * this.bulletSpeed
		}
		globals.game.stage.addChild(bullet);
	};
	const offset = Math.PI / 12.5;
	if(this.power == 1 || this.power == 2) mainBullet(-base, 0, false, this.zIndex - 10);
	if(this.power < 2 || this.power == 3) mainBullet(base, 0, false, this.zIndex - 10, true, true);
	if(this.power >= 2){
		mainBullet(base - Math.PI / 8, 0, false, this.zIndex - 10, false, true);
		mainBullet(base + Math.PI / 8, 0, false, this.zIndex - 10, false, true);
	}
	if(this.power == 2) mainBullet(base, 0, false, this.zIndex - 10, false, true);
	else if(this.power == 3){
		mainBullet(-base - Math.PI / 8, 0, false, this.zIndex - 10, false, true);
		mainBullet(-base + Math.PI / 8, 0, false, this.zIndex - 10, false, true);
	}
},

bomb(){
	if(controls.bomb && !this.bombClock && player.bombs){
		this.bombClock = 90;
		player.bombs--;
		sound.spawn('bomb')
	}
	if(this.bombClock){
		globals.removeBullets = true;
		globals.removeBulletsTime = 30;
		if(this.bombClock % 10 == 0){
			const offset = globals.grid * 3;
			for(i = 0; i < 6; i++){
				explosion.spawn({x: i * offset, y: this.bombY - offset}, false, 200, true);
				explosion.spawn({x: i * offset, y: this.bombY}, false, 200, true);
				explosion.spawn({x: i * offset + (offset / 2), y: this.bombY + offset}, false, 200, true);
			}
			this.bombY -= offset;
		}
		this.bombClock--;
		if(!this.bombClock){
			this.bombY = globals.gameHeight;
			globals.removeBullets = false;
			globals.removeBulletsTime = 0;
		}
	}
},

die(){
	if(this.invulnerableClock > 0){
		if(!this.removed){
			this.removed = true;
			this.sprite.x = globals.gameWidth / 2;
			this.sprite.y = globals.gameHeight - this.sprite.height * .75;
			this.hitbox.x = this.sprite.x;
			this.hitbox.y = this.sprite.y + 2;
			this.power -= 1;
			this.bombs = this.bombsInit
			if(this.power < 0) this.power = 0;
		}
		const interval = globals.grid;
		if(this.invulnerableClock % interval < interval / 2){
			this.sprite.alpha = 0;
			this.hitbox.alpha = 0;
			this.sideLeft.alpha = 0;
			this.sideRight.alpha = 0;
		} else if(!this.sprite.alpha){
			this.sprite.alpha = 1;
			this.hitbox.alpha = 1;
			this.sideLeft.alpha = 1;
			this.sideRight.alpha = 1;
		}
		this.invulnerableClock--;
	} else {
		if(!this.sprite.alpha){
			this.sprite.alpha = 1;
			this.hitbox.alpha = 1;
			this.sideLeft.alpha = 1;
			this.sideRight.alpha = 1;
		}
		if(this.removed) this.removed = false;
	}
},

update(player, index){
	if(!globals.gameOver){
		if(!globals.paused){
			this.move();
			this.shot();
			this.bomb();
			this.die();
		}
	} else{
		if(player.alpha != 0){
			player.alpha = 0;
			this.hitbox.alpha = 0;
			player.x = globals.gameWidth / 2;
			player.y = globals.gameHeight * 2;
			this.sideLeft.alpha = 0;
			this.sideRight.alpha = 0;
		}
	}
},

updateBullet(bullet, index){
	bullet.baseY -= bullet.velocity.y;
	bullet.baseX -= bullet.velocity.x;
	bullet.y = bullet.baseY;
	bullet.x = bullet.baseX;
	if(bullet.baseY < -bullet.height ||
		bullet.baseX < -bullet.width + globals.gameX ||
		bullet.baseX > globals.gameWidth + bullet.width + globals.gameX)
		globals.game.stage.removeChildAt(index);
},

init(){
	this.sprite = new PIXI.Sprite.fromImage('img/player/center.png');
	this.textureCenter = PIXI.Texture.fromImage('img/player/center.png');
	this.textureLeft = PIXI.Texture.fromImage('img/player/left.png');
	this.textureRight = PIXI.Texture.fromImage('img/player/right.png');

	this.sprite.anchor.set(.5);
	this.sprite.x = globals.gameWidth / 2 - this.hitbox.width / 2 + globals.gameX;
	this.sprite.y = globals.gameHeight - 30 - this.hitbox.height / 2;
	this.sprite.type = 'player';
	this.sprite.zOrder = this.zIndex;

	this.hitbox.anchor.set(.5);
	this.hitbox.x = this.sprite.x;
	this.hitbox.y = this.sprite.y + 2;
	this.hitbox.type = 'playerHitbox';
	this.hitbox.zOrder = this.zIndex + 2;
	this.hitbox.alpha = 0;

	const sideOffset = globals.grid * 1.5;

	this.sideLeft = new PIXI.Sprite.fromImage('img/player/side.png', false, PIXI.SCALE_MODES.NEAREST);
	this.sideRight = new PIXI.Sprite.fromImage('img/player/side.png', false, PIXI.SCALE_MODES.NEAREST);

	this.sideLeft.anchor.set(.5);
	this.sideLeft.offset = -sideOffset;
	this.sideLeft.offsetNeg = sideOffset;
	this.sideLeft.type = 'playerSide';
	this.sideLeft.zOrder = this.zIndex;

	this.sideRight.anchor.set(.5);
	this.sideRight.offset = sideOffset;
	this.sideRight.offsetNeg = sideOffset;
	this.sideRight.type = 'playerSide';
	this.sideRight.zOrder = this.zIndex;

	globals.game.stage.addChild(this.sprite);
	globals.game.stage.addChild(this.hitbox);
	// globals.game.stage.addChild(this.sideLeft);
	// globals.game.stage.addChild(this.sideRight);
}

};