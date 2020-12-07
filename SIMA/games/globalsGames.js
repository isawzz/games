var pictureSize;

function startGame() {

	let game = G.key;

	//clearOldGameTrailing
	if (game == 'gSayPic') Speech.stopRecording();
	else if (game == 'gMem') {
		console.log('last game gMem, timeout is', MemMMTimeout)
		clearTimeout(MemMMTimeout);
	}

	onkeydown = null;
	onkeypress = null;
	onkeyup = null;

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
function startRound() { setTimeout(() => startRoundReally(), ROUND_DELAY); }
function startRoundReally() {
	uiActivated = false;
	clearFleetingMessage();
	showStats();
	LevelChange = false; //needs to be down here because showScore needs that info!

	if (ROUND_OUTPUT) {
		// writeComments('new round:');
		console.log('...' + G.key.substring(1), 'round:' + ' level:' + G.level, 'pics:' + G.numPics, 'labels:' + NumLabels,
			'\nkeys:' + G.keys.length, 'minlen:' + MinWordLength, 'maxlen:' + MaxWordLength, 'trials#:' + G.trials);
	}
	trialNumber = 0;
	GFUNC[G.key].startRound();
	promptStart();

}
function promptStart() {
	beforeActivationUI();

	if (nundef(dTable)) return;
	clearTable();

	G ? G.prompt() : GFUNC[G.key].prompt();
	// let delay = G?G.prompt():GFUNC[G.key].prompt();

	// if (delay < 0) return;
	// console.log(delay)
	// setTimeout(activateUi, delay);
}
function promptNextTrial() {
	beforeActivationUI();

	let delay = G ? G.trialPrompt(trialNumber) : GFUNC[G.key].trialPrompt(trialNumber);
	setTimeout(activateUi, delay);
}
function selectWord(info, bestWordIsShortest, except = []) {
	let candidates = info.words.filter(x => x.length >= MinWordLength && x.length <= MaxWordLength);

	let w = bestWordIsShortest ? getShortestWord(candidates, false) : arrLast(candidates);
	if (except.includes(w)) {
		let wNew = lastCond(info.words, x => !except.includes(w));
		if (wNew) w = wNew;
	}
	return w;
}
function showPictures(onClickPictureHandler, { colors, contrast, repeat = 1, sameBackground = true, border } = {}, keys, labels) {
	Pictures = [];

	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	//keys[0]='man in manual wheelchair';
	//keys=['sun with face'];
	//console.log(keys,repeat)
	//console.log(labels)
	Pictures = maShowPictures(keys, labels, dTable, onClickPictureHandler,
		{ repeat: repeat, sameBackground: sameBackground, border: border, lang: Settings.language, colors: colors, contrast: contrast });

	// if (nundef(keys)) keys = choose(G.keys, G.numPics);
	// Pictures = maShowPictures(keys,labels,dTable,onClickPictureHandler,{ colors, contrast });

	let totalPics = Pictures.length;
	//console.log(totalPics,NumLabels)
	if (nundef(Settings.labels) || Settings.labels) {
		if (NumLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - NumLabels);
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
	//Goal = firstCond(Pictures,x=>x.key == 'man in manual wheelchair');
	// console.log(Pictures,index)
	setCurrentInfo(Goal); //sets bestWord, ...

}
function showInstruction(text, cmd, title, isSpoken, spoken) {
	//console.assert(title.children.length == 0,'TITLE NON_EMPTY IN SHOWINSTRUCTION!!!!!!!!!!!!!!!!!')

	console.log('G.key is', G.key)
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

	Selected = null;
	G ? G.activate() : GFUNC[G.key].activate();
	activationUI();
}
function evaluate() {
	if (uiPaused) return;
	hasClickedUI();
	IsAnswerCorrect = G ? G.eval(...arguments) : GFUNC[G.key].eval(...arguments);

	trialNumber += 1;
	if (!IsAnswerCorrect && trialNumber < G.trials) { promptNextTrial(); return; }

	//feedback
	if (IsAnswerCorrect) {
		DELAY = Settings.spokenFeedback ? 1500 : 300;
		successPictureGoal();
	} else {
		DELAY = Settings.spokenFeedback ? 3000 : 300;
		showCorrectWord();
		failPictureGoal(false);
	}
	setTimeout(removeMarkers, 1500);

	[LevelChange, G.level] = scoring(IsAnswerCorrect); //get here only if this is correct or last trial!

	updateGameSequence(G.level);
	if (LevelChange != 0) saveProgram();

	if (LevelChange && ProgTimeIsUp()) { gameOver('Great job! Time for a break!'); }
	else if (LevelChange < 0) setTimeout(removeBadgeAndRevertLevel, DELAY);
	else if (LevelChange > 0) { setTimeout(showLevelComplete, DELAY); }
	else setTimeout(proceedIfNotStepByStep, DELAY);
}
function proceedIfNotStepByStep(nextLevel) {
	if (!StepByStepMode) { proceed(nextLevel); }
}
function proceed(nextLevel) {
	//console.log('proceedAfterLevelChange', G.level, G.maxLevel)
	if (nundef(nextLevel)) nextLevel = G.level;

	if (ProgTimeIsUp() && LevelChange) {
		gameOver('Great job! Time for a break!');
		return;
	}
	if (nextLevel > G.maxLevel) {
		if (Settings.currentGameIndex >= Settings.gameSequence.length) {
			gameOver('Congratulations! You are done!');
		} else {
			startGame();
		}
	} else if (LevelChange) startLevel(nextLevel);
	else startRound();
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
	upgradeStartLevelForUser(G.key, Math.min(newLevel, startLevel));
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
	uiPaused = 0;
	lastPosition = 0;
	DELAY = 1000;

	badges = [];

	SAMPLES_PER_LEVEL = new Array(20).fill(Settings.samplesPerLevel);// [1, 1, 2, 2, 80, 100];

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
	bestWord = Goal.label;
	hintWord = '_'.repeat(bestWord.length);

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

	let correctionPhrase = isdef(Goal.correctionPhrase) ? Goal.correctionPhrase : bestWord;
	Speech.say(correctionPhrase, .4, 1.2, 1, 'david');
}
function showLevel() { dLevel.innerHTML = 'level: ' + G.level + '/' + G.maxLevel; }
function showGameTitle() { dGameTitle.innerHTML = G ? G.friendlyName : GFUNC[G.key].friendlyName; }
function showStats() { showLevel(); showScore(); showGameTitle(); }
function writeComments(pre) {
	if (ROUND_OUTPUT) {
		console.log('...' + G.key.substring(1), pre + ' G.level:' + G.level, 'pics:' + G.numPics,
			'labels:' + NumLabels,
			'\nkeys:' + G.keys.length, 'minlen:' + MinWordLength, 'maxlen:' + MaxWordLength, 'trials#:' + G.trials);
	}

}

function getGameOrLevelInfo(k, defval) {
	let val = lookup(GS, [G.key, 'levels', G.level, k])
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



