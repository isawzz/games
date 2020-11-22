
function scoring(isCorrect) {

	//console.log('isCorrect',isCorrect)

	CurrentGoalData = {
		key: Goal.key, isCorrect: IsAnswerCorrect, reqAnswer: Selected.reqAnswer, answer: Selected.answer, 
		//selected: Selected, goal: Goal,
	};
	CurrentLevelData.items.push(CurrentGoalData);

	numTotalAnswers += 1;
	if (isCorrect) numCorrectAnswers += 1;

	//percent scoringMode:
	percentageCorrect = Math.round(100 * numCorrectAnswers / numTotalAnswers);

	//inc scoringMode:
	if (isCorrect) {
		levelPoints += levelIncrement; if (levelIncrement < maxIncrement) levelIncrement += 1;
	} else {
		levelIncrement = minIncrement; levelPoints += minIncrement;
	}
	//console.log('numTotalAnswers',numTotalAnswers,'boundary',boundary)

	//see if it is time for level change check
	let levelChange = 0;
	let nextLevel = currentLevel;
	if (numTotalAnswers >= boundary) {

		//console.log('scoringMode', scoringMode)

		if (scoringMode == 'inc') {
			if (levelPoints >= levelDonePoints && percentageCorrect >= 50) {
				levelChange = 1; nextLevel += 1;
			}

		} else if (scoringMode == 'percent') {
			if (percentageCorrect >= 80) { levelChange = 1; nextLevel += 1; }
			else if (percentageCorrect < 50) { levelChange = -1; if (nextLevel > 0) nextLevel -= 1; }

		} else if (scoringMode == 'autograde') {
			//console.log('... autograding');
			//saveAnswerStatistic();
			saveStats();
			levelChange = 1;
			nextLevel += 1;

		} else if (scoringMode == 'n') {
			//console.log('correct:', numCorrectAnswers, 'total:', numTotalAnswers)
			if (numCorrectAnswers > numTotalAnswers / 2) { levelChange = 1; nextLevel += 1; }
			else if (numCorrectAnswers < numTotalAnswers / 2) { levelChange = -1; nextLevel = (nextLevel > 0 ? nextLevel - 1 : nextLevel); }

		}
	}

	if (levelChange){
		//trage numCorrectAnswers und numTotalAnswers ein in 
		CurrentLevelData.numTotalAnswers = numTotalAnswers;
		CurrentLevelData.numCorrectAnswers = numCorrectAnswers;
		CurrentLevelData.percentageCorrect = percentageCorrect;
	}

	return [levelChange, nextLevel];


}


function onClickRestartProgram(){

	//closeSettings(); startUnit();

	Settings.program.currentGameIndex = 0;
	Settings.program.currentLevel = currentLevel = Settings.program.gameSequence[0].startLevel;
	updateGameSequence(Settings.program.currentLevel);

	console.log('Settings',Settings.program)

	localStorage.setItem('settings', JSON.stringify(Settings));
	loadSettingsFromLocalStorage();

	// console.log('restarting program');

	// closeSettings(); 
	// clearTable();
	// startUnit(); 

}













