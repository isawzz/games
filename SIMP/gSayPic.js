function initSP() {
	NumPics = 1;
	MaxNumTrials = 3;
	keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);
	console.log('...starting WritePic: pics', NumPics, 'keys', keySet.length);

}
function roundSP() {
	trialNumber = 0;
}
function promptSP() {

	trialNumber += 1;
	showPictures(true, () => mBy(defaultFocusElement).focus());
	setGoal(true);

	showInstruction(bestWord, currentLanguage == 'E' ? 'say aloud:' : "sage laut: ", dTitle);

	mLinebreak(dTable);
	inputBox = addNthInputElement(dTable, trialNumber);
	defaultFocusElement = inputBox.id;

	return 10;
}
function trialPromptSP() {
	say(currentLanguage == 'E'?'try again!':'nochmal', 1, 1, .8,true, 'zira');
	trialNumber += 1;
	activateSP();
}
function activateSP() {
	//console.log('should activate SayPic UI')
	setTimeout(()=>{
		console.log('calling _record!!!')
		record(currentLanguage,bestWord);
	},4000);
}
function evalSP(speechResult) {
	let answer = normalize(speechResult, currentLanguage);
	let reqAnswer = normalize(bestWord, currentLanguage);
	console.log('eval SayPic', answer, reqAnswer)
	if (answer == reqAnswer) return STATES.CORRECT;
	else if (matchesAnyWordOrSound(Goal.info,answer)) return STATES.CORRECT;
	else if (isAcceptableAnswerButNewSound(Goal.info,answer)) {
		addAsSoundToDatabase(Goal.info,answer);
		return STATES.CORRECT;
	}
	else if (trialNumber < MaxNumTrials) {
		trialPromptSP();
		return STATES.NEXTTRIAL;
	} else {
		Selected = null;
		return STATES.INCORRECT;
	}
}

function matchesAnyWordOrSound(info,s){
	return false;
}
function isAcceptableAnswerButNewSound(info,s){
	return false;
}
function addAsSoundToDatabase(info,answer){
	//lege dictionary an  mit info.key => info [updated] with answer now in valid sounds for language
}






