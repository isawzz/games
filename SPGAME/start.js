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
async function makeDictionaries(){
	// let ddd = await route_path_yaml_dict('../assets/ddAlles.yaml');
	// console.log(ddd)
	let ddd = await route_path_text('../assets/ddAlles.txt');
	console.log(ddd)
	let lines = ddd.split('\n');
	console.log(lines);
	let newLines = [];
	let deDict={};
	let edDict={};
	for(let i=0;i<lines.length;i++){
		let l=lines[i];
		if (startsWith(l,'German')) console.log(l);
		else if (startsWith(l,'A ')) console.log(l);
		else {
			newLines.push(l);
			let d=stringBefore(l,' :');
			let info={isNoun:false};
			if (d.includes('{')) {
				let parts = d.split('{');
				d=parts[0].trim();
				gen=stringBefore(parts[1],'}').trim();
				// d=stringBefore(d,'{').trim();
				// let gen = stringBefore(stringAfter(d,'{'),'}');
				info = {isNoun:true,gen:gen};
			}
			let elist=stringAfter(l,': ').split(',').map(x=>x.trim());
			for(const e of elist) {
				lookupAddIfToList(deDict,[d,'e'],e);
				lookupAddIfToList(edDict,[e,'d'],d);
			}
			deDict[d].info=info;
		}
		if (i>100) break;
	}
	console.log(deDict);
	console.log(edDict);
	downloadTextFile(newLines.join('\n'), 'ddText', ext = 'txt')
	downloadAsYaml(deDict, 'deDict');
	downloadAsYaml(edDict,'edDict');
}
async function _start() {
	//timit.show('DONE');
	console.assert(isdef(DB));

	initLive();
	initTable();
	initSidebar();
	initAux();
	initScore();
	initSymbolTableForGamesAddons(); //creates Daat

	//initAddons(); //old API ==>deprecate
	addonFeatureInit(); //new API!

	Speech = new SpeechAPI('E');

	KeySets = getKeySets();

	if (IS_TESTING) loadUser(Username); else loadUser();
	console.assert(isdef(G));

	await makeDictionaries();

	//test04_textItems(); return;
	//let x=substringOfMinLength(' ha a ll adsdsd',3,3);console.log('|'+x+'|');return;
	// test06_submit(); return;
	//addonScreen(); return;
	//onclick=()=>test05_popup('think about the passcode!',24001); return;
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

function initSymbolTableForGamesAddons() {
	//console.log('Daat', Daat);//yes this is an empty dict!
	Daat.GameClasses = {
		gTouchPic: GTouchPic, gNamit: GNamit,
		gTouchColors: GTouchColors, gPremem: GPremem, gMem: GMem, gMissingLetter: GMissingLetter,
		gMissingNumber: GMissingNumber, gWritePic: GWritePic, gSayPic: GSayPic, gSteps: GSteps, gElim: GElim,
		gAnagram: GAnagram, gAbacus: GAbacus, gPasscode: GPasscode

	}
}


