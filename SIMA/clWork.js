class Game {
	constructor(name) { this.name = name; }
	clear() { clearTimeout(this.TO); clearFleetingMessage(); }
	startGame() { }
	startLevel() { }
	startRound() { }
	prompt() {
		showPictures(evaluate);
		setGoal();
		showInstruction(Goal.label, 'click', dTitle, true);
		activateUi();
	}
	trialPrompt() {
		Speech.say(Settings.language == 'D' ? 'nochmal!' : 'try again!');
		if (Settings.showHint) shortHintPic();
		return 10;
	}
	activate() { }
	interact() { }
	eval(ev) {
		let id = evToClosestId(ev);
		ev.cancelBubble = true;

		let i = firstNumber(id);
		let item = Pictures[i];
		Selected = { pic: item, feedbackUI: item.div, sz: getBounds(item.div).height };

		Selected.reqAnswer = Goal.label;
		Selected.answer = item.label;

		if (item.label == Goal.label) { return true; } else { return false; }
	}
	recycle() { }
}

class GSteps extends Game {
	constructor(name) { super(name); }
	startLevel() {
		const clist = [{ name: 'orange', color: 'orangered' }, { name: 'green', color: 'green' }, { name: 'pink', color: 'hotpink' }, { name: 'blue', color: 'blue' }];
		this.numColors = getGameOrLevelInfo('numColors', 2);
		//G.numRepeat = 2; //this.numColors * G.numPics;
		G.numLabels = this.numColors * G.numPics * G.numRepeat;
		this.colorList = lookupSet(GS, [this.name, 'colors'], clist);
		console.log(this.colorList)
		this.contrast = lookupSet(GS, [this.name, 'contrast'], .35);
		G.keys = G.keys.filter(x => containsColorWord(x));
	}
	prompt() {
		this.colors = undefined;
		this.showRepeat = false;
		if (this.numColors > 1) this.colors = choose(this.colorList, this.numColors).map(x => x.color);
		else if (G.numRepeat > 1) this.showRepeat = true;
		showPictures(evaluate, { showRepeat: this.showRepeat, colors: this.colors, repeat: G.numRepeat, contrast: this.contrast });

		setGoal(randomNumber(0, Pictures.length - 1));

		Goal.ordinal = '';
		console.log(Goal)
		if (G.numRepeat > 1) { Goal.ordinal = ordinal_suffix_of(Goal.iRepeat); }

		Goal.colorName = '';
		if (this.numColors > 1) {
			let oColor = firstCond(this.colorList, x => x.color == Goal.textShadowColor);
			Goal.colorName = oColor.name;
		}

		Goal.correctionPhrase = (isdef(Goal.ordinal) ? Goal.ordinal : '') + ' '
			+ (isdef(Goal.colorName) ? Goal.colorName : '') + ' ' + Goal.label;

		let spoken = `click the ${Goal.correctionPhrase}`;

		if (this.numColors <= 1) Goal.writtenInstructionSuffix = Goal.correctionPhrase;
		else Goal.writtenInstructionSuffix = `${Goal.ordinal} <span style='color:${Goal.textShadowColor}'>${Goal.colorName.toUpperCase()}</span>`

		console.log(Goal.writtenInstructionSuffix)

		showInstruction(Goal.label, `click the ${Goal.writtenInstructionSuffix}`, dTitle, true, spoken);
		activateUi();
	}
	eval(ev) {
		let id = evToClosestId(ev);
		ev.cancelBubble = true;

		let i = firstNumber(id);
		let item = Pictures[i];
		Selected = { pic: item, feedbackUI: item.div };
		Selected.reqAnswer = Goal.label;
		Selected.answer = item.label;

		if (item == Goal) { return true; } else { return false; }
	}
}

