//#region running program
function ProgTimeIsUp() {

	let msElapsed = ProgMsElapsed + msElapsedSince(ProgMsStart);
	let msUnit = Settings.minutesPerUnit * 60 * 1000;
	//console.log('elapsed:', msElapsed, 'unit', msUnit);
	return msElapsed > msUnit;
}
function pauseProgramTimer() { ProgMsElapsed += msElapsedSince(ProgMsStart); }
function resumeProgramTimer() { ProgMsStart = Date.now(); }
function startProgramTimer() { ProgMsElapsed = 0; ProgMsStart = Date.now(); }
function getTimeElapsed() { return ProgMsElapsed + msElapsedSince(ProgMsStart); }

function loadProgram() {
	let program = Settings;
	let gameSequence = program.gameSequence;

	// which game?
	let gameIndex = program.currentGameIndex;
	if (isString(gameIndex)) { gameIndex = Number(gameIndex); }
	if (nundef(gameIndex) || gameIndex > gameSequence.length) { gameIndex = 0; }
	Settings.currentGameIndex = gameIndex;
	Settings.G.level = Math.max(userStartLevel, lastLevel);

	let game = gameSequence[gameIndex].game;

	// //use level saved in localstorage:
	// let lastLevel = Settings.G.level;
	// if (isString(lastLevel)) { lastLevel = Number(lastLevel); }
	// if (nundef(lastLevel)) { lastLevel = 0; } //gameSequence[Settings.currentGameIndex].startLevel_; }

	// let userStartLevel = getUserStartLevel(game);

	// Settings.G.level = Math.max(userStartLevel, lastLevel);

	// return;
	// //friendly output
	// let i = 0;
	// gameSequence.map(x => {
	// 	if (i == Settings.currentGameIndex) console.log('=>', x); else console.log('', x);
	// 	i += 1;
	// });
	// console.log('LOADED: gameIndex', Settings.currentGameIndex, 'level', Settings.G.level);
}
function getUserStartLevel(game) {
	if (isDict(game)) game = game.game;
	else if (isNumber(game)) {
		let i = game;
		let seq = Settings.gameSequence;
		console.assert(i < seq.length, "getUserStartLevel!!!!!!!!!!!!!! gameIndex to high", game)
		game = seq[i];

	}
	let hist = U.games;
	let userStartLevel = 0;
	if (isdef(hist) && isdef(hist[game])) userStartLevel = hist[game].startLevel;
	//console.log('_______________________',hist,game,U.games)
	//console.log('________user start level', game, userStartLevel)
	return userStartLevel;
}
function saveProgram() {
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(Settings));
}
function updateGameSequence(nextLevel) {
	if (nextLevel > G.maxLevel) {
		if (Settings.switchGame) {
			let gameSequence = Settings.gameSequence;
			let iGame = Settings.currentGameIndex = (Settings.currentGameIndex + 1) % gameSequence.length;
			Settings.G.level = getUserStartLevel(iGame);
		} else return;
	} else Settings.G.level = nextLevel;

	//console.log('*****updated Game Sequence to index', Settings.currentGameIndex, 'level', Settings.G.level);
}




//# endregion






