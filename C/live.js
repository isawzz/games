//uses _globals
//manages (writes) Live

function initLive() { Live = {}; }


class LiveObject {
	static States = { none: 0, gettingReady: 1, ready: 2, running: 3, on: 3, off: 4 }
	constructor() { //a live object gets an id at birth
		let id = this.id = getUID();
		Live[id] = this;
		this.TOList = [];
		this.UIS = [];
		this.uiActivated = false;
		this.state = LiveObject.States.none;
	}
	//#region hidden API
	_clearTO() { this.TOList.map(x => clearTimeout(x)); this.TOList = []; }
	_clearUI() { }// TODO: think about this!!!!! for(const k in this.UIS){this.UIS[k].}}
	//#endregion
	activate() { this.uiActivated = true; }
	clear() { this._clearTO(); } //just hide its UI???
	deactivate() { this.uiActivated = false; }
	die() { this._clearTO(); Live[this.id] = null; }
	run() { console.log('object', this.id, 'is running...') }

	setGettingReady() { this.running = false; this.state = LiveObject.States.gettingReady; console.log('...getting ready!'); }
	setRunning() { this.running = true; this.state = LiveObject.States.running; }
	setReady() { this.running = false; this.state = LiveObject.States.ready; console.log('ready!'); }
	getReady(ms) {
		if (isdef(ms)) { this.setGettingReady(); setTimeout(this.setReady.bind(this), ms); }
		else this.setReady();
	}


}
























