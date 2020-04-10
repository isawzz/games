var B;
var autoplay = false;


async function run01(sp, defaults, sdata) {

	let rsg = new RSG(defaults);

	//what to do with this node?
	let node = sp.ROOT; //node={type: info,data:hallo}

	let nRes ={
		type: toList(node.type), //copy of type as list
		
		// cond: null, //object
		// _source: null, //rsg node to pull pool filtered by source from
		// // may change! therefore this should be a string
		// _id: [],
		// _ref: [],

		area:'table1', //name of domel
		host: mBy('table1'), //domel
		parent: null, //because ROOT of tree,
		//or node that has host as ui

		spName:'ROOT', //find self in sp.ROOT
		pool:[], //no associated serverData
		oid: null, //server object associated to this instance
		//(oids koennen sich aendern each round)
		data: node.data, //copy of data
		relevantProps: null, //properties that are in presentation here ??or at a child node??
		//(relevant props aendern sich NICHT!!!)
		//data could be path within that object!

		//ist nicht relevant props und data dasselbe????

		ui:null,//to be created by type class
		//using params and data+oid+relevantProps
		params:{bg:'blue',fg:'white'}, //defaults set for each type class
		// visual props either from node or defaults

		uid: getUID(), //unique id where node can be found in all nodes dict held by rsg
	};

	mTitledNode(nRes,'ROOT',mBy('table1'),['type','_id','_ref'],'node');

	//nRes.ui = 
	
	//let nResult = rsg.instantiate(node);
	//console.log('____________',nResult)

	// console.log(n, n.data, RTYPES[n.type]);
	// console.log('res', nResult);
	// nResult.present(n,'table1');
	//RTYPES[n.type]().present(n.data,'table1');

	//n.data='waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaas';
	//nResult.present(n,'table1');


}

function evalCondAnnotate(sp, defaultPool) {
	//test	let x=makePool(sp.all_viz_cards);	return;

	for (const k in sp) {
		//console.log(k, sp[k]);

		let node = sp[k];
		node.pool = [];

		//determine source here!
		let pool = makeSource(node);

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
function makeSource(node) {
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


