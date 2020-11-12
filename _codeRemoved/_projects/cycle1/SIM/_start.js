const GFUNC = {
	gTouchPic: { startGame: startGameTP, startRound: startRoundTP, prompt: promptTP, activate: activateTP, eval: evalTP, currentLevel: levelTP },
	gWritePic: { startGame: startGameWP, startRound: startRoundWP, prompt: promptWP, activate: activateWP, eval: evalWP, currentLevel: levelWP },
	gMissingLetter: { startGame: startGameML, startRound: startRoundML, prompt: promptML, activate: activateML, eval: evalML, currentLevel: levelML },
	gSayPic: { startGame: startGameSP, startRound: startRoundSP, prompt: promptSP, activate: activateSP, eval: evalSP, currentLevel: levelSP },
}

window.onload = SPEECHStart;
//window.onunload = saveSettings;

async function SPEECHStart() {

	//let a=stringAfterLeadingConsonants('drei'); console.log(a);return;
	//console.log(soundsSimilar('call', 'tall'));	return;
	
	//let x=allLettersContained('hallo','loa');console.log(x);return;
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();

	initTable();
	initSidebar();

	initSettingsP0();
	// try{
	// 	initSettingsP0();
	// }catch{
	// 	resetAllGamesAndUsersToHardcodedSettings();
	// }

	if (immediateStart) startGame(); else openSettings();
}











