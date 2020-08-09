var hintMessage, feedbackMessage, instructionMessage, score, level, inputBox;
var hintWord, bestWord;


function mSidebar(dParent,styles,classes){
	
}

async function testSpeech() {

	// let x=simpleWordListFromString('" hallo das, ist gut');
	// console.log(x);	return;

	await loadAssets();
	//speechEngineInit();
	setStatus('wait');
	score = 0;
	onClickStartButton();
}
function onClickStartButton() {
	console.log('start');
	hide('bStart');
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
	show('bStart');
	setStatus('wait');
}


//#region evaluation of answer
function evaluateAnswer(answer) {
	let words = matchingWords.map(x=>x.toUpperCase());
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


