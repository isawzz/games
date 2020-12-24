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
		sayTryAgain();
		if (!calibrating() && Settings.showHint) shortHintPic();
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
}

class GSteps extends Game {
	constructor(name) { super(name); }
	startGame() { G.correctionFunc = showCorrectWords; }
	startLevel() {
		G.keys = G.keys.filter(x => containsColorWord(x));
	}

	prompt() {
		this.picList = [];
		let colorKeys = G.numColors > 1 ? choose(G.colors, G.numColors) : null;
		let showRepeat = G.numRepeat > 1;

		showPictures(this.interact.bind(this), { showRepeat: showRepeat, colorKeys: colorKeys, contrast: G.contrast, repeat: G.numRepeat });

		setMultiGoal(G.numSteps);
		// console.log(Goal)

		let cmd = 'click';
		let spoken = [], written = [];
		for (let i = 0; i < G.numSteps; i++) {
			let goal = Goal.pics[i];
			let sOrdinal = getOrdinal(goal.iRepeat);
			[written[i], spoken[i]] = getOrdinalColorLabelInstruction(cmd, sOrdinal, goal.color, goal.label);
			cmd = 'then';
		}
		// console.log('written', written, '\nspoken', spoken);
		showInstructionX(written.join('; '), dTitle, spoken.join('. '), 20);

		activateUi();
	}
	trialPrompt() {
		for (const p of this.picList) { toggleSelectionOfPicture(p); }
		this.picList = [];
		sayTryAgain();
		return 10;
	}
	interact(ev) {
		ev.cancelBubble = true;
		if (!canAct()) return;

		let id = evToClosestId(ev);
		let i = firstNumber(id);
		let pic = Pictures[i];
		let div = pic.div;
		//if (!isEmpty(this.picList) && this.picList.length < G.numSteps - 1 && this.picList[0].label != pic.label) return;
		toggleSelectionOfPicture(pic, this.picList);
		console.log('clicked pic', pic.index, this.picList);//,picList, GPremem.PicList);
		if (isEmpty(this.picList)) return;
		//return;
		let iGoal = this.picList.length - 1;
		console.log('iGoal', iGoal, Goal.pics[iGoal], 'i', i, pic)
		if (pic != Goal.pics[iGoal]) { Selected = { pics: this.picList, wrong: pic, correct: Goal[iGoal] }; evaluate(false); }
		else if (this.picList.length == Goal.pics.length) { Selected = { picList: this.picList }; evaluate(true); }
	}
	eval(isCorrect) {
		console.log('eval', isCorrect);
		console.log('picList', this.picList)
		Selected = { picList: this.picList, feedbackUI: this.picList.map(x => x.div), sz: getBounds(this.picList[0].div).height };
		return isCorrect;
	}
}

