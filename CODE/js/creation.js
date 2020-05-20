//#region start sequence
function ensureRtree(R) {
	if (nundef(R.tree) || isEmpty(R.tree)) {

		if (isdef(R.lastSpec.ROOT.cond)) {
			R.tree = { uid: getUID(), uidParent: null, here: 'ROOT', type: 'invisible' };
			R.rNodes[R.tree.uid] = R.tree;
			R.Locations.ROOT = [R.tree.uid];
		} else {
			//R.tree = recBuildRTree(R.lastSpec.ROOT, 'ROOT', '.', null, R.lastSpec, R);
			R.tree = recTree(R.lastSpec.ROOT, null, R);
			R.rNodes[R.tree.uid] = R.tree;
		}

	} else {
		console.log('(tree present!)');
	}
}
function createStaticUi(area, R) {
	ensureUiNodes(R);
	let n = R.tree;
	//let defParams = jsCopy(R.defs);
	//defParams = deepmergeOverride(R.defs, { _id: { params: { bg: 'green' } } });// { bg: 'blue', fg: 'white' };
	//recBuildUiFromNode(n, area, R, defParams, null);
	recUi(n, area, R);
}
function addNewlyCreatedServerObjects(sdata, R) {
	//console.log('_____________ addNewly...', sdata);
	let locOids = [];
	for (const oid in sdata) {
		let o = sdata[oid];
		if (isdef(o.loc)) { locOids.push(oid); continue; }
		addNewServerObjectToRsg(oid, o, R);
	}
	while (true) { //find next loc oid with existing parent!
		let oid = find_next_loc_oid_with_existing_parent(locOids, sdata, R);
		if (!oid) {
			//console.log('cannot add any other object!', locOids);
			break;
		}
		let o = sdata[oid];
		addNewServerObjectToRsg(oid, o, R);
		removeInPlace(locOids, oid); //remove it from locOids
		if (isEmpty(locOids)) break;
	}
}
function recAdjustDirtyContainers(uid, R, verbose = false) {
	//OPT::: koennte mir merken nur die die sich geaendert haben statt alle durchzugehen
	let nui = R.uiNodes[uid];
	if (nui.adirty) {
		//if(verbose) console.log('adjusting!!!!',uid)
		adjustContainerLayout(nui, R);
	}
	if (nundef(nui.children)) return;
	for (const ch of nui.children) recAdjustDirtyContainers(ch, R, verbose);

}

//#region add oid
function addNewServerObjectToRsg(oid, o, R, skipEinhaengen = false) {
	//console.log('_____________ add object', oid, o);
	R.addObject(oid, o);
	R.addRForObject(oid); 

	if (skipEinhaengen) { return; }
	else if (EINHAENGEN_NEW) { einhaengen(oid, o, R); }
	else { einhaengen0(oid, o, R); }
}
function einhaengen(oid, o, R) {
	//console.log('_____________ einhaengen', oid, R.oidNodes[oid]);
	let nodes = R.getR(oid);// ELIM
	// let nodes = R.oidNodes[oid];// ELIM
	// if (!oidNodesSame(oid,R)) { console.log('NOT EQUAL!!!!!!!!!!', getOidNodeKeys(oid,R), R.getR(oid)); }

	if (isEmpty(nodes)) return;

	for (const key of nodes){ //} in nodes) {
		let topUids;
		//console.log(o)
		if (o.loc) topUids = addOidByLocProperty(oid, key, R);
		else topUids = addOidByParentKeyLocation(oid, key, R);
		if (nundef(topUids)) { continue; } 
		//else console.log(topUids)
		for (const top of topUids) {
			let uiParent = R.uiNodes[top.uidParent];
			let rParent = R.rNodes[top.uidParent];
			if (isdef(uiParent)) {
				uiParent.adirty = true;
				uiParent.children = rParent.children.map(x => x);
			}
			recUi(R.rNodes[top.uid], top.uidParent, R, oid, key);
		}
	}
}
function addOidByLocProperty(oid, key, R) {
	let o = R.getO(oid);
	let ID = o.loc; //ID is oid ob obj AUF DEM o dargestellt werden soll!

	//gibt es spec key fuer ID?
	// let IDNode = R.oidNodes[ID];// ELIM
	// if (!oidNodesSame(oid,R)) { console.log('NOT EQUAL!!!!!!!!!!', getOidNodeKeys(oid,R), R.getR(oid)); }
	// let IDkeys = Object.keys(IDNode);
	let IDkeys = R.getR(oid);

	let topUids = [];
	for (const k of IDkeys) {
		//now find parents that have same key and same oid
		let parents = lookup(R.rNodesOidKey, [ID, k]);
		//console.log('parents for robber', parents);

		if (!parents || isEmpty(parents)) {
			console.log('LOC PARENT MISSING!!!! trying to add', oid, 'with loc', o.loc);
			continue;
		}
		for (const uidParent of parents) {
			//console.log('oid', oid, 'key', key, 'uidParent', uidParent)

			//instantiateOidKeyAtParent(oid, key, uidParent, R);

			let n1 = instantOidKey(oid, key, uidParent, R);
			topUids.push({ uid: n1.uid, uidParent: uidParent });
		}
	}
	return topUids;
}
function addOidByParentKeyLocation(oid, key, R) {
	//console.log('_____________ addOidByParentKeyLocation', oid, key);
	// let nodes = R.oidNodes[oid];// ELIM
	// if (!oidNodesSame(oid,R)) { console.log('NOT EQUAL!!!!!!!!!!', getOidNodeKeys(oid,R), R.getR(oid)); }
	// if (isEmpty(nodes)) return;

	let parents = R.Locations[key]; //for now just 1 allowed!!!!!!!!!!
	//console.log('found parents:',parents)
	if (nundef(parents)) return;
	let topUids = [];
	for (const uidParent of parents) {
		// instantiateOidKeyAtParent(oid, key, uidParent, R); 

		let n1 = instantOidKey(oid, key, uidParent, R);
		topUids.push({ uid: n1.uid, uidParent: uidParent });

	}
	return topUids;
}
function instantOidKey(oid, key, uidParent, R) {
	//console.log('*** instant *** oid', oid, 'key', key, 'uidParent', uidParent, '\nrtreeParent', R.rNodes[uidParent],'\nR',R);

	let rtreeParent = R.rNodes[uidParent];

	if (nundef(rtreeParent.children)) { rtreeParent.children = []; }

	//=================================================
	//if (oid == '9') console.log('Board: instantOidKey vor recTree call',oid,key,uidParent)
	//if (oid == '0') console.log('Member: instantOidKey vor recTree call',oid,key,uidParent)

	let n1 = recTree(R.lastSpec[key], rtreeParent, R, oid, key);

	R.rNodes[n1.uid] = n1;
	lookupAddToList(R.rNodesOidKey, [oid, key], n1.uid); //not sure if need this!!!
	rtreeParent.children.push(n1.uid);

	//console.log('result:',n1)
	return n1;

}


