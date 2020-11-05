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
		lastPlayed: { game: 'gMissingLetter', level: 0 },
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

function resetAllGamesAndUsersToHardcodedSettings() {

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
		resetAllGamesAndUsersToHardcodedSettings();
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
			resetAllGamesAndUsersToHardcodedSettings();
		}
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

	keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);
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
	boundary = SAMPLES_PER_LEVEL[level] * (1 + iGROUP);
	//console.log('boundary set to', boundary)
}

//#endregion settings window

