class GPasscode extends Game {
	constructor(name) { super(name); this.needNewPasscode = true; }
	clear() { clearTimeout(this.TO); clearTimeCD(); }
	startGame(){
		Settings.incrementLevelOnPositiveStreak = Settings.samplesPerGame;
		Settings.decrementLevelOnNegativeStreak = Settings.samplesPerGame;

	}
	startLevel() { this.needNewPasscode = true; }
	prompt() {
		G.trials = 1;
		if (this.needNewPasscode) {
			G.timeout = 1000;
			this.needNewPasscode = false;
			let keys = getRandomKeys(G.passcodeLength);
			showPicturesSpeechTherapyGames(null,
				{ border: '3px solid #ffffff80' },
				{ repeat: G.numRepeat, sameBackground: true }, keys);

			//console.log(Pictures)
			Goal = Pictures[0];
			//console.log('===>Goal',Goal);

			this.wort = (Settings.language == 'E' ? 'the passcode' : 'das Codewort');
			showInstruction(Goal.label, this.wort + (Settings.language == 'E' ? ' is' : ' ist'), dTitle, true);

			TOMain = setTimeout(anim1, 300, Goal, 500, showGotItButton);
		}else{
			G.timeout *= 2;
			doOtherStuff();
		}

	}
	eval(x) {
		CountdownTimer.cancel();
		// return super.eval(x);
		let isCorrect = super.eval(x);
		if (!isCorrect) this.needNewPasscode=true;
		return isCorrect;
		// //return the opposite, but no feedback!
		// if (isCorrect) return undefined; else return false;

	}
}

class GPasscode_v1 extends Game {
	constructor(name) { super(name); }
	clear() { clearTimeout(this.TO); clearTimeCD(); }

	startGame() {

	}
	prompt() {
		G.trials = 1;
		G.timeout = 1000;
		let keys = getRandomKeys(G.passcodeLength);
		//console.log('keys',keys)
		showPicturesSpeechTherapyGames(null,
			{ border: '3px solid #ffffff80' },
			{ repeat: G.numRepeat, sameBackground: true }, keys);

		//console.log(Pictures)
		Goal = Pictures[0];
		//console.log('===>Goal',Goal);

		this.wort = (Settings.language == 'E' ? 'the passcode' : 'das Codewort');
		showInstruction(Goal.label, this.wort + (Settings.language == 'E' ? ' is' : ' ist'), dTitle, true);

		TOMain = setTimeout(anim1, 300, Goal, 500, showGotItButton);

	}
	trialPrompt() {
		//console.log('this is trial',G.trialNumber);

		DELAY = Settings.spokenFeedback ? 1500 : 300; G.successFunc(); //hier brauch ich daspos feedback
		setTimeout(() => {
			removeMarkers(); G.timeout *= 2;
			doOtherStuff();
		}, DELAY);


		//every time I come here, the answer was actually correct!
	}
	eval(x) {
		CountdownTimer.cancel();
		let isCorrect = super.eval(x);
		//return the opposite, but no feedback!
		if (isCorrect) return undefined; else return false;

	}
}





