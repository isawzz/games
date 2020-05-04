//#region add oid
function addNewServerObjectToRsg(oid, o, R) {

	//console.log('_____________ add object', oid, o);

	R.addObject(oid, o);
	addRForObject(oid, R);

	ensureRtree(R); //make sure static tree has been built! 

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
		R.tree = recBuildRTree(R.lastSpec.ROOT, '.', null, R.lastSpec, R);
		R.tree.key = 'ROOT';
		R.NodesByUid[R.tree.uid] = R.tree;

	} else {
		//console.log('(tree present!)');

	}
	//console.log('==> R.tree:',R.tree)
}
function recBuildRTree(n, path, parent, sp, R) {
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
			let ch = recBuildRTree(chInfo, newPath, n1, sp, R);
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

		//console.log(o.loc)
		if (o.loc) addOidByLocProperty(oid, key, R);
		else addOidByParentKeyLocation(oid, key, R);


	}

}
function addOidByLocProperty(oid, key, R) {
	//console.log(oid, key);
	let o = R.getO(oid);
	let ID = o.loc; //ID is oid ob obj AUF DEM o dargestellt werden soll!

	//console.log('location is obj w/ id:',ID)

	//gibt es spec key fuer ID?
	let IDNode = R.oidNodes[ID];

	let IDkeys = Object.keys(IDNode);
	//console.log(ID, IDkeys);
	for (const k of IDkeys) {
		//console.log(k,IDkeys,R.treeNodesByOidAndKey)
		//now find parents that have same key and same oid
		//here oidNodeUid would come in handy! need tree nodes by oid and key here!
		let parents = lookup(R.treeNodesByOidAndKey, [ID, k]);
		//console.log('reps for ID', ID, k, parents, IDkeys, oid, o);
		//console.log('IDNode',IDNode);

		if (!parents || isEmpty(parents)) {
			console.log('LOC PARENT MISSING!!!! trying to add',oid,'with loc',o.loc);
			continue;
		}

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

	//here muss den echten node auch adden, den uiNode!
	//console.log('need to add uiNode for uid',n1.uid,oid,key);

	R.NodesByUid[n1.uid] = n1;
	lookupAddToList(R.treeNodesByOidAndKey, [oid, key], n1.uid);

	if (isdef(R.uiNodes) && isdef(R.uiNodes[uidParent])) {
		let parent = R.uiNodes[uidParent];
		//let parentUi = R.getUI(uidParent);
		//console.log('parent uid',uidParent,'ui',parentUi);
		recBuildUiFromNode(n1, uidParent, R, key, '.', parent.params, oid);
	}

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
	//console.log('instances', nodeInstances);
	for (const uid of nodeInstances) {
		let n1 = R.NodesByUid[uid]; //jetzt habe tree nodes von parent in dem oid haengt!
		//let uidParent = n1.uidParent; // each node has 1 parent!
		//let n = R.NodesByUid[uidParent];
		recRemove(n1, R);
	}
}
function recRemove(n, R) {
	if (isdef(n.children)) {
		for (const ch of n.children) recRemove(R.NodesByUid[ch], R);
	}

	console.log(n);
	if (isdef(n.oid) && isdef(n.key)) {
		let oid=n.oid;
		let key=n.key;
		delete R.treeNodesByOidAndKey[oid][key];
		if (isEmpty(R.treeNodesByOidAndKey[oid])) delete (R.treeNodesByOidAndKey[oid]);
	}

	delete R.NodesByUid[n.uid];
	//n.uid muss aus UIS,register,links,ui entfernt werden!!!
	R.unregisterNode(n); //hier wird ui removed
	delete R.uiNodes[n.uid];



	let parent = R.NodesByUid[n.uidParent];
	removeInPlace(parent.children, n.uid);
	if (isEmpty(parent.children)) delete parent.children;
}
//#endregion

//#region instantiate uiNodes

function generateUis(area, R) {
	//go through rsg tree DFS 
	//merge info for each node (temp!)
	//eval content =>could lead to more nodes being added as children!
	ensureUiNodes(R);
	let n = R.tree;
	let defParams = {};// { bg: 'blue', fg: 'white' };
	//console.log(n);
	recBuildUiFromNode(n, area, R, 'ROOT', '.', defParams, null);

	R.instantiable = [];
	for (const x in R.UIS) {
		let y = R.UIS[x];
		if (isdef(y.act) && isdef(y.oid) && isdef(y.key)) R.instantiable.push({ oid: y.oid, key: y.key });
		// Object.values(R.UIS).map(x=>{x.uid,x.oid,x.key});
	}

}
function ensureUiNodes(R) { if (nundef(R.uiNodes)) R.uiNodes = {}; }


function recBuildUiFromNode(n, area, R, key, relpath, params = {}, oid = null) {
	//n is unique tree node (treeNodesByOidAndKey) for oid and key
	let n1 = {};
	let sp = R.getSpec();

	//find specNode[s] (for now just 1 allowed!) for this oid and merge it into tree node n
	//invariant: if oid != null n.key is defined! (so evalSpec wont be called with an oid)
	console.assert(oid == null || isdef(n.key), 'recBuildUiFromNode assertion does NOT hold!!!!', n);
	key = isdef(n.key) ? n.key : key;

	let nSpec = sp[key];
	if (isdef(n.key)) n1 = deepmergeOverride(nSpec, n);
	else { let nRel = evalSpecPath(nSpec, relpath, R); n1 = deepmergeOverride(nRel, n); }

	n.defParams = params;
	oid = n1.oid ? n1.oid : oid;
	let o = oid ? R.getO(oid) : null;
	if (n1.data) n1.content = calcContentFromData(oid, o, n1.data, R);
	n1.ui = createUi(n1, area, R);
	R.uiNodes[n1.uid] = n1;

	if (R.isUiActive) n1.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);

	if (nundef(n1.children)) return;

	let i = 0;
	for (const ch of n1.children) {
		let nNew = R.NodesByUid[ch];
		let keyNew = key;
		let relpathNew = isdef(n.key) ? '.' + i : extendPath(relpath, i);
		let paramsNew = n1.params;
		let oidNew = isdef(n1.oid) ? n1.oid : null;
		recBuildUiFromNode(nNew, n1.uid, R, keyNew, relpathNew, paramsNew, oidNew);
		i += 1;
	}
}

function evalSpecPath(n, relpath, R) {
	//for now NUR panels oder ch als children prop erlaubt!
	//return partial spec node under n, following relpath
	//console.log('path', relpath, 'n', n);
	if (isEmpty(relpath)) return null;
	if (relpath == '.') return n;
	let iNext = firstNumber(relpath);

	nNext = n.panels[iNext];
	//let uidNext = n.children[next];
	//let nNext=R.NodesByUid[uidNext];
	let newPath = stringAfter(relpath, '.' + iNext);
	if (isEmpty(newPath)) return nNext;
	else return evalSpecPath(nNext, newPath, R);


}

//#endregion











