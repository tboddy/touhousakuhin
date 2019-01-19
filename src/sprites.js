module.exports = {
	load(){

		this.frame = PIXI.Texture.fromImage('img/frame.png');
		this.pausedOverlay = PIXI.Texture.fromImage('img/pausedoverlay.png');

		this.playerCenter0 = PIXI.Texture.fromImage('img/player/center00.png');
		this.playerCenter1 = PIXI.Texture.fromImage('img/player/center01.png');
		this.playerCenter2 = PIXI.Texture.fromImage('img/player/center02.png');
		this.playerLeft0 = PIXI.Texture.fromImage('img/player/left00.png');
		this.playerLeft1 = PIXI.Texture.fromImage('img/player/left01.png');
		this.playerRight0 = PIXI.Texture.fromImage('img/player/right00.png');
		this.playerRight1 = PIXI.Texture.fromImage('img/player/right01.png');

		this.hitbox = PIXI.Texture.fromImage('img/player/hitbox.png');
		this.focus = PIXI.Texture.fromImage('img/player/focus.png');
		
	}
}