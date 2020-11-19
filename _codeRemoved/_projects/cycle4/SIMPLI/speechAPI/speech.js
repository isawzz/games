class SpeechFeature {
	constructor(defaultVolume) {
		this.recorder = new Recorder();
		this.speaker = new Speaker(defaultVolume);
		//console.log(this.recorder)
	}
	setRecordingLanguage(lang) {
		this.recorder.setLanguage(lang);
	}
	record({ onStart, delayStart, onFinal, delayFinal, onEmpty, delayEmpty, retry = false, wait = true, interrupt = false } = {}) {
		if (this.recorder.isRunning) {
			if (interrupt) {
				this.recorder.interrupt();
				setTimeout(() => this.recorder.start(onStart, delayStart, onFinal, delayFinal, onEmpty, delayEmpty), 500);
			} else if (wait) {
				setTimeout(() => this.record(...arguments), 500);
			}
		} else {
			this.recorder.start(onStart, delayStart, onFinal, delayFinal, onEmpty, delayEmpty, retry);
		}
	}
	say(text) { this.speaker.say(text) }
	recognizePromise(word, lang, onMatch, onNoMatch) {
		this.setRecordingLanguage(lang);
		this.record({
			onFinal: (r, c) => {
				r = r.toLowerCase();
				word = word.toLowerCase();
				if (r == word) onMatch(r, c); else onNoMatch(r, c);
			},
			onEmpty: (r, c) => onNoMatch(r, c)
		});
	}
	recognize(word, lang, onMatch, onNoMatch) {
		this.setRecordingLanguage(lang);
		this.record({
			onFinal: (r, c) => {
				r = r.toLowerCase();
				word = word.toLowerCase();
				if (isSimilar(r, word, lang)) onMatch(r, c); else onNoMatch(r, c);
				//if (r == word) onMatch(r, c); else onNoMatch(r, c);
			},
			onEmpty: (r, c) => onNoMatch(r, c)
		});
	}
}
class Recorder {
	constructor(lang = 'E') {
		let recognition = this.rec = new webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.maxAlternatives = 5;
		this.setLanguage(lang); //recognition.lang = 'en-US' ;
		this.isRunning = false;
		this.startHandler = null;
		this.delayAfterStarted = 0;
		this.finalResultHandler = null;
		this.delayAfterFinalResult = 0;
		this.emptyResultHandler = null;
		this.delayAfterEmptyResult = 0;
		this.languageChangeHandler = null;

		this.retryOnError = false;
		this.result = null;
		this.isFinal = null;
		this.confidence = null;

		this.timeoutStart = this.timeoutFinal = this.timeoutEmpty = null;

		recognition.onerror = ev => {
			this.isRunning = false;
			console.error('recorder ERROR:' + ev.toString());
			if (this.retryOnError) setTimeout(() => this.rec.start(), 200);
		};
		recognition.onstart = ev => {
			this.isRunning = true;
			this.result = null;
			this.isFinal = null;
			this.confidence = null;

			if (this.startHandler) this.timeoutStart = setTimeout(() => this.startHandler(), this.delayAfterStarted);
			console.log('recorder started!');
		};
		recognition.onresult = ev => {
			this.isFinal = ev.results[0].isFinal;
			this.result = ev.results[0][0].transcript;
			this.confidence = ev.results[0][0].confidence;
			console.log('recorder got ' + (this.isFinal ? 'FINAL' : '') + ' result:', this.result, '(' + this.confidence + ')');
			if (this.isFinal) this.rec.stop();
			if (this.isFinal && this.finalResultHandler) this.timeoutFinal = setTimeout(() => this.finalResultHandler(this.result, this.confidence), this.delayAfterFinalResult);
		};
		recognition.onend = ev => {
			console.log('recorder ended!!');
			if (!this.isFinal && this.emptyResultHandler) this.timeoutEmpty = setTimeout(() => this.emptyResultHandler(this.result, this.confidence), this.delayAfterEmptyResult);
			if (this.languageChangeHandler) { this.languageChangeHandler(); this.languageChangeHandler = null; }
			this.isRunning = false;
		};
	}
	start(onStart, delayStart, onFinal, delayFinal, onEmpty, delayEmpty, retry = false) {
		this.startHandler = isdef(onStart) ? onStart.bind(this) : null;
		this.delayAfterStarted = isdef(delayStart) ? delayStart : 0;
		this.finalResultHandler = isdef(onFinal) ? onFinal.bind(this) : null;
		this.delayAfterFinalResult = isdef(delayFinal) ? delayFinal : 0;
		this.emptyResultHandler = isdef(onEmpty) ? onEmpty.bind(this) : null;
		this.delayAfterEmptyResult = isdef(delayEmpty) ? delayEmpty : 0;

		console.log('start:', onStart, delayStart, onFinal, delayFinal, onEmpty, delayEmpty, retry)

		this.retryOnError = retry;
		if (this.interrupt()) return;
		console.log('starting...');
		//???bin nicht sicher ob hier schon isRunning=true setzen muss! https://stackoverflow.com/questions/44226827/how-to-know-if-webkitspeechrecognition-is-started sagt nein!
		this.isRunning = true;
		this.rec.start();
	}
	stop() {
		this.rec.stop();
	}
	interrupt() {
		if (this.isRunning) {
			this.isRunning = false;
			this.rec.abort();
			if (this.timeoutStart) { clearTimeout(this.timeoutStart); this.timeoutStart = null; }
			if (this.timeoutFinal) { clearTimeout(this.timeoutFinal); this.timeoutFinal = null; }
			if (this.timeoutEmpty) { clearTimeout(this.timeoutEmpty); this.timeoutEmpty = null; }
			return true;
		} else return false;
	}
	setLanguage(lang) {
		if (lang == 'E' && this.rec.lang == 'en-US' || lang == 'D' && this.rec.lang == 'de-DE') {
			console.log('language already set to', lang);
			return;
		} else if (this.isRunning) {
			this.languageChangeHandler = () => this.rec.lang = (lang == 'E' ? 'en-US' : 'de-DE');
		} else this.rec.lang = (lang == 'E' ? 'en-US' : 'de-DE');
		// let wasRunning = this.interrupt();
		// if (wasRunning) console.log('recorder has been interrupted to change language!');
		// //else console.log('recorder was NOT running!')
		// this.rec.lang = (lang == 'E' ? 'en-US' : 'de-DE');
	}
}
class Speaker {
	constructor(defaultVolume = .1) {
		this.timeout1, this.timeout2;
		this.defaultVolume = defaultVolume;
		let awaitVoices = new Promise(resolve =>
			speechSynthesis.onvoiceschanged = resolve)
			.then(this.initVoices.bind(this));
	}
	initVoices() {
		this.voices = speechSynthesis.getVoices().sort(function (a, b) {
			const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
			if (aname < bname) return -1;
			else if (aname == bname) return 0;
			else return +1;
		});
	}

