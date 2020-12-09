var TOTP;
function clearTP(){ clearTimeout(TOTP);}
function startGameTP() {}
function startLevelTP() { }
function startRoundTP() {
	uiActivated = false;
}
function promptTP() {
	showPictures(evaluate);
	setGoal();
	showInstruction(Goal.label, 'click', dTitle, true);
	activateUi();
	//return 10;
}
function trialPromptTP() {
	Speech.say(Settings.language == 'D' ? 'nochmal!' : 'try again!');
	shortHintPic();
	return 10;
}
function activateTP() {
	uiActivated = true;
}
function evalTP(ev) {
	let id = evToClosestId(ev);
	ev.cancelBubble = true;

	let i = firstNumber(id);
	let item = Pictures[i];
	Selected = { pic: item, feedbackUI: item.div, sz: getBounds(item.div).height };

	Selected.reqAnswer = Goal.label;
	Selected.answer = item.label;

	if (item.label == Goal.label) { return true; } else { return false; }
}

