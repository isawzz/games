const STAGES = { none: -1, ready: 1, protos: 2, static: 3, dynamic: 4, uiDone: 5 };
class mBuildingProcess {
	constructor(spec, data, defaults, messagePlace, processedPlace, dictsPlace, forwardPlace, treePlace, resultPlace) {
		this.stepCounter = 0;
		this.dMessage = mBy(messagePlace);
		this.dProcess = mBy(processedPlace);
		this.dDicts = mBy(dictsPlace);
		this.dForward = mBy(forwardPlace);
		this.dTree = mBy(treePlace);
		this.dResult = mBy(resultPlace);

		this.spec = jsCopy(spec);
		this.defaults = defaults;
		this.defaultPool = jsCopy(data);

		this.todo = null;
		this.activeNodes = null;//list [] ids of spec nodes that are active this round
		this.protoNodes = {};
		this.current = null;
		this.tree = null;
		//sicher muessen hier noch paar dictionaries initialized werden!!!!!
		//weiss aber noch nicht welche

		// _ids fuer _ref entries
		this._ids = { static: {} };
		this.places = {};//static ids are in _ids.static, others by oid
		this.places1 = {};//test recFindProp in helpers!!!

		//stages in process
		this.stage = STAGES.none;

	}
	//main: construction of tree one step at a time
	async step() {
		let key;
		switch (this.stage) {
			case STAGES.none:
				//state: this.activeNodes==null
				console.assert(!this.activeNodes, 'stage none but activeNodes non-null!!!');
				this.setActiveNodes();
				this.clear();
				this.stage = STAGES.ready;
				this.currentKey = 'ROOT';
				break;
			case STAGES.ready: //todo can't b empty here bcause there must be ROOT!
				key = this.currentKey;
				removeInPlace(this.todo, key); // for now just always assume there is a node named ROOT in spec
				this.current = this.makePrototypes(key);
				this.visualizeProtoNode();
				if (isEmpty(this.todo)) {
					//prep static
					this.stage = STAGES.protos;
					this.todo = Object.keys(this.protoNodes);
					this.currentKey = 'ROOT';
				} else {
					this.currentKey = this.todo[0];
				}
				break;
			case STAGES.protos: //todo can't b empty here bcause there must be ROOT!
				key = this.currentKey;
				removeInPlace(this.todo, key); // for now just always assume there is a node named ROOT in spec
				this.current = this.forwardMerge(key);
				console.log(this.current);
				this.visForwardNode();
				if (isEmpty(this.todo)) {
					//prep static
					this.stage = STAGES.static;
					this.todo = Object.keys(this.protoNodes);
					this.currentKey = 'ROOT';
				} else {
					this.currentKey = this.todo[0];
				}
				break;

			//again starting at root, do forward and backward merges
			//take current node, 





		}
		this.messageStage();
		return this.stage;
	}
	//stage none: select active nodes (=spec nodes used in this building process)
	setActiveNodes() {
		//for now all spec nodes
		let keys = Object.keys(this.spec);
		//this.message('todo: ' + keys.join(', '));
		this.activeNodes = keys;
		this.todo = jsCopy(keys);
	}
	//stage ready: each spec node becomes a prototype, _id => places
	makePrototypes(key) {
		let nodeProto = this.createNode(key);
		this.protoNodes[key] = nodeProto;
		this.check_id(nodeProto); 
		if (key == 'ROOT') this.tree = jsCopy(nodeProto);
		return nodeProto;
	}
	createNode(key) {
		let node = jsCopy(this.spec[key]);
		node = this.setDefaultType(node);
		node.specKey = key;
		return node;
	}
	setDefaultType(node){
		node.type = this.formatToListAndSetDefault(node, 'type', this.defaults.type);
		if (isList(node.panels)) {
			node.panels = node.panels.map(x => this.setDefaultType(x));
		}

		return node;
	}
	check_id(node) {
		let akku = {};
		recFindProp(node, '_id', 'self', akku);
		//console.log(node.specKey, node, akku);
		for (const k in akku) { this.addToPlaces(node.specKey, akku[k], k); }
		//console.log('places', this.places)
	}
	addToPlaces(specKey, idName, propList) {
		if (nundef(this.places[idName])) this.places[idName] = [];
		this.places[idName].push({ specKey: specKey, propList: propList });
	}
	//stage protos: root expanded forward recursively (type merging)
	forwardMerge(key) {
		let node = jsCopy(this.protoNodes[key]);
		if (key == 'ROOT') this.tree = node;
		node = this.recForwardMerge(node);
		return node;
	}
	fMerge(node, key) {
		//merge node with proto[key]
		if (this.protoNodes[key]) node = deepmergeOverride(node, this.forwardMerge(key));
		return node;
	}
	recForwardMerge(node) {
		console.log(node)
		if (!isDict(node)) return node;

		if (node.type) {
			let types = node.type;
			//wenn es wirklich mehrere sind und am ende : brauch da beispiele!!!!!!
			//console.log('type list (muss es geben!)', types);
			types.map(x => node = this.fMerge(node, x));
		}

		//jeder node weiss selbst wo ueberall nodes eingehaengt werden koennen
		//erstmal nur fuer panels!
		//console.log(node.type);
		//return node;
		if (node.type.includes('panel') && isdef(node.panels)) {
			node.panels = node.panels.map(x => this.recForwardMerge(x));
		}
		return node;
	}
	


