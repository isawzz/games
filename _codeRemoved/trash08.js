//#region oct11 cleanup assets.js after removing MojiReduced,Icon files
async function loadRawAssets() {
	vidCache = new LazyCache(!USE_LOCAL_STORAGE);
	testCardsC = await vidCache.load('testCards', async () => await route_rsg_asset('testCards', 'yaml'));
	testCards = vidCache.asDict('testCards');
	iconCharsC = await vidCache.load('iconChars', route_iconChars);
	iconChars = vidCache.asDict('iconChars');
	iconKeys = Object.keys(iconChars);
	numIcons = iconKeys.length;
	emojiCharsC = await vidCache.load('emojiChars', route_emoChars);
	emojiChars = vidCache.asDict('emojiChars');
	emojiKeys = {};
	for (const k in emojiChars) {
		if (nundef(k) || nundef(emojiChars[k].annotation)) {
			//exclude headings from records!!!!!
			//console.log('emojiChars[k]',k,emojiChars[k],'\ncontinue...');
			continue;
		}
		let newKey = emojiChars[k].annotation;
		if (isdef(emojiKeys[newKey])) console.log('DUPLICATE KEY PROBLEM!!!!!!!!!', newKey)
		emojiKeys[newKey] = k;
	}
	numEmojis = Object.keys(emojiKeys).length;
	makeInfoDict();
	c52C = await vidCache.load('c52', route_c52);
	c52 = vidCache.asDict('c52');
}
//#region reconstructX_
var TESTMAX = 20000;
async function reconstructX() {
	//console.log('start rec 0');
	await symbolDictFromCsv(false);
	// 	setTimeout(reconstructX1, 0);

	// }
	// function reconstructX1() {
	// 	symByType = symBySet = null;
	// 	//console.log('start rec 1');
	addAnnotationsToSymbolDict(false);
	// 	setTimeout(reconstructX2, 0);
	// }
	// function reconstructX2() {
	// 	//console.log('start rec 2');
	let list = symbolKeys;
	let cnt = 0;//let list1 = firstNCond(TESTMAX, list, x => symbolDict[x].type == 'emo');
	for (const k of list) {
		cnt += 1; if (TESTMAX && cnt > TESTMAX) break;

		addElemsForMeasure(k);
	}
	setTimeout(reconstructX3, 2000);
}
function reconstructX3() {
	//console.log('start rec 3');
	let toBeRemoved = [];
	let list = symbolKeys;
	let cnt = 0;//let list1 = firstNCond(TESTMAX, list, x => symbolDict[x].type == 'emo');
	for (const k of list) {
		cnt += 1; if (TESTMAX && cnt > TESTMAX) break;
		let info = symbolDict[k];
		if (isString(info)) toBeRemoved.push(k);
		else berechnungen(symbolDict[k]);
	}
	for (const k of toBeRemoved) delete symbolDict[k];
	setTimeout(reconstructX4, 0);
}
function reconstructX4() {
	USE_LOCAL_STORAGE = true;
	saveSymbolDict();
	SIGI = true;
}
//#endregion

//#region reconstruct helpers
const MAX_ANNOTATION_LENGTH = 25;
const keysForAll = ['key', 'fz', 'w', 'h', 'type', 'hex', 'hexcode', 'text', 'family', 'isDuplicate', 'isColored'];
const keysForEmo = ['emoji', 'group', 'subgroups', 'E', 'D', 'E_valid_sound', 'D_valid_sound', 'path'];

