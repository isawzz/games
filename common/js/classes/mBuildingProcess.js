class mBuildingProcess {
	constructor(spec, data, defaults, messagePlace, processedPlace,dictsPlace, treePlace, resultPlace) {
		this.stepCounter = 0;
		this.dMessage = mBy(messagePlace);
		this.dProcess = mBy(processedPlace);
		this.dDicts = mBy(dictsPlace);
		this.dTree = mBy(treePlace);
		this.dResult = mBy(resultPlace);

		this.spec = jsCopy(spec);
		this.defaults = defaults;
		this.defaultPool = jsCopy(data);

		this.activeNodes = null;//list [] ids of spec nodes that are active this round
		this.processedNodes = {};
		this.current = null;
		this.tree = null;
		//sicher muessen hier noch paar dictionaries initialized werden!!!!!
		//weiss aber noch nicht welche

		// _ids fuer _ref entries
		this._ids = { static: {} };
		this.places = {};//static ids are in _ids.static, others by oid

	}
	augment(node) { }
	createNode(key) {
		let node = jsCopy(this.spec[key]);
		node = this.setDefaults(node);
		node.specKey = key;
		return node;
	}
	merge(nodes) { }
	message(msg) {
		this.stepCounter += 1;
		//msg = 'step ' + this.stepCounter + ': ' + msg;
		this.dMessage.innerHTML = msg;
	}
	expand(nodes) { }

	setActiveNodes() {
		//for now all spec nodes
		let keys = Object.keys(this.spec);
		//this.message('todo: ' + keys.join(', '));
		this.activeNodes = keys;
	}

	setDefaults(node) {
		if (nundef(node.type)) node.type = this.defaults.type;
		let typeSpecificDefaults = this.defaults[node.type];
		if (isdef(typeSpecificDefaults)) node = deepmerge(typeSpecificDefaults, node);
		return node;
	}

	addToPlaces(specKey, idName, propList) {
		if (nundef(this.places[idName])) this.places[idName] = [];
		this.places[idName].push({ specKey: specKey, propList: propList });
	}
	recFindProp(specKey, o, prop, path) {
		if (!isDict(o)) { return; }
		if (o[prop]) { this.addToPlaces(specKey, o[prop], path); }
		for (const k in o) { let result = this.recFindProp(specKey, o[k], prop, path + '.' + k); }
	}
	check_id(n) {
		let akku = [];
		this.recFindProp(n.specKey, n, '_id', 'self');
		console.log('places', this.places);
	}
	process(key) {

		let nodeProto = this.createNode(key); //this created a prototype
		//console.log(nodeProto)


		this.processedNodes[key] = nodeProto;

		//wenn er _ref hat, place it
		//wenn er _id hat, trage es ein
		//ex node w/ key=ROOT has key _id at toplevel
		this.check_id(nodeProto);


		if (key == 'ROOT') this.tree = jsCopy(nodeProto);
		return nodeProto;

	}
	async step() {
		if (!this.activeNodes) { this.setActiveNodes(); this.clear() }
		else {
			let key = !this.tree ? 'ROOT' : this.activeNodes[0];
			removeInPlace(this.activeNodes, key); // for now just always assume there is a node named ROOT in spec

			this.current = this.process(key);

			this.visualize();
		}
		if (isEmpty(this.activeNodes)) { this.activeNodes = null; this.message('DONE!'); return false; }
		else { this.message(this.activeNodes.join(', ')); return true; }
	}

	visNode(n,dCont){
		let d = mCreate('div');
		mClass(d, 'node');
		mYaml(d, n);
		mAppend(dCont, d)
	}
	visualize() {
		this.visNode(this.current,this.dProcess);
		clearElement(this.dDicts);
		this.visNode(this.places,this.dDicts);
		//console.log(this.current);
	}
	clear(){
		clearElement(this.dProcess);
		clearElement(this.dDicts);
		clearElement(this.dTree);
		clearElement(this.dResult);
	}


}