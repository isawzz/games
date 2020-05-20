function einhaengen0(oid, o, R) {
	//console.log('_____________ einhaengen', oid, R.oidNodes[oid]);
	//let nodes = R.oidNodes[oid];

	let nodes = R.getR(oid);
	if (isEmpty(nodes)) return;
	for (const key of nodes){ //} in nodes) {
		if (o.loc) addOidByLocProperty0(oid, key, R);
		else addOidByParentKeyLocation0(oid, key, R);
	}
}
function addOidByLocProperty0(oid, key, R) {
	let o = R.getO(oid);
	let ID = o.loc; //ID is oid ob obj AUF DEM o dargestellt werden soll!

	//gibt es spec key fuer ID?
	// let IDNode = R.oidNodes[ID];
	// let IDkeys = Object.keys(IDNode);
	// for (const k of IDkeys) {
	let IDkeys = R.getR(oid);

	for (const k of IDkeys) {
		//now find parents that have same key and same oid
		let parents = lookup(R.rNodesOidKey, [ID, k]);
		//console.log('parents for robber', parents);

		if (!parents || isEmpty(parents)) {
			console.log('LOC PARENT MISSING!!!! trying to add', oid, 'with loc', o.loc);
			continue;
		}
		for (const uidParent of parents) {
			//console.log('oid', oid, 'key', key, 'uidParent', uidParent)
			instantiateOidKeyAtParent(oid, key, uidParent, R);
		}
	}
}
function addOidByParentKeyLocation0(oid, key, R) {
	//console.log('_____________ addOidByParentKeyLocation', oid, key);
	let nodes = R.getR(oid); //R.oidNodes[oid];
	if (isEmpty(nodes)) return;
	let parents = R.Locations[key]; //for now just 1 allowed!!!!!!!!!!
	//console.log('found parents:',parents)
	if (nundef(parents)) return;
	for (const uidParent of parents) { instantiateOidKeyAtParent(oid, key, uidParent, R); }
}







function change_parent_type_if_needed(n, R) {

	let uiNode = R.uiNodes[n.uid];

	if (uiNode.type == 'invisible') { clearElement(uiNode.ui); return; }
	if (!isContainerType(uiNode.type)) {
		uiNode.type = 'panel'; //TRANSPARENT FOR 'g', 'd', 'h' type!!!
		uiNode.changing = true;
		let uidParent = n.uidParent;
		let area = uidParent ? uidParent : R.baseArea;
		let uiNew = createUi0(uiNode, area, R, uiNode.defParams);
	}
}

