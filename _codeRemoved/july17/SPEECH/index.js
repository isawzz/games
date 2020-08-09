function setSpeechWords() {
	let table = mBy('table');
	clearElement(table);

	//hier kommen words, choose random word
	lang = 'E';
	let m = [
		{ key: 'red heart', words: ['red', 'love', 'heart'] },
		{ key: 'blue heart', words: ['blue', 'love', 'heart']  },
		{ key: 'green heart', words: ['green', 'love', 'heart']  },
	];
	let choice = chooseRandom(m);
	matchingWords = choice.words;
	bestWord = last(matchingWords);
	hintWord = '_'.repeat(bestWord.length);

	//picture
	let e = mEmo(choice.key, table, 200);
	e.style.color = 'red';
	mFlexLinebreak(table);

	//hint
	hintMessage = mHeading('', table, 1, 'hint');
	hintMessage.style.fontSize = '40pt';
	mFlexLinebreak(table);

	//prompt = feedback
	if (isEnglish(lang)) {
		if (interactMode == 'speak') instructionMessage=mInstruction('Say the word in English', table);
		else instructionMessage=mInstruction('Type the word in English', table);
	} else {
		if (interactMode == 'speak') instructionMessage=mInstruction('Sag das Wort auf Deutsch', table);
		else instructionMessage=mInstruction("Schreib' das Wort auf Deutsch", table);
	}
	mFlexLinebreak(table);
	feedbackMessage = instructionMessage; //mHeading('', table, 2, 'feedback');

	// mFlexLinebreak(table);
	// resultMessage = mText('', table, 'result');
	// resultMessage.style.marginTop = '200px';
	// resultMessage.style.fontSize = '20pt';
}













