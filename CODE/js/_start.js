//#region globals, _start, gameStep
window.onload = () => _start();
var timit, G, PROTO, POOLS, sData;
var WR = {};
//var R=null; //just testing
//var NO={};
var phase = 0;

async function _start() {
	timit = new TimeIt('*timer', TIMIT_SHOW);
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
	gameStep();
}
async function gameStep() {
	await prelims();

	// G, PROTO, POOLS, SPEC, DEFS, sData(=POOLS[augData]) in place for parsing spec!

	//console.log('SPEC',SPEC);
	//console.log('DEFS',DEFS);
	//console.log('sData',sData);

	// run03(SPEC,DEFS,sData); //macht gens.G
	// setTimeout(onClickDO,500);

	runTest();
	//macht gens.G








}
//#endregion
function runTest() { run06(SPEC, DEFS, sData); }
function run06(sp, defaults, sdata) {
	WR.inc = R = new RSG(sp, defaults, sdata);
	ensureRtree(R); //make sure static tree has been built! OK!
	//updateOutput(R);
	R.baseArea = 'table';
	createStaticUi(R.baseArea, R);
	//updateOutput(R);
	addNewlyCreatedServerObjects(sdata, R);
	updateOutput(R);

	for(let i=0;i<5;i++) testAddObject(R);
	updateOutput(R);
	activateUis(R);
}

//#region frueher
function run05(sp, defaults, sdata) {
	WR.inc = R = new RSG(sp, defaults, sdata);
	ensureRtree(R); //make sure static tree has been built! 
	//addNewlyCreatedServerObjects(sdata,R);
	generateUis('table', R);
	updateOutput(R);
}
function run04(sp, defaults, sdata) {
	WR.G = R1 = new RSG(sp, defaults, sdata); // =>R.gens[0]...original spec
	genG('table', R1);
	setTimeout(() => binding01(WR.G), 500);
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
	//console.log('______ ROOT panels nach id/ref merging:');
	//console.log(R);
	//R.gens.G[4].ROOT.panels.map(x=>console.log(x));

	phase = 14;
	R.gen14(); // merges spec types =>spec type names disappear! =>R.gens.G[5]...merged!
	//NO, REVERTED!!! also: DParams added to each node (except grid type!), params merged w/ defs!s
	//showPanels(R.gens.G[5].ROOT);
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

	// console.log('______ final ROOT panels:')
	// showPanels(R.ROOT);
	// showChildren(R.ROOT);
	// console.log(R);
	//console.log('detectBoardParams1 has been called', countDetectBoardParamsCalls,'times!!!!!')

	//R.gen30(); //NOT IMPLEMENTED!!!

	presentRoot_dep(R.getSpec().ROOT, 'tree');
	//presentGenerations([0,4,5,6],'results',R);

	//presentGeneration(R.gens.G[0], 'results')


}



//showPanel, showChildren v0
function showPanels(n) {
	console.log('panels:')
	if (nundef(n.panels)) {
		console.log('NO PANELS!!!', n)
	} else if (isList(n.panels)) {
		n.panels.map(x => console.log(x));
	} else {
		console.log(n.panels);
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


//#endregion

//#region interaction restartGame prelims (von gameStep)
async function interaction() {
	await sendAction();
	gameStep();
}
async function restartGame() {
	await sendRestart();
	d3.select('button').text('NEXT MOVE').on('click', interaction);
	gameStep();
}
async function prelims() {

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
	G = {};
	PROTO = {};
	POOLS = { augData: makeDefaultPool(jsCopy(serverData)) }; //to be augmented w/o contaminating serverData

	//sData is a deep copy of serverData => confirm that!!!
	sData = POOLS.augData;

	presentSpecDataDefsAsInConfig(SPEC, sData, DEFS);

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
		presentDictTree(R.NodesByUid, R.tree.uid, 'rTree', 'children', R,
			['children'], null, null, { 'max-width': '35%', font: '14px arial' });
	}

	if (SHOW_OIDNODES) { presentOidNodes(R, 'oidNodes'); }

	if (SHOW_DICTIONARIES) {
		//mDictionary(R.NodesByUid, { dParent: mBy('dicts'), title: 'nodesByUid ' + Object.keys(R.NodesByUid).length });
		mDictionary(R.treeNodesByOidAndKey, { dParent: mBy('dicts'), title: 'treeNodesByOidAndKey ' + Object.keys(R.treeNodesByOidAndKey).length });
		mDictionary(R.LocToUid, { dParent: mBy('dicts'), title: 'locations ' + Object.keys(R.LocToUid).length });
	}

	// if (SHOW_RTREE) {
	// 	presentTree(R.tree,'children', 'tree', R, ['children']);
	// 	//for(const path in R.NodesByUid) presentAddNode(R.NodesByUid[path],'tree',['children'])
	// }

	let numRTree = Object.keys(R.NodesByUid).length;
	let numUiNodes = nundef(R.uiNodes) ? 0 : Object.keys(R.uiNodes).length;
	let handCounted = R.ROOT.data;
	// console.log('#soll=' + handCounted, '#rtree=' + numRTree, '#uiNodes=' + numUiNodes);
	console.assert(numRTree == numUiNodes, '!!!FEHLCOUNT!!! #rtree=' + numRTree+ ', #uiNodes=' + numUiNodes);



}

