//#region RSG_SOURCE & menus
function hideMenu(desc) {
	let d = mBy('div' + desc);
	console.log('........isVisible', desc, isVisible(d));
	if (isVisible(d)) {
		let b = mBy('b' + desc);
		hide(d);
		b.innerHTML = '+' + desc[0];
	}

}
function onClickToggleInteractivity(desc) {
	let d = mBy('div' + desc);
	console.log('_____________isVisible', desc, isVisible(d));
	console.log('toggle interactivity', desc, d, isVisible(d));
	if (isVisible(d)) { hideMenu(desc); } else { showMenu(desc); }
}
function setRSG_SOURCE(val) {

	if (RSG_SOURCE == 'test' && val == 'main') {
		let d = mBy('table');
		clearElement(d);
		d.style.minHeight = 0;
		d.style.minWidth = 0;
	}
	RSG_SOURCE = val;

	showMenu(val);
}
function showMenu(desc) {
	let d = mBy('div' + desc);
	//console.log('.........isVisible', desc, isVisible(d));
	if (!isVisible(d)) {
		let b = mBy('b' + desc);
		show(d);
		d.style.display = 'inline';
		b.innerHTML = '-' + desc[0];
	}

}
//#endregion

//#region new tests using abspos.js (RSG_SOURCE='test')
function onClickRepeatTestOfSeries() {
	setRSG_SOURCE('test');
	iTEST -= 1; if (iTEST < 0) iTEST = 0;
	nextTestOfSeries(false);
}
function onClickPrevTestOfSeries() {
	setRSG_SOURCE('test');
	iTEST -= 2; if (iTEST < 0) iTEST = 0;
	nextTestOfSeries();
}
function onClickResetTest() {
	setRSG_SOURCE('test');
	//iTESTSERIES = Math.max(iTESTSERIES - 1, 0);
	iTEST = 0;
	//resetUIDs();
}
function onClickNextTestOfSeries() {
	setRSG_SOURCE('test');
	nextTestOfSeries();
}
function onClickAllTests() {
	setRSG_SOURCE('test');
	runAllTests();
}
function onClickAllTestSeries() {
	iTESTSERIES = 0;
	onClickResetTest();
	runAllTestSeries();
}
//#endregion

//#region RSG_SOURCE = 'other'
function onClickMeasure() {
	recMeasureOverride(R.tree.uid, R);
	updateOutput(R);
}
function onClickAddLocObject() {
	//addNewlyCreatedServerObjects(sdata, R);
	//console.log('halllllllllllooooooooooooooooo')
	let o = {
		oid: 'loc2ta',
		obj_type: 'robberta',
		name: 'hallo2',
		loc: 'loc3ta'
	};
	let o2 = {
		oid: 'loc1ta',
		obj_type: 'robberta',
		name: 'hallo1',
		loc: 'loc2ta'
	};
	if (isdef(R.getO('loc2ta'))) o = o2;
	R.addObject(o.oid, o); R.addRForObject(o.oid);
	let success = einhaengen(o.oid, o, R);

	//recAdjustDirtyContainers(R.tree.uid, R, true);
	//setTimeout(() => {
	recMeasureOverride(R.tree.uid, R)
	//output and testing
	updateOutput(R);
	//}, 200);


}
function onClickResizeBoard() {
	let nuiBoard = R.uiNodes['_2'];
	nuiBoard.adirty = true;

	lookupSetOverride(nuiBoard, ['resizeInfo', 'fields'], 180);
	//console.log('resizeInfo',nuiBoard.resizeInfo)

	//recAdjustDirtyContainers(R.tree.uid, R, true);
	recMeasureOverride(R.tree.uid, R);

}
function onClickSmallerBoard() {
	let nuiBoard = R.uiNodes['_2'];
	//console.log('nuiBoard vor resizing to smaller:',nuiBoard)
	nuiBoard.adirty = true;
	lookupSetOverride(nuiBoard, ['resizeInfo', 'fields'], 32);
	//console.log('resizeInfo',nuiBoard.resizeInfo)

	//recAdjustDirtyContainers(R.tree.uid, R, true);
	recMeasureOverride(R.tree.uid, R);

}
//#endregion

