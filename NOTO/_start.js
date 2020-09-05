var table = mBy('table'); var RECT = { w: 200, h: 200, cx: 100, cy: 100 };
window.onload = async () => { await loadAssets(); t88(); }
function check() {
	console.log(getBounds(mBy('table').firstChild.firstChild))
}
const problemKeys = ['fire-dash', 'horse', 'warehouse']
//_________________________88 success!!! addPic88 >> maPicText
function centerFit(d) {
	let child = d.firstChild;
	let bChild = getBounds(child);
	let b = getBounds(d);
	let padding = firstNumber(d.style.padding);
	let wdes = b.width;
	let hdes = b.height;
	let wdesChild = wdes - 2 * padding;
	let hdesChild = hdes - 2 * padding;
	let wChild = bChild.width;
	let hChild = bChild.height;
	// padx soll sein padding + wdesChild - bChild.width;
	let padx = Math.floor(padding + (wdesChild - bChild.width) / 2);
	let pady = Math.floor(padding + (hdesChild - bChild.height) / 2);
	console.log('bChild', bChild, '\npadding', padding, '\nwdes', wdes, '\nhdes', hdes, '\nwdesChild', wdesChild, '\nhdesChild', hdesChild,
		'\nwChild', wChild, '\nhChild', hChild, '\npadx', padx, '\npady', pady);
	d.style.padding = pady + 'px ' + padx + 'px';
}
let listOther=['student','astronaut','teacher','judge','farmer','cook','mechanic','factory worker','office worker','scientist',
'technologist','singer','artist','pilot','firefighter','family','volcano'];
function t88() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'green', padding: 4 }; mStyleX(table, tableStyle);
	//let list = Array(15).map(x => chooseRandom(symbolKeys)); //.fill(chooseRandom(symbolKeys));// ['warehouse', "fire-dash", chooseRandom(symbolKeys), chooseRandom(symbolKeys), chooseRandom(symbolKeys), chooseRandom(symbolKeys)];//,"fire-dash",'horse','horse'];//,'sherlock-holmes','horse']
	let list = symbolKeys;
	//list = list.map(x => chooseRandom(symbolKeys));

	let szOuter = { w: 100, h: 100 };
	let padding = 25;
	let szInner = { w: szOuter.w - 2 * padding, h: szOuter.h - 2 * padding };

	let outerStyles = { bg: 'red', w: szOuter.w, h: szOuter.h, padding: padding, 'box-sizing': 'border-box' };
	let innerStyles = { fz: szInner.h, align: 'center', bg: 'blue', fg: 'white' };

	let cntFalse = 0;

	for (const k of list.slice(0,100)) {
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
function addPic88(info, dParent, outerStyles, innerStyles) {
	// let info = picInfo(k);
	// let fz = 50;

	// let d = mPic90(info,table, fz);
	let d = mDiv(dParent); mStyleX(d, outerStyles);
	let d1 = mDiv(d); mStyleX(d1, innerStyles);
	d1.innerHTML = info.text;

	let fz = innerStyles.fz;
	let [wdes, hdes] = [outerStyles.w - 2 * outerStyles.padding, outerStyles.h - 2 * outerStyles.padding];

	let hc = getComputedStyle(d.firstChild).getPropertyValue('height'); console.log('hc', hc);
	let b = getBounds(d.firstChild); let bw = b.width; let bh = b.height;
	let i = 0;
	while (bw > wdes || bh > hdes) {
		//console.log('round', i, 'w', bw, 'h', bh)
		fz -= 1;
		if (fz < 9) break;

		//fz of d.firstChild
		let child = d.firstChild;
		child.style.fontSize = fz + 'px';
		hc = getComputedStyle(d.firstChild).getPropertyValue('height');//console.log('hc',hc);
		b = getBounds(child); bw = b.width; bh = b.height;
		//console.log('w', b.width, 'h', b.height, 'fz', fz, info.type, info.key);
		//padding of d
	}
	console.log(b.width, b.height, fz, info.type, info.key);
	info.ui = d;
	info.uiInner = d.firstChild;
	return info;

}
//_________________________89
function centerFit(d, child) {
	let bChild = getBounds(child);
	let b = getBounds(d);
	let padding = firstNumber(d.style.padding);
	let wdes = b.width;
	let hdes = b.height;
	let wdesChild = wdes - 2 * padding;
	let hdesChild = hdes - 2 * padding;
	let wChild = bChild.width;
	let hChild = bChild.height;
	// padx soll sein padding + wdesChild - bChild.width;
	let padx = Math.floor(padding + (wdesChild - bChild.width) / 2);
	let pady = Math.floor(padding + (hdesChild - bChild.height) / 2);
	//console.log('bChild', bChild);
	//console.log('\npadding', padding, '\nwdes', wdes, '\nhdes', hdes, '\nwdesChild', wdesChild, '\nhdesChild', hdesChild, '\nwChild', wChild, '\nhChild', hChild, '\npadx', padx, '\npady', pady);
	d.style.padding = pady + 'px ' + padx + 'px';
}
function t89() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', gap: '4px', bg: 'green', padding: 4 }; mStyleX(table, tableStyle);
	//let list = ["fire-dash",'horse',"fire-dash",'horse','horse'];//,'sherlock-holmes','horse']
	let list = ['horse', "fire-dash", 'horse', chooseRandom(symbolKeys), chooseRandom(symbolKeys), chooseRandom(symbolKeys)];//,"fire-dash",'horse','horse'];//,'sherlock-holmes','horse']
	// let info = picInfo("fire-dash");mPic95(info)
	for (const k of list) {
		let info = addPic89(k, table);
		setTimeout(() => centerFit(info.ui), 1);
		// console.log(info,info.uiInner.clientWidth,info.uiInner.clientHeight);
		// info.ui.focus();
		// let hc=getComputedStyle(info.uiInner).getPropertyValue('height');console.log('hc',hc);
		// setTimeout(()=>check(),1000);//
	}
}
function addPic89(k, table) {
	let info = picInfo(k);
	let fz = 50;

	// let d = mPic90(info,table, fz);
	let d = mDiv(table); let styles = { bg: 'red', w: 100, h: 100, padding: 25, 'box-sizing': 'border-box' }; mStyleX(d, styles);
	let d1 = mDiv(d); let styles1 = { fz: fz, family: info.family, align: 'center', bg: 'blue', fg: 'white' }; mStyleX(d1, styles1);
	d1.innerHTML = info.text;

	let hc = getComputedStyle(d.firstChild).getPropertyValue('height'); console.log('hc', hc);
	let b = getBounds(d.firstChild); let bw = b.width; let bh = b.height;
	let i = 0;
	while (bw > 50 || bh > 50) {
		//console.log('round', i, 'w', bw, 'h', bh)
		fz -= 1;
		if (fz < 9) break;

		//fz of d.firstChild
		let child = d.firstChild;
		child.style.fontSize = fz + 'px';
		hc = getComputedStyle(d.firstChild).getPropertyValue('height');//console.log('hc',hc);
		b = getBounds(child); bw = b.width; bh = b.height;
		//console.log('w', b.width, 'h', b.height, 'fz', fz, info.type, info.key);
		//padding of d
	}
	console.log(b.width, b.height, fz, info.type, info.key);
	info.ui = d;
	info.uiInner = d.firstChild;
	return info;

}
//_________________________90
function t90() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', gap: '4px', bg: 'green', padding: 4 }; mStyleX(table, tableStyle);
	//let list = ["fire-dash",'horse',"fire-dash",'horse','horse'];//,'sherlock-holmes','horse']
	let list = ['horse', "fire-dash", 'horse'];//,"fire-dash",'horse','horse'];//,'sherlock-holmes','horse']
	// let info = picInfo("fire-dash");mPic95(info)
	for (const k of list) {
		let info = addPic90a(k, table);
		console.log(info, info.uiInner.clientWidth, info.uiInner.clientHeight);
		let hc = getComputedStyle(info.uiInner).getPropertyValue('height');
		console.log('hc', hc);
		break;
	}
}
function addPic90a(k, table) {
	let info = picInfo(k);
	let fz = 50;
	let d = mPic90(info, table, fz);
	let b = getBounds(d.firstChild); let bw = b.width; let bh = b.height;
	let i = 0;
	while (bw > 50 || bh > 50) {
		console.log('round', i, 'w', bw, 'h', bh)
		fz -= 1;
		if (fz < 9) break;

		//fz of d.firstChild
		let child = d.firstChild;
		child.style.fontSize = fz + 'px';
		b = getBounds(child); bw = b.width; bh = b.height;
		console.log('w', b.width, 'h', b.height, 'fz', fz, info.type, info.key);
		//padding of d
	}
	console.log(b.width, b.height, fz, info.type, info.key);
	info.ui = d;
	info.uiInner = d.firstChild;
	return info;

}
function addPic90b(k, table) {
	let info = picInfo(k);
	let fz = 50;

	let d = mDiv(dParent); let styles = { bg: 'red', w: 100, h: 100, padding: 25, 'box-sizing': 'border-box' }; mStyleX(d, styles);
	let d1 = mDiv(d); let styles1 = { fz: fz, family: info.family, align: 'center', bg: 'blue', fg: 'white' }; mStyleX(d1, styles1);
	d1.innerHTML = info.text;

	let b = getBounds(d.firstChild);
	let i = 0;
	while (b.width > 50 || b.height > 50) {
		console.log('round', i, 'w', b.width, 'h', b.height)
		fz -= 1;
		if (fz < 9) break;

		d.remove();

		let d = mDiv(dParent); let styles = { bg: 'red', w: 100, h: 100, padding: 25, 'box-sizing': 'border-box' }; mStyleX(d, styles);
		let d1 = mDiv(d); let styles1 = { fz: fz, family: info.family, align: 'center', bg: 'blue', fg: 'white' }; mStyleX(d1, styles1);
		d1.innerHTML = info.text;

		let child = d.firstChild;
		b = getBounds(child);
		console.log('w', b.width, 'h', b.height, 'fz', fz, info.type, info.key);
	}
	console.log(b.width, b.height, fz, info.type, info.key);
	info.ui = d;
	info.uiInner = d.firstChild;
	return info;
}
function mPic90(info, dParent, fz) {
	let d = mDiv(dParent); let styles = { bg: 'red', w: 100, h: 100, padding: 25, 'box-sizing': 'border-box' }; mStyleX(d, styles);
	let d1 = mDiv(d); let styles1 = { fz: fz, family: info.family, align: 'center', bg: 'blue', fg: 'white' }; mStyleX(d1, styles1);
	d1.innerHTML = info.text;
	return d;
}
//_________________________91 no
function t91() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', gap: '4px', bg: 'green', padding: 4 }; mStyleX(table, tableStyle);
	let list = ["fire-dash"];//,'sherlock-holmes','horse']
	// let info = picInfo("fire-dash");mPic95(info)
	for (const k of list) {
		let info = addPic91a(k, table);
		console.log(info, info.uiInner.clientWidth, info.uiInner.clientHeight);
		let hc = getComputedStyle(info.uiInner).getPropertyValue('height');
		console.log('hc', hc)
	}
}
function addPic91a(k, table) {
	let info = picInfo(k);
	let fz = 50;
	let d = mPic91(info, table, fz);
	let b = getBounds(d.firstChild); let bw = b.width; let bh = b.height;
	let i = 0;
	while (bw > 50 || bh > 50) {
		console.log('round', i, 'w', bw, 'h', bh)
		fz -= 1;
		if (fz < 9) break;

		//fz of d.firstChild
		let child = d.firstChild;
		child.style.fontSize = fz + 'px';
		b = getBounds(child); bw = b.width; bh = b.height;
		console.log('w', b.width, 'h', b.height, 'fz', fz, info.type, info.key);
		//padding of d
	}
	console.log(b.width, b.height, fz, info.type, info.key);
	info.ui = d;
	info.uiInner = d.firstChild;
	return info;

}
function addPic91b(k, table) {
	let info = picInfo(k);
	let fz = 50;
	let d = mPic93(info, fz);
	let b = getBounds(d.firstChild);
	let i = 0;
	while (b.width > 50 || b.height > 50) {
		console.log('round', i, 'w', b.width, 'h', b.height)
		fz -= 1;
		if (fz < 9) break;

		d.remove();
		d = mPic91(info, table, fz);
		let child = d.firstChild;
		b = getBounds(child);
		console.log('w', b.width, 'h', b.height, 'fz', fz, info.type, info.key);
	}
	console.log(b.width, b.height, fz, info.type, info.key);
	info.ui = d;
	info.uiInner = d.firstChild;
	return info;
}
function mPic91(info, dParent, fz) {
	let d = mDiv(dParent); let styles = { bg: 'red', w: 100, h: 100, padding: 25, 'box-sizing': 'border-box' }; mStyleX(d, styles);
	let d1 = mDiv(d); let styles1 = { fz: fz, family: info.family, align: 'center', bg: 'blue', fg: 'white' }; mStyleX(d1, styles1);
	d1.innerHTML = info.text;
	return d;
}
//_________________________92 no
function t92() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', gap: '4px', bg: 'green', padding: 4 }; mStyleX(table, tableStyle);

	let list = ["fire-dash"];//,'sherlock-holmes','horse']
	// let info = picInfo("fire-dash");mPic95(info)
	for (const k of list) {
		let info = picInfo(k);
		let fz = 50;
		let d = mPic92(info, fz);
		let b = getBounds(d.firstChild);
		let i = 0;
		while (b.width > 50 || b.height > 50) {
			console.log('round', i, 'w', bw, 'h', bh)
			fz -= 1;
			if (fz < 9) break;

			// //fz of d.firstChild
			// let child = d.firstChild;
			// child.style.fontSize = fz + 'px';
			// b = getBounds(child); bw = b.width; bh = b.height;
			// console.log('w', b.width, 'h', b.height, 'fz', fz, info.type, info.key);
			// //padding of d

			d.remove();
			d = mPic93(info, fz);
			let b = getBounds(d.firstChild);
			console.log('w', b.width, 'h', b.height, 'fz', fz, info.type, info.key);

			break;
		}
		console.log(b.width, b.height, fz, info.type, info.key);

	}
}
function mPic92(info, fz) {
	let d = mDiv(table); let styles = { bg: 'red', w: 100, h: 100, padding: 25, 'box-sizing': 'border-box' }; mStyleX(d, styles);
	let d1 = mDiv(d); let styles1 = { fz: fz, family: info.family, align: 'center', bg: 'blue', fg: 'white' }; mStyleX(d1, styles1);
	d1.innerHTML = info.text;
	return d;
}

