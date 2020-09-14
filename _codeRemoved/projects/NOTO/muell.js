function maPicText(info, dParent, outerStyles, innerStyles, classes) {
	let d = mDiv(dParent); //mStyleX(d, outerStyles);
	let [wdes, hdes] = [outerStyles.w - 2 * outerStyles.padding, outerStyles.h - 2 * outerStyles.padding];
	if (nundef(innerStyles.fz)) innerStyles.fz = hdes;
	innerStyles.family=info.family;
	innerStyles.weight = 900;
	let d1 = mDiv(d); mStyleX(d1, innerStyles);
	d1.innerHTML = info.text;

	let b=getBounds(d1);
	let size = getWordSize2(info.text, innerStyles.fz, info.family, 900);

	console.log(innerStyles)
	console.log(b.width,b.height,size.w,size.h);

	info.ui = d;
	info.uiInner = d.firstChild;
	return info;

	//let fz = innerStyles.fz;

	//let size = measureText1(info.text, fz, info.family);
	// let size2 = getWordSize2(info.text, fz, info.family);
	// if (size.w != size2.w || size.h != size2.h) {
	// 	console.log('DIFFERENT OUTCOME getWordSize!!!!!!!!!!!!', size, size2);
	// }
	//console.log(wdes,hdes,fz,size,info.text)
	while (size.w > wdes || size.h > hdes) {
		console.log('.')
		fz -= 1;
		if (fz < 9) break;
		let child = d.firstChild;
		child.style.fontSize = fz + 'px';

		//size = measureText1(info.text, fz, info.family);
		// let size2 = getWordSize2(info.text, fz, info.family);
		// //console.log(size,wdes,hdes);
		// if (size.w != size2.w || size.h != size2.h) {
		// 	console.log('DIFFERENT OUTCOME getWordSize!!!!!!!!!!!!', size, size2);
		// }
	}
	info.ui = d;
	info.uiInner = d.firstChild;
	return info;
}
function test8(){
	let info = picInfo('warehouse');
	let d1 = document.createElement('div');
	d1.style.display='inline-block';
	d1.style.position='fixed';
	table.style.position='absolute';
	// document.body.appendChild(d1);
	table.appendChild(d1);
	table.style.display = 'inline-block';
	//table.style.width = 'min-content'
	table.style.backgroundColor='red';
	//d1.style.width='50px';
	d1.style.backgroundColor='green';
	d1.style.padding = '10px';

	//d1.classList.add('warehouse');
	d1.innerHTML = info.text;
	d1.style.font=generateFontString(50, info.family, 900);

	console.log(d1,getBounds(d1),d1.clientWidth,d1.scrollWidth);
	console.log(table,getBounds(table),table.clientWidth,table.scrollWidth);
	setTimeout(()=>console.log(getBounds(d1)),1);
	return;

	//table.appendChild(d1)
	//let d1=mDiv(table);
	let d=mDiv(d1);
	d.innerHTML=info.text;
	d.style.fontSize = 50+'px';
	d.style.fontFamily = info.family;
	d.style.fontWeight = 900;
	d.style.float='left';
	d.style.backgroundColor = 'blue';

	let a={d:d}

	console.log(d,getBounds(d),d.clientWidth,d.style.scrollWidth,a.d.clientWidth,getBounds(d1))

	console.log($(d).outerWidth())

}

