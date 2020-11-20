var table = mBy('table');
const problemKeys = ['person: white hair', 'fire-dash', 'horse', 'warehouse']
const listOther = ['student', 'astronaut', 'teacher', 'judge', 'farmer', 'cook', 'mechanic', 'factory worker',
	'office worker', 'scientist', 'technologist', 'singer', 'artist', 'pilot', 'firefighter', 'guard'];
const levelColors = [LIGHTGREEN, LIGHTBLUE, YELLOW, 'orange', RED,
	GREEN, BLUE, PURPLE, YELLOW2, 'deepskyblue',
	'deeppink', TEAL, ORANGE, 'seagreen', FIREBRICK, OLIVE,
	// '#911eb4', '#42d4f4', '#f032e6',	'#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#aaffc3', 
	'#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', 'gold', 'orangered', 'skyblue', 'pink', 'deeppink',
	'palegreen', '#e6194B'];
//['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'];


window.onload = async () => { await start(); }
//addEventListener('keydown',show100);

async function start() {
	//SIGI = false; await reconstructX(); while (!SIGI) { await sleepX(2000); } clearElement(table); //load from scratch
	await loadAssets(); // load from symbolDict


	//test45_leiste_und_pics();
	test44();
	// test43();



	//#region past test calls
	//test43(); //test40();
	//await perf01('animal');
	//await perf02('animal');
	// test10_fz();
	// let d=maPic(picRandom(), table, { fz:36, bg: 'random', fg: 'random' });
	// test17_grid(10);
	// test17_grid(9);
	// test19_grid_justify_items_stretch(12);
	// test18_inlineGrid(10);
	// test18_inlineGrid(9);
	// test20_grid_place_content(); //geht voll!!!
	// test21_flex_mit_flex_table();
	// test25_layoutGrid();
	// test26_layoutFlex();
	// test28_maPicLabelParams();
	// test29_mpl(100,'algerianregular');
	// test16_openMojis(); //OK
	// test30_personPlayingHandball();
	// test27_hybrid_elems(); //OK
	// test28_maPicLabelParams(); ok
	// test29_mpl(); //ok
	// test31_hybrids();
	// test32_keycap();
	// testKey('people holding hands');
	// testHex('1F9D1-200D-1F91D-200D-1F9D1');
	// test33();
	// test34_emoImages();
	//test_emoFonts();
	//testKey('sheep')
	//await makeHugeSvgFile();
	//let x=range(1,56,4);console.log(x);
	//let x=loop(10);console.log(x);

	//#endregion

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
async function perf02(setname = 'animal') {
	await ensureSvgDict();
	ensureSymBySet();
	let styles = { w: 100, h: 100, bg: 'blue', fg: 'gold', margin: 4, align: 'center' };
	let info = picSet(setname);
	info = picInfo('bird'); //picInfo('llama');
	console.log('key', info.key)
	maPic4(info, table, styles);
}

async function perf01(name) {
	//let timit = new TimeIt('hallo');
	await ensureSvgDict();
	//timit.show('nach load svgDict:');
	ensureSymBySet();
	//timit.show('nach load sets:');
	mStyleX(table, { display: 'flex', 'flex-flow': 'row wrap' });
	let n = 100;
	let infolist = isdef(name) ? symListBySet[name] : loop(n).map(x => picRandom('emo'))
	let styles = {
		w: 100, h: 100, bg: 'blue',
		fg: 'gold', margin: 4, align: 'center'
	};

	infolist = arrTake(infolist, 100);

	//orig font text: sizing should be correct!!!
	mText('font: emoNoto', table);
	for (const info of infolist) {
		maPic(info, table, styles, true);
	}
	//timit.show('nach text emoNoto:');
	mLinebreak(table);

	//segoe ui emoji
	for (const ff of EMOFONTLIST) {  //['emoOpen', 'openmoBlack', 'segoe ui emoji', 'segoe ui symbol']) {
		if (ff == 'emoOpen') continue;
		mText('font: ' + ff, table);
		for (const info of infolist) {
			maPic(info, table, styles, true, ff);
		}
		//return;
		//timit.show('nach font:',ff);
		mLinebreak(table);
		//throw new Error();
	}


	mText('font: emoOpen', table);
	for (const info of infolist) {
		maPic(info, table, styles, true, true);
	}
	//timit.show('nach text emoOpen:');
	mLinebreak(table);

	mText('img: twemoji', table);
	for (const info of infolist) {
		maPic(info, table, styles, false);
	}
	//timit.show('nach img twemoji:');
	mLinebreak(table);

	mText('img: openmoji', table);
	for (const info of infolist) {
		maPic(info, table, styles, false, true);
	}
	//timit.show('nach img openmoji:');

}
function testO(info) {
	let styles = { w: 50, h: 50, bg: 'random', fg: 'random' };
	maPicLabel(info, dParent, styles, false, true);
}

function test_emoFonts() {
	let textlist = ['&#x25c0;',
		'&#x2708; ',
		'&#129489;&#8205;&#129309;&#8205;&#129489;',
		'&#129489;',
		'&#129309;',
	];
	let fonts = ['arial', 'segoe UI', 'segoe UI symbol', 'segoe UI emoji', 'emoNoto', 'emoOpen', 'openmoBlack'];
	mStyleX(table, { display: 'flex', 'flex-flow': 'row wrap' });
	//mClass(table,'flexWrap');
	for (const family of fonts) {
		let d = mDiv(table, { w: 100, align: 'right' });
		d.innerHTML = family + ':';
		for (const text of textlist) {
			d = mDiv(table);
			let styles = { fz: 40, border: 'black', margin: 4, align: 'center', family: family }; //, bg:'random',fg:'contrast' };
			mStyleX(d, styles);
			d.innerHTML = text;
		}
		mLinebreak(table);
	}
}
function testHex(hex, isText = true, isOmoji = false) {
	let picStyles = { h: 50, bg: 'hotpink', fg: 'pink', padding: 8, 'box-sizing': 'border-box' };
	let info = picInfo(hex);
	console.log('info', info, info.text);
	let parts = info.text.split(';');
	let d = mDiv(table);
	d.innerHTML = info.text;
	//d.style.fontFamily=info.family;Segoe UI emoji
	d.style.fontFamily = 'emoNoto'; //'Segoe UI symbol';//'Segoe UI emoji';
	d.style.fontSize = '400px';
	d.style.fontWeight = 100; //'light';
	//maPic(info, table, picStyles, isText, isOmoji);
}
function testKey(key, isText = true, isOmoji = false) {
	let picStyles = { h: 50, bg: 'hotpink', fg: 'pink', padding: 8, 'box-sizing': 'border-box' };
	let info = picInfo(key);
	console.log(info);
	maPic(info, table, picStyles, isText, isOmoji);
}

//#region tests layout....
function test34_emoImages() {
	ensureSymByType();
	let dGrid = mDiv(table);
	let elems = [];
	let picLabelStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true);

	for (const k of symKeysByType['emo'].slice(100, 1000)) {
		break;
		let info = symByType['emo'][k];
		//console.log(info);
		for (const x of [{ isText: false, isOmoji: true }, { isText: false, isOmoji: false }, { isText: true, isOmoji: true }]) {
			let el = maPicLabel(info, dGrid, picLabelStyles[0], picLabelStyles[1], picLabelStyles[2], x.isText, x.isOmoji);
			elems.push(el);
		}
	}
	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let size = layoutGrid(elems, dGrid, gridStyles, { isInline: true, cols: 3 });
}
function test33() {
	let info = picInfo('trade mark');
	console.log(symbolDict['trade mark'])
	console.log(info);
}
function test32_keycap() {
	let picLabelStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true);
	let picStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', false);
	let omojikeys = ['keycap: 0', 'keycap: 1', 'keycap: #', 'keycap: *'];
	let infolist = omojikeys.map(x => picInfo(x));
	randomHybridGrid(infolist, picLabelStyles, picStyles, false, true);
	let twekeys = ['copyright', 'registered', 'trade mark'];
	infolist = twekeys.map(x => picInfo(x));
	console.log(infolist)
	randomHybridGrid(infolist, picLabelStyles, picStyles, false, false);
}
function test31_hybrids() {
	let picLabelStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true);
	let picStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', false);
	randomHybridGrid(8, picLabelStyles, picStyles, false, false);

	picLabelStyles = getHarmoniousStylesX(100, 'arial', 'random', 'random', true, true);
	picStyles = getHarmoniousStylesX(100, 'arial', 'random', 'random', false, true);
	randomHybridGrid(8, picLabelStyles, picStyles);

	picLabelStyles = getHarmoniousStyles(100, 'arial', 'random', 'random', true);
	picStyles = getHarmoniousStyles(100, 'arial', 'random', 'random', false);
	randomHybridGrid(8, picLabelStyles, picStyles);
}

