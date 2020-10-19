
function populateVoiceList() {
	voices = synth.getVoices().sort(function (a, b) {
		const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
		if (aname < bname) return -1;
		else if (aname == bname) return 0;
		else return +1;
	});
	console.log('HALLO', voices);
	for (i = 0; i < voices.length; i++) {
		//console.log('voice',i,voices[i]);
		console.log(voices[i].name + ' (' + voices[i].lang + ')');
		continue;
		// var option = document.createElement('option');
		// option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

		// if(voices[i].default) {
		//   option.textContent += ' -- DEFAULT';
		// }

		// option.setAttribute('data-lang', voices[i].lang);
		// option.setAttribute('data-name', voices[i].name);
		// voiceSelect.appendChild(option);
	}
	// voiceSelect.selectedIndex = selectedIndex;
	//synth.lang=voices[20].lang;
	speak('hello, you are just fine!');
}

function speak(s) {
	if (synth.speaking) {
		console.error('speechSynthesis.speaking');
		return;
	}
	if (isdef(s)) {
		var utterThis = new SpeechSynthesisUtterance(s);
		utterThis.onend = function (event) {
			console.log('SpeechSynthesisUtterance.onend');
		}
		utterThis.onerror = function (event) {
			console.error('SpeechSynthesisUtterance.onerror');
		}
		utterThis.voice = voices[0]; //last(voices); //[20];
		// var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
		// for (i = 0; i < voices.length; i++) {
		// 	if (voices[i].name === selectedOption) {
		// 		utterThis.voice = voices[i];
		// 		break;
		// 	}
		// }
		// utterThis.pitch = pitch.value;
		utterThis.rate = 0.25;
		utterThis.pitch = 2;
		synth.speak(utterThis);
	}
}

function startSynthesis() {
	synth = window.speechSynthesis;
	populateVoiceList();
	if (speechSynthesis.onvoiceschanged !== undefined) {
		speechSynthesis.onvoiceschanged = populateVoiceList;
		console.log('______ voices', voices)
	}

}




//#region muell
function populateVoiceList_2() {
	voices = synth.getVoices().sort(function (a, b) {
		const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
		if (aname < bname) return -1;
		else if (aname == bname) return 0;
		else return +1;
	});
	console.log('HALLO', voices);
	for (i = 0; i < voices.length; i++) {
		//console.log('voice',i,voices[i]);
		console.log(voices[i].name + ' (' + voices[i].lang + ')');
		continue;
		// var option = document.createElement('option');
		// option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

		// if(voices[i].default) {
		//   option.textContent += ' -- DEFAULT';
		// }

		// option.setAttribute('data-lang', voices[i].lang);
		// option.setAttribute('data-name', voices[i].name);
		// voiceSelect.appendChild(option);
	}
	// voiceSelect.selectedIndex = selectedIndex;
	//synth.lang=voices[20].lang;

}
function populateVoiceList_1() {
	voices = synth.getVoices().sort(function (a, b) {
		const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
		if (aname < bname) return -1;
		else if (aname == bname) return 0;
		else return +1;
	});
	return;;// voices;
	var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
	voiceSelect.innerHTML = '';
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
function testTextToSpeech00() {
	var synth = window.speechSynthesis;
	var voices = synth.getVoices();

	var inputForm = document.querySelector('form');
	var inputTxt = document.querySelector('input');
	var voiceSelect = document.querySelector('select');

	for (var i = 0; i < voices.length; i++) {
		var option = document.createElement('option');
		option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
		option.value = i;
		voiceSelect.appendChild(option);
	}

	inputForm.onsubmit = function (event) {
		event.preventDefault();

		var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
		utterThis.voice = voices[voiceSelect.value];
		synth.speak(utterThis);
		inputTxt.blur();
	}
}
//#endregion

