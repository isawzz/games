//from PIC!!!!!!!!!!!!!!!!
var table = mBy('table');
var UIS = {};
const problemKeys = ['person: white hair', 'fire-dash', 'horse', 'warehouse']
const listOther = ['student', 'astronaut', 'teacher', 'judge', 'farmer', 'cook', 'mechanic', 'factory worker',
	'office worker', 'scientist', 'technologist', 'singer', 'artist', 'pilot', 'firefighter', 'guard'];

window.onload = async () => { start(); }

async function start() {

	await loadAssets(); // load from symbolDict
	// SIGI = false; await reconstructX(); while (!SIGI) { await sleepX(2000); } //load from scratch

	clearElement(table);
	for (let i = 0; i < 20; i++) test14_mit_label();
}

//#region tests maPic

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
	for (const k of listOther) {
		let info = first(picSearch({ set: 'role', keywords: k }));
		if (nundef(info)) continue;
		maPicLabel(info, dParent, styles, false, true);
	}

}
function test15_zwei_grids() {
	test13_15_roles_grid_img();
	test4_15_roles_grid();
}
function maPicLabel(info, dParent, styles, isText = true, isOmoji = false) {
	//info, dParent, styles, isText = true, isOmoji = false) {
	let d = mDiv(dParent, { bg: 'random', padding: 4, fg: 'contrast', margin: 2 });//mStyleX(d,{align:'center'})
	maPic(info, d, styles, isText, isOmoji);
	mText(info.annotation, d);
	d.style.textAlign = 'center';
	return d;
}
function test14_mit_label() {
	let d = mDiv(table, { bg: 'random', padding: 4, fg: 'contrast', margin: 2 });//mStyleX(d,{align:'center'})
	let info = picRandom('icon');
	maPic(info, d, { w: 50, h: 50, bg: 'random', fg: 'random' });
	mText(info.annotation, d);
	d.style.textAlign = 'center';
	mFlex(table);
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
	let styles = { fz: 30, padding: 10, bg: 'hotpink', fg: 'pink', rounding: 5 }; //,maleft:2};
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
function starterForSymbolDict() {
	//await reconstruct(); return; // complete process von raw => complete symbolDict (in downloads)

	// await symbolDictFromCsv();

	// addMeasurementsToSymbolDict();

	// addAnnotationsToSymbolDict();
	// saveSymbolDict();

	//console.log(symbolKeys.length);
	//console.log(symbolDict);
}


//#endregion

//#region starters:
function miscTests() {
	//let x = firstNumber(0.6); //'ABDsssdf_-1');	console.log(x)
	let x = isNumber(0.6)
	console.log(x)
}
//#endregion


//#region deprecated code
//from assets
async function reconstruct(callback = null) {
	console.log('start rec 0');
	await symbolDictFromCsv(false);
	setTimeout(() => reconstruct1(callback), 1000);
}
function reconstruct1(callback = null) {
	console.log('start rec 1');
	addAnnotationsToSymbolDict(false);
	setTimeout(() => reconstruct2(callback), 1000);
}
function reconstruct2(callback = null) {
	console.log('start rec 2');
	addMeasurementsToSymbolDict(callback);

}

async function testLoadAndProcessRawAssets() {
	console.log('1. vor loadAndProcessRawAssets: USE_LOCAL_STORAGE', USE_LOCAL_STORAGE);
	await loadAndProcessRawAssets(async () => {
		console.log('4. this IS callback!!! nach loadAndProcessRawAssets: USE_LOCAL_STORAGE', USE_LOCAL_STORAGE);
		clearElement(table);
		//maPic('red heart', table, { w: 50, h: 50, padding: 10, bg: 'yellow' });
		test15_zwei_grids();
		console.log('vor loadAssets: USE_LOCAL_STORAGE', USE_LOCAL_STORAGE);
		await loadAssets(); //wird natuerlich die alten verwenden aber ok
		console.log('nach loadAssets: USE_LOCAL_STORAGE', USE_LOCAL_STORAGE);
		test16_openMojis();
	});


}
//#endregion






