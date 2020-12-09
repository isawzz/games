var pictureSize,TOMain;

function startGame() {

	let game = G.key;
	resetState();

	GFUNC[game].startGame();

	startLevel();
}
function startLevel(level) {

	Speech.setLanguage(Settings.language);
	resetScore();

	let defvals = { numPics: 1, numRepeat: 1, trials: 2 };
	for (const k in defvals) { G[k] = getGameOrLevelInfo(k, defvals[k]); }
	G.numLabels = G.numPics * G.numRepeat;

	GFUNC[G.key].startLevel(); //settings level dependent params eg., G.trials...

	if (G.keys.length < G.numPics) {
		console.log('extending key set!!!!');
		updateKeySettings(G.numPics + 5);
	}

	startRound();
}
function startRound() { TOMain =setTimeout(() => _startRound(), 300); }
// function startRound() { chainEx([getWaiter(300)],startRoundReally); }
function _startRound() {
	console.log('round starts:',G)
	//restartQ();
	clearFleetingMessage();
	showStats();
	Score.levelChange = false; //needs to be down here because showScore needs that info!

	// if (ROUND_OUTPUT) {
	// 	// writeComments('new round:');
	// 	console.log('...' + G.key.substring(1), 'round:' + ' level:' + G.level, 'pics:' + G.numPics, 'labels:' + G.numLabels,
	// 		'\nkeys:' + G.keys.length, 'minlen:' + MinWordLength, 'maxlen:' + MaxWordLength, 'trials#:' + G.trials);
	// }
	G.trialNumber = 0;
	GFUNC[G.key].startRound();
	promptStart();

}
function promptStart() {
	uiActivated = false;

	if (nundef(dTable)) return;
	clearTable();

	GFUNC[G.key].prompt();
}
function promptNextTrial() {
	uiActivated = false;

	let delay = GFUNC[G.key].trialPrompt(G.trialNumber);
	TOMain = setTimeout(activateUi, delay);
}
function showPictures(onClickPictureHandler, { colors, contrast, repeat = 1, sameBackground = true, border } = {}, keys, labels) {
	Pictures = [];

	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	//keys[0]='man in manual wheelchair';
	//keys=['sun with face'];

	Pictures = maShowPictures(keys, labels, dTable, onClickPictureHandler,
		{ repeat: repeat, sameBackground: sameBackground, border: border, lang: Settings.language, colors: colors, contrast: contrast });

	let totalPics = Pictures.length;
	if (nundef(Settings.labels) || Settings.labels) {
		if (G.numLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - G.numLabels);
		for (const p of remlabelPic) {
			//console.log('hi1');
			maHideLabel(p.id, p.info); p.isLabelVisible = false;
		}
	} else {
		for (const p of Pictures) {
			//console.log('hi1');
			maHideLabel(p.id, p.info); p.isLabelVisible = false;
		}

	}

}
function setGoal(index) {
	if (nundef(index)) {
		let rnd = G.numPics < 2 ? 0 : randomNumber(0, G.numPics - 2);
		if (G.numPics >= 2 && rnd == lastPosition && coin(70)) rnd = G.numPics - 1;
		index = rnd;
	}

	lastPosition = index;
	Goal = Pictures[index];

	setCurrentInfo(Goal); //sets Goal.label, ...

}
function showInstruction(text, cmd, title, isSpoken, spoken) {
	//console.assert(title.children.length == 0,'TITLE NON_EMPTY IN SHOWINSTRUCTION!!!!!!!!!!!!!!!!!')

	//console.log('G.key is', G.key)
	clearElement(title);
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

	spoken = isSpoken ? isdef(spoken) ? spoken : cmd + " " + text : null;
	dInstruction.addEventListener('click', () => aniInstruction(spoken));

	if (!isSpoken) return;

	Speech.say(isdef(spoken) ? spoken : (cmd + " " + text), .7, 1, .7, 'random');

}
function activateUi() {

	//console.log('hallo')
	Selected = null;
	uiActivated = true;
	GFUNC[G.key].activate();
}
function evaluate() {
	if (!canAct()) return;
	uiActivated = false;
	IsAnswerCorrect = GFUNC[G.key].eval(...arguments);

	G.trialNumber += 1;
	if (!IsAnswerCorrect && G.trialNumber < G.trials) { promptNextTrial(); return; }

	//feedback
	if (IsAnswerCorrect) {
		DELAY = Settings.spokenFeedback ? 1500 : 300;
		successPictureGoal();
	} else {
		DELAY = Settings.spokenFeedback ? 3000 : 300;
		showCorrectWord();
		failPictureGoal(false);
	}
	setTimeout(removeMarkers,1500);
	//enQ(setTimeout,[removeMarkers,1500]);
	// enQ(removeMarkers,null,1500);

	let nextLevel;
	[Score.levelChange, nextLevel] = scoring(IsAnswerCorrect); //get here only if this is correct or last trial!

	//if no level change just proceed
	//let taskChain = [getWaiter(1500),{f:removeMarkers}];
	if (!Score.levelChange){
		TOMain = setTimeout(startRound,DELAY);
		//enQ(setTimeout,[startRound,DELAY]);
	}else if (unitTimeUp()){
		//end of unit!
		saveUnit();
	}else if (nextLevel<G.level){
		//remove badges
	}else if (nextLevel == G.level){
		//same level restarts again
	}else if (nextLevel > G.maxLevel){
		//new game!
	}else{
		//1 level up!
		// add a badge
	}

	//runQ();
	//chainEx(taskChain,null,'wait',true);
	// updateGameSequence(G.level);
	// if (Score.levelChange != 0) saveProgram();

	// if (Score.levelChange && ProgTimeIsUp()) { gameOver('Great job! Time for a break!'); }
	// else if (Score.levelChange < 0) setTimeout(removeBadgeAndRevertLevel, DELAY);
	// else if (Score.levelChange > 0) { setTimeout(showLevelComplete, DELAY); }
	// else setTimeout(proceedIfNotStepByStep, DELAY);
}

