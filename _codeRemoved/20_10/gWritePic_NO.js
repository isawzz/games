function initWP() {
	onkeydown = ev=>{
		if (isdef(inputBox)) inputBox.focus();
	}
	NumPics = 1;
	MaxNumTrials = 3;
	keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);
}
function roundWP(){
	trialNumber = 0;
}
function promptWP() {

	trialNumber+=1;
	showPictures(true,() => mBy(defaultFocusElement).focus());
	setGoal(true);

	showInstruction(bestWord, currentLanguage == 'E' ? 'type' : "schreib'", dTitle);

	mLinebreak(dTable);
	inputBox = addNthInputElement(dTable,trialNumber);
	defaultFocusElement = inputBox.id;

	return 10;
}
function activateWP(){
	console.log('should activate WritePic UI')
	inputBox.onkeyup=ev=>{
		if (ev.ctrlKey) return;
		if (ev.key === "Enter") {
			ev.cancelBubble = true;
			console.log('eval!')
			evaluate();
		}
	};
	inputBox.focus();
}
function evalWP(){
	let answer = normalize(inputBox.value,currentLanguage);
	let reqAnswer = normalize(bestWord,currentLanguage);

	if (answer == reqAnswer) return STATES.CORRECT;
	else if (trialNumber < MaxNumTrials) return STATES.NEXTTRIAL;
	else return STATES.INCORRECT;
}













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
	console.log('id', id)
	const comments = ['YEAH!', 'Excellent!!!', 'CORRECT!', 'Great!!!']
	setScore(true);
	say(chooseRandom(comments));//'Excellent!!!');
	maPicOver(mBy('dCheckMark'), mBy(id), 180, 'green', 'segoeBlack');
}
function g3Trial() {
	say('try again!', 1, 1, .8, 'zira');
	mLinebreak(dLineTableMiddle);
	//mLinebreak(dLineTableMiddle);
	addInputElement(dLineTableMiddle);

}
function g3Fail(id) {
	// const comments=['too bad','no','nope','incorrect','not quite!']
	setScore(false);
	say('too bad!', 1, 1, .8, 'zira');
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


