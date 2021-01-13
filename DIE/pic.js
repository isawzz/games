function showPicturesSpeechTherapyGames(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	//#region prelim
	if (!EXPERIMENTAL) { return showPicturesSpeechTherapyGamesWORKING(...arguments); }
	//console.log('ifs', jsCopy(ifs)); console.log('options', jsCopy(options));
	//keys and infos
	Pictures = [];
	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	//keys=['eye'];//['toolbox','tiger']; //keys[0] = 'butterfly'; //keys[0]='man in manual wheelchair';	//keys=['sun with face'];

	let infos = keys.map(k => (isdef(Settings.language) ? getRandomSetItem(Settings.language, k) : symbolDict[k]));

	//ifs and options: defaults
	let bg = isdef(options.colorKeys) ? 'white' : (i) => options.sameBackground ? computeColor('random') : 'random';
	let fg = (i, info, item) => colorIdealText(item.bg);
	let defIfs = { bg: bg, fg: fg, label: isdef(labels) ? labels : (i, info) => info.best, contrast: .32, fz: 20, };
	let defOptions = { shufflePositions: true, sameBackground: true, showRepeat: false, repeat: 1, onclick: onClickPictureHandler, iStart: 0 };
	ifs = deepmergeOverride(defIfs, ifs);
	options = deepmergeOverride(defOptions, options);

	//console.log('keys', keys); console.log('ifs', ifs); console.log('options', options);
	//#endregion

	//#region phase1: make items: hier jetzt mix and match
	let items = zItems(infos, ifs, options);
	if (options.repeat > 1) items = zRepeatEachItem(items, options.repeat, options.shufflePositions);
	if (isdef(options.colorKeys)) items = zRepeatInColorEachItem(items, options.colorKeys);
	items.map(x => x.label = x.label.toUpperCase());
	Pictures = items;

	//console.log('items', items);
	//items.map(x=>console.log(x));

	//phase2: prepare items for container
	let longestLabel = findLongestLabel(items);
	let [sz, rows, cols] = calcRowsColsSize(items.length, isdef(options.colorKeys) ? options.colorKeys.length : undefined);
	if (nundef(ifs.sz)) items.map(x => x.sz = sz);

	//randomly attribute labels or no labels or all labels
	if (nundef(Settings.labels) || Settings.labels) {
		let n = Math.min(items.length, G.numLabels);
		let chosen = items.length == G.numLabels ? items : choose(items, n);
		chosen.map(x => x.hasLabel = true);
	}
	//#endregion phase1

	//#region phase2: sizing, composing item
	let padding = 8;
	let szNet = sz - 2 * padding;
	let oneWord = longestLabel.label.replace(' ', '_');
	let textStyles = idealFontsize(oneWord, szNet, szNet / 2, 20, 4); //, 'bold');	textStyles.weight='bold'
	let hText = textStyles.h;
	let hPic = szNet - hText; //Math.max(sz - hText,sz/4);

	let pictureSize = hPic;
	let picStyles = { w: pictureSize, h: pictureSize };

	delete textStyles.h;
	delete textStyles.w;

	let outerStyles = { rounding: 10, margin: sz / 12, display: 'inline-block', w: sz, h: sz, padding: padding, bg: 'white', align: 'center', 'box-sizing': 'border-box' };
	let pic, text;
	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let k = item.key;

		let d = mDiv();
		if (item.hasLabel == true) {

			picStyles = { w: pictureSize, h: pictureSize };
			textStyles.fg = item.fg;
			text = zText1Line(item.label, null, textStyles, hText);

			if (isdef(item.textShadowColor)) {
				let sShade = '0 0 0 ' + item.textShadowColor;
				picStyles['text-shadow'] = sShade;
				picStyles.fg = anyColorToStandardString('black', item.contrast); //'#00000080' '#00000030' 
			}

			pic = zPic(k, null, picStyles, true, false);
			delete pic.info;

			mAppend(d, pic.div);
			mAppend(d, text.div);

		} else {
			picStyles = { w: szNet, h: szNet };

			if (isdef(item.textShadowColor)) {
				let sShade = '0 0 0 ' + item.textShadowColor;
				picStyles['text-shadow'] = sShade;
				picStyles.fg = anyColorToStandardString('black', item.contrast); //'#00000080' '#00000030' 
			}
			pic = zPic(k, null, picStyles, true, false);
			mAppend(d, pic.div);

		}

		outerStyles.bg = item.bg;
		outerStyles.fg = item.fg;

		mStyleX(d, outerStyles);

		d.id = 'pic' + (i + item.iGroup);
		d.onclick = options.onclick;

		//complete item info
		item.div = d;
		item.pic = pic;
		let labeled = true;
		if (labeled) item.text = text;
		item.isSelected = false;
		item.dims = parseDims(sz, sz, d.style.padding);
		// item.bg = d.style.backgroundColor;
		// item.fg = text.div.style.color;
		if (options.showRepeat) addRepeatInfo(d, item.iRepeat, sz);

		// console.log(items[2]);
		let fzPic = firstNumber(item.div.children[0].children[0].style.fontSize);
		let docfz = items[0].pic.innerDims.fz;
		console.assert(docfz == fzPic, 'fzPic is ' + fzPic + ', docfz is ' + docfz);
		item.fzPic = fzPic;
		console.log('font size of pic is',fzPic);


	}
	//#endregion

	//#region phase3: prep container for items
	mClass(dTable, 'flexWrap');
	//#endregion

	//#region phase4: add items to container!
	// let szFinal = zGrid(Pictures, dTable);
	let dGrid = mDiv(dTable);
	items.map(x => mAppend(dGrid, x.div));
	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, rounding: 5 };
	let gridSize = layoutGrid(items, dGrid, gridStyles, { rows: rows, isInline: true });

	//#endregion

	console.log('*** THE END ***')

	// 	pics.push({
	// 		textShadowColor: item.textShadowColor, color: item.color, colorKey: item.colorKey, 
	// key: item.info.key, info: item.info,
	// 		bg: item.bg, div: d1, id: id, sz: sz, fzPic: fzPic,
	// 		index: i, row: r, col: c, iRepeat: item.iRepeat, label: item.label, 
	// isLabelVisible: true, isSelected: false
	// 	});
	// 	i += 1;
	// }
	// mLinebreak(dParent);
	// 	}


}
function showPicturesSpeechTherapyGames1(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {

	if (!EXPERIMENTAL) { return showPicturesSpeechTherapyGamesWORKING(...arguments); }

	//console.log('ifs', jsCopy(ifs)); console.log('options', jsCopy(options));

	//keys and infos
	Pictures = [];
	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	//keys=['eye'];//['toolbox','tiger']; //keys[0] = 'butterfly'; //keys[0]='man in manual wheelchair';	//keys=['sun with face'];

	let infos = keys.map(k => (isdef(Settings.language) ? getRandomSetItem(Settings.language, k) : symbolDict[k]));

	//ifs and options: defaults
	let bg = isdef(options.colorKeys) ? 'white' : (i) => options.sameBackground ? computeColor('random') : 'random';
	let fg = (i, info, item) => colorIdealText(item.bg);
	let defIfs = { bg: bg, fg: fg, label: isdef(labels) ? labels : (i, info) => info.best, contrast: .32, fz: 20, };
	let defOptions = { shufflePositions: true, sameBackground: true, showRepeat: false, repeat: 1, onclick: onClickPictureHandler, iStart: 0 };
	ifs = deepmergeOverride(defIfs, ifs);
	options = deepmergeOverride(defOptions, options);

	//console.log('keys', keys); console.log('ifs', ifs); console.log('options', options);

	//phase1: make items: hier jetzt mix and match
	let items = zItems(infos, ifs, options);
	if (options.repeat > 1) items = zRepeatEachItem(items, options.repeat, options.shufflePositions);
	if (isdef(options.colorKeys)) items = zRepeatInColorEachItem(items, options.colorKeys);

	items.map(x => x.label = x.label.toUpperCase());

	//console.log('items', items);
	//items.map(x=>console.log(x));

	//phase2: prepare items for container
	let longestLabel = findLongestLabel(items);
	let [sz, rows, cols] = calcRowsColsSize(items.length, isdef(options.colorKeys) ? options.colorKeys.length : undefined);
	if (nundef(ifs.sz)) items.map(x => x.sz = sz);

	let padding = 8;
	let szNet = sz - 2 * padding;
	let oneWord = longestLabel.label.replace(' ', '_');
	let textStyles = idealFontsize(oneWord, szNet, szNet / 2, 20, 4); //, 'bold');	textStyles.weight='bold'
	let hText = textStyles.h;
	let hPic = szNet - hText; //Math.max(sz - hText,sz/4);
	//let picStyles = { w: hPic, h: hPic };

	//#region test this code
	TEST_THIS_CODE = true;
	if (TEST_THIS_CODE) {
		Pictures = items;
		let pictureSize = hPic;
		let picStyles = { w: pictureSize, h: pictureSize };

		delete textStyles.h;
		delete textStyles.w;

		let outerStyles = { rounding: 10, margin: sz / 12, display: 'inline-block', w: sz, h: sz, padding: padding, bg: 'white', align: 'center', 'box-sizing': 'border-box' };

		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			let k = item.key;

			textStyles.fg = item.fg;
			let text = zText1Line(item.label, null, textStyles, hText);

			if (isdef(item.textShadowColor)) {
				let sShade = '0 0 0 ' + item.textShadowColor;
				picStyles['text-shadow'] = sShade;
				picStyles.fg = anyColorToStandardString('black', item.contrast); //'#00000080' '#00000030' 
			}

			let pic = zPic(k, null, picStyles, true, false);
			delete pic.info;

			let d = mDiv();
			mAppend(d, pic.div);
			mAppend(d, text.div);

			outerStyles.bg = item.bg;
			outerStyles.fg = item.fg;

			mStyleX(d, outerStyles);

			d.id = 'pic' + (i + item.iGroup);
			d.onclick = options.onclick;

			//complete item info
			item.div = d;
			item.pic = pic;
			let labeled = true;
			if (labeled) item.text = text;
			item.isSelected = false;
			item.dims = parseDims(sz, sz, d.style.padding);
			// item.bg = d.style.backgroundColor;
			// item.fg = text.div.style.color;

		}

		//phase3: prep container for items
		mClass(dTable, 'flexWrap');

		//phase4: add items to container!
		// let szFinal = zGrid(Pictures, dTable);
		let dParent = dTable;
		let dGrid = mDiv(dParent);
		items.map(x => mAppend(dGrid, x.div));
		let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, rounding: 5 };
		let size = layoutGrid(items, dGrid, gridStyles, { rows: rows, isInline: true });
		return size;


		return items;
	}
	return Pictures;

	//#endregion

	console.log('*** THE END ***')

	//#region REST CODE
	let colorKeys = ifs.colorKeys;
	let container = undefined;
	let lang = Settings.language;
	let border = ifs.border;
	let picSize = ifs.sz;
	let contrast = ifs.contrast;
	let sPic = {};
	let dParent = dTable;
	let showRepeat = options.showRepeat;
	let pics = [];
	let numPics = keys.length * options.repeat;
	//let [pictureSize, rows, cols] = calcDimsAndSize1(items.length, isdef(colorKeys) ? colorKeys.length : undefined, undefined, container);

	console.log('....sz', sz, 'rows', rows, 'cols', cols)
	let stylesForLabelButton = { rounding: 10, margin: sz / 8 };

	//if (isdef(myStyles)) stylesForLabelButton = deepmergeOverride(stylesForLabelButton, myStyles);
	let isText = true;
	let isOmoji = false;
	if (isdef(lang)) {
		let textStyle = getParamsForMaPicStyle('twitterText');
		isText = textStyle.isText;
		isOmoji = textStyle.isOmoji;
	}

	if (isdef(border)) stylesForLabelButton.border = border;

	if (isdef(picSize)) sz = picSize;

	let i = 0;
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			let item = items[i];
			let id = 'pic' + i;
			let d1 = maPicLabelButtonFitText(item.info, item.label,
				{
					w: sz, h: sz, bgPic: item.bg, textShadowColor: item.textShadowColor, contrast: contrast,
					sPic: sPic
				},
				onClickPictureHandler, dParent, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;

			console.log('padding', d1)

			if (showRepeat) addRepeatInfo(d1, item.iRepeat, sz);
			let fzPic = firstNumber(d1.children[0].children[0].style.fontSize);
			//item hat bereits: fg,bg,iRepeat,info,key,label,textShadowColor
			pics.push({
				textShadowColor: item.textShadowColor, color: item.color, colorKey: item.colorKey, key: item.info.key, info: item.info,
				bg: item.bg, div: d1, id: id, sz: sz, fzPic: fzPic,
				index: i, row: r, col: c, iRepeat: item.iRepeat, label: item.label, isLabelVisible: true, isSelected: false
			});
			i += 1;
		}
		mLinebreak(dParent);
	}

	Pictures = pics;
	return pics;

	//#endregion
	//Pictures = zShowPictures(keys, dTable, ifs, options);

	// Pictures = zShowPictures1(keys, ifs.label, dTable, onClickPictureHandler,
	// 	{
	// 		showRepeat: options.showRepeat, picSize: ifs.sz, bg: ifs.bg, repeat: options.repeat, sameBackground: options.sameBackground, border: ifs.border,
	// 		lang: Settings.language, colorKeys: options.colorKeys, contrast: ifs.contrast
	// 	});
	// Pictures = maShowPictures(keys, labels, dTable, onClickPictureHandler,
	// 	{
	// 		showRepeat: showRepeat, picSize: sz, bg: bg, repeat: repeat, sameBackground: sameBackground, border: border,
	// 		lang: Settings.language, colorKeys: colorKeys, contrast: contrast
	// 	});

	// label hiding
	let totalPics = Pictures.length;
	if (nundef(Settings.labels) || Settings.labels) {
		if (G.numLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - G.numLabels);
		for (const p of remlabelPic) {
			//console.log('hi1');
			maHideLabel(p.id, p.info); p.isLabelVisible = false;
		}
	} else {
		for (const p of Pictures) {
			//console.log('hi1');
			maHideLabel(p.id, p.info); p.isLabelVisible = false;
		}

	}

}

