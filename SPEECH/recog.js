var finalResult, emoGroup, emoDict, lang, matchingWords, recognition;
var status = 'init'; // init | wait | prompt | result | error | nomatch | end

function speech00(lang, matchingWords) {

	// if (!('webkitSpeechRecognition' in window)) { alert("Unable to use the Speech Recognition API"); }
	// if (!window.hasOwnProperty("webkitSpeechRecognition")) { alert("Unable to use the Speech Recognition API"); }
	if (typeof (webkitSpeechRecognition) != "function") { alert("Unable to use the Speech Recognition API"); }
	//else console.log('speech is supported! lang', lang, 'words', matchingWords);

	recognition = new webkitSpeechRecognition(); // Create a new instance of SpeechRecognition
	recognition.continuous = true; // Define whether continuous results are returned for each recognition or only a single result. Defaults to false
	recognition.interimResults = true; // Controls whether interim results should be returned Interim results are results that are not yet final (e.g. the SpeechRecognitionResult.isFinal property is false.)
	recognition.lang = isEnglish(lang) ? 'en-US' : 'de-DE'; //'en-US'; // Returns and sets the language of the current SpeechRecognition.  If not specified, this defaults to the HTML lang attribute value or the user agent's language setting if that isn't set either. There are a lot of supported languages (go to supported languages at the end of the article)

	addErrorHandler();
	addStartHandler();
	addEndHandler();
	addResultHandler();

	// start the speech recognition
	recognition.start();

}
function addResultHandler() {
	// This event is triggered when the speech recognition service
	// returns a result — a word or phrase has been positively 
	//recognized and this has been communicated back to your app
	recognition.onresult = function (event) {
		var interim_transcript = '';
		var final_transcript = '';

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
			//show('bStart');
			let word = finalResult = final_transcript;
			let correct = evaluateAnswer(word);
			setStatus('result');
			console.log('Result received: ' + word); // + '.\nConfidence: ' + event.results[0][0].confidence);
			nextWord(correct);

		}
	};
}
function addEndHandler() {
	// run when the speech recognition service has disconnected
	// (automatically or forced with recognition.stop())
	recognition.onend = function () {
		console.log('Speech recognition service disconnected');
	};
}
function addStartHandler() {
	// will run when the speech recognition 
	// service has began listening to incoming audio 
	recognition.onstart = function () {
		//console.log('Speech recognition service has started');
	};
}
function addErrorHandler() {
	// Fired when an error happens with the speech recognition
	// With all the following erro codes:
	// info-blocked
	// info-denied
	// no-speech
	// aborted
	// audio-capture
	// network
	// not-allowed
	// service-not-allowed
	// bad-grammar
	// language-not-supported
	// recognition_overlap 
	recognition.onerror = function (event) {
		console.error(event);
	};

}












