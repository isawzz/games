//#region running program
function ProgTimeIsUp() {

	let msElapsed = ProgMsElapsed + msElapsedSince(ProgMsStart);
	let msUnit = Settings.common.minutesPerUnit * 60 * 1000;
	//console.log('elapsed:', msElapsed, 'unit', msUnit);
	return msElapsed > msUnit;
}
function pauseProgramTimer() { ProgMsElapsed += msElapsedSince(ProgMsStart); }
function resumeProgramTimer() { ProgMsStart = Date.now(); }
function startProgramTimer() { ProgMsElapsed = 0; ProgMsStart = Date.now(); }
function getTimeElapsed() { return ProgMsElapsed + msElapsedSince(ProgMsStart); }

function loadProgram() {
	let program = Settings.common;
	let gameSequence = program.gameSequence;

	// which game?
	let gameIndex = program.currentGameIndex;
	if (isString(gameIndex)) { gameIndex = Number(gameIndex); }
	if (nundef(gameIndex) || gameIndex > gameSequence.length) { gameIndex = 0; }
	Settings.common.currentGameIndex = gameIndex;
	Settings.common.currentLevel = Math.max(userStartLevel, lastLevel);

	let game = gameSequence[gameIndex].game;

	// //use level saved in localstorage:
	// let lastLevel = Settings.common.currentLevel;
	// if (isString(lastLevel)) { lastLevel = Number(lastLevel); }
	// if (nundef(lastLevel)) { lastLevel = 0; } //gameSequence[Settings.common.currentGameIndex].startLevel_; }

	// let userStartLevel = getUserStartLevel(game);

	// Settings.common.currentLevel = Math.max(userStartLevel, lastLevel);

	// return;
	// //friendly output
	// let i = 0;
	// gameSequence.map(x => {
	// 	if (i == Settings.common.currentGameIndex) console.log('=>', x); else console.log('', x);
	// 	i += 1;
	// });
	// console.log('LOADED: gameIndex', Settings.common.currentGameIndex, 'level', Settings.common.currentLevel);
}
function getUserStartLevel(game) {
	if (isDict(game)) game = game.game;
	else if (isNumber(game)) {
		let i = game;
		let seq = Settings.common.gameSequence;
		console.assert(i < seq.length, "getUserStartLevel!!!!!!!!!!!!!! gameIndex to high", game)
		game = seq[i];

	}
	let hist = UserHistory;
	let userStartLevel = 0;
	if (isdef(hist) && isdef(hist[game])) userStartLevel = hist[game].startLevel;
	//console.log('_______________________',hist,game,UserHistory)
	//console.log('________user start level', game, userStartLevel)
	return userStartLevel;
}
function saveProgram() {
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(Settings));
}
function updateGameSequence(nextLevel) {
	if (nextLevel > MaxLevel) {
		if (Settings.common.switchGame) {
			let gameSequence = Settings.common.gameSequence;
			let iGame = Settings.common.currentGameIndex = (Settings.common.currentGameIndex + 1) % gameSequence.length;
			Settings.common.currentLevel = getUserStartLevel(iGame);
		} else return;
	} else Settings.common.currentLevel = nextLevel;

	//console.log('*****updated Game Sequence to index', Settings.common.currentGameIndex, 'level', Settings.common.currentLevel);
}




//# endregion






