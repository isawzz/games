const LevelsSP = {
	0: { NumPics: 1, NumLabels: 1, MinWordLength: 2, MaxWordLength: 21, MaxNumTrials: 3 },
	1: { NumPics: 1, NumLabels: 1, MinWordLength: 3, MaxWordLength: 21, MaxNumTrials: 3 },
	2: { NumPics: 1, NumLabels: 1, MinWordLength: 3, MaxWordLength: 21, MaxNumTrials: 3 },
	3: { NumPics: 1, NumLabels: 0, MinWordLength: 4, MaxWordLength: 21, MaxNumTrials: 3 },
	4: { NumPics: 1, NumLabels: 0, MinWordLength: 4, MaxWordLength: 21, MaxNumTrials: 3 },
	5: { NumPics: 1, NumLabels: 0, MinWordLength: 5, MaxWordLength: 21, MaxNumTrials: 3 },
	6: { NumPics: 1, NumLabels: 0, MinWordLength: 6, MaxWordLength: 21, MaxNumTrials: 3 },
	7: { NumPics: 1, NumLabels: 0, MinWordLength: 7, MaxWordLength: 21, MaxNumTrials: 3 },
	8: { NumPics: 1, NumLabels: 0, MinWordLength: 8, MaxWordLength: 21, MaxNumTrials: 3 },
	9: { NumPics: 1, NumLabels: 0, MinWordLength: 7, MaxWordLength: 21, MaxNumTrials: 3 },
	10: { NumPics: 1, NumLabels: 0, MinWordLength: 6, MaxWordLength: 21, MaxNumTrials: 3 },
}
function startGameSP() { }
function startLevelSP() { levelSP(); }
function levelSP() {
	//console.log('level',currentLevel)
	let levelInfo = LevelsSP[currentLevel];
	MaxNumTrials = levelInfo.MaxNumTrials;
	MaxWordLength = levelInfo.MaxWordLength;
	MinWordLength = levelInfo.MinWordLength;
	setKeys(currentCategories,false,x=>lastOfLanguage(x,currentLanguage),true, true);
	
	//currentKeys=currentKeys.filter(x=>isdef(CorrectWordsCorrect[x]))
	//console.log(currentKeys);
	NumPics = levelInfo.NumPics;
	NumLabels = levelInfo.NumLabels;
}
function startRoundSP() { }
function promptSP() {

	showPictures(true, () => mBy(defaultFocusElement).focus());
	setGoal();

	showInstruction(bestWord, currentLanguage == 'E' ? 'say:' : "sage: ", dTitle);

	mLinebreak(dTable);
	MicrophoneUi = mMicrophone(dTable);

	return 10; //1000;
}
function trialPromptSP() {
	//showFleetingMessage('Say again!',0,{fz:80,fg:'red'});
	say(currentLanguage == 'E' ? 'try again!' : 'nochmal', 1, 1, .3, true, 'zira');
	animate(dInstruction,'pulse800'+getSignalColor(),900);
	return 1500;
}
async function activateSP() {
	if (isSpeakerRunning) {
		setTimeout(activateSP, 300);
	} else {
		setTimeout(() => record(currentLanguage, bestWord), 100);
	}
	//orig code:
	// setTimeout(() => {
	// 	record(currentLanguage, bestWord);
	// }, trialNumber == 0 ? 4000 : 1500);
}
function evalSP(speechResult) {

	if (isEmpty(speechResult)) {
		//console.log('.....empty speechResult');
		return false;
	}

	Selected = {}
	let answer = Goal.answer = Selected.answer = normalize(speechResult, currentLanguage);
	let reqAnswer = Goal.reqAnswer = normalize(bestWord, currentLanguage);

	if (answer == reqAnswer) return true;
	else if (matchesAnyWordOrSound(Goal.info, answer)) return true;
	else if (matchingNumberOrTime(Goal.info, answer)) {
		//console.log('matches as number or time!!!')
		return true;
	} else if (isAcceptableAnswerButNewSound(Goal.info, reqAnswer, answer)) {
		//console.log('accepting', answer, 'as sound for', reqAnswer);
		addAsSoundToDatabase(Goal.info, answer);
		return true;
	} else {
		return false;
	}
}


//word similarity helpers
//function numToWord(n) {
// American Numbering System
var th = ['', 'thousand', 'million', 'billion', 'trillion'];
// uncomment this line for English Number System
// var th = ['','thousand','million', 'milliard','billion'];

var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function toWords(s) {
	s = s.toString();
	s = s.replace(/[\, ]/g, '');
	if (s != parseFloat(s)) return 'not a number';
	var x = s.indexOf('.');
	if (x == -1) x = s.length;
	if (x > 15) return 'too big';
	var n = s.split('');
	var str = '';
	var sk = 0;
	for (var i = 0; i < x; i++) {
		if ((x - i) % 3 == 2) {
			if (n[i] == '1') { str += tn[Number(n[i + 1])] + ' '; i++; sk = 1; }
			else if (n[i] != 0) { str += tw[n[i] - 2] + ' '; sk = 1; }
		} else if (n[i] != 0) {
			str += dg[n[i]] + ' '; if ((x - i) % 3 == 0) str += 'hundred '; sk = 1;
		} if ((x - i) % 3 == 1) {
			if (sk) str += th[(x - i - 1) / 3] + ' '; sk = 0;
		}
	}
	if (x != s.length) {
		var y = s.length;
		str += 'point ';
		//for (var i = x + 1; 
		str.replace(/\s+/g, ' ');
	}
	return str.trim();
}
//}

