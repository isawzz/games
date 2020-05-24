
class RSG {
	constructor(sp, defs) { //}, sdata) {
		this.sp = sp;

		this.lastSpec = this.sp; //just points to last spec produced in last step performed
		this.ROOT = this.sp.ROOT;
		this.defs = defs;

		this.init(); //prepares _sd, places...
		//for (const oid in sdata) { this.addObject(oid, sdata[oid]); }
		//this.defSource = Object.keys(sdata);

		this.isUiActive = false;

		this.genIdRef();
		this.genMerge();
	}
	genIdRef(genKey = 'G') {
		let gen = jsCopy(this.lastSpec);
		for (const k in gen) {
			let n = gen[k];
			this.check_ref(k, n);
		}
		for (const k in gen) {
			let n = gen[k];
			this.check_id(k, n, this);
		}
		for (const k in gen) {
			let n = gen[k];
			this.check_mixin(k, n, this);
		}
		this.gens[genKey].push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;
	}
	genMerge(genKey = 'G') {
		//return;
		let orig = this.lastSpec;
		let gen = jsCopy(this.lastSpec);

		//console.log(this.places);
		//how to get all places within a spec node?
		let byNode = {};
		for (const name in this.places) {
			let idByName = this.places[name];
			for (const spk in idByName) { //DIESES KOENNTE MAN STREICHEN! WENN EH NUR 1 incident!
				let list = idByName[spk];
				//console.log(list, typeof list);
				for (const el of list) {
					lookupAddToList(byNode, [spk], el);
				}
			}
		}
		//console.log('byNode', byNode);
		for (const spk in byNode) {
			let arr = byNode[spk];
			//console.log('arr', arr)
			sortByFuncDescending(arr, x => x.ppath.length);
			//console.log('sorted', arr);
		}

		for (const spk in byNode) {
			let idlistByNode = byNode[spk];
			for (const id_entry of idlistByNode) { //DIESES KOENNTE MAN STREICHEN! WENN EH NUR 1 incident!
				let name = id_entry.idName;
				//let id_entry = idByName[spk][0]; //MUST BE UNIQUE!!! does NOT need to be a list!!!
				//console.log(id_entry);

				//console.log('calling findAddress', spk, gen, id_entry.ppath);
				let [key, obj] = findAddress(spk, gen, id_entry.ppath);

				let sub = [];
				//foreach existing ref to name 
				let refs = this.refs[name];
				for (const refSpecKey in refs) {
					let ref_entry = refs[refSpecKey][0]; // for now only allow UNIQUE _ref to same name in same spec node!!!
					//console.log('ref_entry',ref_entry);

					let idnode = obj[key];
					//idnode = safeMerge(idnode,id_entry.node);
					console.log('idnode',idnode)
					let merged = safeMerge(idnode, ref_entry.node); //HOW to merge each property?

					//orig!
					//let merged = safeMerge(id_entry.node, ref_entry.node); //HOW to merge each property?


					//console.log('merged',merged);
					delete merged._ref;
					delete merged._id;
					let uid = getUID('sp');
					gen[uid] = merged;
					sub.push({ _NODE: uid });
				}

				//console.log('==>\nobj', obj, '\nkey', key, '\n?', obj[key]._NODE)
				if (sub.length == 0) {
					//no ref exists for this id! (in ALL of spec!!!!!)
					//if name is name of spec node, replace by that name
					//otherwise error!
					if (isdef(this.lastSpec[name])) {
						obj[key]._NODE = name; //!!!!!!!!!!!!
						delete obj[key]._id;
						console.log('==> please replace _id by _NODE!', id_entry.specKey, id_entry.ppath, name, obj);
						alert('SPEC ERROR! =>please replace _id:' + name + ' by _NODE:', name);
					} else {
						console.log('_id without any reference or node!', id_entry.specKey, id_entry.ppath, name, obj);
					}
					continue;
				}

				//console.log(obj, key, name)

				if (sub.length == 1) {
					if (isdef(obj[key]._NODE)) { //!!!!!!!!!!!!!!!!!!
						let x = obj[key]._NODE;
						obj[key]._NODE = [x, sub[0]._NODE];
						//console.log('resulting obj', obj[key])
					} else obj[key] = sub[0];
				}
				else obj[key] = { sub: sub };
			}
			//hiermit is _id:name abgebaut fuer alle refs darauf!
		}

		//console.log('_________GEN:',gen);
		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		this.ROOT = this.lastSpec.ROOT;
	}
	initRound() { this.oUpdated = {}; this.rUpdated = {}; }
	init() {
		this.places = {};
		this.mixins = {};
		this.refs = {};

		this.UIS = {};
		this.uid2oids = {};
		this.oid2uids = {};
		this._sd = {};

		this.locOids = [];

		this.gens = { G: [this.sp] };

		this.Locations = {}; //locations: sind das die here nodes?
		this.rNodes = {}; // rtree
		this.uiNodes = {}; // ui tree
		//this.rNodesOidKey = {}; //andere sicht of rtree
		this.tree = {};
		this.initRound();
	}