function t93() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', gap: '4px', bg: 'green', padding: 4 }; mStyleX(table, tableStyle);
	let info = picInfo("fire-dash"); mPic95(info)
	for (let i = 0; i < 4; i++) {
		let info = picRandom('all');
		let fz = 50;
		let d = mPic93(info, fz);

		let b = getBounds(d.firstChild); let bw = b.width; let bh = b.height;
		while (bw > 50 || bh > 50) {
			fz -= 1;
			if (fz < 9) break;
			d.remove();
			d = mPic93(info, fz);
			b = getBounds(d.firstChild); bw = b.width; bh = b.height;
			console.log(b.width, b.height, fz, info.type, info.key);
		}
		console.log(b.width, b.height, fz, info.type, info.key);

	}
}
function mPic93(info, fz) {
	let d = mDiv(table); let styles = { bg: 'red', w: 100, h: 100, padding: 25, 'box-sizing': 'border-box' }; mStyleX(d, styles);
	let d1 = mDiv(d); let styles1 = { fz: fz, family: info.family, align: 'center', bg: 'blue', fg: 'white' }; mStyleX(d1, styles1);
	d1.innerHTML = info.text;
	return d;
}
function t94() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', gap: '4px', bg: 'green', padding: 4 }; mStyleX(table, tableStyle);
	let info = picInfo("fire-dash"); mPic95(info)
	for (let i = 0; i < 3; i++) {
		let info = picRandom();
		let d = mPic94(info);
		let b = getBounds(d.firstChild);
		console.log(b.width, b.height)
	}
}
function mPic94(info) {
	let d = mDiv(table); let styles = { bg: 'red', w: 100, h: 100, padding: 25, 'box-sizing': 'border-box' }; mStyleX(d, styles);
	let d1 = mDiv(d); let styles1 = { fz: 40, family: info.family, align: 'center', bg: 'blue', fg: 'white' }; mStyleX(d1, styles1);
	d1.innerHTML = info.text;
	return d;
}
function t95() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', gap: '4px', bg: 'green', padding: 4 }; mStyleX(table, tableStyle);
	let info = picInfo("fire-dash"); mPic95(info)
	for (let i = 0; i < 3; i++) {
		let info = picRandom();
		mPic95(info);
	}
}
function mPic95(info) {
	let d = mDiv(table); let styles = { bg: 'red', w: 100, h: 100, padding: 25, 'box-sizing': 'border-box' }; mStyleX(d, styles);
	let d1 = mDiv(d); let styles1 = { fz: 40, family: info.family, align: 'center', bg: 'blue', fg: 'white' }; mStyleX(d1, styles1);
	d1.innerHTML = info.text;
}

