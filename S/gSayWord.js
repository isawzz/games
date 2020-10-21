function setSpeechWords(l = 'E') {
	let table = mBy('table');
	clearElementFromChildIndex(table, 2);

	currentInfo = getEmoSetWords(l);
	currentLanguage = l;

	matchingWords = currentInfo.words;
	validSounds = currentInfo.valid;
	bestWord = last(matchingWords);
	hintWord = '_'.repeat(bestWord.length);

	//mLinebreak(table);

	//picture
	//let d = maPic(currentInfo, table, { fz: 250,matop:50 },false,true);
	let d = maPic4(currentInfo, table, { w: 200, matop: 50 });

	mLinebreak(table);

	//hint
	hintMessage = mHeading('', table, 1, 'hint');
	hintMessage.style.fontSize = '40pt';
	mLinebreak(table);

	//prompt = feedback
	let msg = getPrompt();
	instructionMessage = mInstruction(msg, table);
	mLinebreak(table);

	inputBox = mCreate('input');
	inputBox.id = 'inputBox';
	inputBox.style.fontSize = '20pt';
	inputBox.addEventListener("keyup", function (event) {
		//event.stopPropagation = true;
		if (pauseAfterInput) event.cancelBubble = true;
		//console.log(event);
		if (event.key === "Enter") {
			let word = finalResult = inputBox.value;
			answerCorrect = evaluateAnswer(word);
			setStatus('result');
			// setStatus('result');
			// console.log('Result received: ' + word); // + '.\nConfidence: ' + event.results[0][0].confidence);
			inputBox.value = '';
			if (answerCorrect) {
				hide(inputBox);
				//hide(hintMessage);
				nextWord();
			} else if (hintWord == bestWord) {
				console.log('==>', answerCorrect, '\nwords', matchingWords, '\nbest', bestWord, '\ngot', word); // + '.\nConfidence: ' + event.results[0][0].confidence);
				hide(inputBox);
				nextWord();
			} else {
				nextWord(false);
			}
		}
	});
	mAppend(table, inputBox);

	if (interactMode == 'speak') {
		hide(inputBox);
	} else {
		inputBox.focus();
	}

	feedbackMessage = instructionMessage;
}

