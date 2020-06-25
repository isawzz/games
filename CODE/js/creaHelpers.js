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

//#region sieve oids with loc (einhaengen_ von server objects mit loc prop)
function calcCycles(R) {
	let oids = jsCopy(R.locOids);
	let cycles = R.partitions = {};
	let oid2partition = R.oid2partition = {};
	let cid;

	while (!isEmpty(oids)) {
		let oid = oids[0];
		cid = getUID();
		let c = cycles[cid] = { isCycle: false, oids: [] };
		while (true) {
			if (c.oids.includes(oid)) {
				c.isCycle = true;
				//console.log('found cycle!', c, oid);  
				break;
			}
			//console.log('add',oid)
			if (isdef(oid2partition[oid])) {
				//console.log(oid,cy, oid2partition)
				let cid2 = oid2partition[oid];
				let c2 = cycles[cid2];
				//cy2 and cy need to be joined!
				c.oids.map(x => oid2partition[x] = cid2);
				c2.oids = c.oids.concat(c2.oids);
				c = c2;
				delete cycles[cid];
				break;
			} else {
				c.oids.push(oid);
				oid2partition[oid] = cid;
			}
			//console.log(oids,oid); //da war irgendein BUG!!!!! TODO! jetzt is er weg!
			removeInPlace(oids, oid);
			let o = R.getO(oid);
			if (nundef(o.loc)) break;
			oid = o.loc;
		}
	}

	//sort cycles
	//if !isCycle need to reverse and remove first elem
	//otherwise, just reverse
	for (const k in R.partitions) {
		let c = R.partitions[k];
		//console.log('orig',jsCopy(c));
		c.oids.reverse();
		let removed;
		if (!c.isCycle) { removed=c.oids.shift(); }
		//console.log('wird:',c);
		//safety check! all cycle elements must have loc, removed one does NOT have loc!
		for(const oid of c.oids){
			if (nundef(R.getO(oid)).loc){
				alert('SORT CYCLES SAFETY CHECK FAILED! no loc in '+oid);
			}
		}
		if (isdef(removed && isdef(R.getO(removed)).loc)){
			alert('SORT CYCLES SAFETY CHECK FAILED! removed has loc'+removed);
		}

	}

}
function processLocOids(cycle, max_cycles, isCyclic, R) {
	if (isEmpty(cycle)) return;
	let cycles = 0;
	let locOids = cycle;
	if (isCyclic) {
		//console.log('serverdata CYCLIC!!!!!!!!!!!!!!!!!!', cycle)

		let i = 0; let top = null;
		while (isEmpty(top)) {
			let oid = cycle[i];
			top = einhaengen(oid, R.getO(oid), R);
			if (!isEmpty(top)) break;
			i += 1; if (i > cycle.length - 1) break;
		}
		//console.log('i is', i, '\ntop', top);
		if (i > cycle.length - 1) {
			//console.log('none of the locOids in', cycle, 'has a rep!');
			return;
		}
		locOids = jsCopy(cycle).rotate(i);
		//console.log('cycle orig:', cycle, 'shifted:', locOids);
	}

	//hier koennte nochmal max_cycles definieren, entweder nach starting oid 
	//oder nach node (in welchem fall ich aber einhaengen_ umdrehen muss!)

	//console.log('locOids', locOids)
	while (true) {
		cycles += 1;
		if (cycles > max_cycles) {
			//console.log('MAX_CYCLES reached!', cycles); 
			return;
		}

		let changed = false;
		for (const oid of locOids) {
			let top = einhaengen(oid, R.getO(oid), R);
			//console.log('oid', oid, '\ntop', top, '\noid2uids', R.oid2uids[oid]);
			if (!isEmpty(top)) { changed = true; } 
		}
		if (!changed) { break; }
	}
	//console.log('done after', cycles, 'cycles')
}
function sieveLocOids(R) {
	if (isEmpty(R.locOids)) return;

	calcCycles(R); //for all locOids that have not been added, calc cycles in order in which they can be added

	//*** have R.partitions, R.oid2partition, R.locOids
	for (const k in R.partitions) {
		let cycle = R.partitions[k];
		let max_cycles = cycle.isCycle ? DEFS.cycleLengthAllowed : 1;
		processLocOids(cycle.oids, max_cycles, cycle.isCycle, R);
	}
}


function parentHasChannelForThisOid(n, oid) {
	let channels = n.channels;
	if (nundef(channels)) return true; //per default ALL channels are valid!

}
function parentHasThisChildAlready(uidParent,oid){
	//console.log('parentHasThisChildAlready','uidParent',uidParent,'oid',oid);
	let n=R.rNodes[uidParent];
	if (nundef(n.children)) return false; //FOUND!
	let hasThisChild = false;
	for (const chuid of n.children) {
		//console.log('chuid',chuid,'uidParent',uidParent,'oid',oid);
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
	else return mergeOverrideArrays(a, b);
}

