//uses assets! =>load after assets!
var cachedInfolists = {};

//#region maPic
function maPic(infokey, dParent, styles, isText = true, isOmoji = false) {

	let info = isString(infokey) ? picInfo(infokey) : infokey;

	// as img
	if (!isText && info.type == 'emo') {
		let dir = isOmoji ? 'openmoji' : 'twemoji';
		let ui = mImg('/assets/svg/' + dir + '/' + info.hexcode + '.svg', dParent);
		if (isdef(styles)) mStyleX(ui, styles);
		return ui;
	}

	// as text
	let outerStyles = isdef(styles) ? jsCopy(styles) : {};
	outerStyles.display = 'inline-block';
	let innerStyles = { family: info.family };
	let [padw, padh] = isdef(styles.padding) ? [styles.padding, styles.padding] : [0, 0];

	let dOuter = mDiv(dParent);
	let d = mDiv(dOuter);
	d.innerHTML = info.text;

	let wdes, hdes, fzdes, wreal, hreal, fzreal, f;

	if (isdef(styles.w) && isdef(styles.h) && isdef(styles.fz)) {
		[wdes, hdes, fzdes] = [styles.w, styles.h, styles.fz];
		let fw = wdes / info.w;
		let fh = hdes / info.h;
		let ffz = fzdes / info.fz;
		f = Math.min(fw, fh, ffz);
	} else if (isdef(styles.w) && isdef(styles.h)) {
		[wdes, hdes] = [styles.w, styles.h];
		let fw = wdes / info.w;
		let fh = hdes / info.h;
		f = Math.min(fw, fh);
	} else if (isdef(styles.w) && isdef(styles.fz)) {
		[wdes, fzdes] = [styles.w, styles.fz];
		let fw = wdes / info.w;
		let ffz = fzdes / info.fz;
		f = Math.min(fw, ffz);
	} else if (isdef(styles.h) && isdef(styles.fz)) {
		[hdes, fzdes] = [styles.h, styles.fz];
		let fh = hdes / info.h;
		let ffz = fzdes / info.fz;
		f = Math.min(fh, ffz);
	} else if (isdef(styles.h)) {
		hdes = styles.h;
		f = hdes / info.h;
	} else if (isdef(styles.w)) {
		wdes = styles.w;
		f = wdes / info.w;
	} else if (isdef(styles.fz)) {
		fzdes = styles.fz;
		f = fzdes / info.fz;
	}
	fzreal = f * info.fz;
	wreal = f * info.w;
	hreal = f * info.h;
	padw += isdef(styles.w) ? (wdes - wreal) / 2 : 0;
	padh += isdef(styles.h) ? (hdes - hreal) / 2 : 0;

	if (!(padw >= 0 && padh >= 0)){
		console.log(info)
	}
	console.assert(padw >= 0 && padh >= 0, 'BERECHNUNG FALSCH!!!!',padw,padh,info, '\ninfokey',infokey)

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
	else if (isdef(symByHex) && isdef(symByHex[key])) return symbolDict[symByHex[key]];
	else {
		let infolist = picSearch({ keywords: key });
		//console.log('result from picSearch(' + key + ')', infolist);
		if (infolist.length == 0) return null;
		else return chooseRandom(infolist);
	}
}
function picRandom(type, keywords) {
	let infolist = picSearch({ type: type, keywords: keywords });
	//console.log(infolist)
	return chooseRandom(infolist);
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

	let [dict, list] = isdef(set) ? [symBySet[set], symListBySet[set]]
		: nundef(type) || type == 'all' ? [symbolDict, symbolList] : [symByType[type], symListByType[type]];

	//console.log(dict);

	//console.log('_____________',keywords,type,dict,func)
	//if (nundef(keywords)) return isdef(func) ? func(dict) : dict2list(dict);
	if (set=='role' && firstCond(dict2list(dict),x=>x.id=='rotate')) console.log('===>',symBySet[set],dict,dict2list(dict));

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

//#region aus helpers alte pic buttons!
function maPicButton(key, handler, dParent, styles, classes) {
	let x = createPicto({
		key: key, w: 20, h: 20, unit: 'px', fg: 'yellow', bg: 'violet',
		padding: 2, margin: 0, cat: 'd', parent: dParent, rounding: 4
	});
	//return x;
	// let x = mCreate('button');
	// x.innerHTML = caption;
	if (isdef(handler)) x.onclick = handler;
	// if (isdef(dParent)) dParent.appendChild(x);
	if (isdef(styles)) {
		//console.log('style of picButton', styles)
		mStyle(x, styles);
		//mClass(dParent,'vCentered')
	}
	if (isdef(classes)) { mClass(x, ...classes); }
	else mClass(x, 'picButton');
	return x;
}
function maPicButtonSimple(key, handler, dParent, styles, classes) {
	let x = maPic(key,dParent,styles); 
	if (isdef(handler)) x.onclick = handler;
	if (isdef(classes)) { mClass(x, ...classes); } //achtung!
	else mClass(x, 'picButton');
	return x;
}
//#endregion












