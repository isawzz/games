function canAct() { return uiActivated && !auxOpen && document.activeElement.id != 'spUser' && !isVisible2('freezer2'); }

function createInstance() {
	const ClassDict = { gKrieg: GKrieg, gAristo: GAristo };
	let creator = ClassDict[gid];
	let inst = new creator();
	return inst;
}
function startGame() {
	T.instance = createInstance();

	T.turnPlayerId = T.players[0].id;
	console.log('player is', T.turnPlayerId)

	if (T.turnPlayerId == Username) present();
	else passAndPlayScreen(T.turnPlayerId);
}
function stubMove(){
	//gamestate T muss irgendwie veraendert werden!
	//T,X,P,G,U
}
function passAndPlayScreen(plid) {
	if (Settings.mode == 'solo') {
		stubMove();
	} else {
		let d = mBy('dPassPlay');
		show(d);
		let d1 = mBy('dPP');
		d1.innerHTML = 'Player: ' + plid;
		mStyleX(d, { z: 20000, fz: 64 });
		//d.style.zIndex=20000;
	}
}
function onClickPassPlay() {
	changeUserTo(T.turnPlayerId);
	hide('dPassPlay');
	present();
}
function present() {
	//console.log('presenting for player', T.turnPlayerId);
	T.instance.present();

}
function activateUi() {
	Selected = null;
	uiActivated = true;
	T.instance.activate();

}




