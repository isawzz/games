var TOWP;
function clearWP(){ clearTimeout(TOWP);}
function startGameWP() {
	onkeydown = ev => {
		if (uiPaused) return;
		if (isdef(inputBox)) { inputBox.focus(); }
	}
}
function startLevelWP() { levelWP(); }
function levelWP() {
	G.trials = getGameOrLevelInfo('trials', 3);
	MaxWordLength = getGameOrLevelInfo('maxWordLength', 12);
	G.numPics = 1;

	let vinfo = getGameOrLevelInfo('vocab', 100);
	G.keys = setKeys({ lang: Settings.language, nbestOrCats: vinfo, filterFunc:(k,w)=>w.length<=MaxWordLength });
}
function startRoundWP() { }
function promptWP() {
	showPictures(() => mBy(defaultFocusElement).focus());
	setGoal();

	showInstruction(Goal.label, Settings.language == 'E' ? 'type' : "schreib'", dTitle, true);

	mLinebreak(dTable);
	inputBox = addNthInputElement(dTable, G.trialNumber);
	defaultFocusElement = inputBox.id;

	activateUi();
	//return 10;
}
function trialPromptWP() {
	Speech.say(Settings.language == 'E' ? 'try again!' : 'nochmal', 1, 1, .8, 'zira');
	mLinebreak(dTable);
	inputBox = addNthInputElement(dTable, G.trialNumber);
	defaultFocusElement = inputBox.id;

	return 10;
}
function activateWP() {
	inputBox.onkeyup = ev => {
		if (ev.ctrlKey || uiPaused) return;
		if (ev.key === "Enter") {
			ev.cancelBubble = true;
			evaluate(ev);
		}
	};
	inputBox.focus();
}
function evalWP(ev) {
	let answer = normalize(inputBox.value, Settings.language);
	let reqAnswer = normalize(Goal.label, Settings.language);

	Selected = { reqAnswer: reqAnswer, answer: answer, feedbackUI: Goal.div };
	if (answer == reqAnswer) return true;
	else { return false; }
}