function t96() {
	let info = picInfo("fire-dash");
	let d = mDiv(table); let styles = { bg: 'red', w: 100, h: 100, padding: 25, 'box-sizing': 'border-box' }; mStyleX(d, styles);
	let d1 = mDiv(d); let styles1 = { fz: 40, family: info.family, align: 'center', bg: 'blue', fg: 'white' }; mStyleX(d1, styles1);
	d1.innerHTML = info.text;
	//let b=



}
//text is slightly elevated!
function t97() {

	let info = picInfo("fire-dash");
	let d = mDiv(table); let styles = { bg: 'red', w: 100, h: 100, padding: 25, 'box-sizing': 'border-box' }; mStyleX(d, styles);
	let d1 = mDiv(d); let styles1 = { fz: 40, family: info.family, align: 'center', bg: 'blue', fg: 'white', w: 50, h: 50 }; mStyleX(d1, styles1);


	d1.innerHTML = info.text;



}
function t98() {
	let d = mDiv(table); let styles = { bg: 'red', w: 100, h: 100, padding: 25, 'box-sizing': 'border-box' }; mStyleX(d, styles);
	let d1 = mDiv(d); let styles1 = { bg: 'blue', w: 50, h: 50 }; mStyleX(d1, styles1);

}

function t99() {
	let d = mDiv(table);
	let styles = { bg: 'red', w: 100, h: 100 };
	mStyleX(d, styles);
}

