window.onload = _loader;
window.onunload = saveUser;

async function _loader() {

	if (!IS_TESTING) {
		ifPageVisible.on('blur', function () {
			// example code here..
			//animations.pause();
			enterInterruptState();
			console.log('stopping game', G.id)
		});

		ifPageVisible.on('focus', function () {
			// resume all animations
			// animations.resume();
			if (isdef(G.instance)) {
				//cleanupOldGame();//this saves user data + clears the score.nTotal,nCorrect,nCorrect1!!!!!
				setGame(G.id);
			}
			closeAux();
			startGame();
			// auxOpen = false;
			// startGame();
			console.log('restarting game', G.id)
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
	//timit.show('DONE');
	console.assert(isdef(DB));

	initTable();
	initSidebar();
	initAux();
	initScore();

	Speech = new SpeechAPI('E');
	
	KeySets = getKeySets();

	if (IS_TESTING) loadUser(Username); else loadUser();
	console.assert(isdef(G));

	onclick=()=>test05_popup('think about the passcode!',24001); return;
	//test05_popup(); return; //test04_blankPageWithMessageAndCountdownAndBeep();return;
	// test12_vizOperationOhneParentDiv(); return;
	//test12_vizNumberOhneParentDiv();return;
	//test12_vizArithop(); return;
	//test11_zViewerCircleIcon(); return;
	//test11_zItemsX(); return;
	//test03_maShowPictures(); return;
	//let keys = symKeysByType.icon;	keys=keys.filter(x=>x.includes('tower'));	console.log(keys);	iconViewer(keys);	return;

	//onClickTemple(); return;
	if (ALLOW_CALIBRATION) show('dCalibrate');
	if (SHOW_FREEZER) show('freezer'); else startUnit();

}
function startUnit() {

	restartTime();
	U.session = {};
	if (PROD_START) { PROD_START = false; onClickTemple(); } else startGame();

}


