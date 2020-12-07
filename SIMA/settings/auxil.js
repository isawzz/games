var SelectedGameInAux;
function initAux() {
	dMenu = mBy('dMenu');
	dDev = mBy('dDev');
	dGameSettings = mBy('dGameSettings');
	updateComplexSettings();
}
function updateComplexSettings() {

	G.key = Settings.gameSequence[Settings.currentGameIndex].game;

	Settings.language = Settings.Settings.language;

	Settings.categories = Settings.Settings.categories;

	Settings.reducedAnimations = Settings.flags.reducedAnimations;

	updateLabelSettings();

	if (Settings.showTime) { show(mBy('time')); startTime(); }
	else hide(mBy('time'));

	
}

function updateLabelSettings() {
	if (Settings.showLabels == 'toggle') Settings.labels = true;
	else Settings.labels = (Settings.showLabels == 'always');
}

function openAux(divName) {

	if (divName == 'dDev' && !DEV_MODE) return;
	stopAus();
	hide('dTemple');
	hide('dGear');
	if (DEV_MODE) hide('dComputer');

	if (isdef(dTable) && divName != 'dMenu') {
		clearElement(dTable);
		show('dResumeCurrentButton');
	} else {
		show('dPlayButton');
	}

	show(divName);

	if (divName == 'dMenu') { show('dSettingsButton'); createMenuUi(); }
	else if (divName == 'dGameSettings') { createGameSettingsUi(); }
	else if (divName == 'dDev') { createDevSettingsUi(); }
}

function closeAux(done = false) {

	if (isVisible2('dMenu')) { hide('dSettingsButton');}
	else if (isVisible2('dGameSettings')) {
		var x = document.activeElement;
		//console.log('focus is on:',x)
		if (isdef(x.keyList)) setSettingsKeys(x);
		else if (isdef(x.game)) setSettingsKeysSelect(x);

		saveServerData();

	}
	else if (isVisible2('dDev')) {
		console.log('DEV NOT IMPLEMENTED')
	}

	updateComplexSettings();

	show('dTemple');
	show('dGear');
	if (DEV_MODE) { show('dComputer'); hide('dDev'); }
	hide('dMenu');
	hide('dGameSettings');

	continueResume();



	if (isVisible2(dPlayButton)) { hide('dPlayButton'); }
	else { hide('dResumeCurrentButton'); }


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
	//console.log('current game is', G.key)
	let dParent = mBy('dGameSettings');
	clearElement(dParent);
	mAppend(dParent, createElementFromHTML(`<h1>Settings common to all games:</h1>`));

	let nGroupNumCommonAllGames = mInputGroup(dParent);
	setzeEineZahl(nGroupNumCommonAllGames, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(nGroupNumCommonAllGames, 'minutes', 1, ['program', 'minutesPerUnit']);
	setzeEineZahl(nGroupNumCommonAllGames, 'correct streak', 5, ['program', 'incrementLevelOnPositiveStreak']);
	setzeEineZahl(nGroupNumCommonAllGames, 'fail streak', 2, ['program', 'decrementLevelOnNegativeStreak']);
	setzeEineZahl(nGroupNumCommonAllGames, 'trials', 3, ['program', 'trials']);
	setzeEinOptions(nGroupNumCommonAllGames, 'show labels', ['toggle', 'always', 'never'], 'toggle', ['program', 'showLabels']);
	setzeEinOptions(nGroupNumCommonAllGames, 'language', ['E', 'D'], 'E', ['program', 'Settings.language']);
	setzeEinOptions(nGroupNumCommonAllGames, 'vocabulary', [25, 50, 75, 100], 25, ['program', 'vocab']);

	//let nGroupOther = mInputGroup(dParent);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'show time', false, ['program', 'showTime']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'spoken feedback', true, ['program', 'spokenFeedback']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'switch game after max level', false, ['program', 'switchGame']);

}
function createMenuUi() {
	let dParent = mBy('dMenu');

	if (isEmpty(dParent.children)) {

		mAppend(dParent, createElementFromHTML(`<h1>Choose Game:</h1>`));

		let d = mDiv(dParent);
		mClass(d, 'flexWrap');
		d.style.height = '100%';

		let games = Settings.gameSequence.map(x => x.game);
		let labels = games.map(g => GFUNC[g].friendlyName);
		let keys = games.map(g => GFUNC[g].logo);
		let bgs = games.map(g => GFUNC[g].color);

		// console.log(games)
		//console.log('-----------------bgs', bgs);

		let pics = maShowPictures(keys, labels, d, onClickGame, { bgs: bgs, shufflePositions: false });
		for (let i = 0; i < pics.length; i++) {
			let p = pics[i];
			//console.log(p)
			p.div.id = 'menu_' + p.label.substring(0, 3);
			p.game = games[i];
			p.div.game = p.game;
		}
		//pics.map(x => x.div.id = 'menu_' + x.label.substring(0, 3));
	}else{
		for(const div of dParent.children[1].children){
			mRemoveClass(div,'framedPicture')
		}
	}

	console.assert(isdef(G.key), 'MENU: G.key NOT SET!!!!!!!!!!!!!!!');
	let picDivs = dParent.children[1].children;
	//console.log(dParent, picDivs)
	let div = firstCond(picDivs, x => x.game == G.key)
	mClass(div, 'framedPicture');
	SelectedGameInAux = G.key;
}





