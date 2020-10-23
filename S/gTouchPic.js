const g2GROUPS = ['animal','more'];// 'animalplantfood', 'life', 'more', 'all'];//'food', 'action', 'object', 'human', 'all'];
const g2LN=2;//15
const g2SamplesPerLevel = [g2LN,g2LN,20,40,80,100]; 
const g2MAXLEVEL = 1;
var g2N = 2;

var g2_pic1, g2_pic2;
var g2Pics = [];
var g2Goal;
var g2GroupIndex = 0;
lastPosition=0;

function showCorrectWord(){
	let div = mBy(g2Goal.id);
	let word = bestWord;
	mClass(div,'onPulse');
	say(bestWord,.4,1.2,1,'david')
	setTimeout(gTouchPicStart,5000);
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

		if (item.info.best == bestWord) { 
			g2Success(id, item.key); 
			setTimeout(gTouchPicStart, 1500); 
		}	else { 
			g2Fail(id, item.key); 
			showCorrectWord();
		}

		
	}


	//get g2N different keys!
	let keys = choose(emoGroupKeys, g2N);

	console.log('keys',keys)

	let styles = { w: 200, h: 200, margin: 20, bg: 'random', cursor: 'pointer', rounding: 16, padding: 10 };
	const picStyles = ['twitterText', 'twitterImage', 'openMojiText', 'openMojiImage', 'segoe', 'openMojiBlackText', 'segoeBlack'];
	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');
	//'box-sizing':'border-box', NEIN!!!

	for (let i = 0; i < g2N; i++) {
		let info = getRandomSetItem('E', keys[i]);
		let id = 'pic' + i;
		let d1 = maPicButton(info, onClickPicture, table, styles, 'frameOnHover', isText, isOmoji); d1.id = id;
		g2Pics.push({ key: info.key, info: info, div: d1, id: id, index: i });
	}

	//randomly select a key out of the N pics
	let rnd=randomNumber(0,g2N-2);
	if (rnd == lastPosition && coin()) rnd=g2N-1;
	lastPosition = rnd;
	g2Goal = g2Pics[rnd];//chooseRandom(g2Pics);

	setCurrentInfo(g2Goal);

	//this is instruction message
	let text = bestWord;
	let cmd = 'click';
	let msg = cmd + " " + `<b>${text.toUpperCase()}</b>`;
	let d = dFeedback = dInstruction = mText(msg, title, { fz:40, cursor: 'default' }); //mInstruction(msg, title,false);instructionMessage.id='dInstruction';
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
function g2Init(){
	level = 0;
	g2N = 2;
	g2GroupIndex = 0;
	setGroup(g2GROUPS[g2GroupIndex]);
	showLevel();
	dScore.innerHTML = 'score: _'
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
function isEnglish(lang) { return startsWith(lang.toLowerCase(), 'e'); }
function makeHigherOrderGroups() {
	for (const honame in higherOrderEmoSetNames) {
		for (const name of (higherOrderEmoSetNames[honame])) {
			for (const k in symBySet[name]) {
				let info = symbolDict[k];
				lookupSet(symBySet, [honame, k], info);
				lookupAddToList(symKeysBySet, [honame], k);
				lookupAddToList(symListBySet, [honame], info);
			}
		}
	}
	let s='';
	for(const k in symKeysBySet){
		s+=k+':'+symKeysBySet[k].length+', ';
	}
	//console.log(s);
	//console.log('group names:',Object.keys(symKeysBySet).sort());
	ensureSymByType();
}
function onClickStartButton() {
	if (currentGame == 'gTouchPic') {
		g2Init();
		gTouchPicStart();
	}
}
function setLevel() {

	if (numTotalAnswers >= g2SamplesPerLevel[level]) {
		//console.log('setLevel!')

		if (percentageCorrect >= 90) {
			if (g2GroupIndex < g2GROUPS.length-1)	{
				g2GroupIndex += 1;
			}else if (level<g2MAXLEVEL) { 
				level += 1; 
				g2GroupIndex = 0; 
			}
			showLevel(); 
		} else if (percentageCorrect < 70 && level > 0) {
			level -= 1; 
			showLevel();
		}

		g2N = 2 + level;
		numTotalAnswers = 0;
		numCorrectAnswers = 0;
		percentageCorrect = 100;


		setGroup(g2GROUPS[g2GroupIndex]);

	}
	//console.log(numTotalAnswers,numCorrectAnswers)
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
function setGroup(group) {
	//console.log('setting group to', group)

	//unselect previous group button
	let button = mBy('b_' + emoGroup);

	if (isdef(button)) mClassRemove(button, 'selectedGroupButton');

	emoGroup = group;
	emoGroupKeys = [];

	//select new group button
	button = mBy('b_' + emoGroup);
	if (isdef(button)) mClass(mBy('b_' + emoGroup), 'selectedGroupButton');

	//console.log(emoGroup,symKeysBySet[emoGroup],symBySet)
	emoGroupKeys = jsCopy(symKeysBySet[emoGroup]);
}
function setCurrentInfo(item){
	currentInfo = item.info;
	matchingWords = currentInfo.words;
	validSounds = currentInfo.valid;
	bestWord = currentInfo.best;
	hintWord = '_'.repeat(bestWord.length);

}
function getRandomSetItem(lang = 'E', key) {
	if (nundef(emoGroup)) setGroup('animal');

	if (nundef(key)) key = chooseRandom(emoGroupKeys);

	//#region individual keys for test
	//key = 'fever'; //fever
	//key= 'onion'; //onion
	//key = 'mouse'; // mouse '1FA79'; //bandage '1F48E'; // gem '1F4E3';//megaphone '26BE'; //baseball '1F508'; //speaker low volume
	// key='baseball'; // baseball '26BD'; //soccer '1F988'; //shark '1F41C'; //ant '1F1E6-1F1FC';
	//key = 'adhesive bandage';
	//key = 'hippopotamus';
	// key = 'llama';
	//key = "chess pawn";
	//key='briefcase';
	//key = 'four-thirty';
	//key='chopsticks';
	//key='orangutan';
	//key = 'person with veil';
	//key='medal';
	//key='leopard';
	//key='telephone';
	//#endregion

	let info = jsCopy(picInfo(key));
	let valid, words;
	let oValid = info[lang + '_valid_sound'];
	if (isEmpty(oValid)) valid = []; else valid = sepWordListFromString(oValid, ['|']);
	let oWords = info[lang];
	if (isEmpty(oWords)) words = []; else words = sepWordListFromString(oWords, ['|']);

	let dWords = info.D;
	if (isEmpty(dWords)) dWords = []; else dWords = sepWordListFromString(dWords, ['|']);
	let eWords = info.E;
	if (isEmpty(eWords)) eWords = []; else eWords = sepWordListFromString(eWords, ['|']);

	words = isEnglish(lang) ? eWords : dWords;
	info.eWords = eWords;
	info.dWords = dWords;
	info.words = words;
	info.best = last(words);
	info.valid = valid;

	currentLanguage = lang;

	return info;
}
function showLevel(){	dLevel.innerHTML = 'level: '+level+'/'+g2GroupIndex;}
function showScore(){	
	dScore.innerHTML = 'score: ' + numCorrectAnswers + '/' + numTotalAnswers + ' (' + percentageCorrect + '%)';

}


