//from helpers neuere emo pic die schon info verwenden aber scheusslicher code!
function mPicX(info, dParent, { w, h, unit = 'px', fg, bg, padding, border, rounding, shape }) {
	if (nundef(w)) w = 25;
	if (nundef(h)) h = w;
	if (nundef(padding)) padding = 0;

	let dOuter = document.createElement('div');
	if (dParent) dParent.appendChild(dOuter);
	let dInner = document.createElement('div');
	if (dOuter) dOuter.appendChild(dInner);

	let text = info.text;

	let hi = h - 2 * padding;
	let wi = w - 2 * padding;
	let sz = getTextSizeX(text, hi, info.family, 900);
	console.log('_______________erste messung fz=h-2*padding\nh', h, '\npadding', padding, '\nhi', hi, '\nsz', sz.w, sz.h);

	let w1 = sz.w;
	let h1 = sz.h;
	let xh = hi / h1;
	let xw = (w - 2 * padding) / w1;
	let x = Math.min(xh, xw);
	let fz = hi * x;
	console.log('_______________\nxh', xh, '\nxw', xw, '\nx', x, '\nfz', fz);
	let family = dInner.style.fontFamily = info.family;
	let weight = dInner.style.fontWeight = 900;
	dInner.style.fontSize = fz + unit;
	let size = getTextSizeX(text, fz, family, weight);
	console.log('_______________\nh', h, '\npadding', padding, '\nhi', hi, '\nx', x, '\nfz', fz, '\nsize', size);
	//size ist size von dInner!
	let padleft = padding;
	let wOuter = size.w + 2 * padleft;
	if (wOuter < w) padleft += (w - wOuter) / 2;
	let padtop = padding;
	let hOuter = size.h + 2 * padtop;
	if (hOuter < h) padtop += (h - hOuter) / 2;
	dOuter.style.padding = padtop + unit + ' ' + padleft + unit;
	dOuter.style.width = w + unit;
	dOuter.style.height = h + unit;

	dInner.style.display = 'inline-block';
	dInner.style.textAlign = 'center';
	dInner.innerHTML = info.text;

	dOuter.style.display = 'inline-block';
	dOuter.style.boxSizing = 'border-box';

	[bg, fg] = getExtendedColors(bg, fg);
	if (isdef(bg)) dOuter.style.backgroundColor = bg;
	if (isdef(fg)) dOuter.style.color = fg;

	if (isdef(border)) dOuter.style.border = border;
	if (isdef(rounding)) dOuter.style.borderRadius = rounding + unit;
	else if (isdef(shape) && shape == 'ellipse') {
		let b = getBounds(dOuter);
		let vertRadius = b.height / 2;
		let horRadius = b.width / 2;
		let r = Math.min(vertRadius, horRadius);
		console.log(b, r)
		// d.style.borderRadius = `${horRadius}${unit} ${vertRadius}${unit} ${horRadius}${unit} ${vertRadius}${unit}`;
		dOuter.style.borderRadius = `${r}${unit}`;
	}
	dOuter.key = info.key;
	return dOuter;
}


//from helpers alle pic functions!

//#region toUTF16
// http://www.2ality.com/2013/09/javascript-unicode.html
function toUTF16(codePoint) {
	var TEN_BITS = parseInt('1111111111', 2);
	function u(codeUnit) {
		return '\\u' + codeUnit.toString(16).toUpperCase();
	}

	if (codePoint <= 0xFFFF) {
		return u(codePoint);
	}
	codePoint -= 0x10000;

	// Shift right to get to most significant 10 bits
	var leadSurrogate = 0xD800 + (codePoint >> 10);

	// Mask to get least significant 10 bits
	var tailSurrogate = 0xDC00 + (codePoint & TEN_BITS);

	return u(leadSurrogate) + u(tailSurrogate);
}

// using codePointAt, it's easy to go from emoji
// to decimal and back.
// // Emoji to decimal representation
// "😀".codePointAt(0)
// >128512

