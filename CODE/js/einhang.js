function einhaengen(oid, o, R) {
	//console.log('_____________ einhaengen', oid, R.oidNodes[oid]);
	let nodes = R.getR(oid);// ELIM
	// let nodes = R.oidNodes[oid];// ELIM
	// if (!oidNodesSame(oid,R)) { console.log('NOT EQUAL!!!!!!!!!!', getOidNodeKeys(oid,R), R.getR(oid)); }

	if (isEmpty(nodes)) return;

	for (const key of nodes){ //} in nodes) {
		let topUids;
		//console.log(o)
		if (o.loc) topUids = addOidByLocProperty(oid, key, R);
		else topUids = addOidByParentKeyLocation(oid, key, R);
		if (nundef(topUids)) { continue; } 
		//else console.log(topUids)
		for (const top of topUids) {
			let uiParent = R.uiNodes[top.uidParent];
			let rParent = R.rNodes[top.uidParent];
			if (isdef(uiParent)) {
				uiParent.adirty = true;
				uiParent.children = rParent.children.map(x => x);
			}
			recUi(R.rNodes[top.uid], top.uidParent, R, oid, key);
		}
	}
}
function addOidByLocProperty(oid, key, R) {
	let o = R.getO(oid);
	let ID = o.loc; //ID is oid ob obj AUF DEM o dargestellt werden soll!

	//gibt es spec key fuer ID?
	// let IDNode = R.oidNodes[ID];// ELIM
	// if (!oidNodesSame(oid,R)) { console.log('NOT EQUAL!!!!!!!!!!', getOidNodeKeys(oid,R), R.getR(oid)); }
	// let IDkeys = Object.keys(IDNode);
	let IDkeys = R.getR(oid);

	let topUids = [];
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

			let n1 = instantOidKey(oid, key, uidParent, R);
			topUids.push({ uid: n1.uid, uidParent: uidParent });
		}
	}
	return topUids;
}
function addOidByParentKeyLocation(oid, key, R) {
	//console.log('_____________ addOidByParentKeyLocation', oid, key);
	// let nodes = R.oidNodes[oid];// ELIM
	// if (!oidNodesSame(oid,R)) { console.log('NOT EQUAL!!!!!!!!!!', getOidNodeKeys(oid,R), R.getR(oid)); }
	// if (isEmpty(nodes)) return;

	let parents = R.Locations[key]; //for now just 1 allowed!!!!!!!!!!
	//console.log('found parents:',parents)
	if (nundef(parents)) return;
	let topUids = [];
	for (const uidParent of parents) {
		// instantiateOidKeyAtParent(oid, key, uidParent, R); 

		let n1 = instantOidKey(oid, key, uidParent, R);
		topUids.push({ uid: n1.uid, uidParent: uidParent });

	}
	return topUids;
}


