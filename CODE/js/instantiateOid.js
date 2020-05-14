function instantiateOidKeyAtParent(oid, key, uidParent, R) {
	//console.log('>>>>>instantiate', oid, 'using', key, 'at', uidParent, '\nrParent', R.rNodes[uidParent], '\nuiParent', R.uiNodes[uidParent]);

	let rtreeParent = R.rNodes[uidParent];

	if (nundef(rtreeParent.children)) {
		if (isdef(R.uiNodes[uidParent])) change_parent_type_if_needed(rtreeParent, R);
		rtreeParent.children = [];
	}
	let index = rtreeParent.children.length;
	let newPath = isdef(rtreeParent.sub) ? extendPath(rtreeParent.path, index) : '.';// index == 0 ? '.' : extendPath(n.path, index);

	//die spec fuer neuen node befindet sich bei 
	//find address of(key,rtreeParent.path);
	
	let nsp = R.lastSpec[key];
	let n1 = recBuildRTree(nsp, key, '.', rtreeParent, R.lastSpec, R,oid);
	//let n1 = { uid: getUID(), uidParent: uidParent, oid: oid, path: newPath, key: key };
	R.rNodes[n1.uid] = n1;
	lookupAddToList(R.rNodesOidKey, [oid, key], n1.uid);
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






