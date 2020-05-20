function recBuildRTree(n, key, path, parent, sp, R, oid) {
	CYCLES += 1; if (CYCLES > MAX_CYCLES) return;
	//console.log('***',n,path,parent,sp)
	let n1 = { uid: getUID(), key: key, uidParent: parent ? parent.uid : null, path: path };
	if (isdef(oid)) n1.oid = oid;

	let expandProp = '_NODE';	let nodeName = n[expandProp];
	if (isString(nodeName)) {
		let nSpec = sp[nodeName];
		if (nundef(nSpec.cond)) {
			let branch = recBuildRTree(nSpec, nodeName, '.', parent, sp, R, oid); //oder '.0'?
			n1 = branch;
			R.rNodes[n1.uid] = branch;
		} else {
			lookupAddToList(R.Locations, [nodeName], n1.uid);
			n1.here = nodeName; 	
		}
	} 

	let chProp = 'sub';	let chlist = n[chProp];
	if (isdef(chlist)) {
		n1.children = [];
		let i = 0;
		for (const chInfo of chlist) {
			let newPath = extendPath(path, i);
			i += 1;
			let ch = recBuildRTree(chInfo, key, newPath, n1, sp, R, oid);
			R.rNodes[ch.uid] = ch;
			n1.children.push(ch.uid);
		}
	}
	return n1;
}































