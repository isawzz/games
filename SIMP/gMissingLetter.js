var NumMissingLetters, nMissing, MaxPosMissing;
var inputs = [];
var hintTimeout;
const LevelsML = {
	0: { NumPics: 1, NumLabels: 1, MinWordLength: 3, MaxWordLength: 3, NumMissingLetters: 1, MaxPosMissing: 0, MaxNumTrials: 30 },
	1: { NumPics: 1, NumLabels: 1, MinWordLength: 3, MaxWordLength: 4, NumMissingLetters: 1, MaxPosMissing: 0, MaxNumTrials: 30 },
	2: { NumPics: 1, NumLabels: 1, MinWordLength: 4, MaxWordLength: 5, NumMissingLetters: 2, MaxPosMissing: 1, MaxNumTrials: 30 },
	3: { NumPics: 1, NumLabels: 0, MinWordLength: 4, MaxWordLength: 6, NumMissingLetters: 1, MaxPosMissing: 0, MaxNumTrials: 30 },
	4: { NumPics: 1, NumLabels: 0, MinWordLength: 4, MaxWordLength: 7, NumMissingLetters: 2, MaxPosMissing: 1, MaxNumTrials: 30 },
	5: { NumPics: 1, NumLabels: 0, MinWordLength: 5, MaxWordLength: 8, NumMissingLetters: 1, MaxPosMissing: 10, MaxNumTrials: 30 },
	6: { NumPics: 1, NumLabels: 0, MinWordLength: 5, MaxWordLength: 9, NumMissingLetters: 2, MaxPosMissing: 10, MaxNumTrials: 30 },
	7: { NumPics: 1, NumLabels: 0, MinWordLength: 6, MaxWordLength: 11, NumMissingLetters: 3, MaxPosMissing: 10, MaxNumTrials: 30 },
	8: { NumPics: 1, NumLabels: 0, MinWordLength: 8, MaxWordLength: 12, NumMissingLetters: 4, MaxPosMissing: 12, MaxNumTrials: 30 },
	9: { NumPics: 1, NumLabels: 0, MinWordLength: 7, MaxWordLength: 13, NumMissingLetters: 5, MaxPosMissing: 13, MaxNumTrials: 30 },
	10: { NumPics: 1, NumLabels: 0, MinWordLength: 6, MaxWordLength: 14, NumMissingLetters: 6, MaxPosMissing: 14, MaxNumTrials: 30 },
}
function startGameML() {
	levelML();
}
function levelML() {
	let levelInfo = LevelsML[currentLevel];
	MaxNumTrials = levelInfo.MaxNumTrials;
	MaxWordLength = levelInfo.MaxWordLength;
	MinWordLength = levelInfo.MinWordLength;
	setKeys();
	NumPics = levelInfo.NumPics;	// NumPics = (currentLevel <= SHOW_LABEL_UP_TO_LEVEL? 2:1) + currentLevel; 
	NumLabels = levelInfo.NumLabels;

	NumMissingLetters = levelInfo.NumMissingLetters;
	MaxPosMissing = levelInfo.MaxPosMissing;
	writeComments();
	console.log('NumMissing:' + NumMissingLetters, 'max pos:' + MaxPosMissing);
	// MaxWordLength = 
	// setKeys();
	// MaxNumTrials = 1;
	// NumPics = 1;
	// let labelsBisLevel = 2
	// NumLabels = currentLevel > labelsBisLevel ? 0 : 1;
	// NumMissingLetters = currentLevel <= labelsBisLevel ? (currentLevel + 1) : currentLevel;
	// console.log('...starting MissingLetter currentLevel:',currentLevel, 'pics', NumPics, 'labels',NumLabels, 'keys', currentKeys.length);
	// console.log(currentCategories, currentLanguage, MAX_WORD_LENGTH, currentLevel);
}
function startRoundML() {
	trialNumber = 0;
	//console.log('maxNumMissing:'+NumMissingLetters,'currentLevel:'+currentLevel,'show bis:'+hSHOW_LABEL_UP_TO_LEVEL)
}

function composeFleetingMessage() {
	//inputs.push({ letter: bestWord[index].toUpperCase(), div: inp, done: false, index:index });
	//find first input that is NOT done
	let inp = firstCond(inputs, x => !x.done);
	let s;
	let best=bestWord.toUpperCase();
	if (currentLevel < 2) {
		s = (currentLanguage == 'E' ? 'Type the letter ' : 'Tippe den Buchstaben ') + inp.letter;
	} else if (inp.index == 0) {
		s = currentLanguage == 'E' ? 'Type the first letter in ' + best : ' Tippe den Anfangsbuchstaben von ' + best;
	} else {
		let trialWord = buildWordFromLetters(mBy('dLetters')).toUpperCase();
		trialWord = replaceAll(trialWord,'_','')
		s = (currentLanguage == 'E' ? 'Type a letter that is in ' + best + ' but not in ' + trialWord
				: 'Tippe einen Buchstaben in ' + best + ' der nicht in ' + trialWord + ' ist!');
	}
	return s;
}

