var synth = window.speechSynthesis;
var voices = synth.getVoices();

var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('input');
var voiceSelect = document.querySelector('select');

for(var i = 0; i < voices.length; i++) {
  var option = document.createElement('option');
  option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
  option.value = i;
  voiceSelect.appendChild(option);
}

inputForm.onsubmit = function(event) {
  event.preventDefault();

  var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
  utterThis.voice = voices[voiceSelect.value];
  synth.speak(utterThis);
  inputTxt.blur();
}