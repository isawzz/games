//#region start sequence
function ensureRtree(R) {
	if (nundef(R.tree) || isEmpty(R.tree)) {

		if (isdef(R.lastSpec.ROOT.cond)) {
			R.tree = { uid: getUID(), uidParent: null, here: 'ROOT', type: 'invisible' };
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
	//let defParams = jsCopy(R.defs);
	//defParams = deepmergeOverride(R.defs, { _id: { params: { bg: 'green' } } });// { bg: 'blue', fg: 'white' };
	//recBuildUiFromNode(n, area, R, defParams, null);
	recUi(n, area, R);
}
function addNewlyCreatedServerObjects(sdata, R) {
	//console.log('_____________ addNewly...', sdata);
	let locOids = [];
	let failedLocOids = [];
	for (const oid in sdata) {
		let o = sdata[oid];
		if (isdef(o.loc)) { locOids.push(oid); continue; }
		addNewServerObjectToRsg(oid, o, R);

	}
	CYCLES = 0; //MAX_CYCLES=10;
	while (true) { //find next loc oid with existing parent!
		CYCLES += 1; if (CYCLES > MAX_CYCLES) { console.log('MAX_CYCLES reached!'); return; }
		let locOidsStart = jsCopy(locOids);
		let oid = find_next_loc_oid_with_existing_parent(locOids, R);
		if (!oid) {
			//console.log('cannot add any other object!', '\nstart',locOidsStart,'\nfailed:',failedLocOids,'\nCYCLES',CYCLES);
			return;
		}
		let o = sdata[oid];
		let success = addNewServerObjectToRsg(oid, o, R);
		if (!success) {
			removeInPlace(locOids, oid);
			if (!isEmpty(R.getR(oid))) addIf(failedLocOids, oid);
		}
		if (isEmpty(locOids)) {
			if (isEmpty(failedLocOids)) {
				console.log('both locOids and failedLocOids empty!', '\nCYCLES', CYCLES)
				return;
			} else { locOids = failedLocOids; failedLocOids = []; }
		}

		let locOidsEnd = jsCopy(locOids);
		if (sameList(locOidsStart, locOidsEnd) || sameList(locOidsStart, failedLocOids)) {
			//console.log('cant add more oids', '\nstart', locOidsStart, '\nend', locOidsEnd, '\nfailed:', failedLocOids, '\nCYCLES', CYCLES);
			return;
		}
		//removeInPlace(locOids, oid); //remove it from locOids
		//if (isEmpty(locOids)) break;
	}
}
function recAdjustDirtyContainers(uid, R, verbose = false) {
	//OPT::: koennte mir merken nur die die sich geaendert haben statt alle durchzugehen
	let nui = R.uiNodes[uid];
	if (nui.adirty) {
		//if(verbose) console.log('adjusting!!!!',uid)
		adjustContainerLayout(nui, R);
	}
	if (nundef(nui.children)) return;
	for (const ch of nui.children) recAdjustDirtyContainers(ch, R, verbose);

}

//#region add oid
function addNewServerObjectToRsg(oid, o, R, skipEinhaengen = false) {
	if (oid == '146' || o.obj_type == 'robber') console.log('_____________ add object', oid, o);
	R.addObject(oid, o);
	R.addRForObject(oid);

	if (skipEinhaengen) { return false; }
	else { return einhaengen(oid, o, R); }
}
function einhaengen(oid, o, R) {
	//console.log('_____________ einhaengen', oid, R.oidNodes[oid]);
	let nodes = R.getR(oid);
	//need to check channels!!!!

	// let nodes = R.oidNodes[oid];// ELIM
	// if (!oidNodesSame(oid,R)) { console.log('NOT EQUAL!!!!!!!!!!', getOidNodeKeys(oid,R), R.getR(oid)); }

	if (isEmpty(nodes)) return false;

	for (const key of nodes) { //} in nodes) {
		let topUids;
		let specNode = R.getSpec(key);
		//console.log(o)
		if (o.loc && nundef(R.Locations[key]) && nundef(specNode._ref)) {
			console.log('robber want to add', key, 'locations:', R.Locations[key]);
			if (nundef(R.Locations[key])) topUids = addOidByLocProperty(oid, key, R);
		} else {
			if (oid == '146') console.log('trying to add robber by parent!')
			topUids = addOidByParentKeyLocation(oid, key, R);
		}
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
	return true; //assume added at least some node since already know that 
	//there is a key with available channel for oid, 
	//AND 
	//there is a parent with correct channel for oid

}
function addOidByLocProperty(oid, key, R) {
	let o = R.getO(oid);
	let ID = o.loc; //ID is oid ob obj AUF DEM o dargestellt werden soll!

	if (o.obj_type == 'robber') console.log('_____________ addOidByLocProperty', oid, key)

	//gibt es spec key fuer ID?
	// let IDNode = R.oidNodes[ID];// ELIM
	// if (!oidNodesSame(oid,R)) { console.log('NOT EQUAL!!!!!!!!!!', getOidNodeKeys(oid,R), R.getR(oid)); }
	// let IDkeys = Object.keys(IDNode);
	// let IDkeys = R.getR(oid); //key must be selected by channel!

	//console.log('robber spec key is',key);

	//gibt es parents (dh rNodes mit n.oid==ID)

	let parents = allCondDict(R.rNodes, v => v.oid == ID);

	//console.log('rNodes w/ loc value as oid', parents);

	if (isEmpty(parents)) {
		console.log('no parent found in rtree to represent oid', oid);
		return [];
	}

	let topUids = [];

	for (const uidParent of parents) {
		//console.log('oid', oid, 'key', key, 'uidParent', uidParent)

		//instantiateOidKeyAtParent(oid, key, uidParent, R);

		let n1 = instantOidKey(oid, key, uidParent, R);
		topUids.push({ uid: n1.uid, uidParent: uidParent });
	}

	//#region RUBBISH
	//NOT SURE WHAT THE FOLLOWING CODE WAS GOING TO ACCOMPLISH!!! it is RUBBISH!
	// for (const k of IDkeys) {
	// 	//now find parents that have same key and same oid
	// 	let parents = lookup(R.rNodesOidKey, [ID, k]);
	// 	//console.log('parents for robber', parents);

	// 	if (!parents || isEmpty(parents)) {
	// 		console.log('LOC PARENT MISSING!!!! trying to add', oid, 'with loc', o.loc);
	// 		continue;
	// 	}
	// 	for (const uidParent of parents) {
	// 		//console.log('oid', oid, 'key', key, 'uidParent', uidParent)

	// 		//instantiateOidKeyAtParent(oid, key, uidParent, R);

	// 		let n1 = instantOidKey(oid, key, uidParent, R);
	// 		topUids.push({ uid: n1.uid, uidParent: uidParent });
	// 	}
	// }
	//#endregion
	return topUids;
}
function addOidByParentKeyLocation(oid, key, R) {
	//console.log('_____________ addOidByParentKeyLocation', oid, key);
	// let nodes = R.oidNodes[oid];// ELIM
	// if (!oidNodesSame(oid,R)) { console.log('NOT EQUAL!!!!!!!!!!', getOidNodeKeys(oid,R), R.getR(oid)); }
	// if (isEmpty(nodes)) return;



	let parents = R.Locations[key]; //for now just 1 allowed!!!!!!!!!!
	//console.log('found parents:',parents)
	if (nundef(parents)) {
		if (oid == '146') console.log('not added!!!', oid, key)
		return;
	}
	let topUids = [];
	for (const uidParent of parents) {
		// instantiateOidKeyAtParent(oid, key, uidParent, R); 
		if (parentHasThisChildAlready(uidParent,oid)) continue;
		let n1 = instantOidKey(oid, key, uidParent, R);
		topUids.push({ uid: n1.uid, uidParent: uidParent });

	}
	return topUids;
}
function instantOidKey(oid, key, uidParent, R) {
	//console.log('*** instant *** oid', oid, 'key', key, 'uidParent', uidParent, '\nrtreeParent', R.rNodes[uidParent],'\nR',R);

	let rtreeParent = R.rNodes[uidParent];

	if (nundef(rtreeParent.children)) { rtreeParent.children = []; }

	//=================================================
	//if (oid == '9') console.log('Board: instantOidKey vor recTree call',oid,key,uidParent)
	//if (oid == '0') console.log('Member: instantOidKey vor recTree call',oid,key,uidParent)

	let n1 = recTree(R.lastSpec[key], rtreeParent, R, oid, key);

	R.rNodes[n1.uid] = n1;
	//lookupAddToList(R.rNodesOidKey, [oid, key], n1.uid); //not sure if need this!!!
	rtreeParent.children.push(n1.uid);

	//console.log('result:',n1)
	return n1;

}


//#region remove oid
function completelyRemoveServerObjectFromRsg(oid, R) {

	//???need to ask object whether children should be removed or relocated
	//recursively?!?

	aushaengen(oid, R); //remove from R.tree, including children
	R.deleteObject(oid); //remove R and O for oid
}
function aushaengen(oid, R) {

	//new code
	//console.log('should remove',oid,R.rNodes)

	while (true) {
		let uid = firstCondDict(R.rNodes, x => x.oid == oid);
		if (!uid) return;
		//console.log('found node to remove:',uid);
		let n = R.rNodes[uid];

		//make sure that in each round have less rNodes
		let len = Object.keys(R.rNodes).length;

		//console.log('removing',n.uid,n)
		recRemove(n, R);
		let len2 = Object.keys(R.rNodes).length;

		if (len2 < len) {
			//console.log('success! removed',len-len2,'nodes!');
		} else {
			console.log('DID NOT REMOVE ANYTHING!!!!', len, len2);
			return;
		}
	}

}
function recRemove(n, R) {
	if (isdef(n.children)) {
		//console.log('children',n.children);
		let ids = jsCopy(n.children);
		for (const ch of ids) recRemove(R.rNodes[ch], R);
	}

	delete R.rNodes[n.uid];
	R.unregisterNode(n); //hier wird ui removed, object remains in _sd!
	delete R.uiNodes[n.uid];
	let parent = R.rNodes[n.uidParent];
	removeInPlace(parent.children, n.uid);
	if (isEmpty(parent.children)) delete parent.children;
	let uiParent = R.uiNodes[n.uidParent];
	removeInPlace(uiParent.children, n.uid);
	if (isEmpty(uiParent.children)) delete uiParent.children;

}
