	static get VOICES() {
		return {
			david: 'Microsoft David Desktop - English',
			zira: 'Microsoft Zira Desktop - English',
			us: 'Google US English',
			ukFemale: 'Google UK English Female',
			ukMale: 'Google UK English Male',
			deutsch: 'Google Deutsch',
		};
	}
	say(text, r = .5, p = .8, v = .5, interrupt = true, voiceDescriptor, callback) {
		if (v < 1) v = this.defaultVolume;//.15;
		if (speechSynthesis.speaking) {
			if (!interrupt) return;
			//console.error('speechSynthesis.speaking');
			speechSynthesis.cancel();
			if (isdef(this.timeout1)) clearTimeout(this.timeout1);
			this.timeout1 = setTimeout(() => this.say(text, r, p, v, interrupt, voiceDescriptor, callback), 500);
			return;
		} else {
			this.utter(text, r, p, v, voiceDescriptor, callback);
		}

	}

	utter(text, r = .5, p = .8, v = .5, voiceDesc, callback = null) {

		speechSynthesis.cancel();
		var u = new SpeechSynthesisUtterance();
		//u.text = text;
		let [voiceKey, voice] = findSuitableVoice(text, voiceDesc);
		u.text = sepWords(text, voiceKey);// 'Hi <silence msec="2000" /> Flash!'; //text.toLowerCase();
		u.rate = r;
		u.pitch = p;
		u.volume = v;
		u.voice = voice;

		u.onend = ev => {
			this.isSpeakerRunning = false;
			if (callback) callback();
		};

		if (isINTERRUPT) return; else this.isSpeakerRunning = true;
		speechSynthesis.speak(u);
	}

}

