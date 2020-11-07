const GFUNC = {
	gTouchPic: { startGame: startGameTP,startLevel:startLevelTP, startRound: startRoundTP, prompt: promptTP, activate: activateTP, eval: evalTP, prepLevel: levelTP },
	gTouchColors: { startGame: startGameTC,startLevel:startLevelTC, startRound: startRoundTC, prompt: promptTC, activate: activateTC, eval: evalTC, prepLevel: levelTC },
	gWritePic: { startGame: startGameWP,startLevel:startLevelWP, startRound: startRoundWP, prompt: promptWP, activate: activateWP, eval: evalWP, prepLevel: levelWP },
	gMissingLetter: { startGame: startGameML,startLevel:startLevelML, startRound: startRoundML, prompt: promptML, activate: activateML, eval: evalML, prepLevel: levelML },
	gSayPic: { startGame: startGameSP,startLevel:startLevelSP, startRound: startRoundSP, prompt: promptSP, activate: activateSP, eval: evalSP, prepLevel: levelSP },
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











