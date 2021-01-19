function saveSettings(){

}
function initSettings(game) {
	Settings = deepmergeOverride(DB.settings, U.settings);
	delete Settings.games;
	let gsSettings = lookup(U, ['games', game, 'settings']);
	if (isdef(gsSettings)) Settings = deepmergeOverride(Settings, gsSettings);
	updateSettings();

}

function updateSettings() {

	updateLabelSettings();
	updateTimeSettings();
	updateKeySettings();
	updateSpeakmodeSettings();

	//welche settings kommen wohin?
	for (const k in SettingTypesCommon) {
		if (SettingTypesCommon[k]) {
			//console.log('should be set for all games:',k,Settings[k]);

			lookupSetOverride(U, ['settings', k], Settings[k]);

		} else {
			if (isdef(G.key)) lookupSetOverride(U, ['games', G.key, 'settings', k], Settings[k]);

		}
	}

}
