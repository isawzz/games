const GFUNC = {
	gTouchPic: { init: initTP, initRound: roundTP, prompt: promptTP, activate: activateTP, eval: evalTP },
	gWritePic: { init: initWP, initRound: roundWP, prompt: promptWP, activate: activateWP, eval: evalWP },
	gSayPic: { init: initSP, initRound: roundSP, prompt: promptSP, activate: activateSP, eval: evalSP },
	gMissingLetter: { init: initML, initRound: roundML, prompt: promptML, activate: activateML, eval: evalML },
}

window.onload = SPEECHStart;

async function SPEECHStart() {
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();

	//hide(dSettings);
	// addEventListener('dblclick', (ev) => {
	// 	toggleSettings();
	// 	// if (ev.ctrlKey && ev.key == 'q') {
	// 	// 	toggleSettings();
	// 	// }
	// });

	initTable();
	initSidebar();
	initSettings();

	//resetState();

	if (immediateStart) startGame(currentGame); else openSettings();

	//if (immediateStart) setGame(currentGame); 

}

function onClickPicsPerLevelSet() {
	let inp = mBy('inputPicsPerLevel');
	inp.select();
	let x = getSelection();
	//console.log(typeof x,x,x.toString(),inp, inp.textContent,inp.nodeValue);

	let n = Number(x.toString());
	//console.log('===>',typeof n,n);

	inp.value = n;

	//inp.unselect();
	getSelection().removeAllRanges();

	SAMPLES_PER_LEVEL = new Array(20).fill(n);
	boundary = SAMPLES_PER_LEVEL[level] * (1 + iGROUP);

}
function onClickLanguage(x) { console.log('setting language to', x); setLanguage(x); console.log(currentLanguage) }
function setLanguage(x) {
	currentLanguage = x;
	keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);

}
function initSettings() {
	let iLanguage = mBy('input' + currentLanguage);
	console.log(iLanguage);
	iLanguage.checked = true;
}

function setGame(event) {

	if (isString(event)) currentGame = event;
	else {
		event.cancelBubble = true;
		let id = evToClosestId(event);
		currentGame = 'g' + id.substring(1);
		console.log('currentGame', currentGame);
		closeSettings();
	}
	startGame(currentGame);
}











