var container;
async function _start() {
	//DB has {users,games,tables,settings} set
	initLive();
	loadUser(); // Username===U.id, U has {id,avGames,games,session,settings.color,tables} 
	loadGame(); // G set hat {type,color,friendly,logo,numPlayers,type}
	loadTable(); // T set hat {}
	I = new GGuess(T.id,U,G,T);
	I.loop();
	//startGame();

	
	//test03_2Hands(); //test03_splayHand();//	test03_addToSplayed();//test03_addToZone();	// test03_habenItemsEinZNachSplay();
	//test03_centerToCenter();

	return;
	//initGame();
	//initSettings();

	//onClickTemple();
	//console.log('last game was:', User.getLastGame());
	if (PROD_START) { PROD_START = false; onClickTemple(); } else startGame();
}

function updateBubbleColors(e) {
	const w = window.innerWidth / 255;
	const h = window.innerHeight / 255;
	const x = parseInt(e.pageX / w, 10);
	const y = parseInt(e.pageY / h, 10);

	const r = x;
	const g = (y - 255) * -1;
	const b = x <= y ? y - x : 0;

	container.style.setProperty('--colorEnd', `rgb(${r},${g},${b})`);
}

window.onload = _loader;
window.onbeforeunload = () => {
	if (IS_TESTING) return;
	_saveAll();
	return "onbeforeunload"; //for reasons unknown MUSS ich das return statement machen sonst macht er das _saveAll nicht!!!!
}
function _saveAll() {
	saveUser();
	//saveSettings();
	//saveGames();
	dbSave('boardGames');
}
async function _loader() {
	//#region deactivate when page left, serviceWorker commented, timit
	if (!IS_TESTING) {
		ifPageVisible.on('blur', function () {
			//enterInterruptState();
			// console.log('stopping game', G.id)
			_saveAll();
			return 'hallo'
		});

		ifPageVisible.on('focus', function () {
			// if (isdef(G.instance)) {
			// 	updateUserScore();//this saves user data + clears the score.nTotal,nCorrect,nCorrect1!!!!!
			// 	setGame(G.id);
			// }
			// closeAux();
			// startGame();
			// console.log('restarting game', G.id)
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
		prelim();
	} else { dbLoad('boardGames', prelim); }

}
function prelim() {
	//onclick = _saveAll;
	console.assert(isdef(DB)); //user db is loaded
	//console.log('DB',DB)

	Speech = new SpeechAPI('E');
	KeySets = getKeySets();
	TO = new TimeoutManager();

	initTable(); //table(=alles), dTable(=dLineTableMiddle), dTitle(=dLineTitleMiddle), dLine[Top,Title,Middle,Bottom][LMR]
	initSidebar(); //dLeiste
	initAux(); // TODO: dAux das ist eigentlich settings+menu

	// *** hier hab einfach nur einen empty screen!!! ***
	//listUsers();//koennt jetzt oben pro user einen button haben fuer login

	_start();

}