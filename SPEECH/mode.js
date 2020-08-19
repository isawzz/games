function testCheckbox(){
	let inp=mBy('speakMode');
	if (inp.checked) inp.click();
	// inp.click();
	// inp.click();
	// inp.click();
	//inp.setAttribute('checked',false);
	console.log('input',inp);
	//delete inp.checked;
}

function getPrompt(){
	if (isEnglish(lang)) {
		if (interactMode == 'speak') return 'Say the word in English';
		else return 'Type the word in English';
	} else {
		if (interactMode == 'speak') return 'Sag das Wort auf Deutsch';
		else return "Schreib' das Wort auf Deutsch";
	}

}
function updateSpeakCheckbox(){
	console.log('updateSpeakCheckbox mode='+interactMode);
	speakMode = (interactMode == 'speak');
	let inp=mBy('speakMode');
	console.log('speakMode',speakMode,inp.checked);
	inp.checked= speakMode;
	console.log('speakMode',speakMode,inp.checked);

}
function switchModeSilently(){
	console.log('switchModeSilently')
	if (interactMode == 'speak') startWriteMode(true); else startSpeakMode(true);
}
function startSpeakMode(triggered=false){
	//console.log('do same example with writing instead of speaking!')
	interactMode='speak';
	hide(inputBox);
	speakMode = interactMode == 'speak';
	instructionMessage.innerHTML = getPrompt();
	updateSpeakCheckbox();
	recognition.start();
}
function startWriteMode(triggered=false){
	//console.log('do same example with writing instead of speaking!')
	console.log('startWriteMode mode='+interactMode);
	interactMode='write';
	//console.log('inputBox',inputBox)
	updateSpeakCheckbox();
	if (nundef(inputBox)) {restart();}
	else{
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