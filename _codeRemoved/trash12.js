

async function loadProgram1() {

	//localStorage.clear();
	GameIndex = Number(loadObject('GameIndex'));
	console.log('loaded idx', GameIndex);
	if (nundef(GameIndex)) GameIndex = 0;
	GameSequence = HCGameSeq;
	return;


	//localStorage.clear();
	let gameSeq = loadObject('gameSeq');
	if (nundef(gameSeq)) {
		console.log('loading from _config.yaml')
		let config = await loadYamlDict('/SIMPLE/_config.yaml');
		gameSeq = config.GameSequence;
	}
	if (nundef(gameSeq)) { gameSeq = HCGameSeq; }

	GameSequence = gameSeq;
	//console.log('GameSequence', GameSequence);

	// game index
	let gameIndex = await loadObject('gameIndex');
	if (nundef(gameIndex)) { gameIndex = 0; }
	else if (!isNumber(gameIndex.i)) { gameIndex = 0; }
	else if (gameIndex.i >= GameSequence.length) { gameIndex = 0; }
	else {
		console.log('ja konnte laden:', gameIndex)
		gameIndex = gameIndex.i;
	}
	GameIndex = gameIndex;
	console.log('loaded idx', GameIndex, GameSequence[GameIndex]);
}
function saveProgram1(msg = ' end') {
	updateGameSequence(currentLevel);

	localStorage.setItem(name, GameIndex); // JSON.stringify(o));
	//saveObject()

	//saveObject(GameSequence, 'gameSeq');
	// saveObject(GameIndex, 'gameIndex');
	// console.log('saving idx',GameIndex, GameSequence[GameIndex]);
}


function determineGame(data) {
	//determining currentGame: data undefined, game name or game index
	//if data is a game name, will take 
	if (nundef(data)) {
		if (GameSelectionMode == 'program') {
			data = GameSequence[GameIndex];
			currentGame = data.g;
			currentLevel = SavedLevel; 
		} else {
			console.log('hard-coded: currentGame', currentGame, 'currentLevel', currentLevel)
		}
	} else if (isNumber(data)) {
		GameIndex = data % GameSequence.length;
		data = GameSequence[GameIndex];
		currentGame = data.g;
		currentLevel = data.sl; 
	// } else if (isDict(data)) {
	// 	//data is supposedly already a GameSequence object!
	// 	currentGame = data.g;
	// 	currentLevel = data.cl > MAXLEVEL ? data.sl : data.cl;
	} else if (isString(data)) {
		//data is the name of a game
		currentGame = data;
	}
}
function proceed(nextLevel) {
	//console.log('proceedAfterLevelChange', currentLevel, MAXLEVEL)
	if (nundef(nextLevel)) nextLevel = currentLevel;

	if (nextLevel > MAXLEVEL) {
		let iGame = GameSequence.indexOf(currentGame) + 1;
		if (iGame == GameSequence.length) {
			aniGameOver('Congratulations! You are done!');
		} else {
			let nextGame = GameSequence[iGame];
			startGame(nextGame);
		}
	} else if (LevelChange) startLevel(nextLevel);
	else startRound();

}


function resetProgData() {
	let progData = {
		seq: 0,
		game: GameSequence[0],
		level: startingLevel[0],
	}
	//console.log('saving', progData);
	saveObject(progData, 'progData');
}
async function loadProgram() {
	let gameSeq = loadObject('gameSeq');
	if (nundef(gameSeq)) {		gameSeq = await loadYamlDict('/SIMPLE/_config.yaml');	}
	if (nundef(gameSeq)){gameSeq = HCGameSeq;}

	GameSequence = gameSeq;

	console.log('GameSequence',GameSequence);

	// game index
	let gameIndex = loadObject('gameIndex');
	if (nundef(gameIndex)) {		gameIndex=0;}

	GameIndex = gameIndex;

	saveProgram();


	console.log(gameSeq, gameSeq.gameseq);
	GameSequence = [];
	startingLevel = [];
	for (const g of gameSeq.gameseq) {

		console.log(g, Object.keys(g)[0], Object.values(g)[0]);
		let name = Object.keys(g)[0];
		let slevel = Object.values(g)[0];
		GameSequence.push(name);
		startingLevel.push(slevel);
	}
	//jetzt habe default game sequence as defined by _config.yaml
	console.log(GameSequence, startingLevel);
	return;

	progData = loadObject('progData');
	let index = GameIndex = 0;
	let game = currentGame == 'sequence' ? GameSequence[0] : currentGame;
	let level = startingLevel[index];

	if (isdef(progData) && isdef(progData.index)) {
		GameIndex = index = progData.seq % GameSequence.length;
		game = GameSequence[index];
		level = progData.level;
		startingLevel[index] = level;
		console.log('loaded', progData);
	} else {
		console.log('NO PD!')
	}
	currentGame = game;
	currentLevel = level;
	GameIndex = index;
	if (currentLevel > MAXLEVEL) {
		GameIndex = index = (index + 1) % GameSequence.length;
		currentGame = GameSequence[index];
		currentLevel = startingLevel[index];
		saveProgram('!');
	}
	//console.log('pd', isdef(progData), '\ncurrentGame', currentGame, '\ncurrentLevel', currentLevel);
}
function saveProgram(msg = '') {
	//let level = currentLevel > MAXLEVEL ? 0 : currentLevel;
	//console.log('level',level)
	let progData = {
		seq: GameIndex,
		game: currentGame,
		level: currentLevel,
	};
	console.log('saving' + msg, progData);
	saveObject(progData, 'progData');
}

