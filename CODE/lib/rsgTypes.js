class RSG {
	constructor(sp, defs, sdata) {
		this.gens = [sp];
		this.sp = sp
		this.defs = defs;
		this.sData = sdata;
	}
	gen1() {
		[this.gen1, this.POOLS] = addSources(this);
		this.gens.push(this.gen1);
		console.log(this)
	}

}

function addSources(R) {

	let sp = jsCopy(R.sp);

	let pools = {}; //cache pools koennt ma auch an R anhaengen!!!

	//to each sp node add pool if does not have _source
	let missing = [];
	for (const k in sp) {
		let n = sp[k];
		console.log('node is', k, n)
		if (nundef(n._source)) {
			n.source = R.sData;

			pools[k] = n.pool = makePool(n.cond, n.source);
			// let cached = isdef(pools[k]);
			// n.pool = cached ? pools[k] : makePool(n.cond, n.source);
			// if (!cached) pools[k] = n.pool;

		} else missing.push(k);
	}

	console.log('missing', missing);
	let safe=10;
	while (missing.length > 0 ||safe<0) {
		safe-=1;
		//find key in missing for which 
		let done = null;
		for (const k of missing) {
			let node = sp[k];
			let sourceNode = sp[node._source];
			console.log('search', k, node._source);
			if (nundef(sourceNode.pool)) continue;

			node.source = sourceNode.pool;

			pools[k] = node.pool = makePool(node.cond, node.source);
			done = k;
			break;

		}
		removeInPlace(missing, done);
		console.log('missing', missing);
	}

	console.log('POOLS', pools);
	return [sp, pools];
}
// 	//now that have basic pools, add remaining pools based on _source property
// 	//invariants: 
// 	//	n1.source == sp[n1._source].pool
// 	//	n1.pool == eval n1.conds on n1.source
// 	let sp = this.sp;
// 	for (const n in sp) {
// 		if (isdef(n._source)) {

// 			n.source = null;
// 			let nSource = sp[n._source];
// 			while (nundef(nSource.pool)) nSource = sp[nSource._source];
// 			n.pool = makePool(n.cond, n.source);
// 		}
// 	}
// }

function makePool(cond, source) {
	if (nundef(cond)) return source;
	// console.log('cond', cond, 'source', source);
	let pool = {};
	for (const oid in source) {

		let o = source[oid];
		// console.log('o', o)
		if (!evalConds(o, cond)) continue;

		pool[oid] = o;
	}
	return pool;

}



















