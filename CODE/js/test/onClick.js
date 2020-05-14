async function onClickTest(btn) { await testEngine.clicked(btn.innerHTML); }
function onClickVerify() { testEngine.verify(T); }
function onClickSave() { testEngine.saveAsSolution(T); }
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

function onClickUpdateOutput(elem){ //, caption) {

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