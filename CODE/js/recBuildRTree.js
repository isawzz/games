
function recBuildRTree(n, key, path, parent, sp, R,oid) {
	//console.log('***',n,path,parent,sp)
	//WORKING WITH NORMALIZED SPEC!!!! (only sub and panel)
	let n1 = { uid: getUID(), key: key, uidParent: parent ? parent.uid : null, path: path };
	if (isdef(oid)) n1.oid = oid;

	let locProp = '_id';
	let nodeName = n[locProp];
	if (isString(nodeName)) {
		//console.log('found key', nodeName);
		lookupAddToList(R.Locations, [nodeName], n1.uid);
		n1.here = nodeName; 	//adds a 'here' for key

		//hier muesst ich checken fuer static key!
		let nSpec = sp[nodeName];
		if (nundef(nSpec.cond)) {
			let branch = recBuildRTree(nSpec, nodeName, '.', n1, sp, R,oid); //oder '.0'?
			R.rNodes[branch.uid] = branch;
			n1.children = [branch.uid];
		} else {
			//console.log('nSpec has cond, so children are not created right now!')
		}
	}

	let chProp = 'sub';
	let chlist = n[chProp];
	if (isdef(chlist)) {
		n1.children = [];
		let i = 0;
		for (const chInfo of chlist) {
			let newPath = extendPath(path, i);
			i += 1;
			let ch = recBuildRTree(chInfo, key, newPath, n1, sp, R,oid);
			R.rNodes[ch.uid] = ch;
			n1.children.push(ch.uid);
		}
	}
	return n1;
}






























