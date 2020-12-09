class Game {
	constructor() {
	}
	clear() { clearTimeout(this.TO); console.log(getFunctionCallerName()); }
	startGame() { console.log(getFunctionCallerName()); }
	startLevel() { console.log(getFunctionCallerName()); }
	startRound() { console.log(getFunctionCallerName()); }
	prompt() {
		console.log(getFunctionCallerName());
		showPictures(evaluate);
		setGoal();
		showInstruction(Goal.label, 'click', dTitle, true);
		activateUi();
	}
	trialPrompt() {
		console.log(getFunctionCallerName());
		Speech.say(Settings.language == 'D' ? 'nochmal!' : 'try again!');
		shortHintPic();
		return 10;
	}
	activate() { console.log(getFunctionCallerName()); }
	interact() { console.log(getFunctionCallerName()); }
	eval(ev) {
		console.log(getFunctionCallerName());
		let id = evToClosestId(ev);
		ev.cancelBubble = true;

		let i = firstNumber(id);
		let item = Pictures[i];
		Selected = { pic: item, feedbackUI: item.div, sz: getBounds(item.div).height };

		Selected.reqAnswer = Goal.label;
		Selected.answer = item.label;

		if (item.label == Goal.label) { return true; } else { return false; }
	}
	recycle() { console.log(getFunctionCallerName()); }
}

class GTouchPic extends Game {
	constructor() {
		super();
	}
}
class GTouchColors extends Game {
	static SIMPLE_COLORS = ['red', 'green', 'yellow', 'blue'];
	constructor() {
		console.log('creating instance of GTouchColors!!!!!!!!!!!!!')
		super();
	}
	startLevel() {
		this.numColors = getGameOrLevelInfo('numColors', 2);
		G.numLabels = this.numColors * G.numPics;
		this.colorlist = lookupSet(Settings, ['games', 'gTouchColors', 'colors'], GTouchColors.SIMPLE_COLORS);
		this.contrast = lookupSet(Settings, ['games', 'gTouchColors', 'contrast'], .35);
		G.keys = G.keys.filter(x => containsColorWord(x));
		console.log('GTouchColors keys', G.keys);
	}
	prompt() {
		this.colors = choose(this.colorlist, this.numColors);
		showPictures(evaluate, { colors: this.colors, contrast: this.contrast });

		setGoal(randomNumber(0, G.numPics * this.colors.length - 1));
		Goal.correctionPhrase = Goal.textShadowColor + ' ' + Goal.label;

		let spoken = `click the ${Goal.textShadowColor} ${Goal.label}`;
		showInstruction(Goal.label, `click the <span style='color:${Goal.textShadowColor}'>${Goal.textShadowColor.toUpperCase()}</span>`,
			dTitle, true, spoken);
		activateUi();
	}
}
class GMem extends Game {
	constructor() {
		super();
	}
	clear(){clearTimeout(this.TO);showMouse();}
	prompt() {
		showPictures(this.interact.bind(this), { repeat: G.numRepeat, sameBackground: true, border: '3px solid #ffffff80' });
		setGoal();

		if (G.level > 2) { showInstruction('', 'remember all', dTitle, true); }
		else { showInstruction(Goal.label, 'remember', dTitle, true); }

		let secs = calcMemorizingTime(G.numPics, G.level > 2);

		hideMouse();
		TOMain = setTimeout(() => turnCardsAfter(secs), 300, G.level >= 5); //needed fuer ui update! sonst verschluckt er last label

	}
	interact(ev) {
		console.log('interact!',ev);
	}
}

function getInstance(G) { return new (GAME[G.key].cl)(); }





const GAME = {
	gTouchPic: { friendly: 'Pictures!', logo: 'computer mouse', color: 'deepskyblue', cl: GTouchPic, },
	gTouchColors: { friendly: 'Colors!', logo: 'artist palette', color: RED, cl: GTouchColors, }, //'orange', //LIGHTBLUE, //'#bfef45',
	gWritePic: { friendly: 'Type it!', logo: 'keyboard', color: 'orange', cl: GTouchPic, }, //LIGHTGREEN, //'#bfef45',
	gMissingLetter: { friendly: 'Letters!', logo: 'black nib', color: 'gold', cl: GTouchPic, },
	gSayPic: { friendly: 'Speak up!', logo: 'microphone', color: BLUE, cl: GTouchPic, }, //'#4363d8',
	gPreMem: { friendly: 'Premem!', logo: 'hammer and wrench', color: LIGHTGREEN, cl: GTouchPic, }, //'deeppink',
	gSteps: { friendly: 'Steps!', logo: 'stairs', color: PURPLE, cl: GTouchPic, }, //'#911eb4',
	gMem: { friendly: 'Memory!', logo: 'memory', color: GREEN, cl: GMem, }, //'#3cb44b'
};



