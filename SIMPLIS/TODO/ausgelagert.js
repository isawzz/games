function infoHasNumber(info) {
	let ws = info.words;
	return firstCond(ws, x => isNumber(x));
}
function goalHasNumber() {
	let ws = Goal.info.words;
	return firstCond(ws, x => isNumber(x));
}
function goalHasTimeString() {
	let ws = Goal.info.words;
	return firstCond(ws, x => isTimeString(x));
}
function infoHasTimeString(info) {
	let ws = info.words;
	return firstCond(ws, x => isTimeString(x));
}
function goalHasNumberOrTimeString() {
	return goalHasNumber() || goalHasTimeString();
}
function infoHasNumberOrTimeString(info) {
	return infoHasNumber(info) || infoHasTimeString(info);
}
function isGermanString(x) { return currentLanguage == 'D' && !isNumber(x) && !isTimeString(x); }
function gotNumberOrTimeString(answer) {
	if (isNumber(answer) || isTimeString(answer)) return true; else return false;
}
function isNumberOrTimeString(w) { return isNumber(w) || isTimeString(w); }




function matchesAnyWordOrSound(info, s) {
	if (!isEnglish(currentLanguage)) return false;
	for (const w of info.words) {
		if (isTimeString(w)) return soundsSimilar(w, s);
	}
	return false;
}
function isAcceptableAnswerButNewSound(info, reqAnswer, s) {
	let sParts = s.split(' ');
	let aParts = reqAnswer.split(' ');
	if (isTimeString(s)) s = convertTimesAndNumbersToWords(s);
	if (isTimeString(reqAnswer)) reqAnswer = convertTimesAndNumbersToWords(reqAnswer);
	if (sParts.length != aParts.length) return false;
	for (let i = 0; i < sParts.length; i++) {
		if (!soundsSimilar(sParts[i], aParts[i])) return false;
	}
	return true;
}

function convertTimesAndNumbersToWords(w) {
	//console.log('B',typeof (w), isNumber(w), w);
	//check if w1 is a time (like 12:30)
	if (w.includes(':')) {
		//only works for hh:mm
		let h = stringBefore(w, ':');
		let m = stringAfter(w, ':');
		let hn = Number(h);
		let mn = Number(m);
		//console.log('_________',hn,mn);
		let xlist = allIntegers(w);
		if (xlist.length == 2) {
			if (xlist[1] == 0) xlist = [xlist[0]];
			xlist = xlist.map(n => n.toString());
			let res1 = xlist.join('');
			//console.log('C','turned time',w,'into number',res1);
			w = res1;
		}
	}
	if (isNumber(w)) {
		let res = toWords(w);
		//console.log('D','got number:', w, '=>', res)
		return res;
	}
	return w;
}


function soundsSimilar(w1, w2) {
	//console.log('_______________ soundsSimilar')
	//console.log('A',typeof (w1), typeof (w2), isNumber(w1), isNumber(w2), w1, w2);
	w1 = convertTimesAndNumbersToWords(w1); //toWords(w1);
	w2 = convertTimesAndNumbersToWords(w2); //toWords(w2);
	const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
	function syllabify(words) {
		return words.match(syllableRegex);
	}
	let a1 = syllabify(w1);
	let a2 = syllabify(w2);
	//console.log('E', typeof (w1), typeof (w2), isNumber(w1), isNumber(w2), w1, w2)
	//console.log('a1', a1, 'a2', a2);
	if (!a1) a1 = [w1];
	if (!a2) a2 = [w2];
	if (currentLanguage == 'D' && isdef(germanNumbers[a1]) && germanNumbers[a1] == germanNumbers[a2]) return true;
	if (a1.length != a2.length) return false;
	for (let i = 0; i < a1.length; i++) {
		let s1 = a1[i];
		let s2 = a2[i];
		if (s1 == s2) return true;
		let x1 = stringAfterLeadingConsonants(s1);
		let x2 = stringAfterLeadingConsonants(s2);
		if (currentLanguage == 'E' && 'ou'.includes(x1) && 'ou'.includes(x2) && x1.substring(1) == x2.substring(1)) return true;
		if (currentLanguage == 'E' && 'oa'.includes(x1) && 'ao'.includes(x2) && x1.substring(1) == x2.substring(1)) return true;
		if (currentLanguage == 'E' && x1.replace('ee', 'i') == x2.replace('ee', 'i')) return true;
		if (currentLanguage == 'E' && x1.replace('ea', 'ai') == x2.replace('ea', 'ai')) return true;
	}
	return false;
}
function stringAfterLeadingConsonants(s) {
	let regexpcons = /^([^aeiou])+/g;
	let x = s.match(regexpcons);
	return x ? s.substring(x[0].length) : s;
}
function addAsSoundToDatabase(info, answer) {
	//lege dictionary an  mit info.key => info [updated] with answer now in valid sounds for language
}

