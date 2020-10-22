var g2_pic1, g2_pic2;
var g2Pics = [];
var g2N = 2;
var g2Goal;
var g2GroupIndex = 0;
const levelGroups = ['animal', 'life', 'food', 'action', 'object', 'human', 'all'];

const SAMPLES_PER_LEVEL = 20;

function gTouchPicInitSettings() {
	//console.log('hallo!!!!!!!!!!!!!!!!!')
	level = 0;
	g2N = 2;
	g2GroupIndex = 0;
	setGroup(levelGroups[g2GroupIndex]);
}
function setLevel() {

	//console.log('SETTING LEVEL!')

	if (numTotalAnswers >= SAMPLES_PER_LEVEL) {


		//console.log('NEW CALC LEVEL')

		if (percentageCorrect >= 90) {
			g2GroupIndex += 1;
			if (g2GroupIndex >= levelGroups.length) { level += 1; g2GroupIndex = 0; }

		} else if (percentageCorrect < 70 && level > 0) {
			level -= 1;
		}

		g2N = 2 + level;
		numTotalAnswers = 0;
		numCorrectAnswers = 0;
		percentageCorrect = 100;

		setGroup(levelGroups[g2GroupIndex]);

	}
}

function gTouchPicStart() {
	//console.log('touch pic game!')
	let table = dLineMidMiddle;
	let title = dLineTopMiddle;
	if (nundef(table)) return;
	clearElement(table); clearElement(title); hide(mBy('dCheckMark')); hide(mBy('dX'));

	setLevel();
	g2Pics = [];

	let onClickPicture = ev => {
		let id = evToClosestId(ev);
		ev.cancelBubble = true;

		//get item
		let i = firstNumber(id);
		let item = g2Pics[i];

		if (item.key == g2Goal.key) { g2Success(id, item.key); } else { g2Fail(id, item.key); }

		setTimeout(gTouchPicStart, 1500);
	}


	//get g2N different keys!
	let keys = choose(emoGroupKeys, g2N);
	let styles = { w: 200, h: 200, margin: 20, bg: 'random', cursor: 'pointer', rounding: 16, padding: 10 };
	const picStyles = ['twitterText', 'twitterImage', 'openMojiText', 'openMojiImage', 'segoe', 'openMojiBlackText', 'segoeBlack'];
	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');
	//'box-sizing':'border-box', NEIN!!!

	for (let i = 0; i < g2N; i++) {
		let info = getEmoSetWords('E', keys[i]);
		let id = 'pic' + i;
		let d1 = maPicButton(info, onClickPicture, table, styles, 'frameOnHover', isText, isOmoji); d1.id = id;
		g2Pics.push({ key: info.key, info: info, div: d1, id: id, index: i });
	}

	//randomly select a key out of the N pics
	let key = g2Goal = chooseRandom(g2Pics);

	//this is instruction message
	let text = key.key;
	let cmd = 'click';
	let msg = cmd + " " + text.toUpperCase();
	let d = feedbackMessage = instructionMessage = mText(msg, title, { cursor: 'default' }); //mInstruction(msg, title,false);instructionMessage.id='dInstruction';
	instructionMessage.addEventListener('click', () => aniInstruction(cmd + " " + text));
	synthVoice(cmd + " " + text, .7, 1, .7, 'random');
	mLinebreak(table);


}

function aniInstruction(text) {
	synthVoice(text, .7, 1, .7, 'random');
	mClass(instructionMessage, 'onPulse');
	// instructionMessage.style.color='red';
	// instructionMessage.style.color='red';
	setTimeout(() => mRemoveClass(instructionMessage, 'onPulse'), 500);

}
function g2Success(id) {
	const comments = ['YEAH!', 'Excellent!!!', 'CORRECT!', 'Great!!!']
	scoreFunction2(true);
	say(chooseRandom(comments));//'Excellent!!!');
	maPicOver(mBy('dCheckMark'), mBy(id), 180, 'green', 'segoeBlack');
}
function g2Fail(id) {
	// const comments=['too bad','no','nope','incorrect','not quite!']
	const comments = ['oh!!!']
	scoreFunction2(false);
	say('too bad!', 1, 1, .8, 'zira');
	// say(chooseRandom(comments), 1, 1, .8, 'zira');//'Excellent!!!');
	// say(chooseRandom(comments), 1, 1, .8, 'zira');//'Excellent!!!');
	maPicOver(mBy('dX'), mBy(id), 100, 'red', 'openMojiTextBlack');
}


