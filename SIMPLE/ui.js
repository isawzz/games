//#region init UI
function initTable() {
	let table = mBy('table');
	clearElement(table);

	initLineTop();
	initLineMiddle();
	//initLineBottom();
}
function initLineTop() {
	dLineTopOuter = mDiv(table); dLineTopOuter.id = 'lineTopOuter';
	dLineTop = mDiv(dLineTopOuter); dLineTop.id = 'lineTop';
	dLineTopLeft = mDiv(dLineTop); dLineTopLeft.id = 'lineTopLeft';
	dLineTopRight = mDiv(dLineTop); dLineTopRight.id = 'lineTopRight'; dLineTopRight.innerHTML = 'O';
	dLineTopMiddle = mDiv(dLineTop); dLineTopMiddle.id = 'lineTopMiddle';

	let dScore = mDiv(dLineTopLeft);
	dScore.id = 'scoreDiv';
	dScore.innerHTML = "<span>score:</span><span id='scoreSpan'>0</span>";
	// mLinebreak(table);

	let b = mButton(immediateStart ? 'NEXT' : 'start', onClickStartButton, dLineTopMiddle, {}, ['bigCentralButton2']);
	b.id = 'bStart';

	mLinebreak(table);
}
function initLineMiddle() {
	dLineMidOuter = mDiv(table); dLineMidOuter.id = 'lineMidOuter';
	dLineMid = mDiv(dLineMidOuter); dLineMid.id = 'lineMid';
	dLineMidLeft = mDiv(dLineMid); dLineMidLeft.id = 'lineMidLeft'; dLineMidLeft.innerHTML = 'O';
	dLineMidMiddle = mDiv(dLineMid); dLineMidMiddle.id = 'lineMidMiddle';
	dLineMidRight = mDiv(dLineMid); dLineMidRight.id = 'lineMidRight'; dLineMidRight.innerHTML = 'O';

	mLinebreak(table);
}
function initLineBottom() {
	dLineBottomOuter = mDiv(table); dLineBottomOuter.id = 'lineBottomOuter';
	dLineBottom = mDiv(dLineBottomOuter); dLineBottom.id = 'lineBottom';
	dLineBottomLeft = mDiv(dLineBottom); dLineBottomLeft.id = 'lineBottomLeft';
	dLineBottomRight = mDiv(dLineBottom); dLineBottomRight.id = 'lineBottomRight'; dLineBottomRight.innerHTML = 'O';
	dLineBottomMiddle = mDiv(dLineBottom); dLineBottomMiddle.id = 'lineBottomMiddle';

	mLinebreak(table);
}
function initSidebar() {
	let sidebar = mBy('sidebar');
	mText('language:', sidebar);
	mButton(currentLanguage, onClickSetLanguage, sidebar, { width: 100 });
	mText('categories:', sidebar);
	let names = selectedEmoSetNames;
	//console.log(names);
	for (const name of names) {
		let uName = name;
		let b = mButton(uName.toUpperCase(), () => onClickGroup(uName), sidebar, { display: 'block', 'min-width': 100, 'margin-bottom': '4px' }, ['buttonClass']);
		b.id = 'b_' + uName;
	}
}
function initOptionsUi() {
	let dOptions = mText('options:', sidebar); // options

	//console.log('pauseAfterInput',pauseAfterInput)
	addYesNoOption('pauseAfterInput', pauseAfterInput, 'pause', focusOnInput, dOptions, { width: 100 });
	addYesNoOption('speakMode', speakMode, 'speak', switchModeSilently, dOptions, { width: 100 });
}
function keyUpHandler(ev) {
	//console.log('key released!', ev);
	//console.log('*** keyUpHandler: status', status, 'key', ev.keyCode, 'input vis', isdef(inputBox) ? isVisible(inputBox) : 'no', 'mode', interactMode)
	if (ev.keyCode == '13' && interactMode == 'write' && !isVisible(inputBox)) {
		//console.log('******* FIRING!!!!!!!!!!!!!!!!!!!!')
		fireClick(mBy('bStart'));
		//nextWord();// && isButtonActive()) { fireClick(mBy('bStart')); }
	}
	//if (ev.keyCode == '13' && status=='wait' && !pauseAfterInput) nextWord();// && isButtonActive()) { fireClick(mBy('bStart')); }
	//if (ev.keyCode == '13' && isButtonActive()) { nextWord();}//fireClick(mBy('bStart')); }
}


