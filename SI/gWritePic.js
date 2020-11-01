function g3Start() {
	hasClicked = false;
	let table = dLineMidMiddle;
	let title = dLineTopMiddle;
	if (nundef(table)) return;
	clearTable();

	NUM_PICS = 1;
	PICTURES = [];

	//let keys = choose(emoGroupKeys, NUM_PICS);
	let keys = ['clutch bag'];// ['ant', 'T-Rex'];//'horse'];// 

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
		let d1 = maPicLabelButtonFitText(info, label, { w: 200, h: 200 }, ()=>mBy(defaultFocusElement).focus(), table, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
		d1.id = id;
		PICTURES.push({ key: info.key, info: info, div: d1, id: id, index: i });
	}

	//randomly select a key out of the N pics
	let rnd = NUM_PICS < 2 ? 0 : randomNumber(0, NUM_PICS - 2);
	if (NUM_PICS > 2 && rnd == lastPosition && coin()) rnd = NUM_PICS - 1;
	lastPosition = rnd;
	GOAL = PICTURES[rnd];

	setCurrentInfo(GOAL,true);
	//console.log(bestWord);

	//this is instruction message
	let text = bestWord;
	let cmd = 'type';
	let html = `<span style='font-family:arial;font-size:50px;font-weight:900;cursor:pointer'>&nbsp;&nbsp;🕬&nbsp;&nbsp;</span>`;
	let msg = cmd + " " + `<b>${text.toUpperCase()}</b>` + html;
	dFeedback = dInstruction = mText(msg, title, { fz: 40, cursor: 'default' });
	dInstruction.addEventListener('click', () => aniInstruction(cmd + " " + text));
	synthVoice(cmd + " " + text, .7, 1, .7, 'random');
	mLinebreak(table);

	dInput = mDiv(table);
	inputBox = mCreate('input');
	inputBox.type="text"; inputBox.autocomplete="off";
	defaultFocusElement = inputBox.id = 'inputBox';
	inputBox.style.fontSize = '20pt';
	inputBox.addEventListener("keyup", function (ev) {
		//if (pauseAfterInput) event.cancelBubble = true;
		//console.log(event);
		if (ev.key === "Enter") {
			//ev.cancelBubble = true;
			g3Eval();
		}
	});
	mAppend(dInput, inputBox);
	inputBox.focus();
	//console.log('did it')
	//setTimeout(() => inputBox.focus(), 5000);
}

//helpers
function g3Eval() {
	let word = finalResult = inputBox.value;
	let item = GOAL;
	//answerCorrect = evaluateAnswer(word);
	//inputBox.value = '';
	if (item.info.best.toLowerCase() == word.toLowerCase()) {
		DELAY = 1500;
		g3Success(GOAL.id, item.key);
	} else {
		DELAY = 3000;
		g3Fail(GOAL.id, item.key);
		showCorrectWord();

	}
	g3SetLevel();
}
function g3Init() {
	level = 0;
	addEventListener('keydown', ()=>{
		let ibox=mBy('inputBox');
		//console.log(ibox,document.activeElement);
		if (isdef(ibox) && isVisible(ibox)) ibox.focus();
	});
	g3SetLevel();
}

function g3Success(id) {
	console.log('id',id)
	const comments = ['YEAH!', 'Excellent!!!', 'CORRECT!', 'Great!!!']
	setScore(true);
	say(chooseRandom(comments));//'Excellent!!!');
	maPicOver(mBy('dCheckMark'), mBy(id), 180, 'green', 'segoeBlack');
}
function g3Fail(id) {
	// const comments=['too bad','no','nope','incorrect','not quite!']
	setScore(false);
	say('too bad!', 1, 1, .8, 'zira');
	maPicOver(mBy('dX'), mBy(id), 100, 'red', 'openMojiTextBlack');


}
function g3SetLevel() {

	let boundary = SAMPLES_PER_LEVEL[level] * (1 + iGROUP);
	if (NUM_PICS == 0 || numTotalAnswers >= boundary) {
		//console.log((NUM_PICS > 0 ? 'boundary!!!!' : 'init...'));
		let oldLevel = level;

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
			setGroup(WORD_GROUPS[iGROUP]);
		} else if (oldLevel != level) {
			numTotalAnswers = 0;
			numCorrectAnswers = 0;
			percentageCorrect = 100;
			setTimeout(showLevelComplete, 2000);
		} else {
			showScore();
			setGroup(WORD_GROUPS[iGROUP]);
			setTimeout(g3Start, DELAY);
		}


	}
	else { setTimeout(g3Start, DELAY); }
}


