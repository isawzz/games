//var counterStartGame = 0;
function startGame(game) {
	//counterStartGame += 1; console.log('startGame counter', counterStartGame);

	onkeydown = null;
	onkeypress = null;
	onkeyup = null;

	if (isdef(game)) currentGame = game;
	currentLevel = startAtLevel[currentGame];

	//loadSettings(currentGame, currentUser);

	resetState();

	GFUNC[currentGame].startGame();
	//GameState = STATES.GAME_INITIALIZED;

	startLevel();
}
function startLevel(){
	//console.log('end of startGame:','boundary',boundary,'currentLevel',currentLevel,'SAMPLES_PER_LEVEL',SAMPLES_PER_LEVEL)
	//console.log(currentKeys)
	GFUNC[currentGame].startLevel();
	LevelChange = false;
	startRound();
}
function startRound() {
	console.assert(!LevelChange,'levelChange!!!!!!!!!!!!! need reset!')
	clearElement(dLineBottomMiddle);
	GFUNC[currentGame].startRound();
	//GameState = STATES.ROUND_INITIALIZED;
	//console.log('pics:' + NumPics, 'currentKeys has', currentKeys.length, 'entries')

	let delay = presentPrompt();

	//activateUi();
	setTimeout(activateUi, delay);

}
function presentPrompt() {
	beforeActivationUI();

	Selected = null;
	dTable = dLineTableMiddle;
	dTitle = dLineTitleMiddle;
	if (nundef(dTable)) return;
	clearTable();

	return GFUNC[currentGame].prompt();
}
function selectWord(info, bestWordIsShortest) {
	let candidates = info.words.filter(x => x.length >= MinWordLength && x.length <= MaxWordLength);
	let w = bestWordIsShortest ? getShortestWord(candidates, false) : last(candidates);
	return w;
}
function showPictures(bestWordIsShortest = false, onClickPictureHandler, colors) {
	Pictures = [];
	let keys = choose(currentKeys, NumPics);
	//keys=['oil drum'];//,'door']

	let stylesForLabelButton = { rounding: 10, margin: 24 };
	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');
	let bgPic = isdef(colors)?'white':'random';

	let lines = isdef(colors)?colors.length:1;
	for(let line=0;line<lines;line++){
		let shade = isdef(colors)?colors[line]:undefined;
		for (let i = 0; i < keys.length; i++) {
			let info = getRandomSetItem(currentLanguage, keys[i]);
			let id = 'pic' + (line*keys.length + i);
			let label = selectWord(info, bestWordIsShortest);
			//console.log('______', info.key, info);
	
			// let shade, bgPic;
			// if (isdef(colors)) { shade = choose(['red', 'green', 'gold', 'blue']); bgPic = 'white'; }
			// else { shade = undefined; bgPic = 'random'; }
			// let d1 = maPicLabelButtonFitText(info, label, { w: 200, h: 200, shade: shade, bgPic: bgPic }, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			let d1 = maPicLabelButtonFitText(info, label, { w: 200, h: 200, bgPic: bgPic, shade:shade }, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;
			Pictures.push({ shade:shade, key: info.key, info: info, div: d1, id: id, index: i, label: label, isLabelVisible: true });
		}
		mLinebreak(dTable);
	}
	if (NumLabels == NumPics) return;

	let remlabelPic = choose(Pictures, NumPics - NumLabels);
	for (const p of remlabelPic) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }
}
function setGoal(index) {
	if (nundef(index)){
		let rnd = NumPics < 2 ? 0 : randomNumber(0, NumPics - 2);
		if (NumPics >= 2 && rnd == lastPosition && coin(70)) rnd = NumPics - 1;
		index = rnd;
	}
	lastPosition = index;
	Goal = Pictures[index];
	setCurrentInfo(Goal); //sets bestWord, ...
	//console.log(bestWord);
}
function activateUi() {
	GFUNC[currentGame].activate();
	activationUI();
}
function evaluate() {
	if (uiPaused) return;
	hasClickedUI();
	AnswerCorrectness = GFUNC[currentGame].eval(...arguments);

	//console.log('GameState_ after eval', GameState)
	switch (AnswerCorrectness) {
		case STATES.CORRECT:
			setScore(true);
			DELAY = 1500;
			updateLevel();
			successPictureGoal();
			if (LevelChange) setTimeout(showLevelComplete, DELAY);
			else { setTimeout(startRound, DELAY); }
			break;
		case STATES.NEXTTRIAL: break;
		case STATES.INCORRECT:
			setScore(false);
			DELAY = 3000;
			showCorrectWord();
			failPictureGoal(false);
			updateLevel();
			//console.log('new currentLevel is', currentLevel)
			if (LevelChange) setTimeout(removeBadgeAndRevertLevel, DELAY);
			else { setTimeout(startRound, DELAY); }
			break;
	}

}
function failPictureGoal(withComment = true) {

	if (withComment) {
		const comments = (currentLanguage == 'E' ? ['too bad'] : ["aber geh'"]);
		say(chooseRandom(comments), 1, 1, .8, true, 'zira');
	}
	if (isdef(Selected)) maPicOver(mBy('dX'), mBy(Selected.id), 100, 'red', 'openMojiTextBlack');

}
function successPictureGoal(withComment = true) {
	//console.log('id', Goal.id)
	if (withComment) {
		const comments = (currentLanguage == 'E' ? ['YEAH!', 'Excellent!!!', 'CORRECT!', 'Great!!!'] : ['gut', 'Sehr Gut!!!', 'richtig!!', 'Bravo!!!']);
		say(chooseRandom(comments));//'Excellent!!!');
	}
	maPicOver(mBy('dCheckMark'), mBy(Goal.id), 180, 'green', 'segoeBlack');

}

