function enterInterruptState() {
	//haengt von implementation ab was das bedeutet!
	// CancelChain = true; //when using TaskChain
	chainCancel();
}

//#region control open and close of aux
function openAux() {
	auxOpen = true;
	show(dAux);
	show('dGo');

	enterInterruptState();

}
function closeAux() {
	hide(dAux);
	hide('dGo');
	show('dGear');
	show('dTemple');
	if (SettingsChanged) {
		saveSIMA();
	}
	SettingsChanged = false;
	auxOpen = false;
}


//#region aux buttons: computer, gear, temple
function onClickComputer() { }
function onClickGear() {
	console.log('opening settings: ui will be interrupted!!!')
	openAux();
	hide('dGear');
	createSettingsUi(dAux);
}
function onClickTemple() {
	//console.log('opening menu: ui will be interrupted!!!')
	openAux();
	hide('dTemple');

	createMenuUi(dAux);
}
function divKeyFromEv(ev) {
	//console.log('ev',ev)
	let id = evToClosestId(ev);
	let div = mBy(id);
	return div.key;
}
function onClickGo(ev) {

	let gKey = nundef(ev)? SelectedMenuKey: isString(ev) ? ev : divKeyFromEv(ev);

	//console.log('==>gKey', gKey, SelectedMenuKey);

	if (gKey != SelectedMenuKey) {
		if (isdef(SelectedMenuKey)) toggleSelectionOfPicture(MenuItems[SelectedMenuKey]);
		SelectedMenuKey = gKey;
		toggleSelectionOfPicture(MenuItems[gKey]);
	} else {
		closeAux();
		//console.log('GO!!!!!!!!!!');
		
		//playGame(gKey);
		startGame(gKey);

	}


}

//#region aux click handlers
function onClickResumeCurrent() { closeAux(); startLevel(); }
function onClickPlay() { closeAux(); startGame(); }
function onClickGame(ev) {

	let id = evToClosestId(ev);
	let prefix = stringAfter(id, '_');

	//which game is this?
	let vals = dict2list(GFUNC);
	//.log(vals);

	let item = firstCond(vals, x => x.friendlyName.startsWith(prefix));
	let seq = Settings.gameSequence.map(x => x.game);

	//console.log(item, item.id, seq, seq.indexOf(item.id))

	let idx = Settings.currentGameIndex = seq.indexOf(item.id);
	//let game = seq[Settings.currentGameIndex];

	console.assert(isdef(G.key), 'MENU: G.key NOT SET!!!!!!!!!!!!!!!')
	let dParent = mBy('dMenu');
	let picDivs = dParent.children[1].children;
	//console.log(dParent, picDivs)
	let divSelected = firstCond(picDivs, x => x.game == SelectedGameInAux);
	let divClicked = firstCond(picDivs, x => x.game == seq[idx]);
	SelectedGameInAux = divClicked.game;
	//console.log('click on', divClicked.game, divClicked);
	//console.log('selected was', divSelected.game, divSelected);
	if (divClicked == divSelected) {
		closeAux(true);
		startGame();

	} else {
		mClass(divClicked, 'framedPicture');
		mRemoveClass(divSelected, 'framedPicture');

	}//
	// mClass(div, 'framedPicture');
	// let picDivs = 
	// if (ev.target.game == G.key) {

	// }else{

	// 	mClass(ev.target,'framedPicture');
	// }
}
function onClickSettings() {
	closeAux(); openAux('dGameSettings');
}

//# region divControls
function onClickStartButton() { startGame(); }
function onClickNextButton() { startRound(); }
function onClickRunStopButton(b) { if (StepByStepMode) { onClickRunButton(b); } else { onClickStopButton(b); } }
function onClickRunButton(b) { b.innerHTML = 'Stop'; mStyleX(bRunStop, { bg: 'red' }); StepByStepMode = false; startRound(); }
function onClickStopButton(b) { b.innerHTML = 'Run'; mStyleX(bRunStop, { bg: 'green' }); StepByStepMode = true; }

//#region freezers
function onClickFreezer() { hide('freezer'); startUnit(); }
function onClickFreezer2(ev) {
	if (Settings.flags.pressControlToUnfreeze && !ev.ctrlKey) { console.log('*** press control!!!!'); return; }
	clearTable(); mRemoveClass(mBy('freezer2'), 'aniSlowlyAppear'); hide('freezer2'); startUnit();
}


















