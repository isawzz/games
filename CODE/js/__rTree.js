function recTree(n, rParent, R, oid, key) {
	CYCLES += 1; if (CYCLES > MAX_CYCLES) return;
	//console.log('***recTree input:', '\nn', n, '\rParent', rParent)
	let uid = getUID();
	let n1 = {};

	let expandProp = '_NODE'; let nodeName = n[expandProp];
	if (isString(nodeName)) {
		//console.log('________ found _NODE', nodeName, '\nn', n);
		let nSpec = R.lastSpec[nodeName];
		if (nundef(n.cond) && nundef(nSpec.cond)) {
			let merged = deepmerge(nSpec, n);
			delete merged._NODE;
			if (isdef(nSpec._NODE)) merged._NODE = nSpec._NODE;
			return recTree(merged, rParent, R, oid, key);
		} else {
			lookupAddToList(R.Locations, [nodeName], uid);
			n1.here = nodeName;
			if (nundef(n.data)) n1.type = 'invisible';
		}
	} else if (isList(nodeName)) {
		let merged = {};
		let newNodeList = [];
		let hereList = [];
		for (const name of nodeName) {
			if (nundef(n.cond)) {
				let nSpec = R.lastSpec[name];
				merged = deepmerge(merged, nSpec);
				if (isdef(nSpec._NODE)) addIf(newNodeList, nSpec._NODE);
			} else {
				lookupAddToList(R.Locations, [name], uid);
				if (isdef(nSpec._NODE)) addIf(hereList, nSpec._NODE);
			}
		}
		merged = deepmerge(merged, n);
		delete merged._NODE;
		if (!isEmpty(newNodeList)) merged._NODE = newNodeList.length == 1 ? newNodeList[0] : newNodeList;
		if (!isEmpty(hereList)) {
			merged.here = hereList.length == 1 ? hereList[0] : hereList;
			if (nundef(n.data)) merged.type = 'invisible';
		}
		return recTree(merged, rParent, R, oid, key);
	}

	n1 = deepmergeOverride(n, n1);
	if (isdef(n1.sub)) delete n1.sub;
	n1.uid = uid;
	n1.uidParent = rParent ? rParent.uid : null;
	if (isdef(oid)) n1.oid = oid;

	let chProp = 'sub'; let chlist = n[chProp];
	if (isdef(chlist)) {
		n1.children = [];
		for (const chInfo of chlist) {
			let ch = recTree(chInfo, n1, R, oid, key);
			R.rNodes[ch.uid] = ch;
			n1.children.push(ch.uid);
		}
	}

	if (oid == '9') console.log('Board: recTree returns',jsCopy(n1))
	if (oid == '0') console.log('Member: recTree returns',jsCopy(n1))

	return n1;
}



















