function globalsFromSettings() {

	currentGame = Settings.program.gameSequence[Settings.program.currentGameIndex].game;

	currentLanguage = Settings.program.currentLanguage;

	currentCategories = Settings.program.currentCategories;

	skipLevelAnimations = Settings.flags.reducedAnimations;

	resetLabelSettings();

	//Settings.program.showTime = true;
	if (Settings.program.showTime) { show(mBy('time')); startTime('time'); }
	else hide(mBy('time'));

	
}

function resetLabelSettings() {
	if (Settings.program.showLabels == 'toggle') Settings.program.labels = true;
	else Settings.program.labels = (Settings.program.showLabels == 'always');
}
