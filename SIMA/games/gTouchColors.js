const SIMPLE_COLORS = ['red', 'green', 'yellow', 'blue'];
const EXTENDED_COLORS = ['red', 'green', 'yellow', 'blue', 'pink', 'indigo', 'gray', 'sienna', 'olive'];

var NumColors;
function startGameTC() { }
function startLevelTC() { levelTC(); }
function levelTC() {
	G.trials = getGameOrLevelInfo('trials', 2);
	let vinfo = getGameOrLevelInfo('vocab', 100);

	G.keys = isNumber(vinfo) ? KeySets['best' + getGameOrLevelInfo('vocab', 100)] : setKeys(vinfo);
	G.keys = G.keys.filter(x => containsColorWord(x));

	G.numPics = getGameOrLevelInfo('numPics', 3);
	NumColors = getGameOrLevelInfo('numColors', NumColors);
	NumLabels = getGameOrLevelInfo('numLabels', G.numPics * NumColors);

}
function startRoundTC() {
	uiActivated = false;
}
function promptTC() {

	let colorlist = lookupSet(Settings, ['games', 'gTouchColors', 'colors'], SIMPLE_COLORS);
	let contrast = lookupSet(Settings, ['games', 'gTouchColors', 'contrast'], .35);

	//let [colorlist, contrast] = ensureColors();
	let colors = choose(colorlist, NumColors);
	showPictures(evaluate, { colors: colors, contrast: contrast });

	setGoal(randomNumber(0, G.numPics * colors.length - 1));
	Goal.correctionPhrase = Goal.textShadowColor + ' ' + Goal.label;

	let spoken = `click the ${Goal.textShadowColor} ${bestWord}`;
	showInstruction(bestWord, `click the <span style='color:${Goal.textShadowColor}'>${Goal.textShadowColor.toUpperCase()}</span>`,
		dTitle, true, spoken);
	activateUi();
	//return 10;
}
function trialPromptTC() {
	Speech.say(Settings.language == 'D' ? 'nochmal!' : 'try again!');
	shortHintPic();
	return 10;

}
function activateTC() {
	uiActivated = true;
}
function evalTC(ev) {
	let id = evToClosestId(ev);
	ev.cancelBubble = true;

	let i = firstNumber(id);
	let item = Pictures[i];
	Selected = { pic: item, feedbackUI: item.div };
	Selected.reqAnswer = bestWord;
	Selected.answer = item.label;

	if (item == Goal) { return true; } else { return false; }
}

// game specific helpers
function containsColorWord(s) {
	let colors = ['old', 'blond', 'red', 'blue', 'green', 'purple', 'black', 'brown', 'white', 'grey', 'gray', 'yellow', 'orange'];
	for (const c of colors) {
		if (s.toLowerCase().includes(c)) return false;
	}
	return true;
}
