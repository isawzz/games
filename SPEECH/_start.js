window.onload = SPEECHStart;

async function SPEECHStart() {
	//SIGI = false; await reconstructX(); while (!SIGI) { await sleepX(2000); } clearElement(table); //load from scratch
	await loadAssets();
	ensureSymBySet();
	addEventListener('keyup', keyUpHandler);
	setStatus('wait');
	score = 0;
	initTable(); 
	let sidebar = mBy('sidebar'); 
	mText('language:', sidebar);
	mButton(currentLanguage, onClickSetLanguage, sidebar, { width: 100 });
	mText('categories:', sidebar);
	let names = selectedEmoSetNames; 
	//console.log(names);
	for (const name of names) {
		let uName = name;
		let b = mButton(uName.toUpperCase(), () => onClickGroup(uName), sidebar, { display: 'block', 'min-width': 100 }, ['buttonClass']);
		b.id = 'b_' + uName;
	}
	setGroup(startingCategory);
	initOptionsUi();
	if (immediateStart) {bStart.innerHTML='NEXT';onClickStartButton();}
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
	let d = mText(html,dParent);
	d.id=getStandardTagId('e',caption);//'div_'+flagName;
	//console.log(d)
	let para = d.children[0];
	para.onmouseup=onClick;
	//console.log('input should be',inp);
	return d;

}
function initOptionsUi() {
	let dOptions = mText('options:', sidebar); // options

	//console.log('pauseAfterInput',pauseAfterInput)
	addYesNoOption('pauseAfterInput',pauseAfterInput,'pause', focusOnInput, dOptions, { width: 100 });
	addYesNoOption('speakMode',speakMode,'speak', switchModeSilently, dOptions, { width: 100 });
}
function initTable() {
	let table = mBy('table');
	clearElement(table);

	let dScore = mDiv(table);
	dScore.id = 'scoreDiv'
	dScore.innerHTML = "<span>score:</span><span id='scoreSpan'>0</span>";
	mLinebreak(table);

	let b = mButton('start', onClickStartButton, table, {}, ['bigCentralButton2']);
	b.style.marginTop = '12px';
	b.id = 'bStart';
	mLinebreak(table);

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











