
function getPropValue(){}

function zItemsX(keys, dParent = null, ifs = {}, { sz, padding = 4, labels, bgs, fgs, repeat = 1, iStart = 0 } = {}, containerStyles = {}, itemStyles = {}) {

	//phase out!
	if (isEmpty(ifs)) {
		ifs = {};
		if (isdef(labels)) ifs.labels = labels; else ifs.labels = (i, info) => lastWord(info.key);
		if (isdef(bgs)) ifs.bgs = bgs; else ifs.bgs='blue';// = (i, info) => 'blue';
		if (isdef(fgs)) ifs.fgs = fgs; else ifs.fgs = ['red','green']; //(i, info) => 'yellow';
	}

	//an item is a div with a pic and possibly a label underneath
	sz = isdef(sz) ? sz : 100;
	szNet = sz - 2 * padding;
	let labeled = isdef(labels);

	//als erstes items machen
	let items = [];
	let longestLabel = '';
	let maxlen = 0;
	let label;
	for (let i = 0; i < keys.length; i++) {
		let k = keys[i];
		let item = { key: k, info: symbolDict[k], index: i, iGroup: iStart };
		let val;
		for (const propName in ifs) {
			let prop = ifs[propName];
			let k1 = propName.substring(0, propName.length - 1);
			//console.log(k1, prop)
			console.log('TYPE OF',propName, 'IS',typeof prop)
			if (isList(prop)) val = prop[i % prop.length];
			else if (typeof (prop) == 'function') val = prop(i, item.info);
			else val = null;

			if (isdef(val)) item[k1] = val;
		}

		if (isdef(item.label)) {
			let tlen = item.label.length;
			if (tlen > maxlen) { maxlen = tlen; longestLabel = item.label; }
		}
		items.push(item);
	}

	return items;

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



function zMeasure(item) {
	console.log(item)

}

function maShowCards(keys, labels, dParent, onClickPictureHandler, { showRepeat, containerForLayoutSizing, lang, border, picSize, bgs, colorKeys, contrast, repeat = 1, sameBackground, shufflePositions = true } = {}, { sCont, sPic, sText } = {}) {
	Pictures = [];

	//zInno('Steam Engine',dParent); return;

	keys = zInnoRandom(10); // ['Gunpowder']; //zInnoRandom(10); 
	keys.map(x => zInno(x, dParent)); //console.log(keys); 	

	let cards = [];
	for (const k of keys) {
		let card = zInno(k, dParent);
		cards.push(card);
		zMeasure(card);
	}

	//test09_zViewer(); return;;
	//test10_zViewerClockCrownFactory(); return;
	//test08_towerAndOtherSymbols(dParent); return;
	//test07_showDeck(dParent);
	//test06_showCards(dParent); 
	//test05_ElectricitySuburbia(dParent);
	//test04_Electricity(dParent); return;
	//test03_lighbulb(dParent); return;
	//test00_oldMaPic(dParent); 
	//test02_zPic(dParent);test01_oldMaPicAusgleichVonPadding(dParent); return;
	// let c=card52();	console.log(c);	
	// showSingle52(dParent);


	//showAllInnoCards(dParent);

	return;

	mLinebreak(dParent);
	// showDeck(keys, dParent, 'left', 100)
	// showDeck(keys, dParent, 'left', 100)
	// showDeck(keys, dParent, 'left', 100)
	// showDeck(keys, dParent, 'left', 100)
	// showDeck(keys, dParent, 'left', 100)

	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'green' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'blue' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'yellow' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'purple' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)

	return;



	let pics = [];

	//#region prelim
	//console.log('maShowPictures_', 'keys', keys, '\n', 'labels', labels, '\n', 'bgs', bgs)
	//console.log('sameBackground',sameBackground)

	let numPics = keys.length * repeat;

	//make a label for each key
	let items = [];
	for (let i = 0; i < keys.length; i++) {
		let k = keys[i];
		let info = isdef(lang) ? getRandomSetItem(lang, k) : symbolDict[k];
		let bg = isList(bgs) ? bgs[i] : isdef(colorKeys) ? 'white' : sameBackground ? computeColor('random') : 'random';
		let label = isList(labels) ? labels[i] : isdef(lang) ? info.best : k;
		items.push({ key: k, info: info, label: label, bg: bg, iRepeat: 1 });
	}


	//console.log('________________',items,repeat)
	let items1 = jsCopy(items);
	for (let i = 0; i < repeat - 1; i++) {
		// let newItems=jsCopy(items);
		// for(const it of newItems) it.iRepeat=i+1;
		items = items.concat(items1);
	}
	//console.log('________________',items,repeat)

	//console.log(items)

	let isText = true;
	let isOmoji = false;
	if (isdef(lang)) {
		let textStyle = getParamsForMaPicStyle('twitterText');
		isText = textStyle.isText;
		isOmoji = textStyle.isOmoji;
	}

	//console.log(items);
	numPics = items.length;

	//console.log('numPics',numPics,'items',jsCopy(items))

	//dann erst shuffle!
	if (shufflePositions) { shuffle(items); }
	// if (shufflePositions) {console.log('shuffling!!!'); shuffle(items);}

	//console.log('after shuffling items',jsCopy(items))

	//#endregion prelim

	let lines = isdef(colorKeys) ? colorKeys.length : 1;
	let [pictureSize, picsPerLine] = calcDimsAndSize(numPics, lines, containerForLayoutSizing);
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };

	//if (isdef(myStyles)) stylesForLabelButton = deepmergeOverride(stylesForLabelButton, myStyles);

	if (isdef(border)) stylesForLabelButton.border = border;

	if (isdef(picSize)) pictureSize = picSize;

	//console.log('lines',lines,'picsPerLine',picsPerLine, 'items', items, 'numPics', numPics)

	let labelRepeat = {};

	for (let line = 0; line < lines; line++) {
		let textShadowColor, colorKey;

		if (isdef(colorKeys)) { colorKey = colorKeys[line]; textShadowColor = ColorDict[colorKey].c; labelRepeat = {}; }

		for (let i = 0; i < numPics; i++) {
			let item = items[i];
			let info = item.info; //infos[i];
			let label = item.label; //labels[i];
			let iRepeat = labelRepeat[label];
			if (nundef(iRepeat)) iRepeat = 1; else iRepeat += 1;
			labelRepeat[label] = iRepeat;
			let bg = item.bg; //bgs[i];
			let ipic = (line * picsPerLine + i);
			// if (ipic % picsPerLine == 0 && ipic > 0) {console.log('linebreak!',ipic,line,keys.length); mLinebreak(dParent);}
			if (ipic % picsPerLine == 0 && ipic > 0) { mLinebreak(dParent); }
			let id = 'pic' + ipic; // (line * keys.length + i);
			let d1 = maPicLabelButtonFitText(info, label,
				{ w: pictureSize, h: pictureSize, bgPic: bg, textShadowColor: textShadowColor, contrast: contrast, sPic: sPic },
				onClickPictureHandler, dParent, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;

			// console.log('---->',d1.children[0].children[0].style.fontSize)
			//addRowColInfo(d1,line,i,pictureSize);
			if (showRepeat) addRepeatInfo(d1, iRepeat, pictureSize);
			let fzPic = firstNumber(d1.children[0].children[0].style.fontSize);
			pics.push({
				textShadowColor: textShadowColor, color: ColorDict[colorKey], colorKey: colorKey, key: info.key, info: info,
				bg: bg, div: d1, id: id, sz: pictureSize, fzPic: fzPic,
				index: ipic, row: line, col: i, iRepeat: iRepeat, label: label, isLabelVisible: true, isSelected: false
			});
		}
	}
	return pics;
}






