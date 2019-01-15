module.exports = {

started: false,
bg: false,
bottom: false,
top: false,
fade: false,
overlay: false,
speed: 1.5,
speedOverlay: 2.5,
bossBg: false,
bossTexture00: false,
bossTexture01: false,
bossTexture02: false,
bossClock: 0,
bossCurveClock: 5,

draw(){

	this.bottom = new PIXI.projection.Container2d();
	this.bottom.x = globals.gameX;
	this.bottom.y = 0;
	this.bottom.zOrder = 1;

	this.top = new PIXI.projection.Container2d();
	this.top.x = globals.gameX;
	this.top.y = 0;
	this.top.zOrder = 3;

	this.bg = new PIXI.projection.TilingSprite2d(new PIXI.Texture.fromImage('img/bg/bottom.png', false, PIXI.SCALE_MODES.NEAREST));
	this.bg.width = globals.gameWidth
	this.bg.height = globals.gameHeight;
	// this.bg.tilePosition.x = 8;

	this.fade = new PIXI.Sprite.fromImage('img/bg/fade.png');
	this.fade.x = globals.gameX;
	this.fade.y = 0;
	this.fade.zOrder = 2;

	this.overlay = new PIXI.projection.TilingSprite2d(new PIXI.Texture.fromImage('img/bg/overlay.png', false, PIXI.SCALE_MODES.NEAREST));
	this.overlay.width = globals.gameWidth;
	this.overlay.height = globals.gameHeight;
	// this.overlay.tilePosition.x = globals.grid * 3.75;

	this.bottom.addChild(this.bg);
	this.top.addChild(this.overlay);
	globals.game.stage.addChild(this.bottom);
	globals.game.stage.addChild(this.fade);
	globals.game.stage.addChild(this.top);

	const pos = this.bottom.toLocal({
		x: globals.gameWidth / 2 + globals.gameX,
		y: -globals.gameHeight
	}, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
	pos.y = -pos.y * .8;
	pos.x = -pos.x;
	this.bottom.proj.setAxisY(pos, -1);
	this.top.proj.setAxisY(pos, -1);

},

update(){
	const currentTime = Math.floor(chrome.elapsed / 60), limit = chrome.timeLimit - 45;
	if(currentTime >= limit){
		if(!this.bossBg){
			this.bossBg = new PIXI.Sprite.fromImage('img/bg/boss-00.png');
			this.bossTexture00 = PIXI.Texture.fromImage('img/bg/boss-00.png');
			this.bossTexture01 = PIXI.Texture.fromImage('img/bg/boss-01.png');
			this.bossTexture02 = PIXI.Texture.fromImage('img/bg/boss.png');
			this.bossBg.x = globals.gameX;
			this.bossBg.y = 0;
			this.bossBg.zOrder = 4;
			globals.game.stage.addChild(this.bossBg);
		}
		const interval = 20;
		if(this.bossClock == interval) this.bossBg.alpha = 0;
		else if(this.bossClock == interval * 2) this.bossBg.alpha = 1;
		else if(this.bossClock == interval * 2.5) this.bossBg.alpha = 0;
		else if(this.bossClock == interval * 3) this.bossBg.alpha = 1;
		else if(this.bossClock == interval * 3.25) this.bossBg.alpha = 0;
		else if(this.bossClock == interval * 3.5) this.bossBg.alpha = 1;
		else if(this.bossClock == interval * 3.75) this.bossBg.alpha = 0;
		else if(this.bossClock == interval * 4){
			this.bossBg.texture = this.bossTexture02;
			this.bossBg.alpha = 1;
		}
		this.bossClock++;
	}
	this.bg.tilePosition.y += this.speed;
	this.overlay.tilePosition.y += this.speedOverlay;
},

reset(){
	globals.game.stage.removeChild(this.bottom);
	globals.game.stage.removeChild(this.top);
	globals.game.stage.removeChild(this.fade);
	this.draw();
},

init(){
	const thisObj = this;
	this.draw();
	if(!this.started){
		this.started = true;
		globals.game.ticker.add(() => {
			if(!globals.paused) thisObj.update();
		});
	}
}

};