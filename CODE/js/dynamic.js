function instantiateOidKeyAtParent(oid, key, uidParent, R) {

	//console.assert(isdef(R.oidNodes[oid][key]), 'oidNode MISSING', oid, key);
	//console.log('>>>>>instantiate',oid,'using',key,'at',uidParent);

	let rtreeParent = R.NodesByUid[uidParent];
	if (nundef(rtreeParent.children)) {
		change_parent_type_if_needed(rtreeParent, R);
		//console.log('type of parent of board is',R.uiNodes[rtreeParent.uid].type);
		rtreeParent.children = [];
	}
	//return;
	let index = rtreeParent.children.length;
	let newPath = isdef(rtreeParent.panels) ? extendPath(rtreeParent.path, index) : '.';// index == 0 ? '.' : extendPath(n.path, index);
	//console.log('index',index,'newPath',newPath,'oid',oid,'key',key)
	let n1 = { uid: getUID(), uidParent: uidParent, oid: oid, path: newPath, key: key };
	//console.log('============== n1 (rtree board)',n1)

	//here muss den echten node auch adden, den uiNode!
	R.NodesByUid[n1.uid] = n1;
	lookupAddToList(R.treeNodesByOidAndKey, [oid, key], n1.uid);

	//console.log('================> board is of spec type',key);

	//moeglichkeit 1: ich kann hier checken fuer spec types sowie board
	//und kann hier alle rtree children adden!

	rtreeParent.children.push(n1.uid);

	// if (nundef(R.todo)) R.todo=[];
	// R.todo.push({oid:oid,key:key,uidParent:uidParent,uid:n1.uid});
	// return; //das ist version 1 wo ich den gesamten rtree mache fuer alle objects, undd 
	//dann erst den gesamten ui tree mache!

	//return;
	//console.log('added to NodesByUid',R.NodesByUid);
	//console.log('added to treeNodesByOidAndKey',R.treeNodesByOidAndKey);
	//console.log('there should be a parent since have parent uid!!!!',R.uiNodes)
	//console.log('...parent:',R.uiNodes[uidParent]);

	if (isdef(R.uiNodes) && isdef(R.uiNodes[uidParent])) {
		let parent = R.uiNodes[uidParent];

		parent.adirty=true;
		//console.log('adirty=true for',parent.uid,parent)
	// if (nundef(R.todo)) R.todo=[];
	// R.todo.push({oid:oid,key:key,uidParent:uidParent,uid:n1.uid});


		recBuildUiFromNode(n1, uidParent, R, parent.defParams, oid);
		
		parent.children = rtreeParent.children; //.push(n1.oid);
	} else {
		console.log('UI not creatable! R.uiNodes:', oid, key, R.uiNodes);
	}

}





//#region add oid
function addNewServerObjectToRsg(oid, o, R, skipEinhaengen=false) {

	//console.log('_____________ add object', oid, o);
	R.addObject(oid, o);
	addRForObject(oid, R);

	//ensureRtree(R); //make sure static tree has been built! 

	if (nundef(R.oidNodes)) R.oidNodes = {};

	createPrototypesForOid(oid, o, R);

	if (skipEinhaengen){
		//let key = 'F'
		return;
		instantiateOidKeyAtParent(oid,null,null,R);
	}else{
		einhaengen(oid, o, R);
	}
}
function addRForObject(oid, R) {
	let o = R.getO(oid);
	let sp = R.getSpec();
	for (const k in sp) {
		let n = sp[k];
		if (nundef(n.cond)) continue;
		if (n.cond == 'all' || evalConds(o, n.cond)) { R.addR(oid, k); }
	}
}
function createPrototypesForOid(oid, o, R) {
	if (isdef(R.oidNodes[oid])) {
		console.log('prototypes for',oid,'already created!');
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
		//here oidNodeUid would come in handy! need tree nodes by oid and key here!
		let parents = lookup(R.treeNodesByOidAndKey, [ID, k]);

		if (!parents || isEmpty(parents)) {
			console.log('LOC PARENT MISSING!!!! trying to add', oid, 'with loc', o.loc);
			continue;
		}

		for (const uidParent of parents) { instantiateOidKeyAtParent(oid, key, uidParent, R); }
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
	//type MUST change unless explicitly set!!!!!
	//how do I find out if type was set?
	//if it is NOT a list type, it MUST BE CHANGED TO PANEL!!!!!
	let uiNode = R.uiNodes[n.uid];

	if (!isContainerType(uiNode.type)) {
		let uiNode = R.uiNodes[n.uid];
		//console.log('CHANGE UI TYPE FROM', uiNode.type, 'to panel', jsCopy(n),jsCopyMinus(uiNode,'act'),'\nui:',uiNode.ui)
		//console.log('uiNode',jsCopySafe(uiNode))
		//console.log('copy of uiNode.ui',jsCopy(uiNode.ui));
		//console.log('parent of board',uiNode)
		uiNode.type = 'panel';
		uiNode.changing=true;
		// if (uiNode.ui) {
		// 	clearElement(uiNode.ui);
		// 	//mDestroy(uiNode.ui);
		// }
		let treeNode = R.NodesByUid[n.uid];
		let uidParent = treeNode.uidParent;
		let area = uidParent ? uidParent : R.baseArea;
		let uiNew = createUi(uiNode, area, R, uiNode.defParams);
		//uiNode.ui = uiNew;
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

//#region instantiate uiNodes
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








//#region instantiate ORIGINAL
function instantiateOidKeyAtParent_ORIGINAL(oid, key, uidParent, R) {

	//console.assert(isdef(R.oidNodes[oid][key]), 'oidNode MISSING', oid, key);
	//console.log('>>>>>instantiate',oid,'using',key,'at',uidParent);

	let rtreeParent = R.NodesByUid[uidParent];
	if (nundef(rtreeParent.children)) {
		change_parent_type_if_needed(rtreeParent, R);
		console.log('type of parent of board is',R.uiNodes[rtreeParent.uid].type);
		rtreeParent.children = [];
	}
	//return;
	let index = rtreeParent.children.length;
	let newPath = isdef(rtreeParent.panels) ? extendPath(rtreeParent.path, index) : '.';// index == 0 ? '.' : extendPath(n.path, index);
	//console.log('index',index,'newPath',newPath,'oid',oid,'key',key)
	let n1 = { uid: getUID(), uidParent: uidParent, oid: oid, path: newPath, key: key };
	console.log('============== n1 (rtree board)',n1)

	//here muss den echten node auch adden, den uiNode!
	R.NodesByUid[n1.uid] = n1;
	lookupAddToList(R.treeNodesByOidAndKey, [oid, key], n1.uid);

	console.log('================> board is of spec type',key);

	//moeglichkeit 1: ich kann hier checken fuer spec types sowie board
	//und kann hier alle rtree children adden!
	


	//return;
	//console.log('added to NodesByUid',R.NodesByUid);
	//console.log('added to treeNodesByOidAndKey',R.treeNodesByOidAndKey);
	//console.log('there should be a parent since have parent uid!!!!',R.uiNodes)
	//console.log('...parent:',R.uiNodes[uidParent]);

	if (isdef(R.uiNodes) && isdef(R.uiNodes[uidParent])) {
		let parent = R.uiNodes[uidParent];

		recBuildUiFromNode(n1, uidParent, R, parent.defParams, oid);
	} else {
		console.log('UI not creatable! R.uiNodes:', oid, key, R.uiNodes);
	}

	rtreeParent.children.push(n1.uid);
}

//#endregion
