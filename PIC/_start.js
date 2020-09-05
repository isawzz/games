var table = mBy('table'); var RECT = { w: 200, h: 200, cx: 100, cy: 100 };
const problemKeys = ['fire-dash', 'horse', 'warehouse']
const listOther = ['student', 'astronaut', 'teacher', 'judge', 'farmer', 'cook', 'mechanic', 'factory worker', 'office worker', 'scientist', 'technologist', 'singer', 'artist', 'pilot', 'firefighter', 'family', 'volcano'];

window.onload = async () => { await loadAssets(); test5_maPicText(); }

//getWordSize
function test6_getWordSize() {
	let text = 'hallo'; let fz = 20; let family = 'arial';
	size = getWordSize(text, fz, family);
	let size2 = getWordSize2(text, fz, family);
	if (size.w != size2.w || size.h != size2.h) {
		console.log('DIFFERENT OUTCOME getWordSize!!!!!!!!!!!!', size, size2);
	}

}

//maPicText
function test5_maPicText() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'green', padding: 4 }; mStyleX(table, tableStyle);

	let list = Array(150).map(x => chooseRandom(symbolKeys)); 
	//let list = symbolKeys.slice(0, 5);

	let szOuter = { w: 100, h: 100 };
	let padding = 25;
	let szInner = { w: szOuter.w - 2 * padding, h: szOuter.h - 2 * padding };

	let outerStyles = { bg: 'red', w: szOuter.w, h: szOuter.h, padding: padding, 'box-sizing': 'border-box' };
	let innerStyles = { fz: szInner.h, align: 'center', bg: 'blue', fg: 'white' };

	let cntFalse = 0;

	for (const k of list) {
		let info = picInfo(k);
		innerStyles.family = info.family;
		info = maPicText(info, table, outerStyles, innerStyles);
		let txt = fitText(info.key, { w: 100, h: 20, cx: 50, cy: 87 }, info.ui, { fg: 'white', align: 'center', fz: 13 });

		let fz = firstNumber(info.ui.firstChild.style.fontSize);
		if (info.type[0] == 'e' && (fz < 36 || fz > 37) || info.type[0] == 'i' && fz != 43) {
			cntFalse += 1;
			console.log(cntFalse, info.key, info.type, fz);
		}
		//setTimeout(() => centerFit(info.ui, info.ui.firstChild), 1); //wenn will dass in center gefitted wird
		//break;
	}
}
//fitText
function test5_fitText() {
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
function test4_fitText() {
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
function test3_fitText() {
	let rect = { w: 140, h: 200, cx: 120, cy: 100 };
	let longtext = 'hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren! hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren!';
	fitText(longtext, rect, table, { padding: 15, 'box-sizing': 'border-box' });
}
function test2_fitText() {
	let rect = { w: 100, h: 100, cx: 120, cy: 100 };
	let text = 'hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren!';
	let longtext = 'hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren! hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren!';

	fitText(longtext, rect, table, { padding: 5, 'box-sizing': 'border-box' });
}
//#region blankCard
function test1_blankCard() {
	// let infolist = allWordsContainedInKeys(symbolDict,['heart','red']); console.log(infolist); return;
	// let infolist = allWordsContainedInKeysAsWord (symbolDict,['heart','red']);	console.log(infolist); return;
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

