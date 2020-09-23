//uses assets! =>load after assets!
var cachedInfolists = {};

//#region layouts
function layoutGrid(elist, dGrid, containerStyles, { rows, cols, isInline = false } = {}) {
	//console.log(elist, elist.length)
	let dims = calcRowsCols(elist.length, rows, cols);
	//console.log('dims', dims);

	let parentStyle = jsCopy(containerStyles);
	parentStyle.display = isInline ? 'inline-grid' : 'grid';
	parentStyle['grid-template-columns'] = `repeat(${dims.cols}, auto)`;
	parentStyle['box-sizing'] = 'border-box'; // TODO: koennte ev problematisch sein, leave for now!

	//console.log('parentStyle', parentStyle)

	mStyleX(dGrid, parentStyle);
	let b = getBounds(dGrid);
	return { w: b.width, h: b.height };

}
function layoutFlex(elist, dGrid, containerStyles, { rows, cols, isInline = false } = {}) {
	console.log(elist, elist.length)
	let dims = calcRowsCols(elist.length, rows, cols);
	console.log('dims', dims);

	let parentStyle = jsCopy(containerStyles);
	if (containerStyles.orientation == 'v') {
		// console.log('vertical!');
		// parentStyle['flex-flow']='row wrap';
		parentStyle['writing-mode'] = 'vertical-lr';
	}
	parentStyle.display = 'flex';
	parentStyle.flex = '0 0 auto';
	parentStyle['flex-wrap'] = 'wrap';
	// parentStyle['box-sizing'] = 'border-box'; // TODO: koennte ev problematisch sein, leave for now!

	mStyleX(dGrid, parentStyle);
	let b = getBounds(dGrid);
	return { w: b.width, h: b.height };

}


