

function levelDependentScore(isCorrect,hintWord,answer){

}

//#region evaluation of answer
function blanksInHintWordOrWordLength(hintWord, answer) {
	if (isdef(hintWord) && answer == bestWord.toUpperCase()) {
		let numBlanks = countLetters(hintWord, '_');
		return numBlanks;
	} else { return answer.length; }
}
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
function scoreFunction2(isCorrect) {
	if (isCorrect) {
		numCorrectAnswers += 1;
	}
	numTotalAnswers += 1;
	percentageCorrect = Math.round(100 * numCorrectAnswers / numTotalAnswers);
	scoreSpan.innerHTML = '' + numCorrectAnswers + '/' + numTotalAnswers + ' (' + percentageCorrect + '%)';
	console.log(numCorrectAnswers,numTotalAnswers)
}
function setScore(sc) {
	//console.log('score', sc)
	score = sc;
	if (score < 0) scoreSpan.style.color = 'red';
	else if (score > 0) scoreSpan.style.color = 'green';
	else scoreSpan.style.color = 'black';
	scoreSpan.innerHTML = score;
}
function trySomethingElseMessage() { feedbackMessage.innerHTML = "let's try something else! (score: " + score + ')'; }
function successMessage() { feedbackMessage.innerHTML = 'CORRECT! (score is ' + score + ')'; }
function failMessage() { feedbackMessage.innerHTML = 'Try again! (score is ' + score + ')'; }
function addHint() {
	// if (hintWord == bestWord){
	// 	console.log('no more hints!!!')
	// }
	//which positione in bestWord are still empty?
	let indices = [];
	let i = 0;
	for (const ch of hintWord) {
		if (ch == '_') indices.push(i);
		i++;
	}
	//console.log('indices', indices);
	let iNext = level == 0 ? hintWord.indexOf('_') : chooseRandom(indices);
	//console.log('iNext', iNext);
	//console.log('bestWord', bestWord);
	hintWord = hintWord.slice(0, iNext) + bestWord[iNext] + hintWord.slice(iNext + 1, bestWord.length)
	hintWord[iNext] = bestWord[iNext];
	//console.log('hintWord is now', hintWord);
	let ausgabe = '';
	for (const ch of hintWord) {
		ausgabe += ch.toUpperCase() + ' ';
	}
	hintMessage.innerHTML = ausgabe;
}
//#endregion

