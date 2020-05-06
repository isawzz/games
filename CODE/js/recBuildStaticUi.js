function createStaticUi(area, R) {
	ensureUiNodes(R);
	let n = R.tree;
	let defParams = jsCopy(R.defs);
	defParams = deepmergeOverride(R.defs, { panel: { params: { bg: 'green' } } });// { bg: 'blue', fg: 'white' };
	recBuildUiFromNode(n, area, R, defParams, null);
}

function addNewlyCreatedServerObjects(sdata, R) {
	let locOids = [];
	for (const oid in sdata) {
		let o = sdata[oid];
		if (isdef(o.loc)) { locOids.push(oid); continue; }
		addNewServerObjectToRsg(oid, o, R);
	}

	while (true) {
		//find next loc oid with existing parent!
		let oid = find_next_loc_oid_with_existing_parent(locOids, sdata, R);
		if (!oid) {
			//console.log('cannot add any other object!', locOids);
			break;
		}
		//add it to RSG
		let o = sdata[oid];
		addNewServerObjectToRsg(oid, o, R);
		removeInPlace(locOids, oid); //remove it from locOids
		if (isEmpty(locOids)) break;
	}

	//adjust dirty containers
	//return;
	recAdjustDirtyContainers(R.tree.uid,R);
}

function recAdjustDirtyContainers(uid,R){

	let nui = R.uiNodes[uid];
	if (nui.adirty){
		adjustContainerLayout(nui,R);
	}
	if (nundef(nui.children)) return;
	for(const ch of nui.children) recAdjustDirtyContainers(ch,R);

}

function find_next_loc_oid_with_existing_parent(locOids, sdata, R) {
	for (const oid of locOids) {
		let o = sdata[oid];
		let loc = o.loc;
		let parentID = loc;
		if (!isEmpty(R.treeNodesByOidAndKey[parentID])) return oid;
	}
	return null;
}


