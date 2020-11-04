var uiActivated;
function initTP() {

	NumPics = 2 + level;
	keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);
	//console.log('...starting TouchPic: pics', NumPics, 'keys', keySet.length);
}
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
	//console.log('should activate TouchPic UI');
	uiActivated = true;
}
function evalTP(ev) {
	if (hasClicked) return;
	hasClicked = true;
	let id = evToClosestId(ev);
	ev.cancelBubble = true;

	//get item
	let i = firstNumber(id);
	let item = Selected = Pictures[i];

	if (item.info.best == bestWord) { return STATES.CORRECT; } else { return STATES.INCORRECT; }
}

