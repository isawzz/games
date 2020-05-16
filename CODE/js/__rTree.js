//rTree/rNodes is new generation!
function recTree(n, rParent, R, oid, key) {
	CYCLES += 1; if (CYCLES > MAX_CYCLES) return;
	console.log('***recBuildTree input:', '\nn', n, '\rParent', rParent)

	// let n1 = {uid:getUID(),uidParent:rParent ? rParent.uid : null};
	let expandProp = '_NODE'; let nodeName = n[expandProp];
	if (isString(nodeName)) {
		console.log('found _NODE', nodeName);
		console.log('_________________', '\nn', n)
		if (nundef(n.cond)) {
			let nSpec = R.lastSpec[nodeName];
			let merged = deepmerge(nSpec, n);

			delete merged._NODE;
			if (isdef(nSpec._NODE)) merged._NODE = nSpec._NODE;
			console.log('=>>merged', merged)
			return recTree(merged, rParent, R, oid, key);
			//n1=branch;
		} else {
			//TODO!!! wenn cond cases reinnehme
			//kann noch nicht mergen weil keine info ueber objects habe: spaeter!
			//trag irgendwie in loc ein
		}
	} else if (isList(nodeName)) {
		console.log('found _NODE list', nodeName);
		console.log('_________________', '\nn', n)
		let merged = {};
		let newNodeList = [];
		for (const name of nodeName) {
			if (nundef(n.cond)) {
				let nSpec = R.lastSpec[name];
				merged = deepmerge(merged, nSpec);
				if (isdef(nSpec._NODE)) addIf(newNodeList, nSpec._NODE); //TODO lists!
				console.log('=>>merged', merged)
			} else {
				//TODO!!! wenn cond cases reinnehme
				//kann noch nicht mergen weil keine info ueber objects habe: spaeter!
				//trag irgendwie in loc ein
			}

		}
		merged = deepmerge(merged, n);
		delete merged._NODE;
		if (!isEmpty(newNodeList)) merged._NODE = newNodeList;
		return recTree(merged, rParent, R, oid, key);
		//n1=branch;
	}

	let n1 = jsCopy(n);
	if (isdef(n1.sub)) delete n1.sub;
	n1.uid = getUID();
	n1.uidParent = rParent ? rParent.uid : null;
	if (isdef(oid)) n1.oid = oid;

	let chProp = 'sub'; let chlist = n[chProp];
	if (isdef(chlist)) {
		n1.children = [];
		let i = 0;
		for (const chInfo of chlist) {
			//let newPath = extendPath(path, i);
			i += 1;
			let ch = recTree(chInfo, n1, R, oid, key);
			R.rNodes[ch.uid] = ch;
			n1.children.push(ch.uid);
		}
	}

	console.log('***recBuildTree output:', '\nn1', n1)
	return n1;
}



















