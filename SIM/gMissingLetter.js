function initML() {
	onkeydown = ev => {
		if (isdef(inputBox)) inputBox.focus();
	}
	NumPics = 1;
	MaxNumTrials = 3;
	keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);
	console.log('...starting MissingLetter pics', NumPics, 'keys', keySet.length);

}
function roundML() {
	trialNumber = 0;
}
function promptML() {

	trialNumber += 1;
	showPictures(true, () => mBy(defaultFocusElement).focus());
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
		//mStyleX(d1,{display:'inline',w:60,align:'center',border:'none',outline:'none',family:'Consolas',fz:100});
		mStyleX(d1, { margin: 10, fg: 'white', display: 'inline', w: 64, bg: 'transparent', align: 'center', border: 'transparent', outline: 'none', family: 'Consolas', fz: 100 });
	}

	//randomly choose one of the input boxes
	let rnd=randomNumber(1,bestWord.length-2);
	inputBox = d.children[rnd];
	inputBox.innerHTML='_';
	mClass(inputBox,'blink');

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
function buildWordFromLetters(d){
 let letters = Array.from(d.children);
 let s=letters.map(x=>x.innerHTML);
 s=s.join('')
 console.log('s is',s);
 return s;
}
function activateML() {
	console.log('should activate WritePic UI')
	onkeydown = ev => {
		if (hasClicked) return;
		
		var inp = ev.key.toString(); //String.fromCharCode(ev.keyCode);
		console.log('inp',inp);
		if (/[a-zA-Z0-9-_ ]/.test(inp)){
			inputBox.innerHTML = inp.toUpperCase();
			mRemoveClass(inputBox,'blink');
			hasClicked = true;
			let result = buildWordFromLetters(mBy('dLetters'));
			evaluate(result);
		}
	}
}
function evalML(word) {


	return STATES.CORRECT;
	// let answer = normalize(inputBox.value, currentLanguage);
	// let reqAnswer = normalize(bestWord, currentLanguage);
	// console.log('eval WritePic', answer, reqAnswer)
	// if (answer == reqAnswer) return STATES.CORRECT;
	// else if (trialNumber < MaxNumTrials) {
	// 	trialPromptML();
	// 	return STATES.NEXTTRIAL;
	// } else {
	// 	Selected = null;
	// 	return STATES.INCORRECT;
	// }
}










