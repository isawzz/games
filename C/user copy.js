function changeUserTo(id) {
	id = id.toLowerCase();
	if (id != Username && isdef(Users[Username])) { Users[Username].save(true); }

	loadUser(id);
}
function addUserButton(id){let b = mButton(id, () => changeUserTo(id), dLineNaviMiddle, { maright: 4 });}
function listUsers(showButtons = false) {
	let keys = Object.keys(DB.users);
	console.log(keys);
	if (showButtons) {
		//brauch ein dNavi
		for (const k of keys) {
			if (k == 'guest0' || k == 'test0') continue;
			addUserButton(k)
			
		}
	}
}
function loadUser(id) {
	//console.log('________ id', id, 'Username', Username, 'DEF', DEFAULTUSERNAME)
	if (nundef(id)) id = localStorage.getItem('user');
	if (nundef(id)) id = DEFAULTUSERNAME;
	if (nundef(Users[id])) {Users[id] = new UserManager(id);}
	U = Users[id];
	Username = id;

	//console.log(Username, U);
	updateUsernameUi();

}
function saveUsers() { for (const id in Users) Users[id].save(); }
function saveUser() { U.save(true); }
function updateUsernameUi() {
	let uiName = 'spUser';
	let ui = mBy(uiName);
	if (nundef(ui)) {
		//console.log('creating ui for username');
		ui = mEditableOnEdited(uiName, dLineTopLeft, 'user: ', '', changeUserTo);
	}
	ui.innerHTML = Username;
	mStyleX(ui, { fg: U.data.settings.color });
}

class UserManager {
	constructor(id) {
		this.id = id;
		let data = lookup(DB, ['users', id]);
		if (!data) {
			if (id == 'test') { data = DB.users[id] = jsCopy(DB.users.test0); }
			else { data = DB.users[id] = jsCopy(DB.users.guest0); }
			data.id = id;
			data.settings.color = randomColor();
		}
		this.data = data;
		this.data.session = {};
	}
	load() { }
	save(sendToDB = false) { lookupSet(DB, ['users', this.id], this.data); if (sendToDB) dbSave('boardGames'); }
	getLastGame() { if (nundef(this.data.lastGame)) this.data.lastGame = this.getAvailableGames[0]; return this.data.lastGame; }
	getAvailableGames() { return this.data.avGames; }
	getRunningGames() { }
	getData() { }
	getState(idGame) { }
	getStartLevel() { }
	setGame() { }
	setStartLevel() { }
	setScore() { }

}