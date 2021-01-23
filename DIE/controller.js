function createInstance(gid, players, state) {
	const ClassDict = { gKrieg: GKrieg, gAristo: GAristo };
	let creator = ClassDict[gid];
	let inst = new creator(players, state);
	return inst;
}
function startGame() {
	T = createInstance(T.game, T.players, T.state);

	T.turnPlayerId=T.players[T.index].id;
	console.log('player is',T.turnPlayerId)

	if (T.turnPlayerId == Username) present(); else passAndPlayScreen(T.turnPlayerId);
}
function passAndPlayScreen(plid){
	let d=mBy('dPassPlay');
	show(d);
	let d1=mBy('dPP');
	d1.innerHTML='Player: '+plid;
	mStyleX(d,{z:20000,fz:64});
	//d.style.zIndex=20000;
}
function onClickPassPlay(){
	changeUserTo(T.turnPlayerId);
	hide('dPassPlay');
	present();
}
function present() {
	console.log('presenting for player',T.turnPlayerId);
	T.present();
	
}




