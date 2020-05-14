//#region globals, _start, gameStep
window.onload = () => _start();
var timit, sData, T;
var phase = 0;
var testEngine = null;

async function _start() {
	timit = new TimeIt('*timer', TIMIT_SHOW);
	testEngine = new TestEngine();
	await loadAssets();
	await loadGameInfo();
	await loadSpec();
	//await loadCode();
	await loadInitialServerData();

	// console.log(serverData)
	// for(const k in serverData.players){
	// 	console.log('====>',k,serverData.players[k])
	// }

	//prep ui
	d3.select('#bNextMove').text('NEXT MOVE').on('click', interaction);
	//mMinSize(mBy('table'),300,200);
	if (serverData.waiting_for) { await sendStatus(getUsernameForPlid(serverData.waiting_for[0])); }
	if (serverData.end) { d3.select('button').text('RESTART').on('click', restartGame); }
	timit.showTime('* vor package: *')

	//worldMap('OPPS'); 

	preProcessData();

	//have serverData (processed), SPEC, DEFS, [tupleGroups, boats only if serverData.options!]
	// TODO: here I could insert computing diffed serverData
	//serverData are the data sent by server (mit options,players,table)
	//sData are to be augmented server objects ({oid:o} for all players,table entries (copies))

	isTraceOn = SHOW_TRACE;
	sData = makeDefaultPool(jsCopy(serverData))

	//presentSpecDataDefsAsInConfig(SPEC, sData, DEFS);

	// SPEC, DEFS, sData in place for parsing spec!

	_entryPoint();
}
//#endregion
function _entryPoint() {
	//present00(DEFS,SPEC, sData);
	testEngine.init('btnTest', DEFS, present00)

	//console.log(normalizeUid('_23',23));
}
function present00(sp, defaults, sdata) {
	//localStorage.clear(); 
	T = R = new RSG(sp, defaults, sdata);
	// updateOutput(R);

	ensureRtree(R); //make sure static tree has been built! OK!
	// updateOutput(R);
	R.baseArea = 'table';
	createStaticUi(R.baseArea, R);
	updateOutput(R);
	//return;

	addNewlyCreatedServerObjects(sdata, R);
	updateOutput(R);

	for (let i = 0; i < 5; i++) testAddObject(R);
	updateOutput(R);
	activateUis(R);

	testEngine.verify(R)
	//console.log(R.tree);
	//normalizeObjectProp(R.tree,'uid',-20);
	//normalizeRTree(R)
}








//#region older run tests
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

//#region interaction restartGame (von gameStep)
async function interaction() {
	await sendAction();
	gameStep();
}
async function restartGame() {
	await sendRestart();
	d3.select('button').text('NEXT MOVE').on('click', interaction);
	gameStep();
}
//#endregion

function makeDefaultPool(fromData) {
	if (nundef(fromData) || isEmpty(fromData.table) && isEmpty(fromData.players)) return {};
	if (nundef(fromData.table)) fromData.table = {};
	let data = jsCopy(fromData.table);
	for (const k in fromData.players) {
		data[k] = jsCopy(fromData.players[k]);
	}
	//console.log('data',data)
	return data;
}
function updateOutput(R) {

	for (const area of ['spec', 'lastSpec', 'uiTree', 'rTree', 'oidNodes', 'dicts', 'refsIds']) { //'channelsStatic', 'channelsLive' 
		clearElement(area);
	}

	if (SHOW_SPEC) { presentNodes(R.sp, 'spec'); }

	if (SHOW_LASTSPEC) { presentNodes(R.lastSpec, 'lastSpec'); }

	if (SHOW_UITREE) {
		presentDictTree(R.uiNodes, R.tree.uid, 'uiTree', 'children', R,
			['children'],
			null,
			['ui', 'act', 'params', 'defParams', 'cssParams', 'typParams', 'stdParams'],
			// ['uid', 'adirty', 'type', 'data', 'content', 'uiType', 'oid', 'key', 'boardType'],
			// null,
			{ 'max-width': '35%', font: '14px arial' });
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
		//mDictionary(R.maps, { dParent: mBy('maps'), title: 'maps' });
	}

	if (SHOW_IDS_REFS) {
		// mDictionary(R._ids, { dParent: mBy('dicts'), title: '_ids ' + Object.keys(R._ids).length });
		mDictionary(R.places, { dParent: mBy('refsIds'), title: '_ids ' + Object.keys(R.places).length });
		mDictionary(R.refs, { dParent: mBy('refsIds'), title: '_refs ' + Object.keys(R.refs).length });
		// mDictionary(R._refs, { dParent: mBy('dicts'), title: '_refs ' + Object.keys(R._refs).length });
		//mDictionary(R.rNodes, { dParent: mBy('dicts'), title: 'rNodes ' + Object.keys(R.rNodes).length });
		//mDictionary(R.channels, { dParent: mBy('maps'), title: 'static channels' });
		//mDictionary(R.live, { dParent: mBy('maps'), title: 'live channels' });
	}
	// if (SHOW_CHANNELSSTATIC) {
	// 	//mDictionary(R.rNodes, { dParent: mBy('dicts'), title: 'rNodes ' + Object.keys(R.rNodes).length });
	// 	mDictionary(R.channels, { dParent: mBy('channelsStatic'), title: 'static channels' });
	// }
	// if (SHOW_CHANNELSLIVE) {
	// 	//mDictionary(R.rNodes, { dParent: mBy('dicts'), title: 'rNodes ' + Object.keys(R.rNodes).length });
	// 	mDictionary(R.live, { dParent: mBy('channelsLive'), title: 'live channels' });
	// }
	if (nundef(R.rNodes)) return;
	let numRTree = Object.keys(R.rNodes).length;
	let numUiNodes = nundef(R.uiNodes) ? 0 : Object.keys(R.uiNodes).length;
	let handCounted = R.ROOT.data;
	// console.log('#soll=' + handCounted, '#rtree=' + numRTree, '#uiNodes=' + numUiNodes);
	console.assert(numRTree == numUiNodes, '!!!FEHLCOUNT!!! #rtree=' + numRTree + ', #uiNodes=' + numUiNodes);



}

