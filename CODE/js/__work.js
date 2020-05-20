function instantOidKey(oid, key, uidParent, R) {
	//console.log('*** instant *** oid', oid, 'key', key, 'uidParent', uidParent, '\nrParent', R.rNodes[uidParent]);

	let rtreeParent = R.rNodes[uidParent];
	//console.log('rTreeParent', rtreeParent);

	if (nundef(rtreeParent.children)) { rtreeParent.children = []; }

	//=================================================
	if (oid == '9') console.log('Board: instantOidKey vor recTree call',oid,key,uidParent)
	if (oid == '0') console.log('Member: instantOidKey vor recTree call',oid,key,uidParent)


	let n1 = recTree(R.lastSpec[key], rtreeParent, R, oid, key);

	R.rNodes[n1.uid] = n1;
	lookupAddToList(R.rNodesOidKey, [oid, key], n1.uid); //not sure if need this!!!
	rtreeParent.children.push(n1.uid);

	return n1;

}



