//#region helpers
function addNthInputElement(dParent, n) {
	mLinebreak(dParent, 10);
	let d = mDiv(dParent);
	let dInp = mCreate('input');
	dInp.type = "text"; dInp.autocomplete = "off";
	dInp.style.margin = '10px;'
	dInp.id = 'inputBox' + n;
	dInp.style.fontSize = '20pt';
	mAppend(d, dInp);
	return dInp;
}
function aniInstruction(text) {
	say(text, .7, 1, .7, false, 'random');
	mClass(dInstruction, 'onPulse');
	setTimeout(() => mRemoveClass(dInstruction, 'onPulse'), 500);

}
function clearTable() {
	clearElement(dLineTableMiddle); clearElement(dLineTitleMiddle); hide(mBy('dCheckMark')); hide(mBy('dX'));
}
function resetState() {
	uiPaused = 0;
	lastPosition = 0;
	DELAY = 1000;

	badges = [];
	iGROUP = 0;
	SAMPLES_PER_LEVEL = new Array(20).fill(PICS_PER_LEVEL);// [1, 1, 2, 2, 80, 100];

	numCorrectAnswers = 0, numTotalAnswers = 0, percentageCorrect = 100;

	//console.log(currentLevel)
	boundary = SAMPLES_PER_LEVEL[currentLevel] * (1 + iGROUP);
	setBackgroundColor();
	showBadges(dLeiste, currentLevel, levelColors);
	showLevel();
	showScore();

	//GameState = STATES.STARTING;
}
function setBackgroundColor() {
	let color = levelColors[currentLevel];
	document.body.style.backgroundColor = color;

}
function setCurrentInfo(item) {
	currentInfo = item.info;
	matchingWords = currentInfo.words;
	validSounds = currentInfo.valid;
	bestWord = Goal.label; //bestWordIsShortest ? getShortestWord(currentInfo.words, false) : currentInfo.best;
	hintWord = '_'.repeat(bestWord.length);

}
function setScore(isCorrect) {
	if (isCorrect) {
		numCorrectAnswers += 1;
	}
	numTotalAnswers += 1;
	percentageCorrect = Math.round(100 * numCorrectAnswers / numTotalAnswers);
	showScore();
}
function showCorrectWord() {
	let div = mBy(Goal.id);
	mClass(div, 'onPulse');
	let correctionPhrase = isdef(Goal.correctionPhrase)?Goal.correctionPhrase:bestWord;
	say(correctionPhrase, .4, 1.2, 1, true, 'david');
}

