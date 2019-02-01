module.exports = {
	load(){

		this.frame = PIXI.Texture.fromImage('img/frame.png');
		this.pausedOverlay = PIXI.Texture.fromImage('img/pausedoverlay.png');

		this.player = {
			center0: PIXI.Texture.fromImage('img/player-new/center0.png'),
			center1: PIXI.Texture.fromImage('img/player-new/center0.png'),
			center2: PIXI.Texture.fromImage('img/player-new/center0.png'),
			left0: PIXI.Texture.fromImage('img/player-new/center0.png'),
			left1: PIXI.Texture.fromImage('img/player-new/center0.png'),
			right0: PIXI.Texture.fromImage('img/player-new/center0.png'),
			right1: PIXI.Texture.fromImage('img/player-new/center0.png'),
			hitbox: PIXI.Texture.fromImage('img/player/hitbox.png'),
			focus: PIXI.Texture.fromImage('img/player/focus.png', false, PIXI.SCALE_MODES.NEAREST),
			knives: PIXI.Texture.fromImage('img/player-new/knives.png', false, PIXI.SCALE_MODES.NEAREST)
		};

		this.enemies = {
			fairyBlue: {
				center0: PIXI.Texture.fromImage('img/enemies/fairy-blue/center0.png'),
				center1: PIXI.Texture.fromImage('img/enemies/fairy-blue/center1.png'),
				center2: PIXI.Texture.fromImage('img/enemies/fairy-blue/center2.png'),
				left0: PIXI.Texture.fromImage('img/enemies/fairy-blue/left0.png'),
				left1: PIXI.Texture.fromImage('img/enemies/fairy-blue/left1.png'),
				left2: PIXI.Texture.fromImage('img/enemies/fairy-blue/left2.png'),
				right0: PIXI.Texture.fromImage('img/enemies/fairy-blue/right0.png'),
				right1: PIXI.Texture.fromImage('img/enemies/fairy-blue/right1.png'),
				right2: PIXI.Texture.fromImage('img/enemies/fairy-blue/right2.png')
			},
			fairyRed: {
				center0: PIXI.Texture.fromImage('img/enemies/fairy-red/center0.png'),
				center1: PIXI.Texture.fromImage('img/enemies/fairy-red/center1.png'),
				center2: PIXI.Texture.fromImage('img/enemies/fairy-red/center2.png'),
				left0: PIXI.Texture.fromImage('img/enemies/fairy-red/left0.png'),
				left1: PIXI.Texture.fromImage('img/enemies/fairy-red/left1.png'),
				left2: PIXI.Texture.fromImage('img/enemies/fairy-red/left2.png'),
				right0: PIXI.Texture.fromImage('img/enemies/fairy-red/right0.png'),
				right1: PIXI.Texture.fromImage('img/enemies/fairy-red/right1.png'),
				right2: PIXI.Texture.fromImage('img/enemies/fairy-red/right2.png')
			},
			fairyGreen: {
				center0: PIXI.Texture.fromImage('img/enemies/fairy-green/center0.png'),
				center1: PIXI.Texture.fromImage('img/enemies/fairy-green/center1.png'),
				center2: PIXI.Texture.fromImage('img/enemies/fairy-green/center2.png'),
				left0: PIXI.Texture.fromImage('img/enemies/fairy-green/left0.png'),
				left1: PIXI.Texture.fromImage('img/enemies/fairy-green/left1.png'),
				left2: PIXI.Texture.fromImage('img/enemies/fairy-green/left2.png'),
				right0: PIXI.Texture.fromImage('img/enemies/fairy-green/right0.png'),
				right1: PIXI.Texture.fromImage('img/enemies/fairy-green/right1.png'),
				right2: PIXI.Texture.fromImage('img/enemies/fairy-green/right2.png')
			},
			fairyYellow: {
				center0: PIXI.Texture.fromImage('img/enemies/fairy-yellow/center0.png'),
				center1: PIXI.Texture.fromImage('img/enemies/fairy-yellow/center1.png'),
				center2: PIXI.Texture.fromImage('img/enemies/fairy-yellow/center2.png'),
				left0: PIXI.Texture.fromImage('img/enemies/fairy-yellow/left0.png'),
				left1: PIXI.Texture.fromImage('img/enemies/fairy-yellow/left1.png'),
				left2: PIXI.Texture.fromImage('img/enemies/fairy-yellow/left2.png'),
				right0: PIXI.Texture.fromImage('img/enemies/fairy-yellow/right0.png'),
				right1: PIXI.Texture.fromImage('img/enemies/fairy-yellow/right1.png'),
				right2: PIXI.Texture.fromImage('img/enemies/fairy-yellow/right2.png')
			},
			fairyBig: {
				center0: PIXI.Texture.fromImage('img/enemies/fairy-big/center0.png'),
				center1: PIXI.Texture.fromImage('img/enemies/fairy-big/center1.png'),
				center2: PIXI.Texture.fromImage('img/enemies/fairy-big/center2.png')
			}
		};

		this.background = {
			bottom: PIXI.Texture.fromImage('img/bg/bottom.png', false, PIXI.SCALE_MODES.NEAREST),
			bottom2: PIXI.Texture.fromImage('img/bg/bottom2.png', false, PIXI.SCALE_MODES.NEAREST),
			fade: PIXI.Texture.fromImage('img/bg/fade.png'),
			fade2: PIXI.Texture.fromImage('img/bg/fade2.png'),
			overlay: PIXI.Texture.fromImage('img/bg/overlay.png', false, PIXI.SCALE_MODES.NEAREST),
			overlay2: PIXI.Texture.fromImage('img/bg/overlay2.png', false, PIXI.SCALE_MODES.NEAREST),
			tree: PIXI.Texture.fromImage('img/bg/tree.png'),
			tree2: PIXI.Texture.fromImage('img/bg/tree2.png')
		};

		this.bossBar = PIXI.Texture.fromImage('img/boss/bar.png');

		this.explosion = {
			red: [
				PIXI.Texture.fromImage('img/explosions/explosion-red0.png', false, PIXI.SCALE_MODES.NEAREST),
				PIXI.Texture.fromImage('img/explosions/explosion-red1.png', false, PIXI.SCALE_MODES.NEAREST),
				PIXI.Texture.fromImage('img/explosions/explosion-red2.png', false, PIXI.SCALE_MODES.NEAREST),
				PIXI.Texture.fromImage('img/explosions/explosion-red3.png', false, PIXI.SCALE_MODES.NEAREST),
				PIXI.Texture.fromImage('img/explosions/explosion-red4.png', false, PIXI.SCALE_MODES.NEAREST)
			],
			blue: [
				PIXI.Texture.fromImage('img/explosions/explosion-blue0.png', false, PIXI.SCALE_MODES.NEAREST),
				PIXI.Texture.fromImage('img/explosions/explosion-blue1.png', false, PIXI.SCALE_MODES.NEAREST),
				PIXI.Texture.fromImage('img/explosions/explosion-blue2.png', false, PIXI.SCALE_MODES.NEAREST),
				PIXI.Texture.fromImage('img/explosions/explosion-blue3.png', false, PIXI.SCALE_MODES.NEAREST),
				PIXI.Texture.fromImage('img/explosions/explosion-blue4.png', false, PIXI.SCALE_MODES.NEAREST)
			]
		};

		this.bullets = {
			'arrow-blue': PIXI.Texture.fromImage('img/bullets/arrow-blue.png', false, PIXI.SCALE_MODES.NEAREST),
			'arrow-red': PIXI.Texture.fromImage('img/bullets/arrow-red.png', false, PIXI.SCALE_MODES.NEAREST),
			'big-blue': PIXI.Texture.fromImage('img/bullets/big-blue.png', false, PIXI.SCALE_MODES.NEAREST),
			'big-red': PIXI.Texture.fromImage('img/bullets/big-red.png', false, PIXI.SCALE_MODES.NEAREST),
			'bullet-blue': PIXI.Texture.fromImage('img/bullets/bullet-blue.png', false, PIXI.SCALE_MODES.NEAREST),
			'bullet-red': PIXI.Texture.fromImage('img/bullets/bullet-red.png', false, PIXI.SCALE_MODES.NEAREST),
			'ring-blue': PIXI.Texture.fromImage('img/bullets/ring-blue.png', false, PIXI.SCALE_MODES.NEAREST),
			'ring-red': PIXI.Texture.fromImage('img/bullets/ring-red.png', false, PIXI.SCALE_MODES.NEAREST)
		};

	}
}