function test25() {
	let info = picInfo("fire-dash");
	let x = maPicText(info, table, { bg: 'green', fg: 'orange', w: 100, h: 100 });
	console.log('result', x, x.ui)
	info = picInfo("fire-dash");
	x = maPicText(info, table, { bg: 'green', fg: 'orange', w: 100, h: 100 });
	console.log('result', x, x.ui)
	x = maPicText(picRandom(), table, { bg: 'green', fg: 'orange', w: 100, h: 100 });
}

function test24() {
	let info = picInfo('das');
	let x = maPicText(info, table, { bg: 'green', fg: 'orange', w: 100, h: 100 });
	//x=maPicText('red heart',table)
	console.log('result', x, x.ui)

}
function test23() {
	let infolist;
	infolist = picSearch({ keywords: 'abacus', type: 'emo', props: 'key' }); //ok!
	infolist = picSearch({ keywords: ['m'], type: 'eduplo', func: (d, kw) => allCondX(d, x => startsWithOneOf(x.key, kw)) }); //ok!
	infolist = picSearch({ type: 'all', func: (d, kw) => allCondX(d, x => /^a\w*r$/.test(x.key)) }); //ok!

	console.log(infolist);

}

function test22() {
	amCard(table); // should make a blank card
}


//#region picDraw mit fitTxt verbinden
function test21() {
	showFont('AlgerianRegular');
	showFont('verdana');
	showFont('tahoma');
	//fitTextH('hallo',table);
}
function test20() {
	// let info = picInfo('man');
	// fitText(info.text,RECT,table,{family:info.family,bg:'blue',align:'center'});
	fitText01('hallo', RECT, table, { bg: 'blue', padding: 20 });
}