//#region maPic
function maPic(infokey, dParent, styles, isText = true, isOmoji = false) {

	let info = isString(infokey) ? picInfo(infokey) : infokey;
	//console.log(infokey)
	//console.log('isText', isText, 'isOmoji', isOmoji);

	// as img
	if (!isText && info.type == 'emo') {

		//ensureSvgDict(); geht NICHT weil ja awaited werden muss!!!!!!!

		let dir = isOmoji ? 'openmoji' : 'twemoji';
		let hex = info.hexcode;
		if (isOmoji && hex.indexOf('-') == 2) hex = '00' + hex;
		let ui = mImg('/assets/svg/' + dir + '/' + hex + '.svg', dParent);
		if (isdef(styles)) mStyleX(ui, styles);
		return ui;
	}

	// as text
	let outerStyles = isdef(styles) ? jsCopy(styles) : {};
	outerStyles.display = 'inline-block';
	let family = info.type == 'emo' && isString(isOmoji) ? isOmoji : isOmoji == true ? 'emoOpen' : info.family;

	// let i = (family == info.family) ? 0 : EMOFONTLIST.indexOf(family)+1;
	// console.log('i is', i,'\n',info.w,'\n',info.family,'\n',family,'\n',EMOFONTLIST)

	// let iwInfo = (family == info.family) ? 0 : info.w.indexOf(family);
	let i = (family == info.family) ? 0 : EMOFONTLIST.indexOf(family) + 1;
	if (i < 0) {
		i = 1; console.log('iiiiiii', i, family, info.family);
	}
	let wInfo = info.w[i];
	// let ihInfo = (family == info.family) ? 0 : info.h.indexOf(family);
	let hInfo = info.h[i];

	// console.log('family', family, 'orig', info.family)
	let innerStyles = { family: family };
	let [padw, padh] = isdef(styles.padding) ? [styles.padding, styles.padding] : [0, 0];

	let dOuter = mDiv(dParent);
	let d = mDiv(dOuter);
	d.innerHTML = info.text;

	let wdes, hdes, fzdes, wreal, hreal, fzreal, f;


	if (isdef(styles.w) && isdef(styles.h) && isdef(styles.fz)) {
		[wdes, hdes, fzdes] = [styles.w, styles.h, styles.fz];
		let fw = wdes / wInfo;
		let fh = hdes / hInfo;
		let ffz = fzdes / info.fz;
		f = Math.min(fw, fh, ffz);
	} else if (isdef(styles.w) && isdef(styles.h)) {
		[wdes, hdes] = [styles.w, styles.h];
		let fw = wdes / wInfo;
		let fh = hdes / hInfo;
		f = Math.min(fw, fh);
	} else if (isdef(styles.w) && isdef(styles.fz)) {
		[wdes, fzdes] = [styles.w, styles.fz];
		let fw = wdes / wInfo;
		let ffz = fzdes / info.fz;
		f = Math.min(fw, ffz);
	} else if (isdef(styles.h) && isdef(styles.fz)) {
		[hdes, fzdes] = [styles.h, styles.fz];
		let fh = hdes / hInfo;
		let ffz = fzdes / info.fz;
		f = Math.min(fh, ffz);
	} else if (isdef(styles.h)) {
		hdes = styles.h;
		f = hdes / hInfo;
	} else if (isdef(styles.w)) {
		wdes = styles.w;
		f = wdes / wInfo;
		// } else if (isdef(styles.fz)) {
		// 	fzdes = styles.fz;
		// 	f = fzdes / info.fz;
	} else {
		mStyleX(d, innerStyles);
		mStyleX(dOuter, outerStyles);
		return dOuter;
	}
	fzreal = f * info.fz;
	wreal = f * wInfo;
	hreal = f * hInfo;
	padw += isdef(styles.w) ? (wdes - wreal) / 2 : 0;
	padh += isdef(styles.h) ? (hdes - hreal) / 2 : 0;
	console.log('====>>>>', family, '\nw.info', wInfo, '\nh.info', hInfo, '\nfactor', f, '\nw', wreal, '\nh', hreal);

	if (!(padw >= 0 && padh >= 0)) {
		console.log(info)
	}
	console.assert(padw >= 0 && padh >= 0, 'BERECHNUNG FALSCH!!!!', padw, padh, info, '\ninfokey', infokey);
	//console.log('fzreal', fzreal, 'wreal', wreal, 'hreal', hreal, 'padw', padw, 'padh', padh);

	innerStyles.fz = fzreal;
	innerStyles.weight = 900;
	innerStyles.w = wreal;
	innerStyles.h = hreal;
	mStyleX(d, innerStyles);

	outerStyles.padding = '' + padh + 'px ' + padw + 'px';
	outerStyles.w = wreal;
	outerStyles.h = hreal;
	//console.log(outerStyles)
	mStyleX(dOuter, outerStyles);

	return dOuter;

}
function maPicSimple(key) {
	let info = picInfo(key);
	let d = mText(info.text);
	d.style.setProperty('font-family', info.family);
	return d;
}
function maPicButton(key, handler, dParent, styles, classColors = 'picButton') {
	let x = maPic(key, dParent, styles);
	if (isdef(handler)) x.onclick = handler;
	mClass(x, classColors);
	return x;
}
function maPicSimpleEmoHexText(hex, parent, fontSize) {
	if (isString(parent)) parent = mBy(parent);
	let d = mDiv(parent);
	let s1 = '&#' + hex + ';'; //'\u{1F436}';
	d.innerHTML = s1;
	d.style.fontSize = fontSize + 'pt';
	return d;
}
function getHarmoniousStylesXX(w, h, padding, family, bg = 'blue', fg = 'random', hasText = true) {
	let numbers = hasText ? [15, 55, 0, 20, 10] : [15, 70, 0, 0, 15];
	numbers = numbers.map(x => h * x / 100);
	[patop, szPic, zwischen, szText, pabot] = numbers;
	patop = Math.max(patop, padding);
	pabot = Math.max(pabot, padding);

	// console.log(patop, szPic, zwischen, szText, pabot);
	let styles = { h: h, bg: bg, fg: 'contrast', patop: patop, pabottom: pabot, align: 'center', 'box-sizing': 'border-box' };
	let textStyles = { family: family, fz: Math.floor(szText * 3 / 4) };
	let picStyles = { h: szPic, bg: fg };
	if (w > 0) styles.w = w; else styles.paleft = styles.paright = Math.max(padding, 4);
	return [styles, picStyles, textStyles];
}
function getHarmoniousStylesX(sz, family, bg = 'blue', fg = 'random', hasText = true, setWidth = false) {
	let numbers = hasText ? [15, 55, 0, 20, 10] : [15, 70, 0, 0, 15];
	numbers = numbers.map(x => sz * x / 100);
	[patop, szPic, zwischen, szText, pabot] = numbers;

	console.log(patop, szPic, zwischen, szText, pabot);
	let styles = { h: sz, bg: bg, fg: 'contrast', patop: patop, pabottom: pabot, align: 'center', 'box-sizing': 'border-box' };
	let textStyles = { family: family, fz: Math.floor(szText * 3 / 4) };
	let picStyles = { h: szPic, bg: fg };
	if (setWidth) styles.w = sz; else styles.paleft = styles.paright = 4;
	return [styles, picStyles, textStyles];
}
function getHarmoniousStyles(sz, family, bg = 'blue', fg = 'random', hasText = true) {
	let fpic = 2 / 3; let ffont = 1 / 8; let ftop = 1 / 9; let fbot = 1 / 12;
	let styles = { w: sz, h: sz, bg: bg, fg: 'contrast', patop: sz * ftop, pabottom: sz * fbot, align: 'center', 'box-sizing': 'border-box' };
	let textStyles = { family: family, fz: Math.floor(sz * ffont) };
	let picStyles = { h: sz * fpic, bg: fg };
	return [styles, picStyles, textStyles];
}
function getSimpleStyles(sz, family, bg, fg) {
	let styles = { bg: bg, fg: 'contrast', align: 'center', 'box-sizing': 'border-box', padding: 4, margin: 2 };
	let textStyles = { family: family };
	let picStyles = { w: sz, h: sz, bg: fg };
	return [styles, picStyles, textStyles];
}

