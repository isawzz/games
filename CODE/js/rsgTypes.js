
class RSG {
	constructor(sp, defs, sdata) {
		this.sp = sp;
		//console.log(this.sp)
		this.lastSpec = this.sp; //just points to last spec produced in last step performed
		this.ROOT = this.sp.ROOT;
		this.defs = defs;

		this.init(); //prepares _sd, places...
		for (const oid in sdata) { this.addObject(oid, sdata[oid]); }
		this.defSource = Object.keys(sdata);
		// console.log('oids',this.defSource)

		this.isUiActive = false;

		this.genIdRef();
		this.genMerge();
		//console.log('\n_ids',this._ids, '\n_refs',this._refs);
		//console.log('\nrefs', this.refs,'\nplaces', this.places);


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
		this.gens[genKey].push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;
	}
	genMerge(genKey = 'G') {
		//return;
		let orig = this.lastSpec;
		let gen = jsCopy(this.lastSpec);

		console.log(this.places);
		//how to get all places within a spec node?
		let byNode = {};
		for (const name in this.places) {
			let idByName = this.places[name];
			for (const spk in idByName) { //DIESES KOENNTE MAN STREICHEN! WENN EH NUR 1 incident!
				let list = idByName[spk];
				console.log(list, typeof list);
				for (const el of list) {
					lookupAddToList(byNode, [spk], el);
				}
			}
		}
		console.log('byNode', byNode);
		for (const spk in byNode) {
			let arr = byNode[spk];
			console.log('arr', arr)
			sortByFuncDescending(arr, x => x.ppath.length);
			console.log('sorted', arr);
		}

		for (const spk in byNode) {
			let idlistByNode = byNode[spk];
			for (const id_entry of idlistByNode) { //DIESES KOENNTE MAN STREICHEN! WENN EH NUR 1 incident!
				let name = id_entry.idName;
				//let id_entry = idByName[spk][0]; //MUST BE UNIQUE!!! does NOT need to be a list!!!
				//console.log(id_entry);

				console.log('calling findAddress', spk, gen, id_entry.ppath);
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


					console.log('merged',merged);
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

				console.log(obj, key, name)

				if (sub.length == 1) {
					if (isdef(obj[key]._NODE)) { //!!!!!!!!!!!!!!!!!!
						let x = obj[key]._NODE;
						obj[key]._NODE = [x, sub[0]._NODE];
						console.log('resulting obj', obj[key])
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
	genNODE(genKey = 'G') {
		let gen = jsCopy(this.lastSpec);

		for (const k in gen) {
			//usage: safeRecurse(o, func, params, tailrec) 
			safeRecurse(gen[k], normalizeToList, '_NODE', true);
		}

		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		this.ROOT = gen.ROOT;
		//console.log(gen)
	}

	init() {
		this.places = {};
		this.refs = {};

		this.UIS = {};
		this.uid2oids = {};
		this.oid2uids = {};
		this._sd = {};
		this.oidNodes = null;

		this.gens = { G: [this.sp] };

		this.Locations = {}; //locations: sind das die here nodes?
		this.oidNodes = {};
		this.rNodes = {}; // rtree
		this.uiNodes = {}; // ui tree
		this.rNodesOidKey = {}; //andere sicht of rtree
		this.tree = {};

	}
	check_prop(prop, specKey, node, R) {
		let dictIds = {};
		recFindExecute(node, prop, x => { dictIds[x[prop]] = x; });

		//console.log(dictIds);
		return dictIds;
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

	//#region helpers
	addToPlaces(specKey, placeName, ppath, node) {
		lookupAddToList(this.places, [placeName, specKey],
			{ idName: placeName, specKey: specKey, ppath: ppath, node: node });
	}
	addToRefs(specKey, placeName, ppath, node) {
		lookupAddToList(this.refs, [placeName, specKey], { idName: placeName, specKey: specKey, ppath: ppath, node: node });
	}
	clearObjects() {
		this.UIS = {};
		this.uid2oids = {};
		this.oid2uids = {};
		this._sd = {};

	}
	getO(oid) { return lookup(this._sd, [oid, 'o']); }
	addObject(oid, o) {
		let o1 = jsCopy(o);
		o1.oid = oid;
		this._sd[oid] = { oid: oid, o: o1, rsg: [] };
	}
	deleteObject(oid) { delete this._sd[oid]; }

	getR(oid) { return lookup(this._sd, [oid, 'rsg']); }
	addR(oid, k) { addIf(this.getR(oid), k); }
	updateR(k) {
		let nSpec = this.lastSpec[k];
		if (!nSpec.cond) return;
		let cond = nSpec.cond;
		for (const oid in this._sd) {
			if (evalConds(this._sd[oid].o, cond)) {
				this.addR(oid, k);
			}
		}
	}
	removeR(oid, key) { let r = lookup(this._sd, [oid, 'rsg']); if (r) removeInPlace(r, key); }

	getUI(uid) { return lookup(this.UIS, [uid, 'ui']); }

	getSpec(spKey = null) { return spKey ? this.lastSpec[spKey] : this.lastSpec; }

	getPlaces(placeName) {
		return (placeName in this.places) ? this.places[placeName] : {};
	}
	getRefs(placeName) {
		return (placeName in this.places) ? this.refs[placeName] : {};
	}


	//#endregion helpers

	//#region register
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

	//#endregion

}

function createUi(n, area, R, defParams) {

	if (nundef(n.type)) { n.type = inferType(n); }

	R.registerNode(n);

	decodeParams(n, R, defParams);

	//console.log(n,n.type)
	let ui = RCREATE[n.type](n, mBy(area), R);

	if (nundef(n.uiType)) n.uiType = 'd'; // d, g, h (=hybrid)

	if (n.uiType == 'NONE') return ui;


	//if (n.uiType != 'g') applyCssStyles(n.uiType == 'h'?mBy(n.uidStyle):ui, n.cssParams);
	applyCssStyles(n.uiType == 'h' ? mBy(n.uidStyle) : ui, n.cssParams);
	// else{
	// 	console.log(ui);
	// 	ui.style.filter='grayscale(0.5)';

	// }
	// if (n.uiType == 'h') {
	// 	// console.log('NOT APPLYING CSS STYLES!!!', n.uid, n.uiType, n.params)
	// 	applyCssStyles(mBy(n.uidStyle), n.cssParams);
	// } else {
	// 	applyCssStyles(ui, n.cssParams);
	// }

	//TODO: hier muss noch die rsg std params setzen (same for all types!)
	if (!isEmpty(n.stdParams)) {
		//console.log('rsg std params!!!', n.stdParams);
		switch (n.stdParams.display) {
			case 'if_content': if (!n.content) hide(ui); break;
			case 'hidden': hide(ui); break;
			default: break;
		}
	}

	R.setUid(n, ui);
	return ui;

}
function isStatic(x) { let t = lookup(x, ['meta', 'type']); return t == 'static'; }
function isDynamic(x) { let t = lookup(x, ['meta', 'type']); return t == 'dynamic'; }
function isMap(x) { let t = lookup(x, ['meta', 'type']); return t == 'map'; }
function mergeChildrenWithRefs(n, R) {
	for (const k in n) {
		//muss eigentlich hier nur die containerProp checken!
		let ch = n[k];
		if (nundef(ch._id)) continue;

		let loc = ch._id;
		//console.log('node w/ id', loc, ch);
		//console.log('parent of node w/ id', loc, jsCopy(n));

		//frage is container node n[containerProp] ein object (b) oder eine list (c)?
		//oder ist _id at top level (n._id) =>caught in caller


		let refs = R.refs[loc];
		if (nundef(refs)) continue;

		//have refs and ids to 1 _id location loc (A)
		//console.log('refs for', loc, refs);

		//parent node is 


		let spKey = Object.keys(refs)[0];
		let nSpec = R.lastSpec[spKey];
		//console.log('nSpec', nSpec);
		let oNew = deepmerge(n[k], nSpec);
		//console.log('neues child', oNew);
		n[k] = oNew;


	}
}
function mergeAllRefsToIdIntoNode(n, R) {
	//n has prop _id
	let loc = n._id;
	let refDictBySpecNodeName = R.refs[loc];
	let nNew = jsCopy(n); //returns new copy of n TODO=>copy check when optimizing(=nie?)
	for (const spNodeName in refDictBySpecNodeName) {
		let reflist = refDictBySpecNodeName[spNodeName];
		for (const ref of reflist) {
			nNew = deepmergeOverride(nNew, ref);
		}
	}
	return nNew;
	//console.log(refDictBySpecNodeName);
}
function safeMerge(a, b) {
	if (nundef(a) && nundef(b)) return {};
	else if (nundef(a)) return jsCopy(b);
	else if (nundef(b)) return jsCopy(a);
	else return deepmergeOverride(a, b);
}




