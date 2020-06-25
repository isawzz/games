function recUi(n, area, R, oid){ //, key) {

	let n1 = jsCopy(n);
	let o = isdef(oid) ? R.getO(oid) : null;
	//console.log('o',oid,o,n, n1)
	if (isdef(n1.data)) { n1.content = calcContentFromData(oid, o, n1.data, R, n1.default_data); }

	R.uiNodes[n1.uid] = n1; // ONLY DONE HERE!!!!!!!
	if (n1.type == 'grid') {
		createBoard(n1, area, R);
	} else {
		let lst = getElements(n1.content);
		if (isdef(lst) && !isEmpty(lst)) {
			let o = R.getO(lst[0]);
			//console.log('=======o',o);
			if (isListOfLiterals(lst) && isdef(R.getO(lst[0]))) {
				createPanelParentOfObjects(lst, n1, area, R);
				handleListOfObjectIds(lst, n1, area, R);
			}
			else if (isListOfLists(lst) && isdef(R.getO(lst[0][0]))) {
				//dann bekommt n1 ein panel fuer jedes object
				for (const l of lst) {
					createPanelParentOfObjects(l, n1, area, R);
					handleListOfObjectIds(l, n1, area, R);
				}
			}
			else {// if (isListOfLiterals(lst)){
				//console.log('ist einfach nur eine liste',lst);
				if (nundef(n1.type)) n1.type = 'info';
				n1.content = lst.join(' ');
				n1.ui = createUi(n1, area, R);
			}
			let rTreePanel = R.rNodes[n1.uid];
			n1.children = rTreePanel.children;

		} else {
			n1.ui = createUi(n1, area, R);
		}
	}

	//console.log('R.uiNodes eingehaegt fuer','uid',n1.uid,'oid',oid);

	if (R.isUiActive) n1.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);

	if (nundef(n1.children) || n1.type == 'grid') return n1;

	//hier werden weitere children mit derselben oid created:
	//falls spec node complex ist!
	//aber wann werden deren rtree nodes eigentlich created??? da stimmt was nicht!!!
	n1.adirty = true;
	for (const ch of n1.children) {
		if (isdef(R.uiNodes[ch])) { continue; }
		recUi(R.rNodes[ch], n1.uid, R, oid); //, key);
	}

	return n1;

}


function isListOfServerObjects(x) {
	let oids = getElements(x);
	console.log('getElements returns', oids);
	return false;
}
function createPanelParentOfObjects(lst, n1, area, R) {
	if (nundef(n1.type)) n1.type = lst.length == 1 ? 'invisible' : 'panel';
	n1.content = null;
	n1.ui = createUi(n1, area, R);
}
function handleListOfObjectIds(lst, n1, area, R) {
	let keysForOids = findOrCreateKeysForObjTypes(lst, R);
	for (const oid1 of lst) {
		let o1 = R.getO(oid1);
		let key = keysForOids[oid1]; // createArtificialSpecForBoardMemberIfNeeded(oid1, o1, R);
		//console.log('found key for', oid1, '=', key);
		let ntree, nui;
		ntree = instantOidKey(oid1, key, n1.uid, R);
		nui = recUi(ntree, n1.uid, R, oid1, key);
	}
}
function handleListOfConstants(lst, n1, area, R) {
	//let keysForOids = findOrCreateKeysForObjTypes(lst, R);
	for (const oid1 of lst) {
		let o1 = R.getO(oid1);
		let key = keysForOids[oid1]; // createArtificialSpecForBoardMemberIfNeeded(oid1, o1, R);
		//console.log('found key for', oid1, '=', key);
		let ntree, nui;
		ntree = instantOidKey(oid1, key, n1.uid, R);
		nui = recUi(ntree, n1.uid, R, oid1, key);
	}
}



