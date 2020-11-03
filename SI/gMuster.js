//#region writePic old code



function g3Start() {
	presentPrompt();

	Pictures = [];
	trialNumber = 1;

	let keys = choose(keySet, NumPics);
	//let keys = ['clutch bag'];// ['ant', 'T-Rex'];//'horse'];// 

	//console.log('keys',keys)
	//let styles = { w: 200, h: 200, margin: 20, bg: 'random', cursor: 'pointer', rounding: 16, padding: 10 };
	let stylesForLabelButton = { rounding: 10, margin: 24 };
	const picStyles = ['twitterText', 'twitterImage', 'openMojiText', 'openMojiImage', 'segoe', 'openMojiBlackText', 'segoeBlack'];
	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');

	for (let i = 0; i < keys.length; i++) {
		let info = getRandomSetItem('E', keys[i]);
		let id = 'pic' + i;
		let label = getShortestWord(info.words);
		console.log(info.key, info)
		let d1 = maPicLabelButtonFitText(info, label, { w: 200, h: 200 }, () => mBy(defaultFocusElement).focus(), dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
		d1.id = id;
		Pictures.push({ key: info.key, info: info, div: d1, id: id, index: i });
	}

	setGoal(true);
	//console.log(bestWord);

	//this is instruction message
	let text = bestWord;
	let cmd = 'type';
	showInstruction(text, cmd, dTitle);

	mLinebreak(dTable);
	addInputElement(dTable);
}


function addInputElement(dParent) {
	mLinebreak(dParent, 10);
	let d = mDiv(dParent);

	let dInp = mCreate('input');
	dInp.type = "text"; dInp.autocomplete = "off";
	dInp.style.margin = '10px;'
	defaultFocusElement = dInp.id = 'inputBox' + trialNumber;
	dInp.style.fontSize = '20pt';
	inputBox.addEventListener("keyup", function (ev) {

		if (ev.ctrlKey) return;
		//if (pauseAfterInput) event.cancelBubble = true;
		//console.log(event);
		if (ev.key === "Enter") {
			ev.cancelBubble = true;
			g3Eval();
		}
	});
	mAppend(d, dInp);
	dInp.focus();
	return dInp;
}

//helpers
function g3Eval() {
	let word = finalResult = inputBox.value;
	//let item = GOAL;
	//answerCorrect = evaluateAnswer(word);
	//inputBox.value = '';
	if (bestWord.toLowerCase() == word.toLowerCase()) {
		DELAY = 1500;
		g3Success(Goal.id);
		g3SetLevel();
	} else if (trialNumber < 3) {
		trialNumber += 1;
		g3Trial();
	} else {
		DELAY = 3000;
		showCorrectWord();
		g3Fail(Goal.id);
		g3SetLevel();

	}

}


function g3Init() {
	level = 0;
	addEventListener('keyup', (ev) => {
		if (ev.ctrlKey) return;
		let ibox = mBy('inputBox' + trialNumber);
		//console.log(ibox,document.activeElement);
		if (isdef(ibox) && isVisible(ibox)) ibox.focus();
	});
	g3SetLevel();
}

function g3Success(id) {
	setScore(true);
	console.log('id', id)
	const comments = ['YEAH!', 'Excellent!!!', 'CORRECT!', 'Great!!!']
	say(chooseRandom(comments));//'Excellent!!!');
	maPicOver(mBy('dCheckMark'), mBy(id), 180, 'green', 'segoeBlack');
}
function g3Trial() {
	say('try again!', 1, 1, .8, true,'zira');
	mLinebreak(dLineTableMiddle);
	//mLinebreak(dLineTableMiddle);
	addInputElement(dLineTableMiddle);

}
function g3Fail(id) {
	// const comments=['too bad','no','nope','incorrect','not quite!']
	setScore(false);
	say('too bad!', 1, 1, .8,true, 'zira');
	maPicOver(mBy('dX'), mBy(id), 100, 'red', 'openMojiTextBlack');



}
function g3SetLevel() {

	let boundary = SAMPLES_PER_LEVEL[level] * (1 + iGROUP);
	if (NumPics == 0 || numTotalAnswers >= boundary) {
		//console.log((NUM_PICS > 0 ? 'boundary!!!!' : 'init...'));
		let oldLevel = level;

		if (percentageCorrect >= 90) {
			if (iGROUP < WORD_GROUPS.length - 1) {
				iGROUP += 1;
			} else if (level < MAXLEVEL) {
				level += 1;
				iGROUP = 0;
			}
		} else if (percentageCorrect < 70 && level > 0) {
			level -= 1;
		}

		if (isStarting) {
			isStarting = false;
			numTotalAnswers = 0;
			numCorrectAnswers = 0;
			percentageCorrect = 100;
			let color = levelColors[level];
			document.body.style.backgroundColor = color;
			showBadges(dLeiste, level, levelColors);
			showLevel();
			showScore();
		} else if (oldLevel != level) {
			numTotalAnswers = 0;
			numCorrectAnswers = 0;
			percentageCorrect = 100;
			setTimeout(showLevelComplete, 2000);
		} else {
			showScore();
			setTimeout(g3Start, DELAY);
		}
		keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);


	}
	else { setTimeout(g3Start, DELAY); }
}



