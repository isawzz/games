const GFUNC = {
	gTouchPic: { init: initTP, initRound: roundTP, prompt: promptTP, activate: activateTP, eval: evalTP, level: levelTP },
	gWritePic: { init: initWP, initRound: roundWP, prompt: promptWP, activate: activateWP, eval: evalWP, level: levelWP },
	gMissingLetter: { init: initML, initRound: roundML, prompt: promptML, activate: activateML, eval: evalML, level: levelML },
	gSayPic: { init: initSP, initRound: roundSP, prompt: promptSP, activate: activateSP, eval: evalSP, level: levelSP },
}

window.onload = SPEECHStart;
window.onunload = saveSettings;

async function SPEECHStart() {

	//let a=stringAfterLeadingConsonants('drei'); console.log(a);return;
	//console.log(soundsSimilar('call', 'tall'));	return;
	
	//let x=allLettersContained('hallo','loa');console.log(x);return;
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();

	initTable();
	initSidebar();

	try{
		initSettingsP0();
	}catch{
		resetAllGamesAndUsersToHardcodedSettings();
	}

	if (immediateStart) startGame(); else openSettings();
}











