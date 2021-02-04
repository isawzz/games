//uses _globals
//manages (writes) Live

function initLive() { Live = {}; }


class LiveObject {
	constructor() { //a live object gets an id at birth
		let id = this.id = getUID();
		Live[id] = this;
		this.TOList = [];
		this.UIS = [];
		this.uiActivated = false;
	}
	//#region hidden API
	_clearTO() { this.TOList.map(x => clearTimeout(x)); this.TOList = []; }
	_clearUI() { }// TODO: think about this!!!!! for(const k in this.UIS){this.UIS[k].}}
	//#endregion
	activate(){ this.uiActivated = true; }
	clear() { this._clearTO(); } //just hide its UI???
	deactivate(){ this.uiActivated = false; }
	die() { this._clearTO(); Live[this.id] = null; }
	run(){console.log('object',this.id,'is running...')}

}
