//#region RSG_SOURCE = 'main'
async function onClickClearTable() { 
	clearElement('table'); clearUpdateOutput(); T = {}; 
	mBy('table').style.minWidth = 0; mBy('table').style.minHeight = 0;
	resetUIDs();
}

async function onClickGo() {
	setRSG_SOURCE('main');
	let elem = mBy('iTestCase');
	//console.log(elem)
	let n = elem.value;
	n = firstNumber(n)
	//console.log(n,typeof n)
	await testEngine.loadTestCase(testEngine.series, n);
	//await present00_(testEngine.spec, testEngine.defs, testEngine.sdata);
	await rParse(RSG_SOURCE, { defs: testEngine.defs, spec: testEngine.spec, sdata: testEngine.sdata });
}
function onClickInvalidate() { testEngine.invalidate(); }

async function onClickNextTest() {
	setRSG_SOURCE('main');
	await testEngine.loadNextTestCase();
	await rParse(RSG_SOURCE, { defs: testEngine.defs, spec: testEngine.spec, sdata: testEngine.sdata });
}
async function onClickPrevTest() {
	setRSG_SOURCE('main');
	await testEngine.loadPrevTestCase();
	await rParse(RSG_SOURCE, { defs: testEngine.defs, spec: testEngine.spec, sdata: testEngine.sdata });
	// await present00_(testEngine.spec, testEngine.defs, testEngine.sdata);
}
async function onClickRepeatTest() {
	setRSG_SOURCE('main');
	await testEngine.repeatTestCase();
	await rParse(RSG_SOURCE, { defs: testEngine.defs, spec: testEngine.spec, sdata: testEngine.sdata });
	// await present00_(testEngine.spec, testEngine.defs, testEngine.sdata);
}
async function onClickRun() {
	setRSG_SOURCE('main');
	let indexFrom = firstNumber(mBy('iTestCaseFrom').value);
	localStorage.setItem('iTestCaseFrom', indexFrom);
	let indexTo = firstNumber(mBy('iTestCaseTo').value);
	localStorage.setItem('iTestCaseTo', indexTo);
	verifySequence(indexFrom, indexTo, false);
}
async function onClickRunAll() {
	setRSG_SOURCE('main');
	STOP = false;
	isTraceOn = false;
	console.log('===> isTraceOn', isTraceOn)
	let sel = mBy('selSeries');
	let listSeries = [];
	for (const ch of sel.children) {
		//console.log(ch.value);
		if (ch.value != 'none') listSeries.push(DIR_TESTS + ch.value);
	}
	let imax = await testEngine.loadSeries(listSeries[0]);
	show('btnStop');
	//return;
	//console.log('_______ *NEW SERIES: ', listSeries[0]);
	await runNextSeries(listSeries, listSeries[0], 0, imax);
}
function onClickSave() { testEngine.saveSolution(T); }

function onClickStop() { STOP = true; hide('btnStop'); }

function onClickVerify() { testEngine.verify(T); }

async function onClickVerifySoFar() { verifySequence(0, testEngine.index, true); }

async function onTestSeriesChanged() {

	//achtung!!! er muss die richtigen sdata laden!!!!!!!!!
	let series = mBy('selSeries').value;
	if (series == 'none') return;

	// await testEngine.init(DEFS, sData, series);
	// await present00_(testEngine.spec, testEngine.defs, testEngine.sdata);

	await testEngine.loadSeries(series);
	onClickClearTable();
	onClickRepeatTest();

	// let imax = await testEngine.loadTestCase(series,0);

}