function test30_personPlayingHandball() {
	let info = picInfo('handball');
	let [g, p, t] = getHarmoniousStyles(50, 'arial', 'hotpink', 'random');
	let d = maPicLabel(info, table, g, p, t, false, true);
	let txt = d.children[1];
	console.log('result', d, '\n\n', d.firstChild, '\n\n', txt);
}
function test29_mpl(sz = 50, family = 'arial') {
	// let sz = 150; let fpic = 2 / 3; let ffont = 1 / 8; let family = 'AlgerianRegular'; let ftop = 1 / 10; let fbot = 1 / 12;
	let fpic = 2 / 3; let ffont = 1 / 8; let ftop = 1 / 9; let fbot = 1 / 12;
	let styles = { w: sz, h: sz, bg: 'blue', fg: 'contrast', patop: sz * ftop, pabottom: sz * fbot, align: 'center', 'box-sizing': 'border-box' };
	let textStyles = { family: family, fz: Math.floor(sz * ffont) };
	let picStyles = { h: sz * fpic, bg: 'random' };
	let info = picInfo('namaste');
	//console.log(info);
	let d = maPicLabel(info, table, styles, picStyles, textStyles, false, true);
	let txt = d.children[1];
	//console.log('result', d, '\n\n', d.firstChild, '\n\n', txt);
}
function test28_maPicLabelParams() {
	// let sz = 150; let fpic = 2 / 3; let ffont = 1 / 8; let family = 'AlgerianRegular'; let ftop = 1 / 10; let fbot = 1 / 12;
	let sz = 150; let fpic = 2 / 3; let ffont = 1 / 8; let family = 'arial'; let ftop = 1 / 9; let fbot = 1 / 12;

	let styles = { w: sz, h: sz, bg: 'blue', fg: 'contrast', patop: sz * ftop, pabottom: sz * fbot, align: 'center', 'box-sizing': 'border-box' };
	let textStyles = { family: family, fz: Math.floor(sz * ffont) };
	let picStyles = { h: sz * fpic, bg: 'random' };
	let info = picInfo('namaste');
	//console.log(info);
	let d = maPicLabel(info, table, styles, picStyles, textStyles, false, true);
	let txt = d.children[1];
	console.log('result', d, '\n\n', d.firstChild, '\n\n', txt);
}
function test27_hybrid_elems() {
	let list = picRandom('emo', null, 20);
	//let picStyles = { h: 50, bg: 'hotpink', fg: 'pink', padding: 8, 'box-sizing': 'border-box' };
	let container = mDiv(table);

	//let picLabelStyles = { h: 50, bg: 'random', fg: 'random' };
	let [g, p, t] = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true);
	let [g1, p1] = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', false);

	let elems = [];
	for (const info of list) {
		let el = coin() ? maPicLabel(info, container, g, p, t, false, true)
			: maPicFrame(info, container, g1, p1, false, true);
		// : maPic(info, container, picStyles, false, true);
		elems.push(el);
	}
	let containerStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let size = layoutGrid(elems, container, containerStyles, { isInline: true });
	//console.log(size);


}

