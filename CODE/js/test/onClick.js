async function onClickTest(btn) { await testEngine.clicked(btn.innerHTML); }

async function onClickNextTest() { testEngine.loadNextTestCase(); }
async function onClickRepeatTest() { testEngine.repeatTestCase(); }

function onClickVerify() { testEngine.verify(T); }

function recVerify(series, index, maxIndex) {
	if (index > maxIndex) return;
	else setTimeout(() => doNext(series, index, maxIndex), 1000);
}
async function doNext(series, index, mexIndex) {
	recVerify(series, index + 1, maxIndex);
}
async function onClickVerifySoFar() {
	console.log('______________ verify so far')
	clearElement(mBy('table'));
	let series = testEngine.series;
	let maxIndex = testEngine.index;
	let index = 0;
	await testEngine.loadTestCase(series, index);
	console.log('...completed', index);
	setTimeout(async () => { await verNext(series, index + 1, maxIndex); }, 1000);
}
async function verNext(series, index, maxIndex) {

	await testEngine.loadTestCase(series, index);
	console.log('...completed', index);
	updateOutput(T);


	// if (index < maxIndex) {
	// 	let func = async () => { await verNext(series, index + 1, maxIndex); }
	// 	await pollDOM(index, func);
	// }
	if (index < maxIndex) setTimeout(async () => { await verNext(series, index + 1, maxIndex); }, 1000);

}
function onClickSave() { testEngine.saveAsSolution(T); }
async function onClickClearTable() { clearElement('table'); }

// var __signal = false;
// async function pollDOM(i, func) {
// 	const el = mBy('message');
// 	if (isdef(el)) {
// 		if (el.innerHTML.includes('' + i)) {
// 			__signal = true;
// 			await func();
// 			// Do something with el
// 		}
// 	}
// 	else {
// 		__signal = false;
// 		setTimeout(() => console.log('waiting...'), 1000); // try again in 300 milliseconds
// 	}
// }


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

function onClickUpdateOutput(elem) { //, caption) {

	//if (nundef(caption)) caption = elem.id;
	//console.log('caption', caption, elem);
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