window.onload = SessionStart();// ()=>loadSession();
//window.onunload = saveSession;

// async function loadSession_yet(){
// 	fetch('http://localhost:3000/users/1', {
// 		method: 'GET',
// 		headers: {
// 			'Accept': 'application/json',
// 			'Content-Type': 'application/json'
// 		},
// 		// body: JSON.stringify(payload)
// 	}).then(data => {
// 		CurrentSessionData = await data.json();
// 		console.log(CurrentSessionData);
// 		SessionStart();
// 	});
// }

async function loadSession(){
	fetch('http://localhost:3000/users/1', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		// body: JSON.stringify(payload)
	}).then(async data => {
		let d = await data.json();
		CurrentSessionData = d.session;
		console.log(CurrentSessionData);
		SessionStart();
	});
}
async function saveSession() {
	//localStorage.
	console.log('posting...');

	let payload = {
		"id": 1,
		"session": CurrentSessionData,
		"email": "john@doe.com"
	};
	fetch('http://localhost:3000/users/1', {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	}).then(data => {
		console.log(data);
	});

}
function zTesting() {
	//initTable();
	onclick = ev => {
		console.log('CLICK!')
		if (ev.ctrlKey) {
			console.log('CLICK!!!')
			saveSession();
		}
	}

	// //testAccessor(); return;
	// //let infos = getInfolist({cats:['animal']}); return;

	//console.log(alphaToHex(.5),alphaToHex(.25),alphaToHex(.75));
	//let x=differInAtMost('dope', 'doe', 1); console.log(x); return;
}
async function SessionStart() {
	zTesting();
	if (CLEAR_LOCAL_STORAGE) localStorage.clear();

	await loadAssets(); ensureSymBySet(); makeHigherOrderGroups(); await loadBestKeys();

	//console.log('deutsch:',BestKeysD);
	//console.log('english:',BestKeysE);

	//setTimeout(_startSpeechTraining, 2000);	return;
	//_startSpeechTraining(); return;
	await _startPlaying();
	//console.log(symbolDict)
}
function _startSpeechTraining() {

	initTable();
	Speech = new SpeechFeature(1, 'E');

	//testConf2(); return;
	//testConfidence();return;
	//trainBritishGuy('ring'); return;

	//#region prev tests
	//trainDeutsch('wind face'); //trainZira(); //testp7(); //testp6(); //testp5(); //testp4(); 
	// testp2(); return;
	//testp0(); return;
	//speechTraining(); return;

	testSimilar01('hand'); return;
	testLanguageChange(); return;
	testWait(); return;
	testRecognizeAdvanced(); return;
	testRecognize2(); return;
	testPromise(); return; //GEHT NICHT!!!
	testRecognize(); return;
	testStartAgainAfterStartingRecorder(); return;
	testChangingLangAfterStartingRecorder(); return;

	testBasicRecord(); return;
	//#endregion
}

async function _startPlaying() {

	//ich wollte testen ob download geht:nein geht nicht!
	// let o={hallo:1,das:2};
	//downloadAsYaml(o,'testfile');

	initTable();
	initSidebar();

	await initSettingsX();

	if (nundef(CurrentSessionData)) CurrentSessionData = { user: currentUser, games: [] };
	//CurrentSessionData = { user: currentUser, games: [] };

	//old speech regoc init
	// speech00(currentLanguage);
	Speech = new SpeechFeature(1, 'E'); //MASTER_VOLUME);

	if (SHOW_FREEZER) show('freezer'); else startUnit();
}

async function startUnit() {

	clearProgramTimer();
	restartProgramTimer();

	await loadProgram();

	if (EXPERIMENTAL) { hide('freezer'); hide('divControls'); openSettings(); }
	else if (immediateStart && IS_TESTING) { hide('freezer'); if (StepByStepMode) show('divControls'); startGame(); }
	else if (immediateStart) { hide('divControls'); startGame(); }
	else { hide('freezer'); hide('divControls'); openSettings(); }
}


function onClickFreezer() { hide('freezer'); startUnit(); }
function onClickFreezer2(ev) {
	//console.log('____________onClickFreezer2',ev);
	if (!ev.ctrlKey) {
		console.log('*** press control!!!!')
		return;
	}
	clearTable(); mRemoveClass(mBy('freezer2'), 'aniSlowlyAppear'); hide('freezer2'); startUnit();
}

//divControls
function onClickStartButton() { startGame(); }
function onClickNextButton() { startRound(); }
function onClickRunStopButton(b) {
	console.log('args', b)
	if (StepByStepMode) { onClickRunButton(b); } else { onClickStopButton(b); }
}
function onClickRunButton(b) { b.innerHTML = 'Stop'; mStyleX(bRunStop, { bg: 'red' }); StepByStepMode = false; startRound(); }
function onClickStopButton(b) { b.innerHTML = 'Run'; mStyleX(bRunStop, { bg: 'green' }); StepByStepMode = true; }