function test26_layoutFlex(n = 11, rows = 2) {
	let list = picRandom('icon', null, n);
	let styles = { w: 50, h: 50, margin: 4, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	let container = mDiv(table);
	let elems = list.map(x => maPic(x, container, styles));
	let containerStyles = { padding: 4, bg: 'dimgray', w: 170, 'place-content': 'center' };
	//let containerStyles = { h: 170, 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let size = layoutFlex(elems, container, containerStyles);
	console.log(size);
}
function test25_layoutGrid(n = 11, rows = 2) {
	let list = picRandom('icon', null, n);
	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	let container = mDiv(table);
	let elems = list.map(x => maPic(x, container, styles));
	let containerStyles = { h: 170, 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let size = layoutGrid(elems, container, containerStyles, { rows: rows });
	console.log(size);
}

//#region tests maPicGrid, ...
function test24_2Variants() {
	//diese beiden:
	test23_2flex__OHNE_TABLE_FLEX();
	test24_INLINE_grid_rows();

	//sollten genau dasselbe ergebnis liefern wie diese beiden:
	// test23_2flex__MIT_TABLE_FLEX();
	// test24_grid_rows(11);

}
function test24_INLINE_grid_rows(n = 11, rows = 2) {
	//how to get n icon infos?
	let list = picRandom('icon', null, n);
	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	let containerStyles = { h: 170, 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let dOuter = maPicGrid(list, table, styles, containerStyles, { rows: rows, isInline: true });
}
function test24_grid_rows(n = 11, rows = 2) {
	//how to get n icon infos?
	let list = picRandom('icon', null, n);
	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	let containerStyles = { h: 170, 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let dOuter = maPicGrid(list, table, styles, containerStyles, { rows: rows });
}
function test23_2flex__OHNE_TABLE_FLEX() {
	let list = picRandom('icon', null, 11);
	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	let containerStyles = { padding: 4, gap: 4, bg: 'dimgray', w: 170, 'place-content': 'center' };// orientation:'v',h:220,'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let dOuter = maPicFlex(list, table, styles, containerStyles);
	let cs = { padding: 4, gap: 4, bg: 'silver', h: 170, orientation: 'v' };// orientation:'v',h:220,'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let dOuter2 = maPicFlex(list, table, styles, cs);
}
function test23_2flex__MIT_TABLE_FLEX() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: 4, bg: 'grey', padding: 4 };
	mStyleX(table, tableStyle);
	let list = picRandom('icon', null, 11);
	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	let containerStyles = { padding: 4, gap: 4, bg: 'dimgray', w: 170, 'place-content': 'center' };// orientation:'v',h:220,'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let dOuter = maPicFlex(list, table, styles, containerStyles);
	let cs = { padding: 4, gap: 4, bg: 'silver', h: 170, orientation: 'v' };// orientation:'v',h:220,'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let dOuter2 = maPicFlex(list, table, styles, cs);
}
function test22_2flex() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: 4, bg: 'grey', padding: 4 };
	mStyleX(table, tableStyle);
	test20_flex();
	test21_flex_mit_flex_table();
}
function test21_flex_mit_flex_table(n = 12) { //SAME AS test20_flex!!!!!!!!!!!!!!!!!

	//how to get n icon infos?
	let list = picRandom('icon', null, n);
	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	let containerStyles = { gap: 4, bg: 'dimgray', w: 170 };// orientation:'v',h:220,'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let dOuter = maPicFlex(list, table, styles, containerStyles);

	//brauch ich garnicht!
	//let tableStyle = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: 4, bg: 'grey', padding: 4 };
	//mStyleX(table, tableStyle);
}
function test20_flex(n = 12) {
	//how to get n icon infos?
	let list = picRandom('icon', null, n);
	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	let containerStyles = { gap: 4, bg: 'silver', w: 170 };// orientation:'v',h:220,'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	// let containerStyles = { orientation: 'v', h: 220, 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let dOuter = maPicFlex(list, table, styles, containerStyles);
}
function test20_grid_place_content(n = 12) {
	//how to get n icon infos?
	let list = picRandom('icon', null, n);
	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	let containerStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let dOuter = maPicGrid(list, table, styles, containerStyles);
}
function test19_grid_justify_items_stretch(n) {  //das ist eh der default!!!!! SUPER!
	//how to get n icon infos?
	let list = picRandom('icon', null, n);
	let styles = { align: 'center', fz: 40, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	let containerStyles = { gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let dOuter = maPicGrid(list, table, styles, containerStyles);
}
function test18_inlineGrid(n = 12) {
	//how to get n icon infos?
	let list = picRandom('icon', null, n);
	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	let containerStyles = { gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let dOuter = maPicGrid(list, table, styles, containerStyles, { isInline: true });
}
function test17_grid(n = 12) {
	//how to get n icon infos?
	let list = picRandom('icon', null, n);
	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	let containerStyles = { gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let dOuter = maPicGrid(list, table, styles, containerStyles);
}

function test16_openMojis() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'grey', padding: 4 };
	mStyleX(table, tableStyle);

	let parentStyle = { display: 'grid', 'grid-template-columns': 'repeat(4, auto)', gap: '4px', padding: 4, bg: 'silver', rounding: 5 };
	let dParent = mDiv(table);
	mStyleX(dParent, parentStyle);

	let styles = { w: 50, h: 50, bg: 'random', fg: 'random' }; //{ w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	// for (const k of arr = Array(36).fill(2)) {
	// 	let list = picSearch({ set: 'role' });
	// 	let info = chooseRandom(list);
	let result;
	for (const k of listOther) {
		let info = arrFirst(picSearch({ set: 'role', keywords: k }));
		if (nundef(info)) continue;
		let [g, p, t] = getSimpleStyles(50, undefined, 'random', 'random');
		result = maPicLabel(info, dParent, g, p, t, false, true);
		//result=maPicLabel_dep(info, dParent, styles, false, true);
	}
	console.log(result)
}
function test15_zwei_grids() {
	test13_15_roles_grid_img();
	test4_15_roles_grid();
}

//#endregion

//#region tests maPic_, maPicLabel_
function test14_mit_label() {
	for (let i = 0; i < 8; i++) {
		let d = mDiv(table, { bg: 'random', padding: 4, fg: 'contrast', margin: 2 });//mStyleX(d,{align:'center'})
		let info = picRandom('icon');
		maPic(info, d, { w: 50, h: 50, bg: 'random', fg: 'random' });
		mText(info.annotation, d);
		d.style.textAlign = 'center';
	}
	mFlex(table); //=>deshalb wird es row statt column!
}
function test13_15_roles_grid_img() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'grey', padding: 4 };
	mStyleX(table, tableStyle);

	let parentStyle = { display: 'grid', 'grid-template-columns': 'repeat(4, auto)', gap: '4px', padding: 4, bg: 'silver', rounding: 5 };
	let dParent = mDiv(table);//container);
	mStyleX(dParent, parentStyle);

	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	for (const k of listOther) {
		//let info = picRandom('emo', k);
		let info = arrFirst(picSearch({ set: 'role', keywords: k }));
		if (nundef(info)) continue;
		maPic(info, dParent, styles, false);
	}
}
function test12_1_liners_img() {
	mFlexWrap(table)
	maPic('red heart', table, { w: 50, h: 50, padding: 10, margin: 2, bg: 'yellow' }, false);
	maPic('red heart', table, { w: 50, h: 50, padding: 10, margin: 2, bg: 'yellow' });
	// maPic('crow', table, { w: 100, h: 50, bg: 'red' }); 
	// maPic('student',table,{w:100,h:100});

}
function test11_w_h_fz() {
	let tableStyles = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'grey', padding: 4 };
	let styles = { w: 50, h: 50, fz: 24, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 }; //,maleft:2};
	test5_flex_style(styles, tableStyles);
}
function test10_fz() {
	let tableStyles = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'grey', padding: 4 };
	let styles = { fz: 30, bg: 'hotpink', fg: 'pink', rounding: 5 }; //,maleft:2};
	test5_flex_style(styles, tableStyles);
}
function test9_w() {
	let tableStyles = { display: 'flex', 'flex-direction': 'column', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'grey', padding: 4 };
	let styles = { w: 100, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 }; //,maleft:2};
	test5_flex_style(styles, tableStyles);
}
function test8_h() {
	let tableStyles = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'grey', padding: 4 };
	let styles = { h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 }; //,maleft:2};
	test5_flex_style(styles, tableStyles);
}
function test7_h_fz() {
	let tableStyles = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'grey', padding: 4 };
	let styles = { h: 50, fz: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 }; //,maleft:2};
	test5_flex_style(styles, tableStyles);
}
function test6_w_fz() {
	let tableStyles = { display: 'flex', 'flex-direction': 'column', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'grey', padding: 4 };
	let styles = { w: 50, fz: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 }; //,maleft:2};
	test5_flex_style(styles, tableStyles);
}
function test5_flex_style(styles, tableStyles) {
	mStyleX(table, tableStyles);

	let N = 10;
	for (let i = 0; i < N; i++) {
		maPic(picRandom(), table, styles);
	}
}
function test4_15_roles_grid() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'grey', padding: 4 };
	mStyleX(table, tableStyle);

	let container = mDiv(table);
	let containerStyle = { display: 'inline-block' };
	//mStyleX(container, containerStyle);
	let parentStyle = { display: 'grid', 'grid-template-columns': 'repeat(4, auto)', gap: '4px', padding: 4, bg: 'silver', rounding: 5 };
	let dParent = mDiv(table);//container);
	mStyleX(dParent, parentStyle);

	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	for (const k of listOther) {
		//let info = picRandom('emo', k);
		let info = arrFirst(picSearch({ set: 'role', keywords: k }));
		if (nundef(info)) continue;
		maPic(info, dParent, styles);
	}
}
function test3_15_roles_grid() {

	let tableStyle = { display: 'inline-block', bg: 'grey' };
	mStyleX(table, tableStyle);
	let parentStyle = { display: 'grid', 'grid-template-columns': 'repeat(5, auto)', gap: '4px', bg: 'grey', padding: 4 };
	let dParent = mDiv(table);
	mStyleX(dParent, parentStyle);

	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 };
	for (const k of listOther) {
		//let info = picRandom('emo', k);
		let info = arrFirst(picSearch({ set: 'role', keywords: k }));
		if (nundef(info)) continue;
		maPic(info, dParent, styles);
	}
}
function test2_10_flex() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'grey', padding: 4 };
	mStyleX(table, tableStyle);

	let N = 10;
	let styles = { w: 50, h: 50, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 }; //,maleft:2};
	for (let i = 0; i < N; i++) {
		maPic(picRandom(), table, styles);
	}
}
function test1_1_liners() {
	maPic('red heart', table, { w: 50, h: 50, padding: 10, bg: 'yellow' });
	// maPic('crow', table, { w: 100, h: 50, bg: 'red' }); 
	// maPic('student',table,{w:100,h:100});

}
function test0_manual() {
	let info = picInfo('crow');
	console.log(info);

	let dOuter = mDiv(table);
	let d = mDiv(dOuter);
	d.innerHTML = info.text;


	let [wdes, hdes] = [100, 100];

	let fw = wdes / info.w;
	let fh = hdes / info.h;
	let f = Math.min(fw, fh);
	let fz = f * info.fz;
	let wreal = f * info.w;
	let hreal = f * info.h;

	let padw = (wdes - wreal) / 2;
	let padh = (hdes - hreal) / 2;

	console.assert(padw >= 0 && padh >= 0, 'BERECHNUNG FALSCH!!!!')

	styles = { family: info.family, fz: fz, weight: 900, w: wreal, h: hreal };
	mStyleX(d, styles);

	let outerStyles = { padding: '' + padh + 'px ' + padw + 'px', bg: 'blue', fg: 'white', display: 'inline-block' };
	mStyleX(dOuter, outerStyles);



}
//#endregion

