function initTP() {
	NumPics = 2 + level;
	keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);

}
function roundTP() { }
function promptTP() {
	showPictures(true, () => mBy(defaultFocusElement).focus());
	setGoal(true);

	showInstruction(bestWord, currentLanguage == 'E' ? 'type' : "schreib'", dTitle);

	mLinebreak(dTable);
	inputBox = addNthInputElement(dTable, trialNumber);
	defaultFocusElement = inputBox.id;

	return 10;
}
function activateTP() {
	console.log('should activate TouchPic UI')
}
function evalTP() { }

