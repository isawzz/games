var hintMessage, feedbackMessage, instructionMessage, score, level, inputBox;
var hintWord, bestWord;


function testSidebar() {
	let sidebar = mBy('sidebar');
	let captions = [];
	for (const k in emojiChars) {
		let o = emojiChars[k];
		addIf(captions, o.group);
	}
	for (const t of captions) {
		mButton(t, () => setGroup(t), sidebar, {display:'block'}); //, styles, classes);//(sidebar)	
	}
	// let table = mBy('table');	//console.log(table); return;
	// mColor(table,'green')
	// let d=mDiv(table);
	// mSize(d,200,200);
	// mColor(d,'red'); //return;
	// let parent=d;
	// let sb=mSidebar(table); //d);
	// mColor(sb,'dimgray','red');
	// //sb.innerHTML='hallo';
	// sb.style.minWidth='100px';
	// sb.style.minHeight='100%';

}

function mInsertFirst(dParent) {
	let d = mCreate('div');
	dParent.insertBefore(d, dParent.firstChild);
	return d;

}

function mSidebar(dParent, styles, classes) {
	let d = mInsertFirst(dParent);
	mClass(dParent, 'sidebarContainer');
	mClass(d, 'sidebar');
	return d;
}
function mSidebarMenu(dParent, captionList, handler) {

}
async function testSpeech() {

	// let sb = mSidebar(mBy('table'));
	// mColor(sb, 'dimgray', 'red')

	setStatus('wait');
	score = 0;
	//onClickStartButton();
}
function activateStartButton(){
	//hide('bStart');
	let btn = mBy('bStart');
	btn.onclick=onClickStartButton;
	btn.style.opacity='1';
	btn.classList.add('bigCentralButtonActivation')

}
function deactivateStartButton(){
	//hide('bStart');
	let btn = mBy('bStart');
	btn.onclick=null;
	btn.style.opacity='.5';
	btn.classList.remove('bigCentralButtonActivation')

}
function onClickStartButton() {
	// console.log('start');
	deactivateStartButton();
	let btn = mBy('bStart');
	let caption = btn.innerHTML;
	if (caption != 'try again') setSpeechWords();
	speech00(lang, matchingWords); //simpleSpeech();
	//speechEngineInit();
	//speechEngineGo(lang, matchingWords);
}
function nextWord(correct) {
	//hier ist der status last event
	//prepare next prompt
	//set status to init
	let b = mBy('bStart');
	b.innerHTML = correct ? 'NEXT' : 'try again';
	activateStartButton(); //show('bStart');
	setStatus('wait');
}


//#region evaluation of answer
function evaluateAnswer(answer) {
	let words = matchingWords.map(x => x.toUpperCase());
	answer = answer.toUpperCase();
	if (words.includes(answer)) {
		setScore(score + 1);
		successMessage();
		hintMessage.innerHTML = answer;
		return true;
	} else {
		setScore(score - 1);
		failMessage();
		addHint();
		return false;
	}
}
function setScore(sc) { score = sc; }
function successMessage() { feedbackMessage.innerHTML = 'CORRECT! (score is ' + score + ')'; }
function failMessage() { feedbackMessage.innerHTML = 'Try again! (score is ' + score + ')'; }
function addHint() {
	//which positione in bestWord are still empty?
	let indices = [];
	let i = 0;
	for (const ch of hintWord) {
		if (ch == '_') indices.push(i);
		i++;
	}
	console.log('indices', indices);
	let iNext = chooseRandom(indices);
	console.log('iNext', iNext);
	console.log('bestWord', bestWord);
	hintWord = hintWord.slice(0, iNext) + bestWord[iNext] + hintWord.slice(iNext + 1, bestWord.length)
	hintWord[iNext] = bestWord[iNext];
	console.log('hintWord is now', hintWord);
	let ausgabe = '';
	for (const ch of hintWord) {
		ausgabe += ch.toUpperCase() + ' ';
	}
	hintMessage.innerHTML = ausgabe;
}
//#endregion

//#region helpers
function isEnglish(lang) { return startsWith(lang.toLowerCase(), 'e'); }
function setStatus(st) {
	mBy('status').innerHTML = 'status:' + st;
	status = st;
}

//#region write mode (unused!)
var interactMode = 'speak'; // speak | write
function switchToMode(mode) {
	if (interactMode == 'write') {

	}
}
//#endregion


