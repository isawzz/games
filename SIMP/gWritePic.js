const LevelsWP = {
	0: { NumPics: 1, NumLabels: 1, MinWordLength: 2, MaxWordLength: 3, MaxNumTrials: 3 },
	1: { NumPics: 1, NumLabels: 1, MinWordLength: 3, MaxWordLength: 4, MaxNumTrials: 3 },
	2: { NumPics: 1, NumLabels: 1, MinWordLength: 3, MaxWordLength: 5, MaxNumTrials: 3 },
	3: { NumPics: 1, NumLabels: 0, MinWordLength: 3, MaxWordLength: 6, MaxNumTrials: 3 },
	4: { NumPics: 1, NumLabels: 0, MinWordLength: 4, MaxWordLength: 7, MaxNumTrials: 3 },
	5: { NumPics: 1, NumLabels: 0, MinWordLength: 5, MaxWordLength: 8, MaxNumTrials: 3 },
	6: { NumPics: 1, NumLabels: 0, MinWordLength: 6, MaxWordLength: 9, MaxNumTrials: 3 },
	7: { NumPics: 1, NumLabels: 0, MinWordLength: 7, MaxWordLength: 11, MaxNumTrials: 3 },
	8: { NumPics: 1, NumLabels: 0, MinWordLength: 8, MaxWordLength: 12, MaxNumTrials: 3 },
	9: { NumPics: 1, NumLabels: 0, MinWordLength: 7, MaxWordLength: 13, MaxNumTrials: 3 },
	10: { NumPics: 1, NumLabels: 0, MinWordLength: 6, MaxWordLength: 14, MaxNumTrials: 3 },
}
function startGameWP() {
	onkeydown = ev => {
		if (uiPaused) return;
		//console.log('gWritePic: keydown')
		if (isdef(inputBox)) { inputBox.focus(); }
	}
	levelWP();
}
function levelWP() {
	let levelInfo = LevelsWP[currentLevel];
	MaxNumTrials = levelInfo.MaxNumTrials;
	MaxWordLength = levelInfo.MaxWordLength;
	MinWordLength = levelInfo.MinWordLength;
	setKeys();
	NumPics = levelInfo.NumPics;	// NumPics = (currentLevel <= SHOW_LABEL_UP_TO_LEVEL? 2:1) + currentLevel; 
	NumLabels = levelInfo.NumLabels;
	writeComments();
}

function startRoundWP() {
	trialNumber = 0;
}
function promptWP() {

	trialNumber += 1;
	showPictures(true, () => mBy(defaultFocusElement).focus());
	setGoal();

	showInstruction(bestWord, currentLanguage == 'E' ? 'type' : "schreib'", dTitle);

	mLinebreak(dTable);
	inputBox = addNthInputElement(dTable, trialNumber);
	defaultFocusElement = inputBox.id;

	return 10;
}
function trialPromptWP() {
	console.log(uiPaused)
	beforeActivationUI(); activationUI();
	say(currentLanguage == 'E' ? 'try again!' : 'nochmal', 1, 1, .8, true, 'zira');
	trialNumber += 1;
	mLinebreak(dTable);
	inputBox = addNthInputElement(dTable, trialNumber);
	defaultFocusElement = inputBox.id;
	console.log('trial', trialNumber, 'beforeActivation', uiPaused)
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










