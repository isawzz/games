async function onClickTest(btn) { await testEngine.clicked(btn.innerHTML); }

async function onClickGo(){
	let elem=mBy('iTestCase');
	console.log(elem)
	let n=elem.value;
	n=firstNumber(n)
	console.log(n,typeof n)
	await testEngine.loadTestCase(testEngine.series,n);
	await present00(testEngine.spec, testEngine.defs, testEngine.sdata);
}

async function onClickNextTest() {
	await testEngine.loadNextTestCase();
	await present00(testEngine.spec, testEngine.defs, testEngine.sdata);
}
async function onClickPrevTest() {
	await testEngine.loadPrevTestCase();
	await present00(testEngine.spec, testEngine.defs, testEngine.sdata);
}
async function onClickRepeatTest() {
	await testEngine.repeatTestCase();
	await present00(testEngine.spec, testEngine.defs, testEngine.sdata);
}

function onClickVerify() { testEngine.verify(T); }

function recVerify(series, index, maxIndex) {
	if (index > maxIndex) return;
	else setTimeout(() => doNext(series, index, maxIndex), 1000);
}
async function doNext(series, index, mexIndex) {
	recVerify(series, index + 1, maxIndex);
}
async function onClickVerifySoFar() {
	console.log('______________ verify so far');
	testEngine.autosave = true;
	clearElement(mBy('table'));
	let series = testEngine.series;
	let maxIndex = testEngine.index;
	let index = 0;
	await testEngine.loadTestCase(series, index);
	await present00(testEngine.spec, testEngine.defs, testEngine.sdata);
	console.log('...completed', index);
	setTimeout(async () => { await verNext(series, index + 1, maxIndex); }, 1000);
}
function onClickInvalidate() { testEngine.invalidate(); }
async function verNext(series, index, maxIndex) {

	await testEngine.loadTestCase(series, index);

	await present00(testEngine.spec, testEngine.defs, testEngine.sdata);

	let timeOUT = 500;
	if (index < maxIndex) setTimeout(async () => { await verNext(series, index + 1, maxIndex); }, timeOUT);
	else { saveSolutions(series, testEngine.Dict[series].solutions); }

}
function onClickSave() { testEngine.saveSolution(T); }
async function onClickClearTable() { clearElement('table'); }



function onClickAdd() { testAddObject(T); }
function onClickAddBoard() { testAddBoard(T); }
function onClickRemove() { testRemoveObject(T); }
function onClickRemoveBoard() { testRemoveBoard(T); }

// function onClick_Remove() { testRemoveOidKey(T); }
// function onClick_Add() { testAddOidKey(T); }

function onClickActivate() {
	testActivate(T);
}
function onClickDeactivate() {
	testDeactivate(T);
}

function onClickUpdateOutput(elem) { 

	switch (elem.id) {
		case 'contSpec': SHOW_SPEC = !SHOW_SPEC; break;
		case 'contLastSpec': SHOW_LASTSPEC = !SHOW_LASTSPEC; break;
		case 'contUiTree': SHOW_UITREE = !SHOW_UITREE; break;
		case 'contRTree': SHOW_RTREE = !SHOW_RTREE; break;
		case 'contOidNodes': SHOW_OIDNODES = !SHOW_OIDNODES; break;
		case 'contDicts': SHOW_DICTIONARIES = !SHOW_DICTIONARIES; break;
		case 'contRefsIds': SHOW_IDS_REFS = !SHOW_IDS_REFS; break;
	}
	updateOutput(T);
}


function onClickNextExample() { }
function onClickStep() { }