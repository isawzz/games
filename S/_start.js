window.onload = SPEECHStart;
window.onbeforeunload = SPEECHEnd;

async function SPEECHStart() {
	//await perfLoading(); return;
	//timit = new TimeIt('hallo ' + USE_LOCAL_STORAGE);
	await loadAssets();
	//timit.show('nach loadAssets');
	ensureSymBySet();
	//timit.show('nach ensureSymBySet');
	symbolDictCopy = jsCopy(symbolDict);

	addEventListener('keyup', keyUpHandler);
	//setStatus('wait');
	score = 0;
	initTable();
	// initSidebar();
	setGroup(startingCategory);
	//timit.show('vor immediateStart!'); 
	//initOptionsUi();
	if (immediateStart) onClickStartButton(); // { bStart.innerHTML = 'NEXT'; onClickStartButton(); } //fireClick(mBy('dummyButton')); 
	//initSpeaker();
}
function SPEECHEnd() {
	if (hasSymbolDictChanged) {
		downloadAsYaml(symbolDictCopy, 'symbolDictCopy');
	}
}
function getStandardTagId(elem, postfix) {
	let cat = isString(elem) ? elem : getTypeOf(elem);
	return cat + '_' + postfix;
}
function addYesNoOption(flagName, flagInitialValue, caption, handler, dParent, styles, classes) {

	function onClick(ev) {
		//console.log('triggered',ev)
		window[flagName] = !window[flagName];
		if (isdef(handler)) handler(...arguments);
		//console.log('hallo!!!!!',window[flagName]);

		ev.cancelBubble = true;
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
	let html = `
	<p>
		<input type="checkbox" `+ (flagInitialValue ? 'checked=true' : '') + ` id="${flagName}">
		<label for="${flagName}">${caption}</label>
	</p>
	`;
	let d = mText(html, dParent);
	d.id = getStandardTagId('e', caption);//'div_'+flagName;
	//console.log(d)
	let para = d.children[0];
	para.onmouseup = onClick;
	//console.log('input should be',inp);
	return d;

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
function test03() {
	//want to convert an object symbolDict to a csv list of records
	let o = symbolDict;
	let lines = [];
	for (const k in o) {
		let line = '';

	}
}
async function perfLoading() {
	let timit = new TimeIt('hallo ' + USE_LOCAL_STORAGE);
	//SIGI = false; await reconstructX(); while (!SIGI) { await sleepX(2000); } clearElement(table); //load from scratch
	//timit.show('nach reconstruct...'+USE_LOCAL_STORAGE);
	await loadAssets(); // load from symbolDict
	timit.show('nach loadAssets');
	USE_LOCAL_STORAGE = false;
	await loadAssets(); // load from symbolDict
	timit.show('nach re-loadAssets');
	USE_LOCAL_STORAGE = true;

	ensureSymBySet();
	ensureSymByType();
	timit.show('nach load by set,type')
	await ensureSvgDict();
	timit.show('nach load svgDict')
}


function ConvertToCSV(objArray) {
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
	var str = '';

	for (var i = 0; i < array.length; i++) {
		var line = '';
		for (var index in array[i]) {
			if (line != '') line += ','

			line += array[i][index];
		}

		str += line + '\r\n';
	}

	return str;
}