function matchingNumberOrTime(info, answer) {
	//console.log('matchingNumberOrTime', info.words, bestWord, answer)

	if (infoHasNumberOrTimeString(info) && isNumberOrTimeString(answer)) {
		//solve this thing using timestring or number
		//console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
		if (isNumber(answer) && infoHasNumber(info)) {
			//compare the numbers
			//console.log('1')
			let best1 = firstCond(info.words, x => isNumber(x));
			return best1 == answer;
		} else if (isTimeString(answer) && infoHasTimeString(info)) {
			let ts = firstCond(info.words, x => isTimeString(x));
			//console.log('222222222222200000000000000000000');
			let x1 = convertGermanUhrzeitToNumbers(answer);
			let x2 = convertTimeStringToNumbers(ts);
			//console.log(x1, x2);
			//remove all 0 from lists
			removeInPlace(x1, 0);
			removeInPlace(x2, 0);

			//console.log('after removeInPlace', x1, x2)
			return sameList(x1, x2);
		} else if (infoHasTimeString(info)) {
			//console.log('3')
			let best1 = firstCond(info.words, x => isTimeString(x));
			let x1 = convertTimesAndNumbersToWords(best1);
			let x2 = convertTimesAndNumbersToWords(answer);
			return x1 == x2;
		}
	}
}
function infoHasNumber(info) {
	let ws = info.words;
	return firstCond(ws, x => isNumber(x));
}
function goalHasNumber() {
	let ws = Goal.info.words;
	return firstCond(ws, x => isNumber(x));
}
function isTimeString(w) {
	let res1 = (w.includes(':') && w.length >= 4 && w.length <= 5);
	let res2 = (currentLanguage == 'D' && stringAfterLast(w.toLowerCase(), ' ') == 'uhr'); //endsWith(w.trim().toUpperCase(), 'UHR'));
	//console.log('CHECKING isTimeString', w, res1 || res2);
	return res1 || res2;
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

const germanNumbers = {
	ein: 1, eins: 1, zwei: 2, 1: 'eins', 2: 'zwei', 3: 'drei', drei: 3, vier: 4, 4: 'vier', 5: 'fuenf', fuenf: 5, sechs: 6, 6: 'sechs', sex: 6,
	sieben: 7, 7: 'sieben', 8: 'acht', acht: 8, 9: 'neun', neun: 9, zehn: 10, elf: 11, zwoelf: 12, zwanzig: 20, dreissig: 30,
	10: 'zehn', 11: 'elf', 12: 'zwoelf', 20: 'zwanzig', 30: 'dreissig', vierzig: 40, fuenfzig: 50, 40: 'vierzig', 50: 'fuenfzig'
};

function convertGermanUhrzeitToNumbers(w) {
	console.log('...', w)
	//geht nur fuer ein eins zwei ... und dreissig
	let parts = multiSplit(w, ' :');
	console.log('...parts', parts)
	let res = [];
	for (const p of parts) {
		let p1 = p.trim().toLowerCase();
		if (isNumber(p1)) res.push(Number(p1));
		else if (isdef(germanNumbers[p1])) res.push(germanNumbers[p1]);
		// continue;
		// switch (p1) {
		// 	case '1': res.push(1); break;
		// 	case 'ein': res.push(1); break;
		// 	case 'eins': res.push(1); break;
		// 	case '2': res.push(2); break;
		// 	case 'zwei': res.push(2); break;
		// 	case '3': res.push(3); break;
		// 	case 'drei': res.push(3); break;
		// 	case '4': res.push(4); break;
		// 	case 'vier': res.push(4); break;
		// 	case '5': res.push(5); break;
		// 	case 'fuenf': res.push(5); break;
		// 	case '6': res.push(6); break;
		// 	case 'sechs': res.push(6); break;
		// 	case '7': res.push(7); break;
		// 	case 'sieben': res.push(7); break;
		// 	case '8': res.push(8); break;
		// 	case 'acht': res.push(8); break;
		// 	case '9': res.push(9); break;
		// 	case 'neun': res.push(9); break;
		// 	case '10': res.push(10); break;
		// 	case 'zehn': res.push(10); break;
		// 	case '11': res.push(11); break;
		// 	case 'elf': res.push(11); break;
		// 	case '12': res.push(12); break;
		// 	case 'zwoelf': res.push(12); break;
		// 	case 'dreissig': res.push(30); break;
		// 	case '30': res.push(30); break;
		// 	default:
		// }
	}
	return res;

}
function convertTimeStringToNumbers(ts) {
	return allIntegers(ts);
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

