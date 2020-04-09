var buildingProcess = null;
var B;
var autoplay = false;
async function run00(sp, data) {
	//testLookupSetOverride(sp);

	B = buildingProcess = new mBuildingProcess(sp, data, DEFS,
		'message', 'protos', 'dicts', 'forward', 'backward', 'tree', 'table1');
	//return;
	let stage = 0;
	while (true){ // != STAGES.backward && B.currentKey != 'p1') {
		stage = await onClickStep();
		//console.log(stage);
		if (!stage || stage == STAGES.backward);// && B.currentKey=='p1') break;
	}
	console.log('stage', findKey(STAGES, stage));
}

function evalCondAnnotate(sp,defaultPool) {
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


function recModifyTypelistToString(n) {
	console.log(n)
	if (isList(n)) { n.map(x => recModifyTypelistToString(x)); }
	else if (isDict(n)) {
		if (isdef(n.type)) { n.type = n.type.join(' '); }
		for (const k in n) { recModifyTypelistToString(n[k]); }
	}
}