//#region picDraw trial 2!
function test19() {
	picDrawText('man', table, { w: 100, h: 100, bg: 'blue', align: 'center' });

}
function test18() {
	let info = picInfo('red heart'); info.type = 'emotext';
	picDraw(info, table, { w: 100, h: 100, bg: 'blue', align: 'center' })

}




//fitWord, maPicText
function test83() {
	let info = picRandom('all');
	maPicText(info, table, { w: 200, h: 200, bg: 'red' });
}

function test82() {
	let rect = { w: 100, h: 100, cx: 120, cy: 100 };
	let info = picRandom('all');
	let text = info.text;
	fitWord(text, rect, table, { bg: 'blue', family: info.family, weight: 900 });//, padding: 0}); //, 'box-sizing': 'border-box' });
}
function test81() {
	let rect = { w: 100, h: 100, cx: 120, cy: 100 };
	let info = picInfo('red heart');
	let text = info.text;
	fitText(text, rect, table, { bg: 'blue', family: info.family, weight: 900 });//, padding: 0}); //, 'box-sizing': 'border-box' });
}

//fitText
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
	let rect = { w: 100, h: 100, cx: 120, cy: 100 };
	let text = 'hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren!';
	let longtext = 'hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren! hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren!';

	fitText(longtext, rect, table, { padding: 5, 'box-sizing': 'border-box' });
}

