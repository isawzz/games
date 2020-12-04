function playGame(gFunc) {
	gFunc();
}

function gMem() {
	let dParent = dTable;
	clearElement(dParent);
	Pictures = Goal = Selected = null;
	// let result=showPics(dParent);console.log('result',result.map(x=>x.label));return;

	let chain = [
		{ f: instruct, parr: ['', '<b></b>', dTitle, false] },
		{ f: showPics, parr: [dTable, { clickHandler: revealAndSelectOnClick, num: 2 }], msecs: 500 },
		{ f: turnPicsDown, parr: ['_last', 2000, true], msecs: 2000 },
		{ f: wait, parr: [], msecs: 2000 },
		{ f: setPicsAndGoal, parr: ['_first'] },
		{ f: instruct, parr: ['_last', 'click', dTitle, true] },
		{ f: activateUi, parr: [] },
		{ f: evalSelectGoal, parr: [], waitCond: () => Selected != null },
	];
	let onComplete = res => { console.log('DONE', res, '\n===>Goal', Goal, '\n===>Pictures', Pictures); setTimeout(playGame(gMem), 2000); }
	chainEx(chain, onComplete);

	//first place a card on table
	//let t1={f:startAni1,cmd:}
}
