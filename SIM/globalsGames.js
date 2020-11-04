
function startGame(game) {
	if (isdef(game)) currentGame = game;
	setDefaults(IS_TESTING? 'testLevels':currentGame);
	resetState();
	GFUNC[currentGame].init();
	GameState = STATES.GAME_INITIALIZED;

	//console.log(keySet)
	startRound();
}
function startRound() {
	GFUNC[currentGame].initRound();
	GameState = STATES.ROUND_INITIALIZED;
	//console.log('pics:' + NumPics, 'keySet has', keySet.length, 'entries')

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
function showPictures(bestWordIsShortest = false, onClickPictureHandler) {
	Pictures = [];
	let keys = choose(keySet, NumPics);
	//keys=['hot beverage','dvd']

	let stylesForLabelButton = { rounding: 10, margin: 24 };
	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');

	for (let i = 0; i < keys.length; i++) {
		let info = getRandomSetItem(currentLanguage, keys[i]);
		let id = 'pic' + i;
		//console.log(bestWordIsShortest)
		let label = bestWordIsShortest ? getShortestWord(info.words, false) : last(info.words);
		//console.log(info.key, info)
		let d1 = maPicLabelButtonFitText(info, label, { w: 200, h: 200 }, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
		d1.id = id;
		Pictures.push({ key: info.key, info: info, div: d1, id: id, index: i });
	}


}
function activateUi() {
	GFUNC[currentGame].activate();
	activationUI();
}

function evaluate() {
	if (uiPaused) return;
	hasClickedUI();
	GameState = GFUNC[currentGame].eval(...arguments);

	//console.log('GameState after eval', GameState)
	switch (GameState) {
		case STATES.CORRECT:
			setScore(true);
			DELAY = 1500;
			updateLevel();
			successPictureGoal();
			if (GameState == STATES.LEVELCHANGE) setTimeout(showLevelComplete, DELAY);
			else { setTimeout(startRound, DELAY); }
			break;
		case STATES.NEXTTRIAL: break;
		case STATES.INCORRECT:
			setScore(false);
			DELAY = 3000;
			showCorrectWord();
			failPictureGoal(false);
			updateLevel();
			console.log('new level is', level)
			if (GameState == STATES.LEVELCHANGE) setTimeout(removeBadgeAndRevertLevel, DELAY);
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
function updateLevel() {
	if (numTotalAnswers >= boundary) {
		//console.log('boundary reached!');
		if (percentageCorrect >= 90) {
			if (iGROUP < WORD_GROUPS.length - 1) {
				iGROUP += 1;
				GameState = STATES.GROUPCHANGE;
			} else if (level < MAXLEVEL) {
				level += 1;
				iGROUP = 0;
				GameState = STATES.LEVELCHANGE;
			}
		} else if (percentageCorrect < 70 && level > 0) {
			level -= 1;
			GameState = STATES.LEVELCHANGE;
		}
	}
	if (GameState == STATES.GROUPCHANGE) {
		keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);
	} else if (GameState == STATES.LEVELCHANGE) {
		boundary = SAMPLES_PER_LEVEL[level] * (1 + iGROUP);
		keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);
		numTotalAnswers = 0;
		numCorrectAnswers = 0;
		percentageCorrect = 100;
	}
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
	uiPaused=0;
	lastPosition = 0;
	DELAY = 1000;

	badges = [];
	level = 0;
	iGROUP = 0;

	numCorrectAnswers = 0, numTotalAnswers = 0, percentageCorrect = 100;

	boundary = SAMPLES_PER_LEVEL[level] * (1 + iGROUP);
	setBackgroundColor();
	showBadges(dLeiste, level, levelColors);
	showLevel();
	showScore();

	GameState = STATES.STARTING;
}
function setBackgroundColor() {
	let color = levelColors[level];
	document.body.style.backgroundColor = color;

}
function setCurrentInfo(item, bestWordIsShortest = false) {
	currentInfo = item.info;
	matchingWords = currentInfo.words;
	validSounds = currentInfo.valid;
	bestWord = bestWordIsShortest ? getShortestWord(currentInfo.words, false) : currentInfo.best;
	hintWord = '_'.repeat(bestWord.length);

}
function setGoal(bestWordIsShortest = false) {
	let rnd = NumPics < 2 ? 0 : randomNumber(0, NumPics - 2);
	if (NumPics >= 2 && rnd == lastPosition && coin(70)) rnd = NumPics - 1;
	lastPosition = rnd;
	Goal = Pictures[rnd];

	setCurrentInfo(Goal, bestWordIsShortest);

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
	say(bestWord, .4, 1.2, 1, true, 'david')
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
function showLevel() { dLevel.innerHTML = 'level: ' + level; }
function showScore() {
	dScore.innerHTML = 'score: ' + numCorrectAnswers + '/' + numTotalAnswers + ' (' + percentageCorrect + '%)';
}

//#endregion

//#region show Level Complete and Revert Level
function showLevelComplete() {
	playAudio();
	mClass(mBy('dLevelComplete'), 'aniFadeInOut');
	show('dLevelComplete');
	setTimeout(levelStep10, 1500);
}
function removeBadgeAndRevertLevel() {
	removeBadges(dLeiste, level);
	setBackgroundColor();
	showLevel();
	showScore();
	startRound();
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
	addBadge(dLeiste, level);
	hide('dLevelComplete');
	clearTable();

	setTimeout(playRubberBandSound, 500);

	setBackgroundColor();
	showLevel();
	showScore();
	setGroup(WORD_GROUPS[iGROUP]);

	setTimeout(levelStep13, 2000);
}
function levelStep13() {
	mRemoveClass(document.body, 'aniFadeOutIn');
	startRound();
}
//#endregion






