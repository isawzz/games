function cleanupOldGame() {
	if (nundef(G)) return;

	//bei den alten games wird updateUserScore aufgerufen
	//sollte eine app class haben
	//die soll implementieren: app.cleanupGame
	if (isdef(G.clear)) G.clear();
	G = null;
}
function setGame(gname) {
	cleanupOldGame();
	//console.log('the current user game is', gname);
	G=jsCopy(DB.games[gname]);
	G.key = gname;
	G.status = 'waitingForPlayers';

}
function instantiateGame(){
	G.instance = new getInstance(G);
	//console.log(G.players)
	//throw new Error();
	copyKeys(G,G.instance,{instance:true,div:true});
	G=G.instance;
	console.log('G',G)
}
function startGame(){
	instantiateGame();
	G.addPlayer
	G.startGame();

	if (nundef(G.numPhases)) G.lastPhaseIndex=0; else G.lastPhaseIndex=G.numPhases-1;
	G.phaseIndex = -1;
	selectPhase();
}
function selectPhase(){
	G.phaseIndex+=1;
	if (G.phaseIndex > G.lastPhaseIndex) endGame();
	else startPhase();
}
function startPhase(){
	G.playerIndex=-1;
	if (isdef(G.startPhase)) G.startPhase();
	selectPlayerOnTurn();
}
function passAndPlayScreen(){
	let d=mBy('freezer');
	show(d);
	d.innerHTML='Player: '+G.playerOnTurn.id;
	d.style.zIndex=20000;
}
function selectPlayerOnTurn(){
	G.playerIndex+=1;
	if (G.playerIndex >= G.players.length) endRound();
	G.playerOnTurn = G.players[G.playerIndex];
	console.log(G.players,G.playerIndex,G.playerOnTurn)
	passAndPlayScreen();
	startRound();
}
function startRound(){
	
	G.startRound();
}
function endRound(){console.log('round over!')}
function endGame(){console.log('game over!')}

