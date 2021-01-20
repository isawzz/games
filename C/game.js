function cleanupOldGame() {
	if (nundef(G) || nundef(G.instance)) return;

	//bei den alten games wird updateUserScore aufgerufen
	//sollte eine app class haben
	//die soll implementieren: app.cleanupGame
	

	G.instance.clear();
	G.instance = null;
}

function setGame(gname) {
	cleanupOldGame();
	//console.log('the current user game is', gname);
	G=jsCopy(DB.games[gname]);
}
function startGame(){
	
}

