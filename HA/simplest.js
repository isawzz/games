
function playGame(key) {
	G = GAME[key];
	prelim();
	G.f();
	console.log('playing',G.friendly)
}
function gMem() {
	// let result=showPics(dParent);console.log('result',result.map(x=>x.label));return;

	let chain = [
		{ f: instruct, parr: ['', 'remember all pictures!', dTitle, false] },
		{ f: showPics, parr: [dTable, { num: 2 }], msecs: 500 },
		{ f: turnPicsDown, parr: ['_last', 2000, true], msecs: 2000 },
		{ f: () => { }, parr: [], msecs: 2000 },
		{ f: setPicsAndGoal, parr: ['_first'] },
		{ f: instruct, parr: ['_last', 'click', dTitle, true] },
		{ f: activate, parr: [{ onclickPic: revealAndSelectOnClick }] },
		{ f: evalSelectGoal, parr: [], waitCond: () => Selected != null },
		{ f: scorePlus1IfWin, parr: ['_last'] },

	];
	let onComplete = res => {
		//console.log('DONE', res, '\n===>Goal', Goal, '\n===>Pictures', Pictures);
		setTimeout(() => playGame('gMem'), 2000);
	}
	chainEx(chain, onComplete);

	return 'mem';
	//first place a card on table
	//let t1={f:startAni1,cmd:}
}

