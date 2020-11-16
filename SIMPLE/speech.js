class SpeechFeature {
	constructor(defaultVolume) {
		this.recorder = new Recorder();
		this.speaker = new Speaker(defaultVolume);
		console.log(this.recorder)
	}
	setRecordingLanguage(lang) {
		this.recorder.setLanguage(lang);
	}
	record({ onStart, delayStart, onFinal, delayFinal, onEmpty, delayEmpty, retry = 0 } = {}) {
		this.recorder.start(onStart, delayStart, onFinal, delayFinal, onEmpty, delayEmpty, retry);
	}
	say(text) { this.speaker.say(text) }
	recognize(word, onMatch, onNoMatch) {
		this.record({
			onFinal: (r, c) => {
				r = r.toLowerCase();
				word = word.toLowerCase();
				if (r == word) onMatch(r, c); else onNoMatch(r, c);
			},
			onEmpty: (r,c) => onNoMatch(r,c)
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
			this.isRunning = false;
			console.log('recorder ended!!');
			if (!this.isFinal && this.emptyResultHandler) this.timeoutEmpty = setTimeout(() => this.emptyResultHandler(this.result, this.confidence), this.delayAfterEmptyResult);
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
			console.log('language already set to', lang)
			return;
		}
		let wasRunning = this.interrupt();
		if (wasRunning) console.log('recorder has been interrupted to change language!');
		else console.log('recorder was NOT running!')
		this.rec.lang = (lang == 'E' ? 'en-US' : 'de-DE');
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


//#region tests

function testRecognize(w='hello'){
	Speech.recognize(w,(r,c)=>console.log('JA!',w,'=',r,'('+c+')'),(r,c)=>console.log('NEIN!!!!',w,'!=',r,'('+c+')'));

}

function testStartAgainAfterStartingRecorder() {
	//assumes existence of global Speech
	let onRecorderStart = () => Speech.record({ onStart: () => console.log('2!'), delayStart: 2000, retry: true });
	Speech.record({ onStart: onRecorderStart, delayStart: 2000, retry: true });
}

function testChangingLangAfterStartingRecorder() {
	//assumes existence of global Speech
	let onRecorderStart = () => Speech.setRecordingLanguage('D');
	Speech.record({ onStart: onRecorderStart, delayStart: 2000, retry: true });
}

//#endregion


