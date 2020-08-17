async function testSpeech() {
	// let sb = mSidebar(mBy('table'));
	// mColor(sb, 'dimgray', 'red')
	setGroup(startingCategory);
	//console.log('dict',emoDict)
	setStatus('wait');
	score = 0;
	//interactMode = 'write';
	//interactMode='write';
	//mButton('start',()=>console.log('CLICK!!!'),table)
	let b = mButton('start', onClickStartButton, table, {}, ['bigCentralButton2']);
	b.id = 'bStart';
	mFlexLinebreak(table);
	//onClickStartButton();

	let sidebar = mBy('sidebar');
	mTextDiv('language:', sidebar);
	mButton(lang, onClickSetLanguage, sidebar, { width: 100 });
	mTextDiv('categories:', sidebar);
	let names = selectedEmoSetNames; //emoSets.map(x=>x.name).sort();
	//console.log(names);
	for (const name of names) {
		let b = mButton(name, () => onClickGroup(name), sidebar, { display: 'block', 'min-width': 100 });
	}
	mTextDiv('options:', sidebar);
	mButtonCheckmark('pauseAfterInput', pauseAfterInput, 'PAUSE', focusOnInput, sidebar, { width: 100 });
	//mButton(getPauseHtml(), onClickPause, sidebar, { width: 100 });
	// mButton(pauseAfterInput?'✓\tpause':'\tpause',onClickPause,sidebar,{width:100});

}
function mButtonCheckmark(flagName, flagInitialValue, caption, handler, dParent, styles, classes) {
	function computeCaption() {
		let height = 20;
		return window[flagName] ?
			'<div style="line-height:' + height + 'px"><span style="padding-left:8px;float:left">' + caption + '</span><span style="padding-right:8px;float:right;">\u2713</span></div>'
			: '<div style="line-height:' + height + 'px"><span style="padding-left:8px;float:left">' + caption + '</span></div>';
	}
	function onClick() {
		window[flagName] = !window[flagName];
		//pauseAfterInput = !pauseAfterInput;
		//this.style.textAlign = 'left';
		this.innerHTML = computeCaption();
		handler(...arguments);
		//focusOnInput();

	}
	if (nundef(window[flagName])) window[flagName] = flagInitialValue;

	window[flagName + 'CaptionFunction'] = caption => {
		//let caption = 'PAUSE';
		let height = 20;
		return window[flagName] ?
			'<div style="line-height:' + height + 'px"><span style="padding-left:8px;float:left">' + caption + '</span><span style="padding-right:8px;float:right;">\u2713</span></div>'
			: '<div style="line-height:' + height + 'px"><span style="padding-left:8px;float:left">' + caption + '</span></div>';
		// '<span style="height:23px">pause</span><span style="height:23px">\u2713</span>'
		// 	: '<span style="margin:3px"></span style="height:23px">pause</pause>';

	}

	return mButton(computeCaption(caption), onClick, dParent, styles, classes);
}
function restart() {
	RESTARTING = true;
	if (isdef(recognition) && interactMode == 'speak' && isRunning) {
		console.log('stopping recog');
		recognition.stop();
	}
	else doRestart();


	//onClickStartButton();
}
function doRestart() {
	score = 0;
	interactMode = 'speak';
	let table = mBy('table');
	clearElement(table);
	let b = mButton('start', onClickStartButton, table, {}, ['bigCentralButton2']);
	b.id = 'bStart';
	mFlexLinebreak(table);
	//console.log('nextWord: status wird auf wait gesetzt!!!')
	setStatus('wait');
	answerCorrect = false;
	RESTARTING = false;

}
// function getPauseHtml() {
// 	let caption = 'PAUSE';
// 	let height = 20;
// 	return pauseAfterInput ?
// 		'<div style="line-height:' + height + 'px"><span style="padding-left:8px;float:left">' + caption + '</span><span style="padding-right:8px;float:right;">\u2713</span></div>'
// 		: '<div style="line-height:' + height + 'px"><span style="padding-left:8px;float:left">' + caption + '</span></div>';
// 	// '<span style="height:23px">pause</span><span style="height:23px">\u2713</span>'
// 	// 	: '<span style="margin:3px"></span style="height:23px">pause</pause>';
// }
// function onClickPause() {
// 	pauseAfterInput = !pauseAfterInput;
// 	//this.style.textAlign = 'left';
// 	this.innerHTML = getPauseHtml();
// 	focusOnInput();
// }
function focusOnInput() {
	if (nundef(inputBox)) return;
	if (isVisible(inputBox)) {
		console.log('input is visible!')
		inputBox.focus();
	}
}
function onClickSetLanguage() {
	//toggle lang!
	if (isEnglish(lang)) lang = 'D'; else lang = 'E';
	this.innerHTML = lang;
	restart();
	focusOnInput();
}
function onClickGroup(group) {
	setGroup(group);
	restart();
	focusOnInput();
}
function onClickStartButton() {
	// console.log('start');
	deactivateStartButton();
	let btn = mBy('bStart');
	let caption = btn.innerHTML;
	if (caption != 'try again') setSpeechWords(lang);
	if (interactMode == 'speak') speech00(lang, matchingWords); //simpleSpeech();
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
	}else if (pauseAfterInput){
		answerCorrect = false;
		return;
	} else {
		answerCorrect = false;
		setTimeout(onClickStartButton, 1000);

	}

	// if (!pauseAfterInput) {
	// 	if (answerCorrect) {
	// 		answerCorrect = false;
	// 		setTimeout(onClickStartButton, 1000);
	// 	} else {
	// 	}
	// } else {
	// 	answerCorrect = false;
	// }

}


//#region evaluation of answer
function evaluateAnswer(answer) {
	let words = matchingWords.map(x => x.toUpperCase());
	let valid = isdef(validSounds) ? validSounds.map(x => x.toUpperCase()) : [];
	console.log('valid', valid)
	answer = answer.toUpperCase();
	if (words.includes(answer)) {
		setScore(score + 1);
		successMessage();
		hintMessage.innerHTML = answer;
		return true;
	} else if (valid.includes(answer)) {
		//this is a word that sounds just like bestWord!
		setScore(score + 1);
		successMessage();
		hintMessage.innerHTML = bestWord.toUpperCase();
		return true;


	} else {
		setScore(score - 1);
		addHint();
		if (bestWord == hintWord) {
			trySomethingElseMessage();
			console.log('NICHT ERRATEN!!!!!!!!!');
			//hintMessage.innerHTML = "let's try something else!";
			return false;
		} else {
			failMessage();

		}
		//console.log('evaluateAnswer_: hintWord',hintWord,'bestWord',bestWord);

		return false;
	}
}
function setScore(sc) { score = sc; }
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
	mClass(dParent, 'sidebarContainer');
	mClass(d, 'sidebar');
	return d;
}
function mSidebarMenu(dParent, captionList, handler) {

}
