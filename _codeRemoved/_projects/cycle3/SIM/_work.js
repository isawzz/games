













const GFUNC = {
	gTouchPic: {
		startGame: startGameTP, startLevel: startLevelTP, startRound: startRoundTP, trialPrompt: trialPromptTP, prompt: promptTP, activate: activateTP, eval: evalTP
	},//, prepLevel: levelTP },
	gTouchColors: {
		startGame: startGameTC, startLevel: startLevelTC, startRound: startRoundTC, trialPrompt: trialPromptTC, prompt: promptTC, activate: activateTC, eval: evalTC
	},//, prepLevel: levelTC },
	gWritePic: {
		startGame: startGameWP, startLevel: startLevelWP, startRound: startRoundWP, trialPrompt: trialPromptWP, prompt: promptWP, activate: activateWP, eval: evalWP
	},//, prepLevel: levelWP },
	gMissingLetter: {
		startGame: startGameML, startLevel: startLevelML, startRound: startRoundML, trialPrompt: trialPromptML, prompt: promptML, activate: activateML, eval: evalML
	},//, prepLevel: levelML },
	gSayPic: {
		startGame: startGameSP, startLevel: startLevelSP, startRound: startRoundSP, trialPrompt: trialPromptSP, prompt: promptSP, activate: activateSP, eval: evalSP
	},//, prepLevel: levelSP },
	gSayPicAuto: {
		startGame: startGameSPA, startLevel: startLevelSPA, startRound: startRoundSPA, trialPrompt: trialPromptSPA, prompt: promptSPA, activate: activateSPA, eval: evalSPA
	},//, prepLevel: levelSPA },
}






// var goodWordsForSpeech={
// 	onion,rose,die,penguin,bottle,computer
// }

// var goodButNotAsEasy={
// 	slipper,mosque,pray,confetti,
// }
// var goodButNeedHint={
// 	money, oil drum, sponge, down, up
// }

// var badWordsForSPeech={
// 	'hat',wrap,goggles,cut,mad,sun,hand,
// }

var nextIndex = -1;
function autoTestSpeech() {
	ensureSymBySet();

	nextIndex += 1;

	let k = SymKeysBySet['nosymbols'][nextIndex];
	let info = SymbolDict[k];
	let best = stringAfterLast(info.E, '|');
	console.log('best', best, '(key', k, ')');
	record('E', best)
	say(best, .7, 1, .7, false, 'random', () => { console.log('done:', k) });



}





















