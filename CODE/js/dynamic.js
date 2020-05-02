//#region add oid
function addNewServerObjectToRsg(oid, o, R) {

	//console.log('_____________ add object', oid, o);

	R.addObject(oid, o);
	addRForObject(oid, R);

	ensureRtree(R); //make sure static tree has been built! 

	//???brauch ich diese 2?
	//console.log('places', R.places);
	//console.log('refs', R.refs);
	//??? *** simplification: rsg[oid] only 1 element!
	//??? *** simplification: only use types info and panel, dyn nodes (cond) only leaves(info) ***
	createPrototypesForOid(oid, o, R); //=>oidNodes eval cond for all dynamic nodes for oid 

	//console.log('==>NodesByUid',R.NodesByUid)

	einhaengen(oid, o, R);



}
function addRForObject(oid, R) {
	let o = R.getO(oid);
	let sp = R.getSpec();
	for (const k in sp) {
		let n = sp[k];
		//console.log('node', n)
		if (nundef(n.cond)) continue;
		if (n.cond == 'all' || evalConds(o, n.cond)) {
			//console.log('...valid for', oid)
			R.addR(oid, k);
			//console.log('...keys for',oid,R.getR(oid));
		}
	}
}
function createPrototypesForOid(oid, o, R) {
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
	//console.log('build', k, n, 'for', oid, o);
	let n1 = { key: k, oid: oid, uid: getUID() };
	return n1;
}
function ensureRtree(R) {
	//console.log('-----------',R.tree,isEmpty(R.tree))
	if (nundef(R.tree) || isEmpty(R.tree)) {
		//console.log('____________ creating new tree!!!!!!!!!!!!!!!!!')
		R.LocToUid = {};
		R.NodesByUid = {};
		R.treeNodesByOidAndKey = {};
		R.tree = recBuild(R.lastSpec.ROOT, '.', null, R.lastSpec, R);
		R.tree.key = 'ROOT';
		R.NodesByUid[R.tree.uid] = R.tree;

	} else {
		//console.log('(tree present!)');

	}
	//console.log('==> R.tree:',R.tree)
}
function recBuild(n, path, parent, sp, R) {
	//console.log('***',n,path,parent,sp)
	//WORKING WITH NORMALIZED SPEC!!!! (only panels and panel)
	let n1 = { uid: getUID(), uidParent: parent ? parent.uid : null, path: path };

	//console.log('n',n)
	let locProp = 'panel';//isdef(n._id) ? '_id' : isString(n.type) && isdef(sp[n.type]) ? 'type' : 'panel';
	let nodeName = n[locProp];
	if (isString(nodeName)) {
		//console.log('location:', nodeName, n1);
		//lookupAddToList(R.LOCATIONS, [nodeName], n1.path);
		lookupAddToList(R.LocToUid, [nodeName], n1.uid);
		n1.here = nodeName;
	}

	let chProp = 'panels';// isContainerType(n.type) ? RCONTAINERPROP[n.type] : 'panels';
	let chlist = n[chProp];
	if (isdef(chlist)) {
		n1.children = [];
		let i = 0;
		for (const chInfo of chlist) {
			//console.log('info',info);
			let newPath = extendPath(path, i);
			i += 1;
			let ch = recBuild(chInfo, newPath, n1, sp, R);
			R.NodesByUid[ch.uid] = ch;
			n1.children.push(ch.uid);
		}
	}
	return n1;

}

function einhaengen(oid, o, R) {

	let t = R.tree;

	//LocToUid: nodeName => uid, eg. A: _3, _5
	//NodesByUid: uid => node, eg. _3: {uid,uidParent,path,children,here} =>R.tree
	//oidNodes: oid,loc => {uid,key,oid} =>need to pull o from sData, key from spec & combine
	let nodes = R.oidNodes[oid];
	if (isEmpty(nodes)) return;
	//return;
	//console.log('_______einhaengen', oid, nodes);
	for (const key in nodes) {

		if (o.loc) addOidByLocProperty(oid, key, R);
		else addOidByParentKeyLocation(oid, key, R);


	}

}
function addOidByLocProperty(oid, key, R) {
	//console.log(oid, key);
	let o = R.getO(oid);
	let ID = o.loc; //ID is oid ob obj AUF DEM o dargestellt werden soll!

	//gibt es spec key fuer ID?
	let IDNode = R.oidNodes[ID];

	let IDkeys = Object.keys(IDNode);
	//console.log(ID, IDkeys);
	for (const k of IDkeys) {
		//console.log(k,IDkeys,R.treeNodesByOidAndKey)
		//now find parents that have same key and same oid
		//here oidNodeUid would come in handy! need tree nodes by oid and key here!
		let parents = lookup(R.treeNodesByOidAndKey, [ID, k]);
		console.log('reps for ID', ID, k, parents, IDkeys, oid, o);
		console.log('IDNode',IDNode);

		for (const uidParent of parents) {
			instantiateOidKeyAtParent(oid, key, uidParent, R);
		}
	}
}
function addOidByParentKeyLocation(oid, loc, R) {
	let nodes = R.oidNodes[oid];
	if (isEmpty(nodes)) return;

	let parents = R.LocToUid[loc];
	if (nundef(parents)) return;
	//console.log(parents);
	for (const uidParent of parents) {
		instantiateOidKeyAtParent(oid, loc, uidParent, R);

	}
}

//#endregion

function instantiateOidKeyAtParent(oid, key, uidParent, R) {

	console.assert(isdef(R.oidNodes[oid][key]), 'oidNode MISSING', oid, key)

	let n = R.NodesByUid[uidParent];
	if (nundef(n.children)) n.children = [];
	let index = n.children.length;
	let newPath = extendPath(n.path, index);
	let n1 = { uid: getUID(), uidParent: uidParent, oid: oid, path: newPath, key: key };
	R.NodesByUid[n1.uid] = n1;
	lookupAddToList(R.treeNodesByOidAndKey, [oid, key], n1.uid);
	n.children.push(n1.uid);
}

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
	//return;
	console.log('_______REMOVE!', oid, nodes);
	for (const loc in nodes) {
		//hier kann: removeOidFromLoc aufrufen, das das folgende macht
		removeOidFromLoc(oid, loc, R);
	}
}
function removeOidFromLoc(oid, key, R) {
	//let oidNode = R.oidNodes[oid][loc]; //this is just the spec!!!! DO NOT DELETE THIS!!! THIS IS STATIC INFO!!!!!!!!!!
	let nodeInstances = lookup(R.treeNodesByOidAndKey, [oid, key]);
	if (!nodeInstances) {
		console.log('nothing to remove!', oid, key);
		return;
	}
	console.log('instances', nodeInstances);
	for (const uid of nodeInstances) {
		let n1 = R.NodesByUid[uid]; //jetzt habe tree nodes von parent in dem oid haengt!
		//let uidParent = n1.uidParent; // each node has 1 parent!
		//let n = R.NodesByUid[uidParent];
		recRemove(n1, R);
	}
	delete R.treeNodesByOidAndKey[oid][key];
	if (isEmpty(R.treeNodesByOidAndKey[oid])) delete (R.treeNodesByOidAndKey[oid]);
}
function recRemove(n, R) {
	delete R.NodesByUid[n.uid];
	let parent = R.NodesByUid[n.uidParent];
	removeInPlace(parent.children, n.uid);
	if (isEmpty(parent.children)) delete parent.children;
	if (nundef(n.children)) return;
	for (const ch of n.children) recRemove(R.NodesByUid[ch], R);
}
//#endregion

