function loadUser(newUser) {

	//console.log('newUser',newUser)
	USERNAME = isdef(newUser) ? newUser : localStorage.getItem('user');
	if (nundef(USERNAME)) USERNAME = 'guest';
	//else console.log('found in localStorage',typeof USERNAME,USERNAME);

	//console.log('U anfang von loadUser', U, '\nDB', DB.users[USERNAME]);

	let uData = lookupSet(DB, ['users', USERNAME]);
	if (!uData) { uData = DB.users[USERNAME] = jsCopy(DB.users.guest0); uData.id = USERNAME; }

	//console.log(USERNAME, uData);

	U = DB.users[USERNAME];
	Settings = U.settings = deepmergeOverride(DB.settings, U.settings);
	GS = Settings.games;
	delete Settings.games;


	//how do I det menuItems? available games must go there!!!! U.seq
	//console.log('U',U,'\nSettings',Settings);

	let uiName = 'spUser'; let dUser = mBy(uiName);
	if (nundef(dUser)) { dUser = editableUsernameUi(dLineTopLeft); dUser.id = uiName; }

	let game = U.lastGame;
	let level;
	if (isdef(game)) { level = U.lastLevel; }
	else {
		game = U.seq[0];
		gInfo = U.games[game];
		level = isdef(gInfo) && isdef(gInfo.startLevel) ? gInfo.startLevel : 0;
	}

	setGame(game, level);
}
function setNextGame() {
	let game = G.key;
	let i = U.seq.indexOf(game);
	let iNew = (i + 1) % U.seq.length;
	setGame(U.seq[iNew]);
}
function setGame(game, level) {
	//clear previous game (timeouts...)
	if (isdef(G) && isdef(G.instance)) { G.instance.clear(); }

	//set new game: friendly,logo,color,key,maxLevel,level 
	//console.log('set game to', game)
	G = jsCopy(GAME[game]); 
	console.log('_________setGame: color',G.color);

	let levels = lookup(GS, [game, 'levels']);
	G.maxLevel = isdef(levels) ? Object.keys(levels).length - 1 : 0;

	G.key = game;
	if (isdef(level)) G.level = level;
	else { G.level = getUserStartLevel(game); }

	updateComplexSettings(); //TODO: phase out!? or rename initSettings

	if (nundef(U.games[game])) {
		U.games[game] = { nTotal: 0, nCorrect: 0, nCorrect1: 0, startLevel: 0, scoreByLevel: [] };
	}

	saveUser();
	//console.log('game',game,'level',level)

}
function getUserStartLevel(game) {
	gInfo = U.games[game];
	level = isdef(gInfo) && isdef(gInfo.startLevel) ? gInfo.startLevel : 0;
	return level;
}
function editableUsernameUi(dParent) {
	//console.log('creating input elem for user', USERNAME)
	let inp = mEditableInput(dParent, 'user: ', USERNAME);
	inp.id = 'spUser';
	inp.addEventListener('focusout', () => {
		let newUser = inp.innerHTML.toLowerCase(); //user names are always case insensitive!
		//console.log(newUser, USERNAME);
		if (newUser != USERNAME) {
			//restartQ();
			saveUser();
			loadUser(newUser);
			startUnit();
		}
	});
	return inp;
}
function saveUnit() { addSessionToUserGames(); saveUser(); }
function saveUser() {
	//console.log('saveUser:',getFunctionsNameThatCalledThisFunction()); 
	U.lastGame = G.key;
	U.lastLevel = G.level;
	DB.users[USERNAME] = U;
	saveSIMA();
}

function addScoreToUserSession() {
	//at end of level
	//adds Score to session
	console.assert(isdef(Score.nTotal) && Score.nTotal > 0)
	let game = G.key;
	let level = G.level;
	let d = lookup(U, ['session', game, level]);
	console.log('_addScoreToUserSession:', '\nScore', Score, '\nsession', d);
	if (!isEmpty(d)) {
		d.nTotal += Score.nTotal;
		d.nCorrect += Score.nCorrect;
		d.nCorrect1 += Score.nCorrect1;
	} else {
		d = { nTotal: Score.nTotal, nCorrect: Score.nCorrect, nCorrect1: Score.nCorrect1 };
	}
	lookupSetOverride(U, ['session', game, level], d);

	//also update aggregate score for this game!
	let dagg = U.session[game];
	dagg.nTotal = isdef(dagg.nTotal) ? dagg.nTotal + Score.nTotal : Score.nTotal;
	dagg.nCorrect = isdef(dagg.nCorrect) ? dagg.nCorrect + Score.nCorrect : Score.nCorrect;
	dagg.nCorrect1 = isdef(dagg.nCorrect1) ? dagg.nCorrect1 + Score.nCorrect1 : Score.nCorrect1;
	dagg.percentage = Math.round(100 * dagg.nCorrect / dagg.nTotal);

	console.log('_addScoreToUserSession:', '\nScore', Score, '\nsession', d);
	console.log('session:', U.session);
	saveUser();
	console.log('+ _addScoreToUserSession +++++++++++++++++++saved user:', U.lastGame, U.lastLevel)
	console.log(jsCopy(Score), jsCopy(U.session))
}

function addSessionToUserGames() {
	// adds session to U.games[game].ScoreByLevel
	console.log('+ _addSessionToUserGames +++++++++++++++++++saved user:', U.lastGame, U.lastLevel)
	console.log(jsCopy(Score), jsCopy(U.session))
	if (!isEmpty(U.session)) {
		for (const g in U.session) {
			for (const l in U.session[g]) {
				let d = U.session[g][l];
				let old = lookup(U, [g, 'scoreByLevel', l]);
				if (old) { old.nTotal += d.nTotal; old.nCorrect += d.nCorrect; old.nCorrect1 += d.nCorrect1; }
				else lookupSet(U, [g, 'scoreByLevel', l], d);
			}
		}
	}
	delete U.session;
}

function updateStartLevelForUser(game, level) {
	lookupSetOverride(U.games, [game, 'startLevel'], level);
}
