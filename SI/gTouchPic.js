const g2GROUPS = ['animal','life','more'];//['animal', 'more'];// 'animalplantfood', 'life', 'more', 'all'];//'food', 'action', 'object', 'human', 'all'];
const g2LN = 5;//15
var DELAY = 1000;
//const g2SamplesPerLevel = [1, 1, 2, 2, 80, 100];
const g2SamplesPerLevel = new Array(40).fill(10);// [1, 1, 2, 2, 80, 100];
const g2MAXLEVEL = 10;
var g2N = 0;

var g2_pic1, g2_pic2;
var g2Pics = [];
var g2Goal;
var g2GroupIndex = -1;
var lastPosition = 0;
var hasClicked = false;

function clearTable(){
	clearElement(dLineMidMiddle); clearElement(dLineTopMiddle); hide(mBy('dCheckMark')); hide(mBy('dX'));
}

function gTouchPicStart() {
	//console.log('touch pic game!')
	hasClicked = false;
	let table = dLineMidMiddle;
	let title = dLineTopMiddle;
	if (nundef(table)) return;
	clearTable();

	g2Pics = [];

	let onClickPicture = evaluate;

	//get g2N different keys!
	//let keys = ['ant', 'T-Rex'];//'horse'];// 
	let keys = choose(emoGroupKeys, g2N); // ['T-Rex']; //choose(emoGroupKeys, g2N);

	//console.log('keys',keys)
	//let styles = { w: 200, h: 200, margin: 20, bg: 'random', cursor: 'pointer', rounding: 16, padding: 10 };
	let stylesForLabelButton = { rounding: 10, margin: 24 };
	const picStyles = ['twitterText', 'twitterImage', 'openMojiText', 'openMojiImage', 'segoe', 'openMojiBlackText', 'segoeBlack'];
	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');

	for (let i = 0; i < keys.length; i++) {
		let info = getRandomSetItem('E', keys[i]);
		let id = 'pic' + i;
		let label = last(info.words); //'hallo das ist ja bloed';//last(info.words)
		//let maxw=100;
		console.log(info.key, info)
		let d1 = maPicLabelButtonFitText(info, label, { w: 200, h: 200 }, onClickPicture, table, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
		d1.id = id;
		// let d1 = maPicLabelButton(info, last(info.words), onClickPicture, table, styles, 'frameOnHover', isText, isOmoji); d1.id = id;
		//let d1 = maPicButton(info, onClickPicture, table, styles, 'frameOnHover', isText, isOmoji); d1.id = id;
		//console.log('table',table,'\ndPic',d1)
		g2Pics.push({ key: info.key, info: info, div: d1, id: id, index: i });
	}

	//randomly select a key out of the N pics
	//console.log(g2N, g2Pics, lastPosition)
	let rnd = randomNumber(0, g2N - 2);
	if (rnd == lastPosition && coin()) rnd = g2N - 1;
	lastPosition = rnd;
	g2Goal = g2Pics[rnd];//chooseRandom(g2Pics);

	setCurrentInfo(g2Goal);

	//this is instruction message
	let text = bestWord;
	let cmd = 'click';
	let infoSpeaker = symbolDict['speaker'];
	// let html = `<span style='margin-top:100px;font-family:pictoGame;font-size:50px;font-weight:900;cursor:pointer'>&nbsp;&nbsp;${infoSpeaker.text}&nbsp;&nbsp;</span>`;
	let html = `<span style='font-family:arial;font-size:50px;font-weight:900;cursor:pointer'>&nbsp;&nbsp;🕬&nbsp;&nbsp;</span>`;
	let msg = cmd + " " + `<b>${text.toUpperCase()}</b>` + html;
	let d = dFeedback = dInstruction = mText(msg, title, { fz: 40, cursor: 'default' }); //mInstruction(msg, title,false);instructionMessage.id='dInstruction';
	dInstruction.addEventListener('click', () => aniInstruction(cmd + " " + text));
	synthVoice(cmd + " " + text, .7, 1, .7, 'random');
	mLinebreak(table);


}

//helpers
function aniInstruction(text) {
	synthVoice(text, .7, 1, .7, 'random');
	mClass(dInstruction, 'onPulse');
	// instructionMessage.style.color='red';
	// instructionMessage.style.color='red';
	setTimeout(() => mRemoveClass(dInstruction, 'onPulse'), 500);

}
function evaluate(ev) {
	if (hasClicked) return;
	hasClicked = true;
	let id = evToClosestId(ev);
	ev.cancelBubble = true;

	//get item
	let i = firstNumber(id);
	let item = g2Pics[i];

	if (item.info.best == bestWord) {
		DELAY = 1500;
		g2Success(id, item.key);
	} else {
		DELAY = 3000;
		g2Fail(id, item.key);
		showCorrectWord();

	}
	setLevel();
}
function g2Init() {
	level = 0;
	setLevel();
	//g2N = 5;
	// g2GroupIndex = 0;
	// setGroup(g2GROUPS[g2GroupIndex]);
	// //setLevel_();
	// showLevel();
	// dScore.innerHTML = 'score: _'
}
function g2Success(id) {
	const comments = ['YEAH!', 'Excellent!!!', 'CORRECT!', 'Great!!!']
	setScore(true);
	say(chooseRandom(comments));//'Excellent!!!');
	maPicOver(mBy('dCheckMark'), mBy(id), 180, 'green', 'segoeBlack');
}
function g2Fail(id) {
	// const comments=['too bad','no','nope','incorrect','not quite!']
	const comments = ['oh!!!']
	setScore(false);
	say('too bad!', 1, 1, .8, 'zira');
	// say(chooseRandom(comments), 1, 1, .8, 'zira');//'Excellent!!!');
	// say(chooseRandom(comments), 1, 1, .8, 'zira');//'Excellent!!!');
	maPicOver(mBy('dX'), mBy(id), 100, 'red', 'openMojiTextBlack');


}
function onClickStartButton() {
	if (currentGame == 'gTouchPic') {
		g2Init();
		gTouchPicStart();
	}
}
function setLevel() {

	//console.log('setLevel_', level, g2N, levelColors[level])

	let boundary = g2SamplesPerLevel[level] * (1 + g2GroupIndex);
	if (g2N == 0 || numTotalAnswers >= boundary) {
		console.log((g2N > 0 ? 'boundary!!!!' : 'init...'));

		if (percentageCorrect >= 90) {
			if (g2GroupIndex < g2GROUPS.length - 1) {
				g2GroupIndex += 1;
			} else if (level < g2MAXLEVEL) {
				level += 1;
				g2GroupIndex = 0;
			}
			// showLevel();
		} else if (percentageCorrect < 70 && level > 0) {
			level -= 1;
			// showLevel();
		}

		let n = g2N;
		//console.log(n)
		g2N = 2 + level;
		if (g2N != n) {
			//level has indeed changed - color change, badge change!
			numTotalAnswers = 0;
			numCorrectAnswers = 0;
			percentageCorrect = 100;
			//console.log(color)
			if (n != 0) {
				//this is NOT just init
				setTimeout(showLevelComplete, 2000);
			} else {
				let color = levelColors[level];
				document.body.style.backgroundColor = color;

				showBadges(dLeiste, level, levelColors);
				showLevel();
				showScore();
				setGroup(g2GROUPS[g2GroupIndex]);
				// setTimeout(gTouchPicStart, DELAY); //hier nicht weeil das ist init!
			}
		} else {
			showScore();
			setGroup(g2GROUPS[g2GroupIndex]);
			setTimeout(gTouchPicStart, DELAY);
		}


	}
	else { setTimeout(gTouchPicStart, DELAY); }

	//setLevelColor();
	//console.log(numTotalAnswers,numCorrectAnswers)
}

function showLevelComplete() {
	playAudio();
	mClass(mBy('dLevelComplete'), 'aniFadeInOut');
	show('dLevelComplete');
	setTimeout(levelStep10, 1500);
}
function levelStep10(){
	mClass(document.body,'aniFadeOutIn');
	hide('dLevelComplete'); //mRemoveClass(mBy('dLevelComplete'), 'aniFadeInOut');
	setTimeout(levelStep11, 500);
}
function levelStep11(){
	clearTable();
	setTimeout(levelStep12, 500);

}
function levelStep12(){
	addBadge(dLeiste,level);
	hide('dLevelComplete'); //mRemoveClass(mBy('dLevelComplete'), 'aniFadeInOut');
	clearTable();

	//playRubberBandSound();
	setTimeout(playRubberBandSound,500);

	document.body.style.backgroundColor = levelColors[level];
	showLevel();
	showScore();
	setGroup(g2GROUPS[g2GroupIndex]);
	
	setTimeout(removeClassBody, 2000);
}
function removeClassBody(){
	mRemoveClass(document.body,'aniFadeOutIn');
	gTouchPicStart();
}


//#region showLevelAnimation trial 1
function showLevelComplete_1() {
	setTimeout(levelStep1, 100);
}
function levelStep1() {
	let d = mBy('dLevelComplete');
	mClass(d, 'aniFadeIn');
	show(d);
	playAudio();
	setTimeout(levelStep2, 600);
}
function levelStep2() {
	addBadge(dLeiste, level);
	// mClass(document.body,'aniFadeOutIn');
	//startBackgroundTransition('transparent',levelColors[level]);
	let color = levelColors[level];
	document.body.style.backgroundColor = color;
	setTimeout(levelStep3, 1000);
}
function levelStep3() {
	// let color = levelColors[level];
	// document.body.style.backgroundColor = color;
	let d = mBy('dLevelComplete');
	mRemoveClass(d,'aniFadeIn');
	mClass(d, 'aniFadeOut');
	mClass(dLineMidMiddle, 'aniFadeOut');
	setTimeout(levelStep4, 600);
}
function levelStep4() {
	hide('dLevelComplete');
	let d = mBy('dLevelComplete');
	mRemoveClass(d,'aniFadeOut');
	clearTable();
	mRemoveClass(dLineMidMiddle, 'aniFadeOut');
	setTimeout(levelStep5,500);
}
function levelStep5(){
	showLevel();
	showScore();
	setGroup(g2GROUPS[g2GroupIndex]);
	gTouchPicStart();
}
function startBackgroundTransition(from='transparent',to='red'){
	document.body.style.animation = "background 5s cubic-bezier(1,0,0,1)";
	document.body.style.background = to;
}
//#endregion

function setLevelColor() {
	document.body.style.backgroundColor = levelColors[level];
}
function setScore(isCorrect) {
	//console.log('setScore')
	if (isCorrect) {
		numCorrectAnswers += 1;
	}
	numTotalAnswers += 1;
	percentageCorrect = Math.round(100 * numCorrectAnswers / numTotalAnswers);
	showScore();

	//console.log(numCorrectAnswers,numTotalAnswers)
}
function setCurrentInfo(item) {
	currentInfo = item.info;
	matchingWords = currentInfo.words;
	validSounds = currentInfo.valid;
	bestWord = currentInfo.best;
	hintWord = '_'.repeat(bestWord.length);

}
function showLevel() { dLevel.innerHTML = 'level: ' + level; } // + '/' + g2GroupIndex; }
function showCorrectWord() {
	let div = mBy(g2Goal.id);

	let word = bestWord;

	//mAddLabel(bestWord,div,{fz:40,fg:'contrast'});
	//mText(bestWord,div)

	mClass(div, 'onPulse');
	say(bestWord, .4, 1.2, 1, 'david')
}
function showScore() {
	dScore.innerHTML = 'score: ' + numCorrectAnswers + '/' + numTotalAnswers + ' (' + percentageCorrect + '%)';

}


