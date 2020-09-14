
function restart() {
	RESTARTING = true;
	if (isdef(recognition) && interactMode == 'speak' && isRunning) {
		console.log('stopping recog');
		recognition.stop();
	}
	else doRestart();

	focusOnInput();
	//onClickStartButton();
}
function doRestart() {
	answerCorrect = false;
	setStatus('wait');
	score = 0;
	initTable();
	RESTARTING = false;
}
function focusOnInput() {
	if (nundef(inputBox)) return;
	if (isVisible(inputBox)) {
		//console.log('input is visible!')
		inputBox.focus();
	}
}
function onClickSetLanguage() {
	//toggle lang!
	if (isEnglish(currentLanguage)) currentLanguage = 'D'; else currentLanguage = 'E';

	this.innerHTML = currentLanguage;

	//restart();
	console.log('currentInfo:',currentInfo)
	if (isdef(currentInfo)) setLanguageWords(currentLanguage, currentInfo);
	//if am in the middle of a hint, now need to redo hint!!!!!!!
}
function onClickGroup(group) {
	setGroup(group);
	restart();
	//focusOnInput();
}
function onClickStartButton() {
	// console.log('start');
	deactivateStartButton();
	let btn = mBy('bStart');
	let caption = btn.innerHTML;
	if (caption != 'try again') setSpeechWords(currentLanguage);
	if (interactMode == 'speak') speech00(currentLanguage, matchingWords); //simpleSpeech();
	focusOnInput();
	//speechEngineInit();
	//speechEngineGo(lang, matchingWords);
}
function isButtonActive() { return mBy('bStart').onclick; }
function activateStartButton() {
	//hide('bStart');
	let btn = mBy('bStart');
	btn.onclick = onClickStartButton;
	btn.style.opacity = '1';
	// btn.classList.add('bigCentralButtonActivation')

}
function deactivateStartButton() {
	//hide('bStart');
	let btn = mBy('bStart');
	btn.onclick = null;
	btn.style.opacity = '.1';
	// btn.classList.remove('bigCentralButtonActivation')

}
function nextWord(showButton = true) {

	if (showButton) {
		let b = mBy('bStart');
		b.innerHTML = answerCorrect || hintWord == bestWord ? 'NEXT' : 'try again';
		activateStartButton(); //show('bStart');
	}
	setStatus('wait');
	//console.log('nextWord: status wird auf wait gesetzt!!!')

	if (!pauseAfterInput && interactMode == 'write' && !answerCorrect && hintWord != bestWord) {
		let b = mBy('bStart');
		b.innerHTML = 'try again';
		return;
	} else if (pauseAfterInput) {
		answerCorrect = false;
		return;
	} else {
		answerCorrect = false;
		if (interactMode != 'write') setTimeout(onClickStartButton, 1000);
	}
}

function convertUmlaute(w) {
	//ue ü, ae ä, oe ö
	w = replaceAll(w, 'ue', 'ü');
	w = replaceAll(w, 'ae', 'ä');
	w = replaceAll(w, 'oe', 'ö');
	return w;
}
//#region evaluation of answer
function blanksInHintWordOrWordLength(hintWord, answer) {
	if (isdef(hintWord) && answer == bestWord.toUpperCase()) {
		let numBlanks = countLetters(hintWord, '_');
		return numBlanks;
	} else { return answer.length; }
}
function evaluateAnswer(answer) {
	if (currentLanguage == 'D') { answer = convertUmlaute(answer) }
	let words = matchingWords.map(x => x.toUpperCase());
	let valid = isdef(validSounds) ? validSounds.map(x => x.toUpperCase()) : [];
	//console.log('valid', valid)
	answer = answer.toUpperCase();
	if (words.includes(answer)) {
		setScore(score + blanksInHintWordOrWordLength(hintWord, answer));
		successMessage();
		hintMessage.innerHTML = answer;
		return true;
	} else if (valid.includes(answer)) {
		//this is a word that sounds just like bestWord!
		setScore(score + blanksInHintWordOrWordLength(hintWord, answer));
		successMessage();
		hintMessage.innerHTML = bestWord.toUpperCase();
		return true;
	} else {
		setScore(score - 1);
		addHint();
		if (bestWord == hintWord) {
			trySomethingElseMessage();
			//console.log('NICHT ERRATEN!!!!!!!!!');
			//hintMessage.innerHTML = "let's try something else!";
			return false;
		} else {
			failMessage();
		}
		//console.log('evaluateAnswer_: hintWord',hintWord,'bestWord',bestWord);

		return false;
	}
}
function setScore(sc) {
	//console.log('score', sc)
	score = sc;
	if (score < 0) scoreSpan.style.color = 'red';
	else if (score > 0) scoreSpan.style.color = 'green';
	else scoreSpan.style.color = 'black';
	scoreSpan.innerHTML = score;
}
function trySomethingElseMessage() { feedbackMessage.innerHTML = "let's try something else! (score: " + score + ')'; }
function successMessage() { feedbackMessage.innerHTML = 'CORRECT! (score is ' + score + ')'; }
function failMessage() { feedbackMessage.innerHTML = 'Try again! (score is ' + score + ')'; }
function addHint() {
	// if (hintWord == bestWord){
	// 	console.log('no more hints!!!')
	// }
	//which positione in bestWord are still empty?
	let indices = [];
	let i = 0;
	for (const ch of hintWord) {
		if (ch == '_') indices.push(i);
		i++;
	}
	//console.log('indices', indices);
	let iNext = level == 0 ? hintWord.indexOf('_') : chooseRandom(indices);
	//console.log('iNext', iNext);
	//console.log('bestWord', bestWord);
	hintWord = hintWord.slice(0, iNext) + bestWord[iNext] + hintWord.slice(iNext + 1, bestWord.length)
	hintWord[iNext] = bestWord[iNext];
	//console.log('hintWord is now', hintWord);
	let ausgabe = '';
	for (const ch of hintWord) {
		ausgabe += ch.toUpperCase() + ' ';
	}
	hintMessage.innerHTML = ausgabe;
}
//#endregion

function displayHint() {
	clearElement(hintMessage);
}

//#region helpers
function isEnglish(lang) { return startsWith(lang.toLowerCase(), 'e'); }
function setStatus(st) {
	mBy('status').innerHTML = 'status:' + st;
	status = st;
}

function testSidebar() {
	let sidebar = mBy('sidebar');
	let captions = [];
	for (const k in emojiChars) {
		let o = emojiChars[k];
		addIf(captions, o.group);
	}
	for (const t of captions) {
		mButton(t, () => setGroup(t), sidebar, { display: 'block' }); //, styles, classes);//(sidebar)	
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
	mClass(d, 'sidebar');
	return d;
}
function mSidebarMenu(dParent, captionList, handler) {

}
