var table = mBy('table');
window.onload = async () => { await loadAssets(); test16(); }

function test16(){
	let res = searchSymbol('heart',allWordsContainedInProps,'eduplo',['key']);
	console.log('res',res);
}
function test15(){
	let info = picRandomSearch('shield','icon');
	console.log(info)
}
function test14(){
	let infolist = picSearch('shield');
	infolist = picSearch('shield','iduplo');
	console.log(infolist.map(x=>x.key));
}

function test13() {
	// let infolist = searchSymbol('heart');console.log(infolist); return;
	// let infolist = allWordsContainedInKeys(symbolDict,['heart','red']); console.log(infolist); return;
	// let infolist = allWordsContainedInKeysAsWord (symbolDict,['heart','red']);	console.log(infolist); return;
	// let infolist = searchSymbol(['heart','red'],allWordsContainedInKeysAsWord);	console.log(infolist); return;
	// let infolist = searchSymbol(['heart','red'],anyWordContainedInKeysAsWord);	console.log(infolist); return;
	// let infolist = searchSymbol(['hea','red'],anyWordContainedInKeys);	console.log(infolist); return;
	// let infolist = allWordsContainedInProps(symbolDict,['heart'],['E','D']);console.log(infolist.map(x=>x.D)); return;
	// let infolist = allWordsContainedInProps(symbolDict,toUmlaut(['froehlich']),['E','D']);console.log(infolist.map(x=>x.D)); return;
	// console.log(fromUmlaut(['über','ähnlich'])); return;
	// console.log(toUmlaut(['über','ähnlich'])); return;
	// let infolist = allWordsContainedInProps(symbolDict,toUmlaut(['froh']),['E','D']);console.log(infolist.map(x=>x.D)); return;
	// let infolist = allWordsContainedInPropsAsWord(symbolDict,['red'],['E','D']);console.log(infolist); return;
	// let infolist = anyWordContainedInProps(symbolDict,['herz'],['D']);console.log(infolist); return;
	// console.log('hallo'.indexOf(' '));
	// console.log('ha llo'.indexOf(' '));
	// console.log('hallo '.indexOf(' '));

	let c = blankCard();
	mAppend(table, c);

	let info = picInfo()

	//let res = pic
	let res = picDrawRandom('emo', null, c, { w: 20, h: 20, padding: 4 });


}

function test12() {
	let res = picDrawRandom('emo', null, table, { w: 200, h: 200 });
}

function test11() {
	let styles = {
		family: 'arial',
		'font-weight': 900,
		bg: 'random',
		fg: 'contrast',
		padding: 15,
		'box-sizing': 'border-box'
	};
	let longtext = 'hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren! hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren!';

	let rect = { w: 140, h: 200, cx: 80, cy: 100 };
	styles.w = rect.w;
	fitText(longtext, rect, table, styles);

	rect = { w: 100, h: 200, cx: 220, cy: 100 };
	styles.w = rect.w;
	fitText(longtext, rect, table, styles);

	rect = { w: 140, h: 140, cx: 120, cy: 300 };
	styles.w = rect.w;
	fitText(longtext, rect, table, styles);
}

function test10() {
	let rect = { w: 140, h: 200, cx: 120, cy: 100 };
	let longtext = 'hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren! hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren!';
	let styles = {
		family: 'arial',
		'font-weight': 900,
		w: rect.w,
		bg: 'random',
		padding: 15,
		'box-sizing': 'border-box'
	};

	fitText(longtext, rect, table, styles);
}

function test9() {
	let rect = { w: 140, h: 200, cx: 120, cy: 100 };
	let longtext = 'hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren! hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren!';
	fitText(longtext, rect, table, { padding: 15, 'box-sizing': 'border-box' });
}
function test8() {
	let table = mBy('table');
	let rect = { w: 100, h: 100, cx: 120, cy: 100 };
	let text = 'hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren!';
	let longtext = 'hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren! hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren!';

	fitText(longtext, rect, table, { padding: 5, 'box-sizing': 'border-box' });
}

