module.exports = {

started: false,
bg: false,
bottom: false,
top: false,
fade: false,
overlay: false,
speed: 1.5,
speedOverlay: 2.5,
didTwoUpdate: false,

draw(){

	this.bottom = new PIXI.projection.Container2d();
	this.bottom.x = globals.gameX;
	this.bottom.y = globals.grid;
	this.bottom.width = globals.gameWidth;
	this.bottom.height = globals.gameHeight;

	this.top = new PIXI.projection.Container2d();
	this.top.x = globals.gameX;
	this.top.y = globals.grid;
	this.top.width = globals.gameWidth;
	this.top.height = globals.gameHeight;

	this.bg = new PIXI.projection.TilingSprite2d(sprites.background.bottom);
	this.bg.width = globals.gameWidth
	this.bg.height = globals.gameHeight;

	this.fade = new PIXI.Sprite.from(sprites.background.fade);
	this.fade.x = globals.gameX;
	this.fade.y = globals.grid;

	this.overlay = new PIXI.projection.TilingSprite2d(sprites.background.overlay);
	this.overlay.width = globals.gameWidth;
	this.overlay.height = globals.gameHeight;

	this.bottom.addChild(this.bg);
	this.top.addChild(this.overlay);
	globals.containers.background.addChild(this.bottom);
	globals.containers.background.addChild(this.fade);
	globals.containers.background.addChild(this.top);

	const pos = this.bottom.toLocal({
		x: globals.gameWidth / 2 + globals.gameX,
		y: -globals.gameHeight
	}, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
	pos.y = -pos.y * .8;
	pos.x = -pos.x;
	this.bottom.proj.setAxisY(pos, -1);
	this.top.proj.setAxisY(pos, -1);
},

changeTwo(){
	this.didTwoUpdate = true;
	this.bg.texture = sprites.background.bottom2;
	this.fade.texture = sprites.background.fade2;
	this.overlay.texture = sprites.background.overlay2;
},

spawnTree(){
	const tree = new PIXI.projection.Sprite2d(Math.round(Math.random()) ? sprites.background.tree : sprites.background.tree2);
	tree.factor = 1;
	tree.proj.affine = PIXI.projection.AFFINE.AXIS_X;
	tree.anchor.set(.5);
	tree.x = Math.floor(Math.random() * globals.gameWidth);
	tree.y = 0;
	tree.tree = true;
	this.bottom.addChild(tree);
},

updateTrees(){
	if(this.bottom.children.length && !globals.paused){
		for(i = 0; i < this.bottom.children.length; i++){
			if(this.bottom.children[i].tree){
				this.bottom.children[i].y += this.speed;
				if(this.bottom.children[i].y >= globals.winHeight) this.bottom.removeChildAt(i)
			}
		}
	}
},

update(){
	if(globals.isFiveMinute && !this.didTwoUpdate) this.changeTwo();
	const currentTime = Math.floor(chrome.elapsed / 60), limit = chrome.timeLimit - 45;
	this.bg.tilePosition.y += this.speed;
	this.overlay.tilePosition.y += this.speedOverlay;
	if(globals.gameClock % 15 == 0 && !globals.isFiveMinute) this.spawnTree();
	this.updateTrees();
},

init(){
	const thisObj = this;
	this.draw();
	if(!this.started){
		this.started = true;
		globals.game.ticker.add(() => {
			if(!globals.paused && !globals.starting) thisObj.update();
		});
	}
},

wipe(){
	this.bg = false;
	this.bottom = false;
	this.top = false;
	this.fade = false;
	this.overlay = false;
	this.speed = 1.5;
	this.speedOverlay = 2.5;
}

};



	// if(currentTime >= limit && !globals.gameOver){
	// 	if(!this.bossBg){
	// 		this.bossBg = new PIXI.Sprite.fromImage('img/bg/boss-00.png');
	// 		this.bossTexture00 = PIXI.Texture.fromImage('img/bg/boss-00.png');
	// 		this.bossTexture01 = PIXI.Texture.fromImage('img/bg/boss-01.png');
	// 		this.bossTexture02 = PIXI.Texture.fromImage('img/bg/boss.png');
	// 		this.bossBg.x = globals.gameX;
	// 		this.bossBg.y = globals.grid;
	// 		globals.game.stage.addChild(this.bossBg);
	// 	}
		// const interval = 20;
		// if(this.bossClock == interval) this.bossBg.alpha = 0;
		// else if(this.bossClock == interval * 2) this.bossBg.alpha = 1;
		// else if(this.bossClock == interval * 2.5) this.bossBg.alpha = 0;
		// else if(this.bossClock == interval * 3) this.bossBg.alpha = 1;
		// else if(this.bossClock == interval * 3.25) this.bossBg.alpha = 0;
		// else if(this.bossClock == interval * 3.5) this.bossBg.alpha = 1;
		// else if(this.bossClock == interval * 3.75) this.bossBg.alpha = 0;
		// else if(this.bossClock == interval * 4){
		// 	this.bossBg.texture = this.bossTexture02;
		// 	this.bossBg.alpha = 1;
		// }
		// this.bossClock++;
	// }