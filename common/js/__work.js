var B;
var autoplay = false;

async function run01(sp, defaults, data) {




	// B = new mBuildingProcess(sp, data, defaults,
	// 	'message', 'protos', 'dicts', 'forward', 'backward', 'tree', 'table1');
	// let stage = 0;
	// while (true) { // != STAGES.backward && B.currentKey != 'p1') {
	// 	stage = await onClickStep();
	// 	//console.log(stage);
	// 	if (!stage || stage == STAGES.backward) break;// && B.currentKey=='p1') break;
	// }
	// console.log('stage', findKey(STAGES, stage));
}

function evalCondAnnotate(sp, defaultPool) {
	//test	let x=makePool(sp.all_viz_cards);	return;

	for (const k in sp) {
		//console.log(k, sp[k]);

		let node = sp[k];
		node.pool = [];

		//determine source here!
		let pool = makePool(node);

		for (const oid in pool) {

			let o = pool[oid];

			if (!evalCond(o, node)) continue;

			if (nundef(o.RSG)) o.RSG = {};
			let rsg = o.RSG;
			rsg[k] = true;
			node.pool.push(oid);

		}
	}
}
function makeDefaultPool(fromData) {
	let data = jsCopy(fromData.table);
	for (const k in fromData.players) {
		data[k] = jsCopy(fromData.players[k]);
	}
	return data;

}
function makePool(node) {
	let kpool = node._source ? node._source : 'augData';
	//console.log(kpool);
	if (nundef(POOLS[kpool])) {
		//_source has not been made!
		let pool = POOLS.augData;
		POOLS[kpool] = {};
		let node1 = SPEC.dynamicSpec[kpool];
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