function test7() {
	let styles = {};
	styles.fz = '25px';
	styles.family = 'arial';
	styles['font-weight'] = 'normal';
	styles.display = 'inline-block';
	styles.bg = 'red';
	styles.w = 200;
	let size = getSizeWithStyles('hallo', jsCopy(styles));

	let d = mText('hallo', table, null, styles); //,null,styles);
	//mStyles(d,styles);
	let b = getBounds(d);
	console.log(size, b);

}


function test6() {
	let table = mBy('table');
	let klist = picFilter('icon');
	let key = chooseRandom(klist);

	key = 'card-2-spades';
	console.log('key', key);
	let info = symbolDict[key];
	console.log('info', info)

	picDraw(info, table, {
		//align: 'left',
		w: 70, h: 110,
		//fg: 'random', bg: 'random',
		//padding: 0,
		border: '2px solid red',
		//shape: 'ellipse'
	}); //modifies info!
	//picDraw(info, table,{ w:200, h:200, fg:'random', bg:'random', padding:4, border:'red', rounding:4 }); //modifies info!
	//info.type = 'emotext';
	//picDraw(info, table); //, { bg: 'random', fg: 'random', w: 200, h: 200, fz: 100, padding:10});
	//let res = mPicSimple(info,table,{ bg: 'random', fg: 'random',w:100,h:100});
	//picDraw(info, table, { bg: 'random', fg: 'random', fz: 100, padding:20 });// padding:20, fz: 200});
}
function test5() {

	//let res = picFilter('iduplo'); //ok
	let res = picFilter('emo', x => symbolDict[x].isDuplicate == false);
	//let res = picFilter('all'); //ok
	//let res = picFilter('emo'); //ok
	//let res = picFilter('all','f156'); //ok faIconCodes
	// let res = picFilter('icon','bee'); //ok
	// let res = picFilter('all','1F481-200D-2642-FE0F'); //ok
	// let res = picFilter('icon','1F40B'); //ok =>icons hat kein solches hex!!!
	// let res = picFilter('all','1F40B'); //ok
	// let res = picFilter(0,'dog'); //ok
	console.log('==>result', res)
}
function test4() {
	// let info = showPic('table','emo',{bg:'blue',w:150,margin:25,padding:23,h:120});
	let info = showPic2('table', { type: 'duplo' }, { bg: 'blue', w: 150, margin: 25, padding: 23, h: 120 });

}
function getPI(type, key, hex) {
	//list ALL possibilities!!!
	console.log(key, 'is dupl', duplicateKeys.includes(key))
	if ((type == 'icon' && isdef(key) && duplicateKeys.includes(key))
		|| (isdef(hex) && hex[0] == 'i')) {
		key = 'i_' + key; type == 'icon';
	}

	console.log('type', type, 'key', key)
	let info = isdef(key) ? getPicInfo(key)
		: isdef(hex) ? getPicInfo(symByHex[hex])
			: getRandomPicInfo(type);
	//let info = getPicInfo('woman golfing'); //'waving hand');
	//info = getPicInfo('mechanical leg');
	//console.log('key:', info.key, '('+info.group, info.subgroups+')', '\ninfo', info);
	return info;
}
function showPic2(area, { type = 'emo', key, hex }, styles, classes) {

	let table = mBy(area);
	let info = getPI(type, key, hex);

	let ui;
	if (info.type == 'icon') {
		console.log('text', info.text)
		ui = mText(info.text, table, null, { family: info.family, fz: 200, bg: 'red', fg: 'green', display: 'inline' });
	} else {
		ui = mSvg('/assets/svg/twemoji/' + info.hexcode + '.svg', table, { w: 200, h: 200 });
	}
	if (isdef(styles)) mStyleX(ui, styles);
	if (isdef(classes)) mClass(ui, classes);
	info.ui = ui;
	return info;
}

function test3() {
	let table = mBy('table');
	let hexcode = '1F3FC'; //das ist ein skintone!
	hexcode = '1F477'; //gibt es! der rest ist special code!
	mSvg('/assets/svg/twemoji/' + hexcode + '.svg', table, { w: 200, h: 200 });
}

