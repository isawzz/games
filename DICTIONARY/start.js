function _start(){
	console.log('DONE!');

	//now I want 
}


window.onload = _loader;
async function _loader() {
	if (CLEAR_LOCAL_STORAGE) localStorage.clear();

	C52 = await localOrRoute('C52', '../assets/c52.yaml');
	Syms = await localOrRoute('Syms', '../assets/syms.yaml');
	SymKeys = Object.keys(Syms);

	if (BROADCAST_SETTINGS) {
		console.log('...broadcasting ...')
		await dbInit('boardGames','../assetsTEST/DATA/');
		_start0();
	} else { dbLoad('boardGames', _start0); }

}
async function _start0() {
	//timit.show('DONE');
	console.assert(isdef(DB));

	initLive();
	initTable();
	initSidebar();
	initAux();
	initScore();

	Speech = new SpeechAPI('E');

	KeySets = getKeySetsX();

	_start();
}