function test7() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'green', padding: 4 }; mStyleX(table, tableStyle);

	let list = Array(10).fill('warehouse');
	list = list.map(x => coin() ? chooseRandom(symbolKeys) : 'warehouse');
	list = ['warehouse'];// Array(10).map(x => chooseRandom(symbolKeys));

	let szOuter = { w: 100, h: 100 };
	let padding = 25;
	let szInner = { w: szOuter.w - 2 * padding, h: szOuter.h - 2 * padding };

	let outerStyles = { bg: 'red', w: szOuter.w, h: szOuter.h, padding: padding, 'box-sizing': 'border-box' };
	let innerStyles = { padding:10, align: 'center', bg: 'blue', fg: 'white' };

	for (const k of list) {
		let info = picInfo(k);
		innerStyles.family = info.family;
		info = hallo(info, table, outerStyles, innerStyles);
		console.log(info)
	}
}
function hallo(info, dParent, outerStyles, innerStyles) {
	let d = mDiv(dParent); //mStyleX(d, outerStyles);
	let [wdes, hdes] = [outerStyles.w - 2 * outerStyles.padding, outerStyles.h - 2 * outerStyles.padding];
	if (nundef(innerStyles.fz)) innerStyles.fz = hdes;
	innerStyles.family = info.family;
	innerStyles.weight = 900;
	let d1 = mDiv(d); 
	d1.innerHTML = info.text;

	mStyleX(d1, innerStyles);
	//mStyleX(d, outerStyles);

	//erste messung:
	let getBoundsResult = getBounds(d1);
	console.log('getBounds result', getBoundsResult.width, getBoundsResult.height);

	// let w1=getComputedStyle(d1).inlineSize;
	// let w2=getComputedStyle(d1).width;
	// console.log('hahaha',w1,w2)

	info.ui = d;
	info.uiInner = d.firstChild;


	console.log('...',d1.clientWidth,d1.offsetWidth,d1.scrollWidth);
	setTimeout(()=>console.log('...',d1.clientWidth,d1.offsetWidth,d1.scrollWidth),1);

	return info;

	//let fz = innerStyles.fz;

	//let size = measureText1(info.text, fz, info.family);
	// let size2 = getWordSize2(info.text, fz, info.family);
	// if (size.w != size2.w || size.h != size2.h) {
	// 	console.log('DIFFERENT OUTCOME getWordSize!!!!!!!!!!!!', size, size2);
	// }
	//console.log(wdes,hdes,fz,size,info.text)
	while (size.w > wdes || size.h > hdes) {
		console.log('.')
		fz -= 1;
		if (fz < 9) break;
		let child = d.firstChild;
		child.style.fontSize = fz + 'px';

		//size = measureText1(info.text, fz, info.family);
		// let size2 = getWordSize2(info.text, fz, info.family);
		// //console.log(size,wdes,hdes);
		// if (size.w != size2.w || size.h != size2.h) {
		// 	console.log('DIFFERENT OUTCOME getWordSize!!!!!!!!!!!!', size, size2);
		// }
	}
	info.ui = d;
	info.uiInner = d.firstChild;
	return info;
}


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
function testSimple() {
	let info = picInfo('warehouse');
	console.log(info);
	let size = getTextSizeX1(info.text, 50, info.family, 900);
	console.log(size);
	setTimeout(() => { console.log(getBounds(size.d)) }, 1);
}
function test5_maPicText() {
	let tableStyle = { display: 'flex', flex: '0 0 auto', 'flex-wrap': 'wrap', gap: '4px', bg: 'green', padding: 4 }; mStyleX(table, tableStyle);

	let list = Array(10).fill('warehouse');
	list = list.map(x => coin() ? chooseRandom(symbolKeys) : 'warehouse');
	list = ['warehouse'];// Array(10).map(x => chooseRandom(symbolKeys));
	//  {
	// 	let a=coin();
	// 	console.log('a',a);
	// 	return 'warehouse';
	// 	//(coin()?chooseRandom(symbolKeys):'warehouse')
	// }); 
	console.log(list); //return;
	//let list = symbolKeys.slice(0, 5).concat(['warehouse']);
	//let list = ['warehouse','warehouse','warehouse']; //problemKeys;

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

$.fn.resizeText = function (options) {

	var settings = $.extend({ maxfont: 40, minfont: 4 }, options);

	var style = $('<style>').html('.nodelays ' +
		'{ ' +
		'-moz-transition: none !important; ' +
		'-webkit-transition: none !important;' +
		'-o-transition: none !important; ' +
		'transition: none !important;' +
		'}');

	function shrink(el, fontsize, minfontsize) {
		if (fontsize < minfontsize) return;

		el.style.fontSize = fontsize + 'px';

		if (el.scrollHeight > el.offsetHeight) shrink(el, fontsize - 1, minfontsize);
	}

	$('head').append(style);

	$(this).each(function (index, el) {
		var element = $(el);

		element.addClass('nodelays');

		shrink(el, settings.maxfont, settings.minfont);

		element.removeClass('nodelays');
	});

	style.remove();
}


//#region dep start over!
function showFont(family) {
	let gap = 5;
	mStyleX(table, { bg: 'random', padding: gap })
	styles = { margin: gap, padding: gap, bg: 'random', fg: 'contrast', fz: 30, family: family }
	let d = fitTextH('hallo', table, styles);
	let b = getBounds(d);
	console.log('w,h', Math.round(b.width), Math.round(b.height));


}
function fitTextH(text, dParent, styles) {
	// styles = {bg:'green',fz:30,family:'lucida sans'}
	// let [l,t,w,h]=[0,0,100,100];
	// let d=mDivPosAbs(l,t,dParent);
	let d = mDiv(dParent);
	d.innerHTML = text;
	styles.display = 'inline-block';
	mFlexLinebreak(table);
	mStyleX(d, styles);
	return d;
}
function fitText01(text, rect, dParent, styles, classes) {
	let [l, t, d] = prelims(rect, dParent, styles);
	//console.log(l,t,d);
	let [w, h] = [100, 100];
	styles = { fz: h * 6 / 7, family: 'emoNoto', bg: 'green' };
	d.innerHTML = text;
	mStyleX(d, styles);
	let b = getBounds(d);
	console.log('bounds', b.width, b.height, 'rect', rect.w, rect.h)



	return;

	let fz = 200;
	let oldFont = 100; let MAX = 5; let cnt = 0;
	while (oldFont != fz) {
		cnt += 1; if (cnt > MAX) { console.log('MAX reached!!!'); break; }

		let res = fontCorrection(text, styles, rect.w, rect.h, fz);
		let wdiff = res.wScroll - res.w;
		console.log(res, wdiff)
		let wOverflow = wdiff > 0;
		if (wOverflow) {
			oldFont = fz;
			fz = fz * res.w / res.wScroll;
			console.log('changing fz to', fz)
		}


	}
	d.innerHTML = text;
	mStyleX(d, styles);

}
function getSizeWithStylesX(text, styles) {
	var d = document.createElement("div");
	document.body.appendChild(d);
	//console.log(styles);
	let cStyles = jsCopy(styles);
	cStyles.position = 'fixed';
	cStyles.opacity = 0;
	cStyles.top = '-9999px';
	mStyleX(d, cStyles);
	d.innerHTML = text;
	let height = d.clientHeight;
	let width = d.clientWidth;

	let scrollWidth = d.scrollWidth;
	let scrollHeight = d.scrollHeight;

	console.log('w', width, 'scrollW', scrollWidth);

	d.parentNode.removeChild(d)
	return { w: width, h: height, wScroll: scrollWidth, hScroll: scrollHeight };
}
function prelims(rect, dParent, styles) {
	//console.log(rect)
	let l = rect.cx - (rect.w / 2);
	let t = rect.cy - (rect.h / 2);

	let d = mDivPosAbs(l, t, dParent);

	styles.display = 'inline-block';
	styles.bg = 'orange';
	//styles.padding = '0px 20px';
	styles.family = 'arial';
	styles.align = 'center';
	//styles.w = rect.w;
	return [l, t, d];
}
function fontCorrection(text, styles, w, h, fz) {
	styles.fz = fz;
	styles.w = w;
	let size = getSizeWithStylesX(text, styles);
	return size;
	console.log(size);
	let dw = w - size.w;
	let dh = h - size.h;

	//if dw>0 was bedeutet das?
	//habe mehr platz, dh schrift=fz zu klein

	//if dh>0 was bedeutet das?
	//habe mehr platz, dh schrift=fz zu klein

	if (dw < 0 || dh < 0) {
		//bedeutet dass fz zu GROSS ist!!!!
		//reduziere fz!
		return fz - 1;
	}

	return Math.max(size.h / h, size.w / w);


	if (size.h > h - 10 || size.w > w - 10) { return Math.max(size.h / h, size.w / w); }
	else if (size.h < h - 10 && size.w < w - 10) { return Math.min(size.h / h, size.w / w); }
	if (Math.abs(size.h - h) > fz || size.w > w) {
		//console.log('h',h,'\nsz',size.h,'\nfactor',h/size.h);
		return size.h / h;
		// } else if (isdef(styles.h) && Math.abs(size.w - w) > fz) {
		// 	return size.w / w;
	} else return 0;
}
function fitTextXX(text, rect, dParent, styles, classes) {
	let [l, t, d] = prelims(rect, dParent, styles);

	let fz = 200;
	let oldFont = 100; let MAX = 5; let cnt = 0;
	while (oldFont != fz) {
		cnt += 1; if (cnt > MAX) { console.log('MAX reached!!!'); break; }

		let res = fontCorrection(text, styles, rect.w, rect.h, fz);
		let wdiff = res.wScroll - res.w;
		console.log(res, wdiff)
		let wOverflow = wdiff > 0;
		if (wOverflow) {
			oldFont = fz;
			fz = fz * res.w / res.wScroll;
			console.log('changing fz to', fz)
		}


	}
	d.innerHTML = text;
	mStyleX(d, styles);

	let b = getBounds(d);
	console.log('bounds', b.width, b.height, 'rect', rect.w, rect.h)

	// textCorrectionFactorX(text, styles, rect.w, rect.h, fz); 
	// let oldFz = 0; let oldOldFz = 0;


	// return;

	// while (over > 0 && fz >= 8) {
	// 	cnt += 1; if (cnt > MAX) { console.log('MAX reached!!!'); break; }
	// 	console.log('over', over, 'fz', fz);
	// 	if (over == 0) break; //perfect font!
	// 	oldOldFz = oldFz;
	// 	oldFz = fz;
	// 	fz = Math.round(fontTransition(fz, over));
	// 	if (oldFz == fz || oldOldFz == fz) break;

	// 	//fz=Math.floor(fz*over);
	// 	//console.log('using over',over);
	// 	let newOver = textCorrectionFactorX(text, styles, rect.w, rect.h, fz);
	// 	let change = over - newOver;
	// 	//console.log('change', change, 'fz change from', oldFz, 'to', fz);
	// 	over = newOver;
	// 	//fz=fz*over;
	// }

	// //console.log(fz)
	// //styles.fz=25;
	// d.innerHTML = text;
	// mStyleX(d, styles);

	// let b = getBounds(d);
	// //console.log('bounds', b.width, b.height, 'rect', rect.w, rect.h)

}



//#region old
function fitTextX(text, rect, dParent, styles, classes) {
	let [l, t, d] = prelims(rect, dParent, styles);

	let fz = 20;
	let over = textCorrectionFactorX(text, styles, rect.w, rect.h, fz); let MAX = 20; let cnt = 0;
	let oldFz = 0; let oldOldFz = 0;
	while (over > 0 && fz >= 8) {
		cnt += 1; if (cnt > MAX) { console.log('MAX reached!!!'); break; }
		console.log('over', over, 'fz', fz);
		if (over == 0) break; //perfect font!
		oldOldFz = oldFz;
		oldFz = fz;
		fz = Math.round(fontTransition(fz, over));
		if (oldFz == fz || oldOldFz == fz) break;

		//fz=Math.floor(fz*over);
		//console.log('using over',over);
		let newOver = textCorrectionFactorX(text, styles, rect.w, rect.h, fz);
		let change = over - newOver;
		//console.log('change', change, 'fz change from', oldFz, 'to', fz);
		over = newOver;
		//fz=fz*over;
	}

	//console.log(fz)
	//styles.fz=25;
	d.innerHTML = text;
	mStyleX(d, styles);

	let b = getBounds(d);
	//console.log('bounds', b.width, b.height, 'rect', rect.w, rect.h)

}

function textCorrectionFactorX(text, styles, w, h, fz) {
	styles.fz = fz;
	//styles.w = w;
	//styles.h = h;
	let size = getSizeWithStyles(text, styles);
	console.log(size);
	let dw = w - size.w;
	let dh = h - size.h;

	//if dw>0 was bedeutet das?
	//habe mehr platz, dh schrift=fz zu klein

	//if dh>0 was bedeutet das?
	//habe mehr platz, dh schrift=fz zu klein

	if (dw < 0 || dh < 0) {
		//bedeutet dass fz zu GROSS ist!!!!
		//reduziere fz!
		return fz - 1;
	}

	return Math.max(size.h / h, size.w / w);


	if (size.h > h - 10 || size.w > w - 10) { return Math.max(size.h / h, size.w / w); }
	else if (size.h < h - 10 && size.w < w - 10) { return Math.min(size.h / h, size.w / w); }
	if (Math.abs(size.h - h) > fz || size.w > w) {
		//console.log('h',h,'\nsz',size.h,'\nfactor',h/size.h);
		return size.h / h;
		// } else if (isdef(styles.h) && Math.abs(size.w - w) > fz) {
		// 	return size.w / w;
	} else return 0;
}
//#endregion