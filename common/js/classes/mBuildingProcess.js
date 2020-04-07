const STAGES = { select: -1, protos: 1, forward: 2, backward: 3, dynamic: 4, uiDone: 5 };
const TYPECLASS = {
	panel: new mPanel(),
	list: new mList(),
}
class mBuildingProcess {
	constructor(spec, data, defaults, messagePlace, protoPlace, 
		dictsPlace, forwardPlace, backwardPlace,treePlace, resultPlace) {
		this.stepCounter = 0;
		this.dMessage = mBy(messagePlace);
		this.dProtos = mBy(protoPlace);
		this.dDicts = mBy(dictsPlace);
		this.dForward = mBy(forwardPlace);
		this.dBackward = mBy(backwardPlace);
		this.dTree = mBy(treePlace);
		this.dResult = mBy(resultPlace);

		this.spec = jsCopy(spec);
		this.defaults = defaults;
		this.defaultPool = jsCopy(data);

		this.todo = null;
		this.activeNodes = null;//list [] ids of spec nodes that are active this round
		this.protoNodes = {};
		this.forwardNodes = {};
		this.backwardNodes = {};
		this.current = null;
		this.currentKey = null;
		this.tree = null;
		//sicher muessen hier noch paar dictionaries initialized werden!!!!!
		//weiss aber noch nicht welche
		
		this.places = {};// _ids fuer _ref entries

		//stages in process
		this.stage = STAGES.select;

	}
	//main: construction of tree one step at a time
	async step() {
		let key;
		//console.log('stage is',this.stage);
		//console.log(this);
		//return;
		switch (this.stage) {
			case STAGES.select:
				//state: this.activeNodes==null
				console.assert(!this.activeNodes, 'stage none but activeNodes non-null!!!');
				this.setActiveNodes();
				this.clear();
				this.stage = STAGES.protos;
				this.currentKey = 'ROOT';
				break;
			case STAGES.protos: //todo can't b empty here bcause there must be ROOT!
				key = this.currentKey;
				removeInPlace(this.todo, key); // for now just always assume there is a node named ROOT in spec
				this.protoNodes[key] = this.current = this.makePrototype(key);
				if (key == 'ROOT') this.tree = this.current;
				//also filled places dict!
				this.visualizeProtoNode();
				if (isEmpty(this.todo)) {
					//prep static
					this.stage = STAGES.forward;
					this.todo = Object.keys(this.protoNodes);
					this.currentKey = 'ROOT';
				} else {
					this.currentKey = this.todo[0];
				}
				break;
			case STAGES.forward: //todo can't b empty here bcause there must be ROOT!
				key = this.currentKey;
				removeInPlace(this.todo, key); // for now just always assume there is a node named ROOT in spec
				this.forwardNodes[key] = this.current = this.forwardMerge(key);
				if (key == 'ROOT') this.tree = this.current; //update tree!
				console.log(this.current);
				this.visForwardNode();
				if (isEmpty(this.todo)) {
					//prep static
					this.stage = false; //STAGES.backward;
					this.todo = Object.keys(this.forwardNodes);
					this.currentKey = 'ROOT';
				} else {
					this.currentKey = this.todo[0];
				}
				break;
			case STAGES.backward:
				// this.stage = false;
				key = this.currentKey;
				removeInPlace(this.todo, key); // for now just always assume there is a node named ROOT in spec
				this.backwardNodes[key] = this.current = this.backwardMerge(key);
				if (key == 'ROOT') this.tree = this.current; //update tree!
				console.log(this.current);
				this.visBackwardNode();
				if (isEmpty(this.todo)) {
					//prep static
					this.stage = false; //STAGES.dynamic;
					this.todo = Object.keys(this.backwardNodes);
					this.currentKey = 'ROOT';
				} else {
					this.currentKey = this.todo[0];
				}
				break;





		}
		this.messageStage();
		return this.stage;
	}
	//#region stage select: select active nodes (=spec nodes used in this building process)
	setActiveNodes() {
		//for now all spec nodes
		let keys = Object.keys(this.spec);
		//this.message('todo: ' + keys.join(', '));
		this.activeNodes = keys;
		this.todo = jsCopy(keys);
	}
	//#endregion
	