//helpers => gehoert in testEngine???
async function doNext(series, index, mexIndex) {
	recVerify(series, index + 1, maxIndex);
}
function recVerify(series, index, maxIndex) {
	if (index > maxIndex) return;
	else setTimeout(() => doNext(series, index, maxIndex), 1000);
}
async function runNextSeries(listSeries, series, from, to) {
	let timeOUT = 500;

	if (isEmpty(listSeries)) {
		console.log('*** ALL TESTS COMPLETED! ***');
		hide('btnStop');
		isTraceOn = SHOW_TRACE;
		return;
	} else if (STOP) {
		STOP = false;
		isTraceOn = SHOW_TRACE;
		hide('btnStop');
		//console.log('*** TEST RUN INTERRUPTED!!! ***');
		return;
	} else if (from >= to) {
		let series = testEngine.series;
		removeInPlace(listSeries, series);
		if (isEmpty(listSeries)) {
			console.log('*** ALL TESTS COMPLETED! ***');
			STOP = false;
			isTraceOn = SHOW_TRACE;
			hide('btnStop');
			return;
		}
		series = listSeries[0];
		//console.log('_______ *NEW SERIES: ', series);
		let imax = await testEngine.loadSeries(series);
		setTimeout(async () => { await runNextSeries(listSeries, series, 0, imax); }, timeOUT * 2);
	} else {
		let series = listSeries[0];
		let index = from;
		await testEngine.loadTestCase(series, index);
		await rParse(RSG_SOURCE, { defs: testEngine.defs, spec: testEngine.spec, sdata: testEngine.sdata });
		// await present00__(testEngine.spec, testEngine.defs, testEngine.sdata);

		setTimeout(async () => { await runNextSeries(listSeries, series, from + 1, to); }, timeOUT);
	}
}
async function verNext(series, index, maxIndex, saveOnCompleted = false) {
	//console.log('______________ vernext',series,index);

	await testEngine.loadTestCase(series, index);
	await rParse(RSG_SOURCE, { defs: testEngine.defs, spec: testEngine.spec, sdata: testEngine.sdata });

	// await present00_(testEngine.spec, testEngine.defs, testEngine.sdata);

	let timeOUT = 500;
	if (index < maxIndex && !STOP) setTimeout(async () => { await verNext(series, index + 1, maxIndex, saveOnCompleted); }, timeOUT);
	else if (saveOnCompleted) { STOP = false; saveSolutions(series, testEngine.Dict[series].solutions); }

}
async function verifySequence(indexFrom, indexTo, saveOnCompleted = false) {
	show('btnStop');
	console.log('______________ verify from', indexFrom, 'to', indexTo, 'save', saveOnCompleted);
	testEngine.autosave = true;
	clearElement(mBy('table'));
	let series = testEngine.series;
	let maxIndex = indexTo;
	let index = indexFrom;
	//console.log('______________ vernext',series,index);
	await testEngine.loadTestCase(series, index);
	await rParse(RSG_SOURCE, { defs: testEngine.defs, spec: testEngine.spec, sdata: testEngine.sdata });
	//console.log(testEngine.sdata)
	// await present00_(testEngine.spec, testEngine.defs, testEngine.sdata);
	//console.log('...completed', index);
	setTimeout(async () => { await verNext(series, index + 1, maxIndex, saveOnCompleted); }, 1000);

}



//#endregion main

//#region interact

function onClickAdd() { testAddObject(T); }

function onClickAddBoard() { addBoard(T); }

function onClickAddRobber() { addRobber(T); }

function onClickActivate() { testActivate(T); }

function onClickDeactivate() { testDeactivate(T); }

function onClickRemove() { testRemoveObject(T); }

function onClickRemoveBoard() { removeBoard(T); }

function onClickRemoveRobber() { removeRobber(T); }

//#endregion

function onClickUpdateOutput(elem) {

	switch (elem.id) {
		case 'contSpec': if (LEAVE_SPEC_OPEN) SHOW_SPEC = true; else SHOW_SPEC = !SHOW_SPEC; break;
		case 'contMixinSpec': SHOW_MIXINSPEC = !SHOW_MIXINSPEC; break;
		case 'contLastSpec': SHOW_LASTSPEC = !SHOW_LASTSPEC; break;
		case 'contUiTree': SHOW_UITREE = !SHOW_UITREE; break;
		case 'contRTree': SHOW_RTREE = !SHOW_RTREE; break;
		case 'contOidNodes': SHOW_OIDNODES = !SHOW_OIDNODES; break;
		case 'contDicts': SHOW_DICTIONARIES = !SHOW_DICTIONARIES; break;
		case 'contRefsIds': SHOW_IDS_REFS = !SHOW_IDS_REFS; break;
	}
	updateOutput(R);
}



