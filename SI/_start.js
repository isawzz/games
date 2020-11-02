const GFUNC = {
	gWritePic: {init:initWP,initRound:roundWP,prompt:promptWP,activate:activateWP,eval:evalWP},
	gTouchPic: {init:initTP,initRound:roundTP,prompt:promptTP,activate:activateTP,eval:evalTP},
}

window.onload = SPEECHStart;

async function SPEECHStart() {
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();

	//hide(dSettings);
	// addEventListener('dblclick', (ev) => {
	// 	toggleSettings();
	// 	// if (ev.ctrlKey && ev.key == 'q') {
	// 	// 	toggleSettings();
	// 	// }
	// });

	initTable();
	initSidebar();

	//resetState();

	if (immediateStart) startGame(currentGame); else openSettings();

	//if (immediateStart) setGame(currentGame); 

}

function setGame(event){

	if (isString(event)) currentGame=event; 
	else {
		event.cancelBubble = true;
		let id = evToClosestId(event);
		currentGame ='g'+id.substring(1);
		console.log('currentGame',currentGame);
		closeSettings();
	}
	startGame(currentGame);
}