//#region fail or success
function failPictureGoal(withComment = true) {

	if (withComment && Settings.spokenFeedback) {
		const comments = (Settings.language == 'E' ? ['too bad'] : ["aber geh'"]);
		Speech.say(chooseRandom(comments), 1, 1, .8, 'zira', () => { console.log('FERTIG FAIL!!!!'); });
	}
	if (isdef(Selected) && isdef(Selected.feedbackUI)) {

		// let sz = getBounds(Selected.feedbackUI).height;
		// mpOver(mBy('dX'), Selected.feedbackUI, sz * (1 / 2), 'red', 'openMojiTextBlack');

		let uilist = isList(Selected.feedbackUI) ? Selected.feedbackUI : [Selected.feedbackUI];
		let sz = getBounds(uilist[0]).height;
		for (const ui of uilist) mpOver(markerFail(), ui, sz * (1 / 2), 'red', 'openMojiTextBlack');
	}

}
function successPictureGoal(withComment = true) {
	if (withComment && Settings.spokenFeedback) {
		const comments = (Settings.language == 'E' ? ['YEAH!', 'Excellent!!!', 'CORRECT!', 'Great!!!'] : ['gut', 'Sehr Gut!!!', 'richtig!!', 'Bravo!!!']);
		Speech.say(chooseRandom(comments));//'Excellent!!!');
	}
	if (isdef(Selected) && isdef(Selected.feedbackUI)) {
		//mpOver(mBy('dX'), Selected.feedbackUI, sz * (1 / 2), 'red', 'openMojiTextBlack');

		// let sz = getBounds(Selected.feedbackUI).height;
		// mpOver(mBy('dCheckMark'), Selected.feedbackUI, sz * (4 / 5), 'limegreen', 'segoeBlack');
		let uilist;
		if (isdef(Selected.positiveFeedbackUI)) uilist = [Selected.positiveFeedbackUI];
		else uilist = isList(Selected.feedbackUI) ? Selected.feedbackUI : [Selected.feedbackUI];
		let sz = getBounds(uilist[0]).height;
		for (const ui of uilist) mpOver(markerSuccess(), ui, sz * (4 / 5), 'limegreen', 'segoeBlack');
	}
	// mpOver(mBy('dCheckMark'), mBy(Goal.id), pictureSize * (4 / 5), 'limegreen', 'segoeBlack');

}
//#endregion

