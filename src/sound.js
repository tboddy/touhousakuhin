module.exports = {

	muted: true,
	volume: .1,
	bgmVolume: 1,

	list: {
		bomb: new Howl({src:['sfx/LASER.wav']}),
		damage: new Howl({src: ['sfx/playerbullet.wav']}),
		graze: new Howl({src: ['sfx/graze.wav']}),
		explosion: new Howl({src: ['sfx/explosion.wav']}),

		bulletOne: new Howl({src: ['sfx/bullet1.wav']}),
		bulletTwo: new Howl({src: ['sfx/bullet2.wav']}),
		bulletThree: new Howl({src: ['sfx/bullet3.wav']}),
		// bgmOne: new Howl({src: ['bgm/sacredlot.ogg']}),
		// bgmTwo: new Howl({src: ['bgm/eternalshrinemaiden.ogg']}),
		// bgmThree: new Howl({src: ['bgm/tillyoudie.ogg']})
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
			if(this.list.bgmOne.playing()) this.list.bgmOne.stop(); 
			if(this.list.bgmTwo.playing()) this.list.bgmTwo.stop(); 
			if(this.list.bgmThree.playing()) this.list.bgmThree.stop();
			this.list[name].volume(this.bgmVolume);
			this.list[name].play();
		}
	}

};