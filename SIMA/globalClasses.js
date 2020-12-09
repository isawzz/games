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

function getInstance(G) { return new (GAME[G.key].cl)(); }





const GAME = {
	gTouchPic: { friendly: 'Pictures!', logo: 'computer mouse', color: 'deepskyblue', cl: GTouchPic, },
	gTouchColors: { friendly: 'Colors!', logo: 'artist palette', color: RED, cl: GTouchPic, }, //'orange', //LIGHTBLUE, //'#bfef45',
	gWritePic: { friendly: 'Type it!', logo: 'keyboard', color: 'orange', cl: GTouchPic, }, //LIGHTGREEN, //'#bfef45',
	gMissingLetter: { friendly: 'Letters!', logo: 'black nib', color: 'gold', cl: GTouchPic, },
	gSayPic: { friendly: 'Speak up!', logo: 'microphone', color: BLUE, cl: GTouchPic, }, //'#4363d8',
	gPreMem: { friendly: 'Premem!', logo: 'hammer and wrench', color: LIGHTGREEN, cl: GTouchPic, }, //'deeppink',
	gSteps: { friendly: 'Steps!', logo: 'stairs', color: PURPLE, cl: GTouchPic, }, //'#911eb4',
	gMem: { friendly: 'Memory!', logo: 'memory', color: GREEN, cl: GTouchPic, }, //'#3cb44b'
};



