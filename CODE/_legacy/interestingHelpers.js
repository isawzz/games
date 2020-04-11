//#region functions that are deprecated but code might be reused
function presentObjectAsYamlIf(o, outerContName, innerContName, cond) {
	//von frueher:
	// let d = mBy('SERVERDATA');
	// if (d && SHOW_SERVERDATA) { d.innerHTML = '<pre>' + jsonToYaml(sData) + '</pre>'; }
	// else {hide('contSERVERDATA');}

	let d = mBy(innerContName);
	if (d && cond) { d.innerHTML = '<pre>' + jsonToYaml(o) + '</pre>'; }
	else { hide(outerContName); }

}

function evalCondAnnotate(sp, defSource) {
	//example: defPool is sdata dict!
	for (const k in sp) {
		//console.log(k, sp[k]);

		let node = sp[k];
		node.pool = {};

		node.source = makeSource(sp, defSource, node._source);//determine source here!

	}
}
function makeSource(sp, defSource, _source) {
	if (nundef(_source)) return defSource;

	let spNodeSource = sp[_source];
	if (nundef(spNodeSource.pool)) {
		spNodeSource.pool = makePool(spNodeSource.cond, defSource)
	}
	let kpool = node._source ? node._source : 'augData';
	//console.log(kpool);
	if (nundef(POOLS[kpool])) {
		//_source has not been made!
		let pool = POOLS.augData;
		POOLS[kpool] = {};
		let n1 = sp[kpool];
		//console.log(n1);
		for (const oid in pool) {
			let o = pool[oid];
			//console.log('checking',oid)
			if (!evalCond(o, n1)) continue;
			//console.log('passed', oid);
			POOLS[kpool][oid] = o;
		}
	}
	return POOLS[kpool];
}



