function promptML() {

	if (isdef(hintTimeout)) { clearTimeout(hintTimeout); hintTimeout = null; }
	trialNumber += 1;
	showPictures(false, () => fleetingMessage('just enter the missing letter!'));
	setGoal();

	showInstruction(bestWord, currentLanguage == 'E' ? 'complete' : "ergänze", dTitle);

	mLinebreak(dTable);

	//hier werden die letters und missing letters (inputs) gemacht:
	let d = mDiv(dTable);
	d.id = 'dLetters';
	inputs = [];
	// let i=0;
	for (let i = 0; i < bestWord.length; i++) {
		let d1 = mCreate('div');
		mAppend(d, d1);
		d1.innerHTML = bestWord[i].toUpperCase();
		//inputs.push(d1);
		//mStyleX(d1,{display:'inline',w:60,align:'center',border:'none',outline:'none',family:'Consolas',fz:100});
		mStyleX(d1, { margin: 10, fg: 'white', display: 'inline', w: 64, bg: 'transparent', align: 'center', border: 'transparent', outline: 'none', family: 'Consolas', fz: 100 });
	}

	//randomly choose one of the input boxes
	let len = bestWord.length;
	nMissing = Math.max(1, Math.min(len - 2, NumMissingLetters));

	let indices = nRandomNumbers(nMissing, 0, Math.min(len - 1, MaxPosMissing));
	// let indices = nRandomNumbers(nMissing, 1, len - 2);
	if (isEmpty(indices)) indices = nRandomNumbers(nMissing, 0, len - 1);

	//console.log('bestWord', bestWord, 'len', len, 'nMissing', nMissing, '\nindices', indices)

	for (let i = 0; i < nMissing; i++) {
		let index = indices[i];
		let inp = d.children[index];
		inp.innerHTML = '_';
		mClass(inp, 'blink');
		inputs.push({ letter: bestWord[index].toUpperCase(), div: inp, done: false, index: index });
	}

	mLinebreak(dTable);

	if (percentageCorrect < 170) {
		let msg = composeFleetingMessage();
		//hintTimeout = setTimeout(()=>fleetingMessage(msg,{fz:34,bg:'#ffffff80',fg:'red',rounding:10,padding:'2px 12px'}),2000);//hpadding:10,vpadding:2,
		let fg = currentLevel == 4 ? 'yellow' : 'red';
		hintTimeout = setTimeout(() => fleetingMessage(msg, { fz: 34, fg: fg, rounding: 10, padding: '2px 12px' }), 3000);//hpadding:10,vpadding:2,
	}

	return 10;
}
function trialPromptML() {
	// say(currentLanguage == 'E'?'try again!':'nochmal', 1, 1, .8,true, 'zira');
	// trialNumber += 1;
	// mLinebreak(dTable);
	// inputBox = addNthInputElement(dTable, trialNumber);
	// defaultFocusElement = inputBox.id;
	// activateML();
}
function buildWordFromLetters(d) {
	let letters = Array.from(d.children);
	let s = letters.map(x => x.innerHTML);
	s = s.join('')
	//console.log('s is',s);
	return s;
}
function activateML() {
	//console.log('should activate WritePic UI')
	onkeypress = ev => {
		if (uiPaused || ev.ctrlKey || ev.altKey) return;
		let charEntered = ev.key.toString(); //String.fromCharCode(ev.keyCode);
		if (!(/[a-zA-Z0-9-_ ]/.test(charEntered))) return;

		//console.log('inp',inp);
		if (nMissing == 1) {
			let d = inputs[0].div;
			d.innerHTML = charEntered.toUpperCase();
			mRemoveClass(d, 'blink');
			let result = buildWordFromLetters(mBy('dLetters'));
			evaluate(result);
		} else {
			let ch = charEntered.toUpperCase();
			for (const inp of inputs) {
				if (inp.letter == ch) {
					//found a matching letter
					let d = inp.div;
					d.innerHTML = ch;
					mRemoveClass(d, 'blink');
					removeInPlace(inputs, inp);
					nMissing -= 1;
					return;
				}
			}
			//if get to this place that input did not match!
			//ignore for now!
		}
	}
}
function evalML(word) {
	if (isdef(hintTimeout)) { clearTimeout(hintTimeout); }
	let answer = normalize(word, currentLanguage);
	let reqAnswer = normalize(bestWord, currentLanguage);
	//console.log('eval MissingLetter', answer, reqAnswer)
	//console.log(allLettersContained(reqAnswer,answer))
	if (answer == reqAnswer) return STATES.CORRECT;
	else if (currentLanguage == 'D' && isEnglishKeyboardGermanEquivalent(reqAnswer, answer)) {
		return STATES.CORRECT;
	}
	else {
		Selected = null;
		return STATES.INCORRECT;
	}
}