//#region blankCard
function test17() {
	let info = picInfo('red heart');
	info.type = 'emotext';

	picDraw(info, table, { w: 200, h: 200, bg: 'yellow', align: 'center' });

	let c = blankCard();
	//mAppend(table, c);
	//picDraw(info, c, { w: 100, h: 100, bg: 'yellow' });

	// picDrawKey('red heart', c, { w: 20, h: 20, padding: 6, bg: 'blue' });
	// picDrawKey('red heart', c, { w: 20, h: 20, padding: 6 });
	// picDrawKey('red heart', c, { w: 20, h: 20, padding: 6 });
	// picDrawKey('red heart', c, { w: 20, h: 20, padding: 6 });
	// picDrawKey('red heart', c, { w: 20, h: 20, padding: 6 });
	//let res = picDrawRandom('emo', null, c, { w: 20, h: 20, padding: 4 });
	//let res = picDrawRandom('emo', null, c, { w: 20, h: 20, padding: 4 });


}

//#region picSearch_
function startsWithOneOf(s, list) {
	//console.log(s,list)
	for (const k of list) { if (startsWith(s, k)) return true; }
	return false;
}
function testFunc1(dict, keywords) {

	//let res = allCondDict(dict, x => {console.log(x);return keywords.includes(x.key);});
	//let res = allCondDict(dict, x => startsWithOneOf(x.key, keywords));
	// let keys =Object.keys(dict);	keys.sort();
	let res = allCondX(dict, x => startsWithOneOf(x.key, keywords));
	console.log(res);
	return res;// subdictOf(dict, res);
}
function test16() {
	let dict = picFilterDict('eduplo'); //richtig
	//let infolist = allWordsContainedInProps(dict, ['cu'], ['E', 'D']); console.log(infolist); return; //ok!
	//let infolist = picSearch(['cu'], 'eduplo', ['E', 'D']); //, false, false); //ok!
	//let infolist = picSearch('cu','emo','key'); //ok!
	let infolist = picSearch('a', 'eduplo', testFunc1); //ok!

	console.log(infolist); return;

}
function test15() {
	let info = picRandomSearch('heart', 'emo');
	console.log(info)
}
function test14() {
	let infolist = picSearch('shield');
	infolist = picFilter('eduplo');
	//infolist = picSearch('','eduplo',['E','D','key'],false,false);
	console.log(infolist);
}

