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




//#region testing
function tests() {

	test04_taskChain(); return;
	test02_msToTime(); return;
	test01_maPic();

}
function test01_maPic() {
	console.log(symbolDict['horse']);
	console.log('UserHistory', UserHistory);
	let d2 = maPic('horse', table, { bg: 'green', w: 200, h: 200 });

}
function test02_msToTime() {
	let ms = timeToMs(1, 20, 23);
	console.log(msToTime(ms));

	console.log(Date.now());
	let ts = new Date();
	console.log(ts)
	let diff = new Date().getTimezoneOffset()
	console.log(msToTime(diff * 60 * 1000));

	let t = new Date();
	t.setHours(2, 0, 0);
	ts = t.getTime()

	let el = msElapsedSince(ts);
	console.log(msToTime(el))
}
function test03_saveServerData() {
	//change some server data
	UserHistory.email = 'hallo@hallo.com';
	Settings.program.minutesPerUnit = 100;
	saveServerData();


}
function test04_taskChain() {
	let dParent = mBy('table');
	// let result=showPics(dParent);console.log('result',result.map(x=>x.label));return;

	let chain = [
		{ f: instruct, parr: ['', '<b></b>', dTitle, false] },
		{ f: showPics, parr: [dParent, { clickHandler: revealAndSelectOnClick, num: 2 }], msecs: 500 },
		{ f: turnPicsDown, parr: ['_last', 2000, true], msecs: 2000 },
		{ f: () => { }, parr: [], msecs: 2000 },
		{ f: setPicsAndGoal, parr: ['_first'] },
		{ f: instruct, parr: ['_last', 'click', dTitle, true] },
		{ f: activateUi, parr: [] },
		{ f: evalSelectGoal, parr: [], waitCond: () => Selected != null },
	];
	let onComplete = res => console.log('DONE', res, '\n===>Goal', Goal, '\n===>Pictures', Pictures);
	chainEx(chain, onComplete);

	//first place a card on table
	//let t1={f:startAni1,cmd:}
}
//#endregion


















