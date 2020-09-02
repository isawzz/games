window.onload = SPEECHStart;

async function SPEECHStart() {
	//let x='hal_l_'.indexOf('_');	console.log(x);return;

	await loadAssets();
	// test02();return;

	// let x=multiSplit('hallo-das ist! ein string',[' ','-','!']);
	// console.log(x)

	//console.log('WAAAAAAAAAAAAAAAAAAAAAAAAAS?')
	//testSidebar();
	// let x=simpleWordListFromString('" hallo das, ist gut');
	// console.log(x);	return;
	//console.log(emojiChars)
	addEventListener('keyup', keyUpHandler);
	testSpeech();
}
function addYesNoOption (flagName, flagInitialValue, caption, handler, dParent, styles, classes){
	let html=`
	<p>
		<input type="checkbox" id="${flagName}" name="cb">
		<label for="${flagName}">${caption}</label>
	</p>
	`;
	mText(html,dParent);

}
function initOptionsUi() {
	let dOptions = mText('options:', sidebar); // options

	addYesNoOption('pauseAfterInput',pauseAfterInput,'pause', focusOnInput, dOptions, { width: 100 });
	// addYesNoOption('speakMode',speakMode,'speak', restart, dOptions, { width: 100 });
	// let html=`
	// <p>
	// 	<input type="checkbox" id="c1" name="cb">
	// 	<label for="c1">Option 01</label>
	// </p>
	// `;
	// mText(html,dOptions);

	//mCheckbox('pauseAfterInput', pauseAfterInput, 'pause', focusOnInput, sidebar, { width: 100, bg: 'pink' });
	//mButtonCheckmark('pauseAfterInput', pauseAfterInput, 'PAUSE', focusOnInput, sidebar, { width: 100 });
	//mButton(getPauseHtml(), onClickPause, sidebar, { width: 100 });
	// mButton(pauseAfterInput?'✓\tpause':'\tpause',onClickPause,sidebar,{width:100});


}
function initTable() {
	let dScore = mDiv(table);
	dScore.id = 'scoreDiv'
	dScore.innerHTML = "<span>score:</span><span id='scoreSpan'>0</span>";
	mFlexLinebreak(table);

	let b = mButton('start', onClickStartButton, table, {}, ['bigCentralButton2']);
	b.style.marginTop = '12px';
	b.id = 'bStart';
	mFlexLinebreak(table);

}
function keyUpHandler(ev) {
	//console.log('key released!', ev);
	console.log('*** keyUpHandler: status', status, 'key', ev.keyCode, 'input vis', isdef(inputBox) ? isVisible(inputBox) : 'no', 'mode', interactMode)
	if (ev.keyCode == '13' && interactMode == 'write' && !isVisible(inputBox)) {
		console.log('******* FIRING!!!!!!!!!!!!!!!!!!!!')
		fireClick(mBy('bStart'));
		//nextWord();// && isButtonActive()) { fireClick(mBy('bStart')); }
	}
	//if (ev.keyCode == '13' && status=='wait' && !pauseAfterInput) nextWord();// && isButtonActive()) { fireClick(mBy('bStart')); }
	//if (ev.keyCode == '13' && isButtonActive()) { nextWord();}//fireClick(mBy('bStart')); }
}


function mPara(txt, parent) {
	let p = mCreate('p');
	p.innerHTML = txt;
	if (isdef(parent)) mAppend(parent, p);
	return p;
}
function test01() {
	let em = '🖱️';
	em = '&#x1F5B1;';
	em = String.fromCodePoint(0x1F5B1);
	let table = mBy('table');
	table.style.backgroundColor = 'red';
	//mText('hallo',table);
	table.style.fontSize = '100px';
	mText(em, table);
	mPara(em, table);
	// let p=mCreate('p');
	// p.innerHTML = em;
	// mInsertFirst(table,p);
	// p.style.fontSize='68pt';
	return;
}
function test02() {
	let k = '1F5B1';
	let d = mBy('table');
	//d.style.fontSize='100pt';
	let x = mEmoTrial2('computer mouse', table, { align: 'center', width: 250, border: '4px solid red', rounding: 14, bg: 'yellow', fontSize: 50 });
}











