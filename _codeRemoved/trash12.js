class Recorder {
	start_dep(onStart, delayStart, onFinal, delayFinal, onEmpty, delayEmpty, retry = false) {
		this.errorHandler = null;
		console.log('start:', onStart, delayStart, onFinal, delayFinal, onEmpty, delayEmpty, retry)
		if (retry) {
			//console.log('calling error handler!!!');
			this.errorHandler = () => setTimeout(
				() => this.start(onStart, delayStart, onFinal, delayFinal, onEmpty, delayEmpty, false),
				500
			);
		}
		if (this.interrupt()) return;
		console.log('start...');
		this.startHandler = isdef(onStart) ? onStart.bind(this) : null;
		this.delayAfterStarted = isdef(delayStart) ? delayStart : 0;
		this.finalResultHandler = isdef(onFinal) ? onFinal.bind(this) : null;
		this.delayAfterFinalResult = isdef(delayFinal) ? delayFinal : 0;
		this.emptyResultHandler = isdef(onEmpty) ? onEmpty.bind(this) : null;
		this.delayAfterEmptyResult = isdef(delayEmpty) ? delayEmpty : 0;
		this.rec.start();
	}
}

//#region vorher

function saveAnswerStatistic() {
	// das ist nur bei dem gSayPicAuto game
	let g = CurrentGameData;

	let items = last(g.levels).items;
	console.log(items);

	let correctAnswers = items.filter(x => x.isCorrect && x.answer == x.reqAnswer);
	console.log('correctAnswers', correctAnswers)
	let saveable = correctAnswers.map(x => {
		console.log(x); return { key: x.key, reqAnswer: x.reqAnswer, answer: x.answer };
	});
	saveable.map(x => console.log('correct:', x.key, x.reqAnswer, x.answer));

	downloadAsYaml({ correct: saveable }, 'CORRECT');
}


function record(lang, best) {
	//TODO: HACK!!!!!!!
	if (!isGameWithSpeechRecognition()) {
		if (isRunning) recognition.abort();
		return;
	}
	//let wordlist = ['du', 'bist', 'vogel', best];
	if (!isdef(recognition)) {
		console.log('* *********************** SHOULD NEVER HAPPEN!!!!!!! recog not def')
		//speech00(lang);
		//setTimeout(record(lang, wordlist), 3000);
		return;
	}
	if (isRunning) {
		recognition.abort();
		setTimeout(() => record(lang, best), 500);
		return;
		// }
		// //setVocabulary(wordlist);
		// if (isdef(recognition) && isRunning) {
		// 	console.log('.......................stopping recog');
		// 	recordCallback = () => record(lang, wordlist);
		// 	recognition.stop();
	} else {
		isRunning = true;
		recognition.start();
	}
}

function showPictures(bestWordIsShortest = false, onClickPictureHandler, colors, keys, predeflabels) {
	Pictures = [];
	let labels = [];
	if (nundef(keys)) keys = choose(currentKeys, NumPics);
	let infos = keys.map(x => symbolDict[x]);
	if (nundef(labels)) labels = choose(currentKeys, NumPics);
	//keys=['tram'];//['ox']; //["one o'clock"]; //['oil drum'];//,'door']

	//console.log('jjjjjjjjjjjjjjjjjjjjjjj',currentGame,currentKeys,keys)

	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');
	let bgPic = isdef(colors) ? 'white' : 'random';

	let lines = isdef(colors) ? colors.length : 1;

	//hier weiss ich bereits wieviele lines es sind!
	let ww = window.innerWidth;
	let wh = window.innerHeight;
	let hpercent = 0.60; let wpercent = .6;
	let sz, picsPerLine;
	if (lines > 1) {
		let hpic = wh * hpercent / lines;
		let wpic = ww * wpercent / NumPics;
		sz = Math.min(hpic, wpic);
		picsPerLine = keys.length;
	} else {
		let dims = calcRowsColsX(NumPics);
		let hpic = wh * hpercent / dims.rows;
		let wpic = ww * wpercent / dims.cols;
		sz = Math.min(hpic, wpic);
		picsPerLine = dims.cols;
	}

	//console.log('__________picsPerLine',picsPerLine,lines)
	pictureSize = Math.min(sz, 200);
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };

	for (let line = 0; line < lines; line++) {
		let shade = isdef(colors) ? colors[line] : undefined;
		for (let i = 0; i < keys.length; i++) {
			//let info = getRandomSetItem(currentLanguage, keys[i]);
			let ipic = (line * keys.length + i);
			if (ipic % picsPerLine == 0 && ipic > 0) mLinebreak(dTable);
			let id = 'pic' + ipic; // (line * keys.length + i);
			let label = isdef(predeflabels) ? predeflabels[i] : selectWord(info, bestWordIsShortest, labels);
			console.assert(isdef(label) && !isEmpty(label), 'no label for key ' + keys[i])
			labels.push(label);
			let d1 = maPicLabelButtonFitText(info, label,
				{ w: pictureSize, h: pictureSize, bgPic: bgPic, shade: shade, intensity: '#00000025' }, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;
			//console.log(info.key, label, info);
			Pictures.push({ shade: shade, key: info.key, info: info, div: d1, id: id, index: i, label: label, isLabelVisible: true });
		}
		// mLinebreak(dTable);
	}

	let totalPics = Pictures.length;
	if (NumLabels == totalPics) return;
	let remlabelPic = choose(Pictures, totalPics - NumLabels);
	for (const p of remlabelPic) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }

}


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
	if (nundef(gameSeq)) { gameSeq = await loadYamlDict('/SIMPLE/_config.yaml'); }
	if (nundef(gameSeq)) { gameSeq = HCGameSeq; }

	GameSequence = gameSeq;

	console.log('GameSequence', GameSequence);

	// game index
	let gameIndex = loadObject('gameIndex');
	if (nundef(gameIndex)) { gameIndex = 0; }

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

//#endregion