var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var finalResult, done, words, grammar, lang, matchingWords, recognition, speechRecognitionList;
var status = 'init'; // init | wait | prompt | result | error | nomatch | end

//#region trial 1
function speechWrapper() {
	//console.log('matchingWords',matchingWords);
	if (isdef(recognition)) {
		// recognition.abort();
		// console.log('aborting...')
		// setTimeout(speechWrapper,1000);
		// return;
	}else {
		recognition = new SpeechRecognition();
		recognition.onresult = onSpeechResult; // function (event) { let word = event.results[0][0].transcript; evaluateAnswer(word); setStatus('result'); console.log('Result received: ' + word + '.\nConfidence: ' + event.results[0][0].confidence); }
		// recognition.onspeechend = function () { console.log('onSpeechEnd happened!'); let st = status; if (st == 'wait') onClickTryAgain(); }
		// recognition.onnomatch = function (event) { console.log('onNoMatch happened!'); setStatus('nomatch'); }
		// recognition.onerror = function (event) { console.log('onError happened:', event.error); } //mode = 'write'; setStatus('error'); switchToMode('write'); }
	}

	words = matchingWords;
	grammar = '#JSGF V1.0; grammar colors; public <color> = ' + words.join(' | ') + ' ;'
	speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList; recognition.continuous = false; recognition.lang = isEnglish(lang) ? 'en-US' : 'de-DE'; recognition.interimResults = false; recognition.maxAlternatives = 1;

	console.log('starting new instance!')
	recognition.start();
}


function speechEngineInit() {
	if (isdef(recognition)) recognition.abort();

	recognition = new SpeechRecognition();
	recognition.onresult = function (event) {
		let word = event.results[0][0].transcript;
		// resultMessage.textContent = 'Result received: ' + word + '.';
		console.log('Result received: ' + word + '.');
		evaluateAnswer(word);
		setStatus('result');

		//bg.style.backgroundColor = color;
		console.log('Confidence: ' + event.results[0][0].confidence);
		recognition.stop();
		nextWord();

	}

	recognition.onspeechend = function () {
		console.log('onSpeechEnd happened!');
		if (status == 'wait') {
			console.log('status wait and onspeechend happened!!!')
			//speechEngineGo(lang, matchingWords);
		}
		//resultMessage.textContent = 'recognition ENDED!!!';
		setStatus('end');
		//if (!done) { recognition.stop(); }

	}

	recognition.onnomatch = function (event) {
		console.log('onNoMatch happened!');
		//resultMessage.textContent = "I didn't recognise that word! - try again";
		//da muss ein hint kommen!!!
		recognition.stop();
		setStatus('nomatch');
	}

	recognition.onerror = function (event) {
		console.log('onError happened!');
		resultMessage.textContent = 'Error occurred in recognition: ' + event.error;
		recognition.stop();
		interactMode = 'write';
		setStatus('error');
		switchToMode('write');
	}


	speechEngineGo(lang, matchingsWords);

}
function speechEngineGo(lang, matchingWords) {
	//recognition.abort();
	words = matchingWords;
	grammar = '#JSGF V1.0; grammar colors; public <color> = ' + words.join(' | ') + ' ;'
	speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	recognition.continuous = false;
	recognition.lang = isEnglish(lang) ? 'en-US' : 'de-DE'; //'en-US';
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;

	done = false;
	recognition.start();

}

//#endregion

//#region trial 2
function simpleSpeech() {
	if (nundef(recognition)) {
		recognition = new SpeechRecognition();
		recognition.onresult = onSpeechResult;
		recognition.onerror = onOther;recognition.onspeechend = onOther;
	}

	words = matchingWords;
	grammar = '#JSGF V1.0; grammar colors; public <color> = ' + words.join(' | ') + ' ;'
	speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList; recognition.continuous = false; recognition.lang = isEnglish(lang) ? 'en-US' : 'de-DE'; recognition.interimResults = false; recognition.maxAlternatives = 1;
	recognition.start();
	setTimeout(ifNoResult,10000);
}
function ifNoResult(){
	if (status == 'wait') {
		//need to show button again!!!
		show('bStart');
		setStatus('hallo')
	}
}
function onOther(ev){
	console.log('event',ev);
	setTimeout(ifNoResult,5000);
}
function onSpeechResult(ev){
	let word = event.results[0][0].transcript; 
	let correct = evaluateAnswer(word); 
	setStatus('result'); 
	console.log('Result received: ' + word + '.\nConfidence: ' + event.results[0][0].confidence);
	nextWord(correct);
}
//#endregion

//#region trial 3: class
// class SpeechWrapper {
// 	constructor(http: Http, service: SpeechRecognitionService, links: LinksService) {

// 		var recognizing; // will get bool values to verify if recognition is active

// 		this.service.onresult = (e) => {
// 			this.message = e.results[0].item(0).transcript;
// 		};

// 		this.service.onstart = function () {
// 			recognizing = true;
// 		};

// 		this.service.onaudiostart = function () {
// 			recognizing = true;
// 		};

// 		this.service.onerror = function (event) {
// 			recognizing = false;
// 		};


// 		this.service.onsoundstart = function () {
// 			recognizing = true;
// 		};

// 		this.service.onsoundstart = function () {
// 			recognizing = true;
// 		};


// 		this.record = () => {
// 			this.service.start();
// 			setInterval(root.ongoing_recording(), 3500);
// 		};

// 		var root = this;
// 		var speech = '';

// 		this.stop_recording = () => {
// 			this.service.stop();
// 		};


// 		this.ongoing_recording = () => {

// 			setTimeout(function () {
// 				if (recognizing === true) {
// 					root.service.stop();
// 					root.service.onend = (e) => {
// 						recognizing = false;
// 						speech = root.message;
// 						var sentence = document.createElement('span');
// 						sentence.innerHTML = speech + " ";
// 						document.body.appendChild(sentence);
// 					}
// 				}
// 			}, 3500);

// 			setTimeout(function () {
// 				if (recognizing === false) {
// 					root.service.start();
// 				}
// 			}, 3510);
// 		};



// 	}


// 	start() {
// 		this.service.start();
// 	}


// 	stop() {
// 		this.service.stop();
// 	}


// 	record() {
// 		this.record();
// 	}


// 	stop_recording() {
// 		this.stop_recording();
// 	}

// 	ongoing_recording() {
// 		this.ongoing_recording();
// 	}


// }

//#endregion




