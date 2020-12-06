function loadUser(newUser) {

	USERNAME = isdef(newUser)?newUser: localStorage.getItem('user'); 
	if (nundef(USERNAME)) USERNAME = 'guest';
	
	let uData = lookupSet(DB, ['users', USERNAME]);
	if (!uData) { uData = DB.users[USERNAME] = jsCopy(DB.users.guest0); uData.id = USERNAME; }
	
	console.log(USERNAME, uData);

	U = DB.users[USERNAME];
	Settings = U.settings = deepmergeOverride(DB.settings,U.settings);

	//how do I det menuItems? available games must go there!!!!

	console.log('U',U,'\nS',S);

}
function editableUsernameUi(dParent){
	let inp = mEditableInput(dParent,{val:USERNAME,onLostFocus:inp=>{
		defaultOnLostFocusEditableText(inp);
		let newUser = inp.value;
		console.log(newUser,USERNAME);
		if (newUser != USERNAME){
			saveUser(USERNAME);
			loadUser(newUser);
		}

	}});
}
function saveUser(username){
	console.log('saving',username);
	saveSIMA();
}











function ensureUserHistoryForGame(game) {
	if (nundef(UserHistory[game])) {
		UserHistory[game] = { name: game, nTotal: 0, nCorrect: 0, percentage: 100, startLevel: 0, maxLevelReached: 0 };
	}
}

function upgradeStartLevelForUser(game, level) {
	lookupSetOverride(UserHistory, [game, 'startLevel'], level);
	saveServerData();
}
