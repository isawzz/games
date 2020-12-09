function clearTable() {
	clearElement(dLineTableMiddle); clearElement(dLineTitleMiddle); removeMarkers();
}

//#region fail, hint, success
function failPictureGoal(withComment = true) {
	if (withComment && Settings.spokenFeedback) {
		const comments = (Settings.language == 'E' ? ['too bad'] : ["aber geh'"]);
		Speech.say(chooseRandom(comments), 1, 1, .8, 'zira', () => { console.log('FERTIG FAIL!!!!'); });
	}
	if (isdef(Selected) && isdef(Selected.feedbackUI)) {
		let uilist = isList(Selected.feedbackUI) ? Selected.feedbackUI : [Selected.feedbackUI];
		let sz = getBounds(uilist[0]).height;
		for (const ui of uilist) mpOver(markerFail(), ui, sz * (1 / 2), 'red', 'openMojiTextBlack');
	}
}
function showCorrectWord(sayit = true) {
	let anim = Settings.spokenFeedback ? 'onPulse' : 'onPulse1';
	let div = mBy(Goal.id);
	mClass(div, anim);

	if (!sayit || !Settings.spokenFeedback) return;

	let correctionPhrase = isdef(Goal.correctionPhrase) ? Goal.correctionPhrase : Goal.label;
	Speech.say(correctionPhrase, .4, 1.2, 1, 'david');
}
function shortHintPicRemove() {
	mRemoveClass(mBy(Goal.id), 'onPulse1');
}
function shortHintPic() {
	mClass(mBy(Goal.id), 'onPulse1');
	TOMain = setTimeout(() => shortHintPicRemove(), 800);
}
function successPictureGoal(withComment = true) {
	if (withComment && Settings.spokenFeedback) {
		const comments = (Settings.language == 'E' ? ['YEAH!', 'Excellent!!!', 'CORRECT!', 'Great!!!'] : ['gut', 'Sehr Gut!!!', 'richtig!!', 'Bravo!!!']);
		Speech.say(chooseRandom(comments));//'Excellent!!!');
	}
	if (isdef(Selected) && isdef(Selected.feedbackUI)) {
		let uilist;
		if (isdef(Selected.positiveFeedbackUI)) uilist = [Selected.positiveFeedbackUI];
		else uilist = isList(Selected.feedbackUI) ? Selected.feedbackUI : [Selected.feedbackUI];
		let sz = getBounds(uilist[0]).height;
		for (const ui of uilist) mpOver(markerSuccess(), ui, sz * (4 / 5), 'limegreen', 'segoeBlack');
	}
}
//#endregion

//#region fleetingMessage
function clearFleetingMessage() { clearElement(dLineBottomMiddle); }
function showFleetingMessage(msg, msDelay, styles = { fg, fz: 22, rounding: 10, padding: '2px 12px', matop: 50 }, fade = false) {

	if (nundef(fg)) fg = colorIdealText(G.color);

	if (msDelay) {
		clearTimeout(TOMain);
		TOMain = setTimeout(() => fleetingMessage(msg, styles, fade), msDelay);
	} else {
		fleetingMessage(msg, styles, fade);
	}
}
function fleetingMessage(msg, styles, fade = false) {
	dLineBottomMiddle.innerHTML = msg;
	mStyleX(dLineBottomMiddle, styles)
	if (fade) TOMain = aniFadeInOut(dLineBottomMiddle, 2);
}
//#endregion fleetingMessage

function getGameOrLevelInfo(k, defval) {
	let val = lookup(GS, [G.key, 'levels', G.level, k]);
	if (!val) val = lookupSet(GS, [G.key, k], defval);
	return val;
}
function resetRound() {
	clearTimeout(TOMain);
	clearFleetingMessage();
	clearTable();
}
function resetState() {
	clearTimeout(TOMain); onkeydown = null; onkeypress = null; onkeyup = null;
	uiPaused = 0;
	lastPosition = 0;
	DELAY = 1000;

	badges = [];

	updateLabelSettings();
	setBackgroundColor();
	showBadges(dLeiste, G.level, revertToBadgeLevel);

}
function revertToBadgeLevel(ev) {
	let id = evToClosestId(ev);
	let i = stringAfter(id, '_');
	i = Number(i);

	let userStartLevel = getUserStartLevel(G.key);
	if (userStartLevel > i) upgradeStartLevelForUser(G.key, i);
	G.level = i;

	removeBadges(dLeiste, G.level);
	startGame();
}
function setBackgroundColor() { document.body.style.backgroundColor = G.color; }
function setGoal(index) {
	if (nundef(index)) {
		let rnd = G.numPics < 2 ? 0 : randomNumber(0, G.numPics - 2);
		if (G.numPics >= 2 && rnd == lastPosition && coin(70)) rnd = G.numPics - 1;
		index = rnd;
	}
	lastPosition = index;
	Goal = Pictures[index];
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
function showLevel() { dLevel.innerHTML = 'level: ' + G.level + '/' + G.maxLevel; }
function showGameTitle() { dGameTitle.innerHTML = GAME[G.key].friendly; }
function showStats() { showLevel(); showScore(); showGameTitle(); }





