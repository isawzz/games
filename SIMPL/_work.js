function updateLevel() {
	//console.log('numTotalAnswers',numTotalAnswers,'boundary',boundary)
	if (numTotalAnswers >= boundary) {		[LevelChange,currentLevel] = scoreDependentLevelChange(currentLevel);	}
	// if (GameState == STATES.GROUPCHANGE) {
	// 	setKeys();
	// } else 
	if (LevelChange){ //GameState == STATES.LEVELCHANGE) {
		boundary = SAMPLES_PER_LEVEL[currentLevel] * (1 + iGROUP);
		resetScore();
		//console.log('currentLevel',currentLevel)
		//GFUNC[currentGame].prepLevel();
		//console.log(currentGame,currentLevel);
		if (currentLevel <= MAXLEVEL) GFUNC[currentGame].prepLevel();
	}
	//console.log('level is now',currentLevel)
}
