function isSimilar(reqAnswer, answer, lang) {
	if (answer == reqAnswer) return true;
	else if (differInAtMost(reqAnswer, answer, 1)) return true;
	else if (isSimilarSound(reqAnswer, answer, lang)) return true;
	else return false;
}
//#region helpers: TODO: put them in helpers and make syllabify a proper function


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
function differInAtMost(req, given, n = 1) {

	let diffs = levDist(req, given);

	return diffs <= n;
	//der reihe nach jeden buchstaben aus dem given rausnehmen
	//given soll 
	//for(const)
}
function isSimilarSound(reqAnswer, s, lang) {
	let sParts = s.split(' ');
	let aParts = reqAnswer.split(' ');
	if (isTimeString(s)) s = convertTimesAndNumbersToWords(s);
	if (isTimeString(reqAnswer)) reqAnswer = convertTimesAndNumbersToWords(reqAnswer);
	if (sParts.length != aParts.length) return false;
	for (let i = 0; i < sParts.length; i++) {
		if (!soundsSimilar(sParts[i], aParts[i], lang)) return false;
	}
	return true;
}
function levDist(s, t) {
	var d = []; //2d matrix

	// Step 1
	var n = s.length;
	var m = t.length;

	if (n == 0) return m;
	if (m == 0) return n;

	//Create an array of arrays in javascript (a descending loop is quicker)
	for (var i = n; i >= 0; i--) d[i] = [];

	// Step 2
	for (var i = n; i >= 0; i--) d[i][0] = i;
	for (var j = m; j >= 0; j--) d[0][j] = j;

	// Step 3
	for (var i = 1; i <= n; i++) {
		var s_i = s.charAt(i - 1);

		// Step 4
		for (var j = 1; j <= m; j++) {

			//Check the jagged ld total so far
			if (i == j && d[i][j] > 4) return n;

			var t_j = t.charAt(j - 1);
			var cost = (s_i == t_j) ? 0 : 1; // Step 5

			//Calculate the minimum
			var mi = d[i - 1][j] + 1;
			var b = d[i][j - 1] + 1;
			var c = d[i - 1][j - 1] + cost;

			if (b < mi) mi = b;
			if (c < mi) mi = c;

			d[i][j] = mi; // Step 6

			//Damerau transposition
			if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
				d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
			}
		}
	}
	// Step 7
	return d[n][m];
}
function soundsSimilar(w1, w2, lang) {
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
	if (lang == 'D' && isdef(germanNumbers[a1]) && germanNumbers[a1] == germanNumbers[a2]) return true;
	if (a1.length != a2.length) return false;
	for (let i = 0; i < a1.length; i++) {
		let s1 = a1[i];
		let s2 = a2[i];
		if (s1 == s2) return true;
		let x1 = stringAfterLeadingConsonants(s1);
		let x2 = stringAfterLeadingConsonants(s2);
		if (lang == 'E' && 'ou'.includes(x1) && 'ou'.includes(x2) && x1.substring(1) == x2.substring(1)) return true;
		if (lang == 'E' && 'oa'.includes(x1) && 'ao'.includes(x2) && x1.substring(1) == x2.substring(1)) return true;
		if (lang == 'E' && x1.replace('ee', 'i') == x2.replace('ee', 'i')) return true;
		if (lang == 'E' && x1.replace('ea', 'ai') == x2.replace('ea', 'ai')) return true;
		if (lang == 'E' && x1.replace('au', 'o') == x2.replace('au', 'o')) return true;
	}
	return false;
}
function stringAfterLeadingConsonants(s) {
	let regexpcons = /^([^aeiou])+/g;
	let x = s.match(regexpcons);
	return x ? s.substring(x[0].length) : s;
}
