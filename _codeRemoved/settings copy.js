//#region settings new but broken
const RESET_TO_HARDCODED = true;
var HARDCODED = {
	currentUser: 'Gunter',

	currentGame: 'gTouchPic', //gWritePic | gTouchPic | gSayPic | gMissingLetter
	currentLanguage: 'E',
	currentLevel: 0,

	PICS_PER_LEVEL: IS_TESTING ? 1 : 5,
	WORD_GROUPS: ['nosymbols'],

	//MIN_WORD_LENGTH: [3, 3, 4, 5, 5, 3],
	MAX_WORD_LENGTH: [3, 4, 5, 7, 10, 111],
	SHOW_LABEL_UP_TO_LEVEL: 1,
	MAXLEVEL: 7,
};


//#endregion

//#region hardcoded settings for defaults
//user info
var settingsPerUser;
const DEFAULTS_PER_USER = {
	Gunter: {
		perGame: {
			testLevels: { highestLevel: 0 },
			gMissingLetter: { highestLevel: 0 },
			gTouchPic: { highestLevel: 0 },
			gWritePic: { highestLevel: 0 },
			gSayPic: { highestLevel: 0 },

		},
		lastPlayed: { game: 'gMissingLetter', currentLevel: 0 },
	}
};


//defaults per game
var settingsPerGame;

//these will be loaded when a new game starts!
const DEFAULTS_PER_GAME = {
	testLevels: {
		PICS_PER_LEVEL: 1,
		WORD_GROUPS: ['nosymbols'],
		MAX_WORD_LENGTH: [12],
		MAXLEVEL: 6,
		SHOW_LABEL_UP_TO_LEVEL: 0,
	},
	gMissingLetter: {
		PICS_PER_LEVEL: 20,
		WORD_GROUPS: ['nosymbols'],
		MAX_WORD_LENGTH: [12],
		MAXLEVEL: 6,
		SHOW_LABEL_UP_TO_LEVEL: 2,
	},
	gTouchPic: {
		PICS_PER_LEVEL: 10,
		WORD_GROUPS: ['nosymbols'],
		MAX_WORD_LENGTH: [4, 6, 12],
		MAXLEVEL: 6,
		SHOW_LABEL_UP_TO_LEVEL: 2,
	},
	gWritePic: {
		PICS_PER_LEVEL: 5,
		WORD_GROUPS: ['nosymbols'],
		MAX_WORD_LENGTH: [3, 4, 5, 7, 10, 12],
		MAXLEVEL: 6,
		SHOW_LABEL_UP_TO_LEVEL: 4,
	},
	gSayPic: {
		PICS_PER_LEVEL: 15,
		WORD_GROUPS: ['nosymbols'],
		MAX_WORD_LENGTH: [4, 6, 8, 12],
		MAXLEVEL: 6,
		SHOW_LABEL_UP_TO_LEVEL: 2,
	}
}


//#endregion

//#region noch nicht ausgereift!



