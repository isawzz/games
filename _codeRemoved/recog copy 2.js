function record(lang, best) {
	console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
	// var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
	// var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
	// var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

	var colors = ['aqua', 'azure', 'beige', 'bisque',];
	colors = ['black', 'blue', 'brown', 'chocolate', 'coral', 'crimson'];
	//colors = ['cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
	colors.push(best);
	var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

	var recognition = new webkitSpeechRecognition();
	var speechRecognitionList = new webkitSpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	recognition.continuous = true;//false;
	recognition.lang = isEnglish(lang) ? 'en-US' : 'de-DE';
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;

	

	recognition.onstart = ()=>{
		console.log('recognition has been started!')
		MicrophoneStart();

	};
	recognition.onresult = function(event) {
		// The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
		// The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
		// It has a getter so it can be accessed like an array
		// The first [0] returns the SpeechRecognitionResult at the last position.
		// Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
		// These also have getters so they can be accessed like arrays.
		// The second [0] returns the SpeechRecognitionAlternative at position 0.
		// We then return the transcript property of the SpeechRecognitionAlternative object
		var color = event.results[0][0].transcript;
		console.log('Result received: ' + color + '.');
		console.log('Confidence: ' + event.results[0][0].confidence);
	}
	
	recognition.onspeechend = function() {
		console.log('recognition ended')
		recognition.stop();
	}
	
	recognition.onnomatch = function(event) {
		console.log("I didn't recognise that color.");
	}
	
	recognition.onerror = function(event) {
		console.log('Error occurred in recognition: ' + event.error);
	}
}




//region Microphone

function mMicrophone(dParent) {
	let d = mDiv(dParent);
	d.innerHTML = '🎤';
	//let style = { bg: '#FF413680', rounding: '50%', fz: 50, padding: 5 };
	let bg = getSignalColor();
	let style = { bg: bg, rounding: '50%', fz: 50, padding: 5, transition: 'opacity .35s ease-in-out' };
	mStyleX(d, style);
	mLinebreak(dParent);
	return d;
}
function MicrophoneStart() {
	if (RecogOutput) console.log('* mic start')
	//show(MicrophoneUi);
	MicrophoneUi.style.opacity = 1;

	//MicrophoneShow();
	//mClass(MicrophoneUi, 'blink');

	//bg: '#FF413680'
}
function MicrophoneStop() {
	//mRemoveClass(MicrophoneUi, 'blink');
	if (RecogOutput) console.log('* mic end')
	// hide(MicrophoneUi);
	MicrophoneUi.style.opacity = .31;
}
function MicrophoneHide() { MicrophoneStop(); } //MicrophoneUi.style.opacity=0;}
function MicrophoneShow() { MicrophoneStart(); }//MicrophoneUi.style.opacity=1;}
//#endregion

function record01(lang, best) {
	speech01(lang,best);
}
function speech01(lang,word) {
	if (typeof (webkitSpeechRecognition) != "function") { alert("Unable to use the Speech Recognition API"); }

	recognition = new webkitSpeechRecognition() || new SpeechRecognition();;
	//var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
	var grammar = `#JSGF V1.0; grammar colors; public <color> = ${word} | aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;`
	//var recognition = new SpeechRecognition();
	var speechRecognitionList = new webkitSpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	recognition.continuous = false;
	recognition.lang = 'en-US';
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;

	// recognition.continuous = true;
	// recognition.interimResults = true;
	// recognition.maxAlternatives = 5;

	recognition.lang = isEnglish(lang) ? 'en-US' : 'de-DE';

	recognition.onstart =()=>{console.log('rec onstart')}
	recognition.onaudiostart =()=>{console.log('rec onaudiostart')}
	recognition.onaudioend =()=>{console.log('rec onaudioend')}
	recognition.onend =()=>{console.log('rec onend')}
	recognition.onerror =()=>{console.log('rec onerror')}
	recognition.onnomatch =()=>{console.log('rec onnomatch')}
	recognition.onresult =()=>{console.log('rec onresult')}
	recognition.onsoundend =()=>{console.log('rec onsoundend')}
	recognition.onsoundstart =()=>{console.log('rec onsoundstart')}
	recognition.onspeechend =()=>{console.log('rec onspeechend')}
	recognition.onspeechstart =()=>{console.log('rec onspeechstart')}

	recognition.start();

}