function maPicLabel(info, dParent, containerStyles, picStyles, textStyles, isText = true, isOmoji = false) {
	let d = mDiv(dParent);
	maPic(info, d, picStyles, isText, isOmoji);
	// mText(info.annotation, d, textStyles, ['truncate']);
	mText(info.annotation, d, textStyles, ['might-overflow']);
	mStyleX(d, containerStyles);
	return d;
}
function maPicFrame(info, dParent, containerStyles, picStyles, isText = true, isOmoji = false) {
	let d = mDiv(dParent);
	maPic(info, d, picStyles, isText, isOmoji);
	mStyleX(d, containerStyles);
	return d;
}
function maPic4(info, dParent, styles) {
	//uses svgDict! and symBySet
	mStyleX(dParent, { display: 'flex', 'flex-flow': 'row wrap' });
	//let info = picInfo(key);
	maPic(info, table, styles, true);
	maPic(info, table, styles, true, 'segoe ui emoji');
	maPic(info, table, styles, false);
	maPic(info, table, styles, false, true);
	mLinebreak(table);


}
function maPicLabel_dep(info, dParent, styles, isText = true, isOmoji = false) {
	//info, dParent, styles, isText = true, isOmoji = false) {
	let d = mDiv(dParent, { bg: 'random', fg: 'contrast', padding: 4, margin: 2 });//mStyleX(d,{align:'center'})
	maPic(info, d, styles, isText, isOmoji);
	mText(info.annotation, d);
	d.style.textAlign = 'center';
	return d;
}

