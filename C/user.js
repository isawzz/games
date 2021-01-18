var Users={};
function userInit(id){
	Username = isdef(id) ? id : localStorage.getItem('user');
	if (nundef(Username)) Username = DEFAULTUSERNAME;

	Users[id]=new User(id);
	console.log('Users',Users);
}

class User {
	constructor(id) {
		this.id = id;
		this.data = lookupSet(DB, ['users', Username]);
	}
	load() { Username = this.id; }
	save() { }
	getAvailableGames() { }
	getRunningGames() { }
	getData() { }
	getState(idGame) { }
	getStartLevel() { }
	setGame() { }
	setStartLevel() { }
	setScore() { }

}