function resetAllGamesToHardcodedSettings() {

	settingsPerGame = jsCopy(DEFAULTS_PER_GAME);
	settingsPerUser = jsCopy(DEFAULTS_PER_USER);
	currentGame = HARDCODED.currentGame;
	currentUser = HARDCODED.currentUser;
	for (const gname in settingsPerGame) {

		for (const user in settingsPerUser) {
			settingsPerUser[user].perGame[gname] = jsCopy(settingsPerGame[gname]);
			settingsPerUser[user].perGame[gname].level = HARDCODED.level;
			settingsPerUser[user].perGame[gname].language = HARDCODED.currentLanguage;
		}

	}
	saveSettings();
	console.log('storage reset to defaults...')
}

function initSettingsP0() {

	if (RESET_TO_HARDCODED) {
		localStorage.clear();
		resetAllGamesToHardcodedSettings();
	}

	if (IS_TESTING) {

		//woher nehme currentUser? von hardCoded
		currentUser = IS_TESTING ? HARDCODED.currentUser : loadObject('currentUser');
		saveObject(currentUser, 'currentUser');

		//woher nehme currentGame? von localStorage oder hardCoded
		currentGame = IS_TESTING ? HARDCODED.currentGame : loadObject('currentGame');
		saveObject(currentGame, 'currentGame');

		//woher nehme settings? von DEFAULTS_PER_GAME
		settingsPerGame = loadObject('settingsPerGame');
		if (nundef(settingsPerGame)) {
			console.log('settingsPerGame NOT in LOCALSTORAGE!!!')
			settingsPerGame = DEFAULTS_PER_GAME; saveObject(settingsPerGame, 'settingsPerGame');
		}

		settingsPerUser = loadObject('settingsPerUser');
		if (nundef(settingsPerUser)) {
			console.log('settingsPerUser NOT in LOCALSTORAGE!!!')
			settingsPerUser = DEFAULTS_PER_USER; saveObject(settingsPerUser, 'settingsPerUser');
		}
	} else {
		currentUser = loadObject('currentUser');
		if (nundef(currentUser)) {
			resetAllGamesToHardcodedSettings();
		}
		currentUser = loadObject('currentUser');
		currentGame = loadObject('currentGame');
		settingsPerGame = loadObject('settingsPerGame');
		settingsPerUser = loadObject('settingsPerUser');
	}

	//console.log(currentGame,settingsPerGame,currentUser,settingsPerUser);
}

function loadSettings(game, user) {

	//console.log('loading',game,user)
	//was muss alles geladen werden?
	//vom user kommt: level,
	let defaults = settingsPerGame[game];

	//console.log('defaults',defaults);

	let current = lookup(settingsPerUser, [user, 'perGame', game]);
	if (nundef(current)) { lookupSet(settingsPerUser, [user, 'perGame', game], defaults); current = jsCopy(defaults); }

	//console.log('current',current);
	//if (RESET_TO_HARDCODED) { current = jsCopy(HARDCODED); }

	//woher nehme level? von localStorage.settingsPerUser.perGame[currentGame].level
	level = current.level; if (nundef(level)) { level = HARDCODED.level; current.level = level; }
	currentLanguage = current.language; if (nundef(currentLanguage)) { currentLanguage = HARDCODED.currentLanguage; current.language = currentLanguage; }

	PICS_PER_LEVEL = current.PICS_PER_LEVEL; if (nundef(PICS_PER_LEVEL)) { PICS_PER_LEVEL = HARDCODED.PICS_PER_LEVEL; current.PICS_PER_LEVEL = PICS_PER_LEVEL; }
	MAXLEVEL = current.MAXLEVEL; if (nundef(MAXLEVEL)) { MAXLEVEL = HARDCODED.MAXLEVEL; current.MAXLEVEL = MAXLEVEL; }
	MAX_WORD_LENGTH = current.MAX_WORD_LENGTH; if (nundef(MAX_WORD_LENGTH)) { MAX_WORD_LENGTH = HARDCODED.MAX_WORD_LENGTH; current.MAX_WORD_LENGTH = MAX_WORD_LENGTH; }
	WORD_GROUPS = current.WORD_GROUPS; if (nundef(WORD_GROUPS)) { WORD_GROUPS = HARDCODED.WORD_GROUPS; current.WORD_GROUPS = WORD_GROUPS; }
	SHOW_LABEL_UP_TO_LEVEL = current.SHOW_LABEL_UP_TO_LEVEL; if (nundef(SHOW_LABEL_UP_TO_LEVEL)) { SHOW_LABEL_UP_TO_LEVEL = HARDCODED.SHOW_LABEL_UP_TO_LEVEL; current.SHOW_LABEL_UP_TO_LEVEL = SHOW_LABEL_UP_TO_LEVEL; }

	//console.log('level',level,'currentLanguage',currentLanguage,'PICS_PER_LEVEL',PICS_PER_LEVEL,MAXLEVEL,MAX_WORD_LENGTH,WORD_GROUPS,SHOW_LABEL_UP_TO_LEVEL)

	//need to init settings window!!!!!!!!!
	let iLanguage = mBy('input' + currentLanguage); iLanguage.checked = true;
	mBy('inputPicsPerLevel').value = PICS_PER_LEVEL;

}
function saveSettings() {

	saveObject(settingsPerGame, 'settingsPerGame')
	saveObject(settingsPerUser, 'settingsPerUser')
	saveObject(currentUser, 'currentUser')
	saveObject(currentGame, 'currentGame')
}


























