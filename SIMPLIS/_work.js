function onClickRestartProgram(){

	//closeSettings(); startUnit();

	Settings.program.currentGameIndex = 0;
	Settings.program.currentLevel = Settings.program.gameSequence[0].startLevel;
	updateGameSequence();

	saveSettingsX();loadSettingsFromLocalStorage();

	console.log('restarting program');

	closeSettings(); 
	clearTable();
	startUnit(); 

}













