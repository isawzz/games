//prepare items for container
function zItems(infos, ifs, options) {
	let items = [];
	for (let i = 0; i < infos.length; i++) {
		let info = infos[i];
		let k = info.key;
		let item = { key: k, info: info, index: i };
		//console.log(item)
		if (options.iStart) item.iGroup = iStart; //starting index of items in this same group
		let val;
		for (const propName in ifs) {
			let prop = ifs[propName];
			//console.log('TYPE OF', propName, 'IS', typeof prop, prop, isLiteral(prop))
			if (isLiteral(prop)) val = prop;
			else if (isList(prop)) val = prop[i % prop.length];
			else if (typeof (prop) == 'function') val = prop(i, info, item, options, infos);
			else val = null;
			if (isdef(val)) item[propName] = val;

			//console.log('item.'+propName,val)
		}
		items.push(item);
	}
	return items;
}
function zRepeatEachItem(items, repeat, shufflePositions = false) {
	//repeat items: repeat & shufflePositions
	let itRepeat = [];
	for (let i = 0; i < repeat; i++) { itRepeat = itRepeat.concat(jsCopy(items)); }
	if (shufflePositions) { shuffle(itRepeat); }
	//weil die items schon geshuffled wurden muss ich iRepeat neu setzen in den reihenfolge in der sie in itRepeat vorkommen!
	let labelRepeat = {};
	for (const item of itRepeat) {
		let iRepeat = labelRepeat[item.label];
		if (nundef(iRepeat)) iRepeat = 1; else iRepeat += 1;
		item.iRepeat = iRepeat;
		labelRepeat[item.label] = iRepeat;
	}
	return itRepeat;
}
function zRepeatInColorEachItem(items, colorKeys) {
	//colorKeys: copy colorKeys.length times into different colors
	let itColors = [];
	for (let line = 0; line < colorKeys.length; line++) {
		let newItems = jsCopy(items);
		let colorKey = colorKeys[line];
		let textShadowColor = ColorDict[colorKey].c;
		newItems.map(x => { x.textShadowColor = textShadowColor; x.color = ColorDict[colorKey]; x.colorKey = colorKey; });
		itColors = itColors.concat(newItems);
	}
	return itColors;
}














