class GPasscode extends Game {
	constructor(name) { super(name);  }
	clear() { clearTimeout(this.TO);clearTimeCD(); }

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
	trialPrompt(){
		//console.log('this is trial',G.trialNumber);
		G.timeout *= 2;
		doOtherStuff();
		//every time I come here, the answer was actually correct!
	}
	eval(x){
		CountdownTimer.cancel();
		let isCorrect = super.eval(x);
		//return the opposite, but no feedback!
		if (isCorrect) return undefined; else return false;

	}
}






