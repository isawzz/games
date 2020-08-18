
async function testSpeech() {
	setGroup(startingCategory);
	setStatus('wait');
	score = 0;

	initTable(); //button and score ui

	let sidebar = mBy('sidebar'); //init sidebar
	mTextDiv('language:', sidebar);
	mButton(lang, onClickSetLanguage, sidebar, { width: 100 });
	mTextDiv('categories:', sidebar);
	let names = selectedEmoSetNames; //emoSets.map(x=>x.name).sort();
	//console.log(names);
	for (const name of names) {
		let b = mButton(name, () => onClickGroup(name), sidebar, { display: 'block', 'min-width': 100 });
	}

	initOptionsUi();
}
function mCheckbox(flagName, flagInitialValue, caption, handler, dParent, styles, classes) {
	function onClick() {
		console.log('CLICK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
		let newValue = window[flagName] = !window[flagName];
		console.log('this',this)
		this.firstChild.firstChild.checked = newValue;
		if (isdef(handler)) handler(...arguments);
	}
	//<input class='radio' id='c_b_mm_pln1' type="checkbox" name="playerNum" onclick='onClickPlayerPresence(1)'><span id='sppl1'>player 1</span><br>
	
	let html = `<label><input type="checkbox" name="checkbox" value="value">${caption}</label>`;
	let res = mTextDiv(html,dParent);
	res.onclick = onClick;
	//if (isdef(styles)) mStyleX(res, styles);
	//if (isdef(classes)) { mClass(res, ...classes); }

	return res;
	
	let x = mCreate('input');
	x.innerHTML = caption; x.type = 'checkbox';

	if (nundef(window[flagName])) window[flagName] = flagInitialValue;

	x.checked = flagInitialValue;
	x.style.display = 'inline'
	

	if (isdef(handler)) x.onclick = handler;
	let label=mCreate('label'); if (isdef(dParent)) dParent.appendChild(label);
	mAppend(label,x);mTextDiv(caption,label)
	if (isdef(styles)) mStyleX(x, styles);
	if (isdef(classes)) { mClass(x, ...classes); }

	return x;

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
		if (isdef(handler)) handler(...arguments);
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

	score = 0;
	let dScore = mDiv(table);
	dScore.id = 'scoreDiv';
	dScore.innerHTML = "<span>score:</span><span id='scoreSpan'>0</span>";
	mFlexLinebreak(table);

	let b = mButton('start', onClickStartButton, table, {}, ['bigCentralButton2']);
	b.style.marginTop = '12px';
	b.id = 'bStart';
	mFlexLinebreak(table);
	//console.log('nextWord: status wird auf wait gesetzt!!!')
	setStatus('wait');
	answerCorrect = false;
	RESTARTING = false;

}
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
	} else if (pauseAfterInput) {
		answerCorrect = false;
		return;
	} else {
		answerCorrect = false;
		if (interactMode != 'write') setTimeout(onClickStartButton, 1000);
	}
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
function setScore(sc) {
	console.log('score', sc)
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
