function instantiateOidKeyAtParent(oid, key, uidParent, R) {
	//console.log('>>>>>instantiate',oid,'using',key,'at',uidParent);
	let rtreeParent = R.NodesByUid[uidParent];
	//console.log(rtreeParent)
	if (nundef(rtreeParent.children)) {
		change_parent_type_if_needed(rtreeParent, R);
		rtreeParent.children = [];
	}
	let index = rtreeParent.children.length;
	let newPath = isdef(rtreeParent.panels) ? extendPath(rtreeParent.path, index) : '.';// index == 0 ? '.' : extendPath(n.path, index);
	let n1 = { uid: getUID(), uidParent: uidParent, oid: oid, path: newPath, key: key };

	R.NodesByUid[n1.uid] = n1;
	lookupAddToList(R.treeNodesByOidAndKey, [oid, key], n1.uid);
	rtreeParent.children.push(n1.uid);

	if (isdef(R.uiNodes) && isdef(R.uiNodes[uidParent])) {
		let parent = R.uiNodes[uidParent];
		parent.adirty = true;
		recBuildUiFromNode(n1, uidParent, R, parent.defParams, oid);
		parent.children = rtreeParent.children;
	} else {
		console.log('UI not creatable! No suitable parent found! uidParent', uidParent, 'oid', oid, 'key', key, R.uiNodes);
	}
}

//#region add oid
function addNewServerObjectToRsg(oid, o, R, skipEinhaengen = false) {

	//console.log('_____________ add object', oid, o);
	R.addObject(oid, o);

	addRForObject(oid, R);

	if (nundef(R.oidNodes)) R.oidNodes = {};

	createPrototypesForOid(oid, o, R);

	if (skipEinhaengen) { return; } else { einhaengen(oid, o, R); }
}
function addRForObject(oid, R) {
	let o = R.getO(oid);
	let sp = R.getSpec();

	for (const k in sp) {
		let n = sp[k];
		if (nundef(n.cond)) continue;
		if (n.cond == 'all' || evalConds(o, n.cond)) { R.addR(oid, k); }
	}
	if (isEmpty(R.getR(oid))) {
		//check for no_spec clauses
		for (const k in sp) {
			let n = sp[k];
			if (nundef(n.cond)) continue;
			let keys = Object.keys(n.cond);
			if (!keys.includes('no_spec')) continue;
			if (o.obj_type == 'card') console.log('adding R')
			let condCopy = jsCopy(n.cond);
			delete condCopy['no_spec'];
			if (evalConds(o, condCopy)) { R.addR(oid, k); }
		}
	}

}
function createPrototypesForOid(oid, o, R) {
	if (isdef(R.oidNodes[oid])) {
		console.log('prototypes for', oid, 'already created!');
		return;
	}
	let klist = R.getR(oid);
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

function einhaengen(oid, o, R) {
	let nodes = R.oidNodes[oid];
	if (isEmpty(nodes)) return;
	for (const key in nodes) {
		if (o.loc) addOidByLocProperty(oid, key, R);
		else addOidByParentKeyLocation(oid, key, R);
	}
}
function addOidByLocProperty(oid, key, R) {
	let o = R.getO(oid);
	let ID = o.loc; //ID is oid ob obj AUF DEM o dargestellt werden soll!

	//gibt es spec key fuer ID?
	let IDNode = R.oidNodes[ID];
	let IDkeys = Object.keys(IDNode);
	for (const k of IDkeys) {
		//now find parents that have same key and same oid
		let parents = lookup(R.treeNodesByOidAndKey, [ID, k]);
		//console.log('parents for robber', parents);

		if (!parents || isEmpty(parents)) {
			console.log('LOC PARENT MISSING!!!! trying to add', oid, 'with loc', o.loc);
			continue;
		}
		for (const uidParent of parents) {
			//console.log('oid', oid, 'key', key, 'uidParent', uidParent)
			instantiateOidKeyAtParent(oid, key, uidParent, R);
		}
	}
}
function addOidByParentKeyLocation(oid, key, R) {
	let nodes = R.oidNodes[oid];
	if (isEmpty(nodes)) return;
	let parents = R.LocToUid[key];
	if (nundef(parents)) return;
	for (const uidParent of parents) { instantiateOidKeyAtParent(oid, key, uidParent, R); }
}
function change_parent_type_if_needed(n, R) {

	let uiNode = R.uiNodes[n.uid];

	if (!isContainerType(uiNode.type)) {
		uiNode.type = 'panel'; //TRANSPARENT FOR 'g', 'd', 'h' type!!!
		uiNode.changing = true;
		let uidParent = n.uidParent;
		let area = uidParent ? uidParent : R.baseArea;
		let uiNew = createUi(uiNode, area, R, uiNode.defParams);
	}
}

//#endregion

//#region remove oid
function completelyRemoveServerObjectFromRsg(oid, R) {

	aushaengen(oid, R); //remove from R.tree

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
	let nodeInstances = lookup(R.treeNodesByOidAndKey, [oid, key]);
	if (!nodeInstances) {
		console.log('nothing to remove!', oid, key);
		return;
	}
	for (const uid of nodeInstances) {
		let n1 = R.NodesByUid[uid]; //jetzt habe tree nodes von parent in dem oid haengt!
		recRemove(n1, R);
	}
}
function recRemove(n, R) {
	if (isdef(n.children)) {
		for (const ch of n.children) recRemove(R.NodesByUid[ch], R);
	}

	if (isdef(n.oid) && isdef(n.key)) {
		let oid = n.oid;
		let key = n.key;
		delete R.treeNodesByOidAndKey[oid][key];
		if (isEmpty(R.treeNodesByOidAndKey[oid])) delete (R.treeNodesByOidAndKey[oid]);
		delete R.oidNodes[oid][key];
		if (isEmpty(R.oidNodes[oid])) delete (R.oidNodes[oid]);
	}

	delete R.NodesByUid[n.uid];
	R.unregisterNode(n); //hier wird ui removed
	delete R.uiNodes[n.uid];
	let parent = R.NodesByUid[n.uidParent];
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

	nNext = n.panels[iNext];
	let newPath = stringAfter(relpath, '.' + iNext);
	if (isEmpty(newPath)) return nNext;
	else return evalSpecPath(nNext, newPath, R);
}

//#endregion


