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
	globalsFromSettings(); //TODO: phase out!? or rename initSettings

	//if (nundef(CurrentSessionData)) CurrentSessionData = { user: USERNAME, games: [] };

	Speech = new SpeechAPI('E');
	KeySets = getKeySets();

	if (BROADCAST_SETTINGS) {
		console.log('...broadcasting ...')
		broadcastSettings();
	}

	//console.log('loaded. ready.')
	//testHA(); return;
	//playGame('gMem');

	if (SHOW_FREEZER) show('freezer'); else startUnit();

}

function startUnit() {

	restartTime();

	loadProgram();
	UnitScoreSummary = {};

	if (EXPERIMENTAL) { hide('freezer'); hide('divControls'); startGame(); openAux('dGameSettings'); }
	else if (immediateStart && IS_TESTING) { hide('freezer'); if (StepByStepMode) show('divControls'); startGame(); }
	else if (immediateStart) { hide('divControls'); startGame(); }
	else if (IS_TESTING) { hide('freezer'); hide('divControls'); openProgramSettings(); }
	else { hide('freezer'); hide('divControls'); openAux('dMenu'); }
}