//#region game over
function gameOver(msg) {
	setTimeout(aniGameOver(msg), DELAY);
	SessionScoreSummary = scoreSummary();
	//update U.games
	if (nundef(U.games)) {
		U.games = jsCopy(SessionScoreSummary);
	} else {
		for (const gname in SessionScoreSummary) {
			let hist = U.games[gname];
			let cur = SessionScoreSummary[gname];
			if (nundef(hist)) U.games[gname] = cur;
			else {
				hist.nTotal += cur.nTotal;
				hist.nCorrect += cur.nCorrect;
				hist.percentage = Math.round((hist.nCorrect / hist.nTotal) * 100);
			}
		}
	}
	//saveHistory();
	saveServerData();
}
function aniGameOver(msg) {
	soundGoodBye();
	show('freezer2');
	let d = mBy('dContentFreezer2');
	clearElement(d);
	mStyleX(d, { fz: 20, matop: 40, bg: 'silver', fg: 'indigo', rounding: 20, padding: 25 })
	let style = { matop: 4 };
	mText('Unit Score:', d, { fz: 22 });

	for (const gname in UnitScoreSummary) {
		let sc = UnitScoreSummary[gname];
		if (sc.nTotal == 0) continue;
		mText(`${G ? G.friendlyName : GFUNC[gname].friendlyName}: ${sc.nCorrect}/${sc.nTotal} correct answers (${sc.percentage}%) `, d, style);

	}

	mClass(mBy('freezer2'), 'aniSlowlyAppear');

}
// #endregion

//#region interrupt
function stopAus() {
	if (G.key == 'gSayPic') Speech.stopRecording();
	pauseProgramTimer();
	pauseUI();
}
function continueResume() {
	resumeProgramTimer();
	resumeUI();
}

// #endregion

//#region show Level Complete and Revert Level
function removeBadgeAndRevertLevel() {
	removeBadges(dLeiste, G.level);
	setBackgroundColor();
	proceedIfNotStepByStep();
}
function showLevelComplete() {
	if (!Settings.reducedAnimations) {
		soundLevelComplete();
		mClass(mBy('dLevelComplete'), 'aniFadeInOut');
		show('dLevelComplete');
		setTimeout(levelStep10, 1500);
	} else {
		addBadge(dLeiste, G.level, revertToBadgeLevel);
		setBackgroundColor();
		proceedIfNotStepByStep();
	}

}
function downgradeCurrentLevelTo(newLevel, oldLevel) {
	Settings.G.level = newLevel;
	ensureUserHistoryForGame(G.key);
	let startLevel = U.games[G.key].startLevel;
	updateStartLevelForUser(G.key, Math.min(newLevel, startLevel));
	return newLevel;
}
function revertToBadgeLevel(ev) {
	pauseUI();
	let id = evToClosestId(ev);
	let i = stringAfter(id, '_');
	i = Number(i);
	G.level = downgradeCurrentLevelTo(i, G.level);
	saveProgram();
	removeBadges(dLeiste, G.level);
	setBackgroundColor();
	startLevel(i);
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
	addBadge(dLeiste, G.level, revertToBadgeLevel);
	hide('dLevelComplete');
	clearTable();

	setTimeout(playRubberBandSound, 500);

	setBackgroundColor();
	showLevel();

	setTimeout(levelStep13, 1000);
}
function levelStep13() {
	mRemoveClass(document.body, 'aniFadeOutIn');
	proceedIfNotStepByStep();
}
//#endregion

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
function aniInstruction(spoken) {
	if (isdef(spoken)) Speech.say(spoken, .7, 1, .7, 'random'); //, () => { console.log('HA!') });
	mClass(dInstruction, 'onPulse');
	setTimeout(() => mRemoveClass(dInstruction, 'onPulse'), 500);

}
function aniInstruction_dep(text, spoken) {
	Speech.say(isdef(spoken) ? spoken : text, .7, 1, .7, 'random'); //, () => { console.log('HA!') });
	mClass(dInstruction, 'onPulse');
	setTimeout(() => mRemoveClass(dInstruction, 'onPulse'), 500);

}
function animate(elem, aniclass, timeoutms) {
	mClass(elem, aniclass);
	setTimeout(() => mRemoveClass(elem, aniclass), timeoutms);
}

