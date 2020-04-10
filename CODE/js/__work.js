var R=null;
function run02(sp, defaults, sdata) {
	R=new RSG(sp, defaults, sdata);

	//R has its own copy of all those 3 objects!
	R.gen1();

	//first, sources are made for each sp object


}

function evalCondAnnotate(sp, defSource) {
//example: defPool is sdata dict!
	for (const k in sp) {
		//console.log(k, sp[k]);

		let node = sp[k];
		node.pool = {};

		node.source = makeSource(sp,defSource,node._source);//determine source here!

	}
}
function makeDefaultPool(fromData) {
	let data = jsCopy(fromData.table);
	for (const k in fromData.players) {
		data[k] = jsCopy(fromData.players[k]);
	}
	return data;

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


function makeSource(sp,defSource,_source) {
	if (nundef(_source)) return defSource;

	let spNodeSource = sp[_source];
	if (nundef(spNodeSource.pool)){
		spNodeSource.pool = makePool(spNodeSource.cond,defSource)
	}
	let kpool = node._source ? node._source : 'augData';
	//console.log(kpool);
	if (nundef(POOLS[kpool])) {
		//_source has not been made!
		let pool = POOLS.augData;
		POOLS[kpool] = {};
		let node1 = sp[kpool];
		//console.log(node1);
		for (const oid in pool) {
			let o = pool[oid];
			//console.log('checking',oid)
			if (!evalCond(o, node1)) continue;
			//console.log('passed', oid);
			POOLS[kpool][oid] = o;
		}
	}
	return POOLS[kpool];
}


