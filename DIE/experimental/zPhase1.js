//prepare items for container
function zItems(keys, ifs, options){//} { lang, bgs, colorKeys, textColor, sameBackground, repeat = 1, shufflePositions = true }) {
	//this is a copy of _zItemsFromPictures!!!!!!!!!!

	// all color properties should be ifs
	// label and other visible properties should be ifs

	//welche options sind in zItems relevant: sameBackground,repeat,shufflePositions,lang,colorKeys
	//=>lang kann ich eliminieren wenn ich infos liefere und labels als if habe!

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
		itKeys.push({ key: k, info: info, label: label, bg: bg, fg: fg}); //, iRepeat: 1 }); // not necessary! done in next step!
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
			newItems.map(x => {x.textShadowColor = textShadowColor;x.color = ColorDict[colorKey];x.colorKey = colorKey;});
			itColors = itColors.concat(newItems);
		}
	} else {
		itColors = itRepeat;
	}

	return itColors;
}















