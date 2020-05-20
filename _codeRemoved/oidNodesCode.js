class RSG_removed{
	genNODE(genKey = 'G') {
		let gen = jsCopy(this.lastSpec);

		for (const k in gen) {
			//usage: safeRecurse(o, func, params, tailrec) 
			safeRecurse(gen[k], normalizeToList, '_NODE', true);
		}

		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		this.ROOT = gen.ROOT;
		//console.log(gen)
	}

	check_prop(prop, specKey, node, R) {
		let dictIds = {};
		recFindExecute(node, prop, x => { dictIds[x[prop]] = x; });

		//console.log(dictIds);
		return dictIds;
	}

}

//#region helpers to compare oidNodes to R.getR
function oidNodesSame(oid,R){
	let rsg=R.getR(oid);
	let keys = getOidNodeKeys(oid,R);
	return sameList(rsg,keys);
}
function getOidNodeKeys(oid,R){
	let d = R.oidNodes[oid];
	if (nundef(d)) return [];
	let res=[];
	for(const k in d)res.push(d[k].key);
	return res;
}

//#region dynamic: create oidNodes for R._sd.rsg
function createPrototypesForOid(oid, o, R) {
	//console.log('createPrototypesForOid',oid,o.obj_type)
	if (isdef(R.oidNodes[oid])) {
		//console.log('prototypes for', oid, 'already created!');
		return;
	}
	let klist = R.getR(oid);
	//console.log('klist',klist)
	let nlist = {};
	for (const k of klist) {
		let n1 = createProtoForOidAndKey(oid, o, k, R);
		nlist[k] = n1;
	}
	R.oidNodes[oid] = nlist;
}
function createProtoForOidAndKey(oid, o, k, R) {
	let n = R.getSpec(k);
	let n1 = { key: k, oid: oid, uid: getUID() };
	return n1;
}

