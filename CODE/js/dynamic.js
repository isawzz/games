//#region add oid
function addNewServerObjectToRsg(oid, o, R, skipEinhaengen = false) {
	//console.log('_____________ add object', oid, o);
	R.addObject(oid, o);
	addRForObject(oid, R);

	if (skipEinhaengen) { return; } else { einhaengen(oid, o, R); }
}
function addRForObject(oid, R) {
	let o = R.getO(oid);
	let sp = R.getSpec();

	//eval conds (without no_spec!)
	for (const k in sp) {
		let n = sp[k];
		if (nundef(n.cond)) continue;
		if (n.cond == 'all' || evalConds(o, n.cond)) { R.addR(oid, k); }
	}
	//check for no_spec clauses
	if (isEmpty(R.getR(oid))) {

		for (const k in sp) {
			let n = sp[k];
			if (nundef(n.cond)) continue;
			let keys = Object.keys(n.cond);
			if (!keys.includes('no_spec')) continue;
			let condCopy = jsCopy(n.cond);
			delete condCopy['no_spec'];
			if (evalConds(o, condCopy)) { R.addR(oid, k); }
		}
	}

	//if (nundef(R.oidNodes)) R.oidNodes = {};

	createPrototypesForOid(oid, o, R);

}
function createPrototypesForOid(oid, o, R) {
	//console.log('createPrototypesForOid',oid,o.obj_type)
	if (isdef(R.oidNodes[oid])) {
		//console.log('prototypes for', oid, 'already created!');
		return;
	}
	let klist = R.getR(oid);
	//console.log('klist',klist)
	let nlist = {};
	for (const k of klist) {
		let n1 = createProtoForOidAndKey(oid, o, k, R);
		nlist[k] = n1;
	}
	R.oidNodes[oid] = nlist;
}
function createProtoForOidAndKey(oid, o, k, R) {
	let n = R.getSpec(k);
	let n1 = { key: k, oid: oid, uid: getUID() };
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
	//remove all nodes representing oid from R.tree
	//passiert wenn eine server object removed wird

	//an welchen locations gibt es dieses oid object als child?
	let nodes = R.oidNodes[oid];
	if (isEmpty(nodes)) return;
	for (const key in nodes) {
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
		delete R.rNodesOidKey[oid][key];
		if (isEmpty(R.rNodesOidKey[oid])) delete (R.rNodesOidKey[oid]);
		delete R.oidNodes[oid][key];
		R.removeR(oid, key);
		if (isEmpty(R.oidNodes[oid])) delete (R.oidNodes[oid]);
	}

	delete R.rNodes[n.uid];
	R.unregisterNode(n); //hier wird ui removed, object remains in _sd!
	delete R.uiNodes[n.uid];
	let parent = R.rNodes[n.uidParent];
	removeInPlace(parent.children, n.uid);
	if (isEmpty(parent.children)) delete parent.children;

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
function find_next_loc_oid_with_existing_parent(locOids, sdata, R) {
	for (const oid of locOids) {
		let o = sdata[oid];
		let loc = o.loc;
		let parentID = loc;
		if (!isEmpty(R.rNodesOidKey[parentID])) return oid;
	}
	return null;
}

//#endregion


