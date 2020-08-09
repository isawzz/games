var hintMessage, resultMessage, feedbackMessage, instructionMessage, score, level, inputBox;
var hintWord, bestWord;
var farben = ['rot', 'gruen', 'blau', 'gelb', 'braun', 'violett', 'rosa', 'orange', 'schwarz', 'weiss'];
var colors = ['red', 'green', 'blue', 'yellow', 'brown', 'violet', 'pink', 'orange', 'black', 'white'];
var tiere = ['Tiger', 'Giraffe', 'Hund', 'Katze', 'Pferd', 'Elephant', 'Kuh', 'Ziege', 'Loewe'];
var animals = ['tiger', 'giraffe', 'dog', 'cat', 'horse', 'elefant', 'cow', 'goat', 'lion'];
var mode = 'speak'; // speak | write

async function testSpeech() {
	await loadAssets();
	//speechEngineInit();
	setStatus('wait');
	score = 0;
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
function onClickTryAgain() {
	console.log('try again');
	// hide('bStart');
	// setSpeechWords();
	simpleSpeech();
	//speechEngineInit();
	//speechEngineGo(lang, matchingWords);
}

function switchToMode(mode) {
	if (mode == 'write') {

	}
}
function setScore(sc) {
	score = sc;
}
function evaluateAnswer(answer) {
	if (matchingWords.includes(answer)) {
		setScore(score + 1);
		successMessage();
		//instructionMessage.innerHTML = answer.toUpperCase();
		hintMessage.innerHTML = answer.toUpperCase();
		return true;
	} else {
		failMessage();
		addHint();
		return false;
	}
}
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
function successMessage() { feedbackMessage.innerHTML = 'CORRECT! (score is ' + score + ')'; }
function failMessage() { feedbackMessage.innerHTML = 'Try again! (score is ' + score + ')'; }
function setStatus(st) {
	mBy('status').innerHTML = 'status:' + st;
	status = st;
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
function isEnglish(lang) { return startsWith(lang.toLowerCase(), 'e'); }



