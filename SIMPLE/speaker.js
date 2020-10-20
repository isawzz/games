
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

function synthVoice(text,r=.5,p=.8,iVoice=10) {
	if (isdef(synth) && synth.speaking) {
		console.error('speechSynthesis.speaking');
		return;
	}else if (nundef(synth)){
		const awaitVoices = new Promise(resolve=> 
			window.speechSynthesis.onvoiceschanged = resolve)  
		.then(()=> {
			synth = window.speechSynthesis;
	
			voices = synth.getVoices();
			console.log(voices)
	
			const utterance = new SpeechSynthesisUtterance();
			utterance.voice = voices[iVoice];        
			utterance.text = text;
			utterance.rate = r;        
			utterance.pitch = p;
			synth.speak(utterance);
		});
	
	}else{
		console.log('________________--------------___________')
	}

}

function say(text,r=.5,p=.8,iVoice=10) {
	
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

	setTimeout(reInitSpeaker,1000);

}
function reInitSpeaker(){
	if (speechSynthesis.onvoiceschanged !== undefined) {
		speechSynthesis.onvoiceschanged = populateVoiceList;
		console.log('ready');
		setTimeout(step3,1000)
		//console.log(voices)
	}
}
function step3(){
	if (immediateStart) { bStart.innerHTML = 'NEXT'; onClickStartButton(); }
}









