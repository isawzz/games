var uiActivated;
function initTP() {

	NumPics = 2 + level;
	keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);
	//console.log('...starting TouchPic: pics', NumPics, 'keys', keySet.length);
}
function levelTP(){ NumPics = (level <= SHOW_LABEL_UP_TO_LEVEL? 2:1) + level; }
function roundTP() {
	uiActivated = false;
}
function promptTP() {
	showPictures(false, evaluate);
	setGoal(false);

	showInstruction(bestWord, 'click', dTitle);

	return 10;
}
function activateTP() {
	uiActivated = true;
}
function evalTP(ev) {
	let id = evToClosestId(ev);
	ev.cancelBubble = true;

	//get item
	let i = firstNumber(id);
	let item = Selected = Pictures[i];

	if (item.info.best == bestWord) { return STATES.CORRECT; } else { return STATES.INCORRECT; }
}

