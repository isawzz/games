
function onClickStartButton() {
	// console.log('start');
	// if (!isTrainingMode) deactivateStartButton();
	// let btn = mBy('bStart');
	// let caption = btn.innerHTML;

	if (currentGame == 'gTouchPic') {

		// //gTouchPicInitSettings();		
		level = 0;
		g2N = 2;
		g2GroupIndex = 0;
		setGroup(levelGroups[g2GroupIndex]);
		gTouchPicStart();

	} else if (currentGame == 'gSayWord') {

		if (caption != 'try again') setSpeechWords(currentLanguage);
		if (interactMode == 'speak') speech00(currentLanguage, matchingWords);
		focusOnInput();
	}
}


function onClickDummy() {
	console.log('hallo')
}
function onClickAddValidSound() {
	let k = currentInfo.key;
	let k1 = currentLangauge + '_valid_sound';
	console.log(symbolDictCopy[k], currentLanguage, inputAdded.innerHTML);
	symbolDictCopy[k][k1] = inputAdded.innerHTML.trim() + '|' + symbolDictCopy[k][k1];
	hasSymbolDictChanged = true;
}
function onClickAddSynonym() {
	let k = currentInfo.key;
	let s = inputAdded.innerHTML.trim().toLowerCase();
	console.log(symbolDictCopy[k], currentLanguage, s);
	symbolDictCopy[k][currentLanguage] = s + '|' + symbolDictCopy[k][currentLanguage];
	hasSymbolDictChanged = true;

	addIf(currentInfo.words, s);
	//if (!currentInfo.words.includes(s)) currentInfo.words.shift(s);
	console.log(currentInfo.words, currentInfo.valid)
}
function onClickSetLanguage() {
	//toggle lang!
	if (isEnglish(currentLanguage)) currentLanguage = 'D'; else currentLanguage = 'E';

	this.innerHTML = currentLanguage;

	//restart();
	console.log('currentInfo:', currentInfo)
	if (isdef(currentInfo)) setLanguageWords(currentLanguage, currentInfo);
	//if am in the middle of a hint, now need to redo hint!!!!!!!
}
function onClickGroup(group) {
	setGroup(group);
	restart();
	//focusOnInput();
}









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
	//setStatus('wait');
	score = 0;
	initTable();
	RESTARTING = false;
	onClickStartButton();
}
function focusOnInput() {
	if (nundef(inputBox)) return;
	if (isVisible(inputBox)) {
		//console.log('input is visible!')
		inputBox.focus();
	}
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
	//setStatus('wait');
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
	w = replaceAll(w, 'UE', 'Ü');
	w = replaceAll(w, 'AE', 'Ä');
	w = replaceAll(w, 'OE', 'Ö');
	return w;
}
function displayHint() {
	clearElement(hintMessage);
}

//#region helpers
function isEnglish(lang) { return startsWith(lang.toLowerCase(), 'e'); }
function setStatus(st) {
	mBy('statusMessage').innerHTML = 'status:' + st;
	status = st;
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
