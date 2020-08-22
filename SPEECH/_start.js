window.onload = SPEECHStart;

async function SPEECHStart() {
	//let x='hal_l_'.indexOf('_');	console.log(x);return;

	await loadAssets();
	// test02();return;

	//groupSizeTest(); return; //daraus soll werden: presortGroups!!!

	// let x=multiSplit('hallo-das ist! ein string',[' ','-','!']);
	// console.log(x)

	//console.log('WAAAAAAAAAAAAAAAAAAAAAAAAAS?')
	//testSidebar();
	// let x=simpleWordListFromString('" hallo das, ist gut');
	// console.log(x);	return;
	//console.log(emojiChars)
	addEventListener('keyup', keyUpHandler);
	await testSpeech();
	// console.log('hallo')
	// testCheckbox();
}
function getStandardTagId(elem,postfix){
	let cat=isString(elem)?elem:getTypeOf(elem);
	return cat+'_'+postfix;
}
function addYesNoOption (flagName, flagInitialValue, caption, handler, dParent, styles, classes){

	function onClick(ev) {
		//console.log('triggered',ev)
		window[flagName] = !window[flagName];
		if (isdef(handler)) handler(...arguments);
		//console.log('hallo!!!!!',window[flagName]);

		ev.cancelBubble=true;
		ev.stopPropagation = true;
	}

	//console.log(flagName,flagInitialValue)
	//#region code
	// let d=mDiv(dParent);
	// let p = mCreate('p');
	// let inp = mCreate('input');
	// inp.type = 'checkbox';
	// inp.id = flagName;
	// inp.checked = (flagInitialValue == true);
	// mAppend(p,inp);
	// mAppend(d,p);
	// let label = mCreate('label');
	// label.for = flagName;
	// label.innerHTML = caption;
	// mAppend(p,label);
	// return d;
	//#endregion
	//let x=false; //flagInitialValue; //true;
	let html=`
	<p>
		<input type="checkbox" `+ (flagInitialValue?'checked=true':'') +` id="${flagName}">
		<label for="${flagName}">${caption}</label>
	</p>
	`;
	let d = mTextDiv(html,dParent);
	d.id=getStandardTagId('e',caption);//'div_'+flagName;
	//console.log(d)
	let para = d.children[0];
	para.onmouseup=onClick;
	//console.log('input should be',inp);
	return d;

}
function initOptionsUi() {
	let dOptions = mTextDiv('options:', sidebar); // options

	//console.log('pauseAfterInput',pauseAfterInput)
	addYesNoOption('pauseAfterInput',pauseAfterInput,'pause', focusOnInput, dOptions, { width: 100 });
	addYesNoOption('speakMode',speakMode,'speak', switchModeSilently, dOptions, { width: 100 });
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
	//console.log('*** keyUpHandler: status', status, 'key', ev.keyCode, 'input vis', isdef(inputBox) ? isVisible(inputBox) : 'no', 'mode', interactMode)
	if (ev.keyCode == '13' && interactMode == 'write' && !isVisible(inputBox)) {
		//console.log('******* FIRING!!!!!!!!!!!!!!!!!!!!')
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
	//mTextDiv('hallo',table);
	table.style.fontSize = '100px';
	mTextDiv(em, table);
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











