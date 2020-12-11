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
	startLevel() {
		let n = G.numMissingLetters = getGameOrLevelInfo('numMissing', 1);
		this.pos = getGameOrLevelInfo('posMissing', 'random');
		if (isNumber(this.pos)) this.pos = [this.pos];
		else if (this.pos == 'start') { this.pos = range(0, n - 1, 1); }
		else if (this.pos == 'end') { this.pos = range(4 - n + 1, 4, 1); }

		console.log('pos', this.pos);

	}
	prompt() {
		//showPictures(() => fleetingMessage('just enter the missing letter!'));
		//setGoal();
		let nStart = randomNumber(0, 8);
		let seq = range(nStart, nStart + 5, 1);
		let Goal = { label: seq.join(''), sequence: seq };
		//this.sequence = range(randomNumber(1,10*G.level))

		showInstruction('', Settings.language == 'E' ? 'complete the sequence' : "ergänze die reihe", dTitle, true);

		mLinebreak(dTable);

		// create sequence of letter ui
		let style = { margin: 6, fg: 'white', display: 'inline', bg: 'transparent', align: 'center', border: 'transparent', outline: 'none', family: 'Consolas', fz: 80 };
		let d = createLetterInputs(Goal.label.toUpperCase(), dTable, style); // acces children: d.children

		let ilist;
		if (this.pos == 'random') ilist = choose(range(0, 4, 1), G.numMissingLetters);
		else ilist = this.pos;


		this.inputs = [];
		for (const idx of ilist) {
			let inp = d.children[idx];
			inp.innerHTML = '_';
			mClass(inp, 'blink');
			this.inputs.push({ letter: Goal.label[idx].toUpperCase(), div: inp, index: idx });
		}

		mLinebreak(dTable);

		let msg = this.composeFleetingMessage();
		//console.log('msg,msg', msg)
		showFleetingMessage(msg, 3000);
		activateUi();

	}
	trialPromptML() {
		let selinp = Selected.inp;
		Speech.say(Settings.language == 'D' ? 'nochmal!' : 'try again!');
		setTimeout(() => {
			let d = selinp.div;
			d.innerHTML = '_';
			mClass(d, 'blink');
		}, 1500);

		showFleetingMessage(this.composeFleetingMessage(), 3000);
		return 10;
	}
	activate() {
		onkeypress = ev => {
			clearFleetingMessage();
			if (!canAct()) return;
			let charEntered = ev.key.toString();
			if (!isAlphaNum(charEntered)) return;

			Selected = { lastLetterEntered: charEntered.toUpperCase() };
			//console.log(inputs[0].div.parentNode)

			if (this.nMissing == 1) {
				let d = Selected.feedbackUI = this.inputs[0].div;
				Selected.positiveFeedbackUI = Goal.div;
				Selected.lastIndexEntered = this.inputs[0].index;
				Selected.inp = this.inputs[0];
				d.innerHTML = Selected.lastLetterEntered;
				mRemoveClass(d, 'blink');
				let result = buildWordFromLetters(mParent(d));

				evaluate(result);
			} else {
				let ch = charEntered.toUpperCase();
				for (const inp of this.inputs) {
					if (inp.letter == ch) {
						Selected.lastIndexEntered = inp.index;
						Selected.inp = inp;
						let d = Selected.feedbackUI = inp.div;
						d.innerHTML = ch;
						mRemoveClass(d, 'blink');
						removeInPlace(this.inputs, inp);
						this.nMissing -= 1;
						break;
					}
				}
				if (nundef(Selected.lastIndexEntered)) {
					//the user entered a non existing letter!!!
					showFleetingMessage('you entered ' + Selected.lastLetterEntered)
					Speech.say('this letter does NOT belong to the word!')
				}
				showFleetingMessage(this.composeFleetingMessage(), 3000);
				//if get to this place that input did not match!
				//ignore for now!
			}
		}

	}
	eval(word) {
		let answer = word; //normalize(word, Settings.language);
		let reqAnswer = Goal.label; // normalize(Goal.label, Settings.language);

		Selected.reqAnswer = reqAnswer;
		Selected.answer = answer;

		if (answer == reqAnswer) return true; else return false;
	}
	composeFleetingMessage() {
		//console.log('this', this)
		let lst = this.inputs;
		//console.log(this.inputs)
		let msg = lst.map(x => x.letter).join(',');
		let edecl = lst.length > 1 ? 's ' : ' ';
		let ddecl = lst.length > 1 ? 'die' : 'den';
		let s = (Settings.language == 'E' ? 'Type the number' + edecl : 'Tippe ' + ddecl + ' Zahlen ');
		return s + msg;
	}

}


