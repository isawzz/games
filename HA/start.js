window.onload = _login;
window.onunload = saveServerData;

async function _login() {
	//should load last user per default or guest
	USERNAME = localStorage.getItem('user'); if (nundef(USERNAME)) USERNAME = 'guest';
	loadAll(USERNAME, './settings/', _start);
}

async function _start() {

	for (const k in GAME) { GAME[k].f = window[k]; GAME[k].key = k; }
	initTable();
	initSidebar();
	initAux();

	//if (nundef(CurrentSessionData)) CurrentSessionData = { user: USERNAME, games: [] };

	Speech = new SpeechAPI('E');
	KeySets = getKeySets();

	startTime();

	if (BROADCAST_SETTINGS) {
		console.log('...broadcasting ...')
		broadcastSettings();
	}

	//tests(); return;
	playGame('gMem'); return;

	if (SHOW_FREEZER) show('freezer'); else startUnit();


}

function startUnit() {

	startProgramTimer();

	loadProgram();
	UnitScoreSummary = {};

	if (EXPERIMENTAL) { hide('freezer'); hide('divControls'); startGame(); openAux('dGameSettings'); }
	else if (immediateStart && IS_TESTING) { hide('freezer'); if (StepByStepMode) show('divControls'); startGame(); }
	else if (immediateStart) { hide('divControls'); startGame(); }
	else if (IS_TESTING) { hide('freezer'); hide('divControls'); openProgramSettings(); }
	else { hide('freezer'); hide('divControls'); openAux('dMenu'); }
}























