function startGameSP() { }
function startLevelSP() { levelSP(); }
function levelSP() {
	
	G.trials = getGameOrLevelInfo('trials', 3);

	let vinfo = getGameOrLevelInfo('vocab', 100);
	G.keys = setKeys({ lang: Settings.language, nbestOrCats: vinfo, confidence: (Settings.language == 'D' ? 70 : 90) });

	G.numPics = NumLabels = 1;
}
function startRoundSP() { }
function promptSP() {

	showPictures(() => mBy(defaultFocusElement).focus());
	setGoal();

	showInstruction(bestWord, Settings.language == 'E' ? 'say:' : "sage: ", dTitle);
	animate(dInstruction, 'pulse800' + getSignalColor(), 900);

	mLinebreak(dTable);
	MicrophoneUi = mMicrophone(dTable);
	MicrophoneHide();

	activateUi();
	//return 10;
}
function trialPromptSP(nTrial) {
	let phrase = nTrial<2?(Settings.language == 'E' ? 'speak UP!!!' : 'LAUTER!!!')
	:(Settings.language == 'E' ? 'Louder!!!' : 'LAUTER!!!');
	Speech.say(phrase, 1, 1, 1, 'zira');
	animate(dInstruction, 'pulse800' + getSignalColor(), 500);
	return 10;
}
async function activateSP() {
	if (Speech.isSpeakerRunning()) {
		setTimeout(activateSP, 200);
	} else {
		setTimeout(() => Speech.startRecording(Settings.language, evaluate), 100);
	}
}
function evalSP(isfinal, speechResult, confidence) {

	let answer = Goal.answer = normalize(speechResult, Settings.language);
	let reqAnswer = Goal.reqAnswer = normalize(bestWord, Settings.language);

	Selected = { reqAnswer: reqAnswer, answer: answer, feedbackUI: Goal.div };

	if (isEmpty(answer)) return false;
	else return isSimilar(answer, reqAnswer);

}


