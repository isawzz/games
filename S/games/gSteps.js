var MemSTP;
function startGameSTP() { }
function startLevelSTP() { levelSTP(); }
function levelSTP() {
	MaxNumTrials = 1;// getGameOrLevelInfo('trials', 2);
	let vinfo = getGameOrLevelInfo('vocab', 100);
	currentKeys = isNumber(vinfo) ? KeySets['best' + getGameOrLevelInfo('vocab', 100)] : setKeys(vinfo);
	NumPics = getGameOrLevelInfo('numPics', 4);
	NumLabels = getGameOrLevelInfo('numLabels', NumPics);
	NumRepeat = getGameOrLevelInfo('numRepeat', 2);
}
function startRoundSTP() {
	uiActivated = false;
	MemSTP = [];
}
function promptSTP() {
	showPicturesSTP(OneTwoThree, { repeat: NumRepeat, border: '3px solid #ffffff80', });
	//setGoal();
	showInstruction('any picture', 'click', dTitle, true);
	return 10;
}
function trialPromptSTP() {
	for (const p of MemSTP) { toggleSelectionOfPicture(p); }
	MemSTP = [];
	Speech.say(currentLanguage == 'D' ? 'nochmal!' : 'try again!');
	//shortHintPic();
	return 10;
}
function activateSTP() {
	uiActivated = true;
}
function evalSTP(piclist) {

	Selected = { piclist: piclist, feedbackUI: piclist.map(x => x.div), sz: getBounds(piclist[0].div).height };

	let req = Selected.reqAnswer = piclist[0].label;
	let eachAnswerSame = true;
	for (const p of piclist) { if (p.label != req) eachAnswerSame = false; }
	Selected.answer = piclist[piclist.length - 1].label;
	if (Selected.answer == req) { return true; } else { return false; }
}