// // Decimal to emoji
// String.fromCodePoint(128512)
// >"😀"

// // going from emoji to hexadecimal is a little
// // bit trickier. To convert from decimal to hexadecimal,
// // we can use toUTF16.
// // Decimal to hexadecimal
// toUTF16(128512)
// > "\uD83D\uDE00"

// // Hexadecimal to emoji
// "\uD83D\uDE00"
// > "😀"
//#endregion
function mEmo(key, parent, fontSize) {
	//console.log(key,parent,fontSize);
	if (isString(parent)) parent = mBy(parent);
	let d = mDiv(parent);
	let rec = emojiChars[emojiKeys[key]];
	let decCode = hexStringToDecimal(rec.hexcode);
	let hex = rec.hexcode;

	let s1 = '&#' + decCode + ';'; //'\u{1F436}';
	// s1 = '&#x' + hex + ';'; //'\u{1F436}';

	// hex = "1F1E8-1F1ED";
	let parts = hex.split('-');
	let res = '';

	for (const p of parts) {
		decCode = hexStringToDecimal(p);
		s1 = '&#' + decCode + ';'; //'\u{1F436}';
		res += s1;
	}
	s1 = res;
	d.innerHTML = s1;
	d.style.fontSize = fontSize + 'pt';
	return d;
}
function mEmoTrial2(key, dParent, styles, classes) {
	//console.log('haaaaaaaaaaaaaaaaaaaalo', key, parent);
	if (isString(dParent)) dParent = mBy(dParent);
	let d = mDiv(dParent);
	let rec = emojiChars[emojiKeys[key]];
	let s1;
	s1 = rec.emoji;
	d.innerHTML = s1;
	if (isdef(styles)) mStyleX(d, styles);
	if (isdef(classes)) mClass(d, classes);
	return d;
}
function mEmoTrial1(key, dParent, styles, classes) {
	console.log('haaaaaaaaaaaaaaaaaaaalo', key, parent);
	if (isString(dParent)) dParent = mBy(dParent);
	let d = mDiv(dParent);
	let rec = emojiChars[emojiKeys[key]];
	let decCode = hexStringToDecimal(rec.hexcode);
	let hex = rec.hexcode;

	let s1 = '&#' + decCode + ';'; // Emoji=Yes;'; //'\u{1F436}';
	// s1 = '&#x' + hex + ';'; //'\u{1F436}';

	// hex = "1F1E8-1F1ED";
	let parts = hex.split('-');
	let res = '';

	for (const p of parts) {
		decCode = hexStringToDecimal(p);
		s1 = '&#' + decCode + ';'; //'\u{1F436}';
		res += s1;
	}
	s1 = '🖱️'; //res;// + ' Emoji=Yes';

	//console.log(key,rec.hexcode,decCode,);
	d.innerHTML = s1;
	if (isdef(styles)) mStyle(d, styles);
	//d.style.fontSize = fontSize + 'pt';
	return d;
}
function mPic(key) {
	let ch = iconChars[key];
	let family = (ch[0] == 'f' || ch[0] == 'F') ? 'pictoFa' : 'pictoGame';
	let text = String.fromCharCode('0x' + ch);
	let d = mText(text);
	d.style.setProperty('font-family', family);
	return d;
}

