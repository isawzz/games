
function zGrid(elems, dParent) {

	let dGrid = mDiv(dParent);
	elems.map(x => mAppend(dGrid, x.div));

	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let size = layoutGrid(elems, dGrid, gridStyles, { rows: 10, isInline: true });
	return size;
}
function zItems(keys, labelFunc, { sz, padding = 4 }, iStart = 0) {
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
function zPic(key, dParent, styles = {}, isText = true, isOmoji = false) {
	let w = styles.w, h = styles.h, padding = styles.padding, hpadding = styles.hpadding, wpadding = styles.wpadding;
	if (isdef(styles.sz)) {
		if (nundef(w)) w = styles.sz;
		if (nundef(h)) h = styles.sz;
	}
	let stylesNew = jsCopy(styles);
	if (isdef(w)) {
		if (isdef(padding)) { w -= 2 * padding; }//stylesNew.padding=0;}
		else if (isdef(wpadding)) { w -= 2 * wpadding; }//stylesNew.wpadding=0;}
		stylesNew.w = w;
	}
	if (isdef(h)) {
		if (isdef(padding)) { h -= 2 * padding; }//stylesNew.padding=0;}
		else if (isdef(hpadding)) { h -= 2 * hpadding; }//stylesNew.hpadding=0;}
		stylesNew.h = h;
	}
	// console.log('old',styles)
	// console.log('new:',stylesNew)
	return _zPicPaddingAddedToSize(key, dParent, stylesNew, isText, isOmoji);
}
function zText(text, dParent, textStyles, hText, vCenter = false) {
	let tSize = getSizeWithStyles(text, textStyles);


	let extra = 0, lines = 1;
	if (isdef(hText)) {
		extra = hText - tSize.h;
		if (textStyles.fz) lines = Math.floor(tSize.h / textStyles.fz);
	}
	// if (extra > 0 && vCenter) {
	// 	textStyles.paddingTop = extra / 2;
	// 	textStyles.h = hText;
	// 	// dText.style.paddingTop = (extra/2) +'px';
	// }
	console.log('', text, extra, 'lines:' + lines, textStyles);
	let dText = isdef(text) ? mText(text, dParent, textStyles) : mDiv(dParent);
	if (extra > 0 && vCenter) {
		dText.style.paddingTop = (extra / 2)+'px';
		dText.style.paddingBottom = (extra / 2)+'px';
		// dText.style.paddingTop = (extra/2) +'px';
	}
	console.log(dText);
	return { text: text, div: dText, extra: extra, lines: lines, h: tSize.h, w: tSize.w, fz: textStyles.fz };
	//return mText(text, dParent, styles); 
}
function zViewer(keys) {
	onclick = zView100;
	IconSet = isdef(keys) ? keys : symKeysBySet['nosymbols'];
	lastIndex = 0;
	Pictures = [];

	zView100();
}
function zView100() {	//assumes a div id='table'

	let N = 100;
	if (lastIndex >= IconSet.length) {
		console.log('NO MORE KEYS!!!!!');
		return;
	}

	let table = mBy('table');
	clearElement(table);
	// mButton('download key set', downloadKeySet, table, { fz: 30 });

	console.log('pics', lastIndex, 'to', lastIndex + N)
	let keys = takeFromTo(IconSet, lastIndex, lastIndex + N);//chooseRandom() ['keycap: 0', 'keycap: 1', 'keycap: #', 'keycap: *'];
	//console.log(keys);
	Pictures = zItems(keys, (k, info) => (k + ' ' + info.h[0]), { sz: 50 }, lastIndex);//, (k, info) => k + ' ' + info.h[0]);
	//Pictures = zItems00(keys,  (k, info) => (k + ' ' + info.h[0]), { sz: 50 });//, (k, info) => k + ' ' + info.h[0]);
	// Pictures = zItems01(keys,  { sz: 50 }, (k, info) => k + ' ' + info.h[0]);
	//console.log(Pictures);
	let szFinal = zGrid(Pictures, table);
	lastIndex += N;

	console.log('sizeOfGrid:', szFinal);
	console.log('pic0', Pictures[0]);

}



