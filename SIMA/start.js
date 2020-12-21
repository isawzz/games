window.onload = _loader;
window.onunload = saveRealUser;

async function _loader() {
	//timit = new TimeIt('start');
	if (BROADCAST_SETTINGS) {
		console.log('...broadcasting ...')
		await broadcastSIMA();
		_start();
	} else { loadSIMA(_start); }

}
async function _start() {
	//timit.show('DONE');
	console.assert(isdef(DB));

	initTable();
	initSidebar();
	initAux();
	initScore();


	Speech = new SpeechAPI('E');
	KeySets = getKeySets();
	//console.log(KeySets)

	loadUser(); //sets G,U,GS,Settings
	console.assert(isdef(G))

	// console.log(dTable);
	// let keys = choose(symKeysBySet['animals'], 1);
	// keys = ['butterfly'];
	// maShowPicturesX3(keys, undefined, dTable, null,
	// 	{ lang: 'D', repeat: 2, showRepeat: true, colors: ['red', 'blue'] },
	// 	{ sCont: { w: 200, h:200, padding: 10, align: 'center' }, sPic: { contrast: .3 }, sText: {} });
	if (SHOW_FREEZER) show('freezer'); else startUnit();

}

function startUnit() {

	restartTime();
	if (nundef(U.session)) U.session = {};
	//console.log('---_startUnit: session', U.session);

	//hier soll U.session laden 
	UnitScoreSummary = {};

	if (PROD_START) { PROD_START = false; onClickTemple(); } else startGame();
	//show('freezer2')
	//onClickCalibrate();
	//onClickTemple();

}













