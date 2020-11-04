const GFUNC = {
	gTouchPic: { init: initTP, initRound: roundTP, prompt: promptTP, activate: activateTP, eval: evalTP },
	gWritePic: { init: initWP, initRound: roundWP, prompt: promptWP, activate: activateWP, eval: evalWP },
	gSayPic: { init: initSP, initRound: roundSP, prompt: promptSP, activate: activateSP, eval: evalSP },
	gMissingLetter: { init: initML, initRound: roundML, prompt: promptML, activate: activateML, eval: evalML },
}

window.onload = SPEECHStart;

async function SPEECHStart() {
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();

	initTable();
	initSidebar();
	initSettings();

	if (immediateStart) startGame(currentGame); else openSettings();
}











