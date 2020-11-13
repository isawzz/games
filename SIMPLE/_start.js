
window.onload = SessionStart;
window.onunload = saveProgram; //saveSettings;

async function SessionStart() {
	await loadCorrectWords(); await loadAssets(); ensureSymBySet(); makeHigherOrderGroups();

	initTable();
	initSidebar();
	initSettingsP0();

	CurrentSessionData = { user: currentUser, games: [] };
	setTimeout(()=>ProgTimeout=true,ProgMinutes*60*1000);
	loadProgram();

	if (immediateStart && IS_TESTING) { hide('freezer'); show('divControls'); startGame(); }
	else if (immediateStart) { show('freezer'); hide('divControls'); }
	else { hide('freezer'); hide('divControls'); openSettings(); }
}


function onClickFreezer() { hide('freezer'); startGame(); }
function onClickStartButton() { startGame(currentGame) }
function onClickNextButton() { startRound(); }
function onClickRunButton() { StepByStepMode = false; startRound(); }
function onClickStopButton() { StepByStepMode = true; }