	//ids and refs
	addToPlaces(specKey, placeName, ppath, node) {
		lookupAddToList(this.places, [placeName, specKey],
			{ idName: placeName, specKey: specKey, ppath: ppath, node: node });
	}
	addToMixins(specKey, placeName, ppath, node) {
		lookupAddToList(this.mixins, [placeName, specKey],
			{ idName: placeName, specKey: specKey, ppath: ppath, node: node });
	}
	addToRefs(specKey, placeName, ppath, node) {
		lookupAddToList(this.refs, [placeName, specKey], { idName: placeName, specKey: specKey, ppath: ppath, node: node });
	}
	check_id(specKey, node, R) {
		let akku = {};
		recFindProp(node, '_id', 'self', akku);
		for (const k in akku) {
			let node = akku[k].node;
			let path = k;
			let name = akku[k].name;
			this.addToPlaces(specKey, name, path, node);
		}
	}
	check_mixin(specKey, node, R) {
		let akku = {};
		recFindProp(node, '_mixin', 'self', akku);
		for (const k in akku) {
			let node = akku[k].node;
			let path = k;
			let name = akku[k].name;
			this.addToMixins(specKey, name, path, node);
		}
	}
	check_ref(specKey, node) {
		let akku = {};
		recFindProp(node, '_ref', 'self', akku);
		//console.log('specKey',specKey,'akku',akku)
		for (const k in akku) {
			let node = akku[k].node;
			let path = k;
			let name = akku[k].name;
			//console.log('call addToRefs mit',specKey,name,path,node)
			this.addToRefs(specKey, name, path, node);
		}
	}

	//server objects
	addToLocOids(oid) { addIf(this.locOids, oid); } //%%%
	removeFromLocOids(oid) { removeInPlace(this.locOids, oid); }
	clearObjects() {
		this.UIS = {};
		this.uid2oids = {};
		this.oid2uids = {};
		this._sd = {};
		this.locOids = [];
		this.oUpdated = {}; this.rUpdated = {};
	}
	getO(oid) { return lookup(this._sd, [oid, 'o']); }

	addObject(oid, o) {
		//TODO: was wenn oid bereits in _sd ist???!!! OVERRIDE
		if (this.oUpdated[oid]) {
			console.log('object', oid, 'already updated this round!!!!!');
			return;
		} else this.oUpdated[oid] = true;

		let o1 = jsCopy(o);
		if (isdef(o.loc)) this.addToLocOids(oid);// %%%
		o1.oid = oid;
		this._sd[oid] = { oid: oid, o: o1, rsg: [] };
	}
	deleteObject(oid) { this.removeFromLocOids(oid); delete this._sd[oid]; }

	// rsg: spec nodes for oids
	getR(oid) { return lookup(this._sd, [oid, 'rsg']); }
	addR(oid, k) { addIf(this.getR(oid), k); }

	notThisNode(n) { return nundef(n.cond) || isdef(n._ref); } //do NOT check _ref nodes!
	addRForObject(oid) {
		if (this.rUpdated[oid]) {
			console.log('rsg list for object', oid, 'already updated this round!!!!!!');
			return;
		} else this.rUpdated[oid] = true;

		let o = this.getO(oid);
		let sp = this.getSpec();

		//eval conds (without no_spec!)
		for (const k in sp) {
			let n = sp[k];
			if (this.notThisNode(n)) continue;
			if (n.cond == 'all' || evalConds(o, n.cond)) { this.addR(oid, k); }
		}
		//check for no_spec clauses
		if (isEmpty(this.getR(oid))) {

			for (const k in sp) {
				let n = sp[k];
				if (nundef(n.cond)) continue;
				let keys = Object.keys(n.cond);
				if (!keys.includes('no_spec')) continue;
				let condCopy = jsCopy(n.cond);
				delete condCopy['no_spec'];
				if (evalConds(o, condCopy)) { this.addR(oid, k); }
			}
		}
	}
	updateR(k) {
		let nSpec = this.getSpec(k);
		if (this.notThisNode(nSpec)) return;
		let cond = nSpec.cond;
		for (const oid in this._sd) {
			if (evalConds(this._sd[oid].o, cond)) {
				this.addR(oid, k);
			}
		}
	}
	removeR(oid, key) { let r = lookup(this._sd, [oid, 'rsg']); if (r) removeInPlace(r, key); }

	// getters
	getUI(uid) { return lookup(this.UIS, [uid, 'ui']); }

	getSpec(spKey = null) { return spKey ? this.lastSpec[spKey] : this.lastSpec; }

	getPlaces(placeName) {
		return (placeName in this.places) ? this.places[placeName] : {};
	}
	getRefs(placeName) {
		return (placeName in this.places) ? this.refs[placeName] : {};
	}

	// register
	registerNode(n) {
		if (nundef(n.uid)) n.uid = getUID();
		let uid = n.uid;
		this.UIS[n.uid] = n;
		if (n.oid) {
			lookupAddIfToList(this.uid2oids, [uid], n.oid);
			lookupAddIfToList(this.oid2uids, [n.oid], uid);
		}
	}
	unregisterNode(n) {
		//console.log('=>unregister',n.uid,n.oid?'oid:'+n.oid:'');
		let uiNode = this.UIS[n.uid];
		if (nundef(uiNode)) return;
		let uid = n.uid;
		//console.log(uiNode);
		if (uiNode.uiType != 'NONE') {
			//do I have to explicitly remove handlers???
			let removableUi = uiNode.uiType == 'h' ? mBy(uiNode.uidDiv) : uiNode.ui;

			removeElem(removableUi);//GEHT DAS???????????????
			lookupRemoveFromList(this.uid2oids, [uid], n.oid, true);
			lookupRemoveFromList(this.oid2uids, [n.oid], uid, true);
		}
		delete this.UIS[n.uid];
		//however, _sd still contains the oid!
	}
	setUid(n, ui) {
		ui.id = n.uid;
		// if (n.uid == '_16') {
		// 	console.log('JAAAAAAAAAAAA');
		// }
		n.act = new Activator(n, ui, this);
	}



}


















