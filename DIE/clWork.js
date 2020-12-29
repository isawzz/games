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

function scrambleInputs(d) {
	let children = Array.from(d.children);
	// for(const ch of children){
	// 	mRemove(ch);
	// 	break;
	// }
	shuffle(children);
	//console.log(children)
	for (const ch of children) {
		mAppend(d, ch);
	}

}

class GAnagram extends Game {
	constructor(name) { super(name); }
	startLevel() {
		G.keys = setKeys({
			lang: Settings.language, keysets: KeySets, key: 'all',
			filterFunc: (k, w) => w.length <= G.maxWordLength
		});

		//console.log(KeySets)
	}
	prompt() {
		showPictures(() => fleetingMessage('just enter the missing letter!'));
		setGoal();

		showInstruction(Goal.label, Settings.language == 'E' ? 'drag letters to form' : "forme", dTitle, true);

		mLinebreak(dTable);

		let fz = 160;
		let word = Goal.label.toUpperCase();
		let dpEmpty = createLetterInputsX(word, dTable, { pabottom: 5, bg: 'grey', display: 'inline-block', fz: fz, w: fz, h: fz * 1.1, margin: 4 }); //,w:40,h:80,margin:10});
		let wlen = word.length;
		this.inputs = blankInputs(dpEmpty, range(0, wlen - 1), false);
		this.inputs.map(x=>makeDroppableX(x));
		makeDroppableX(dpEmpty);
		// for(const ch of dp.children){ch.style.width='100px';	ch.style.height='100px'; }

		fz = 60;
		let x = mLinebreak(dTable, 50);//x.style.background='red'
		let dp = createLetterInputsX(word, dTable, { bg: 'random', display: 'inline-block', fz: fz, w: fz, h: fz * 1.1, margin: 4 }); //,w:40,h:80,margin:10});

		scrambleInputs(dp);
		this.letters=Array.from(dp.children);
		this.letters.map(x=>makeDraggableX(x));

		// create sequence of letter ui
		// let fz = 80;
		// let style = { padding: 10, margin: 6, fg: 'white', display: 'inline', bg: 'random', align: 'center', border: 'transparent', outline: 'none', family: 'Consolas', fz: fz };
		// // let dc1=mDiv(dTable,{h:100,w:100,bg:'red'});mLinebreak(dTable);
		// let dEmpty = createLetterInputsX(Goal.label.toUpperCase(), dTable, {w:fz,h:fz, display: 'inline', fz:40, bg:'black',margin:15});//, style); // access children: d.children
		// dEmpty.style.margin='20px';
		// //dEmpty.style.padding='12px';
		// let x=mLinebreak(dTable);//,30);x.style.backgroundColor='blue';//mLinebreak(dTable,20);
		// // let dc2=mDiv(dTable,{h:100,w:100,bg:'red'});mLinebreak(dTable);
		// //mLinebreak(dTable,10);
		// let d = createLetterInputsX(Goal.label.toUpperCase(), dTable, {display: 'inline', fz:40, bg:'black',margin:15});//, style); // access children: d.children
		// d.style.margin='20px';
		// //let d = createLetterInputs(Goal.label.toUpperCase(), dTable, style); // access children: d.children
		// scrambleInputs(d);

		return;
		// randomly choose 1-G.numMissing alphanumeric letters from Goal.label
		let indices = getIndicesCondi(Goal.label, (x, i) => isAlphaNum(x) && i <= G.maxPosMissing);
		this.nMissing = Math.min(indices.length, G.numMissing);
		//console.log('nMissing is', this.nMissing, G.numPosMissing, G.maxPosMissing, indices, indices.length)
		let ilist = choose(indices, this.nMissing); sortNumbers(ilist);

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
		sayTryAgain();
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
					showFleetingMessage('you entered ' + Selected.lastLetterEntered);
					sayRandomVoice('try a different letter!', 'anderer Buchstabe!')
				}
				showFleetingMessage(this.composeFleetingMessage(), 3000);
				//if get to this place that input did not match!
				//ignore for now!
			}
		}

	}
	eval(word) {
		let answer = normalize(word, Settings.language);
		let reqAnswer = normalize(Goal.label, Settings.language);

		Selected.reqAnswer = reqAnswer;
		Selected.answer = answer;

		if (answer == reqAnswer) return true;
		else if (Settings.language == 'D' && isEnglishKeyboardGermanEquivalent(reqAnswer, answer)) {
			return true;
		} else {
			return false;
		}
	}
	composeFleetingMessage() {
		//console.log('this', this)
		let lst = this.inputs;
		//console.log(this.inputs)
		let msg = lst.map(x => x.letter).join(',');
		let edecl = lst.length > 1 ? 's ' : ' ';
		let ddecl = lst.length > 1 ? 'die' : 'den';
		let s = (Settings.language == 'E' ? 'Type the letter' + edecl : 'Tippe ' + ddecl + ' Buchstaben ');
		return s + msg;
	}

}
