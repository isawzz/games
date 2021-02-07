class IClass extends LiveObject {
	constructor(k, U, G, T) {
		super(k);
		this.player = {};
		copyKeys(U, this.player);
		copyKeys(G, this);
		copyKeys(T, this);
		this.running = false;
		this.state = this.immediateStart ? LiveObject.States.ready : LiveObject.States.none;
		this.startTime = Date.now();
		this.div = null;
	}
}