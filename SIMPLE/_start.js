
window.onload = SessionStart;
//window.onunload = saveProgram; //saveSettings;

async function SessionStart() {
	await loadCorrectWords(); await loadAssets(); ensureSymBySet(); makeHigherOrderGroups();

	initTable();
	initSidebar();
	initSettingsP0();

	CurrentSessionData = { user: currentUser, games: [] };

	if (SHOW_FREEZER) show('freezer');else 	startUnit();
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
function onClickFreezer2() { 	clearTable(); mRemoveClass(mBy('freezer2'), 'aniSlowlyAppear'); hide('freezer2'); startUnit(); }
function onClickStartButton() { startGame(currentGame) }
function onClickNextButton() { startRound(); }
function onClickRunButton() { StepByStepMode = false; startRound(); }
function onClickStopButton() { StepByStepMode = true; }











