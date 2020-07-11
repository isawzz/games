
class RSG {
	constructor(sp, defs) { 
		this.sp = sp;

		this.lastSpec = this.sp; //just points to last spec produced in last step performed
		this.ROOT = this.sp.ROOT;
		this.defs = defs;

		this.init(); //prepares _sd, places...
		//for (const oid in sdata) { this.addObject(oid, sdata[oid]); }
		//this.defSource = Object.keys(sdata);

		this.isUiActive = false;

		Rgen(this, 0);

		// this.genIdRef();
		//this.genMerge();
		this.genNODE();
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
	genArrays() {
		//only data for ids and refs
		this.idarr = [];
		this.refarr = [];
		for (const name in this.places) {
			let idByName = this.places[name];
			for (const spk in idByName) {
				let placelist = idByName[spk];
				for (const el of placelist) {
					this.idarr.push(el);
					console.log(el, '\nnode', el.node)
				}
			}
		}
		for (const name in this.refs) {
			let refByName = this.refs[name];
			for (const spk in refByName) {
				let refslist = refByName[spk];
				for (const el of refslist) {
					this.refarr.push(el);
					console.log(el, '\nnode', el.node)
				}
			}
		}
		this.idByNode = {};
		this.idByName = {};
		for (const name in this.places) {
			let idByName = this.places[name];
			for (const spk in idByName) { //DIESES KOENNTE MAN STREICHEN! WENN EH NUR 1 incident!
				let list = idByName[spk];
				//console.log(list, typeof list);
				for (const el of list) {
					lookupAddToList(this.idByNode, [spk], el);
					lookupAddToList(this.idByName, [name], el);
				}
			}
		}
		this.refByNode = {};
		this.refByName = {};
		for (const name in this.refs) {
			let refByName = this.refs[name];
			for (const spk in refByName) { //DIESES KOENNTE MAN STREICHEN! WENN EH NUR 1 incident!
				let list = refByName[spk];
				//console.log(list, typeof list);
				for (const el of list) {
					lookupAddToList(this.refByNode, [spk], el);
					lookupAddToList(this.refByName, [name], el);
				}
			}
		}

		//simple waer es wenn ich jetzt durch jeden spec node gehe
		//recursively, und jedesmal merke mir place wo das id hingehoert
		//(gib einfach ein _NODE rein!)
		for (const id of this.idarr) {
			//find place where to put the _NODE
			//combine all refs into it
		}
	}
	sortIds() {
		let hasid = [];
		let noid = [];
		for (const name in IdByName) {
			let reflist = refByName[name];
			for (const ref of reflist) {
				let nref = ref.node;
				let akku = {};
				recFindProp(nref, '_id', 'self', akku);
				if (isEmpty(akku)) {
					ref.hasid = false;
					noid.push(ref);
				} else {
					ref.hasid = true;
					ref.idOccurrences = jsCopy(akku);
					hasid.push(ref);
				}
			}
		}
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
					let uid = getUID('sp');
					//console.log('key',key,'\nidnode',idnode)

					//v_orig!
					// let merged = safeMerge(id_entry.node, ref_entry.node); //HOW to merge each property?
					// sub.push({ _NODE: uid });

					//v_2
					// idnode = safeMerge(idnode,id_entry.node);
					// sub.push({ _NODE: uid });

					//v_3:
					// let merged = safeMerge(idnode, ref_entry.node); //HOW to merge each property?
					// sub.push({ _NODE: uid });
					// //console.log('------> merged alte version',jsCopy(merged))
					//hier muss genauso gemerged werden wie bei _NODE!

					//v_4:
					// let merged = merge1(idnode, ref_entry.node);
					// sub.push({ _NODE: uid });
					// //console.log('------> merged idnode zuerst',jsCopy(merged))

					//v_5 (fail_klappt_mit_panel):
					// let merged = jsCopy(ref_entry.node);
					// let resultNode = jsCopy(idnode); resultNode._NODE = uid; delete resultNode._add; sub.push(resultNode);
					// //console.log('------> merged nur ref node!',jsCopy(merged))

					//v_6:
					// let merged = merge1(ref_entry.node,idnode);
					// sub.push({ _NODE: uid });
					// //console.log('=>welcher soll als erstes stehen?','\nidnode',idnode,'\nref_entry.node',ref_entry.node,'\nmerged',merged);

					//v_7:
					let merged;
					if (isdef(idnode._merge) && idnode._merge == 'blend') {
						merged = merge1(ref_entry.node, idnode);
						sub.push({ _NODE: uid });
						//console.log('------> merged _merge=' + idnode._merge, jsCopy(merged));
					} else { //default merge mode: sub (sowie bei v_5 fail_klappt_mit_panel)
						//console.log('\nidnode', idnode, '\nrefnode', ref_entry.node)
						merged = jsCopy(ref_entry.node);
						let resultNode = jsCopy(idnode);

						//console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\nidnode', idnode, '\nrefnode', ref_entry.node, '\nresultnode', resultNode)

						// if (isdef(idnode._NODE)) {
						// 	let x = idnode._NODE;
						// 	if (isList(x)) {
						// 		//console.log('bbbbbbbbbbbbbbbbbbbbbb x list!',x)
						// 		//das _id ist sub[0]._NODE
						// 		//das orig _NODE ist eine liste x=[A,B,...]
						// 		//x.push(sub[0]._NODE);
						// 		x.unshift(uid);
						// 		resultNode._NODE = jsCopy(x); // sub[0]._NODE[x, sub[0]._NODE];
						// 	} else {
						// 		resultNode._NODE = [x, uid];
						// 	}
						// 	//console.log('resulting obj', obj[key])
						// } else resultNode._NODE = uid;

						resultNode._NODE = uid;
						//console.log('================\nidnode', jsCopy(idnode), '\nrefnode', jsCopy(ref_entry.node), '\nresultnode', jsCopy(resultNode))

						//resultNode._NODE = uid;
						delete resultNode._id;
						//console.log('\nidnode', idnode, '\nrefnode', ref_entry.node, '\nresultnode', resultNode)
						sub.push(resultNode);
						//console.log('------> sub sub',sub);
					}

					delete merged._ref;
					delete merged._id;
					gen[uid] = merged;


				}

				//console.log('==>\nobj', obj, '\nkey', key, '\n?', obj[key]._NODE)
				if (sub.length == 0) {
					//no ref exists for this id! (in ALL of spec!!!!!)
					//if name is name of spec node, replace by that name
					//otherwise error!
					if (isdef(this.lastSpec[name])) {
						obj[key]._NODE = name; //!!!!!!!!!!!!
						delete obj[key]._id;
						//console.log('==> please replace _id by _NODE!', id_entry.specKey, id_entry.ppath, name, obj);
						alert('SPEC ERROR! =>please replace _id:' + name + ' by _NODE:', name);
					} else {
						//console.log('_id without any reference or node!', id_entry.specKey, id_entry.ppath, name, obj);
					}
					continue;
				}

				//console.log(obj, key, name)

				//console.log('SUB LENGTH===========',sub.length,sub)

				if (sub.length == 1) {
					if (isdef(obj[key]._NODE)) { //!!!!!!!!!!!!!!!!!!
						let x = obj[key]._NODE;
						if (isList(x)) {
							//das _id ist sub[0]._NODE
							//das orig _NODE ist eine liste x=[A,B,...]
							//x.push(sub[0]._NODE);
							x.unshift(sub[0]._NODE);
							obj[key]._NODE = jsCopy(x); // sub[0]._NODE[x, sub[0]._NODE];
						} else {
							obj[key]._NODE = [x, sub[0]._NODE];
						}
						//console.log('resulting obj', obj[key])
					} else obj[key] = sub[0];
				}
				else {
					//console.log('haaaaaaaaaaaaaaaalo');
					let res = obj[key];
					//console.log('res',jsCopy(res))
					if (isdef(res._NODE)) {
						//in jedes sub muss ich 
						let x = res._NODE;
						for (let i = 0; i < sub.length; i++) sub[i]._NODE = [x, sub[i]._NODE];
						obj[key] = { sub: sub };
					} else obj[key] = { sub: sub };
				}
			}
			//hiermit is _id:name abgebaut fuer alle refs darauf!
		}

		//console.log('_________GEN:',gen);
		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		this.ROOT = this.lastSpec.ROOT;
	}
	genNODE(genKey = 'G') {
		let orig = this.lastSpec;
		let gen = jsCopy(this.lastSpec);

		for (const k in orig) {
			let n = gen[k];
			recMergeSpecNode(n, orig, gen);
		}

		//console.log('_________GEN:', gen);
		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		this.ROOT = this.lastSpec.ROOT;
	}
	initRound() { this.oUpdated = {}; this.rUpdated = {}; }
	init() {
		this.places = {};
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
			//console.log('object', oid, 'already updated this round!!!!!');
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

	//TODO: maybe this should be changed!!!!???
	//irrelevant for R: static nodes or nodes that are _ref nodes w/ matching _id!
	notThisNode(n) { return nundef(n.cond) || (isdef(n._ref) && isdef(this.places[n._ref])); } //do NOT check _ref nodes!
	addRForObject(oid) {
		if (this.rUpdated[oid]) {
			//console.log('rsg list for object', oid, 'already updated this round!!!!!!');
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
	getUidWithParent(oid,uidParent){
		let uids = this.oid2uids[oid];
		for(const uid of uids){if (R.uiNodes[uid].uidParent == uidParent) return uid; }
		return null;
	}
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
		// 	//console.log('JAAAAAAAAAAAA');
		// }
		n.act = new Activator(n, ui, this);
	}



	genMerge2(genKey = 'G') {
		let orig = this.lastSpec;
		let gen = jsCopy(this.lastSpec);

		//look for a node that has only _ref but no _id
		//look for the corresponding id nodes
		//build sp node
		//let 
		for (const id of this.idarr) {
			let name = id.idName;
			let spk = id.specKey;
			let idpath = id.ppath;
			//find place where to put the _NODE
			let [key, obj] = findAddress(spk, gen, idpath);
			let sub = [];

			//combine all refs that have this name
			for (const ref of this.refarr) {
				if (ref.idName != name) continue;

				let idnode = obj[key];
				let uid = getUID('sp');
				//console.log('key',key,'\nidnode',idnode)
				//#region other versions

				//v_orig!
				// let merged = safeMerge(id_entry.node, ref_entry.node); //HOW to merge each property?
				// sub.push({ _NODE: uid });

				//v_2
				// idnode = safeMerge(idnode,id_entry.node);
				// sub.push({ _NODE: uid });

				//v_3:
				// let merged = safeMerge(idnode, ref_entry.node); //HOW to merge each property?
				// sub.push({ _NODE: uid });
				// //console.log('------> merged alte version',jsCopy(merged))
				//hier muss genauso gemerged werden wie bei _NODE!

				//v_4:
				// let merged = merge1(idnode, ref_entry.node);
				// sub.push({ _NODE: uid });
				// //console.log('------> merged idnode zuerst',jsCopy(merged))

				//v_5 (fail_klappt_mit_panel):
				// let merged = jsCopy(ref_entry.node);
				// let resultNode = jsCopy(idnode); resultNode._NODE = uid; delete resultNode._add; sub.push(resultNode);
				// //console.log('------> merged nur ref node!',jsCopy(merged))

				//v_6:
				// let merged = merge1(ref_entry.node,idnode);
				// sub.push({ _NODE: uid });
				// //console.log('=>welcher soll als erstes stehen?','\nidnode',idnode,'\nref_entry.node',ref_entry.node,'\nmerged',merged);


				//v_7:
				//#endregion

				let merged;
				if (isdef(idnode._merge) && idnode._merge == 'blend') {
					merged = merge1(ref.node, idnode);
					sub.push({ _NODE: uid });
					//console.log('------> merged _merge=' + idnode._merge, jsCopy(merged));
				} else {
					//default merge mode: sub (sowie bei v_5 fail_klappt_mit_panel)
					merged = jsCopy(ref.node);
					let resultNode = jsCopy(idnode);
					resultNode._NODE = uid;
					delete resultNode._id;
					//console.log('================\nidnode', jsCopy(idnode), '\nrefnode', jsCopy(ref_entry.node), '\nresultnode', jsCopy(resultNode))
					//console.log('\nidnode', idnode, '\nrefnode', ref_entry.node, '\nresultnode', resultNode)
					sub.push(resultNode);
				}
				//das geht nicht!!!
				delete merged._ref; //*** */
				delete merged._id; //*** */
				gen[uid] = merged;
			}

			//console.log('==>\nobj', obj, '\nkey', key, '\n?', obj[key]._NODE)
			if (sub.length == 0) {
				//no ref exists for this id! (in ALL of spec!!!!!)
				//if name is name of spec node, replace by that name
				//otherwise error!
				if (isdef(this.lastSpec[name])) {
					obj[key]._NODE = name; //!!!!!!!!!!!!
					delete obj[key]._id;
					//console.log('==> please replace _id by _NODE!', id_entry.specKey, id_entry.ppath, name, obj);
					alert('SPEC ERROR! =>please replace _id:' + name + ' by _NODE:', name);
				} else {
					//console.log('_id without any reference or node!', id_entry.specKey, id_entry.ppath, name, obj);
				}
			} else if (sub.length == 1) {
				if (isdef(obj[key]._NODE)) { //!!!!!!!!!!!!!!!!!!
					let x = obj[key]._NODE;
					if (isList(x)) {
						//das _id ist sub[0]._NODE
						//das orig _NODE ist eine liste x=[A,B,...]
						//x.push(sub[0]._NODE);
						x.unshift(sub[0]._NODE);
						obj[key]._NODE = jsCopy(x); // sub[0]._NODE[x, sub[0]._NODE];
					} else {
						obj[key]._NODE = [x, sub[0]._NODE];
					}
					//console.log('resulting obj', obj[key])
				} else obj[key] = sub[0];
			} else {
				let res = obj[key];
				if (isdef(res._NODE)) {
					//in jedes sub muss ich 
					let x = res._NODE;
					for (let i = 0; i < sub.length; i++) sub[i]._NODE = [x, sub[i]._NODE];
					obj[key] = { sub: sub };
				} else obj[key] = { sub: sub };
			}
			//hiermit is _id:name abgebaut fuer alle refs darauf!
		}

		//console.log('_________GEN:',gen);
		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		this.ROOT = this.lastSpec.ROOT;
	}


	genMerge1(genKey = 'G') {
		let orig = this.lastSpec;
		let gen = jsCopy(this.lastSpec);

		for (const id of this.idarr) {
			let name = id.idName;
			let spk = id.specKey;
			let idpath = id.ppath;
			//find place where to put the _NODE
			let [key, obj] = findAddress(spk, gen, idpath);
			let sub = [];

			//combine all refs that have this name
			for (const ref of this.refarr) {
				if (ref.idName != name) continue;

				let idnode = obj[key];
				let uid = getUID('sp');
				//console.log('key',key,'\nidnode',idnode)
				//#region other versions

				//v_orig!
				// let merged = safeMerge(id_entry.node, ref_entry.node); //HOW to merge each property?
				// sub.push({ _NODE: uid });

				//v_2
				// idnode = safeMerge(idnode,id_entry.node);
				// sub.push({ _NODE: uid });

				//v_3:
				// let merged = safeMerge(idnode, ref_entry.node); //HOW to merge each property?
				// sub.push({ _NODE: uid });
				// //console.log('------> merged alte version',jsCopy(merged))
				//hier muss genauso gemerged werden wie bei _NODE!

				//v_4:
				// let merged = merge1(idnode, ref_entry.node);
				// sub.push({ _NODE: uid });
				// //console.log('------> merged idnode zuerst',jsCopy(merged))

				//v_5 (fail_klappt_mit_panel):
				// let merged = jsCopy(ref_entry.node);
				// let resultNode = jsCopy(idnode); resultNode._NODE = uid; delete resultNode._add; sub.push(resultNode);
				// //console.log('------> merged nur ref node!',jsCopy(merged))

				//v_6:
				// let merged = merge1(ref_entry.node,idnode);
				// sub.push({ _NODE: uid });
				// //console.log('=>welcher soll als erstes stehen?','\nidnode',idnode,'\nref_entry.node',ref_entry.node,'\nmerged',merged);


				//v_7:
				//#endregion

				let merged;
				if (isdef(idnode._merge) && idnode._merge == 'blend') {
					merged = merge1(ref.node, idnode);
					sub.push({ _NODE: uid });
					//console.log('------> merged _merge=' + idnode._merge, jsCopy(merged));
				} else {
					//default merge mode: sub (sowie bei v_5 fail_klappt_mit_panel)
					merged = jsCopy(ref.node);
					let resultNode = jsCopy(idnode);
					resultNode._NODE = uid;
					delete resultNode._id;
					//console.log('================\nidnode', jsCopy(idnode), '\nrefnode', jsCopy(ref_entry.node), '\nresultnode', jsCopy(resultNode))
					//console.log('\nidnode', idnode, '\nrefnode', ref_entry.node, '\nresultnode', resultNode)
					sub.push(resultNode);
				}
				//das geht nicht!!!
				delete merged._ref; //*** */
				delete merged._id; //*** */
				gen[uid] = merged;
			}

			//console.log('==>\nobj', obj, '\nkey', key, '\n?', obj[key]._NODE)
			if (sub.length == 0) {
				//no ref exists for this id! (in ALL of spec!!!!!)
				//if name is name of spec node, replace by that name
				//otherwise error!
				if (isdef(this.lastSpec[name])) {
					obj[key]._NODE = name; //!!!!!!!!!!!!
					delete obj[key]._id;
					//console.log('==> please replace _id by _NODE!', id_entry.specKey, id_entry.ppath, name, obj);
					alert('SPEC ERROR! =>please replace _id:' + name + ' by _NODE:', name);
				} else {
					//console.log('_id without any reference or node!', id_entry.specKey, id_entry.ppath, name, obj);
				}
			} else if (sub.length == 1) {
				if (isdef(obj[key]._NODE)) { //!!!!!!!!!!!!!!!!!!
					let x = obj[key]._NODE;
					if (isList(x)) {
						//das _id ist sub[0]._NODE
						//das orig _NODE ist eine liste x=[A,B,...]
						//x.push(sub[0]._NODE);
						x.unshift(sub[0]._NODE);
						obj[key]._NODE = jsCopy(x); // sub[0]._NODE[x, sub[0]._NODE];
					} else {
						obj[key]._NODE = [x, sub[0]._NODE];
					}
					//console.log('resulting obj', obj[key])
				} else obj[key] = sub[0];
			} else {
				let res = obj[key];
				if (isdef(res._NODE)) {
					//in jedes sub muss ich 
					let x = res._NODE;
					for (let i = 0; i < sub.length; i++) sub[i]._NODE = [x, sub[i]._NODE];
					obj[key] = { sub: sub };
				} else obj[key] = { sub: sub };
			}
			//hiermit is _id:name abgebaut fuer alle refs darauf!
		}

		//console.log('_________GEN:',gen);
		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		this.ROOT = this.lastSpec.ROOT;
	}



}

function Rgen(R, cycle) {

	if (cycle > 10) { console.log('MAX!!!!!!!!!'); return; }


	let workingSpec = jsCopy(R.lastSpec);
	//console.log('workingSpec',workingSpec)

	RgenIdRef(R); //macht nur places und refs
	RgenArrays(R); //macht nur idarr,refarr, byNames und byNodes


	let name = RsortIds(workingSpec, R); // replaced 1 name!

	let genKey = 'G';
	R.gens[genKey].push(workingSpec);
	R.lastSpec = workingSpec;
	R.ROOT = R.lastSpec.ROOT;

	//console.log('all names:',R.allIdRefNames);
	if (name && !isEmpty(R.allIdRefNames)) Rgen(R, cycle + 1);

}


function RgenIdRef(R, genKey = 'G') {
	let gen = R.lastSpec;
	if (nundef(R.orig_places) && !isEmpty(R.places)) R.orig_places = R.places;
	if (nundef(R.orig_refs) && !isEmpty(R.refs)) R.orig_refs = R.refs;
	R.places = {};
	R.refs = {};
	for (const k in gen) {
		let n = gen[k];
		R.check_ref(k, n);
	}
	for (const k in gen) {
		let n = gen[k];
		R.check_id(k, n, R);
	}
	//R.gens[genKey].push(gen);
	//R.lastSpec = gen; //besser als immer lastGen aufzurufen
	//R.ROOT = gen.ROOT;
}

function RgenArrays(R) {
	//only data for ids and refs
	R.idarr = [];
	R.refarr = [];
	for (const name in R.places) {
		let idByName = R.places[name];
		for (const spk in idByName) {
			let placelist = idByName[spk];
			for (const el of placelist) {
				R.idarr.push(el);
				//console.log('id:', el, '\nnode', el.node)
			}
		}
	}
	for (const name in R.refs) {
		let refByName = R.refs[name];
		for (const spk in refByName) {
			let refslist = refByName[spk];
			for (const el of refslist) {
				R.refarr.push(el);
				//console.log('ref:', el, '\nnode', el.node)
			}
		}
	}
	R.idByNode = {};
	R.idByName = {};
	for (const name in R.places) {
		let idByName = R.places[name];
		for (const spk in idByName) { //DIESES KOENNTE MAN STREICHEN! WENN EH NUR 1 incident!
			let list = idByName[spk];
			//console.log(list, typeof list);
			for (const el of list) {
				lookupAddToList(R.idByNode, [spk], el);
				lookupAddToList(R.idByName, [name], el);
			}
		}
	}
	R.refByNode = {};
	R.refByName = {};
	for (const name in R.refs) {
		let refByName = R.refs[name];
		for (const spk in refByName) { //DIESES KOENNTE MAN STREICHEN! WENN EH NUR 1 incident!
			let list = refByName[spk];
			//console.log(list, typeof list);
			for (const el of list) {
				lookupAddToList(R.refByNode, [spk], el);
				lookupAddToList(R.refByName, [name], el);
			}
		}
	}

	//simple waer es wenn ich jetzt durch jeden spec node gehe
	//recursively, und jedesmal merke mir place wo das id hingehoert
	//(gib einfach ein _NODE rein!)
	for (const id of R.idarr) {
		//find place where to put the _NODE
		//combine all refs into it
	}

	if (nundef(R.allIdRefNames)) R.allIdRefNames = intersection(Object.keys(R.idByName), Object.keys(R.refByName));
	//console.log('===> all existing names are:', R.allIdRefNames);

}

function RsortIds(workingSpec, R) {
	//console.log('--------------- sort')
	//console.log('R.idByName',R.)
	let hasid = {};
	let noid = {};

	//look for next name that can be replaced
	let cycles1 = 0; let max1 = 2;
	let cycles2 = 0; let max2 = 2;
	for (const name in R.idByName) {

		//cycles1 += 1; if (cycles1 > max1) { console.log('MAX1!!!!'); break; }
		//console.log('name',name)
		let reflist = R.refByName[name];
		//console.log('reflist',R.refByName)
		for (const ref of reflist) {
			//console.log(reflist)
			//cycles2 += 1; if (cycles2 > max2) { console.log('MAX2!!!!'); break; }
			let nref = ref.node;
			let akku = {};
			recFindProp(nref, '_id', 'self', akku);
			//console.log('__________________>akku', akku);
			if (isEmpty(akku)) {
				ref.hasid = false;
				if (nundef(noid[name])) noid[name] = []; 
				noid[name].push(ref);
			} else {
				ref.hasid = true;
				ref.idOccurrences = jsCopy(akku);
				if (nundef(hasid[name])) hasid[name] = []; hasid[name].push(ref);
			}
		}
	}

	//console.log('noid',noid,'hasid',hasid)
	//return noid;

	if (isEmpty(noid)) {
		//console.log('cannot replace any more names!');
		return null;
	} else {
		//pick first key
		let name = Object.keys(noid)[0];



		let newSpecUids = replaceIdName(name, R, workingSpec);
		//console.log('created new spec nodes', '\nnew:', newSpecUids, '\ngen', workingSpec)
		if (nundef(R.namesReplaced)) R.namesReplaced = [];
		R.namesReplaced.push(name);
		removeInPlace(R.allIdRefNames, name);
		return name;


		//since there has been a change (1 name replace) can start entire process again!
		//hoping to find another viable name to replace!!!


	}
	return null;
}

function replaceIdName(sssname, R, workingSpec) {
	//let orig = R.lastSpec;
	// let workingSpec = R.workingSpec; //das ist die spec die veraendert wird!!!
	let newSpecNodeUids={};
	//let new

	for (const id of R.idarr) {
		let name = id.idName;
		if (name != sssname) continue;
		let spk = id.specKey;
		let idpath = id.ppath;
		//find place where to put the _NODE
		let [key, obj] = findAddress(spk, workingSpec, idpath);
		let sub = [];

		//combine all refs that have this name
		for (const ref of R.refarr) {
			if (ref.idName != name) continue;

			let idnode = obj[key];
			let uid = getUID('sp');
			newSpecNodeUids[uid]={uid:uid,ref:ref,id:id};
			//console.log('key',key,'\nidnode',idnode)
			//#region other versions

			//v_orig!
			// let merged = safeMerge(id_entry.node, ref_entry.node); //HOW to merge each property?
			// sub.push({ _NODE: uid });

			//v_2
			// idnode = safeMerge(idnode,id_entry.node);
			// sub.push({ _NODE: uid });

			//v_3:
			// let merged = safeMerge(idnode, ref_entry.node); //HOW to merge each property?
			// sub.push({ _NODE: uid });
			// //console.log('------> merged alte version',jsCopy(merged))
			//hier muss genauso gemerged werden wie bei _NODE!

			//v_4:
			// let merged = merge1(idnode, ref_entry.node);
			// sub.push({ _NODE: uid });
			// //console.log('------> merged idnode zuerst',jsCopy(merged))

			//v_5 (fail_klappt_mit_panel):
			// let merged = jsCopy(ref_entry.node);
			// let resultNode = jsCopy(idnode); resultNode._NODE = uid; delete resultNode._add; sub.push(resultNode);
			// //console.log('------> merged nur ref node!',jsCopy(merged))

			//v_6:
			// let merged = merge1(ref_entry.node,idnode);
			// sub.push({ _NODE: uid });
			// //console.log('=>welcher soll als erstes stehen?','\nidnode',idnode,'\nref_entry.node',ref_entry.node,'\nmerged',merged);


			//v_7:
			//#endregion

			let merged;
			if (isdef(idnode._merge) && idnode._merge == 'blend') {
				merged = merge1(ref.node, idnode);
				sub.push({ _NODE: uid });
				//console.log('------> merged _merge=' + idnode._merge, jsCopy(merged));
			} else {
				//default merge mode: sub (sowie bei v_5 fail_klappt_mit_panel)
				merged = jsCopy(ref.node);
				let resultNode = jsCopy(idnode);
				resultNode._NODE = uid;
				delete resultNode._id;
				//console.log('================\nidnode', jsCopy(idnode), '\nrefnode', jsCopy(ref_entry.node), '\nresultnode', jsCopy(resultNode))
				//console.log('\nidnode', idnode, '\nrefnode', ref_entry.node, '\nresultnode', resultNode)
				sub.push(resultNode);
			}
			//das geht nicht!!!
			delete merged._ref; //*** */
			delete merged._id; //*** */
			workingSpec[uid] = merged;
			
		}

		//console.log('==>\nobj', obj, '\nkey', key, '\n?', obj[key]._NODE)
		if (sub.length == 0) {
			//no ref exists for this id! (in ALL of spec!!!!!)
			//if name is name of spec node, replace by that name
			//otherwise error!
			if (isdef(R.lastSpec[name])) {
				obj[key]._NODE = name; //!!!!!!!!!!!!
				delete obj[key]._id;
				//console.log('==> please replace _id by _NODE!', id_entry.specKey, id_entry.ppath, name, obj);
				alert('SPEC ERROR! =>please replace _id:' + name + ' by _NODE:', name);
			} else {
				//console.log('_id without any reference or node!', id_entry.specKey, id_entry.ppath, name, obj);
			}
		} else if (sub.length == 1) {
			if (isdef(obj[key]._NODE)) { //!!!!!!!!!!!!!!!!!!
				let x = obj[key]._NODE;
				if (isList(x)) {
					//das _id ist sub[0]._NODE
					//das orig _NODE ist eine liste x=[A,B,...]
					//x.push(sub[0]._NODE);
					x.unshift(sub[0]._NODE);
					obj[key]._NODE = jsCopy(x); // sub[0]._NODE[x, sub[0]._NODE];
				} else {
					obj[key]._NODE = [x, sub[0]._NODE];
				}
				//console.log('resulting obj', obj[key])
			} else obj[key] = sub[0];
		} else {
			let res = obj[key];
			if (isdef(res._NODE)) {
				//in jedes sub muss ich 
				let x = res._NODE;
				for (let i = 0; i < sub.length; i++) sub[i]._NODE = [x, sub[i]._NODE];
				obj[key] = { sub: sub };
			} else obj[key] = { sub: sub };
		}
		//hiermit is _id:name abgebaut fuer alle refs darauf!
	}

	//console.log('_________GEN:',gen);
	
	return newSpecNodeUids;



}












