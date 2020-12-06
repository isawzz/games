function globalsFromSettings() {

	currentGame = UserHistory.lastGame;

	currentLanguage = Settings.common.currentLanguage;

	currentCategories = Settings.common.currentCategories;

	skipLevelAnimations = Settings.flags.reducedAnimations;

	resetLabelSettings();

	//Settings.common.showTime = true;
	if (Settings.common.showTime) { show(mBy('time')); startTime('time'); }
	else hide(mBy('time'));

	
}

function resetLabelSettings() {
	if (Settings.common.showLabels == 'toggle') Settings.common.labels = true;
	else Settings.common.labels = (Settings.common.showLabels == 'always');
}



