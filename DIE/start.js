window.onload = _loader;
window.onunload = saveUser;

async function _loader() {

	if (!IS_TESTING) {
		ifPageVisible.on('blur', function () {
			// example code here..
			//animations.pause();
			enterInterruptState();
			console.log('stopping game', G.key)
		});

		ifPageVisible.on('focus', function () {
			// resume all animations
			// animations.resume();
			if (isdef(G.instance)) {
				updateUserScore();//this saves user data + clears the score.nTotal,nCorrect,nCorrect1!!!!!
				setGame(G.key);
			}
			closeAux();
			startGame();
			// auxOpen = false;
			// startGame();
			console.log('restarting game', G.key)
		});
	}
	// if ('serviceWorker' in navigator) {
	// 	console.log('CLIENT: service worker registration in progress.');
	// 	navigator.serviceWorker.register('/service-worker.js').then(function() {
	// 		console.log('CLIENT: service worker registration complete.');
	// 	}, function() {
	// 		console.log('CLIENT: service worker registration failure.');
	// 	});
	// } else {
	// 	console.log('CLIENT: service worker is not supported.');
	// }

	//timit = new TimeIt('start');
	if (BROADCAST_SETTINGS) {
		console.log('...broadcasting ...')
		await broadcastSIMA();
		_start();
	} else { loadSIMA(_start); }

}
async function _start() {
	console.assert(isdef(DB)); //user db is loaded

	//init features:

	Speech = new SpeechAPI('E');
	KeySets = getKeySets();

	initTable(); //table(=alles), dTable(=dLineTableMiddle), dTitle(=dLineTitleMiddle), dLine[Top,Title,Middle,Bottom][LMR]
	initSidebar(); //dLeiste

	//sollte hier haben: initUser, initGame, initSettings
	//game ohne user U macht keinen sinn,
	//settings und menu ohne game G macht keinen sinn!

	initAux(); // TODO: dAux das ist eigentlich settings!

	console.log('U',U,'Settings',Settings)
	return;

	if (IS_TESTING) loadUser(USERNAME); else loadUser(); //macht setGame
	console.assert(isdef(G))

	if (SHOW_FREEZER) show('freezer'); else startUnit();

}
function startUnit() {

	restartTime();
	U.session = {};

	if (PROD_START) { PROD_START = false; onClickTemple(); } else startGame();
}


