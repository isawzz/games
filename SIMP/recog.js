var isRunning = false;
var callback = null;
var recognition;
var grammar;

function record(lang, best) {
	let wordlist = ['du', 'bist', 'ein', 'vogel', best];
	if (!isdef(recognition)) {
		speech00(lang);
		setTimeout(record(lang, wordlist), 1000);
		return;
	}
	setVocabulary(wordlist);
	if (isdef(recognition) && isRunning) {
		console.log('stopping recog');
		recordCallback = () => record(lang, wordlist);
		recognition.stop();
	} else {
		isRunning = true;
		recognition.start();
	}
}

function addResultHandler() {
	// This event is triggered when the speech recognition service
	// returns a result — a word or phrase has been positively 
	//recognized and this has been communicated back to your app
	recognition.onresult = function (event) {
		var interim_transcript = '';
		var final_transcript = '';
		hide('dRecord');
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			// Verify if the recognized text is the last with the isFinal property
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
			} else {
				interim_transcript += event.results[i][0].transcript;
			}
		}

		// Choose which result may be useful for you
		// console.log("Interim: ", interim_transcript);
		// console.log("Final: ", final_transcript);
		// console.log("Simple: ", event.results[0][0].transcript);

		if (isdef(final_transcript) && !isEmpty(final_transcript)) {
			recognition.stop();
			let word = finalResult = final_transcript;
			console.log('===>', '\nbest', bestWord, '\ngot', word); // + '.\nConfidence: ' + event.results[0][0].confidence);
			evaluate(word);

		}
	};
}
function addStartHandler() {
	recognition.onstart = function () {
		recordCallback = null;
		isRunning = true;
		show('dRecord');
		console.log('recog start', isRunning)
	};
}
function addEndHandler() {
	recognition.onend = function () {
		isRunning = false;
		console.log('recog end', isRunning);
		if (recordCallback) recordCallback();
		else hide(dRecord);
	};
}
function addErrorHandler() {
	recognition.onerror = function (event) {
		isRunning = false;
		console.error(event);
		if (recordCallback) recordCallback();
		hide(dRecord);
	};
}

function setVocabulary(words) {
	var grammar = '#JSGF V1.0; grammar colors; public <color> = hallo';
	for (const w of words) {
		grammar += ' | ' + w; ///aqua | azure | beige ... ;'
	}
	var speechRecognitionList = new webkitSpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
}

function speech00(lang) {
	if (typeof (webkitSpeechRecognition) != "function") { alert("Unable to use the Speech Recognition API"); }

	recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.maxAlternatives = 5;

	recognition.lang = isEnglish(lang) ? 'en-US' : 'de-DE';

	addErrorHandler();
	addStartHandler();
	addEndHandler();
	addResultHandler();

	//recognition.start();

}











