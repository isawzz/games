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

