function startGameTP() {}
function startLevelTP() { levelTP(); }
function levelTP() {
	G.trials = getGameOrLevelInfo('trials', 2);
	G.numPics = getGameOrLevelInfo('numPics', 9);
	NumLabels = getGameOrLevelInfo('numLabels', G.numPics); 

	let vinfo = getGameOrLevelInfo('vocab', 100);
	vinfo = ensureMinVocab(vinfo,G.numPics);

	G.keys = setKeys({lang:Settings.language,nbestOrCats:vinfo}); //isNumber(vinfo) ? KeySets['best' + vinfo] : setKeys(vinfo);

	//console.log('G.trials',G.trials,'G.numPics',G.numPics,'NumLabels',NumLabels,'vinfo',vinfo,'Settings.language',Settings.language)
	//console.log('incrementLevelOnPositiveStreak',Settings.incrementLevelOnPositiveStreak,'decrementLevelOnNegativeStreak',Settings.decrementLevelOnNegativeStreak);
}
function startRoundTP() {
	uiActivated = false;
}
function promptTP() {
	showPictures(evaluate);
	setGoal();
	showInstruction(bestWord, 'click', dTitle, true);
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

	Selected.reqAnswer = bestWord;
	Selected.answer = item.label;

	if (item.label == bestWord) { return true; } else { return false; }
}

