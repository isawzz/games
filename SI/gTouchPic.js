function g2Start() {
	hasClicked = false;
	let table = dLineMidMiddle;
	let title = dLineTopMiddle;
	if (nundef(table)) return;
	clearTable();

	PICTURES = [];

	let onClickPicture = g2Eval;

	//let keys = ['ant', 'T-Rex'];//'horse'];// 
	//let keys = choose(emoGroupKeys, NUM_PICS); 
	let keys = choose(keySet, NUM_PICS); 

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
		PICTURES.push({ key: info.key, info: info, div: d1, id: id, index: i });
	}

	//randomly select a key out of the N pics
	let rnd = randomNumber(0, NUM_PICS - 2);
	if (rnd == lastPosition && coin()) rnd = NUM_PICS - 1;
	lastPosition = rnd;
	GOAL = PICTURES[rnd];

	setCurrentInfo(GOAL);

	//this is instruction message
	let text = bestWord;
	let cmd = 'click';
	let html = `<span style='font-family:arial;font-size:50px;font-weight:900;cursor:pointer'>&nbsp;&nbsp;🕬&nbsp;&nbsp;</span>`;
	let msg = cmd + " " + `<b>${text.toUpperCase()}</b>` + html;
	let d = dFeedback = dInstruction = mText(msg, title, { fz: 40, cursor: 'default' }); 
	dInstruction.addEventListener('click', () => aniInstruction(cmd + " " + text));
	synthVoice(cmd + " " + text, .7, 1, .7, 'random');
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
	let item = PICTURES[i];

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
	say('too bad!', 1, 1, .8, 'zira');
	maPicOver(mBy('dX'), mBy(id), 100, 'red', 'openMojiTextBlack');


}
function g2SetLevel() {

	let boundary = SAMPLES_PER_LEVEL[level] * (1 + iGROUP);
	if (NUM_PICS == 0 || numTotalAnswers >= boundary) {
		console.log((NUM_PICS > 0 ? 'boundary!!!!' : 'init...'));

		if (percentageCorrect >= 90) {
			if (iGROUP < WORD_GROUPS.length - 1) {
				iGROUP += 1;
			} else if (level < g2MAXLEVEL) {
				level += 1;
				iGROUP = 0;
			}
		} else if (percentageCorrect < 70 && level > 0) {
			level -= 1;
		}

		let n = NUM_PICS;
		NUM_PICS = 2 + level;
		if (NUM_PICS != n) {
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


