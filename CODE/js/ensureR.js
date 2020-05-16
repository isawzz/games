//#region start sequence
function ensureRtree(R) {
	if (nundef(R.tree) || isEmpty(R.tree)) {

		if (isdef(R.lastSpec.ROOT.cond)) {
			R.tree = {uid:getUID(),uidParent:null,here:'ROOT',type:'invisible'}; //,key:'ROOT',path:'.'};
			R.rNodes[R.tree.uid] = R.tree;
			R.Locations.ROOT = [R.tree.uid];
		} else {

			//R.tree = recBuildRTree(R.lastSpec.ROOT, 'ROOT', '.', null, R.lastSpec, R);
			R.tree = recTree(R.lastSpec.ROOT, null, R);
			R.rNodes[R.tree.uid] = R.tree;
		}

	} else {
		console.log('(tree present!)');
	}
}
function createStaticUi(area, R) {
	ensureUiNodes(R);
	let n = R.tree;

	let defParams = jsCopy(R.defs);
	defParams = deepmergeOverride(R.defs, { _id: { params: { bg: 'green' } } });// { bg: 'blue', fg: 'white' };
	//recBuildUiFromNode(n, area, R, defParams, null);
	recUi(n,area,R);
}
function addNewlyCreatedServerObjects(sdata, R) {
	//console.log('_____________ addNewly...', sdata);
	let locOids = [];
	for (const oid in sdata) {
		let o = sdata[oid];
		if (isdef(o.loc)) { locOids.push(oid); continue; }
		addNewServerObjectToRsg(oid, o, R);
	}
	while (true) { //find next loc oid with existing parent!
		let oid = find_next_loc_oid_with_existing_parent(locOids, sdata, R);
		if (!oid) {
			//console.log('cannot add any other object!', locOids);
			break;
		}
		let o = sdata[oid];
		addNewServerObjectToRsg(oid, o, R);
		removeInPlace(locOids, oid); //remove it from locOids
		if (isEmpty(locOids)) break;
	}



	recAdjustDirtyContainers(R.tree.uid, R);
}
function recAdjustDirtyContainers(uid, R, verbose = false) {
	//OPT::: koennte mir merken nur die die sich geaendert haben statt alle durchzugehen
	let nui = R.uiNodes[uid];
	//if (verbose) console.log('uid',uid)
	if (nui.adirty) {
		//if(verbose) console.log('adjusting!!!!',uid)
		adjustContainerLayout(nui, R);
	}
	if (nundef(nui.children)) return;
	for (const ch of nui.children) recAdjustDirtyContainers(ch, R, verbose);

}
