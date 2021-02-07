class IClass extends LiveObject {
	constructor(k, U, G, T) {
		super(k);
		this.player = {};
		copyKeys(U, this.player);
		copyKeys(G, this);
		copyKeys(T, this);
		this.running = false;
		this.uiState = this.immediateStart ? LiveObject.States.ready : LiveObject.States.none;
		this.startTime = Date.now();
		this.div = null;
	}

	loop() {
		this.update(); //backend! am ende soll ein vollstaendiger state a la serverData da sein!

		this.present(); //frontend

		this.activate();
		//after this, wait for user to click somewhere or pick some option!
	}
	getState() {
		return { players: this.players, table: this.table, options: this.options, turn: this.turn };
	}
	setState(s) {
		this.players = s.players;
		this.table = s.table;
		this.options = s.options;
		this.turn = s.turn;
	}
	present() {
		console.log('state', this.getState());
	}
	update() {
		//state is updated
		for (const pl of this.players) this.updatePlayer(pl);
		this.updateTable();
		this.updateTurn();
		this.updateOptions();

	}
	updateOptions() { this.options = {}; }
	updatePlayer() { }
	updateTable() { this.table = {}; }
	updateTurn() { this.turn = chooseRandom(this.players).id; }
}