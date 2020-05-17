function einhaengen(oid, o, R) {
	//console.log('_____________ einhaengen', oid, R.oidNodes[oid]);
	let nodes = R.oidNodes[oid];
	if (isEmpty(nodes)) return;

	


	for (const key in nodes) {
		let topUids;
		if (o.loc) topUids=addOidByLocProperty(oid, key, R);
		else topUids=addOidByParentKeyLocation(oid, key, R);

		for(const top of topUids){
			recUi(R.rNodes[top.uid],top.uidParent,R);
		}
	}
}
function addOidByLocProperty(oid, key, R) {
	let o = R.getO(oid);
	let ID = o.loc; //ID is oid ob obj AUF DEM o dargestellt werden soll!

	//gibt es spec key fuer ID?
	let IDNode = R.oidNodes[ID];
	let IDkeys = Object.keys(IDNode);
	let topUids=[];
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
			
			//instantiateOidKeyAtParent(oid, key, uidParent, R);

			let n1=instantOidKey(oid,key,uidParent,R);
			topUids.push({uid:n1.uid,uidParent:uidParent});
		}
	}
	return topUids;
}
function addOidByParentKeyLocation(oid, key, R) {
	//console.log('_____________ addOidByParentKeyLocation', oid, key);
	let nodes = R.oidNodes[oid];
	if (isEmpty(nodes)) return;
	let parents = R.Locations[key]; //for now just 1 allowed!!!!!!!!!!
	//console.log('found parents:',parents)
	if (nundef(parents)) return;
	let topUids=[];
	for (const uidParent of parents) { 
		// instantiateOidKeyAtParent(oid, key, uidParent, R); 

		let n1 =instantOidKey(oid,key,uidParent,R);
		topUids.push({uid:n1.uid,uidParent:uidParent});
	
	}
	return topUids;
}








function change_parent_type_if_needed(n, R) {

	let uiNode = R.uiNodes[n.uid];

	if (!isContainerType(uiNode.type)) {
		uiNode.type = 'panel'; //TRANSPARENT FOR 'g', 'd', 'h' type!!!
		uiNode.changing = true;
		let uidParent = n.uidParent;
		let area = uidParent ? uidParent : R.baseArea;
		let uiNew = createUi(uiNode, area, R, uiNode.defParams);
	}
}

