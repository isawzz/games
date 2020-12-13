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
		console.log('the correct sequence is', Goal.seq)
	}
	startLevel() {
		this.numMissing = G.numMissingLetters = getGameOrLevelInfo('numMissing', 1);
		this.max = G.maxNumber = getGameOrLevelInfo('max', 20);
		this.pos = G.posMissing = getGameOrLevelInfo('posMissing', 'consec');
		this.step = G.step = getGameOrLevelInfo('step', 1);
		this.seqlen = G.lengthOfSequence = getGameOrLevelInfo('length', 5);
		G.numPics = 2; G.numLabels = 0;
	}
	prompt() {
		showInstruction('', Settings.language == 'E' ? 'complete the sequence' : "ergänze die reihe", dTitle, true);
		mLinebreak(dTable, 12);

		showHiddenThumbsUpDown({ sz: 140 });
		mLinebreak(dTable);

		let seq = this.seq = getRandomNumberSequence(this.seqlen, 0, this.max, this.step);
		let wi = createWordInputs(seq, dTable, 'dNums');
		let blank = blankWordInputs(wi.words, 2);//this.numMissing, this.pos);

		Goal = { seq: seq, words: wi.words, chars: wi.letters, blankWords: blank.words, blankChars: blank.letters, iFocus: blank.iFocus };
		console.log('Goal', Goal);

		mLinebreak(dTable);
		if (Settings.isTutoring) { let msg = this.composeFleetingMessage(); showFleetingMessage(msg, 3000); }
		activateUi();
	}
	trialPrompt() {
		Speech.say(Settings.language == 'D' ? 'nochmal!' : 'try again!');

		// let selinp = Selected.inp;
		// setTimeout(() => {
		// 	let d = selinp.div;
		// 	d.innerHTML = '_';
		// 	mClass(d, 'blink');
		// }, 1500);

		if (Settings.showHint) showFleetingMessage(this.composeFleetingMessage(), 3000);
		return 10;
	}
	activate() { onkeypress = this.interact; }
	interact(ev) {
		//console.log('key!');
		clearFleetingMessage();
		if (!canAct()) return;

		onKeyWordInput(ev);
	}

	eval(isCorrect) { return isCorrect;}
	composeFleetingMessage() {
		//console.log('this', this)
		let lst = Goal.blankWords.map(x=>x.word);
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
function getRandomNumberSequence(n, minStart, maxStart, fBuild) {
	let nStart = randomNumber(minStart, maxStart - n + 1);
	if (isNumber(fBuild)) return range(nStart, nStart + (n - 1) * fBuild, fBuild);
	else {
		let res = [], x = nStart;
		for (let i = 0; i < n; i++) {
			res.push(x);
			x = fBuild(x);
		}
		return res;
	}


}