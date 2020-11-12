const voiceNames = {
	david: 'Microsoft David Desktop - English',
	zira: 'Microsoft Zira Desktop - English',
	us: 'Google US English',
	ukFemale: 'Google UK English Female',
	ukMale: 'Google UK English Male',
	deutsch: 'Google Deutsch',
};
var timeout1, timeout2;


function say(text, r = .5, p = .8, v = .5, interrupt=true, voiceDescriptor, callback) {
	if (isdef(synth) && synth.speaking) {
		if (!interrupt) return;
		//console.error('speechSynthesis.speaking');
		synth.cancel();
		if (isdef(timeout1)) clearTimeout(timeout1);
		timeout1 = setTimeout(() => say(text, r, p, v,interrupt, voiceDescriptor, callback), 500);
		return;
	} else if (nundef(voices)) {
		//console.error('gibt noch KEINE voices!!!!!')
		const awaitVoices = new Promise(resolve =>
			window.speechSynthesis.onvoiceschanged = resolve)
			.then(() => {
				synth = window.speechSynthesis;
				voices = synth.getVoices().sort(function (a, b) {
					const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
					if (aname < bname) return -1;
					else if (aname == bname) return 0;
					else return +1;
				});

				utterance = new SpeechSynthesisUtterance();
				// utterance.onend = () => {
				// 	if (isdef(defaultFocusElement)) {
				// 		console.log('fel',defaultFocusElement,mBy(defaultFocusElement));
				// 		setTimeout(()=>mBy(defaultFocusElement).focus(),10);
				// 	}
				// };
				// utterance.onboundary = function (event) {
				// 	console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.\n', event);
				// }

				if (isdef(timeout1)) clearTimeout(timeout1);
				timeout1 = setTimeout(() => say(text, r, p, v,interrupt, voiceDescriptor, callback), 500);
			});

	} else {
		utter(text, r, p, v, voiceDescriptor, callback);
	}

}

// helpers
function utter(text, r = .5, p = .8, v = .5, voiceDesc, callback=null) {

	synth.cancel()
	var u = new SpeechSynthesisUtterance();
	//u.text = text;
	let [voiceKey, voice] = findSuitableVoice(text, voiceDesc);
	u.text = sepWords(text, voiceKey);// 'Hi <silence msec="2000" /> Flash!'; //text.toLowerCase();
	u.rate = r;
	u.pitch = p;
	u.volume = v;
	u.voice = voice;
	
	// u.onstart = function (event) {
	// 		//console.log(33);
	// };
	u.onend = function (event) {
			//if (isdef(SpeakerCallback)) console.log('u.onend callback',SpeakerCallback);
			isSpeakerRunning = false;
			if (callback) callback();
	};
	
	if (isINTERRUPT) return;else isSpeakerRunning=true;
	speechSynthesis.speak(u);
	//console.log(u);
	
	


	// // rate 0.1 to 10
	// let [voiceKey, voice] = findSuitableVoice(text, voiceDesc);
	// utterance.text = sepWords(text, voiceKey);// 'Hi <silence msec="2000" /> Flash!'; //text.toLowerCase();
	// utterance.rate = r;
	// utterance.pitch = p;
	// utterance.volume = v;
	// utterance.voice = voice;

	// utterance.onend = callback;

	// //console.log('\nsynth',synth,'\nvoices',voices,'\nutterance',utterance)
	// if (isdef(timeout2)) {		clearTimeout(timeout2);	}
	// timeout2 = setTimeout(() => { synth.speak(utterance); focus(mBy(defaultFocusElement)); }, 200);
}
function sepWords(text, voiceKey, s = ''){ //<silence msec="200" />') {
	text = text.toLowerCase();
	//console.log(voice,'\nlang=',voice.lang.trim(),'\ntrue or false=',voice.lang.trim()=='en-US');
	//console.log('voiceKey',voiceKey)
	if (voiceKey == 'zira') {

		return text; // + ' hello <audio src="/assets/sounds/down.mp3">didnt get your MP3 audio file</audio> no way!';
	} else if (startsWith(voiceKey, 'u')) { return text; }
	let words = text.split(' ');
	//s='? ';//' - ';
	text = words.join(' '); text += s;
	//console.log('text', text)
	return text;
}


function findSuitableVoice(text, voiceDesc) {
	//desc ... random | key in voiceNames | starting phrase of voices.name
	//console.log(typeof voices, voices)
	let voiceKey = 'david';
	if (currentLanguage == 'D') {
		voiceKey = 'deutsch';
	} else if (text.includes('bad')) {
		voiceKey = 'zira';
	} else if (voiceDesc == 'random') {
		voiceKey = chooseRandom(['david', 'zira', 'us', 'ukFemale', 'ukMale']);
	} else if (isdef(voiceNames[voiceDesc])) {
		voiceKey = voiceDesc;
	} else if (isdef(voiceDesc)) {
		let tryVoiceKey = firstCondDict(voiceNames, x => startWith(x, voiceDesc));
		if (tryVoiceKey) voiceKey = tryVoiceKey;
	}
	let voiceName = voiceNames[voiceKey];
	let voice = firstCond(voices, x => startsWith(x.name, voiceName));
	// console.log('============================')
	// console.log(Array.isArray(voices));
	// for(const v of voices){		console.log(v.name,voiceName,v.name==voiceName);	}
	// console.log('voices:',voices.map(x=>x.name))
	// console.log('THE VOICE IS',voiceName,voice);
	// voices.map(x => console.log(x.name));
	// console.log('===>the voice is', voice);
	return [voiceKey, voice];
}








