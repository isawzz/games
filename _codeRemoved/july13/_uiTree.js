function recUi(n, R, area, oid, key) {

	let n1 = jsCopy(n);
	let o = isdef(oid) ? R.getO(oid) : null;
	if (isdef(n1.data)) { n1.content = calcContentFromData(oid, o, n1.data, R, n1.default_data); }

	R.uiNodes[n1.uid] = n1; // ONLY DONE HERE!!!!!!!
	if (n1.type == 'grid') { createBoard(n1, R, area); }
	else {
		let lst = getElements(n1.content);
		if (isdef(lst) && !isEmpty(lst)) {
			let o = R.getO(lst[0]);
			// if (isListOfLiterals(lst) && isdef(o)) { createPanelParentOfObjects(lst, n1, area, R); handleListOfObjectIds(lst, n1, area, R); }
			if (isListOfLiterals(lst) && isdef(o)) { handleListOfObjectIds(lst, n1, area, R); }
			else if (isListOfLists(lst) && isdef(o[0])) {
				// for (const l of lst) { createPanelParentOfObjects(l, n1, area, R); handleListOfObjectIds(l, n1, area, R); }
				for (const l of lst) { handleListOfObjectIds(l, n1, area, R); }
			}
			else {
				if (nundef(n1.type)) n1.type = 'info';
				n1.content = lst.join(' ');
				n1.ui = createUi(n1, R, area);
			}
			let rTreePanel = R.rNodes[n1.uid];
			n1.children = rTreePanel.children;

		} else { n1.ui = createUi(n1, R, area); }
	}
	if (R.isUiActive) n1.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);
	//else trace('NO,R.isUiActive is false!!!!!!',n.uid);
	if (nundef(n1.children) || n1.type == 'grid') return n1;

	//hier werden weitere children mit derselben oid created:
	n1.adirty = true;
	for (const ch of n1.children) {
		if (isdef(R.uiNodes[ch])) { continue; }
		recUi(R.rNodes[ch], R, n1.uid, oid, key);
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
	n1.ui = createUi(n1, R, area);
}
function handleListOfObjectIds(lst, n1, area, R) {
	//console.log('HIER!!!');
	createPanelParentOfObjects(lst, n1, area, R);
	let keysForOids = findOrCreateKeysForObjTypes(lst, R);
	for (const oid1 of lst) {
		let o1 = R.getO(oid1);
		let key = keysForOids[oid1]; // createArtificialSpecForBoardMemberIfNeeded(oid1, o1, R);
		//console.log('found key for', oid1, '=', key);
		let ntree, nui;
		ntree = instantOidKey(oid1, key, n1.uid, R);
		nui = recUi(ntree, R, n1.uid, oid1, key);
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



