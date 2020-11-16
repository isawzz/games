
function record(lang, best) {
	if ("speechSynthesis" in window) {
		// new speech recognition object
		console.log('Speech recognition supported 😊');
		//var recognition = new window.webkitSpeechRecognition();

		// This will run when the speech recognition service returns a result
		recognition.onstart = function () {
			console.log("Voice recognition started. Try speaking into the microphone.");
		};

		recognition.onresult = function (event) {
			var transcript = event.results[0][0].transcript;
			console.log(transcript);
			evaluate(transcript)
		};

		// start recognition
		recognition.start();
		//   .....
	} else {
		console.log("Speech recognition not supported 😢");
		// code to handle error
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

