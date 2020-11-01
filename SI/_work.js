function evaluateAnswer(answer) {
	//let origAnswer=null;
	//if (currentLanguage == 'D') { origAnswer=answer.toUpperCase(); answer = convertUmlaute(answer); }
	let words = matchingWords.map(x => x.toUpperCase());
	let valid = isdef(validSounds) ? validSounds.map(x => x.toUpperCase()) : [];
	//console.log('valid', valid)
	answer = answer.toUpperCase();
	console.log(convertUmlaute(answer), words, currentLanguage, interactMode, words.includes(convertUmlaute(answer)), currentLanguage == 'D' && interactMode == 'write' && words.includes(convertUmlaute(answer)));
	if (words.includes(answer) || (currentLanguage == 'D' && interactMode == 'write' && words.includes(convertUmlaute(answer)))) {
		if (level > 0) setScore(score + blanksInHintWordOrWordLength(hintWord, answer));
		else scoreFunction2(true);
		successMessage();
		hintMessage.innerHTML = answer;
		return true;
	} else if (valid.includes(answer)) {
		//this is a word that sounds just like bestWord!
		if (level > 0) setScore(score + blanksInHintWordOrWordLength(hintWord, answer));
		else scoreFunction2(true);
		successMessage();
		hintMessage.innerHTML = bestWord.toUpperCase();
		return true;
	} else {
		//setScore(score - 1);
		addHint();
		if (bestWord == hintWord) {
			trySomethingElseMessage();
			if (level == 0) scoreFunction2(false); else setScore(score - 1);
			//console.log('NICHT ERRATEN!!!!!!!!!');
			//hintMessage.innerHTML = "let's try something else!";
			return false;
		} else {
			failMessage();
		}
		//console.log('evaluateAnswer_: hintWord',hintWord,'bestWord',bestWord);

		return false;
	}
}
