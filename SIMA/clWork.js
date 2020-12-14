class Game {
	constructor() {
	}
	clear() { clearTimeout(this.TO); clearFleetingMessage(); }//console.log(getFunctionCallerName()); }
	startGame() { }//console.log(getFunctionCallerName()); }
	startLevel() { }//console.log(getFunctionCallerName()); }
	startRound() { }//console.log(getFunctionCallerName()); }
	prompt() {
		//console.log(getFunctionCallerName());
		showPictures(evaluate);
		setGoal();
		showInstruction(Goal.label, 'click', dTitle, true);
		activateUi();
	}
	trialPrompt() {
		//console.log(getFunctionCallerName());
		Speech.say(Settings.language == 'D' ? 'nochmal!' : 'try again!');
		if (Settings.showHint) shortHintPic();
		return 10;
	}
	activate() { }//console.log(getFunctionCallerName()); }
	interact() { }//console.log(getFunctionCallerName()); }
	eval(ev) {
		//console.log(getFunctionCallerName());
		let id = evToClosestId(ev);
		ev.cancelBubble = true;

		let i = firstNumber(id);
		let item = Pictures[i];
		Selected = { pic: item, feedbackUI: item.div, sz: getBounds(item.div).height };

		Selected.reqAnswer = Goal.label;
		Selected.answer = item.label;

		if (item.label == Goal.label) { return true; } else { return false; }
	}
	recycle() { }//console.log(getFunctionCallerName()); }
}

class GMissingNumber extends Game {
	constructor() {
		super();
	}
	startGame() {
		G.successFunc = successThumbsUp;
		G.failFunc = failThumbsDown;
		G.correctionFunc = this.showCorrectSequence.bind(this);
	}
	showCorrectSequence() {
		numberSequenceCorrectionAnimation(getWrongWords(), DELAY * 2)
		// if (Selected.isVeryLast) {
		// 	numberSequenceCorrectionAnimation(getWrongWords(),DELAY*2)
		// } else {
		// 	console.assert(Selected.isLastOfGroup==true);
		// 	numberSequenceCorrectionAnimation([Selected.target.group],DELAY*2);
		// 	setTimeout(()=>unfillCharInput(target),DELAY*2);
		// }

	}
	startLevel() {
		this.numMissing = G.numMissingLetters = getGameOrLevelInfo('numMissing', 1);
		this.max = G.maxNumber = getGameOrLevelInfo('max', 20);
		this.pos = G.posMissing = getGameOrLevelInfo('posMissing', 'consec');
		this.step = G.step = getGameOrLevelInfo('step', 1);
		this.ops = G.ops = getGameOrLevelInfo('ops', ['add']);
		this.seqlen = G.lengthOfSequence = getGameOrLevelInfo('length', 5);
		G.numPics = 2; G.numLabels = 0;
	}
	prompt() {
		showInstruction('', Settings.language == 'E' ? 'complete the sequence' : "ergänze die reihe", dTitle, true);
		mLinebreak(dTable, 12);

		showHiddenThumbsUpDown({ sz: 140 });
		mLinebreak(dTable);

		this.op = G.op = chooseRandom(this.ops);
		this.seq = setGoalWordInputs(this.seqlen, 0, this.max, this.step, this.op);

		mLinebreak(dTable);
		if (Settings.isTutoring) { let msg = this.composeFleetingMessage(); showFleetingMessage(msg, 3000); }
		activateUi();
	}
	trialPrompt() {
		Speech.say(Settings.language == 'D' ? 'nochmal!' : 'try again!');
		setTimeout(() => getWrongChars().map(x=>unfillChar(x)), 500);
		if (Settings.showHint) showFleetingMessage(this.composeFleetingMessage(), 3000);
		return 10;
	}
	activate() { onkeypress = this.interact; }
	interact(ev) {
		//console.log('key!');
		clearFleetingMessage();
		if (!canAct()) return;

		let sel = Selected = onKeyWordInput(ev);
		console.log('===>', sel);

		//target,isMatch,isLastOfGroup,isVeryLast,ch
		let lastInputCharFilled = sel.target;
		console.assert(sel.isMatch == (lastInputCharFilled.letter == sel.ch), lastInputCharFilled, sel.ch);

		//all cases aufschreiben und ueberlegen was passieren soll!
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
			console.log('haaaaaaaaaaaalo',Goal.isFocus)
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
			playSound('incorrect1'); 
			deactivateFocusGroup();
			unfillCharInput(Selected.target);
			showFleetingMessage('does NOT fit: '+Selected.ch,0,{fz:24},true);
			setTimeout(() => unfillCharInput(Selected.target), 500);
		}
		//
	}

	eval(isCorrect) {
		return isCorrect;
	}
	composeFleetingMessage() {
		//console.log('this', this)
		let lst = Goal.blankWords.map(x => x.word);
		//console.log(this.inputs)
		let msg = lst.join(',');
		let edecl = lst.length > 1 ? 's are ' : ' is ';
		let ddecl = lst.length > 1 ? 'en ' : 't ';
		let s = (Settings.language == 'E' ? 'the missing number' + edecl : 'es fehl' + ddecl);
		return s + msg;
	}

}

function colorBright(c, percent) {
	let hex = colorHex(c);
	// strip the leading # if it's there
	hex = hex.replace(/^\s*#|\s*$/g, '');

	// convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
	if (hex.length == 3) {
		hex = hex.replace(/(.)/g, '$1$1');
	}

	var r = parseInt(hex.substr(0, 2), 16),
		g = parseInt(hex.substr(2, 2), 16),
		b = parseInt(hex.substr(4, 2), 16);

	return '#' +
		((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
		((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
		((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}
function colorBright1(c, percent = 50) {
	let hsl = colorHSL(c, true);
	let hNew = { h: hsl.h, s: hsl.s, l: hsl.l + hsl.l * (percent / 100) }
	return hNew;
}
