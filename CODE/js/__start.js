//#region globals, _start, gameStep
window.onload = () => _start();
var timit, sData, T;
var phase = 0;
var testEngine = null;
var maxZIndex = 10;


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

	_entryPoint(DEFS, SPEC, sData);
}
//#endregion

async function _entryPoint(defs, spec, sdata) {

	//initPosArray(10, 10); console.log(randomPos()); return;

	//testCreateDivWithDivFixedSize(); return;
	onClickNextTestOfSeries(); return;

	//testAbsolutePositioning();return;
	//testRelativePositioning(); return;
	//await testAblauf02(defs,spec,sdata);return;
	//await testAblauf00(defs,spec,sdata);return;
	//testComposeShapesAndResize();
	//return;

	//let x = recListToString([[0,1,2],4,[5,6,7]]);
	//console.log('x',x)

	//testGetElements();
	//testSolutionConverter();	return;
	//present00(DEFS,SPEC, sData);
	//localStorage.clear();
	//console.log(sdata);
	//return;
	//deepmergeTestArray(); return;

	// console.log('test1',isMergeableObject({})); // true
	// console.log('test1',isMergeableObject([])); // true
	// console.log('test1',isMergeableObject('hallo')); // false
	// console.log('test4',!{a:'hallo'}.b); // true
	// console.log('test4',{a:'hallo'}.a); // hallo
	//let x='wer_-34';	let y=firstNumber(x);	console.log('___________TEST!',x,y,y+100)



	await testEngine.init(defs, sdata, TEST_SERIES);

	//console.log('_______________',testEngine.sdata);

	await present00(testEngine.spec, testEngine.defs, testEngine.sdata);

}
async function present00(sp, defaults, sdata) {
	T = R = new RSG(sp, defaults, sdata);

	//creation sequence:
	//wann und wie wird start channels bestimmt?
	//lets do that hardcoded for now!
	R.initialChannels = []; //do not provide anything here or ALL tests before 04 will fail!!!!
	//console.log(R)
	ensureRtree(R);

	R.baseArea = 'basediv';
	createStaticUi(R.baseArea, R);

	addNewlyCreatedServerObjects(sdata, R);

	//recAdjustDirtyContainers(R.tree.uid, R, true);

	recMeasureOverride(R.tree.uid, R);

	//output and testing
	updateOutput(R);

	//for (let i = 0; i < 5; i++) testAddObject(R);
	//updateOutput(R);
	//activateUis(R);

	testEngine.verify(R);

	//setTimeout(onClickResizeBoard,500);

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
function clearUpdateOutput() {
	for (const area of ['spec', 'lastSpec', 'uiTree', 'rTree', 'oidNodes', 'dicts', 'refsIds']) { //'channelsStatic', 'channelsLive' 
		if (isdef(mBy(area))) clearElement(area);
	}
	if (OUTPUT_EACH_SPEC_STEP) {
		let d = mBy('contSpec');
		let b = d.children[0];
		clearElement(d);
		d.appendChild(b);
	}
}
function updateOutput(R) {
	clearUpdateOutput();
	if (isEmpty(R)) {
		console.log('no data available!');
		return;
	}

	if (SHOW_SPEC) {

		if (OUTPUT_EACH_SPEC_STEP) {
			SHOW_LASTSPEC = false;
			let num = R.gens.G.length;
			//console.log('there are', num, 'gens!!!');
			let d = mBy('contSpec');
			let b = d.children[0];
			clearElement(d);
			d.appendChild(b);
			//console.log('first child of d contSpec is', b);
			for (let i = 1; i <= num; i++) {
				let d1 = mDiv(d);
				mClass(d, 'flexWrap');
				d1.id = 'spec' + i;
				let o = R.gens.G[i - 1];
				mDictionary(o, { dParent: d1, title: 'gen' + i + ': ' + Object.keys(o).length });
				//presentNodes(R.gens.G[i-1], d1.id, ['_NODE']);
			}

		} else presentNodes(R.sp, 'spec', ['_NODE']);
	}

	if (SHOW_LASTSPEC) { presentNodes(R.lastSpec, 'lastSpec', ['_NODE']); }

	if (SHOW_RTREE) {
		presentDictTree(R.rNodes, R.tree.uid, 'rTree', 'children', R,
			['children'], null, ['info'], { 'max-width': '35%', font: '14px arial' });
	}

	if (SHOW_UITREE) {
		presentDictTree(R.uiNodes, R.tree.uid, 'uiTree', 'children', R,
			['children'],
			// null, //show
			// ['ui', 'ui_bg', 'act', 'bi', 'info', 'params', 'defParams', 'cssParams', 'typParams', 'stdParams'], //omit
			['uid', 'pos', 'size', 'uidParent'],//,'params'],
			//['uid', 'size', 'rcenter','oid','params', 'uidParent', 'type', 'uiType', 'sizeMeasured', 'sizeAvailable', 'sizeNeeded','rpos','apos','acenter'], //show
			null, //omit
			{ 'max-width': '35%', font: '14px arial' });
	}

	if (SHOW_OIDNODES) { presentOidNodes(R, 'oidNodes'); }

	if (SHOW_DICTIONARIES) {
		//mDictionary(R.rNodes, { dParent: mBy('dicts'), title: 'rNodes ' + Object.keys(R.rNodes).length });
		//mDictionary(R.rNodesOidKey, { dParent: mBy('dicts'), title: 'rNodesOidKey ' + Object.keys(R.rNodesOidKey).length });
		mDictionary(R.Locations, { dParent: mBy('dicts'), title: 'locations ' + Object.keys(R.Locations).length });
		//mDictionary(R.maps, { dParent: mBy('maps'), title: 'maps' });
	}

	if (SHOW_IDS_REFS) {
		if (isdef(R.orig_places)) mDictionary(R.orig_places, { dParent: mBy('refsIds'), title: 'orig_ids ' + Object.keys(R.orig_places).length });
		if (isdef(R.orig_refs)) mDictionary(R.orig_refs, { dParent: mBy('refsIds'), title: 'orig_refs ' + Object.keys(R.orig_refs).length });

		mDictionary(R.places, { dParent: mBy('refsIds'), title: '_ids ' + Object.keys(R.places).length });
		mDictionary(R.refs, { dParent: mBy('refsIds'), title: '_refs ' + Object.keys(R.refs).length });

	}
	// if (SHOW_CHANNELSSTATIC) {
	// 	//mDictionary(R.rNodes, { dParent: mBy('dicts'), title: 'rNodes ' + Object.keys(R.rNodes).length });
	// 	mDictionary(R.channels, { dParent: mBy('channelsStatic'), title: 'static channels' });
	// }
	// if (SHOW_CHANNELSLIVE) {
	// 	//mDictionary(R.rNodes, { dParent: mBy('dicts'), title: 'rNodes ' + Object.keys(R.rNodes).length });
	// 	mDictionary(R.live, { dParent: mBy('channelsLive'), title: 'live channels' });
	// }

	// if (nundef(R.rNodes)) return;
	// let numRTree = Object.keys(R.rNodes).length;
	// let numUiNodes = nundef(R.uiNodes) ? 0 : Object.keys(R.uiNodes).length;
	// let handCounted = R.ROOT.data;

	// console.log('#soll=' + handCounted, '#rtree=' + numRTree, '#uiNodes=' + numUiNodes);
	//console.assert(numRTree == numUiNodes, '!!!FEHLCOUNT!!! #rtree=' + numRTree + ', #uiNodes=' + numUiNodes);



}

