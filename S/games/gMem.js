var MemMM;
function startGameMM() { }
function startLevelMM() { levelMM(); }
function levelMM() {
	MaxNumTrials = 1;// getGameOrLevelInfo('trials', 2);
	let vinfo = getGameOrLevelInfo('vocab', 100);
	currentKeys = isNumber(vinfo) ? KeySets['best' + getGameOrLevelInfo('vocab', 100)] : setKeys(vinfo);
	NumPics = getGameOrLevelInfo('numPics', 4);
	NumLabels = getGameOrLevelInfo('numLabels', NumPics);
	NumRepeat = getGameOrLevelInfo('numRepeat', 2);
}
function startRoundMM() {
	uiActivated = false;
	MemMM = [];
}
function OneTwoThree(ev) {
	ev.cancelBubble = true;
	if (uiPaused || ev.ctrlKey || ev.altKey) return;

	let id = evToClosestId(ev);
	let i = firstNumber(id);
	let pic = Pictures[i];
	let div = pic.div;
	console.log('clicked', pic.key);
	if (!isEmpty(MemMM) && MemMM[0].label != pic.label) return;
	toggleSelectionOfPicture(pic,MemMM);
	if (isEmpty(MemMM)) {
		showInstruction('any picture', 'click', dTitle, true);

	}else if (MemMM.length < NumRepeat-1) {
		//set incomplete: more steps are needed!
		//frame the picture
		showInstruction(pic.label, 'click another', dTitle, true);
	}else if (MemMM.length == NumRepeat-1) {
		// look for last picture with x that is not in the set
		let picGoal = firstCond(Pictures,x=>x.label == pic.label && !x.isSelected);
		setGoal(picGoal.index);
		showInstruction(picGoal.label, 'click the last', dTitle, true);
	} else {
		//set is complete: eval
		evaluate(MemMM);
	}
	console.log(MemMM)

}
function promptMM() {
	showPicturesMM(OneTwoThree, { repeat: NumRepeat });
	//setGoal();
	showInstruction('any picture', 'click', dTitle, true);
	return 10;
}
function calcDimsAndSize(NumPics, lines) {

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

	pictureSize = Math.max(50, Math.min(sz, 200));
	return [pictureSize, picsPerLine];
}
function showPicturesMM(onClickPictureHandler, { colors, overlayShade, repeat = 1, shufflePositions = true } = {}, keys, labels) {
	Pictures = [];

	if (nundef(keys)) keys = choose(currentKeys, NumPics / repeat);
	console.log(repeat, NumPics);

	if (isdef(repeat)) {
		let keys1 = jsCopy(keys);
		for (let i = 0; i < repeat - 1; i++) { keys = keys.concat(keys1); }
		if (shufflePositions) shuffle(keys)
	}

	console.log(keys);

	let infos = keys.map(x => getRandomSetItem(currentLanguage, x));
	if (nundef(labels)) {
		labels = [];
		for (const info of infos) {
			labels.push(info.best);
		}
	}

	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');
	let bgPic = isdef(colors) ? 'white' : 'random';

	let lines = isdef(colors) ? colors.length : 1;
	let [pictureSize, picsPerLine] = calcDimsAndSize(NumPics, lines);
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };

	for (let line = 0; line < lines; line++) {
		let shade = isdef(colors) ? colors[line] : undefined;
		for (let i = 0; i < keys.length; i++) {
			let info = infos[i];
			let label = labels[i];
			let ipic = (line * keys.length + i);
			if (ipic % picsPerLine == 0 && ipic > 0) mLinebreak(dTable);
			let id = 'pic' + ipic; // (line * keys.length + i);
			let d1 = maPicLabelButtonFitText(info, label,
				{
					w: pictureSize, h: pictureSize, bgPic: bgPic, shade: shade,
					overlayColor: overlayShade
				}, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;
			Pictures.push({ shade: shade, key: info.key, info: info, div: d1, id: id, index: i, label: label, isLabelVisible: true, isSelected: false });
		}
	}

	let totalPics = Pictures.length;

	if (Settings.program.labels) {
		if (NumLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - NumLabels);
		for (const p of remlabelPic) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }
	} else {
		for (const p of Pictures) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }

	}

}
function trialPromptMM() {
	for (const p of MemMM) { toggleSelectionOfPicture(p); }
	MemMM = [];
	Speech.say(currentLanguage == 'D' ? 'nochmal!' : 'try again!');
	//shortHintPic();
	return 10;
}
function activateMM() {
	uiActivated = true;
}
function evalMM(piclist) {

	Selected = { piclist: piclist, feedbackUI: piclist.map(x => x.div), sz: getBounds(piclist[0].div).height };

	let req = Selected.reqAnswer = piclist[0].label;
	let eachAnswerSame = true;
	for (const p of piclist) { if (p.label != req) eachAnswerSame = false; }
	Selected.answer = piclist[piclist.length - 1].label;
	if (Selected.answer == req) { return true; } else { return false; }
}

