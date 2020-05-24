function addNewServerObjectToRsg(oid, o, R, skipEinhaengen = false) {
	if (oid == '146' || o.obj_type == 'robber') console.log('_____________ add object', oid, o);
	R.addObject(oid, o);
	R.addRForObject(oid);

	if (skipEinhaengen) { return false; }
	else { return einhaengen(oid, o, R); }
}
function addRForObject(oid, R) {
	let o = R.getO(oid);
	let sp = R.getSpec();

	//eval conds (without no_spec!)
	for (const k in sp) {
		let n = sp[k];
		if (nundef(n.cond)) continue;
		if (n.cond == 'all' || evalConds(o, n.cond)) { R.addR(oid, k); }
	}
	//check for no_spec clauses
	if (isEmpty(R.getR(oid))) {

		for (const k in sp) {
			let n = sp[k];
			if (nundef(n.cond)) continue;
			let keys = Object.keys(n.cond);
			if (!keys.includes('no_spec')) continue;
			let condCopy = jsCopy(n.cond);
			delete condCopy['no_spec'];
			if (evalConds(o, condCopy)) { R.addR(oid, k); }
		}
	}
}