function showPicturesSpeechTherapyGamesWORKING(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {

	Pictures = [];
	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	//keys=['eye'];//['toolbox','tiger']; //keys[0] = 'butterfly'; //keys[0]='man in manual wheelchair';	//keys=['sun with face'];

	let defIfs = { contrast: .32, fz: 20, label: isdef(labels) ? labels : (i, info) => info.best };
	let defOptions = { showRepeat: false, repeat: 1, sameBackground: true, onclick: onClickPictureHandler };
	ifs = deepmergeOverride(defIfs, ifs);
	options = deepmergeOverride(defOptions, options);
	console.log('.')

	Pictures = zShowPictures1(keys, ifs.label, dTable, onClickPictureHandler,
		{
			showRepeat: options.showRepeat, picSize: ifs.sz, bg: ifs.bg, repeat: options.repeat, sameBackground: options.sameBackground, border: ifs.border,
			lang: Settings.language, colorKeys: options.colorKeys, contrast: ifs.contrast
		});
	// Pictures = maShowPictures(keys, labels, dTable, onClickPictureHandler,
	// 	{
	// 		showRepeat: showRepeat, picSize: sz, bg: bg, repeat: repeat, sameBackground: sameBackground, border: border,
	// 		lang: Settings.language, colorKeys: colorKeys, contrast: contrast
	// 	});

	// label hiding
	let totalPics = Pictures.length;
	if (nundef(Settings.labels) || Settings.labels) {
		if (G.numLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - G.numLabels);
		for (const p of remlabelPic) {
			//console.log('hi1');
			maHideLabel(p.id, p.info); p.isLabelVisible = false;
		}
	} else {
		for (const p of Pictures) {
			//console.log('hi1');
			maHideLabel(p.id, p.info); p.isLabelVisible = false;
		}

	}

}


//#region logic selectors (game: Elim!)
function logicMulti(n) {
	let allPics = Pictures;
	let maxPics = 4;
	let [s1, w1, pics1, prop1] = logicFilter(allPics, []);
	let [s, w, pics, prop] = [s1, w1, pics1, prop1];
	let maxloop = 3; cntloop = 0; let propsUsed = [prop1];
	//console.log('______', cntloop, ': prop', prop, '\n', s, '\n', w, '\n', jsCopy(pics));
	while (pics.length > maxPics && cntloop < maxloop) {
		cntloop += 1;
		let opp = arrMinus(allPics, pics);
		if (opp.length <= maxPics) {
			let lst = ['eliminate', 'all', 'EXCEPT'];
			if (Settings.language == 'D') lst = lst.map(x => DD[x]);
			let prefix = lst.join(' ');
			s = prefix + ' ' + s;
			w = prefix + ' ' + w;
			return [s, w, opp];
		}
		//apply another filter!
		[s1, w1, pics1, prop1] = logicFilter(pics, propsUsed);
		if (isEmpty(pics1)) return [s, w, pics];
		else {
			//need to concat!
			pics = pics1;
			prop = prop1;
			if (prop1 == 'label') {
				s = s1 + ' ' + s;
				w = w1 + ' ' + w;
			} else if (arrLast(propsUsed) == 'label') {
				let conn = Settings.language == 'E' ? ' with ' : ' mit ';
				s1 = s1.substring(s1.indexOf(' '));
				w1 = w1.substring(w1.indexOf(' '));
				s = s + conn + s1; w = w + conn + w1;
			} else {
				let conn = Settings.language == 'E' ? ' and ' : ' und ';
				s1 = s1.substring(s1.indexOf(' '));
				w1 = w1.substring(w1.indexOf(' '));
				s = s + conn + s1; w = w + conn + w1;
			}
			propsUsed.push(prop1);
			//console.log('______', cntloop, ': prop', prop, '\n', s, '\n', w, '\n', jsCopy(pics));
		}
		// console.log('______1: prop', prop, '\n', s, '\n', w, '\n', jsCopy(pics));
	}
	//console.log('fehler!')

	let lst1 = ['eliminate', 'all'];
	if (Settings.language == 'D') lst1 = lst1.map(x => DD[x]);
	let prefix = lst1.join(' ');
	s = prefix + ' ' + s;
	w = prefix + ' ' + w;
	return [s, w, pics];
}
function logicFilter(allPics, exceptProps) {
	//should return sSpoken,sWritten,piclist and set Goal
	let props = { label: { vals: getDistinctVals(allPics, 'label'), friendly: '' } };
	if (G.numColors > 1) props.colorKey = { vals: getDistinctVals(allPics, 'colorKey'), friendly: 'color' };
	if (G.numRepeat > 1) props.iRepeat = { vals: getDistinctVals(allPics, 'iRepeat'), friendly: 'number' };

	//console.log('props:::::', Object.keys(props), '\nexcept', exceptProps);
	if (sameList(Object.keys(props), exceptProps)) return ['no props left', 'no', [], 'unknown'];
	//console.log('props', props)

	//level 0: eliminate all backpacks | eliminate all with color=blue | elim all w/ number=2
	let lstSpoken, lstWritten, piclist = [];
	let prop = chooseRandom(arrWithout(Object.keys(props), exceptProps));
	//console.log('prop is', prop, 'vals', props[prop].vals)
	let val = chooseRandom(props[prop].vals);
	//console.log('val chosen', val)
	//val = chooseRandom(myProps[prop])
	//prop = 'iRepeat'; val = 2;

	lstSpoken = [];
	if (prop == 'label') {
		lstSpoken.push(val);// + (Settings.language == 'E' ? 's' : ''));
		lstWritten = [labelPrepper(val)];
		piclist = allPics.filter(x => x.label == val);
	} else if (prop == 'colorKey') {
		lstSpoken = lstSpoken.concat(['with', props[prop].friendly, ColorDict[val][Settings.language]]);
		lstWritten = ['with', props[prop].friendly, colorPrepper(val)];
		piclist = allPics.filter(x => x[prop] == val);
	} else if (prop == 'iRepeat') {
		let op = (G.numRepeat > 2 && val > 1 && val < G.numRepeat) ? chooseRandom(['leq', 'geq', 'eq']) : chooseRandom(['eq', 'neq']);
		//op = '!=';
		let oop = OPS[op];
		lstSpoken = lstSpoken.concat(['with', props[prop].friendly, oop.sp, val]);
		lstWritten = ['with', props[prop].friendly, oop.wr, val];

		piclist = allPics.filter(x => oop.f(x[prop], val));

	}
	//console.log(lstSpoken)

	if (nundef(lstWritten)) lstWritten = lstSpoken;
	let s = lstSpoken.join(' ');
	let w = lstWritten.join(' ');
	// console.log('w',w)
	if (Settings.language == 'D') {
		// let x=s.split(' ');
		// console.log(x)
		s = s.split(' ').map(x => translateToGerman(x)).join(' ');
		w = w.split(' ').map(x => translateToGerman(x)).join(' ');
		// lstSpoken = lstSpoken.map(x => DD[x]);
		// lstWritten = lstWritten.map(x => DD[x]);
	}
	//console.log('s', s, '\nw', w)
	return [s, w, piclist, prop];

}

function logicSetSelector(allPics) {
	//should return sSpoken,sWritten,piclist and set Goal
	let props = { label: { vals: getDistinctVals(allPics, 'label'), friendly: '' } };
	if (G.numColors > 1) props.colorKey = { vals: getDistinctVals(allPics, 'colorKey'), friendly: 'color' };
	if (G.numRepeat > 1) props.iRepeat = { vals: getDistinctVals(allPics, 'iRepeat'), friendly: 'number' };

	//console.log('props', props)

	//level 0: eliminate all backpacks | eliminate all with color=blue | elim all w/ number=2
	let lstSpoken, lstWritten, piclist = [];
	if (G.level >= 0) {
		let prop = chooseRandom(Object.keys(props));
		//console.log('prop is', prop, 'vals', props[prop].vals)
		let val = chooseRandom(props[prop].vals);
		//console.log('val chosen', val)
		//val = chooseRandom(myProps[prop])
		prop = 'iRepeat'; val = 2;

		lstSpoken = ['eliminate', 'all'];
		if (prop == 'label') {
			lstSpoken.push(val);// + (Settings.language == 'E' ? 's' : ''));
			lstWritten = ['eliminate', 'all', labelPrepper(val)];
			piclist = allPics.filter(x => x.label == val);
		} else if (prop == 'colorKey') {
			lstSpoken = lstSpoken.concat(['with', props[prop].friendly, val]);
			lstWritten = ['eliminate', 'all', 'with', props[prop].friendly, colorPrepper(val)];
			piclist = allPics.filter(x => x[prop] == val);
		} else if (prop == 'iRepeat') {
			let op = (G.numRepeat > 2 && val > 1 && val < G.numRepeat) ? chooseRandom(['leq', 'geq', 'eq']) : chooseRandom(['eq', 'neq']);
			//op = '!=';
			let oop = OPS[op];
			lstSpoken = lstSpoken.concat(['with', props[prop].friendly, oop.sp, val]);
			lstWritten = ['eliminate', 'all', 'with', props[prop].friendly, oop.wr, val];

			piclist = allPics.filter(x => oop.f(x[prop], val));

		}
		//console.log(lstSpoken)
	}

	if (G.level > 0 && piclist.length > allPics.length / 2) {
		//lstSpoken.insert('except',2)
		lstSpoken.splice(2, 0, 'except');
		lstWritten.splice(2, 0, 'EXCEPT');
		piclist = allPics.filter(x => !(piclist.includes(x)));
	}

	if (nundef(lstWritten)) lstWritten = lstSpoken;
	let s = lstSpoken.join(' ');
	let w = lstWritten.join(' ');
	// console.log('w',w)
	if (Settings.language == 'D') {
		// let x=s.split(' ');
		// console.log(x)
		s = s.split(' ').map(x => translateToGerman(x)).join(' ');
		w = w.split(' ').map(x => translateToGerman(x)).join(' ');
		// lstSpoken = lstSpoken.map(x => DD[x]);
		// lstWritten = lstWritten.map(x => DD[x]);
	}
	console.log('s', s, '\nw', w)
	return [s, w, piclist];

}
function colorPrepper(val) {

	return `<span style="color:${ColorDict[val].c}">${ColorDict[val][Settings.language].toUpperCase()}</span>`;
}
function labelPrepper(val) { return `<b>${val.toUpperCase()}</b>`; }
function logicCheck(pic) {
	//should return true if pic is part of set to be clicked and remove that pic
	//return false if that pic does NOT belong to piclist
}
function logicReset() {
	//resets piclist;
}
//#endregion

function showPictures00(onClickPictureHandler, { showRepeat = false, sz, bgs, colorKeys, contrast, repeat = 1,
	sameBackground = true, border, textColor, fz = 20 } = {}, keys, labels) {
	Pictures = [];
	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	//keys=['eye'];//['toolbox','tiger']; //keys[0] = 'butterfly'; //keys[0]='man in manual wheelchair';	//keys=['sun with face'];

	//let func=zShowPictures1;
	//let func=maShowPictures;
	let options = arguments[1];
	console.log('options', options);

	//ok wenn hier bin habe keys,dParent,options,ifs
	//muss unterscheiden bei allen options params ob es eigentlich options oder ifs ist!


	Pictures = zShowPictures1(keys, labels, dTable, onClickPictureHandler,
		{
			showRepeat: showRepeat, picSize: sz, bgs: bgs, repeat: repeat, sameBackground: sameBackground, border: border,
			lang: Settings.language, colorKeys: colorKeys, contrast: contrast
		});

	// label hiding
	let totalPics = Pictures.length;
	if (nundef(Settings.labels) || Settings.labels) {
		if (G.numLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - G.numLabels);
		for (const p of remlabelPic) {
			//console.log('hi1');
			maHideLabel(p.id, p.info); p.isLabelVisible = false;
		}
	} else {
		for (const p of Pictures) {
			//console.log('hi1');
			maHideLabel(p.id, p.info); p.isLabelVisible = false;
		}

	}

}




//#region card face up or down
function turnFaceDown(pic) {
	let ui = pic.div;
	for (const p1 of ui.children) p1.style.opacity = 0; //hide(p1);
	ui.style.backgroundColor = 'dimgray';
	pic.isFaceUp = false;

}
function turnFaceUp(pic) {
	let div = pic.div;
	for (const ch of div.children) {
		ch.style.transition = `opacity ${1}s ease-in-out`;
		ch.style.opacity = 1; //show(ch,true);
		if (!pic.isLabelVisible) break;
	}
	div.style.transition = null;
	div.style.backgroundColor = pic.bg;
	pic.isFaceUp = true;
}
function toggleFace(pic) { if (pic.isFaceUp) turnFaceDown(pic); else turnFaceUp(pic); }

//#region selection of picture
function toggleSelectionOfPicture(pic, selectedPics) {
	let ui = pic.div;
	//if (pic.isSelected){pic.isSelected=false;mRemoveClass(ui,)}
	pic.isSelected = !pic.isSelected;
	if (pic.isSelected) mClass(ui, 'framedPicture'); else mRemoveClass(ui, 'framedPicture');

	//if piclist is given, add or remove pic according to selection state
	if (isdef(selectedPics)) {
		if (pic.isSelected) {
			console.assert(!selectedPics.includes(pic), 'UNSELECTED PIC IN PICLIST!!!!!!!!!!!!')
			selectedPics.push(pic);
		} else {
			console.assert(selectedPics.includes(pic), 'PIC NOT IN PICLIST BUT HAS BEEN SELECTED!!!!!!!!!!!!')
			removeInPlace(selectedPics, pic);
		}
	}
}























