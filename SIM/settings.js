
function openSettings() {
	//console.log('settings werden geoeffnet!')
	show(dSettings);
	pauseUI();


	//dSettings.scrollIntoView(false);
}
function closeSettings() {

	//update settings!
	setPicsPerLevel();
	updateAllGameSettingsFromSettingsWindow();

	hide(dSettings);

	resumeUI();
}
function updateAllGameSettingsFromSettingsWindow() {
	for (const gname in settingsPerGame) {
		let di = settingsPerGame[gname];
		di.language = currentLanguage;
		di.PICS_PER_LEVEL = PICS_PER_LEVEL;
	}
	for (const gname in settingsPerUser[currentUser].perGame) {
		let di = settingsPerUser[currentUser].perGame[gname];
		di.language = currentLanguage;
		di.PICS_PER_LEVEL = PICS_PER_LEVEL;
	}
	saveSettings();
}


function toggleSettings() {
	// let d=mBy('dSettings');
	// let x=isVisible2(mBy('dSettings'));
	// let settingsVisible = d.style.display!='none';
	// console.log('settings visible',x,d.style.display=='none')
	if (isVisible2('dSettings')) closeSettings(); else openSettings();
}

function setGame(event) {
	if (isString(event)) currentGame = event;
	else {
		event.cancelBubble = true;
		let id = evToClosestId(event);
		currentGame = 'g' + id.substring(1);
		//console.log('currentGame', currentGame);

		//copy settings from settigns to settingsPerGame[game]


		closeSettings();
	}
	startGame(currentGame);
}
function setLanguage(x) {
	//console.log('setting language to', x);
	currentLanguage = x;

	keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);
}
function setPicsPerLevel() {
	let inp = mBy('inputPicsPerLevel');
	inp.select();
	let x = getSelection();
	let n = Number(x.toString());
	inp.value = n;
	getSelection().removeAllRanges();
	//console.log(inp, x, n, inp.value)

	PICS_PER_LEVEL = n;
	SAMPLES_PER_LEVEL = new Array(20).fill(PICS_PER_LEVEL);
	boundary = SAMPLES_PER_LEVEL[level] * (1 + iGROUP);
	//console.log('boundary set to', boundary)
}



