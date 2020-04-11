class RSG {
	constructor(sp, defs, sdata) {
		this.gens = [sp];
		this.sp = sp;
		this.defs = defs;
		this.sData = sdata;
	}
	gen1() {
		let [gen,pools]=addSourcesAndPools(this);
		
		this.addedData={};
		for(const k in gen){
			let n=gen[k];
			for(const oid in n.pool){
				let o=n.pool[oid];
				if (nundef(o._rsg)) o._rsg={};
				let entry={data:n.data};
				o._rsg[k]=entry;
				lookupSet(this.addedData,[oid,'_rsg',k],entry);

			}
		}

		this.gens.push(gen);
		this.POOLS=pools;
	}
	lastGen(){return last(this.gens);}

}

function addSourcesAndPools(R) {

	let sp = jsCopy(R.sp);
	let pools = {}; //cache pools koennt ma auch an R anhaengen!!!

	//to each sp node add pool if does not have _source
	let missing = [];
	for (const k in sp) {
		let n = sp[k];
		//console.log('node is', k, n)
		if (nundef(n._source)) {
			n.source = R.sData;
			pools[k] = n.pool = makePool(n.cond, n.source);
		} else missing.push(k);
	}

	//console.log('missing', missing);
	//let safe = 10;
	while (missing.length > 0){ // || safe < 0) {
		//safe -= 1;

		//find key in missing for which 
		let done = null;
		for (const k of missing) {
			let node = sp[k];
			let sourceNode = sp[node._source];
			//console.log('search', k, node._source);
			if (nundef(sourceNode.pool)) continue;

			node.source = sourceNode.pool;
			pools[k] = node.pool = makePool(node.cond, node.source);
			done = k;
			break;

		}
		removeInPlace(missing, done);
		//console.log('missing', missing);
	}

	//console.log('POOLS', pools);
	return [sp, pools];
}

//#region helpers
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
function evalCond(o,condKey,condVal){
	let func = 	FUNCTIONS[condKey];
	if (isString(func)) func = window[func];
	if (nundef(func)) return false;
	return func(o, condVal);
}
function evalConds(o,conds){
	for(const [f,v] of Object.entries(conds)){
		if (!evalCond(o,f,v)) return false;
	}
	return true;
}



















