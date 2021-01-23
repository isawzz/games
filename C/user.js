function getUsers(){return Object.keys(DB.users);}
function getGames(){return U.avGames;}
function getTables(){return U.tables;}
function getUsers(){return Object.keys(DB.users);}
function changeUserTo(id) {
	id = id.toLowerCase();
	if (isdef(id) && id == Username) return;
	if (id != Username && isdef(U)) { saveUser(); }
	loadUser(id);
}

function loadUser(id) {
	//console.log('________ id', id, 'Username', Username, 'DEF', DEFAULTUSERNAME)
	if (nundef(id)) id = localStorage.getItem('user');
	if (nundef(id)) id = DEFAULTUSERNAME;

	let data = lookup(DB, ['users', id]);
	if (!data) {
		if (id == 'test') { data = DB.users[id] = jsCopy(DB.users.test0); }
		else { data = DB.users[id] = jsCopy(DB.users.guest0); }
		data.id = id;
		data.settings.color = randomColor();
	}
	U = data;
	U.session = {};
	Username = id;

	//console.log(Username, U);
	updateUsernameUi(id,U.settings.color);

}
function saveUser(sendToDB=false) { lookupSet(DB.users,[Username],U); if (sendToDB) dbSave(); }
function updateUsernameUi(id,color) {
	let uiName = 'spUser';
	let ui = mBy(uiName);
	if (nundef(ui)) {
		//console.log('creating ui for username');
		ui = mEditableOnEdited(uiName, dLineTopLeft, 'user: ', '', changeUserTo, ()=>{
			console.log('Users',getUsers());
		});
	}
	ui.innerHTML = id;
	mStyleX(ui, { fg:color });
}

