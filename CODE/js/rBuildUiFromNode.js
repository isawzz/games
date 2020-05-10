function recBuildUiFromNode(n, uidParent, R){ // #111, iParams = {}) {

	//console.log('build ui for',n.uid);
	let n1 = {}; // n is rtree, n1 is uiNode for eg. board
	let sp = R.getSpec();
	n1.uid = n.uid;
	if (isdef(n.children)) {
		n1.children = n.children.map(x => x);
		n1.adirty = true; 
	}
	// let parent = lookup(R.NodesByUid, [uidParent]); //let k = parent ? parent.key : 'ROOT';
	let nSpec = sp[n.key];
	nSpec = evalSpecPath(nSpec, n.path, R);
	n1.type = nSpec.type;
	n1.data = nSpec.data;

	//n1.params = isdef(nSpec.params) ? nSpec.params : {}; //#111
	//n1.defParams = jsCopy(iParams); 

	let oid = n1.oid = n.oid; 
	let o = oid ? R.getO(oid) : null;
	if (n1.data) n1.content = calcContentFromData(oid, o, n1.data, R);

	if (n1.type == 'grid') {
		createBoard(n1, uidParent, R); //#111, iParams);
	} else {
		//console.log('call createUi for',n1.uid)
		n1.ui = createUi(n1, uidParent, R); //#111, iParams);
	}
	R.uiNodes[n1.uid] = n1;
	if (R.isUiActive) n1.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);
	if (nundef(n1.children) || n1.type == 'grid') { return; }

	//if children
	// iParams = jsCopy(iParams); //#111
	// if (nundef(iParams[n1.type])) iParams[n1.type] = {};
	// iParams[n1.type].params = n1.defParams;

	for (const ch of n1.children) {
		let nNew = R.NodesByUid[ch];
		recBuildUiFromNode(nNew, n1.uid, R); //#111, iParams, n1.oid);
	}
}














