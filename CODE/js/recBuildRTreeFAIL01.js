function recBuildRTree(n, key, path, parent, sp, R, oid) {
	CYCLES += 1; if (CYCLES > MAX_CYCLES) return;
	//console.log('***',n,path,parent,sp)
	let n1 = { uid: getUID(), key: key, uidParent: parent ? parent.uid : null, path: path };
	if (isdef(oid)) n1.oid = oid;

	//mixins
	

	//n1 = doExpands(n1, n,key,path, parent, sp, R, oid);

	//jetzt hab ich den n1 node aber ohne das _key
	//n1=do_key(n1,n,parent,sp,R,oid);
	// let x=findAddress(key,n,path);
	// if (n._NODE) console.log('___________',n._NODE,key,n,path,x);
	//x muss noch dazu gemerged werden!


	let chProp = 'sub';
	let chlist = n[chProp];
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






























