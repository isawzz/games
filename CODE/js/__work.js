function instantOidKey(oid, key, uidParent, R) {
	console.log('*** instant *** oid', oid, 'key', key, 'uidParent', uidParent, 
	'\nrParent', R.rNodes[uidParent]);

	let rtreeParent = R.rNodes[uidParent];

	console.log('rTreeParent', rtreeParent);

	//how can I ever find out whether a node will have more than 1 child???
	//I cannot unless I compute all pools in before hand!

	if (nundef(rtreeParent.children)) { 
		rtreeParent.children = []; 
	}

	let n1 = recTree(R.lastSpec[key],rtreeParent,R,oid,key);
	R.rNodes[n1.uid]=n1;

	rtreeParent.children.push(n1.uid);
	
	return n1;

}



















