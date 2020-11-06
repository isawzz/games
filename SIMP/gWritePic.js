function initWP() {
	onkeydown = ev => {
		if (uiPaused) return;
		console.log('gWritePic: keydown')
		if (isdef(inputBox)) {
			// console.log('inputBox is visible and exists!')
			inputBox.focus();
		}
	}
	NumPics = 1;
	MaxNumTrials = 3;
	keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);
	//console.log('...starting WritePic: pics', NumPics, 'keys', keySet.length);

}
function levelWP(){}

function roundWP() {
	trialNumber = 0;
}
function promptWP() {

	trialNumber += 1;
	showPictures(true, () => mBy(defaultFocusElement).focus());
	setGoal(true);

	showInstruction(bestWord, currentLanguage == 'E' ? 'type' : "schreib'", dTitle);

	mLinebreak(dTable);
	inputBox = addNthInputElement(dTable, trialNumber);
	defaultFocusElement = inputBox.id;

	return 10;
}
function trialPromptWP() {
	console.log(uiPaused)
	beforeActivationUI();activationUI();
	say(currentLanguage == 'E'?'try again!':'nochmal', 1, 1, .8,true, 'zira');
	trialNumber += 1;
	mLinebreak(dTable);
	inputBox = addNthInputElement(dTable, trialNumber);
	defaultFocusElement = inputBox.id;
	console.log('trial',trialNumber,'beforeActivation',uiPaused)
	activateWP();
}
function activateWP() {
	//console.log('should activate WritePic UI')
	inputBox.onkeyup = ev => {
		if (ev.ctrlKey || uiPaused) return;
		if (ev.key === "Enter") {
			ev.cancelBubble = true;
			//console.log('eval!')
			evaluate(ev);
		}
	};
	inputBox.focus();
}
function evalWP(ev) {
	let answer = normalize(inputBox.value, currentLanguage);
	let reqAnswer = normalize(bestWord, currentLanguage);
	console.log('eval WritePic', answer, reqAnswer)
	if (answer == reqAnswer) return STATES.CORRECT;
	else if (trialNumber < MaxNumTrials) {
		trialPromptWP();
		return STATES.NEXTTRIAL;
	} else {
		Selected = null;
		return STATES.INCORRECT;
	}
}










