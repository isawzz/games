const GFUNC = {
	gTouchPic: { friendlyName: 'Pictures!',
		startGame: startGameTP, startLevel: startLevelTP, startRound: startRoundTP, trialPrompt: trialPromptTP, prompt: promptTP, activate: activateTP, eval: evalTP
	},
	gTouchColors: { friendlyName: 'Colors!',
		startGame: startGameTC, startLevel: startLevelTC, startRound: startRoundTC, trialPrompt: trialPromptTC, prompt: promptTC, activate: activateTC, eval: evalTC
	},
	gWritePic: { friendlyName: 'Type it!',
		startGame: startGameWP, startLevel: startLevelWP, startRound: startRoundWP, trialPrompt: trialPromptWP, prompt: promptWP, activate: activateWP, eval: evalWP
	},
	gMissingLetter: {friendlyName: 'Letters!',
		startGame: startGameML, startLevel: startLevelML, startRound: startRoundML, trialPrompt: trialPromptML, prompt: promptML, activate: activateML, eval: evalML
	},
	gSayPic: {friendlyName: 'Speak up!',
		startGame: startGameSP, startLevel: startLevelSP, startRound: startRoundSP, trialPrompt: trialPromptSP, prompt: promptSP, activate: activateSP, eval: evalSP
	},
	//not implemented: gPreMem
	gPreMem: { friendlyName: 'Premem!',
		startGame: startGamePM, startLevel: startLevelPM, startRound: startRoundPM, trialPrompt: trialPromptPM, prompt: promptPM, activate: activatePM, eval: evalPM
	},
	gSteps: { friendlyName: 'Steps!',
		startGame: startGameSTP, startLevel: startLevelSTP, startRound: startRoundSTP, trialPrompt: trialPromptSTP, prompt: promptSTP, activate: activateSTP, eval: evalSTP
	},
	gMem: { friendlyName: 'Memory!',
		startGame: startGameMM, startLevel: startLevelMM, startRound: startRoundMM, trialPrompt: trialPromptMM, prompt: promptMM, activate: activateMM, eval: evalMM
	},
}