async function symbolDictFromCsv(saveAtEnd = true) {
	USE_LOCAL_STORAGE = false;
	symbolDict = {}; symbolList = [];
	await loadRawAssets();

	symbolKeys.sort();
	let tempDict = {};
	let i = 0;
	for (const k of symbolKeys) {
		i += 1;
		let info = symbolDict[k];
		console.assert(k == info.key, 'key != symbolDict key!!!', k, info.key);
		// if (k == 'red heart') {
		// 	console.log(info)
		// }
		info.index = i;
		if (info.type != 'emo') {
			tempDict[k] = jsCopy(info);
			if (info.type == 'icon') {
				tempDict[k].tags = k.split('-');
			}
			continue;
		}
		let tags = [];
		tempDict[k] = {}; //{ hex: info.hex, hexcode: info.hexcode };
		for (const k1 in info) {
			let val = info[k1];

			if (keysForAll.includes(k1)) {
				tempDict[k][k1] = val;
				if (k1 == 'key') {
					if (val.length > MAX_ANNOTATION_LENGTH) { val = stringBefore(val, ':').trim(); }
					tempDict.annotation = val;
				}
				continue;
			}
			if (isNumber(val) || !isString(val)) { continue; }
			val = val.replace('"', '').trim();
			if (keysForEmo.includes(k1)) { tempDict[k][k1] = val; continue; }

			//ab hier just filter for tags!
			if (isEmpty(val)) { continue; }
			if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(val[0])) { continue; }
			if (firstNumber(val)) { continue; }
			if (val.length == 1) { continue; }
			//if (k1=='openmoji_author' || k1 == 'openmoji_date') console.log('emoji:',val,val.length); //,val[0],info.emoji);
			//if (val[0] =='�') {console.log('==>das ist ein emoji!!!',val);}
			if (info[k1][0] == info.emoji[0]) { continue; }
			//console.log('durchgekommen:', val, '(' + k1 + ')');
			addIf(tags, val);
		}
		tempDict[k].tags = tags;
	}
	console.log('DONE!');
	symbolDict = tempDict;
	symbolList = dict2list(symbolDict);

	if (saveAtEnd) saveSymbolDict();
}
function addAnnotationsToSymbolDict(saveAtEnd = true) {
	let list = symbolKeys;
	//console.log('---------------symbolKeys', list)
	for (const k of list) {
		//console.log(k);
		let info = symbolDict[k];

		let anno = info.key;

		//console.log(k,info,anno)

		if (info.type == 'emo'
			&& (isEmosetMember('role', info) || isEmosetMember('activity', info) || isEmosetMember('sport', info))
			&& (startsWith(anno, 'man') || startsWith(anno, 'woman'))) {
			anno = stringAfter(anno, ' ');
		} else if (anno.includes('button')) {
			anno = anno.replace('button', '');
		} else if (endsWith(anno, 'face')) {
			anno = stringBefore(anno, 'face')
		} else if (anno.includes('with')) {
			anno = stringAfter(anno, 'with');
		}
		if (startsWith(anno, 'in ')) {
			anno = stringAfter(anno, ' ');
		}
		if (anno.includes(':')) {
			anno = stringAfter(anno, ':');
		}
		anno = anno.replaceAll('-', ' ').trim();
		info.annotation = anno;

		//console.log(anno);
		//console.log('anno', anno, 'k', k, 'subgroups', info.subgroups);
	}
	if (saveAtEnd) saveSymbolDict();
}

//standalone: could be eliminated!
function addMeasurementsToSymbolDict(callback = null) {
	let list = symbolKeys;
	//console.log('---------------symbolKeys', list)
	for (const k of list) { addElemsForMeasure(k); }
	//setTimeout(recordInfo,2000);
	setTimeout(() => {
		recordInfo();
		if (callback) {
			console.log('2. ...calling callback!!!!!!!!!!!!!!!!! USE_LOCL_STORAGE', USE_LOCAL_STORAGE, '\nsymbolDict');
			callback();
		}
	}, 2000);
}
function recordInfo() {
	console.log('start recording...');
	let toBeRemoved = [];
	for (const k in symbolDict) {
		let info = symbolDict[k];
		//console.log(typeof info);
		if (isString(info)) toBeRemoved.push(k);
		else berechnungen(symbolDict[k]);
	}
	for (const k of toBeRemoved) delete symbolDict[k];

	saveSymbolDict();

}
function berechnungen(info) {
	if (isString(info)) return;
	let elem = UIS[info.key];
	//console.log(typeof info, info, info.key, elem)
	//console.log(elem.getBoundingClientRect(elem));
	let b = elem.getBoundingClientRect(elem);
	info.fz = 100;
	info.w = [Math.round(b.width)];
	info.h = [Math.round(b.height)];
	if (info.type == 'emo') {
		for (family of EMOFONTLIST) {
			let fontKey = makeFontKey(info.key, family)
			elem = UIS[fontKey];
			let b = elem.getBoundingClientRect(elem);

			//info.fz = 100;
			info.w.push(Math.round(b.width));
			info.h.push(Math.round(b.height));
		}
	}
}
function berechnungen_dep(info) {
	if (isString(info)) return;
	let elem = UIS[info.key];
	//console.log(typeof info, info, info.key, elem)
	//console.log(elem.getBoundingClientRect(elem));
	let b = elem.getBoundingClientRect(elem);
	info.fz = 100;
	info.w = Math.round(b.width);
	info.h = Math.round(b.height);
}
function addElemsForMeasure(key) {
	let info = picInfo(key);
	//console.log(info)
	//sammelDict_[info.key] = info;
	var element = mDiv(table);
	let style = { display: 'inline', bg: 'yellow', fz: 100, padding: 0, margin: 0 };
	mStyleX(element, style);
	UIS[key] = element;
	// let decCode = hexStringToDecimal('f494'); //warehouse
	// let text = '&#' + decCode + ';';
	// let family = 'pictoFa';
	element.style.fontFamily = info.family;
	element.innerHTML = info.text;

	if (info.type == 'emo') {
		//also add elem for openMoji font 
		//also add info for segoe ui emoji
		// let fontlist = ['emoOpen', 'openmoBlack', 'segoe ui emoji', 'segoe ui symbol'];
		for (family of EMOFONTLIST) {
			// let family = 'segoe ui emoji';
			let el2 = mDiv(table);
			el2.innerHTML = info.text;
			//console.log(el2)
			mStyleX(el2, style);
			UIS[makeFontKey(key, family)] = el2;
			el2.style.fontFamily = family;
		}
	}
}
function makeFontKey(key, family) {
	return key + '_' + family
}
//#endregion

