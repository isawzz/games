function changeGameTo(id) {
	if (isdef(id) && id == Gamename) return;
	if (isdef(T)) { saveTable(); }
	loadGame(id);
	loadTable();
}

function loadGame(id) {
	//console.log('________ id', id, 'Gamename', Gamename, 'DEF', DEFAULTUSERNAME)
	if (nundef(id)) id = localStorage.getItem('game');
	if (nundef(id)) id = Object.keys(DB.games)[0];

	G = lookup(DB, ['games', id]);
	G.color = getColorDictColor(G.color);
	G.id = Gamename = id;

	//console.log(Gamename, U);
	updateGamenameUi(id, G.color);

	Settings = DB.settings; //TODO: add to that user and game settings

}
function updateGamenameUi(id, color) {
	let uiName = 'spGame';
	let ui = mBy(uiName);
	if (nundef(ui)) {
		ui = mEditableOnEdited(uiName, dLineTopMiddle, 'game: ', '', changeGameTo, () => {
			console.log('Games', getGames());
		});
	}
	ui.innerHTML = id;
	mStyleX(ui, { fg: color });
}

