module.exports = {

	muted: false,
	volume: .375,
	bgmVolume: .8,
	// bgmVolume: 0,

	list: {

		changeSelect: new Howl({src: ['sfx/changeselect.wav']}),
		startGame: new Howl({src: ['sfx/startgame.wav']}),

		graze: new Howl({src: ['sfx/graze.wav']}),
		explosion: new Howl({src: ['sfx/explosion.wav']}),

		bulletOne: new Howl({src: ['sfx/bullet1.wav']}),
		bulletTwo: new Howl({src: ['sfx/bullet2.wav']}),
		laser: new Howl({src: ['sfx/laser.wav']}),

		playerBullet: new Howl({src: ['sfx/playerbullet.wav']}),
		powerUp: new Howl({src: ['sfx/powerup.wav']}),
		bonus: new Howl({src: ['sfx/bonus.wav']}),

		timeOut: new Howl({src: ['sfx/timeout.wav']}),
		gameOver: new Howl({src: ['sfx/gameover.wav']}),

		title: new Howl({src: ['bgm/title.ogg'], loop: true}),
		level: new Howl({src: ['bgm/level.ogg'], loop: true}),
		boss: new Howl({src: ['bgm/boss.ogg'], loop: true}),
		boss2: new Howl({src: ['bgm/boss2.ogg'], loop: true})

	},


	spawn(name){
		if(!this.muted){
			if(this.list[name].playing()) this.list[name].seek(0)
			else {
				let volume = this.volume;
				if(name.indexOf('playerBullet') > -1) volume *= .5;
				else if(name.indexOf('startGame') > -1) volume *= 1.5;
				else if(name.indexOf('changeSelect') > -1) volume *= 1.5;
				else if(name.indexOf('timeOut') > -1) volume *= 1.25;
				else if(name.indexOf('gameOver') > -1) volume *= 1.25;
				else if(name.indexOf('laser') > -1) volume *= 1.25;
				else if(name.indexOf('graze') > -1) volume *= .2;
				this.list[name].volume(volume);
				this.list[name].play();
			}
		}
	},

	playBgm(name){
		if(!this.muted){
			this.stopBgm();
			this.list[name].volume(this.bgmVolume);
			this.list[name].play();
		}
	},

	stopBgm(){
		if(this.list.title.playing()) this.list.title.stop(); 
		if(this.list.level.playing()) this.list.level.stop(); 
		if(this.list.boss.playing()) this.list.boss.stop(); 
	}

};