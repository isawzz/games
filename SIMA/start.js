window.onload = _loader;
window.onunload = saveSIMA;

async function _loader() {
	//timit = new TimeIt('start');
	if (BROADCAST_SETTINGS) {
		console.log('...broadcasting ...')
		await broadcastSIMA();
		_start();
	}else{loadSIMA(_start);}
	
}
async function _start() {

	//timit.show('DONE');
	console.assert(isdef(DB));
	
	initTable();
	initSidebar();
	initAux();

	Speech = new SpeechAPI('E');
	KeySets = getKeySets();
	//console.log(KeySets)

	loadUser(); //sets G,U,GS,Settings
	console.assert(isdef(G))



	//console.log('loaded. ready.')
	//testHA(); return;
	//playGame('gMem');

	if (SHOW_FREEZER) show('freezer'); else startUnit();

}

function startUnit() {

	restartTime();

	UnitScoreSummary = {};

	onClickTemple();

	// if (EXPERIMENTAL) { hide('freezer'); hide('divControls'); startGame(); openAux('dGameSettings'); }
	// else if (immediateStart && IS_TESTING) { hide('freezer'); if (StepByStepMode) show('divControls'); startGame(); }
	// else if (immediateStart) { hide('divControls'); startGame(); }
	// else if (IS_TESTING) { hide('freezer'); hide('divControls'); openProgramSettings(); }
	// else { hide('freezer'); hide('divControls'); openAux('dMenu'); }
}













