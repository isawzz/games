//#region helpers
function ensureUiNodes(R) { if (nundef(R.uiNodes)) R.uiNodes = {}; }

function evalSpecPath(n, relpath, R) {
	//return partial spec node under n, following relpath
	//console.log('__________ evalSpecPath: path', relpath, 'n', n);
	if (isEmpty(relpath)) return null;
	if (relpath == '.') return n;
	let iNext = firstNumber(relpath);

	nNext = n.sub[iNext];
	let newPath = stringAfter(relpath, '.' + iNext);
	if (isEmpty(newPath)) return nNext;
	else return evalSpecPath(nNext, newPath, R);
}


function parentHasChannelForThisOid(n, oid) {
	let channels = n.channels;
	if (nundef(channels)) return true; //per default ALL channels are valid!

}
//TODO: THIS IS INEFFICIENT!!!! checking twice!!! should already return parents here!!!
function find_next_loc_oid_with_new_parent(locOids, R) {

	//TODO!!! HIER MUSS ICH AUCH CHECKEN OB DER PARENT EINEN ENSPRECHENDEN CHANNEL HAT!!!!!
	//WENN NICHT DANN GILT DER PARENT NICHT!!!!!!!!!!!!!!!!!!!!!

	//console.log('find_next_loc_oid_with_new_parent', locOids);
	for (const oid of locOids) {
		let o = R.getO(oid); 
		let loc = o.loc;
		let oidParent = loc;

		let uidsParent=R.oid2uids[oidParent];
		console.log('parent',oidParent,'for oid='+oid,'has uids:',uidsParent);
		if (nundef(uidsParent)) continue;
		for(const uidParent of uidsParent){
			if (!parentHasThisChildAlready(uidParent,oid) && parentHasChannelForThisOid(R.rNodes[uidParent],oid)) return oid;
		}
		

		// for (const uid in R.rNodes) { //WOW! super inefficient!!!!
		// 	let n = R.rNodes[uid];
		// 	if (n.oid != oidParent || !parentHasChannelForThisOid(n, oid, R)) continue;
		// 	//console.log('parent for', oid, 'found:', uid, n.children);
			
		// 	if (!parentHasThisChildAlready(uid,oid)) return oid;
		// }
	}
	return null;
}
function parentHasThisChildAlready(uidParent,oid){
	let n=R.rNodes[uidParent];
	if (nundef(n.children)) return false; //FOUND!
	let hasThisChild = false;
	for (const chuid of n.children) {
		if (R.rNodes[chuid].oid == oid) { hasThisChild = true; break; }
	}
	return hasThisChild;

}
function isStatic(x) { let t = lookup(x, ['meta', 'type']); return t == 'static'; }
function isDynamic(x) { let t = lookup(x, ['meta', 'type']); return t == 'dynamic'; }
function isMap(x) { let t = lookup(x, ['meta', 'type']); return t == 'map'; }

function safeMerge(a, b) {
	if (nundef(a) && nundef(b)) return {};
	else if (nundef(a)) return jsCopy(b);
	else if (nundef(b)) return jsCopy(a);
	else return deepmergeOverride(a, b);
}

