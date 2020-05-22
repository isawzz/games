function recUi(n, area, R, oid, key) {

	// *** n is rNode ***
	//just take rNode and make ui node
	//rNode can have a cond - deal with that later!
	//basically just eval data and params

	let n1 = jsCopy(n);
	let o = isdef(oid) ? R.getO(oid) : null;
	if (isdef(n1.data)) n1.content = calcContentFromData(oid, o, n1.data, R);

	//console.log(n1)
	if (n1.type == 'grid') {
		createBoard(n1, area, R);
	} else {
		//console.log('call createUi__ for',n1.uid)
		//if (oid == '0') console.log('Member: calling createUi',jsCopy(n1))
		n1.ui = createUi(n1, area, R);
		// n1.ui = createUi0(n1, uidParent, R, iParams);
	}

	// n1.ui = createUi(n1, area, R);

	R.uiNodes[n1.uid] = n1;
	//console.log(R.uiNodes);

	if (R.isUiActive) n1.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);

	if (nundef(n1.children) || n1.type == 'grid') return n1;

	n1.adirty = true;
	for (const ch of n1.children) {
		recUi(R.rNodes[ch], n1.uid, R, oid, key);
	}

	return n1;

}