var pictureSize, TOMain;

function startGame() {
	console.log('startGame_', G);

	resetState();

	G.instance = getInstance(G);
	G.instance.startGame();

	startLevel();

}
function startLevel() {

	Speech.setLanguage(Settings.language);
	resetScore();
	showStats();

	let defvals = { numPics: 1, numRepeat: 1, trials: 2 };
	for (const k in defvals) { G[k] = getGameOrLevelInfo(k, defvals[k]); }
	G.numLabels = G.numPics * G.numRepeat;

	G.instance.startLevel(); //settings level dependent params eg., G.trials...

	if (G.keys.length < G.numPics) {
		console.log('extending key set!!!!');
		updateKeySettings(G.numPics + 5);
	}
	startRound();
}
function startRound() { 
	resetRound();
	uiActivated = false;

	G.instance.startRound();

	TOMain = setTimeout(() => prompt(), 300); 
}

function prompt() {
	showScore();
	Score.levelChange = false; //needs to be down here because showScore needs that info!
	G.trialNumber = 0;

	G.instance.prompt();
}
function promptNextTrial() {
	uiActivated = false;
	let delay = G.instance.trialPrompt(G.trialNumber);
	TOMain = setTimeout(activateUi, delay);
}
function activateUi() {
	Selected = null;
	uiActivated = true;
	G.instance.activate();
}
function evaluate(){
	if (!canAct()) return;
	uiActivated = false;
	IsAnswerCorrect = G.instance.eval(...arguments);
	console.log('answer is',IsAnswerCorrect?'correct':'WRONG!!!')

	G.trialNumber += 1;
	if (!IsAnswerCorrect && G.trialNumber < G.trials) { promptNextTrial(); return; }

	//feedback
	if (IsAnswerCorrect) {
		DELAY = Settings.spokenFeedback ? 1500 : 300;
		successPictureGoal();
	} else {
		DELAY = Settings.spokenFeedback ? 3000 : 300;
		showCorrectWord();
		failPictureGoal(false);
	}
	setTimeout(removeMarkers,1500);

	let nextLevel;
	[Score.levelChange, nextLevel] = scoring(IsAnswerCorrect); //get here only if this is correct or last trial!

	if (!Score.levelChange){
		TOMain = setTimeout(startRound,DELAY);
		//enQ(setTimeout,[startRound,DELAY]);
	}else if (unitTimeUp()){
		//end of unit!
		saveUnit();
	}else if (nextLevel<G.level){
		//remove badges
	}else if (nextLevel == G.level){
		//same level restarts again
	}else if (nextLevel > G.maxLevel){
		//new game!
	}else{
		//1 level up!
		// add a badge
	}

}