	//#region stage protos: each spec node becomes a prototype, _id => places
	makePrototype(key) {
		let nodeProto = this.createNode(key);
		this.check_id(key,nodeProto);
		return nodeProto;
	}
	createNode(key) {
		let node = jsCopy(this.spec[key]);
		node = this.setDefaultType(node);
		//node.specKey = key; //for now! TODO: think ob ich das brauche?!?!?
		return node;
	}
	setDefaultType(node) {
		node.type = this.formatToListAndSetDefault(node, 'type', this.defaults.type);
		if (isList(node.panels)) {
			node.panels = node.panels.map(x => this.setDefaultType(x));
		}

		return node;
	}
	check_id(specKey,node) {
		let akku = {};
		recFindProp(node, '_id', 'self', akku);
		//console.log(node.specKey, node, akku);
		for (const k in akku) { this.addToPlaces(specKey, akku[k], k); }
		//console.log('places', this.places)
	}
	addToPlaces(specKey, idName, propList) {
		if (nundef(this.places[idName])) this.places[idName] = [];
		this.places[idName].push({ specKey: specKey, propList: propList });
	}
	//#endregion
	
	//#region stage forward: root expanded forward recursively (type merging)
	forwardMerge(key) {
		let node = jsCopy(this.protoNodes[key]);
		if (key == 'ROOT') this.tree = node;
		node = this.recForwardMerge(node);
		return node;
	}

	recForwardMerge(node) {
		console.log(node)
		if (!isDict(node)) return node;

		if (node.type) {
			let types = node.type;
			types.map(x => node = this.fMerge(node, x));
		}

		//jeder type weiss selbst wo ueberall nodes eingehaengt werden koennen
		node.type.map(x => TYPECLASS[x].do(node, this.recForwardMerge.bind(this)));

		return node;
	}

	fMerge(node, key) {
		//merge node with proto[key]
		if (this.protoNodes[key]) node = deepmergeOverride(node, this.forwardMerge(key));
		return node;
	}
	//#endregion
	
	//#region stage backward merge: aufloesen von _ref
	backwardMerge(key) {
		let node = jsCopy(this.forwardNodes[key]);
		if (key == 'ROOT') this.tree = node;
		node = this.recBackwardMerge(node);
		return node;
	}
	recForwardMerge(node) {
		//console.log(node)
		if (!isDict(node)) return node;

		if (node.type) {
			let types = node.type;
			types.map(x => node = this.fMerge(node, x));
		}

		//jeder type weiss selbst wo ueberall nodes eingehaengt werden koennen
		node.type.map(x => TYPECLASS[x].do(node, this.recForwardMerge.bind(this)));

		return node;
	}

	//#region helpers
	clear() {
		clearElement(this.dProtos);
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
	
	isa(node, type) { return node.type.includes(type); }
	messageStage() { 
		this.message(findKey(STAGES,this.stage) + ': ' + this.todo.join(' ')); 
		this.visTree();
	}
	message(msg) {
		this.stepCounter += 1;
		//msg = 'step ' + this.stepCounter + ': ' + msg;
		this.dMessage.innerHTML = msg;
	}
	visNodeYaml(n, dCont) {
		let d = mCreate('div');
		mClass(d, 'nodeYaml');
		mYaml(d, n);
		mAppend(dCont, d)
		return d;
	}
	visNodeManual(n, dCont) {
		let d = mCreate('div');
		mClass(d, 'nodeYaml');
		let n2 = jsCopy(n);
		recModTypeToString(n2);
		mYaml(d, n2);
		mAppend(dCont, d);
		return d;
	}
	visNodePP(n, dCont) {
		let d = mCreate('div');
		mClass(d, 'nodePP');
		let tbl = prettyPrint(n, {
			// Config
			maxArray: 20, // Set max for array display (default: infinity)
			expanded: true, // Expanded view (boolean) (default: true),
			maxDepth: 15 // Max member depth (when displaying objects) (default: 3)
		})
		mAppend(d, tbl);
		console.table(n);
		//all type properies and all _id and _ref properties should become
		// [A,B,C] instead of yaml rep

		mAppend(dCont, d)
		return d;
	}
	visNode(n, d) { return this.visNodeManual(n, d); }
	visTree(){
		if (this.tree){
			clearElement(this.dTree);
			this.visNode(this.tree,this.dTree);
		}
	}
	visualizeProtoNode() {
		this.visNode(this.current, this.dProtos);
		clearElement(this.dDicts);
		this.visNode(this.places, this.dDicts);
		//console.log(this.current);
	}
	visForwardNode() {
		let d = this.visNode(this.current, this.dForward);
		
	}
	//#endregion


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

			this.current = this.makePrototype(key);

			this.visualizeProtoNode();
		}
		if (isEmpty(this.activeNodes)) { this.activeNodes = null; this.message('DONE!'); return false; }
		else { this.message(this.activeNodes.join(', ')); return true; }
	}

	//#endregion


}