function clearTable() {
	clearElement(dLineTableMiddle); clearElement(dLineTitleMiddle); removeMarkers();
} // hide(mBy('dCheckMark')); hide(mBy('dX'));

function isGameWithSpeechRecognition() { return ['gSayPic', 'gSayPicAuto'].includes(G.key); }
function resetState() {
	clearTimeout(TOMain);	onkeydown = null;	onkeypress = null;	onkeyup = null;	
	uiPaused = 0;
	lastPosition = 0;
	DELAY = 1000;

	badges = [];

	updateLabelSettings();
	setBackgroundColor();
	showBadges(dLeiste, G.level, revertToBadgeLevel);
	showLevel();

}
function setBackgroundColor() { document.body.style.backgroundColor = G.color; }

function setCurrentInfo(item) {
	currentInfo = item.info;
	matchingWords = currentInfo.words;
	validSounds = currentInfo.valid;
	Goal.label = Goal.label;
	hintWord = '_'.repeat(Goal.label.length);

}
function shortHintPicRemove() {
	mRemoveClass(mBy(Goal.id), 'onPulse1');
}
function shortHintPic() {
	mClass(mBy(Goal.id), 'onPulse1');
	setTimeout(() => shortHintPicRemove(), 800);
}
function showCorrectWord(sayit = true) {
	let anim = Settings.spokenFeedback ? 'onPulse' : 'onPulse1';
	let div = mBy(Goal.id);
	mClass(div, anim);


	if (!sayit || !Settings.spokenFeedback) return;

	let correctionPhrase = isdef(Goal.correctionPhrase) ? Goal.correctionPhrase : Goal.label;
	Speech.say(correctionPhrase, .4, 1.2, 1, 'david');
}
function showLevel() { dLevel.innerHTML = 'level: ' + G.level + '/' + G.maxLevel; }
function showGameTitle() { dGameTitle.innerHTML = GAME[G.key].friendly; }
function showStats() { showLevel(); showScore(); showGameTitle(); }
function writeComments(pre) {
	if (ROUND_OUTPUT) {
		console.log('...' + G.key.substring(1), pre + ' G.level:' + G.level, 'pics:' + G.numPics,
			'labels:' + G.numLabels,
			'\nkeys:' + G.keys.length, 'minlen:' + MinWordLength, 'maxlen:' + MaxWordLength, 'trials#:' + G.trials);
	}

}

function getGameOrLevelInfo(k, defval) {
	let val = lookup(GS, [G.key, 'levels', G.level, k]);
	if (!val) val = lookupSet(GS, [G.key, k], defval);
	return val;
}

//#endregion

function getCurrentColor(game) {

	let color = 'orange';
	let colorName = GS[game].color;
	if (nundef(colorName)) {
		//console.log('color is undefined!!!!!!!!!!!!!!!!')

	} else if (isdef(window[colorName])) { color = window[colorName]; }
	else color = colorName;

	//console.log('===>G.color',G.color)
	return color;
}

function proceedIfNotStepByStep(nextLevel) {
	if (!StepByStepMode) { proceed(nextLevel); }
}
function proceed(nextLevel) {
	//console.log('proceedAfterLevelChange', G.level, G.maxLevel)
	if (nundef(nextLevel)) nextLevel = G.level;

	if (ProgTimeIsUp() && Score.levelChange) {
		gameOver('Great job! Time for a break!');
		return;
	}
	if (nextLevel > G.maxLevel) {
		if (Settings.currentGameIndex >= Settings.gameSequence.length) {
			gameOver('Congratulations! You are done!');
		} else {
			startGame();
		}
	} else if (Score.levelChange) startLevel(nextLevel);
	else startRound();
}


