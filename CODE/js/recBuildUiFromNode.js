function recBuildUiFromNode(n, uidParent, R, iParams = {}) {
	CYCLES += 1; if (CYCLES > MAX_CYCLES) return;

	//console.log('build ui for',n.uid);
	let n1 = {}; // n is rtree, n1 is uiNode for eg. board
	let sp = R.getSpec();
	n1.uid = n.uid;
	if (isdef(n.children)) {
		n1.children = n.children.map(x => x);
		//console.log('should I set adirty false?',n,n.oid); //NO!!!!!
		n1.adirty = true;
	}
	let parent = lookup(R.rNodes, [uidParent]);
	//let k = parent ? parent.key : 'ROOT';
	let nsp = sp[n.key];
	let nsub = evalSpecPath(nsp, n.path, R);
	n1.type = nsub.type;
	n1.data = nsub.data;
	n1.params = isdef(nsub.params) ? nsub.params : {};
	n1.defParams = jsCopy(iParams);
	let oid = n1.oid = n.oid; //?n.oid:oid; // von rtree node or inherited!
	let o = oid ? R.getO(oid) : null;
	if (n1.data) {
		n1.content = calcContentFromData(oid, o, n1.data, R);
		if (isString(n1.content)) {
			//console.log(n1.content)
			let oid1 = n1.content;
			//console.log('oid of card', oid1, '\noid of n1', oid);
			if (oid1 != oid) {
				let o1 = R.getO(oid1);
				if (o1) {
					//jetzt muss ich dieses object darstellen wenn es geht!
					let oidNode1 = R.oidNodes[oid1];
					if (isdef(oidNode1)) {
						let key1list = Object.keys(oidNode1);
						//console.log('following keys available for', oid1, key1list);
						let key1 = key1list[0];
						//console.log('FOUND BETTER REP FOR O', oid1, key1, '\nWAS JETZT???????');
						//hier muss ich eine neue branch bauen in RTREE!
						//habe oid, key, uidParent (is eigene uid)
						//console.log('der rNode muss doch existieren!!!', R.rNodes[n.uid])
						instantiateOidKeyAtParent(oid1, key1, uidParent, R);
						//console.log('HALLOOOOOOOO');
					}
				}
			}
		}
	}

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
		let nNew = R.rNodes[ch];
		recBuildUiFromNode(nNew, n1.uid, R, iParams, n1.oid);
	}
}