function resetAllGamesAndUsersToHardcodedSettings() {

	settingsPerGame = jsCopy(DEFAULTS_PER_GAME);
	settingsPerUser = jsCopy(DEFAULTS_PER_USER);
	currentLevel = HARDCODED.currentLevel;
	currentGame = HARDCODED.currentGame;
	currentUser = HARDCODED.currentUser;
	currentLanguage = HARDCODED.currentLanguage;
	for (const gname in settingsPerGame) {
		let settings = settingsPerGame[gname];

		settings.PICS_PER_LEVEL = HARDCODED.PICS_PER_LEVEL;
		settings.SHOW_LABEL_UP_TO_LEVEL = HARDCODED.SHOW_LABEL_UP_TO_LEVEL;
		settings.MAXLEVEL = HARDCODED.MAXLEVEL;

		for (const user in settingsPerUser) {
			settingsPerUser[user].perGame[gname] = jsCopy(settings);
			settingsPerUser[user].perGame[gname].currentLevel = HARDCODED.currentLevel;
			settingsPerUser[user].perGame[gname].language = HARDCODED.currentLanguage;
		}

	}
	saveSettings();
	console.log('storage reset to defaults...')
}
function initSettingsP1() {

	if (RESET_TO_HARDCODED) {
		localStorage.clear();
		resetAllGamesAndUsersToHardcodedSettings();
	}

	if (IS_TESTING) {

		currentLanguage = HARDCODED.currentLanguage;

		//woher nehme currentUser? von hardCoded
		currentUser = HARDCODED.currentUser;
		saveObject(currentUser, 'currentUser');

		//woher nehme currentGame? von localStorage oder hardCoded
		currentGame = HARDCODED.currentGame;
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
			resetAllGamesAndUsersToHardcodedSettings();
		}
		currentLanguage = loadObject('currentLanguage');
		currentUser = loadObject('currentUser');
		currentGame = loadObject('currentGame');
		settingsPerGame = loadObject('settingsPerGame');
		settingsPerUser = loadObject('settingsPerUser');
	}

	//console.log(currentGame,settingsPerGame,currentUser,settingsPerUser);
}
function loadSettings(game, user) {
	let defaults = settingsPerGame[game];
	let current = lookup(settingsPerUser, [user, 'perGame', game]);
	if (nundef(current)) {
		lookupSet(settingsPerUser, [user, 'perGame', game], defaults);
		current = jsCopy(defaults);
	}

	currentLevel = current.currentLevel; if (nundef(currentLevel)) { currentLevel = HARDCODED.currentLevel; current.currentLevel = currentLevel; }
	currentLanguage = current.language; if (nundef(currentLanguage)) { currentLanguage = HARDCODED.currentLanguage; current.language = currentLanguage; }

	PICS_PER_LEVEL = current.PICS_PER_LEVEL; if (nundef(PICS_PER_LEVEL)) { PICS_PER_LEVEL = HARDCODED.PICS_PER_LEVEL; current.PICS_PER_LEVEL = PICS_PER_LEVEL; }
	MAXLEVEL = current.MAXLEVEL; if (nundef(MAXLEVEL)) { MAXLEVEL = HARDCODED.MAXLEVEL; current.MAXLEVEL = MAXLEVEL; }
	MAX_WORD_LENGTH = current.MAX_WORD_LENGTH; if (nundef(MAX_WORD_LENGTH)) { MAX_WORD_LENGTH = HARDCODED.MAX_WORD_LENGTH; current.MAX_WORD_LENGTH = MAX_WORD_LENGTH; }
	WORD_GROUPS = current.WORD_GROUPS; if (nundef(WORD_GROUPS)) { WORD_GROUPS = HARDCODED.WORD_GROUPS; current.WORD_GROUPS = WORD_GROUPS; }
	SHOW_LABEL_UP_TO_LEVEL = current.SHOW_LABEL_UP_TO_LEVEL; if (nundef(SHOW_LABEL_UP_TO_LEVEL)) { SHOW_LABEL_UP_TO_LEVEL = HARDCODED.SHOW_LABEL_UP_TO_LEVEL; current.SHOW_LABEL_UP_TO_LEVEL = SHOW_LABEL_UP_TO_LEVEL; }

	//console.log('currentLevel',currentLevel,'currentLanguage',currentLanguage,'PICS_PER_LEVEL',PICS_PER_LEVEL,MAXLEVEL,MAX_WORD_LENGTH,WORD_GROUPS,SHOW_LABEL_UP_TO_LEVEL)

	//need to init settings window!!!!!!!!!
	let iLanguage = mBy('input' + currentLanguage); iLanguage.checked = true;
	mBy('inputPicsPerLevel').value = PICS_PER_LEVEL;

}
function saveSettings() {

	saveObject(settingsPerGame, 'settingsPerGame')
	saveObject(settingsPerUser, 'settingsPerUser')
	saveObject(currentUser, 'currentUser')
	saveObject(currentGame, 'currentGame')
	saveObject(currentLanguage, 'currentLanguage')
}
//#endregion

//#region settings window
function updateAllGameSettingsFromSettingsWindow() {
	for (const gname in settingsPerGame) {
		let di = settingsPerGame[gname];
		di.language = currentLanguage;
		di.PICS_PER_LEVEL = PICS_PER_LEVEL;
	}
	for (const gname in settingsPerUser[currentUser].perGame) {
		let di = settingsPerUser[currentUser].perGame[gname];
		di.language = currentLanguage;
		di.PICS_PER_LEVEL = PICS_PER_LEVEL;
	}
	saveSettings();
}


function openSettings() {
	//console.log('settings werden geoeffnet!')
	show(dSettings);
	pauseUI();


	//dSettings.scrollIntoView(false);
}
function closeSettings() {

	//update settings!
	setPicsPerLevel();

	updateAllGameSettingsFromSettingsWindow();

	hide(dSettings);

	resumeUI();
}
function toggleSettings() {
	// let d=mBy('dSettings');
	// let x=isVisible2(mBy('dSettings'));
	// let settingsVisible = d.style.display!='none';
	// console.log('settings visible',x,d.style.display=='none')
	if (isVisible2('dSettings')) closeSettings(); else openSettings();
}

function setGame(event) {
	if (isString(event)) currentGame = event;
	else {
		event.cancelBubble = true;
		let id = evToClosestId(event);
		currentGame = 'g' + id.substring(1);
		closeSettings();
	}
	startGame(currentGame);
}
function setLanguage(x) {
	//console.log('setting language to', x);
	currentLanguage = x;

	currentKeys = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[currentLevel]);
}
function setPicsPerLevel() {
	let inp = mBy('inputPicsPerLevel');
	inp.select();
	let x = getSelection();
	let n = Number(x.toString());
	inp.value = n;
	getSelection().removeAllRanges();
	//console.log(inp, x, n, inp.value)

	PICS_PER_LEVEL = n;
	SAMPLES_PER_LEVEL = new Array(20).fill(PICS_PER_LEVEL);
	boundary = SAMPLES_PER_LEVEL[currentLevel] * (1 + iGROUP);
	//console.log('boundary set to', boundary)
}

//#endregion settings window

function updateAllGameSettingsFromSettingsWindow() {
	for (const gname in settingsPerGame) {
		let di = settingsPerGame[gname];
		di.language = currentLanguage;
		di.PICS_PER_LEVEL = PICS_PER_LEVEL;
	}
	for (const gname in settingsPerUser[currentUser].perGame) {
		let di = settingsPerUser[currentUser].perGame[gname];
		di.language = currentLanguage;
		di.PICS_PER_LEVEL = PICS_PER_LEVEL;
	}
	saveSettings();
}
