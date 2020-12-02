function initAux() {
		dMenu = mBy('dMenu');
		dDev = mBy('dDev');
		dGameSettings = mBy('dGameSettings');
}
function openAux(divName) {

	if (divName == 'dDev' && !DEV_MODE) return;
	stopAus(); 
	hide('dMenuButton');
	hide('dGameSettingsButton');
	if (DEV_MODE) hide('dDevButton');

	if (isdef(dTable)) {
		clearElement(dTable);
		show('dResumeCurrentButton');
	} else {
		show('dPlayButton');
	}

	show(divName);

	if (divName == 'dMenu') { createMenuUi();	}
	else if (divName == 'dGameSettings') {createGameSettingsUi(); }
	else if (divName == 'dDev') {		createDevSettingsUi();	}
}

function closeAux() {

	if (isVisible2('dMenu')) { }
	else if (isVisible2('dGameSettings')) { gameSettingsUiToSettings(); }
	else if (isVisible2('dDev')) {
		console.log('DEV NOT IMPLEMENTED')
	}

	show('dMenuButton');
	show('dGameSettingsButton');
	if (DEV_MODE) {show('dDevButton');hide('dDev');}
	hide('dMenu');
	hide('dGameSettings');

	continueResume();

	if (isVisible2(dPlayButton)) {hide('dPlayButton');startGame();}
	else {hide('dResumeCurrentButton');startLevel();}
	

}

//#region aux uis individually:
function createDevSettingsUi() {
	console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLL')
	let dParent = mBy('dDev');

	clearElement(dParent);
	mClass(dParent, 'hMinus60');
	let dUpper = mDiv(dParent);
	mClass(dUpper, 'hPercentMinus60');
	let bdiv = mDiv(dParent); mStyleX(bdiv, { height: 54, align: 'right' });
	let b;

	if (DEV_MODE) {
		b = mCreate('button');
		mAppend(bdiv, b);
		b.innerHTML = 'transfer to server';
		mClass(b, 'buttonClass', 'buttonPlus');
		b.onclick = transferServerDataToServer;

		b = mCreate('button');
		mAppend(bdiv, b);
		b.innerHTML = 'download';
		mClass(b, 'buttonClass', 'buttonPlus');
		b.onclick = transferServerDataToClient;

		b = mCreate('button');
		mAppend(bdiv, b);
		b.innerHTML = 'reset to defaults';
		mClass(b, 'buttonClass', 'buttonPlus');
		b.onclick = resetSettingsToDefaults;


	}
	// b = mCreate('button');
	// mAppend(bdiv, b);
	// b.innerHTML = 'continue';
	// mClass(b, 'buttonClass', 'buttonPlus');
	// b.onclick = () => { closeProgramSettings(); } //startGame(); }


	let maintag = 'textarea';
	let ta = mCreate(maintag);
	ta.id = 'dSettings_ta';
	mAppend(dUpper, ta);
	mClass(ta, 'whMinus60');

}
function createGameSettingsUi() {
	let dParent = mBy('dGameSettings');
	clearElement(dParent);

	let dGroup=mInputGroup(dParent);

	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);

	dGroup = mInputGroup(dParent);
	

	// let d = createCommonUi(dParent, resetGameSettingsToDefaults, () => { closeGameSettings(); startGame(); });
	// mText('NOT IMPLEMENTED!!!!!!!!!!!!!', d, { fz: 50 });

}
function createMenuUi() {
	let dParent = mBy('dMenu');

	if (!isEmpty(dParent.children)) return;

	mAppend(dParent, createElementFromHTML(`<h1>Choose Game:</h1>`));

	let d = mDiv(dParent);
	mClass(d, 'flexWrap');
	d.style.height = '100%';

	let games = Settings.program.gameSequence.map(x => x.game);
	let labels = games.map(g => GFUNC[g].friendlyName);
	let keys = games.map(g => GFUNC[g].logo);
	let bgs = games.map(g => GFUNC[g].color);

	// console.log(games)
	//console.log('-----------------bgs', bgs);

	let pics = maShowPictures(keys, labels, d, onClickGame, { bgs: bgs, shufflePositions: false });
	pics.map(x => x.div.id = 'menu_' + x.label.substring(0, 3));
}

//#region click handlers
function onClickResumeCurrent() { closeAux(); startLevel(); }
function onClickPlay() { closeAux(); startGame(); }
function onClickGame(ev) {

	let id = evToClosestId(ev);
	let prefix = stringAfter(id, '_');

	//which game is this?
	let vals = dict2list(GFUNC);
	console.log(vals);

	let item = firstCond(vals, x => x.friendlyName.startsWith(prefix));
	let seq = Settings.program.gameSequence.map(x => x.game);

	console.log(item, item.id, seq, seq.indexOf(item.id))

	Settings.program.currentGameIndex = seq.indexOf(item.id);
	closeAux('dMenu');
	startGame();
}

function gameSettingsUiToSettings(){
	//need to set settings or not???
	console.log('gameSettingsUiToSettings')
}








