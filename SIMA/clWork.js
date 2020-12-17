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
		G.numColors = getGameOrLevelInfo('numColors', 2);
		G.numSteps = getGameOrLevelInfo('numSteps', 2);
		//G.numRepeat = 2; //G.numColors * G.numPics;
		G.numLabels = G.numColors * G.numPics * G.numRepeat;
		this.colorList = lookupSet(GS, [this.name, 'colors'], clist);
		console.log(this.colorList)
		this.contrast = lookupSet(GS, [this.name, 'contrast'], .35);
		G.keys = G.keys.filter(x => containsColorWord(x));
	}
	prompt() {
		this.picList = [];
		this.colors = undefined;
		this.showRepeat = false;
		if (G.numColors > 1) this.colors = choose(this.colorList, G.numColors).map(x => x.color);
		else if (G.numRepeat > 1) this.showRepeat = true;
		showPictures(evaluate, { showRepeat: this.showRepeat, colors: this.colors, repeat: G.numRepeat, contrast: this.contrast });

		setMultiGoal(G.numSteps);

		console.log(Goal)

		for (let i = 0; i < G.numSteps; i++) {
			let goal = Goal[i];
			goal.ordinal = '';
			console.log(goal);
			if (G.numRepeat > 1) { goal.ordinal = ordinal_suffix_of(goal.iRepeat); }

			goal.colorName = '';
			if (G.numColors > 1) {
				let oColor = firstCond(this.colorList, x => x.color == goal.textShadowColor);
				goal.colorName = oColor.name;
			}

			goal.correctionPhrase = (isdef(goal.ordinal) ? goal.ordinal : '') + ' '
				+ (isdef(goal.colorName) ? goal.colorName : '') + ' ' + goal.label;

			goal.spokenInstruction = goal.writtenInstruction = goal.correctionPhrase;

			// if (G.numColors <= 1) goal.writtenInstructionSuffix = goal.correctionPhrase;
			// else goal.writtenInstructionSuffix = `${goal.ordinal} <span style='color:${goal.textShadowColor}'>${goal.colorName.toUpperCase()}</span>`

			// console.log(goal.writtenInstructionSuffix)
		}

		let wInstruction = 'click the ' + Goal[0].writtenInstruction;
		let sInstruction = 'click the ' + Goal[0].writtenInstruction;
		for (const g of Goal.slice(1)) {
			wInstruction += ', '+g.writtenInstruction;
			sInstruction += ', then the '+g.spokenInstruction;
		}
		showInstruction('', wInstruction, dTitle, true, sInstruction, 20);
		activateUi();
	}
	trialPrompt() {
		for (const p of this.picList) { toggleSelectionOfPicture(p); }
		this.picList = [];
		showInstruction('', 'try again', dTitle, true);
		return 10;
	}
	interact(ev) {
		ev.cancelBubble = true;
		if (!canAct()) return;

		let id = evToClosestId(ev);
		let i = firstNumber(id);
		let pic = Pictures[i];
		let div = pic.div;
		if (!isEmpty(this.picList) && this.picList.length < G.numSteps - 1 && this.picList[0].label != pic.label) return;
		toggleSelectionOfPicture(pic, this.picList);
		console.log('clicked', pic.key, this.picList);//,picList, GPremem.PicList);
		if (isEmpty(this.picList)) {
			showInstruction('', 'click any picture', dTitle, true);
		} else if (this.picList.length < G.numRepeat - 1) {
			//set incomplete: more steps are needed!
			//frame the picture
			showInstruction(pic.label, 'click another', dTitle, true);
		} else if (this.picList.length == G.numRepeat - 1) {
			// look for last picture with x that is not in the set
			let picGoal = firstCond(Pictures, x => x.label == pic.label && !x.isSelected);
			setGoal(picGoal.index);
			showInstruction(picGoal.label, 'click the ' + (G.numRepeat == 2 ? 'other' : 'last'), dTitle, true);
		} else {
			//set is complete: eval
			evaluate(this.picList);
		}
	}
	eval(piclist) {
		Selected = { piclist: piclist, feedbackUI: piclist.map(x => x.div), sz: getBounds(piclist[0].div).height };
		let req = Selected.reqAnswer = piclist[0].label;
		Selected.answer = piclist[piclist.length - 1].label;
		if (Selected.answer == req) { return true; } else { return false; }
	}
}