//#region symbolDict from raw assets: helpers!
var emojiChars, numEmojis, emojiKeys, emoGroup, emoDict, iconChars, numIcons, iconKeys;
var symIndex, symByHex, duplicateKeys, symByGroup; //last 2 liefern info!

function makeInfoDict() {
	symbolDict = {}; symByHex = {}; symByGroup = {}; symIndex = {}; symByType = {};
	for (const k in emojiKeys) {
		//console.log(k)
		let rec = emojiChars[emojiKeys[k]];
		let info = {
			key: k,
			type: 'emo',
			isDuplicate: false,
			isColored: true,
		};
		for (const k1 in rec) info[k1] = rec[k1];
		if (nundef(info.hexcode)) {
			console.log('missing hexcode', k, info)
		}
		// else if (k == 'red heart') {
		// 	console.log('should be ok', info);
		// }
		info.hex = hexWithSkinTone(info);
		info.family = 'emoNoto';
		info.text = setPicText(info);
		info.path = '/assets/svg/twemoji/' + info.hex + '.svg';
		symbolDict[k] = info;
		lookupSet(symByGroup, [rec.group, rec.subgroups, k], info);
		lookupAddIfToList(symIndex, [rec.group, rec.subgroups], k);
		symByHex[info.hexcode] = k;
		symByHex[info.hex] = k;
		lookupSet(symByType, ['emo', k], info);
	}
	duplicateKeys = [];
	for (const k of iconKeys) {
		let hex = iconChars[k];
		let info = { key: k, type: 'icon', isDuplicate: false, isColored: false, hex: hex, hexcode: hex };
		info.family = (hex[0] == 'f' || hex[0] == 'F') ? 'pictoFa' : 'pictoGame';
		info.text = setPicText(info);
		lookupSet(symByType, ['icon', k], info);
		if (isdef(symbolDict[k])) {
			//dieser key (eg., bee) ist bereits vorgekommen, so es gibt auch so ein emoji
			symbolDict[k].isDuplicate = true; //that is the emo!!!
			lookupSet(symByType, ['eduplo', k], symbolDict[k]);
			lookupSet(symByType, ['iduplo', k], info);
			symByHex['i_' + info.hex] = k;
			symbolDict['i_' + k] = info;
			info.key = 'i_' + k;
			info.isDuplicate = true;
			duplicateKeys.push(k);
		} else {
			symByHex[info.hex] = k;
			symbolDict[k] = info;
		}
	}
	symbolKeys = Object.keys(symbolDict);
	symbolList = dict2list(symbolDict);
	//console.log('#symbolKeys', symbolKeys.length);
	//makeEmoSetIndex();
	// console.log('symbolDict', symbolDict);
	// console.log('by set', symBySet);
	// console.log('by group', symByGroup);
	// console.log('index', symIndex);
	// console.log('by hex', symByHex);
}

//helpers done
function hexWithSkinTone(info) {
	const skinTones = { white: 'B', asian: 'C', hispanic: 'D', indian: 'E', black: 'F' };

	let hex = info.hexcode; //default case!
	let nolist = ['family', 'person-fantasy', 'person-activity'];


	if (info.group == 'people-body' && !nolist.includes(info.subgroups)
		&& (info.subgroups != 'body-parts' || !info.annotation.includes('mechan') && info.order < 404)) {
		//if (info.subgroups == 'body-parts') console.log('order',info.order,info.annotation)

		// hex = getSkinToneKey(info.hexcode);

		let k = stringBefore(info.hexcode, '-');
		let rest = stringAfter(info.hexcode, '-');
		if (startsWith(rest, 'FE0F')) rest = stringAfter(rest, '-');
		hex = k + '-1F3F' + skinTones.asian + (isEmpty(rest) ? '' : ('-' + rest));
	}
	return hex;
}
function setPicText(info) {
	let decCode;
	let hex = info.hexcode;

	//console.log('info.hexcode',info,info.hexcode);
	// hex = "1F1E8-1F1ED";
	let parts = hex.split('-');
	let res = '';
	for (const p of parts) {
		decCode = hexStringToDecimal(p);
		s1 = '&#' + decCode + ';'; //'\u{1F436}';
		res += s1;
	}
	s1 = res;
	return s1;
}
//#endregion

async function route_iconChars() {
	let gaIcons = await route_rsg_raw_asset('gameIconCodes');
	let faIcons = await route_rsg_raw_asset('faIconCodes');
	let dIcons = {};
	for (const k in faIcons) {
		dIcons[k] = faIcons[k];
	}
	for (const k in gaIcons) {
		dIcons[k] = gaIcons[k];
	}
	return dIcons;

}
async function route_emoChars() {
	// let x = await (await fetch('/assets/openmoji.csv')).text();
	let x = await (await fetch('/assets/raw/mojiReduced.csv')).text();
	emojiChars = processCsvData(x);
	return emojiChars;
}
//#endregion