//#region remove oid
function completelyRemoveServerObjectFromRsg(oid, R) {

	//???need to ask object whether children should be removed or relocated
	//recursively?!?

	aushaengen(oid, R); //remove from R.tree, including children
	R.deleteObject(oid); //remove R and O for oid
}
function aushaengen(oid, R) {
	//remove all nodes representing oid from R.tree
	//passiert wenn eine server object removed wird

	//an welchen locations gibt es dieses oid object als child?
	let nodes = R.getR(oid);
	//let nodes = R.oidNodes[oid]; //ELIM use R.getR(oid) instead!!!
	//if (!oidNodesSame(oid,R)) { console.log('NOT EQUAL!!!!!!!!!!', getOidNodeKeys(oid,R), R.getR(oid)); }

	if (isEmpty(nodes)) return;
	for (const key of nodes) { //in nodes) {
		//hier kann: removeOidKey aufrufen, das das folgende macht
		removeOidKey(oid, key, R);
	}
}
function removeOidKey(oid, key, R) {
	let nodeInstances = lookup(R.rNodesOidKey, [oid, key]);
	if (!nodeInstances) {
		console.log('nothing to remove!', oid, key);
		return;
	}
	for (const uid of nodeInstances) {
		let n1 = R.rNodes[uid]; //jetzt habe tree nodes von parent in dem oid haengt!
		recRemove(n1, R);
	}
}
function recRemove(n, R) {
	if (isdef(n.children)) {
		//console.log('children',n.children);
		let ids = jsCopy(n.children);
		for (const ch of ids) recRemove(R.rNodes[ch], R);
	}

	if (isdef(n.oid) && isdef(n.key)) {
		let oid = n.oid;
		let key = n.key;
		if (!oidNodesSame(oid, R)) { console.log('NOT EQUAL!!!!!!!!!!', getOidNodeKeys(oid, R), R.getR(oid)); }
		delete R.rNodesOidKey[oid][key];
		if (isEmpty(R.rNodesOidKey[oid])) delete (R.rNodesOidKey[oid]);
		//delete R.oidNodes[oid][key]; // ELIM
		R.removeR(oid, key);
		//if (isEmpty(R.oidNodes[oid])) delete (R.oidNodes[oid]); // ELIM
	}

	delete R.rNodes[n.uid];
	R.unregisterNode(n); //hier wird ui removed, object remains in _sd!
	delete R.uiNodes[n.uid];
	let parent = R.rNodes[n.uidParent];
	removeInPlace(parent.children, n.uid);
	if (isEmpty(parent.children)) delete parent.children;

}























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
function find_next_loc_oid_with_existing_parent(locOids, sdata, R) {
	for (const oid of locOids) {
		let o = sdata[oid];
		let loc = o.loc;
		let parentID = loc;
		if (!isEmpty(R.rNodesOidKey[parentID])) return oid;
	}
	return null;
}
function isStatic(x) { let t = lookup(x, ['meta', 'type']); return t == 'static'; }
function isDynamic(x) { let t = lookup(x, ['meta', 'type']); return t == 'dynamic'; }
function isMap(x) { let t = lookup(x, ['meta', 'type']); return t == 'map'; }

function safeMerge(a, b) {
	if (nundef(a) && nundef(b)) return {};
	else if (nundef(a)) return jsCopy(b);
	else if (nundef(b)) return jsCopy(a);
	else return deepmergeOverride(a, b);
}


