module.exports = {

	muted: false,
	volume: 1,
	bgmVolume: .25,

	list: {
		bomb: new Howl({src:['sfx/LASER.wav']}),
		damage: new Howl({src: ['sfx/playerbullet.wav']}),
		graze: new Howl({src: ['sfx/graze.wav']}),
		explosion: new Howl({src: ['sfx/explosion.wav']}),

		bulletOne: new Howl({src: ['sfx/bullet1.wav']}),
		bulletTwo: new Howl({src: ['sfx/bullet2.wav']}),
		bulletThree: new Howl({src: ['sfx/bullet3.wav']}),
		title: new Howl({src: ['bgm/title.ogg'], loop: true}),
		level: new Howl({src: ['bgm/level.ogg']}),
		boss: new Howl({src: ['bgm/boss.ogg']}),
	},

	spawn(name){
		if(!this.muted){
			if(this.list[name].playing()) this.list[name].seek(0)
			else {
				let volume = this.volume;
				if(name.indexOf('bullet') > -1) volume = 0.025
				if(name.indexOf('graze') > -1) volume = 0.05
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