var NumMissingLetters;
var inputs=[];
function initML() {
	NumPics = 1;
	MaxNumTrials = 1;
	keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);
	//console.log('...starting MissingLetter pics', NumPics, 'keys', keySet.length);

}
function roundML() {
	trialNumber = 0;
	NumMissingLetters = level - SHOW_LABEL_UP_TO_LEVEL;
}
function promptML() {

	trialNumber += 1;
	showPictures(true, () => fleetingMessage('just enter the missing letter!'));
	setGoal(true);

	showInstruction(bestWord, currentLanguage == 'E' ? 'complete' : "ergänze", dTitle);

	mLinebreak(dTable);

	let d = mDiv(dTable);
	d.id = 'dLetters';
	// let i=0;
	for (let i = 0; i < bestWord.length; i++) {
		let d1 = mCreate('div');
		mAppend(d, d1);
		d1.innerHTML = bestWord[i].toUpperCase();
		inputs.push(d1);
		//mStyleX(d1,{display:'inline',w:60,align:'center',border:'none',outline:'none',family:'Consolas',fz:100});
		mStyleX(d1, { margin: 10, fg: 'white', display: 'inline', w: 64, bg: 'transparent', align: 'center', border: 'transparent', outline: 'none', family: 'Consolas', fz: 100 });
	}

	//randomly choose one of the input boxes
	let len = bestWord.length;
	let nMissing = Math.min(len - 1, NumMissingLetters);
	let indices = nRandomNumbers(nMissing,1,len-2);
	for (let i = 0; i < indices; i++) {
		let index=indices[i];
		let inp = d.children[index];
		inputBox.innerHTML = '_';
		mClass(inputBox, 'blink');
		inputs.push()
		let rnd = randomNumber(1, bestWord.length - 2);
	}

	//inputBox.value='_';
	//inputBox.focus();

	mLinebreak(dTable);

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
	onkeydown = ev => {
		if (uiPaused) return;

		var inp = ev.key.toString(); //String.fromCharCode(ev.keyCode);
		//console.log('inp',inp);
		if (/[a-zA-Z0-9-_ ]/.test(inp)) {
			inputBox.innerHTML = inp.toUpperCase();
			mRemoveClass(inputBox, 'blink');
			let result = buildWordFromLetters(mBy('dLetters'));
			evaluate(result);
		}
	}
}
function evalML(word) {
	let answer = normalize(word, currentLanguage);
	let reqAnswer = normalize(bestWord, currentLanguage);
	//console.log('eval MissingLetter', answer, reqAnswer)
	if (answer == reqAnswer) return STATES.CORRECT;
	else if (trialNumber < MaxNumTrials) {
		trialPromptML();
		return STATES.NEXTTRIAL;
	} else {
		Selected = null;
		return STATES.INCORRECT;
	}
}










