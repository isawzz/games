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

	_entryPoint(DEFS,SPEC, sData);
}
//#endregion
async function _entryPoint(defs,spec, sdata) {
	//testSolutionConverter();	return;
	//present00(DEFS,SPEC, sData);
	//localStorage.clear();
	//console.log(sdata);
	//return;

	await testEngine.init(defs,sdata,TEST_SERIES);
	await present00(testEngine.spec,testEngine.defs,testEngine.sdata);

}
async function present00(sp, defaults, sdata) {
	T = R = new RSG(sp, defaults, sdata);

	//creation sequence:
	ensureRtree(R); 

	R.baseArea = 'table';
	createStaticUi(R.baseArea, R);

	addNewlyCreatedServerObjects(sdata, R);

	recAdjustDirtyContainers(R.tree.uid, R, true);

	//output and testing
	updateOutput(R);

	//for (let i = 0; i < 5; i++) testAddObject(R);
	//updateOutput(R);
	//activateUis(R);

	testEngine.verify(R);

}









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

	if (SHOW_SPEC) { presentNodes(R.sp, 'spec', ['_NODE']); }

	if (SHOW_LASTSPEC) { presentNodes(R.lastSpec, 'lastSpec', ['_NODE']); }

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
	//console.assert(numRTree == numUiNodes, '!!!FEHLCOUNT!!! #rtree=' + numRTree + ', #uiNodes=' + numUiNodes);



}

