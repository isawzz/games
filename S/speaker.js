const voiceNames = {
	david: 'Microsoft David Desktop - English',
	zira: 'Microsoft Zira Desktop - English',
	us: 'Google US English',
	ukFemale: 'Google UK English Female',
	ukMale: 'Google UK English Male',
	deutsch: 'Google Deutsch',
};
function synthVoice(text, r = .5, p = .8, v = .5, desc) {
	if (isdef(synth) && synth.speaking) {
		//console.error('speechSynthesis.speaking');
		setTimeout(() => say(text, r, p, v, desc), 500);
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
				// utterance.onboundary = function (event) {
				// 	console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.\n', event);
				// }


				setTimeout(() => say(text, r, p, v, desc), 500);
			});

	} else {
		say(text, r, p, v, desc);
	}

}
function findSuitableVoice(text, desc) {
	//desc ... random | key in voiceNames | starting phrase of voices.name
	//console.log(typeof voices, voices)
	let voiceKey = 'david';
	if (currentLanguage == 'D') {
		voiceKey = 'deutsch';
	} else if (text.includes('bad')) {
		voiceKey = 'zira';
	} else if (desc == 'random') {
		voiceKey = chooseRandom(['david', 'zira', 'us', 'ukFemale', 'ukMale']);
	} else if (isdef(voiceNames[desc])) {
		voiceKey = desc;
	} else if (isdef(desc)) {
		let tryVoiceKey = firstCondDict(voiceNames, x => startWith(x, desc));
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
function say(text, r = .5, p = .8, v = .5, desc) {
	// rate 0.1 to 10
	let [voiceKey, voice] = findSuitableVoice(text, desc);
	utterance.text = sepWords(text, voiceKey);// 'Hi <silence msec="2000" /> Flash!'; //text.toLowerCase();
	utterance.rate = r;
	utterance.pitch = p;
	utterance.volume = v;
	utterance.voice = voice;

	//console.log('\nsynth',synth,'\nvoices',voices,'\nutterance',utterance)
	setTimeout(() => synth.speak(utterance), 200);
}
function sepWords(text, voiceKey, s = '<silence msec="200" />') {
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


//#region old
function setValues(numRate, numPitch, voiceIndex) {
	voiceSelect.selectedIndex = voiceIndex;
	rate.value = numRate;
	rateValue.textContent = rate.value;
	pitch.value = numPitch;
	pitchValue.textContent = pitch.value;
}

function populateVoiceList() {
	voices = synth.getVoices().sort(function (a, b) {
		const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
		if (aname < bname) return -1;
		else if (aname == bname) return 0;
		else return +1;
	});
	//console.log(voices)
	var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
	voiceSelect.innerHTML = '';
	//console.log(voices)
	for (i = 0; i < voices.length; i++) {
		var option = document.createElement('option');
		option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

		if (voices[i].default) {
			option.textContent += ' -- DEFAULT';
		}

		option.setAttribute('data-lang', voices[i].lang);
		option.setAttribute('data-name', voices[i].name);
		voiceSelect.appendChild(option);
	}
	voiceSelect.selectedIndex = selectedIndex;
}


function say1(s, r = 0.6, p = 0.8, iVoice = 10) {
	utterThis.pitch = pitch.value;
	utterThis.rate = rate.value;

	setValues(r, p, iVoice);

	//if (nundef(synth)) initSpeaker();
	inputTxt.value = s.toLowerCase();
	speak();
}

function speak() {
	//if (nundef(synth)) initSpeaker();
	if (synth.speaking) {
		console.error('speechSynthesis.speaking');
		return;
	}
	if (inputTxt.value !== '') {
		var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
		utterThis.onend = function (event) {
			console.log('SpeechSynthesisUtterance.onend');
		}
		utterThis.onerror = function (event) {
			console.error('SpeechSynthesisUtterance.onerror');
		}
		var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
		for (i = 0; i < voices.length; i++) {
			if (voices[i].name === selectedOption) {
				utterThis.voice = voices[i];
				break;
			}
		}
		utterThis.pitch = pitch.value;
		utterThis.rate = rate.value;
		synth.speak(utterThis);
	}
}


function initSpeaker() {

	synth = window.speechSynthesis;

	inputForm = document.querySelector('form');
	inputTxt = document.querySelector('.txt');
	voiceSelect = document.querySelector('select');

	pitch = document.querySelector('#pitch');
	pitchValue = document.querySelector('.pitch-value');
	rate = document.querySelector('#rate');
	rateValue = document.querySelector('.rate-value');

	voices = [];

	populateVoiceList();

	inputForm.onsubmit = function (event) {
		event.preventDefault();

		speak();

		inputTxt.blur();
	}

	pitch.onchange = function () {
		pitchValue.textContent = pitch.value;
	}

	rate.onchange = function () {
		rateValue.textContent = rate.value;
	}

	voiceSelect.onchange = function () {
		speak();
	}

	setTimeout(reInitSpeaker, 1000);

}
function reInitSpeaker() {
	if (speechSynthesis.onvoiceschanged !== undefined) {
		speechSynthesis.onvoiceschanged = populateVoiceList;
		console.log('ready');
		setTimeout(step3, 1000)
		//console.log(voices)
	}
}
function step3() {
	if (immediateStart) { bStart.innerHTML = 'NEXT'; onClickStartButton(); }
}

//#endregion







