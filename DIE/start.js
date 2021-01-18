window.onload = _loader;
window.onunload = ()=>dbSave('boardGames');

async function _loader() {
	//#region deactivate when page left, serviceWorker commented, timit
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
	//#endregion
	if (BROADCAST_SETTINGS) {
		console.log('...broadcasting ...')
		await dbInit('boardGames');
		_start();
	} else { dbLoad('boardGames',SERVERURL,_start); }

}
async function _start() {
	console.assert(isdef(DB)); //user db is loaded

	Speech = new SpeechAPI('E');
	KeySets = getKeySets();

	initTable(); //table(=alles), dTable(=dLineTableMiddle), dTitle(=dLineTitleMiddle), dLine[Top,Title,Middle,Bottom][LMR]
	initSidebar(); //dLeiste
	initAux(); // TODO: dAux das ist eigentlich settings!

	userInit(Username);

	//sollte hier haben: initUser, initGame, initSettings
	//game ohne user U macht keinen sinn,
	//settings und menu ohne game G macht keinen sinn!
	return;

	if (IS_TESTING) loadUser(Username); else loadUser(); //macht setGame
	console.assert(isdef(G))

	if (SHOW_FREEZER) show('freezer'); else startUnit();

}
function startUnit() {

	restartTime();
	U.session = {};

	if (PROD_START) { PROD_START = false; onClickTemple(); } else startGame();
}


