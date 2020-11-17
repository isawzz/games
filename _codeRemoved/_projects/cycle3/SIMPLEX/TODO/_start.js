window.onload = SessionStart;
//window.onunload = saveProgram; //saveSettings;
async function SessionStart() {

	//let x=differInAtMost('dope', 'doe', 1); console.log(x); return;
	if (CLEAR_LOCAL_STORAGE) localStorage.clear();

	await loadCorrectWords(); await loadAssets(); ensureSymBySet(); makeHigherOrderGroups();

	//setTimeout(_startSpeechTraining, 2000);	return;
	_startPlaying();
}
function _startSpeechTraining() {

	// //testAccessor(); return;
	// //let infos = getInfolist({cats:['animal']}); return;

	initTable();
	Speech = new SpeechFeature(MASTER_VOLUME);

	//speechTraining(); return;
	testSimilar01('hand'); return;
	testLanguageChange(); return;
	testWait(); return;
	testRecognizeAdvanced();return;
	testRecognize2(); return;
	testPromise(); return; //GEHT NICHT!!!
	testRecognize(); return;
	testStartAgainAfterStartingRecorder(); return;
	testChangingLangAfterStartingRecorder(); return;
	let infos = getSymbols();
	console.log(infos);
	let w = infos[0].best;

	//let onRecorderStart = () => Speech.say(w);
	let onRecorderStart = () => Speech.setRecordingLanguage('D');

	Speech.record({ onStart: onRecorderStart, delayStart: 2000, retry: true });

}

function _startPlaying(){

	//ich wollte testen ob download geht:nein geht nicht!
	// let o={hallo:1,das:2};
	//downloadAsYaml(o,'testfile');

	initTable();
	initSidebar();
	initSettingsP0();

	CurrentSessionData = { user: currentUser, games: [] };

	//old speech regoc init
	speech00(currentLanguage);

	if (SHOW_FREEZER) show('freezer'); else startUnit();
}

async function startUnit() {

	ProgTimeout = false;
	setTimeout(() => ProgTimeout = true, ProgMinutes * 60 * 1000);

	await loadProgram();

	if (immediateStart && IS_TESTING) { hide('freezer'); if (StepByStepMode) show('divControls'); startGame(); }
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












