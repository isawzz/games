const GFUNC = {
	gTouchPic: { init: initTP, initRound: roundTP, prompt: promptTP, activate: activateTP, eval: evalTP },
	gWritePic: { init: initWP, initRound: roundWP, prompt: promptWP, activate: activateWP, eval: evalWP },
	// gSayPic: { init: initSP, initRound: roundSP, prompt: promptSP, activate: activateSP, eval: evalSP },
	gMissingLetter: { init: initML, initRound: roundML, prompt: promptML, activate: activateML, eval: evalML },
}

window.onload = SPEECHStart;
// window.onunload = saveSettings;

async function SPEECHStart() {

	//let x=allLettersContained('hallo','loa');console.log(x);return;
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();

	initTable();
	initSidebar();
	initSettingsP0();

	if (immediateStart) startGame(); else openSettings();
}