function isEmojiKey(hex) { return isdef(emojiChars[hex]); }
function selectKey(func) {

}
function showPic(area, typeHexKey, styles, classes) {

	let table = mBy(area);
	let type = ['emo', 'random', 'icon', 'duplo'].includes(typeHexKey) ? typeHexKey : 'random';
	let hex = isEmojiKey(typeHexKey) ? typeHexKey : null;
	let key = typeHexKey != 'random' && type == 'random' && !hex ? typeHexKey : null;

	let info = key ? getPicInfo(key) : hex ? getPicInfo(emojiChars[hex].annotation) : getRandomPicInfo(type);
	//let info = getPicInfo('woman golfing'); //'waving hand');
	//info = getPicInfo('mechanical leg');
	console.log('info', info.key, info);

	let ui;
	if (info.type == 'icon') {
		console.log('text', info.text)
		ui = mText(info.text, table, null, { family: info.family, fz: 200, bg: 'red', fg: 'green', display: 'inline' });
	} else {
		ui = mSvg('/assets/svg/twemoji/' + info.hexcode + '.svg', table, { w: 200, h: 200 });
	}
	if (isdef(styles)) mStyleX(ui, styles);
	if (isdef(classes)) mClass(ui, classes);
	info.ui = ui;
	return info;
}
function test2() {
	let type = 'emo';
	let table = mBy('table');
	let info = getRandomPicInfo(type);
	//let info = getPicInfo('woman golfing'); //'waving hand');
	//info = getPicInfo('mechanical leg');
	console.log('info', info.key, info);

	if (info.type == 'icon') {
		console.log('text', info.text)
		let d = mText(info.text, table, null, { family: info.family, fz: 200, bg: 'red', fg: 'green', display: 'inline' });
	} else {
		mSvg('/assets/svg/twemoji/' + info.hexcode + '.svg', table, { w: 200, h: 200 });
	}

}
function getRandomIconKey() {
	let keys = Object.keys(symbolDict);
	keys = keys.filter(x => symbolDict[x].type == 'icon');
	return chooseRandom(keys);
}

function test1() {

	let key = 'onion'; let table = mBy('table');

	// all code needed fuer emoji:
	let info = getPicInfo(key);
	mSvg('/assets/svg/twemoji/' + info.hexcode + '.svg', table, { w: 200, h: 200 });
	console.log('info', key, info);

	// all code needed fuer iconChar OR emoji:
	let k = getRandomPicKey(); //getRandomIconKey(); //'crow'
	info = getPicInfo(k);
	console.log(k, info);
	let d = mDiv(table);
	mStyleX(d, { family: info.family, fz: 200 });
	//mClass(d,'fa')
	//d.style.fontFamily = info.family;
	let hex = info.hexcode;
	let parts = hex.split('-');
	let res = '';
	for (const p of parts) {
		decCode = hexStringToDecimal(p);
		s1 = '&#' + decCode + ';';
		res += s1;
	}
	s1 = res;
	d.innerHTML = s1;
	//d.style.fontSize = 200 + 'pt';

}
function test() {
	let key = '1F9C5'; let table = mBy('table');

	// let x = mTextDiv(key, table); mStyleX(x, { fz: 100, family: 'emoColor' });

	mSvg('/assets/svg/twemoji/' + key + '.svg', table, { w: 200, h: 200 });
	mSvg('/assets/svg/openmoji/' + key + '.svg', table, { w: 200, h: 200 });


	let decCode = hexStringToDecimal(key); let s1 = '&#' + decCode + ';'; // Emoji=Yes;'; //'\u{1F436}';
	x = mTextDiv(s1, table);
	mStyleX(x, { fz: 200, family: 'emoColor' });
	mClass(x, 'removeOutline');
	//mClass(x,['c']);

	decCode = hexStringToDecimal(key);
	s1 = '&#' + decCode + ';'; // Emoji=Yes;'; //'\u{1F436}';
	x = mTextDiv(s1, table);
	mStyleX(x, { fz: 200, family: 'emoColor' });
	//let e = mEmoTrial2(key, table, {"font-size":200,bg:'green'});
}