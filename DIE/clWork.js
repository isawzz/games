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

class GMissingNumber extends Game {
	constructor(name) { super(name); }
	startGame() {
		G.successFunc = successThumbsUp;
		G.failFunc = failThumbsDown;
		G.correctionFunc = this.showCorrectSequence.bind(this);
	}
	showCorrectSequence() { return numberSequenceCorrectionAnimation(); }
	startLevel() {
		//G.numMissingLetters = getGameOrLevelInfo('numMissing', 1);
		//G.minNum = getGameOrLevelInfo('min', 0);
		//G.maxNum = getGameOrLevelInfo('max', 20);
		//G.posMissing = getGameOrLevelInfo('posMissing', 'consec');
		//G.steps = getGameOrLevelInfo('steps', 1);
		if (!isList(G.steps)) G.steps = [G.steps];
		//G.ops = getGameOrLevelInfo('ops', ['add']);
		//G.seqLen = getGameOrLevelInfo('seqLen', 5);
		G.numPics = 2;
		G.numLabels = 0;

		console.log(G)
	}
	prompt() {
		mLinebreak(dTable, 12);

		showHiddenThumbsUpDown({ sz: 140 });
		mLinebreak(dTable);

		G.step = chooseRandom(G.steps);
		G.op = chooseRandom(G.ops);
		[G.words, G.letters, G.seq] = createNumberSequence(G.seqLen, G.minNum, G.maxNum, G.step, G.op);
		setNumberSequenceGoal();
		//console.log(G)

		mLinebreak(dTable);

		let instr1 = (Settings.language == 'E' ? 'complete the sequence' : "ergänze die reihe");
		showInstruction('', instr1, dTitle, true);

		let initialDelay = 3000+G.level*1000;
		if (Settings.showHint && !calibrating()) recShowHints([0,1,2,3,4],QuestionCounter,initialDelay,d=>initialDelay+2000); //showNumSeqHint(G.trialNumber);

		activateUi();
	}
	trialPrompt() {
		let hintlist=G.trialNumber >= 4?[G.trialNumber]:range(G.trialNumber,4);
		let initialDelay = 3000+G.level*1000;
		if (Settings.showHint && !calibrating()) recShowHints(hintlist,QuestionCounter,initialDelay,d=>initialDelay+2000); //showNumSeqHint(G.trialNumber);
		// sayTryAgain();
		setTimeout(() => getWrongChars().map(x => unfillChar(x)), 500);
		// if (!calibrating() && Settings.showHint) showFleetingMessage(getNumSeqHint(), 2200, { fz: 22 });
		return 10;
	}
	activate() { onkeypress = this.interact; }
	interact(ev) {
		//console.log('key!');
		clearFleetingMessage();
		if (!canAct()) return;

		let sel = Selected = onKeyWordInput(ev);
		if (nundef(sel)) return;
		//console.log('===>', sel);

		//target,isMatch,isLastOfGroup,isVeryLast,ch
		let lastInputCharFilled = sel.target;
		console.assert(sel.isMatch == (lastInputCharFilled.letter == sel.ch), lastInputCharFilled, sel.ch);

		//all cases aufschreiben und ueberlegen was passieren soll!
		//TODO: multiple groups does NOT work!!!
		if (sel.isMatch && sel.isVeryLast) {
			deactivateFocusGroup();
			evaluate(true);
		} else if (sel.isMatch && sel.isLastOfGroup) {
			//it has been filled
			//remove this group from Goal.blankWords
			sel.target.isBlank = false;
			sel.target.group.hasBlanks = false;
			removeInPlace(Goal.blankWords, sel.target.group);
			removeInPlace(Goal.blankChars, sel.target);
			deactivateFocusGroup();
			console.log('haaaaaaaaaaaalo', Goal.isFocus)
			//console.log('=>', Goal)
		} else if (sel.isMatch) {
			//a partial match
			removeInPlace(Goal.blankChars, sel.target);
			sel.target.isBlank = false;
		} else if (sel.isVeryLast) {
			Selected.words = getInputWords();
			Selected.answer = getInputWordString();
			Selected.req = getCorrectWordString();
			deactivateFocusGroup();
			//console.log('LAST ONE WRONG!!!')
			evaluate(false);
			//user entered last missing letter but it is wrong!
			//can there be multiple errors in string?
		} else if (sel.isLastOfGroup) {
			//unfill last group

			Selected.words = getInputWords();
			Selected.answer = getInputWordString();
			Selected.req = getCorrectWordString();
			deactivateFocusGroup();
			evaluate(false);
			//user entered last missing letter but it is wrong!
			//can there be multiple errors in string?
		} else {
			if (!Settings.silentMode) playSound('incorrect1');
			deactivateFocusGroup();
			//unfillCharInput(Selected.target);
			showFleetingMessage('does NOT fit: ' + Selected.ch, 0, { fz: 24 });
			setTimeout(() => unfillCharInput(Selected.target), 500);
		}
		//
	}

	eval(isCorrect) { return isCorrect; }

}

