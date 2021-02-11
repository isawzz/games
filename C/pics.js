
//#region new API
function _createDivs(items, ifs, options) {
	//options needs to have showPics,showLabels
	if (nundef(options.textPos)) options.textPos = 'none';

	let w = isdef(options.w) ? options.w : options.sz;
	let h = isdef(options.h) ? options.h : options.sz;

	let padding = (isdef(ifs.padding) ? ifs.padding : 1);

	let bo = ifs.border;
	bo = isdef(bo) ? isString(bo) ? firstNumber(bo) : bo : 0;

	let wNet = w - 2 * padding - 2 * bo;
	let hNet = h - 2 * padding - 2 * bo;

	let pictureSize = wNet;
	options.center=true;
	//options.showLabels=false;
	let picStyles = { w: wNet, h: isdef(options.center) ? hNet : hNet + padding }; //if no labels!

	let textStyles, hText;
	if (options.showLabels) {
		let longestLabel = findLongestLabel(items);
		let oneWord = longestLabel.label.replace(' ', '_');

		let maxTextHeight = options.showPics ? hNet / 2 : hNet;
		textStyles = idealFontsize(oneWord, hNet, maxTextHeight, 22, 8);
		hText = textStyles.h;

		pictureSize = hNet - hText;
		picStyles = { w: pictureSize, h: pictureSize };

		delete textStyles.h;
		delete textStyles.w;
	}

	let outerStyles = { rounding: 10, margin: w / 12, display: 'inline-block', w: w, h: h, padding: padding, bg: 'white', align: 'center', 'box-sizing': 'border-box' };
	if (options.showLabels == true && options.textPos == 'none' && nundef(options.h)) delete outerStyles.h;
	outerStyles = deepmergeOverride(outerStyles, ifs);
	let pic, text;
	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let k = item.key;
		let d = mDiv();
		if (isdef(item.textShadowColor)) {
			let sShade = '0 0 0 ' + item.textShadowColor;
			if (options.showPics) {
				picStyles['text-shadow'] = sShade;
				picStyles.fg = anyColorToStandardString('black', item.contrast); //'#00000080' '#00000030' 
			} else {
				textStyles['text-shadow'] = sShade;
				textStyles.fg = anyColorToStandardString('black', item.contrast); //'#00000080' '#00000030' 
			}
		}
		//add pic if needed
		if (options.showPics) {
			pic = zPic(k, null, picStyles, true, false);
			delete pic.info;
			mAppend(d, pic.div);
		}
		//add text if needed
		if (options.showLabels) {
			textStyles.fg = item.fg;
			text = zText1Line(item.label, null, textStyles, hText);
			mAppend(d, text.div);
		}
		//style container div
		outerStyles.bg = item.bg;
		outerStyles.fg = item.fg;
		mStyleX(d, outerStyles);
		//console.log('===>iGroup',item.iGroup,i)
		d.id = getUID(); // 'pic' + (i + item.iGroup); //$$$$$
		d.onclick = options.onclick;
		//complete item info
		item.id = d.id;
		item.row = Math.floor(item.index / options.cols);
		item.col = item.index % options.cols;
		item.div = d;
		if (isdef(pic)) { item.pic = pic; item.fzPic = pic.innerDims.fz; }
		if (isdef(text)) item.text = text;
		item.isSelected = false;
		item.isLabelVisible = options.showLabels;
		item.dims = parseDims(w, w, d.style.padding);
		if (options.showRepeat) addRepeatInfo(d, item.iRepeat, w);
	}

}
function createStandardItems(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	//#region prelim: default ifs and options, keys & infos
	//console.log('ifs', jsCopy(ifs)); console.log('options', jsCopy(options));

	// let showLabels = Settings.labels == true;
	if (nundef(Settings)) Settings = {};// language: 'E' };
	let infos = keys.map(k => (isdef(Settings.language) ? getRandomSetItem(Settings.language, k) : symbolDict[k]));
	//ifs and options: defaults
	let bg = isdef(options.colorKeys) ? 'white' : (i) => options.sameBackground ? computeColor('random') : 'random';
	let fg = (i, info, item) => colorIdealText(item.bg);
	let defIfs = { bg: bg, fg: fg, label: isdef(labels) ? labels : (i, info) => info.best, contrast: .32, fz: 20, padding: 10 };
	let defOptions = { showLabels: Settings.labels == true, shufflePositions: true, sameBackground: true, showRepeat: false, repeat: 1, onclick: onClickPictureHandler, iStart: 0 };
	ifs = deepmergeOverride(defIfs, ifs);
	options = deepmergeOverride(defOptions, options);
	//console.log('keys', keys); console.log('ifs', ifs); 
	//console.log('options', options);
	//#endregion

	//#region phase1: make items: hier jetzt mix and match
	let items = zItems(infos, ifs, options);
	if (options.repeat > 1) items = zRepeatEachItem(items, options.repeat, options.shufflePositions);
	if (isdef(options.colorKeys)) items = zRepeatInColorEachItem(items, options.colorKeys);
	//console.log('____________ options.rows', options.rows)
	items.map(x => x.label = x.label.toUpperCase());
	//#endregion phase1

	return [items, ifs, options];
}
function getRandomItems(n, keyOrSet, text = true, pic = true, styles = {}) {
	let keys = getRandomKeys(n, keyOrSet);
	//console.log(keys)
	if (pic == true) return getPics(() => console.log('click'), styles, { showLabels: text }, keys);
	else return getLbls(() => console.log('click'), styles, { showLabels: text }, keys);
}
function getPics(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	let items;
	[items, ifs, options] = createStandardItems(onClickPictureHandler, ifs, options, keys, labels);
	// prepX(Pictures, ifs, options);
	prepDims(items, options);
	prepPics(items, ifs, options);
	return items;
}
function getLbls(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	let items;
	[items, ifs, options] = createStandardItems(onClickPictureHandler, ifs, options, keys, labels);
	// prepX(Pictures, ifs, options);
	prepDims(items, options);
	prepLbls(items, ifs, options);
	return items;
}
function getPic(key, sz, bg, label) {
	let items, ifs = { bg: bg }, options = { sz: sz };
	if (isdef(label)) options.showLabels = true; else options.showLabels = false;
	[items, ifs, options] = createStandardItems(null, ifs, options, [key], isdef(label) ? [label] : undefined);
	// prepX(Pictures, ifs, options);
	prepDims(items, options);
	prepPics(items, ifs, options);
	return items[0];
}
function getLbl(key, sz, bg, label) {
	let items, ifs = { bg: bg }, options = { sz: sz };
	if (isdef(label)) options.showLabels = true; else options.showLabels = false;
	[items, ifs, options] = createStandardItems(null, ifs, options, [key], isdef(label) ? [label] : undefined);
	// prepX(Pictures, ifs, options);
	prepDims(items, options);
	prepLbls(items, ifs, options);
	return items[0];
}
function presentItems(items, dParent, rows) {
	//#region phase3: prep container for items
	//mClass(dParent, 'flexWrap'); //frage ob das brauche????
	//#endregion

	//#region phase4: add items to container!
	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, x.div));
	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4 };
	let gridSize = layoutGrid(items, dGrid, gridStyles, { rows: rows, isInline: true });
	// console.log('size of grid',gridSize,'table',getBounds(dTable))

	//#endregion


	//console.log('*** THE END ***', Pictures[0]);
	return { dGrid: dGrid, sz: gridSize };
}
function replaceLabel(item, label) { }
function replacePic(item, key) { }
function replacePicAndLabel(item, key, label) {
	//if item has both pic and label, replace them
	//if item has only pic, replace it and add label from new key
	//if item has onlt text, resize it and add both pic and label
	//if label param is missing, use default label param from key
	//console.log('item',item,'key',key,'label',label)
	let div = item.div;
	//console.log(item);
	let newItem = getPic(key, item.sz, item.bg, label);
	clearElement(div);
	mAppend(div, newItem.div.children[0]);
	mAppend(div, newItem.div.children[0]);
	item.pic = newItem.pic;
	item.text = newItem.text;
}
function addLabel(item, label) { }
function removeLabel(item) {
	//console.log('old item',item);
	let div = item.div;
	let newItem = getPic(item.key, item.sz, item.bg);
	//console.log('newItem',newItem);
	clearElement(div);
	mAppend(div, newItem.div.children[0]);
	item.pic = newItem.pic;
	delete item.text;
}
function addPic(item, key) {
	let div = item.div;
	//console.log(item);
	let newItem = getPic(key, item.sz, item.bg, item.label);
	clearElement(div);
	mAppend(div, newItem.div.children[0]);
	mAppend(div, newItem.div.children[0]);
	item.pic = newItem.pic;
	item.text = newItem.text;

}
function removePic(item) {
	//if item does not have a label, add the label for its key
	let div = item.div;
	//console.log(item);
	let newItem = getLbl(item.key, item.sz, item.bg, item.label);
	clearElement(div);
	mAppend(div, newItem.div.children[0]);
	delete item.pic;
	item.text = newItem.text;
}
function showLbls(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	let items = getLbls(onClickPictureHandler, ifs, options, keys, labels);
	presentItems(items, dTable, 1);
	return items;
}
function showPics(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	let items = getPics(onClickPictureHandler, ifs, options, keys, labels);
	presentItems(items, dTable, options.rows);
	return items;
}

