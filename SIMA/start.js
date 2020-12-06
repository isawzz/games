window.onload = _loader;
window.onunload = saveServerData;

async function _loader() {
	//timit = new TimeIt('start');
	if (BROADCAST_SETTINGS) {
		console.log('...broadcasting ...')
		await broadcastSIMA();
		_start();
	}else{loadSIMA(_start);}
	
	console.assert(isdef(DB))
}
async function _start() {

	//timit.show('DONE');
	loadUser();
	
	initTable();
	initSidebar();
	initAux();

	return;
	globalsFromSettings(); //TODO: phase out!? or rename initSettings

	//if (nundef(CurrentSessionData)) CurrentSessionData = { user: USERNAME, games: [] };

	Speech = new SpeechAPI('E');
	KeySets = getKeySets();


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













