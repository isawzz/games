var container;

function _spgameStart(){
	console.assert(isdef(DB));

	initLive();
	initTable();
	initSidebar();
	initAux();
	initScore();
	//initSymbolTableForGamesAddons(); //creates Daat
	
	//initAddons(); //old API ==>deprecate
	//addonFeatureInit(); //new API!

	Speech = new SpeechAPI('E');

	console.log('Syms',Syms)
	KeySets = getKeySetsX();

	Settings={language:'E'}

	test04_textItems();

}
function _startTest(){

	//test03_komischeBubbles();

	test03_2Hands(); //test03_splayHand();//	test03_addToSplayed();//test03_addToZone();	// test03_habenItemsEinZNachSplay();
	//test03_centerToCenter();

}

async function _start() {

	// _spgameStart(); return;
	//_startTest();	return;

	//DB has {users,games,tables,settings} set
	initLive();
	loadUser(); // Username===U.id, U has {id,avGames,games,session,settings.color,tables} 
	loadGame(); // G set hat {type,color,friendly,logo,numPlayers,type}
	loadTable(); // T set hat {}

	I = new GGuess(T.id,U,G,T);
	I.loop();	//startGame();
	
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
	if (CLEAR_LOCAL_STORAGE) localStorage.clear();

	C52 = await localOrRoute('C52', '../assets/c52.yaml');
	Syms = await localOrRoute('Syms', '../assets/syms.yaml');
	SymKeys = Object.keys(Syms);
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
	KeySets = getKeySetsX();

	//****************** bis hierher ist also genau gleich!!!!!!!!!!!!!!!!!!!!! *************** */

	TO = new TimeoutManager();

	initTable(); //table(=alles), dTable(=dLineTableMiddle), dTitle(=dLineTitleMiddle), dLine[Top,Title,Middle,Bottom][LMR]
	initSidebar(); //dLeiste
	initAux(); // TODO: dAux das ist eigentlich settings+menu

	// *** hier hab einfach nur einen empty screen!!! ***
	//listUsers();//koennt jetzt oben pro user einen button haben fuer login

	_start();

}