
function initSettingsP0() {
	// initialize settings in settings window
	let iLanguage = mBy('input' + currentLanguage);
	iLanguage.checked = true;

	let iPicsPerLevel = mBy('inputPicsPerLevel');
	iPicsPerLevel.value = PICS_PER_LEVEL;

}

function openSettings() {	show(dSettings);	pauseUI();}
function closeSettings() {	setPicsPerLevel();	hide(dSettings);	resumeUI();}
function toggleSettings() {	if (isVisible2('dSettings')) closeSettings(); else openSettings();}

function setGame(event) {
	if (isString(event)) startGame(event);
	else {
		event.cancelBubble = true;
		let id = evToClosestId(event);
		let game = 'g' + id.substring(1);
		closeSettings();
		startGame(game);
	}
}
function setLanguage(x) {	currentLanguage = x; startLevel();}

function setKeysX({cats, bestOnly=false, correctOnly=false, sortAccessor}) {
	currentKeys = getKeySetX(isdef(cats) ? cats : currentCategories, currentLanguage, MinWordLength, MaxWordLength,
		bestOnly, sortAccessor, correctOnly, reqOnly);
	if (isdef(sortByFunc)) { sortBy(currentKeys, sortAccessor); }
}
function setKeys(cats, bestOnly, sortAccessor, correctOnly, reqOnly) {
	currentKeys = getKeySetX(isdef(cats) ? cats : currentCategories, currentLanguage, MinWordLength, MaxWordLength,
		bestOnly, sortAccessor, correctOnly, reqOnly);
	if (isdef(sortByFunc)) { sortBy(currentKeys, sortAccessor); }
}
function setPicsPerLevel() {
	let inp = mBy('inputPicsPerLevel');
	inp.select();
	let x = getSelection();
	let n = Number(x.toString());
	inp.value = n;
	getSelection().removeAllRanges();
	PICS_PER_LEVEL = n;
	SAMPLES_PER_LEVEL = new Array(20).fill(PICS_PER_LEVEL);
	boundary = SAMPLES_PER_LEVEL[currentLevel];
}


