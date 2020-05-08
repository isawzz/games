function recBuildUiFromNode(n, uidParent, R, iParams = {}) {

	//console.log('build ui for',n.uid);
	let n1 = {}; // n is rtree, n1 is uiNode for eg. board
	let sp = R.getSpec();
	n1.uid = n.uid;
	if (isdef(n.children)) {
		n1.children = n.children.map(x => x);
		n1.adirty = true;
	}
	let parent = lookup(R.NodesByUid, [uidParent]);
	//let k = parent ? parent.key : 'ROOT';
	let nsp = sp[n.key];
	let nsub = evalSpecPath(nsp, n.path, R);
	n1.type = nsub.type;
	n1.data = nsub.data;
	n1.params = isdef(nsub.params) ? nsub.params : {};
	n1.defParams = jsCopy(iParams);
	let oid = n1.oid = n.oid; //?n.oid:oid; // von rtree node or inherited!
	let o = oid ? R.getO(oid) : null;
	if (n1.data) n1.content = calcContentFromData(oid, o, n1.data, R);

	if (n1.type == 'grid') {
		createBoard(n1, uidParent, R, iParams);
	} else {
		//console.log('call createUi for',n1.uid)
		n1.ui = createUi(n1, uidParent, R, iParams);
	}
	R.uiNodes[n1.uid] = n1;
	if (R.isUiActive) n1.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);
	if (nundef(n1.children) || n1.type == 'grid') { return; }

	//if children
	iParams = jsCopy(iParams);
	if (nundef(iParams[n1.type])) iParams[n1.type] = {};
	iParams[n1.type].params = n1.defParams;
	for (const ch of n1.children) {
		let nNew = R.NodesByUid[ch];
		recBuildUiFromNode(nNew, n1.uid, R, iParams, n1.oid);
	}
}














//#region original

function recBuildUiFromNode_ORIGINAL(n, uidParent, R, iParams = {}) {
	//n is NodesByUid node (=treeNodesByOidAndKey) if oid and key
	//all rtree nodes have now key!!!!
	//eg. 	recBuildUiFromNode1(R.tree, area, R, 'ROOT', '.', defParams, null);

	let n1 = {}; // n is rtree, n1 is uiNode for eg. board
	let sp = R.getSpec();

	//in the case of board n does NOT have children at this point!!!!!!!!!
	//have to create rtree objects for each child of board!!!!
	//can I create rtree object already before making ui objects?
	// since I ont have a board uiNode, I cannot really look at the type


	//1. n1 should have same uid as n
	n1.uid = n.uid;
	if (isdef(n.children)) n1.children = n.children.map(x => x);

	//2. dont need to copy ANY info from rtree node because have ref! =>NodesByUid[uid]

	//3. ui node needs params,content so need type,data now!
	//type and data come from spec! (also params if any)
	let parent = lookup(R.NodesByUid, [uidParent]);
	let k = parent ? parent.key : 'ROOT';
	let nsp = sp[n.key];

	console.log('board spec node will only be revealed here!!!', n.key)

	//4. relpath will lead to correct subtree of spec node!
	let nsub = evalSpecPath(nsp, n.path, R);

	//console.log('==>4. key', n.key, 'relpath', n.path);
	//console.log('subtree', nsub);

	n1.type = nsub.type;
	n1.data = nsub.data;
	n1.params = isdef(nsub.params) ? nsub.params : {};
	n1.defParams = jsCopy(iParams);

	//console.log('n1',n1);

	//5. now comes oid part!!! to get content
	let oid = n1.oid = n.oid; //?n.oid:oid; // von rtree node or inherited!
	let o = oid ? R.getO(oid) : null;
	if (n1.data) n1.content = calcContentFromData(oid, o, n1.data, R);

	// *** CREATE UI HERE ***
	n1.ui = createUi(n1, uidParent, R, iParams);

	R.uiNodes[n1.uid] = n1;

	if (R.isUiActive) n1.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);

	if (nundef(n1.children)) return;

	iParams = jsCopy(iParams);
	if (nundef(iParams[n1.type])) iParams[n1.type] = {};
	iParams[n1.type].params = n1.defParams;

	for (const ch of n1.children) {
		let nNew = R.NodesByUid[ch];
		recBuildUiFromNode(nNew, n1.uid, R, iParams, n1.oid);
	}


}

function recBuildUiFromNode_verbose(n, uidParent, R, iParams = {}) {
	//n is NodesByUid node (=treeNodesByOidAndKey) if oid and key
	//all rtree nodes have now key!!!!
	//eg. 	recBuildUiFromNode1(R.tree, area, R, 'ROOT', '.', defParams, null);

	let n1 = {}; // n is rtree, n1 is uiNode for eg. board
	let sp = R.getSpec();

	//in the case of board n does NOT have children at this point!!!!!!!!!
	//have to create rtree objects for each child of board!!!!
	//can I create rtree object already before making ui objects?
	// since I ont have a board uiNode, I cannot really look at the type


	//1. n1 should have same uid as n
	n1.uid = n.uid;
	if (isdef(n.children)) {
		//console.log('haloooooooooooooo');
		n1.children = n.children.map(x => x);
		n1.adirty = true;
	}

	//2. dont need to copy ANY info from rtree node because have ref! =>NodesByUid[uid]

	//3. ui node needs params,content so need type,data now!
	//type and data come from spec! (also params if any)
	let parent = lookup(R.NodesByUid, [uidParent]);
	let k = parent ? parent.key : 'ROOT';
	let nsp = sp[n.key];

	//console.log('board spec node will only be revealed here!!!',n.key)

	//4. relpath will lead to correct subtree of spec node!
	let nsub = evalSpecPath(nsp, n.path, R);

	//console.log('==>4. key', n.key, 'relpath', n.path);
	//console.log('subtree', nsub);

	n1.type = nsub.type;
	n1.data = nsub.data;
	n1.params = isdef(nsub.params) ? nsub.params : {};
	n1.defParams = jsCopy(iParams);

	//console.log('n1',n1);

	//5. now comes oid part!!! to get content
	let oid = n1.oid = n.oid; //?n.oid:oid; // von rtree node or inherited!
	let o = oid ? R.getO(oid) : null;
	if (n1.data) n1.content = calcContentFromData(oid, o, n1.data, R);

	// *** CREATE UI HERE ***
	if (o && o.obj_type == 'Board') {
		//console.log('line 53 in recBuildUiFromNode1 vor createUi','\nn',n,'\nn1', n1,'\nuidParent', uidParent);

	}
	if (n1.type == 'grid') {
		//console.log('oid',oid)
		createBoard(n1, uidParent, R, iParams);
	} else {
		n1.ui = createUi(n1, uidParent, R, iParams);
	}

	R.uiNodes[n1.uid] = n1;

	if (R.isUiActive) n1.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);

	if (nundef(n1.children) || n1.type == 'grid') {
		//console.log('>>>>>>>NO CHILDREN!!!')
		return;
	}

	iParams = jsCopy(iParams);
	if (nundef(iParams[n1.type])) iParams[n1.type] = {};
	iParams[n1.type].params = n1.defParams;

	for (const ch of n1.children) {
		let nNew = R.NodesByUid[ch];
		recBuildUiFromNode(nNew, n1.uid, R, iParams, n1.oid);
	}

	// if (isContainerType(n1.type)) {
	// 	console.log('................adjustContainerLayout for',n1)
	// 	adjustContainerLayout(n1, R);
	// }

}

//#endregion