	//#region helpers
	clear() {
		clearElement(this.dProcess);
		clearElement(this.dDicts);
		clearElement(this.dForward);
		clearElement(this.dTree);
		clearElement(this.dResult);
	}
	formatToListAndSetDefault(o, prop, defaultVal) {
		if (nundef(o[prop])) o[prop] = defaultVal;
		if (!isList(o[prop])) o[prop] = [o[prop]];
		return o[prop];
	}
	messageStage() { this.message('P' + this.stage + ': ' + this.todo.join(' ')); }
	message(msg) {
		this.stepCounter += 1;
		//msg = 'step ' + this.stepCounter + ': ' + msg;
		this.dMessage.innerHTML = msg;
	}
	visNode(n, dCont) {
		let d = mCreate('div');
		mClass(d, 'node');
		mYaml(d, n);
		mAppend(dCont, d)
	}
	visualizeProtoNode() {
		this.visNode(this.current, this.dProcess);
		clearElement(this.dDicts);
		this.visNode(this.places, this.dDicts);
		//console.log(this.current);
	}
	visForwardNode() {
		this.visNode(this.current, this.dForward);
	}



	//#region not used
	augment(node) { }
	merge(nodes) { }
	expand(nodes) { }
	setDefaults(node) {
		//muss auch recursiv sein!!!! und per type!
		let lst = this.formatToListAndSetDefault(node, 'type', this.defaults.type);
		lst.map(x => { if (isdef(this.defaults[x])) node = deepmerge(this.defaults[x], node); });

		if (isdef(node.panels)) {
			let t = 'panel';
			node.panels = node.panels.map(x => this.setDefaults(x));
		}

		return node;
		// let typeSpecificDefaults = this.defaults[node.type];
		// if (isdef(typeSpecificDefaults)) node = deepmerge(typeSpecificDefaults, node);
		// return node;
	}
	async step_old() {
		if (!this.activeNodes) { this.setActiveNodes(); this.clear() }
		else {
			let key = !this.tree ? 'ROOT' : this.activeNodes[0];
			removeInPlace(this.activeNodes, key); // for now just always assume there is a node named ROOT in spec

			this.current = this.makePrototypes(key);

			this.visualizeProtoNode();
		}
		if (isEmpty(this.activeNodes)) { this.activeNodes = null; this.message('DONE!'); return false; }
		else { this.message(this.activeNodes.join(', ')); return true; }
	}



}