function _start(){
	console.log('DONE!');
	
}


window.onload = _loader;
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
		_start0();
	} else { loadSIMA(_start0); }

}
async function _start0() {
	//timit.show('DONE');
	console.assert(isdef(DB));

	initLive();
	initTable();
	initSidebar();
	initAux();
	initScore();

	Speech = new SpeechAPI('E');

	KeySets = getKeySetsX();

	if (IS_TESTING) loadUser(Username); else loadUser();
	console.assert(isdef(G));
	_start();
}