//last used:
function getEmoSetWords(lang = 'E') {

	if (isdef(emoGroup)) {
		let keys = Object.keys(emoDict);
		//console.log(keys);
	}
	let key = chooseRandomKey(isdef(emoGroup) ? emoDict : emojiChars);
	//key = '1F912'; //fever
	//key= '1F9C5'; //onion
	//key = '1F5B1'; // mouse '1FA79'; //bandage '1F48E'; // gem '1F4E3';//megaphone '26BE'; //baseball '1F508'; //speaker low volume
	// key='26BE'; // baseball '26BD'; //soccer '1F988'; //shark '1F41C'; //ant '1F1E6-1F1FC';
	let o = emojiChars[key];

	//console.log('_________\nkey',key,'\no',o)

	let valid, words;
	let oValid = o[lang + '_valid_sound'];
	if (isEmpty(oValid)) valid = []; else valid = sepWordListFromString(oValid, ['|']);
	let oWords = o[lang];
	if (isEmpty(oWords)) words = []; else words = sepWordListFromString(oWords, ['|']);
	//console.log('_____ oValid',oValid,'\noWords',oWords);

	let dWords = o.D;
	if (isEmpty(dWords)) dWords = []; else dWords = sepWordListFromString(dWords, ['|']);
	let dWordsShort = dWords.filter(x => x.length <= MAXWORDLENGTH);
	let eWords = o.E;
	if (isEmpty(eWords)) eWords = []; else eWords = sepWordListFromString(eWords, ['|']);
	let eWordsShort = eWords.filter(x => x.length <= MAXWORDLENGTH);

	//cond

	if (isEmpty(dWordsShort) || isEmpty(eWordsShort)) { delete emoDict[key]; return getEmoSetWords(); }

	words = isEnglish(lang) ? eWords : dWords;
	o.eWords = eWords;
	o.dWords = dWords;

	//console.log(words,eWords,dWords)

	return { valid: valid, words: words, D: dWords, E: eWords, key: o.annotation, lang: lang, record: o };

}

//unused
function allEnglishWords() {

	let key = chooseRandomKey(isdef(emoGroup) ? emoDict : emojiChars);

	//key='1F1E6-1F1FC';

	let o = emojiChars[key];
	console.log('_________\nkey', key, '\no', o)
	let toBeRemoved = ['marine', 'forest', 'mammal', 'medium', 'parts', 'medium-light', 'medium-dark', 'dark', 'light', 'skin', 'tone', 'on', 'button'];
	toBeRemoved.push(emoGroup.toLowerCase());

	let anno = o.annotation;
	anno = stringBefore(anno, ':');
	if (anno.length > MAXWORDLENGTH) {
		console.log('problem word:', anno, key, o)
	}

	let tags = sepWordListFromString(o.tags, [' ', ',']);
	let etags = sepWordListFromString(o.openmoji_tags, [' ', ',']);
	let other = sepWordListFromString(anno, [' ', ',']);
	let subgroups = [];//sepWordListFromString(o.subgroups, [' ', ',', '-']);

	let words = union(union(union(subgroups, etags), other), tags);
	addIf(words, anno);
	words = words.filter(x => !toBeRemoved.includes(x.toLowerCase()));
	words = words.map(x => x.replace(':', ''));

	words = words.filter(x => x.length <= MAXWORDLENGTH);
	if (isEmpty(words)) { delete emoDict[key]; return allEnglishWords(); }
	return { words: words, key: o.annotation, lang: 'E' };

}
function getEmoSetWords_dep(lang = 'E') {
	let key = chooseRandomKey(isdef(emoGroup) ? emoDict : emojiChars);

	//key = '1F5B1'; // mouse '1FA79'; //bandage '1F48E'; // gem '1F4E3';//megaphone '26BE'; //baseball '1F508'; //speaker low volume
	// key='26BE'; // baseball '26BD'; //soccer '1F988'; //shark '1F41C'; //ant '1F1E6-1F1FC';
	let o = emojiChars[key];
	//console.log('_________\nkey',key,'\no',o)
	//console.log('_________\nkey',key,'\no',o)
	let toBeRemoved = ['marine', 'forest', 'mammal', 'medium', 'parts', 'medium-light', 'medium-dark', 'dark', 'light', 'skin', 'tone', 'on', 'button'];
	toBeRemoved.push(emoGroup.toLowerCase());

	let oValid = o[lang + '_valid_sound'];
	//console.log('_____ oValid',oValid);
	let valid;
	if (isEmpty(oValid)) valid = []; else valid = sepWordListFromString(o[lang + '_valid_sound'], ['|']);
	//valid=isEmpty(valid)?[]:[valid];
	//console.log('valid sound',valid);

	let words = [];//isEmpty(valid)?[]:[valid];
	if (isEnglish(lang)) {
		//console.log('o.E',o.E,'\no.D',o.D)

		words = words.concat(sepWordListFromString(o.E, ['|']));
	} else words = words.concat(sepWordListFromString(o.D, ['|']));

	words = words.filter(x => x.length <= MAXWORDLENGTH);
	if (isEmpty(words)) { delete emoDict[key]; return getEmoSetWords(); }
	return { valid: valid, words: words, key: o.annotation, lang: lang, record: o };

}