//#region pic helpers
function picInfo(key) {
	//#region doc 
	/*	
usage: info = picInfo('red heart');

key ... string or hex key or keywords (=>in latter case will perform picSearch and return random info from result)

returns info
	*/
	//#endregion 
	if (isdef(symbolDict[key])) return symbolDict[key];
	else {
		ensureSymByHex();
		let info = symByHex[key];
		if (isdef(info)) { return info; }
		else {
			let infolist = picSearch({ keywords: key });
			//console.log('result from picSearch(' + key + ')', infolist);
			if (infolist.length == 0) return null;
			else return chooseRandom(infolist);
		}
	}
}
function picRandom(type, keywords, n = 1) {
	let infolist = picSearch({ type: type, keywords: keywords });
	//console.log(infolist)
	return n == 1 ? chooseRandom(infolist) : choose(infolist, n);
}
function picSearch({ keywords, type, func, set, group, subgroup, props, isAnd, justCompleteWords }) {
	//#region doc 
	/*	
usage: ilist = picSearch({ type: 'all', func: (d, kw) => allCondX(d, x => /^a\w*r$/.test(x.key)) });

keywords ... list of strings or just 1 string  =>TODO: allow * wildcards!
type ... E [all,eduplo,iduplo,emo,icon] =>dict will be made from that!
func ... (dict,keywords) => infolist

>the following params are used to select one of standard filter functions (see helpers region filter functions)
props ... list of properties to match with filter function
isAnd ... all keywords must match in filter function
justCompleteWords ... matches have to be complete words

returns list of info
	*/
	//#endregion 

	if (isdef(set)) ensureSymBySet();

	if (isdef(type) && type != 'all') ensureSymByType();

	//if (type == 'icon') console.log(symByType,'\n=>list',symListByType)

	let [dict, list] = isdef(set) ? [symBySet[set], symListBySet[set]]
		: nundef(type) || type == 'all' ? [symbolDict, symbolList] : [symByType[type], symListByType[type]];

	//console.log(dict);

	//console.log('_____________',keywords,type,dict,func)
	//if (nundef(keywords)) return isdef(func) ? func(dict) : dict2list(dict);
	if (set == 'role' && firstCond(dict2list(dict), x => x.id == 'rotate')) console.log('===>', symBySet[set], dict, dict2list(dict));

	if (nundef(keywords)) return isdef(func) ? func(dict) : list;
	if (!isList(keywords)) keywords = [keywords];
	if (isString(props)) props = [props];

	let infolist = [];
	if (isList(props)) {
		if (isAnd) {
			if (justCompleteWords) {
				infolist = allWordsContainedInPropsAsWord(dict, keywords, props);
			} else {
				infolist = allWordsContainedInProps(dict, keywords, props);
			}
		} else {
			if (justCompleteWords) {
				infolist = anyWordContainedInPropsAsWord(dict, keywords, props);
			} else {
				infolist = anyWordContainedInProps(dict, keywords, props);
			}
		}
	} else if (nundef(props) && nundef(func)) {
		if (isAnd) {
			if (justCompleteWords) {
				infolist = allWordsContainedInKeysAsWord(dict, keywords);
			} else {
				infolist = allWordsContainedInKeys(dict, keywords);
			}
		} else {
			if (justCompleteWords) {
				infolist = anyWordContainedInKeysAsWord(dict, keywords);
			} else {
				infolist = anyWordContainedInKeys(dict, keywords);
			}
		}
	} else if (isdef(func)) {
		//propList is a function!
		//console.log('calling func',dict,keywords)
		infolist = func(dict, keywords);
	}
	return infolist;
}
function picSet(setname) {
	//if no key is give, just get a random pic from this set
	ensureSymBySet();
	return chooseRandom(symListBySet[setname]);
	// if (isdef(key)) {
	// 	if (isdef(symBySet[setname][key])) return symbolDict[key];
	// 	else return picSearch({ set: setname, keywords: [key] });
	// } else return chooseRandom(symListBySet[name]);
}
// function picRandomSet(setname){
// 	//#region doc 
// 	/*	
// usage: ilist = picRandomSet('animal');

// setname ... see assets/emoSets, assumes a valid setname

// returns info
// 	*/
// 	//#endregion 

// 	ensureSymBySet();
// 	setname = setname.toLowerCase();
// 	//console.log(symBySet,symKeysBySet,setname,symKeysBySet[setname])
// 	return symBySet[setname][chooseRandom(symKeysBySet[setname])];
// }

//#region helpers









