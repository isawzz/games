function onClickAdd() { testAddObject(WR.inc); }
function onClickAddBoard() { testAddBoard(WR.inc); }
function onClickRemove() { testRemoveObject(WR.inc); }
function onClickRemoveBoard() { testRemoveBoard(WR.inc); }

// function onClick_Remove() { testRemoveOidKey(WR.inc); }
// function onClick_Add() { testAddOidKey(WR.inc); }

function onClickActivate() {
	testActivate(WR.inc);
}
function onClickDeactivate() {
	testDeactivate(WR.inc);
}

function onClickUpdateOutput(elem, caption) {

	if (nundef(caption)) caption = elem.id;
	//console.log('caption', caption, elem);
	switch (caption) {
		case 'contSpec': SHOW_SPEC = !SHOW_SPEC; break;
		case 'contUiTree': SHOW_UITREE = !SHOW_UITREE; break;
		case 'contRTree': SHOW_RTREE = !SHOW_RTREE; break;
		case 'contOidNodes': SHOW_OIDNODES = !SHOW_OIDNODES; break;
		case 'contDicts': SHOW_DICTIONARIES = !SHOW_DICTIONARIES; break;
		case 'contRefsIds': SHOW_REFS_IDS = !SHOW_REFS_IDS; break;
	}
	updateOutput(WR.inc);
}


function onClickNextExample() { }
function onClickStep() { }