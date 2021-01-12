function zItemsForViewer(keys, labelFunc, { sz, padding = 4 }, iStart = 0) {
	//an item is a div with a pic and possibly a label underneath
	sz = isdef(sz) ? sz : 100;
	szNet = sz - 2 * padding;
	let labeled = isdef(labelFunc);

	//als erstes items machen
	let items = [];
	let longestLabel = '';
	let maxlen = 0;
	let label;
	for (let i = 0; i < keys.length; i++) {
		let k = keys[i];
		let item = { key: k, info: symbolDict[k], index: i, iGroup: iStart };
		if (isList(labelFunc)) label = labelFunc[i % labelFunc.length];
		else if (typeof (labelFunc) == 'function') label = labelFunc(k, item.info);
		else label = null;

		if (isdef(label)) {
			let tlen = label.length;
			if (tlen > maxlen) { maxlen = tlen; longestLabel = label; }
			item.label = label;
		}
		items.push(item);
	}

	//jedes item hat jetzt ein label,info,index,key

	//als erstes das label produzieren und checken wieviel platz es braucht
	//console.log(longestLabel)
	let textStyles = idealFontsize(longestLabel, szNet, szNet / 2, 20, 4);

	let hText = textStyles.h;
	let hPic = szNet - hText; //Math.max(sz - hText,sz/4);
	let pictureSize = hPic;
	let picStyles = { w: pictureSize, h: pictureSize, bg: 'white', fg: 'random' };

	textStyles.fg = 'gray';
	delete textStyles.h;

	let outerStyles = { w: sz, h: sz, padding: padding, bg: 'white', align: 'center', 'box-sizing': 'border-box' };
	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let k = item.key;

		let text = zText(item.label, null, textStyles, hText);

		let pic = zPic(k, null, picStyles, true, false);
		delete pic.info;

		let d = mDiv();
		mAppend(d, pic.div);
		mAppend(d, text.div);
		mStyleX(d, outerStyles);

		// set padding according to text size, truncate text if not enough space
		if (text.extra < -padding && text.lines >= 3) {
			mClass(text.div, 'maxLines2');
		} else {
			d.style.padding = text.extra == 0 ? padding + 'px' : ('' + (padding + text.extra / 2) + 'px ' + padding + 'px ');
		}

		d.id = 'pic' + (i + iStart);

		//complete item info
		item.div = d;
		item.pic = pic;
		if (labeled) item.text = text;
		item.isSelected = false;
		item.dims = parseDims(sz, sz, d.style.padding);
		item.bg = d.style.backgroundColor;
		item.fg = text.div.style.color;

	}
	return items;
}



function zItemsFromPictures(keys, labels, { lang, bgs, colorKeys, textColor, sameBackground, repeat = 1, shufflePositions = true }) {
	//console.log('HALLO!!!!')
	//transform textColor param into list of fg, one for each key



	let fgText;
	if (isList(textColor)) {
		//auf all die items wird textColors cyclically aufgeteilt
		fgText = [];
		let iColor = 0;
		for (const k of keys) { fgText.push(textColor[iColor]); iColor = (iColor + 1) % textColor.length; }
	} else if (isdef(textColor)) {
		fgText = new Array(keys.length).fill(textColor);
	}
	//create one item per key
	let itKeys = [];
	for (let i = 0; i < keys.length; i++) {
		let k = keys[i];
		let info = isdef(lang) ? getRandomSetItem(lang, k) : symbolDict[k];
		let bg = isList(bgs) ? bgs[i] : isdef(colorKeys) ? 'white' : sameBackground ? computeColor('random') : 'random';
		let fg = isList(fgText) ? fgText[i] : colorIdealText(bg);
		let label = isList(labels) ? labels[i] : isdef(lang) ? info.best : k;
		itKeys.push({ key: k, info: info, label: label, bg: bg, fg: fg }); //, iRepeat: 1 }); // not necessary! done in next step!
	}
	//repeat items
	let itRepeat = [];
	for (let i = 0; i < repeat; i++) {
		let items = jsCopy(itKeys);
		itRepeat = itRepeat.concat(items);
	}
	if (shufflePositions) { shuffle(itRepeat); }

	//weil die items schon geshuffled wurden muss ich iRepeat neu setzen in den reihenfolge in der sie in itRepeat vorkommen!
	let labelRepeat = {};
	for (const item of itRepeat) {
		let iRepeat = labelRepeat[item.label];
		if (nundef(iRepeat)) iRepeat = 1; else iRepeat += 1;
		item.iRepeat = iRepeat;
		labelRepeat[item.label] = iRepeat;
	}
	//copy colors.length times into different colors

	let itColors = [];
	if (isdef(colorKeys)) {
		for (let line = 0; line < colorKeys.length; line++) {
			let newItems = jsCopy(itRepeat);
			let colorKey = colorKeys[line];
			let textShadowColor = ColorDict[colorKey].c;
			newItems.map(x => { x.textShadowColor = textShadowColor; x.color = ColorDict[colorKey]; x.colorKey = colorKey; });
			itColors = itColors.concat(newItems);
		}
	} else {
		itColors = itRepeat;
	}

	return itColors;
}


