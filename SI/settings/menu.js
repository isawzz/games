function initMainMenu() { dMenu = mBy('dMenu') }
function openMenu() { stopAus(); openAux('dMenu'); createMenuUi(); }
function closeMenu() { closeAux(); continueResume(); }
function toggleMenu() { if (isVisible2('dMenu')) closeMenu(); else openMenu(); }

function closeAux() {

	if (isVisible2('dMenu')) { }
	else if (isVisible2('dGameSettings')) { }
	else if (isVisible2('dProgram')) {

	}

	show('dMenuButton');
	show('dGameSettingsButton');
	show('dProgramButton');
	hide('dResumeCurrentButton');
	hide('dPlayButton');
	hide('dMenu');
	hide('dGameSettings');
	hide('dProgram');
}
function openAux(divName) {
	hide('dMenuButton');
	hide('dGameSettingsButton');
	hide('dProgramButton');
	if (isdef(dTable)) {
		clearElement(dTable);
		show('dResumeCurrentButton');
	} else {
		show('dPlayButton');
	}
	show(divName);

	if (divName == 'dMenu') { }
	else if (divName == 'dGameSettings') { }
	else if (divName == 'dProgram') {

	}

}
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
	closeMenu();
	startGame();
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