//#region blankCard
function test13blankCard() {
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

//picDrawRandom
function test12() {
	let res = picDrawRandom('emo', null, table, { w: 200, h: 200 });
}


//mText_
function test7() {
	let styles = {};
	styles.fz = '25px';
	styles.family = 'arial';
	styles['font-weight'] = 'normal';
	styles.display = 'inline-block';
	styles.bg = 'red';
	styles.w = 200;
	let size = getSizeWithStyles('hallo', jsCopy(styles));

	let d = mText('hallo', table, styles); //,null,styles);
	//mStyles(d,styles);
	let b = getBounds(d);
	console.log(size, b);

}

//picDraw
function test6() {
	let table = mBy('table');
	let klist = picFilter('icon');
	let key = chooseRandom(klist);

	//key = 'card-2-spades';
	//console.log('key', key);
	let info = symbolDict[key];
	//console.log('info', info)

	picDraw(info, table, {
		//align: 'center',
		w: 70, h: 70,
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
		ui = mText(info.text, table, { family: info.family, fz: 200, bg: 'red', fg: 'green', display: 'inline' });
	} else {
		ui = mImg('/assets/svg/twemoji/' + info.hexcode + '.svg', table, { w: 200, h: 200 });
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
	mImg('/assets/svg/twemoji/' + hexcode + '.svg', table, { w: 200, h: 200 });
}
function isEmojiKey(hex) { return isdef(emojiChars[hex]); }
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
		ui = mText(info.text, table, { family: info.family, fz: 200, bg: 'red', fg: 'green', display: 'inline' });
	} else {
		ui = mImg('/assets/svg/twemoji/' + info.hexcode + '.svg', table, { w: 200, h: 200 });
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
		let d = mText(info.text, table, { family: info.family, fz: 200, bg: 'red', fg: 'green', display: 'inline' });
	} else {
		mImg('/assets/svg/twemoji/' + info.hexcode + '.svg', table, { w: 200, h: 200 });
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
	mImg('/assets/svg/twemoji/' + info.hexcode + '.svg', table, { w: 200, h: 200 });
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

	// let x = mText(key, table); mStyleX(x, { fz: 100, family: 'emoColor' });

	mImg('/assets/svg/twemoji/' + key + '.svg', table, { w: 200, h: 200 });
	mImg('/assets/svg/openmoji/' + key + '.svg', table, { w: 200, h: 200 });


	let decCode = hexStringToDecimal(key); let s1 = '&#' + decCode + ';'; // Emoji=Yes;'; //'\u{1F436}';
	x = mText(s1, table);
	mStyleX(x, { fz: 200, family: 'emoColor' });
	mClass(x, 'removeOutline');
	//mClass(x,['c']);

	decCode = hexStringToDecimal(key);
	s1 = '&#' + decCode + ';'; // Emoji=Yes;'; //'\u{1F436}';
	x = mText(s1, table);
	mStyleX(x, { fz: 200, family: 'emoColor' });
	//let e = mEmoTrial2(key, table, {"font-size":200,bg:'green'});
}