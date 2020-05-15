














function doExpands(n1, n,key,path, parent, sp, R, oid) {
	let expandProp = '_NODE'; //kommt nur von _id!!!! _ref node overrides id node normally!
	let nodeName = n[expandProp];
	if (nundef(nodeName)) return n1;

	if (isString(nodeName)) {
		let nSpec = R.lastSpec[nodeName];
		console.log('n',n,'\nnSpec',nSpec);
		if (nundef(nSpec.cond)) { // *** NO cond ***
			n = deepmerge(nSpec,n);
			delete n._NODE;
			console.log('result',n)
			//TODO: muss nSpec mit rest von diesem node (n,path) mergen!
			n1 = recBuildRTree(n, key, path, parent, sp, R, oid); //oder '.0'?
			n1 = branch; // safeMerge(branch,n1); // branch;
			lookupAddToList(R.Locations, [nodeName], n1.uid);
			R.rNodes[n1.uid] = branch;
		} else {
			//console.log('nSpec has cond, so children are not created right now!')
			lookupAddToList(R.Locations, [nodeName], n1.uid);
			n1.here = nodeName; 	//adds a 'here' for key
		}
	} 
	return n1;
}