function showInstruction(text, cmd, title) {
	let d = mDiv(title);
	mStyleX(d, { margin: 15 })
	mClass(d, 'flexWrap');

	let msg = cmd + " " + `<b>${text.toUpperCase()}</b>`;
	let d1 = mText(msg, d, { fz: 36, display: 'inline-block' });
	let sym = symbolDict.speaker;
	let d2 = mText(sym.text, d, {
		fz: 38, weight: 900, display: 'inline-block',
		family: sym.family, 'padding-left': 14
	});
	dFeedback = dInstruction = d;


	// let html = `<span style='font-family:pictoGame;font-size:50px;font-weight:900;` + 
	// `cursor:pointer'>${symbolDict.speaker.text}</span>`;
	// // `cursor:pointer'>&nbsp;&nbsp;&#128364;&#xFE0E;&nbsp;&nbsp;</span>`;
	// let msg = cmd + " " + `<b>${text.toUpperCase()}</b>` + html;
	// dFeedback = dInstruction = mText(msg, title, { fz: 40, cursor: 'default' });
	dInstruction.addEventListener('click', () => aniInstruction(cmd + " " + text));
	say(cmd + " " + text, .7, 1, .7, true, 'random');

}
function showLevel() { dLevel.innerHTML = 'level: ' + currentLevel; }
function showScore() {
	dScore.innerHTML = 'score: ' + numCorrectAnswers + '/' + numTotalAnswers + ' (' + percentageCorrect + '%)';
}
function writeComments() {
	console.log('...starting ' + currentGame.substring(1) + ' currentLevel:' + currentLevel, 'pics:' + NumPics, 'labels:' + NumLabels,
		'keys:' + currentKeys.length, '\nminlen:' + MinWordLength, 'maxlen:' + MaxWordLength, 'trials#:' + MaxNumTrials);

}
//#endregion

//#region show Level Complete and Revert Level
function removeBadgeAndRevertLevel() {
	removeBadges(dLeiste, currentLevel);
	setBackgroundColor();
	showLevel();
	showScore();
	startRound();
}

function showLevelComplete() {
	//console.log('skipLevelAnimation', skipLevelAnimation)
	if (!skipLevelAnimation) {
		playAudio();
		mClass(mBy('dLevelComplete'), 'aniFadeInOut');
		show('dLevelComplete');
		setTimeout(levelStep10, 1500);
	} else {
		addBadge(dLeiste, currentLevel);
		setBackgroundColor();
		showLevel();
		showScore();
		setGroup(currentCategories[iGROUP]);
		proceedAfterLevelChange();
	}

}
function levelStep10() {
	mClass(document.body, 'aniFadeOutIn');
	hide('dLevelComplete');
	setTimeout(levelStep11, 500);
}
function levelStep11() {
	clearTable();
	setTimeout(levelStep12, 500);

}
function levelStep12() {
	addBadge(dLeiste, currentLevel);
	hide('dLevelComplete');
	clearTable();

	setTimeout(playRubberBandSound, 500);

	setBackgroundColor();
	showLevel();
	showScore();
	setGroup(currentCategories[iGROUP]);

	setTimeout(levelStep13, 2000);
}
function levelStep13() {
	mRemoveClass(document.body, 'aniFadeOutIn');
	proceedAfterLevelChange();
}

function proceedAfterLevelChange() {
	//LevelChange = false;
	console.log('proceedAfterLevelChange',currentLevel)
	if (currentLevel >= MAXLEVEL) {
		//find index of current game
		let iGame = gameSequence.indexOf(currentGame)+1;
		console.log(iGame)
		if (iGame == gameSequence.length - 1) {
			//this was already the last game!
			//congratulations screen! and shut down
			playAudioEnd();
			mClass(document.body, 'aniSlowlyDisappear');
			show(dLevelComplete);
			dLevelComplete.innerHTML = 'CONGRATULATIONS! You are done!';

		} else {
			let nextGame = gameSequence[iGame];
			startGame(nextGame);
		}
	} else startLevel();

}
//#endregion






