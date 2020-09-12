var table = mBy('table');
var UIS = {};
const problemKeys = ['person: white hair', 'fire-dash', 'horse', 'warehouse']
const listOther = ['student', 'astronaut', 'teacher', 'judge', 'farmer', 'cook', 'mechanic', 'factory worker',
	'office worker', 'scientist', 'technologist', 'singer', 'artist', 'pilot', 'firefighter', 'guard'];

window.onload = async () => { start(); }

async function start() {
	await loadAssets(); // load from symbolDict
	//SIGI = false; await reconstructX(); while (!SIGI) { await sleepX(2000); } clearElement(table); //load from scratch

	//#region past test calls
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
	//#endregion
	//test28_maPicLabelParams();
	//test29_mpl(100,'algerianregular');
	test27_hybrid_elems(); //NOPE!
	//test16_openMojis(); //OK


}

//#region tests layout....
function test29_mpl(sz,family) {
	// let sz = 150; let fpic = 2 / 3; let ffont = 1 / 8; let family = 'AlgerianRegular'; let ftop = 1 / 10; let fbot = 1 / 12;
	let fpic = 2 / 3; let ffont = 1 / 8; let ftop = 1 / 9; let fbot = 1 / 12;

	let styles = { w: sz, h: sz, bg: 'blue', fg: 'contrast', patop: sz * ftop, pabottom: sz * fbot, align: 'center', 'box-sizing': 'border-box' };
	let textStyles = { family: family, fz: Math.floor(sz * ffont) };
	let picStyles = { h: sz * fpic, bg: 'random' };
	let info = picInfo('namaste');
	//console.log(info);
	let d = maPicLabel(info, table, styles, picStyles, textStyles, false, true);
	let txt = d.children[1];
	console.log('result', d, '\n\n', d.firstChild, '\n\n', txt);
	mClass(txt, 'truncate');
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
	mClass(txt, 'truncate');
}
function test27_hybrid_elems() {
	let list = picRandom('emo', null, 20);
	let picStyles = { h: 50, bg: 'hotpink', fg: 'pink' };
	let container = mDiv(table);
	
	//let picLabelStyles = { h: 50, bg: 'random', fg: 'random' };
	let [g,p,t]=getHarmoniousStyles(50,'arial','hotpink','random');

	let elems = [];
	for (const info of list) {
		let el = coin() ? maPicLabel(info, container, g,p,t, false, true)
			: maPic(info, container, picStyles);
		elems.push(el);
	}
	let containerStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let size = layoutGrid(elems, container, containerStyles, { isInline: true });
	console.log(size);


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
		let info = first(picSearch({ set: 'role', keywords: k }));
		if (nundef(info)) continue;
		let [g,p,t]=getSimpleStyles(50,undefined,'random','random');
		result=maPicLabel(info, dParent, g,p,t, false, true);
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
		let info = first(picSearch({ set: 'role', keywords: k }));
		if (nundef(info)) continue;
		maPic(info, dParent, styles, false);
	}
}
function test12_1_liners_img() {
	mFlex(table)
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
		let info = first(picSearch({ set: 'role', keywords: k }));
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
		let info = first(picSearch({ set: 'role', keywords: k }));
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








