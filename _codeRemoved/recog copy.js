var interim_transcript = '';
var final_transcript = '';
var final_confidence, final_confidence2, final_confidence_sum, final_num;
var interim_confidence, interim_confidence2, interim_confidence_sum, interim_num;
var isRunning = false;
var callback = null;
var recognition;
var grammar;
var hasGotResult, hasGotFinalResult;

function mMicrophone(dParent) {
	let d = mDiv(dParent);
	d.innerHTML = '🎤';
	let style = { bg: '#FF413680', rounding: '50%', fz: 50, padding: 5 };
	mStyleX(d, style);
	mLinebreak(dParent);
	return d;
}

function isGameWithSpeechRecognition() { return ['gSayPic', 'gSayPicAuto'].includes(currentGame); }

function record(lang, best) {
	//TODO: HACK!!!!!!!
	if (!isGameWithSpeechRecognition()) return;
	let wordlist = ['du', 'bist', 'ein', 'vogel', best];
	if (!isdef(recognition)) {
		speech00(lang);
		setTimeout(record(lang, wordlist), 3000);
		return;
	}
	setVocabulary(wordlist);
	if (isdef(recognition) && isRunning) {
		console.log('.......................stopping recog');
		recordCallback = () => record(lang, wordlist);
		recognition.stop();
	} else {
		isRunning = true;
		recognition.start();
	}
}
function MicrophoneStart() {
	if (RecogOutput) console.log('* mic start')
	show(MicrophoneUi);
	//mClass(MicrophoneUi, 'blink');
}
function MicrophoneStop() {
	//mRemoveClass(MicrophoneUi, 'blink');
	hide(MicrophoneUi);
	//hide('dRecord');
}


function addStartHandler() {
	recognition.onstart = function () {
		if (RecogOutput) console.log('* recog.onstart')
		interim_transcript = '';
		final_transcript = '';
		final_confidence = final_confidence2 = final_confidence_sum = final_num = 0;
		interim_confidence = interim_confidence2 = interim_confidence_sum = interim_num = 0;
		hasGotResult = hasGotFinalResult = false;
		recordCallback = null;
		if (!isGameWithSpeechRecognition()) return;
		isRunning = true;
		MicrophoneStart();
	};
}
function setSpeechResult(transcript, conf1, conf2) {
	Goal.reqAnswer = bestWord;
	Goal.answer = transcript;
	Goal.confidence = conf1;
	Goal.confidence2 = conf2;
	if (RecogOutput) console.log('* ===>', 'best', bestWord, 'got', transcript + '\nConfidence: ' + conf1 + '/' + conf2);
}
function addResultHandler() {
	recognition.onresult = function (event) {
		if (!isGameWithSpeechRecognition()) {
			if (RecogOutput) console.log('*event recog.onresult triggered but not a game with speech recog!!!')
			return;
		}
		MicrophoneStop();
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
				final_confidence_sum += event.results[i][0].confidence;
				final_num += 1;
			} else {
				interim_transcript += event.results[i][0].transcript;
				interim_confidence_sum += event.results[i][0].confidence;
				interim_num += 1;
			}
		}
		if (isdef(final_transcript) && !isEmpty(final_transcript)) {
			final_confidence = Goal.confidence = event.results[0][0].confidence;
			final_confidence2 = final_confidence_sum / final_num;
			hasGotFinalResult = true;
			final_confidence = event.results[0][0].confidence;
			recognition.stop();
			setSpeechResult(final_transcript, final_confidence, final_confidence2);
			evaluate(final_transcript);
		} else if (isdef(interim_transcript) && !isEmpty(interim_transcript)) {
			interim_confidence = event.results[0][0].confidence;
			interim_confidence2 = interim_confidence_sum / interim_num;
		} else {
			if (RecogOutput) console.log('* got result but final and interim are empty!')
		}
	};
}
function addEndHandler() {
	recognition.onend = function () {
		if (!isGameWithSpeechRecognition()) return;
		if (RecogOutput) console.log('* recog.onend')
		isRunning = false;
		if (recordCallback) {
			recordCallback();
		} else if (hasGotResult && !hasGotFinalResult) {
			if (RecogOutput) console.log('* recog.onend: got interim only', interim_transcript);
			setSpeechResult(interim_transcript, interim_confidence, interim_confidence2);
			evaluate(interim_transcript);
		} else if (!hasGotResult) {
			console.log('* never got result!!!');
			if (OnMicrophoneProblem) OnMicrophoneProblem();
			else evaluate('');
			//activateUi();
		} else {
			if (RecogOutput) console.log('* recog.onend hasGotResult', hasGotResult, final_transcript)
		}
		MicrophoneStop();
	};
}
function addErrorHandler() {
	recognition.onerror = function (event) {
		if (!isGameWithSpeechRecognition()) return;
		isRunning = false;
		if (RecogOutput) console.error(event);
		if (OnMicrophoneProblem) OnMicrophoneProblem();
		if (recordCallback) recordCallback();
		MicrophoneStop();
		//hide('dRecord');
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