//#endregion

//#region touchPic old code





function g2Start() {
	hasClicked = false;
	let table = dLineTableMiddle;
	let title = dLineTitleMiddle;
	if (nundef(table)) return;
	clearTable();

	Pictures = [];

	let onClickPicture = g2Eval;

	//let keys = ['ant', 'T-Rex'];//'horse'];// 
	//let keys = choose(emoGroupKeys, NUM_PICS); 
	let keys = choose(keySet, NumPics); 

	//console.log('keys',keys)
	//let styles = { w: 200, h: 200, margin: 20, bg: 'random', cursor: 'pointer', rounding: 16, padding: 10 };
	let stylesForLabelButton = { rounding: 10, margin: 24 };
	const picStyles = ['twitterText', 'twitterImage', 'openMojiText', 'openMojiImage', 'segoe', 'openMojiBlackText', 'segoeBlack'];
	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');

	for (let i = 0; i < keys.length; i++) {
		let info = getRandomSetItem('E', keys[i]);
		let id = 'pic' + i;
		let label = last(info.words); 
		console.log(info.key, info)
		let d1 = maPicLabelButtonFitText(info, label, { w: 200, h: 200 }, onClickPicture, table, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
		d1.id = id;
		Pictures.push({ key: info.key, info: info, div: d1, id: id, index: i });
	}

	//randomly select a key out of the N pics
	let rnd = randomNumber(0, NumPics - 2);
	if (rnd == lastPosition && coin()) rnd = NumPics - 1;
	lastPosition = rnd;
	Goal = Pictures[rnd];

	setCurrentInfo(Goal);

	//this is instruction message
	let text = bestWord;
	let cmd = 'click';
	let html = `<span style='font-family:arial;font-size:50px;font-weight:900;cursor:pointer'>&nbsp;&nbsp;🕬&nbsp;&nbsp;</span>`;
	let msg = cmd + " " + `<b>${text.toUpperCase()}</b>` + html;
	let d = dFeedback = dInstruction = mText(msg, title, { fz: 40, cursor: 'default' }); 
	dInstruction.addEventListener('click', () => aniInstruction(cmd + " " + text));
	say(cmd + " " + text, .7, 1, .7,true, 'random');
	mLinebreak(table);
	
}

//helpers
function g2Eval(ev) {
	if (hasClicked) return;
	hasClicked = true;
	let id = evToClosestId(ev);
	ev.cancelBubble = true;

	//get item
	let i = firstNumber(id);
	let item = Pictures[i];

	if (item.info.best == bestWord) {
		DELAY = 1500;
		g2Success(id, item.key);
	} else {
		DELAY = 3000;
		g2Fail(id, item.key);
		showCorrectWord();

	}
	g2SetLevel();
}
function g2Init() {
	level = 0;
	g2SetLevel();
}
function g2Success(id) {
	const comments = ['YEAH!', 'Excellent!!!', 'CORRECT!', 'Great!!!']
	setScore(true);
	say(chooseRandom(comments));//'Excellent!!!');
	maPicOver(mBy('dCheckMark'), mBy(id), 180, 'green', 'segoeBlack');
}
function g2Fail(id) {
	// const comments=['too bad','no','nope','incorrect','not quite!']
	setScore(false);
	say('too bad!', 1, 1, .8, true,'zira');
	maPicOver(mBy('dX'), mBy(id), 100, 'red', 'openMojiTextBlack');


}


function g2SetLevel() {

	let boundary = SAMPLES_PER_LEVEL[level] * (1 + iGROUP);
	if (NumPics == 0 || numTotalAnswers >= boundary) {
		console.log((NumPics > 0 ? 'boundary!!!!' : 'init...'));

		if (percentageCorrect >= 90) {
			if (iGROUP < WORD_GROUPS.length - 1) {
				iGROUP += 1;
			} else if (level < MAXLEVEL) {
				level += 1;
				iGROUP = 0;
			}
		} else if (percentageCorrect < 70 && level > 0) {
			level -= 1;
		}

		let n = NumPics;
		NumPics = 2 + level;
		if (NumPics != n) {
			numTotalAnswers = 0;
			numCorrectAnswers = 0;
			percentageCorrect = 100;
			if (n != 0) {
				setTimeout(showLevelComplete, 2000);
			} else {
				let color = levelColors[level];
				document.body.style.backgroundColor = color;

				showBadges(dLeiste, level, levelColors);
				showLevel();
				showScore();
			}
		} else {
			showScore();
			setTimeout(g2Start, DELAY);
		}

		keySet = getKeySet(WORD_GROUPS[iGROUP],currentLanguage,MAX_WORD_LENGTH[level]);
		console.log('keys',keySet.length)
	}
	else { setTimeout(g2Start, DELAY); }
}




//#endregion

//region unused helpers
function onClickStartButton() {
	isStarting = true;
	if (currentGame == 'gTouchPic') {
		g2Init();
		g2Start();
	} else if (currentGame == 'gWritePic') {
		g3Init();
		g3Start();
	}

}

//#endregion


















