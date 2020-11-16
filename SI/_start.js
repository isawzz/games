
window.onload = SessionStart;
//window.onunload = saveSettings;

async function SessionStart() {

	if (CLEAR_LOCAL_STORAGE) localStorage.clear();

	//#region asset loading and tests

	await loadCorrectWords();
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();

	//show('dRecord'); 
	//let a=stringAfterLeadingConsonants('drei'); console.log(a);return;
	//console.log(soundsSimilar('call', 'tall'));	return;

	//let x=allLettersContained('hallo','loa');console.log(x);return;

	// setKeys(['animals'], true, (k)=>lastOfLanguage(k,currentLanguage));
	// console.log(currentKeys.map(x=>x + ':' +lastOfLanguage(x,currentLanguage))); 
	// return;
	//#endregion
	initTable();
	initSidebar();

	CurrentSessionData = { user: currentUser, games: [] };

	initSettingsP0();
	//old speech regoc init
	speech00(currentLanguage);

	if (SHOW_FREEZER) show('freezer'); else startUnit();
}



async function startUnit() {

	ProgTimeout = false;
	setTimeout(() => ProgTimeout = true, ProgMinutes * 60 * 1000);

	await loadProgram();

	if (immediateStart && IS_TESTING) { hide('freezer'); show('divControls'); startGame(); }
	else if (immediateStart) { hide('divControls'); startGame(); }
	else { hide('freezer'); hide('divControls'); openSettings(); }
}


function onClickFreezer() { hide('freezer'); startUnit(); }
function onClickFreezer2() { clearTable(); mRemoveClass(mBy('freezer2'), 'aniSlowlyAppear'); hide('freezer2'); startUnit(); }
function onClickStartButton() {
	startGame(currentGame)
}
function onClickNextButton() {
	startRound(); //onClickStart
	//setTimeout(startRound_, DELAY);
}
function onClickRunButton() {
	StepByStepMode = false;
	startRound(); //onClickRun
	//setTimeout(startRound_, DELAY);
}
function onClickStopButton() {
	StepByStepMode = true;
	//setTimeout(startRound_, DELAY);
}


function testTimeString() {
	let w = '3 uhr dreißig uhr';
	console.log(w.trim(), w.trim().toUpperCase());
	let w1 = stringAfterLast(w, ' ');
	console.log('...w1', w1)
	let val = endsWith(w.trim().toUpperCase(), 'UHR');
	console.log('val', val)
	let x = isTimeString('3 uhr dreißig uhr'); console.log('x', x); return;
}










