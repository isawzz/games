
class RSG {
	constructor(sp, defs) {
		this.sp = sp;

		this.lastSpec = this.sp; //just points to last spec produced in last step performed
		this.ROOT = this.sp.ROOT;
		this.defs = defs;

		this.init(); //prepares _sd, places...
		this.isUiActive = false;
		Rgen(this, 0);
		this.genNODE();
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
	getUidWithParent(oid, uidParent) {
		let uids = this.oid2uids[oid];
		for (const uid of uids) { if (R.uiNodes[uid].uidParent == uidParent) return uid; }
		return null;
	}
	getUI(uid) { return lookup(this.UIS, [uid, 'ui']); }

	getSpec(spKey = null) { return spKey ? this.lastSpec[spKey] : this.lastSpec; }


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


}

//#region creation: start sequence

function ensureRtree(R) {
	if (nundef(R.tree) || isEmpty(R.tree)) {

		if (isdef(R.lastSpec.ROOT.cond)) {
			R.tree = { uid: getUID(), uidParent: null, here: 'ROOT', type: 'invisible' };
			if (R.lastSpec.ROOT.chanav) R.tree.chanav = R.lastSpec.ROOT.chanav;
			R.rNodes[R.tree.uid] = R.tree;
			R.Locations.ROOT = [R.tree.uid];
		} else {
			//console.log('---------')
			R.tree = recTree(R.lastSpec.ROOT, null, R);
			//console.log('rtree',R.lastSpec.ROOT,R.tree)
			R.rNodes[R.tree.uid] = R.tree;
		}

	} else {
		console.log('(tree present!)');
	}
}
function createStaticUi(area, R) {
	ensureUiNodes(R);
	let n = R.tree;
	//console.log('create static')
	recUi(n, R, area);
}
function addNewlyCreatedServerObjects(sdata, R) {
	//console.log('_____________ addNewly...', sdata);

	for (const oid in sdata) { R.addObject(oid, sdata[oid]); R.addRForObject(oid); }

	for (const oid in sdata) {
		let o = sdata[oid];
		if (isdef(o.loc)) { continue; }
		//console.log('sollte hier reingehen!!!!!!!!!!!!!!!!!')

		let success = einhaengen(oid, o, R);
	}
	//return;
	//so far has added all objects to tree that do NOT have loc component and have spec node
	//or are a part of an object that has spec node (eg. board member)

	sieveLocOids(R);
}
function recAdjustDirtyContainers(uid, R, verbose = false) {

	//console.log('=========================')
	//OPT::: koennte mir merken nur die die sich geaendert haben statt alle durchzugehen
	let nui = R.uiNodes[uid];

	if (isdef(nui.children)) {
		for (const ch of nui.children) recAdjustDirtyContainers(ch, R, verbose);
	}
	if (nui.adirty) {
		//if(verbose) console.log('adjusting!!!!',uid)
		adjustContainerLayout(nui, R);
	}
	//if (nundef(nui.children)) return;


}
function recAdjustDirtyContainers_dep(uid, R, verbose = false) {
	//OPT::: koennte mir merken nur die die sich geaendert haben statt alle durchzugehen
	let nui = R.uiNodes[uid];
	if (nui.adirty) {
		//if(verbose) console.log('adjusting!!!!',uid)
		adjustContainerLayout(nui, R);
	}
	if (nundef(nui.children)) return;
	for (const ch of nui.children) recAdjustDirtyContainers(ch, R, verbose);

}
//#endregion

//#region creation: add oid
function einhaengen(oid, o, R) {
	let topUids;
	let success = false;
	let successKeys = [];
	//console.log('sollte hier reingehen!!!!!!!!!!!!!!!!!',R.getR(oid))

	for (const key of R.getR(oid)) {
		let specNode = R.getSpec(key);
		//console.log('sollte hier reingehen!!!!!!!!!!!!!!!!!')

		// do *** NOT *** allow .loc placement nodes to have _ref!!!!
		if (o.loc && nundef(R.Locations[key]) && nundef(specNode._ref)) {
			//console.log('robber want to add key='+ key);
			if (nundef(R.Locations[key])) {
				//console.log('YES!!! key is free!');
				topUids = addOidByLocProperty(oid, key, R);
			} else {
				console.log('impossible to add!!! key bound to location', R.locations[key]);
			}
		} else if (isdef(R.Locations[key])) {
			//if (oid == '146') console.log('trying to add key='+key, 'by parent location!')
			//if (oid == '9') console.log('==>trying to add key='+key, 'by parent location!')
			topUids = addOidByParentKeyLocation(oid, key, R);
		} else {
			topUids = [];
			// console.log('key='+key,'cannot be added for oid='+oid,'cause no loc or available location! (this might be a board element!)')
		}
		if (isEmpty(topUids)) { continue; }
		else { successKeys.push(key); success = true; }

		for (const top of topUids) {
			let uiParent = R.uiNodes[top.uidParent];
			let rParent = R.rNodes[top.uidParent];
			if (isdef(uiParent)) {
				uiParent.adirty = true;
				uiParent.children = rParent.children.map(x => x);
			}
			//console.log('einhaengen!!!!',key)
			recUi(R.rNodes[top.uid], R, top.uidParent, oid, key);
		}
	}
	return success ? successKeys : false;
}
function addOidByLocProperty(oid, key, R) {
	let o = R.getO(oid);
	let oidParent = o.loc;

	//if (o.obj_type == 'robber') console.log('_____________ addOidByLocProperty', oid, key)

	let parents = R.oid2uids[oidParent];


	if (isEmpty(parents)) { return []; }

	//parents = transformParentsToBags(parents,R);
	//console.log(parents)

	let topUids = [];
	for (const uidParent of parents) {

		if (parentHasThisChildAlready(uidParent, oid) || !parentHasChannelForThisOid(R.rNodes[uidParent], oid)) continue;
		let n1 = instantOidKey(oid, key, uidParent, R);
		topUids.push({ uid: n1.uid, uidParent: uidParent });
	}
	//if (o.obj_type == 'robber') console.log('result', topUids);
	return topUids;
}
function addOidByParentKeyLocation(oid, key, R) {
	let parents = R.Locations[key];
	if (nundef(parents)) {
		if (oid == '146') console.log('not added!!!', oid, key)
		return;
	}
	let topUids = [];
	for (const uidParent of parents) {
		if (parentHasThisChildAlready(uidParent, oid)) continue;
		let n1 = instantOidKey(oid, key, uidParent, R);
		topUids.push({ uid: n1.uid, uidParent: uidParent });

	}
	return topUids;
}
function instantOidKey(oid, key, uidParent, R) {
	//console.log('*** instant *** oid', oid, 'key', key, 'uidParent', uidParent, '\nrtreeParent', R.rNodes[uidParent],'\nR',R);
	//if (oid=='9')console.log('*** instant *** oid', oid, 'key', key, 'uidParent', uidParent, '\nrtreeParent', R.rNodes[uidParent],'\nR',R);

	let rtreeParent = R.rNodes[uidParent];

	if (nundef(rtreeParent.children)) {
		rtreeParent.children = [];
	}

	//=================================================
	//if (oid == '9') console.log('Board: instantOidKey vor recTree_ call',oid,key,uidParent)
	//if (oid == '0') console.log('Member: instantOidKey vor recTree_ call',oid,key,uidParent)

	let n1 = recTree(R.lastSpec[key], rtreeParent, R, oid, key);

	R.rNodes[n1.uid] = n1;
	rtreeParent.children.push(n1.uid);

	//turning from 1 child to 2 children, expose panel if has bg set!
	if (rtreeParent.children.length == 2 && rtreeParent.type == 'invisible' && lookup(rtreeParent, ['params', 'bg'])) {
		//console.log('test case', testEngine.series, testEngine.index);
		//console.log('JETZT!!!')
		//genau jetzt muss ich rtreeParent zu einem panel machen!!!
		let uiParent = R.uiNodes[rtreeParent.uid];
		//console.log('rNode',rtreeParent,'\nuiNode',uiParent)
		if (isdef(uiParent)) {

			rtreeParent.type = uiParent.type = 'panel';
			decodeParams(uiParent, R, {});
			uiParent.adirty = true;
			applyCssStyles(uiParent.ui, uiParent.cssParams);
		}
	}

	//console.log('result:',n1)
	return n1;

}
//#endregion

//#region remove oid
function completelyRemoveServerObjectFromRsg(oid, R) {

	//???need to ask object whether children should be removed or relocated
	//recursively?!?

	aushaengen(oid, R); //remove from R.tree, including children
	R.deleteObject(oid); //remove R and O for oid
}
function aushaengen(oid, R) {

	//new code
	//console.log('should remove',oid,R.rNodes)

	while (true) {
		let uid = firstCondDict(R.rNodes, x => x.oid == oid);
		if (!uid) return;
		//console.log('found node to remove:',uid);
		let n = R.rNodes[uid];

		//make sure that in each round have less rNodes
		let len = Object.keys(R.rNodes).length;

		//console.log('removing',n.uid,n)
		recRemove(n, R);
		let len2 = Object.keys(R.rNodes).length;

		if (len2 < len) {
			//console.log('success! removed',len-len2,'nodes!');
		} else {
			console.log('DID NOT REMOVE ANYTHING!!!!', len, len2);
			return;
		}
	}

}
function recRemove(n, R) {
	if (isdef(n.children)) {
		//console.log('children',n.children);
		let ids = jsCopy(n.children);
		for (const ch of ids) recRemove(R.rNodes[ch], R);
	}

	delete R.rNodes[n.uid];
	R.unregisterNode(n); //hier wird ui removed, object remains in _sd!
	delete R.uiNodes[n.uid];
	let parent = R.rNodes[n.uidParent];
	removeInPlace(parent.children, n.uid);
	if (isEmpty(parent.children)) delete parent.children;
	let uiParent = R.uiNodes[n.uidParent];
	removeInPlace(uiParent.children, n.uid);
	if (isEmpty(uiParent.children)) delete uiParent.children;

}

//#endregion

//#region spec preprocessing
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
	let newSpecNodeUids = {};
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
			newSpecNodeUids[uid] = { uid: uid, ref: ref, id: id };
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

//#endregion

//#region merge spec nodes
function recMergeSpecNode(n, sp, spNew) {
	if (isList(n._NODE)) {
		//console.log('+++++++++',n)
		let lst = n._NODE;
		//console.log(lst)
		let combiName = getCombNodeName(lst);
		let nComb = {};
		for (const name of lst) {
			//console.log(name)
			nComb = mergedSpecNode(nComb, sp[name]);
		}
		spNew[combiName] = nComb;
		n._NODE = combiName;
	}
	if (isdef(n.sub)) {
		for (const n1 of n.sub) recMergeSpecNode(n1, sp, spNew);
	}

}
function mergedSpecNode(n1, n2) {
	//console.log(n1,n2)
	if (nundef(n1.cond) && nundef(n2.cond)) {
		return merge1(n1, n2);// deepmerge(merged, nSpec);
	} else {
		return deepmerge(n1, n2); //,{dataMerge: 'none'});// deepmerge(merged, nSpec);
	}
}
function getCombNodeName(namelist) {
	return namelist.join('_');
}

function mergeArr(a, b, opt) {
	var res = a.slice()
	b.forEach(function (e, i) {
		if (typeof res[i] === 'undefined') { //el[i] nur in source
			res[i] = cloneIfNecessary(e, opt)
		} else if (isDictOrList(e)) { //el[i] in beidem
			res[i] = dm1(a[i], e, opt);
		} else if (a.indexOf(e) === -1) { //el[i] nur in target
			res.push(cloneIfNecessary(e, opt));
		}
	})
	return res
}
function dm1(a, b, opt) {
	//console.log('a',a,'b',b);
	if (nundef(a)) return b;
	else if (nundef(b)) return a;
	else if (isLiteral(a)) return b;
	else if (isLiteral(b)) return a;
	else if (Array.isArray(b)) {
		return Array.isArray(a) ? mergeArr(a, b, opt) : cloneIfNecessary(b, opt);
	} else {
		return mergeObj(a, b, opt);
	}
}
function mergeObj(a, b, opt) {
	//console.log('a',a)
	var res = {}
	if (nundef(a)) return b;
	else if (nundef(b)) return a;
	else if (isLiteral(a)) return b;
	else if (isLiteral(b)) return a;
	else if (isDictOrList(a)) {
		Object.keys(a).forEach(function (key) {
			res[key] = cloneIfNecessary(a[key], opt);
		})
	};
	Object.keys(b).forEach(function (key) {
		let func = opt[key];
		if (!res[key]) {
			//console.log('hier!!!')
			res[key] = isLiteral(b[key]) ? b[key] : jsCopy(b[key]); //cloneIfNecessary(b[key], opt);
		} else if (func) {
			//console.log('have custom func:',key,func);
			res[key] = func(a[key], b[key], opt);
			//console.log('...','a',a[key],'b',b[key],res[key]);
		} else if (isLiteral(a[key])) {
			res[key] = cloneIfNecessary(b[key], opt);//override a
		} else {
			res[key] = dm1(a[key], b[key], opt);
		} //else if (!isDictOrList(b[key]) || !a[key]) {			res[key] = cloneIfNecessary(b[key], opt);		} 

	})
	return res;
}
function merge1(sp1, sp2, { dataMerge } = {}) {
	//console.log('calling dm1')
	//return merge(sp1,sp2);
	let options = {
		sub: (a, b, opt) => b.concat(a),
		data: (a, b, opt) => isLiteral(a) && isLiteral(b) ?
			nundef(dataMerge) || dataMerge == 'concat' ? a + ' ' + b
				: dataMerge == 'reverse' ? b + ' ' + a
					: b
			: dm1(a, b, opt),
		//params: (a, b, opt) => ({ bg: 'green' }),
	};
	return dm1(sp1, sp2, options);
}

//#endregion

//#region rtree generation
function recTree(n, rParent, R, oid, key) {
	//CYCLES += 1; if (CYCLES > MAX_CYCLES) return 'idiot';
	//console.log('***recTree_ input:', '\nn', n, '\nParent', rParent)
	let uid = getUID();
	//console.log('create rtree node','uid',uid,'oid',oid);
	let n1 = {};

	let chanav;
	[n, chanav] = mixinChannel(n, rParent, R);
	//console.log('uid',uid,'chanav',chanav)

	let expandProp = '_NODE'; let nodeName = n[expandProp];
	if (isString(nodeName)) {
		//console.log('________ found _NODE', nodeName, '\nn', n);
		let nSpec = R.getSpec(nodeName);
		if (nundef(n.cond) && nundef(nSpec.cond)) {
			let merged = merge1(nSpec, n, { dataMerge: 'reverse' });
			//console.log('__________ ',nodeName,'\nn',n,'\nnSpec',nSpec,'\nmerged',merged);

			delete merged._NODE;
			if (isdef(nSpec._NODE)) merged._NODE = nSpec._NODE;

			//console.log('*** calling recTree_',merged)
			return recTree(merged, rParent, R, oid, key);
		} else if (n.cond) {
			//console.log('=====n.cond MIT _NODE!!!!!!\n',n,nodeName)
			n = merge1(nSpec, n, { dataMerge: 'none' });
			delete n._NODE;
		} else {
			if (n.cond) { console.log('ja, n.cond kann sein!!!!', '\nn', n, '\nnSpec', nSpec) }
			lookupAddToList(R.Locations, [nodeName], uid);
			n1.here = nodeName;
			//console.log(n1,n)
			if (nundef(n.data) && nundef(n.type)) n1.type = 'invisible';
		}
	} else if (isList(nodeName)) {
		console.log('REINGEFALLEN!!!!!!!!!!!!!!!!!!!!!!')
	}

	n1 = mergeOverrideArrays(n, n1);
	if (isdef(n1.sub)) delete n1.sub;
	n1.uid = uid;
	n1.uidParent = rParent ? rParent.uid : null;
	if (isdef(oid)) n1.oid = oid;

	if (chanav) n1.chanav = chanav;
	//console.log('\nweitergabe', n1.chanav)

	let chProp = 'sub'; let chlist = n[chProp];
	if (isdef(chlist)) {
		n1.children = [];
		for (const chInfo of chlist) {
			let ch = recTree(chInfo, n1, R, oid, key);
			R.rNodes[ch.uid] = ch;
			n1.children.push(ch.uid);
		}
	}

	//if (oid == '9') console.log('Board: recTree_ returns',jsCopy(n1))
	//if (oid == '0') console.log('Member: recTree_ returns',jsCopy(n1))

	//console.log('am ende!')
	return n1;
}


function buildChanav(n, rParent) {
	let parentChanav = convertToList(rParent ? rParent.chanav : R.initialChannels);
	let ownChanav = convertToList(n.chanav);

	//which one has higher priority??? sagma own
	let res = ownChanav;
	parentChanav.map(x => addIf(res, x));

	return isEmpty(res) ? null : res.length == 1 ? res[0] : res;
}
function mixinChannel(n, rParent, R) {
	//determin channel: for now first available channel that is implemented
	//if none, none
	let chanav = buildChanav(n, rParent); // rParent ? rParent.chanav : R.initialChannels;
	chanavList = isList(chanav) ? chanav : isString(chanav) ? [chanav] : [];
	let chanimpl = n.channels;
	chanimpl = isDict(chanimpl) ? Object.keys(chanimpl) : isList(chanimpl) ? chanimpl : isString(chanimpl) ? [chanimpl] : [];
	//console.log('chanInitial', R.initialChannels, '\nrParent', rParent, '\nchanav', chanav, '\nchanimpl', chanimpl);

	let activeChannelKey = null; let activeChannel = null;
	for (const ch of chanimpl) {
		let k = Object.keys(ch)[0];
		let val = ch[k];
		//console.log('key', k, 'val', val);
		if (chanavList.includes(k)) { activeChannelKey = k; activeChannel = val; }
	}
	//console.log('active channel:', activeChannel);
	if (activeChannel) {
		//console.log('vor merge:', jsCopy(n));
		n = deepmerge(n, activeChannel);
		//console.log('nach merge:', jsCopy(n));
	}

	return [n, chanav];
}



//#endregion

//#region uitree generation
function recUi(n, R, area, oid, key) {

	//console.log('recUI!!!!!!!!!!!!!!!!!!!!!!!')
	let n1 = R.uiNodes[n.uid] = jsCopy(n);// ONLY DONE HERE!!!!!!!
	let o = isdef(oid) ? R.getO(oid) : null;
	if (isdef(n1.data)) { n1.content = calcContentFromData(oid, o, n1.data, R, n1.default_data); }

	//if (isdef(oid)) console.log('content',oid,n1.content)

	//R.uiNodes[n1.uid] = n1; 
	if (n1.type == 'grid') {
		createBoard(n1, R, area);
		//return n1;
	} else {
		let lst = getElements(n1.content);
		if (isdef(lst) && !isEmpty(lst)) {
			let o = R.getO(lst[0]);
			if (isListOfLiterals(lst) && isdef(o)) { handleListOfObjectIds(lst, n1, area, R); }
			else if (isListOfLists(lst) && isdef(o[0])) {
				for (const l of lst) { handleListOfObjectIds(l, n1, area, R); }
			}
			else {
				if (nundef(n1.type)) n1.type = 'info';
				n1.content = lst.join(' ');
				n1.ui = createUi(n1, R, area);
			}
			let rTreePanel = R.rNodes[n1.uid];
			n1.children = rTreePanel.children;

		} else {
			n1.ui = createUi(n1, R, area);
		}
	}

	if (nundef(n1.children) || n1.type == 'grid') return n1;

	//hier werden weitere children mit derselben oid created:
	n1.adirty = true;
	for (const ch of n1.children) {
		if (isdef(R.uiNodes[ch])) { continue; }
		recUi(R.rNodes[ch], R, n1.uid, oid, key);
	}
	return n1;
}

function isListOfServerObjects(x) {
	let oids = getElements(x);
	console.log('getElements returns', oids);
	return false;
}
function createPanelParentOfObjects(lst, n1, area, R) {
	if (nundef(n1.type)) n1.type = lst.length == 1 ? 'invisible' : 'panel';
	n1.content = null;
	n1.ui = createUi(n1, R, area);
}
function handleListOfObjectIds(lst, n1, area, R) {
	//console.log('HIER!!!');
	createPanelParentOfObjects(lst, n1, area, R);
	let keysForOids = findOrCreateKeysForObjTypes(lst, R);
	for (const oid1 of lst) {
		let o1 = R.getO(oid1);
		let key = keysForOids[oid1]; // createArtificialSpecForBoardMemberIfNeeded(oid1, o1, R);
		//console.log('found key for', oid1, '=', key);
		let ntree, nui;
		ntree = instantOidKey(oid1, key, n1.uid, R); //hier wird rtree von recUi aus erweitert!!!
		nui = recUi(ntree, R, n1.uid, oid1, key);
	}
}
function handleListOfConstants(lst, n1, area, R) {
	//let keysForOids = findOrCreateKeysForObjTypes(lst, R);
	for (const oid1 of lst) {
		let o1 = R.getO(oid1);
		let key = keysForOids[oid1]; // createArtificialSpecForBoardMemberIfNeeded(oid1, o1, R);
		//console.log('found key for', oid1, '=', key);
		let ntree, nui;
		ntree = instantOidKey(oid1, key, n1.uid, R);
		nui = recUi(ntree, n1.uid, R, oid1, key);
	}
}


//#endregion

//#region sieve oids with loc (einhaengen_ von server objects mit loc prop)
var TESTVAR = 0;

function calcCycles(R) {
	let oids = jsCopy(R.locOids);
	let cycles = R.partitions = {};
	let oid2partition = R.oid2partition = {};
	let cid;

	while (!isEmpty(oids)) {
		let oid = oids[0];
		cid = getUID();
		let c = cycles[cid] = { isCycle: false, oids: [] };
		while (true) {
			if (c.oids.includes(oid)) {
				c.isCycle = true;
				//console.log('found cycle!', c, oid);  
				break;
			}
			//console.log('add',oid)
			if (isdef(oid2partition[oid])) {
				//console.log(oid,cy, oid2partition)
				let cid2 = oid2partition[oid];
				let c2 = cycles[cid2];
				//cy2 and cy need to be joined!
				c.oids.map(x => oid2partition[x] = cid2);
				c2.oids = c.oids.concat(c2.oids);
				c = c2;
				delete cycles[cid];
				break;
			} else {
				c.oids.push(oid);
				oid2partition[oid] = cid;
			}
			//console.log(oids,oid); //da war irgendein BUG!!!!! TODO! jetzt is er weg!
			removeInPlace(oids, oid);
			let o = R.getO(oid);
			if (nundef(o.loc)) break;
			oid = o.loc;
		}
	}

	//sort cycles
	//if !isCycle need to reverse and remove first elem
	//otherwise, just reverse
	for (const k in R.partitions) {
		let c = R.partitions[k];
		//console.log('orig',jsCopy(c));
		c.oids.reverse();
		let removed;
		if (!c.isCycle) { removed = c.oids.shift(); }
		//console.log('wird:',c);
		//safety check! all cycle elements must have loc, removed one does NOT have loc!
		for (const oid of c.oids) {
			if (nundef(R.getO(oid)).loc) {
				alert('SORT CYCLES SAFETY CHECK FAILED! no loc in ' + oid);
			}
		}
		if (isdef(removed && isdef(R.getO(removed)).loc)) {
			alert('SORT CYCLES SAFETY CHECK FAILED! removed has loc' + removed);
		}

	}

}
function processLocOids(cycle, max_cycles, isCyclic, R) {
	if (isEmpty(cycle)) return;
	let cycles = 0;
	let locOids = cycle;
	if (isCyclic) {
		//console.log('serverdata CYCLIC!!!!!!!!!!!!!!!!!!', cycle)

		let i = 0; let top = null;
		while (isEmpty(top)) {
			let oid = cycle[i];
			top = einhaengen(oid, R.getO(oid), R);
			if (!isEmpty(top)) break;
			i += 1; if (i > cycle.length - 1) break;
		}
		//console.log('i is', i, '\ntop', top);
		if (i > cycle.length - 1) {
			//console.log('none of the locOids in', cycle, 'has a rep!');
			return;
		}
		// locOids = jsCopy(cycle);
		locOids = arrRotate(cycle, i);
		//console.log('cycle orig:', cycle, 'shifted:', locOids);
	}

	//hier koennte nochmal max_cycles definieren, entweder nach starting oid 
	//oder nach node (in welchem fall ich aber einhaengen_ umdrehen muss!)

	//console.log('locOids', locOids)
	while (true) {
		cycles += 1;
		if (cycles > max_cycles) {
			//console.log('MAX_CYCLES reached!', cycles); 
			return;
		}

		let changed = false;
		for (const oid of locOids) {
			let top = einhaengen(oid, R.getO(oid), R);
			if (!isEmpty(top)) {
				//console.log('oid', oid, '\ntop', top, '\noid2uids', R.oid2uids[oid]);
				changed = true;
			}
		}
		//TESTVAR+=1;console.log('*********sieving:',TESTVAR);
		if (!changed) { break; }
	}
	//console.log('done after', cycles, 'cycles')
}
function sieveLocOids(R) {
	if (isEmpty(R.locOids)) return;

	calcCycles(R); //for all locOids that have not been added, calc cycles in order in which they can be added

	//console.log('sieveLocOids',R.partitions)
	//*** have R.partitions, R.oid2partition, R.locOids
	for (const k in R.partitions) {
		let cycle = R.partitions[k];
		let max_cycles = cycle.isCycle ? DEFS.cycleLengthAllowed : 1;
		processLocOids(cycle.oids, max_cycles, cycle.isCycle, R);
	}
}
//#endregion

//#region helpers
function ensureUiNodes(R) { if (nundef(R.uiNodes)) R.uiNodes = {}; }

function evalSpecPath(n, relpath, R) {
	//return partial spec node under n, following relpath
	//console.log('__________ evalSpecPath: path', relpath, 'n', n);
	if (isEmpty(relpath)) return null;
	if (relpath == '.') return n;
	let iNext = firstNumber(relpath);

	nNext = n.sub[iNext];
	let newPath = stringAfter(relpath, '.' + iNext);
	if (isEmpty(newPath)) return nNext;
	else return evalSpecPath(nNext, newPath, R);
}
function parentHasChannelForThisOid(n, oid) {
	let channels = n.channels;
	if (nundef(channels)) return true; //per default ALL channels are valid!

}
function parentHasThisChildAlready(uidParent, oid) {
	//console.log('parentHasThisChildAlready','uidParent',uidParent,'oid',oid);
	let n = R.rNodes[uidParent];
	if (nundef(n.children)) return false; //FOUND!
	let hasThisChild = false;
	for (const chuid of n.children) {
		//console.log('chuid',chuid,'uidParent',uidParent,'oid',oid);
		if (R.rNodes[chuid].oid == oid) { hasThisChild = true; break; }
	}
	return hasThisChild;

}
function safeMerge(a, b) {
	if (nundef(a) && nundef(b)) return {};
	else if (nundef(a)) return jsCopy(b);
	else if (nundef(b)) return jsCopy(a);
	else return mergeOverrideArrays(a, b);
}
//#endregion




