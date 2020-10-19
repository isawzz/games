function testCheckbox() {
	let inp = mBy('speakMode');
	if (inp.checked) inp.click();
	// inp.click();
	// inp.click();
	// inp.click();
	//inp.setAttribute('checked',false);
	console.log('input', inp);
	//delete inp.checked;
}

function getPrompt() {
	if (isEnglish(currentLanguage)) {
		if (interactMode == 'speak') return 'Say the word in English';
		else return 'Type the word in English';
	} else {
		if (interactMode == 'speak') return 'Sag das Wort auf Deutsch';
		else return "Schreib' das Wort auf Deutsch";
	}

}
function updateSpeakCheckbox() {
	//console.log('updateSpeakCheckbox mode=' + interactMode);
	speakMode = (interactMode == 'speak');
	let inp = mBy('speakMode');
	//console.log('speakMode', speakMode, inp.checked);
	if (!inp.checked && speakMode || inp.checked && !speakMode) inp.click();
	inp.checked = speakMode;
	//console.log('speakMode', speakMode, inp.checked);

}
function deactivateSpeakmode() {
	let id = getStandardTagId('e', 'speak');
	//console.log('____________ id',id);
	//hide(id); //mBy(id)
	startWriteMode();
}
function switchModeSilently(isManual = false) {
	//console.log('switchModeSilently')
	if (interactMode == 'speak') startWriteMode(true); else startSpeakMode(true);
	// if (isManual) updateSpeakCheckbox();
}
function startSpeakMode(triggered = false) {
	//console.log('do same example with writing instead of speaking!')
	interactMode = 'speak';
	hide(inputBox);
	speakMode = interactMode == 'speak';
	instructionMessage.innerHTML = getPrompt();
	//if (!triggered) updateSpeakCheckbox();
	if (!isRunning) {
		if (isdef(recognition)) recognition.start();
		else {
			speech00(currentLanguage, matchingWords);
		}
	}
}
function startWriteMode(triggered = false) {
	//console.log('do same example with writing instead of speaking!')
	//console.log('startWriteMode mode=' + interactMode);
	interactMode = 'write';
	if (isRunning) recognition.stop();
	//console.log('inputBox',inputBox)
	//if (!triggered) updateSpeakCheckbox();
	if (nundef(inputBox)) { restart(); }
	else {
		show(inputBox);
		clearElement(inputBox);
		inputBox.focus();
		instructionMessage.innerHTML = getPrompt();

	}
	// show(inputBox);
	// clearElement(inputBox);
	// inputBox.focus();
	// interactMode='write';
	// instructionMessage.innerHTML = getPrompt();
	// updateSpeakCheckbox();

}