// class GMissingNumber extends Game {
// 	constructor(name) { super(name); }
// 	startGame() {
// 		console.log('haaaaaaaa')
// 		G.successFunc = successThumbsUp;
// 		G.failFunc = failThumbsDown;
// 		G.correctionFunc = this.showCorrectSequence.bind(this);
// 	}
// 	showCorrectSequence() { return numberSequenceCorrectionAnimation(); }
// 	startLevel() {

// 		G.numMissing = getGameOrLevelInfo('numMissing', 1);
// 		G.min = getGameOrLevelInfo('min', 0);
// 		G.max = getGameOrLevelInfo('max', 20);
// 		G.posMissing = getGameOrLevelInfo('posMissing', 'consec');
// 		G.steps = getGameOrLevelInfo('steps', 1);
// 		if (!isList(G.steps)) G.steps = [G.steps];
// 		G.ops = getGameOrLevelInfo('ops', ['add']);
// 		G.numPics = 2;
// 		G.numLabels = 0;
// 		console.log(G)
// 		console.assert(false);
// 	}
// 	prompt() {
// 		mLinebreak(dTable, 12);

// 		showHiddenThumbsUpDown({ sz: 140 });
// 		mLinebreak(dTable);

// 		G.step = chooseRandom(G.steps);
// 		G.op = chooseRandom(G.ops);
// 		[G.words, G.letters, G.seq] = createNumberSequence(G.length, G.min, G.max, G.step, G.op);
// 		setNumberSequenceGoal();
// 		//console.log(G)
// 		//G.seq = setGoalWordInputs(G.length, G.min, G.max, G.step, G.op);

// 		mLinebreak(dTable);

// 		let instr1 = (Settings.language == 'E' ? 'complete the sequence' : "ergänze die reihe");
// 		showInstruction('', instr1, dTitle, true);

// 		if (calibrating()) { activateUi(); return; }

// 		if (Settings.isTutoring) { longNumSeqHint(); }
// 		else if (G.level <= 1) { longNumSeqHint(); }
// 		else if (G.level <= 3) { mediumNumSeqHint(); }
// 		else if (G.level <= 5) { shortNumSeqHint(); }
// 		else if (G.level <= 7) { shortNumSeqHint(true, false); }

// 		activateUi();
// 	}
// 	trialPrompt() {
// 		sayTryAgain();
// 		setTimeout(() => getWrongChars().map(x => unfillChar(x)), 500);
// 		if (!calibrating() && Settings.showHint) showFleetingMessage(getNumSeqHint(), 2200, { fz: 22 });
// 		return 10;
// 	}
// 	activate() { onkeypress = this.interact; }
// 	interact(ev) {
// 		//console.log('key!');
// 		clearFleetingMessage();
// 		if (!canAct()) return;

// 		let sel = Selected = onKeyWordInput(ev);
// 		if (nundef(sel)) return;
// 		//console.log('===>', sel);

// 		//target,isMatch,isLastOfGroup,isVeryLast,ch
// 		let lastInputCharFilled = sel.target;
// 		console.assert(sel.isMatch == (lastInputCharFilled.letter == sel.ch), lastInputCharFilled, sel.ch);

// 		//all cases aufschreiben und ueberlegen was passieren soll!
// 		//TODO: multiple groups does NOT work!!!
// 		if (sel.isMatch && sel.isVeryLast) {
// 			deactivateFocusGroup();
// 			evaluate(true);
// 		} else if (sel.isMatch && sel.isLastOfGroup) {
// 			//it has been filled
// 			//remove this group from Goal.blankWords
// 			sel.target.isBlank = false;
// 			sel.target.group.hasBlanks = false;
// 			removeInPlace(Goal.blankWords, sel.target.group);
// 			removeInPlace(Goal.blankChars, sel.target);
// 			deactivateFocusGroup();
// 			console.log('haaaaaaaaaaaalo', Goal.isFocus)
// 			//console.log('=>', Goal)
// 		} else if (sel.isMatch) {
// 			//a partial match
// 			removeInPlace(Goal.blankChars, sel.target);
// 			sel.target.isBlank = false;
// 		} else if (sel.isVeryLast) {
// 			Selected.words = getInputWords();
// 			Selected.answer = getInputWordString();
// 			Selected.req = getCorrectWordString();
// 			deactivateFocusGroup();
// 			//console.log('LAST ONE WRONG!!!')
// 			evaluate(false);
// 			//user entered last missing letter but it is wrong!
// 			//can there be multiple errors in string?
// 		} else if (sel.isLastOfGroup) {
// 			//unfill last group

// 			Selected.words = getInputWords();
// 			Selected.answer = getInputWordString();
// 			Selected.req = getCorrectWordString();
// 			deactivateFocusGroup();
// 			evaluate(false);
// 			//user entered last missing letter but it is wrong!
// 			//can there be multiple errors in string?
// 		} else {
// 			if (!Settings.silentMode) playSound('incorrect1');
// 			deactivateFocusGroup();
// 			//unfillCharInput(Selected.target);
// 			showFleetingMessage('does NOT fit: ' + Selected.ch, 0, { fz: 24 });
// 			setTimeout(() => unfillCharInput(Selected.target), 500);
// 		}
// 		//
// 	}

// 	eval(isCorrect) { return isCorrect; }

// }

