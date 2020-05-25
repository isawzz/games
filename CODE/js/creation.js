//#region start sequence
function ensureRtree(R) {
	if (nundef(R.tree) || isEmpty(R.tree)) {

		if (isdef(R.lastSpec.ROOT.cond)) {
			R.tree = { uid: getUID(), uidParent: null, here: 'ROOT', type: 'invisible' };
			R.rNodes[R.tree.uid] = R.tree;
			R.Locations.ROOT = [R.tree.uid];
		} else {
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
	//console.log('create static')
	recUi(n, area, R);
}
function addNewlyCreatedServerObjects(sdata, R) {
	//console.log('_____________ addNewly...', sdata);

	for (const oid in sdata) { R.addObject(oid, sdata[oid]); R.addRForObject(oid); }

	for (const oid in sdata) {
		let o = sdata[oid];
		if (isdef(o.loc)) { continue; }
		let success = einhaengen(oid, o, R);
	}
	//return;
	//so far has added all objects to tree that do NOT have loc component and have spec node
	//or are a part of an object that has spec node (eg. board member)

	sieveLocOids(R);
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
function einhaengen(oid, o, R) {
	let topUids;
	let success = false;
	let successKeys = [];
	for (const key of R.getR(oid)) {
		let specNode = R.getSpec(key);
		if (o.loc && nundef(R.Locations[key]) && nundef(specNode._ref)) {
			//console.log('robber want to add key='+ key);
			if (nundef(R.Locations[key])) {
				//console.log('YES!!! key is free!');
				topUids = addOidByLocProperty(oid, key, R);
			} else {
				console.log('impossible to add!!! key bound to location', R.locations[key]);
			}
		} else if (isdef(R.Locations[key])) {
			//if (oid == '146') console.log('trying to add key='+key, 'by parent location!')
			if (oid == '9') console.log('==>trying to add key='+key, 'by parent location!')
			topUids = addOidByParentKeyLocation(oid, key, R);
		} else {
			topUids=[];
			// console.log('key='+key,'cannot be added for oid='+oid,'cause no loc or available location! (this might be a board element!)')
		}
		if (isEmpty(topUids)) { continue; }
		else { successKeys.push(key); success = true; }

		for (const top of topUids) {
			let uiParent = R.uiNodes[top.uidParent];
			let rParent = R.rNodes[top.uidParent];
			if (isdef(uiParent)) {
				uiParent.adirty = true;
				uiParent.children = rParent.children.map(x => x);
			}
			//console.log('einhaengen!!!!',key)
			recUi(R.rNodes[top.uid], top.uidParent, R, oid, key);
		}
	}
	return success ? successKeys : false;
}
function addOidByLocProperty(oid, key, R) {
	let o = R.getO(oid);
	let oidParent = o.loc;

	//if (o.obj_type == 'robber') console.log('_____________ addOidByLocProperty', oid, key)

	let parents = R.oid2uids[oidParent];

	if (isEmpty(parents)) { return []; }

	let topUids = [];
	for (const uidParent of parents) {
		if (parentHasThisChildAlready(uidParent, oid) || !parentHasChannelForThisOid(R.rNodes[uidParent], oid)) continue;
		let n1 = instantOidKey(oid, key, uidParent, R);
		topUids.push({ uid: n1.uid, uidParent: uidParent });
	}
	//if (o.obj_type == 'robber') console.log('result', topUids);
	return topUids;
}
function addOidByParentKeyLocation(oid, key, R) {
	//console.log('_____________ addOidByParentKeyLocation', oid, key);
	// let nodes = R.oidNodes[oid];// ELIM
	// if (!oidNodesSame(oid,R)) { console.log('NOT EQUAL!!!!!!!!!!', getOidNodeKeys(oid,R), R.getR(oid)); }
	// if (isEmpty(nodes)) return;



	let parents = R.Locations[key]; //for now just 1 allowed!!!!!!!!!!
	if (oid=='9') console.log('found parents:',parents)
	if (nundef(parents)) {
		if (oid == '146') console.log('not added!!!', oid, key)
		return;
	}
	let topUids = [];
	for (const uidParent of parents) {
		// instantiateOidKeyAtParent(oid, key, uidParent, R); 
		if (parentHasThisChildAlready(uidParent, oid)) continue;
		let n1 = instantOidKey(oid, key, uidParent, R);
		topUids.push({ uid: n1.uid, uidParent: uidParent });

	}
	return topUids;
}
function instantOidKey(oid, key, uidParent, R) {
	//console.log('*** instant *** oid', oid, 'key', key, 'uidParent', uidParent, '\nrtreeParent', R.rNodes[uidParent],'\nR',R);
	//if (oid=='9')console.log('*** instant *** oid', oid, 'key', key, 'uidParent', uidParent, '\nrtreeParent', R.rNodes[uidParent],'\nR',R);

	let rtreeParent = R.rNodes[uidParent];

	if (nundef(rtreeParent.children)) { rtreeParent.children = []; }

	//=================================================
	//if (oid == '9') console.log('Board: instantOidKey vor recTree call',oid,key,uidParent)
	//if (oid == '0') console.log('Member: instantOidKey vor recTree call',oid,key,uidParent)

	let n1 = recTree(R.lastSpec[key], rtreeParent, R, oid, key);

	R.rNodes[n1.uid] = n1;
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
























