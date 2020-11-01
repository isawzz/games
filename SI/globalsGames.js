// *** real game ***
// const g2GROUPS = ['animal','life','more'];//['animal', 'more'];// 'animalplantfood', 'life', 'more', 'all'];//'food', 'action', 'object', 'human', 'all'];
// const NUMBER_OF_PICS = 5;

const SAMPLES_PER_LEVEL = new Array(40).fill(PICS_PER_LEVEL);// [1, 1, 2, 2, 80, 100];
const g2MAXLEVEL = 10;
var DELAY = 1000;
var NUM_PICS = 0;
var PICTURES = [];
var GOAL;
var iGROUP = -1;
var lastPosition = 0;
var hasClicked = false;
var isStarting = true;
var numTrials;
var keySet;



function aniInstruction(text) {
	synthVoice(text, .7, 1, .7, 'random');
	mClass(dInstruction, 'onPulse');
	setTimeout(() => mRemoveClass(dInstruction, 'onPulse'), 500);

}
function clearTable() {
	clearElement(dLineMidMiddle); clearElement(dLineTopMiddle); hide(mBy('dCheckMark')); hide(mBy('dX'));
}
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
function getShortestWord(list){
	let res=list[0];
	for(let i=1;i<list.length;i++){
		if (list[i].length<res.length)res=list[i];
	}
	return res;

}
function setCurrentInfo(item,chooseShortest=false) {
	currentInfo = item.info;
	matchingWords = currentInfo.words;
	validSounds = currentInfo.valid;
	bestWord = chooseShortest? getShortestWord(currentInfo.words): currentInfo.best;
	hintWord = '_'.repeat(bestWord.length);

}
function setScore(isCorrect) {
	if (isCorrect) {
		numCorrectAnswers += 1;
	}
	numTotalAnswers += 1;
	percentageCorrect = Math.round(100 * numCorrectAnswers / numTotalAnswers);
	showScore();
}

//#region showLevelComplete
function showLevelComplete() {
	playAudio();
	mClass(mBy('dLevelComplete'), 'aniFadeInOut');
	show('dLevelComplete');
	setTimeout(levelStep10, 1500);
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

	document.body.style.backgroundColor = levelColors[level];
	showLevel();
	showScore();
	setGroup(WORD_GROUPS[iGROUP]);

	setTimeout(levelStep13, 2000);
}
function levelStep13() {
	mRemoveClass(document.body, 'aniFadeOutIn');
	if (currentGame == 'gTouchPic') {
		g2Start();
	} else if (currentGame == 'gWritePic') {
		g3Start();
	}
}
//#endregion

function showCorrectWord() {
	let div = mBy(GOAL.id);
	mClass(div, 'onPulse');
	say(bestWord, .4, 1.2, 1, 'david')
}
function showLevel() { dLevel.innerHTML = 'level: ' + level; }
function showScore() {
	dScore.innerHTML = 'score: ' + numCorrectAnswers + '/' + numTotalAnswers + ' (' + percentageCorrect + '%)';
}


