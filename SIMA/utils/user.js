function loadUser(newUser) {

	//console.log('newUser',newUser)
	USERNAME = isdef(newUser) ? newUser : localStorage.getItem('user');
	if (nundef(USERNAME)) USERNAME = 'guest';
	//else console.log('found in localStorage',typeof USERNAME,USERNAME);

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
	if (nundef(game)) game = U.seq[0];
	let level = U.lastLevel;
	if (nundef(level)) level = U.games.startLevel;
	G = jsCopy(GAME[game]); G.key = game; G.level = level; 
	
	let levels=GS[game].levels;
	G.maxLevel = isdef(levels)? Object.keys(levels).length - 1 : 0;

	updateComplexSettings(); //TODO: phase out!? or rename initSettings


	if (nundef(U.games[game])) {
		U.games[game] = { nTotal: 0, nCorrect: 0, nCorrect1: 0, startLevel: 0, scoreByLevel: [] };
	}

}
function editableUsernameUi(dParent) {
	//console.log('creating input elem for user', USERNAME)
	let inp = mEditableInput(dParent, USERNAME);
	inp.id = 'spUser';
	inp.addEventListener('focusout', () => {
		let newUser = inp.innerHTML.toLowerCase(); //user names are always case insensitive!
		//console.log(newUser, USERNAME);
		if (newUser != USERNAME) { saveUser(USERNAME); loadUser(newUser); }
	});
	return inp;
	// let inp = mEditableInput(dParent, {
	// 	val: USERNAME, onLostFocus: inp => {
	// 		defaultOnLostFocusEditableText(inp);
	// 		let newUser = inp.value;
	// 		console.log(newUser, USERNAME);
	// 		if (newUser != USERNAME) {
	// 			saveUser(USERNAME);
	// 			loadUser(newUser);
	// 		}
	// 	}
	// });
}
function saveUser(username) {
	//console.log('saving', username);
	saveSIMA();
}





function upgradeStartLevelForUser(game, level) {
	lookupSetOverride(U.games, [game, 'startLevel'], level);
	saveServerData();
}