//#region older _start: run tests
function run05(sp, defaults, sdata) {
	R = new RSG(sp, defaults, sdata);
	ensureRtree(R); //make sure static tree has been built! 
	//addNewlyCreatedServerObjects(sdata,R);
	generateUis('table', R);
	updateOutput(R);
}
function run04(sp, defaults, sdata) {
	T = new RSG(sp, defaults, sdata); // =>R.gens[0]...original spec
	genG('table', R1);
	setTimeout(() => binding01(T), 500);
}
function genG(area, R) {
	console.log('before gen10 habe', R.gens.G.length, R.getSpec());
	R.gen10(); // sources pools
	R.gen11(); // make ROOT single(!) panel
	R.gen12(); // creates places & refs, adds specKey
	R.gen13(); // merges _ref, _id nodes
	R.gen14(); // merges spec types 
	R.gen21(area);// expands dyn root, creates 1 node for each ui and uis

	presentRoot_dep(R.getSpec().ROOT, 'tree');
	//presentGenerations([0,4,5,6],'results',R);
	//presentGeneration(R.gens.G[0], 'results')
}
function run03(sp, defaults, sdata) {

	//console.log(sdata)
	R = new RSG(sp, defaults, sdata); // =>R.gens[0]...original spec

	console.log('before gen10 habe', R.gens.G.length, R.getSpec());

	phase = 1013;

	R.gen10(); //addSourcesAndPools // =>R.gens.G[1]...spec w/ pool,source, o._rsg
	//console.log(R.lastSpec.ROOT);

	R.gen11(); // make ROOT single(!) panel =>R.gens.G[2]... ROOT well-defined

	R.gen12(); // creates places & refs, adds specKey ==>R.gens.G[3]...specKey

	R.gen13(); // merges _ref, _id nodes (_id & _ref) disappear? =>R.gens.G[4]...merged!
	//console.log(jsCopy(R.lastSpec));
	//console.log('______ ROOT sub nach id/ref merging:');
	//console.log(R);
	//R.gens.G[4].ROOT.sub.map(x=>console.log(x));

	phase = 14;
	R.gen14(); // merges spec types =>spec type names disappear! =>R.gens.G[5]...merged!
	//NO, REVERTED!!! also: DParams added to each node (except grid type!), params merged w/ defs!s
	//showsub(R.gens.G[5].ROOT);
	//showChildren(R.gens.G[5].ROOT);

	//gen15 GEHT SO NICHT!!!!!!!!!!!!!!!!!!!!!
	// phase = 15;
	// //ne, das ist alles mist!!!!!!!!!!!! kann nicht einfach mergen!!!!
	// R.gen15();
	// console.log(R.oidNodes)

	//phase = 20;
	//R.gen20(); //expand static roow

	phase = 21;

	R.gen21('table');// expands dyn root, creates 1 node for each ui and uis

	// console.log('______ final ROOT sub:')
	// showsub(R.ROOT);
	// showChildren(R.ROOT);
	// console.log(R);
	//console.log('detectBoardParams1 has been called', countDetectBoardParamsCalls,'times!!!!!')

	//R.gen30(); //NOT IMPLEMENTED!!!

	presentRoot_dep(R.getSpec().ROOT, 'tree');
	//presentGenerations([0,4,5,6],'results',R);

	//presentGeneration(R.gens.G[0], 'results')


}
function showsub(n) {
	console.log('sub:')
	if (nundef(n.sub)) {
		console.log('NO sub!!!', n)
	} else if (isList(n.sub)) {
		n.sub.map(x => console.log(x));
	} else {
		console.log(n.sub);
	}
}
function showChildren(n) {
	console.log('children:')
	if (nundef(n.children)) {
		console.log('NO Children!!!', n)
	} else if (isList(n.children)) {
		n.children.map(x => console.log(x));
	} else {
		console.log(n.children);
	}
}
function updateOutput_dep(R) {

	for (const area of ['spec', 'uiTree', 'rTree', 'oidNodes', 'dicts']) {
		clearElement(area);
	}

	if (SHOW_SPEC) { presentNodes(R.lastSpec, 'spec'); }

	if (SHOW_UITREE) {
		presentDictTree(R.uiNodes, R.tree.uid, 'uiTree', 'children', R,
			['children'],
			// ['uid', 'adirty', 'type', 'data', 'content', 'params', 'uiType', 'oid', 'key', 'boardType'],
			['uid', 'adirty', 'type', 'data', 'content', 'uiType', 'oid', 'key', 'boardType'],
			null,
			{ 'max-width': '35%', font: '14px arial' });
		//not: ui, act, uid, info, defParams, cssParams, typParams, stdParams, bi
	}

	if (SHOW_RTREE) {
		presentDictTree(R.rNodes, R.tree.uid, 'rTree', 'children', R,
			['children'], null, null, { 'max-width': '35%', font: '14px arial' });
	}

	if (SHOW_OIDNODES) { presentOidNodes(R, 'oidNodes'); }

	if (SHOW_DICTIONARIES) {
		//mDictionary(R.rNodes, { dParent: mBy('dicts'), title: 'rNodes ' + Object.keys(R.rNodes).length });
		mDictionary(R.rNodesOidKey, { dParent: mBy('dicts'), title: 'rNodesOidKey ' + Object.keys(R.rNodesOidKey).length });
		mDictionary(R.Locations, { dParent: mBy('dicts'), title: 'locations ' + Object.keys(R.Locations).length });
	}

	// if (SHOW_RTREE) {
	// 	presentTree(R.tree,'children', 'tree', R, ['children']);
	// 	//for(const path in R.rNodes) presentAddNode(R.rNodes[path],'tree',['children'])
	// }

	let numRTree = Object.keys(R.rNodes).length;
	let numUiNodes = nundef(R.uiNodes) ? 0 : Object.keys(R.uiNodes).length;
	let handCounted = R.ROOT.data;
	// console.log('#soll=' + handCounted, '#rtree=' + numRTree, '#uiNodes=' + numUiNodes);
	console.assert(numRTree == numUiNodes, '!!!FEHLCOUNT!!! #rtree=' + numRTree + ', #uiNodes=' + numUiNodes);



}
//#endregion

//#region merging
function mergeChildrenWithRefs(n, R) {
	for (const k in n) {
		//muss eigentlich hier nur die containerProp checken!
		let ch = n[k];
		if (nundef(ch._id)) continue;

		let loc = ch._id;
		//console.log('node w/ id', loc, ch);
		//console.log('parent of node w/ id', loc, jsCopy(n));

		//frage is container node n[containerProp] ein object (b) oder eine list (c)?
		//oder ist _id at top level (n._id) =>caught in caller


		let refs = R.refs[loc];
		if (nundef(refs)) continue;

		//have refs and ids to 1 _id location loc (A)
		//console.log('refs for', loc, refs);

		//parent node is 


		let spKey = Object.keys(refs)[0];
		let nSpec = R.lastSpec[spKey];
		//console.log('nSpec', nSpec);
		let oNew = deepmerge(n[k], nSpec);
		//console.log('neues child', oNew);
		n[k] = oNew;


	}
}
function mergeAllRefsToIdIntoNode(n, R) {
	//n has prop _id
	let loc = n._id;
	let refDictBySpecNodeName = R.refs[loc];
	let nNew = jsCopy(n); //returns new copy of n TODO=>copy check when optimizing(=nie?)
	for (const spNodeName in refDictBySpecNodeName) {
		let reflist = refDictBySpecNodeName[spNodeName];
		for (const ref of reflist) {
			nNew = deepmergeOverride(nNew, ref);
		}
	}
	return nNew;
	//console.log(refDictBySpecNodeName);
}















