function loadGame(){
	
	//find tables where it is this user's turn
	let tables = dict2list(DB.tables);
	tables = tables.filter(x=>x.getPlayerIds())


	let lastGame = U.getLastGame();
	if (nundef(lastGame)) lastGame = U.getAvailableGames()[0];
	console.log('lastGame =', lastGame)
	if (isdef(lastGame)) setGame(lastGame);

}