function test11_zItemsX() {
	let keys = ['horse', 'ant', 'green apple'];
	let items = zItemsX(keys);//, null, {labels:});console.log(x)
	//x.map(x=>console.log(x));

	items = zItemsFromPictures(keys, null, { lang: 'D', repeat: 2, shufflePositions: true });
	items.map(x => console.log(x)); console.log('dTable', dTable)

	let [pictureSize, rows, cols] = calcDimsAndSize1(items.length, undefined, undefined, dTable);


}
function test10_zViewerClockCrownFactory() {
	ensureSymByType();
	let keys = symKeysByType.icon;
	keys = keys.filter(x => x.includes('indus') || x.includes('clock') || x.includes('tim') || x.includes('watch') || x.includes('crown') || x.includes('factory'));
	zViewer(keys);
}
function test09_zViewer() {
	ensureSymByType();
	let keys = symKeysByType.icon;
	zViewer(keys);
}
function test08_towerAndOtherSymbols(dParent) {
	let sdict = {
		tower: { k: 'white-tower', bg: 'dimgray' }, clock: { k: 'watch', bg: 'navy' }, crown: { k: 'crown', bg: 'black' },
		tree: { k: 'tree', bg: GREEN },
		bulb: { k: 'lightbulb', bg: 'purple' }, factory: { k: 'factory', bg: 'red' }
	};

	for (const sym of ['tower', 'clock', 'crown', 'tree', 'bulb', 'factory']) {
		let key = sdict[sym].k;
		let pic = zPic(key, dParent, { sz: 40, bg: sdict[sym].bg, rounding: '10%', margin: 10 });
		//console.log(pic.outerDims, pic.innerDims, pic.info);
		console.log(pic);

	}
}

function test07_showDeck(dParent) {
	let keys = getRandomCards(5, { type: 'inno', color: 'purple' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'green' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'blue' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'yellow' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'purple' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)


}
function test06_showCards(dParent) {
	let keys = getRandomCards(5, { type: 'inno', color: 'purple' }); console.log(keys);
	showInnoCards(keys, dParent);

}
function test05_ElectricitySuburbia(dParent) {
	let keys1 = ['Electricity', 'Suburbia']
	for (const k of keys1) {
		let c = cardInno(k); console.log(c); mAppend(dParent, c.div);
		c = cardInnoSZ(k); console.log(c); mAppend(dParent, c.div);
		c = cardInnoz(k); console.log(c); mAppend(dParent, c.div);
	}

}
function test04_Electricity(dParent) {
	let c = cardInnoz('Electricity'); console.log(c); mAppend(dParent, c.div);
	//let res = zPic('lightbulb',dParent,{sz:40,bg:'green',rounding:'50%'}); 
	//console.log(res.outerDims,res.innerDims)
}

function test03_lighbulb(dParent) {
	let res = zPic('lightbulb', dParent, { sz: 40, bg: 'green', rounding: '50%' });
	console.log(res.outerDims, res.innerDims)
}
function test02_zPic(dParent) {
	let sz = 200; gap = 50;
	let res = zPic('lightbulb', dParent, { bg: 'green', padding: gap, rounding: '50%', w: sz, h: sz });
	console.log(res.outerDims, res.innerDims, 'sz', sz)

	gap = 5;
	res = zPic('lightbulb', dParent, { bg: 'green', padding: gap, rounding: '50%', w: sz, h: sz });

	console.log(res.outerDims, res.innerDims, 'sz', sz)
	console.log(res);

}
function test01_oldMaPicAusgleichVonPadding(dParent) {
	let sz = 200; gap = 50;
	let res = _zPicPaddingAddedToSize('lightbulb', dParent, { bg: 'green', padding: gap, rounding: '50%', w: sz, h: sz });
	console.log(res.outerDims, res.innerDims, 'sz', sz)

	gap = 5;
	res = _zPicPaddingAddedToSize('lightbulb', dParent, { bg: 'green', padding: gap, rounding: '50%', w: sz, h: sz });

	console.log(res.outerDims, res.innerDims, 'sz', sz)
	console.log(res);

}
function test00_oldMaPic(dParent) {
	let sz = 100; gap = 50;
	let res = _zPicPaddingAddedToSize('lightbulb', dParent, { bg: 'green', padding: gap, rounding: '50%', w: sz, h: sz });
	console.log(res.outerDims, res.innerDims, 'sz', sz)

	sz = 190; gap = 5;
	res = _zPicPaddingAddedToSize('lightbulb', dParent, { bg: 'green', padding: gap, rounding: '50%', w: sz, h: sz });

	console.log(res.outerDims, res.innerDims, 'sz', sz)
	console.log(res);

}