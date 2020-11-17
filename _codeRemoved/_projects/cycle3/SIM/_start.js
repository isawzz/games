
window.onload = SessionStart;
//window.onunload = saveProgram; //saveSettings;

async function SessionStart() {

	//let x=differInAtMost('dope', 'doe', 1); console.log(x); return;

	await loadCorrectWords(); await loadAssets(); ensureSymBySet(); makeHigherOrderGroups();

	//return;
	// setKeys({ cats: ['kitchen'], lang: 'D', wLast: true }); console.log('currentKeys', currentKeys); return;


	initTable();
	initSidebar();
	initSettingsP0();

	CurrentSessionData = { user: currentUser, games: [] };
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

//divControls
function onClickStartButton() { startGame(); }
function onClickNextButton() { startRound(); }
function onClickRunStopButton(b) {
	console.log('args', b)
	if (StepByStepMode) { onClickRunButton(b); } else { onClickStopButton(b); }
}
function onClickRunButton(b) { b.innerHTML = 'Stop'; mStyleX(bRunStop, { bg: 'red' }); StepByStepMode = false; startRound(); }
function onClickStopButton(b) { b.innerHTML = 'Run'; mStyleX(bRunStop, { bg: 'green' }); StepByStepMode = true; }