function getGermanAnimals() {
	let m = tiere;
	let choice = chooseRandom(m);
	if (nundef(choice.words)) choice.words = [choice.key];
	choice.words = choice.words.map(x => capitalize(x));
	choice.lang = 'D';
	return choice;
}
function getColoredHearts() {
	let m = [
		{ key: 'red heart', words: ['red', 'love', 'heart'] },
		{ key: 'blue heart', words: ['blue', 'love', 'heart'] },
		{ key: 'green heart', words: ['green', 'love', 'heart'] },
	];
	let choice = chooseRandom(m);
	choice.lang = 'E';
	return choice;
}
function setLanguageWords_dep(language, record) {

	//console.log('record',record,'language',language)

	let valid;
	let oValid = record[language + '_valid_sound'];
	if (isEmpty(oValid)) valid = []; else valid = sepWordListFromString(oValid, ['|']);
	// let oWords = o[lang];
	// if (isEmpty(oWords)) words = []; else words = sepWordListFromString(oWords, ['|']);
	//console.log('_____ oValid',oValid);//,'\noWords',oWords);

	matchingWords = isEnglish(language) ? record.eWords : record.dWords;
	//console.log(matchingWords,getTypeOf(matchingWords))
	validSounds = valid;
	//console.log(language,record,matchingWords);

	

	bestWord = last(matchingWords);
	hintWord = '_'.repeat(bestWord.length);
	if (isdef(hintMessage)) clearElement(hintMessage);

}

function getEmoSetWords_dep2(lang = 'E') {

	if (isdef(emoGroup)) {
		let keys = Object.keys(emoDict);
		//console.log(keys);
	}
	let key = chooseRandomKey(isdef(emoGroup) ? emoDict : emojiChars);
	key = '1F912'; //fever
	//key= '1F9C5'; //onion
	//key = '1F5B1'; // mouse '1FA79'; //bandage '1F48E'; // gem '1F4E3';//megaphone '26BE'; //baseball '1F508'; //speaker low volume
	// key='26BE'; // baseball '26BD'; //soccer '1F988'; //shark '1F41C'; //ant '1F1E6-1F1FC';
	let o = emojiChars[key];

	//console.log('_________\nkey',key,'\no',o)

	let valid, words;
	let oValid = o[lang + '_valid_sound'];
	if (isEmpty(oValid)) valid = []; else valid = sepWordListFromString(oValid, ['|']);
	let oWords = o[lang];
	if (isEmpty(oWords)) words = []; else words = sepWordListFromString(oWords, ['|']);
	//console.log('_____ oValid',oValid,'\noWords',oWords);

	let dWords = o.D;
	if (isEmpty(dWords)) dWords = []; else dWords = sepWordListFromString(dWords, ['|']);
	dWords = dWords.filter(x => x.length <= MAXWORDLENGTH);
	let eWords = o.E;
	if (isEmpty(eWords)) eWords = []; else eWords = sepWordListFromString(eWords, ['|']);
	eWords = eWords.filter(x => x.length <= MAXWORDLENGTH);

	//cond
	if (isEmpty(dWords) || isEmpty(eWords)) { delete emoDict[key]; return getEmoSetWords(); }

	words = isEnglish(lang) ? eWords : dWords;
	o.eWords = eWords;
	o.dWords = dWords;

	//console.log(words,eWords,dWords)

	return { valid: valid, words: words, D: dWords, E: eWords, key: o.annotation, lang: lang, record: o };

}
