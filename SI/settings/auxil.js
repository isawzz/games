function initAux() {
		dMenu = mBy('dMenu');
		dProgram = mBy('dProgram');
		dGameSettings = mBy('dGameSettings');
}



//#region aux uis individually:
function createProgramSettingsUi() {
	console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLL')
	let dParent = mBy('dProgram');

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
	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'continue';
	mClass(b, 'buttonClass', 'buttonPlus');
	b.onclick = () => { closeProgramSettings(); } //startGame(); }


	let maintag = 'textarea';
	let ta = mCreate(maintag);
	ta.id = 'dSettings_ta';
	mAppend(dUpper, ta);
	mClass(ta, 'whMinus60');

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
function createGameSettingsUi() {
	let dParent = mBy('dGameSettings');
	

	let dGroup=mInputGroup(dParent);

	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);


	// let d = createCommonUi(dParent, resetGameSettingsToDefaults, () => { closeGameSettings(); startGame(); });
	// mText('NOT IMPLEMENTED!!!!!!!!!!!!!', d, { fz: 50 });

}