//#region reconstructing and correcting symbolDict
async function testReconstructX() {
	SIGI = false; await reconstructX(); while (!SIGI) { await sleepX(3000); } //load from scratch
	//here weiter
	console.log('...continue: before setting USE_LOCAL_STORAGE back to true!', USE_LOCAL_STORAGE);
	USE_LOCAL_STORAGE = true;
	console.log('...and: USE_LOCAL_STORAGE', true);
	clearElement(table);
	// maPic('red heart', table, { w: 50, h: 50, padding: 10, bg: 'yellow' });
	let timit = new TimeIt('*timer', true);
	await loadAssets(); //wird natuerlich die alten verwenden aber ok
	timit.show('assets loaded');
	test15_zwei_grids();
	test16_openMojis();
	timit.show('presentation done');
}
function testTags() {
	for (const k of symbolKeys) {
		let info = symbolDict[k];
		if (info.type == 'emo') {
			if (nundef(info.tags)) console.log('!!!!!!!!!!!!!!!!!!!!!', k);// && isEmpty(info.tags)){
			else if (isEmpty(info.tags)) console.log('---empty', k);
		} else {
			console.log('icon', info.tags)
		}
		//console.log(k,symbolDict[k].tags)
	}

}

//#endregion

//#region misc tests
function miscTests() {
	//let x = firstNumber(0.6); //'ABDsssdf_-1');	console.log(x)
	let x = isNumber(0.6)
	console.log(x)
}
//#endregion








