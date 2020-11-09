const GFUNC = {
	gTouchPic: { startGame: startGameTP,startLevel:startLevelTP, startRound: startRoundTP,trialPrompt:trialPromptTP, prompt: promptTP, activate: activateTP, eval: evalTP, prepLevel: levelTP },
	gTouchColors: { startGame: startGameTC,startLevel:startLevelTC, startRound: startRoundTC,trialPrompt:trialPromptTC, prompt: promptTC, activate: activateTC, eval: evalTC, prepLevel: levelTC },
	gWritePic: { startGame: startGameWP,startLevel:startLevelWP, startRound: startRoundWP,trialPrompt:trialPromptWP, prompt: promptWP, activate: activateWP, eval: evalWP, prepLevel: levelWP },
	gMissingLetter: { startGame: startGameML,startLevel:startLevelML, startRound: startRoundML,trialPrompt:trialPromptML, prompt: promptML, activate: activateML, eval: evalML, prepLevel: levelML },
	gSayPic: { startGame: startGameSP,startLevel:startLevelSP, startRound: startRoundSP,trialPrompt:trialPromptSP, prompt: promptSP, activate: activateSP, eval: evalSP, prepLevel: levelSP },
}

window.onload = SPEECHStart;
//window.onunload = saveSettings;

async function SPEECHStart() {

	//show('dRecord'); 
	//let a=stringAfterLeadingConsonants('drei'); console.log(a);return;
	//console.log(soundsSimilar('call', 'tall'));	return;
	
	//let x=allLettersContained('hallo','loa');console.log(x);return;
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();

	initTable();
	initSidebar();

	CurrentSessionData={user:currentUser,Games=[]};
	initSettingsP0();

	if (immediateStart) startGame(); else openSettings();
}











