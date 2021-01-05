function zViewer(keys) {
	onclick = zView100;
	IconSet = isdef(keys) ? keys : symKeysBySet['nosymbols'];
	lastIndex = 0;
	Pictures = [];

	zView100();
}
function zView100() {	//assumes a div id='table'
	let table = mBy('table');
	clearElement(table);
	// mButton('download key set', downloadKeySet, table, { fz: 30 });

	let keys = takeFromTo(IconSet, lastIndex, lastIndex + 100);//chooseRandom() ['keycap: 0', 'keycap: 1', 'keycap: #', 'keycap: *'];
	//console.log(keys);
	Pictures = zItems(keys, 100, (k, info) => k + ' ' + info.h[0]);
	//console.log(Pictures);
	zGrid(Pictures, table);

}
function zText(text, styles) { return mText(text, null, styles); }
function idealFontsize(keys, wmax, hmax, labelFunc, fz, fzmin) {

	let infos = [];
	let maxlen = 0, longestText = '';
	for (const k of keys) {
		let info = symbolDict[k];
		let label = labelFunc(k, info);
		let tlen = label.length;
		if (tlen > maxlen) { maxlen = tlen; longestText = label; }
		infos.push({ info: info, label: label, key: k, tlen: tlen });
	}


	let tStyles = { w: wmax, fz: fz, family: 'arial' };
	let txt = longestText;
	let done = false;
	while (!done) {
		console.log('trying fz', tStyles, txt);
		let tSize = getSizeWithStyles(txt, tStyles);
		if (tSize.h <= hmax || tStyles.fz <= fzmin) return { w: tSize.w, h: tSize.h, fz: tStyles.fz, infos: infos };
		else tStyles.fz -= 1;
	}

}
function zItems(keys, sz, labelFunc) {
	// let styles = labeled ? getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true)
	// 	: getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', false);

	sz = isdef(sz) ? sz : 100;
	let labeled = isdef(labelFunc);

	//als erstes das label produzieren und checken wieviel platz es braucht
	let res = { w: 0, h: 0, fz: 0, infos: keys.map(x => ({ info: symbolDict[x], label: '', key: x, tlen: 0 })) };
	if (labeled) {
		res = idealFontsize(keys, sz, sz / 2, labelFunc, 20, 10);
		console.log(res);
	}

	//res.h is size needed for text
	let hText=res.h;
	let hPic = sz-hText;

	let pictureSize = hPic;
	let isText = true;
	let isOmoji = false;
	let picStyles = { w: pictureSize, h: pictureSize, bg: 'white', fg: 'random' };

	let textSize = { fz: res.fz, w: sz };
	let textStyles = deepmergeOverride(textSize, { bg: 'white', fg: 'random' });

	let outerStyles = { w: sz, h: sz, bg: 'white', align: 'center' };


	let elems = [];
	// let stylesForLabelButton = { rounding: 10, margin: totalSize / 8 };

	for (const k of keys) {
		let info = symbolDict[k];
		let label = info.type == 'emo' ? (isdef(info.bestE) ? info.bestE : lastOfLanguage(k, 'E')) + ' ' + lastIndex : k;
		let pic = zPic(k, null, picStyles, true, false);

		//wenn es labeled ist, mach den text auch noch: restHeight,font should fit
		let dText = labeled ? zText(labelFunc(k, info), textStyles) : mDiv();

		let el = mDiv();
		mAppend(el, pic.div);
		mAppend(el, dText);

		//add height of pic + height of text

		mStyleX(el, outerStyles);

		let res = pic;
		res.div = el;

		// let el = labeled ? maPicLabelButtonFitText(info, label,
		// 	{ w: pictureSize, h: pictureSize, bgPic: 'random', shade: null, contrast: null },
		// 	onClickIVPicture, dGrid, stylesForLabelButton, 'frameOnHover', isText, isOmoji)
		// 	: pic;
		// let res = labeled ? { div: el } : el;
		let div = res.div;
		div.id = 'pic' + lastIndex;
		elems.push(res);
		res.info = info; res.label = label; res.isSelected = false;
		// Pictures.push(res);
		lastIndex += 1;
	}
	return elems;
}
function zGrid(elems, dParent) {

	let dGrid = mDiv(dParent);
	elems.map(x => mAppend(dGrid, x.div));

	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let size = layoutGrid(elems, dGrid, gridStyles, { rows: 10, isInline: true });
}



function zItems00(keys, labelFunc) {
	// let styles = labeled ? getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true)
	// 	: getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', false);

	let labeled = isdef(labelFunc);
	let totalSize = 100;
	let pictureSize = Math.round(labeled ? totalSize * .65 : totalSize * .35);
	let isText = true;
	let isOmoji = false;
	let picStyles = { w: pictureSize, h: pictureSize, bg: 'white', fg: 'random' };

	let textSize = { w: totalSize, h: totalSize - pictureSize };
	let textStyles = deepmergeOverride(textSize, { bg: 'white', fg: 'random' });

	let outerStyles = { w: totalSize, h: totalSize, bg: 'white', align: 'center' };


	let elems = [];
	// let stylesForLabelButton = { rounding: 10, margin: totalSize / 8 };

	for (const k of keys) {
		let info = symbolDict[k];
		let label = info.type == 'emo' ? (isdef(info.bestE) ? info.bestE : lastOfLanguage(k, 'E')) + ' ' + lastIndex : k;
		let pic = zPic(k, null, picStyles, true, false);

		//wenn es labeled ist, mach den text auch noch: restHeight,font should fit
		let dText = labeled ? zText(labelFunc(k, info), textStyles) : mDiv();

		let el = mDiv();
		mAppend(el, pic.div);
		mAppend(el, dText);
		mStyleX(el, outerStyles);

		let res = pic;
		res.div = el;

		// let el = labeled ? maPicLabelButtonFitText(info, label,
		// 	{ w: pictureSize, h: pictureSize, bgPic: 'random', shade: null, contrast: null },
		// 	onClickIVPicture, dGrid, stylesForLabelButton, 'frameOnHover', isText, isOmoji)
		// 	: pic;
		// let res = labeled ? { div: el } : el;
		let div = res.div;
		div.id = 'pic' + lastIndex;
		elems.push(res);
		res.info = info; res.label = label; res.isSelected = false;
		// Pictures.push(res);
		lastIndex += 1;
	}
	return elems;
}
