//#region globals, _start, gameStep
//window.onload = () => _start();
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
	//timit.showTime('* vor package: *')

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

	//let x=stringBetween('hallo das ist gut',' ');
	//x=stringBetweenLast('hallo das ist gut',' ');
	//console.log(x.length, x);
	//await createIndexDoc(); return;
	
	//testDocumentVault(); return;
	//testDocumentFile();return;
	//downloadTextFile('hallo','hallo'); return;
	//downloadHtmlFile('<html><body>hallo</body></html>','hallo'); return;

	//testObjectWithUiAndClasses(); return;
	//testCenteredNode(); //return;
	//testVCentered();return;


	//let isSpecial = tossCoin(25);	console.log('outcome 25',isSpecial); return;
	//await testCardDraw52();
	//let c = cardFace({rank:'K'},35,55);	console.log(c); return;

	//let c=genCard(); console.log(c);return;

	// let mapData;let topcols;
	// [mapData, topcols] = genMapData(3, 1, 'reghex',['W','Y','B','O','S']);
	// console.log('map 1,3',mapData);
	// [mapData, topcols] = genMapData(3, 3, 'reghex',['W','Y','B','O','S']);
	// console.log('map 3,3',mapData);
	// [mapData, topcols] = genMapData(5, 3, 'reghex',['W','Y','B','O','S']);
	// console.log('map 5,3',mapData);
	// [mapData, topcols] = genMapData(5, 2, 'reghex', ['W','Y','B','O','S']);
	// console.log('map 5,3',mapData);
	// return;

	// console.log(reverseString('na geh'))
	// let s='hallo';	let sr=toLetterList(s).reverse().join('');	console.log(s,sr); return;
	// let lst=toLetterList('hallo');console.log(lst);return;
	// let o={b:1,a:4,c:5};	let x=Object.keys(o).reverse();	console.log(x); return;
	// let o1=sortKeysNonRecursiveDescending(o);	console.log('o',o1); return;

	//let gr=new SimpleGrid('g1',{rows:5,cols:3,hasEdges:true,hasNodes:true,randomizeIds:true});
	//console.log(gr);
	//console.log('comp_:',comp_(1,2,3))
	//catan00();
	//return;
	//let x=normalizeDict({_23:'bla',_28:'blabla'});console.log('result',x);return;

	if (OPEN_MAIN) showMenu('main');
	if (OPEN_TEST) showMenu('test');
	if (OPEN_OTHER) showMenu('other');
	if (OPEN_INTERACT) showMenu('interact');
	await testEngine.init(defs, sdata, TEST_SERIES, TEST_INDEX);
	iTEST = isdef(iTEST) ? iTEST : Object.keys(ALLTESTS[iTESTSERIES]).length - 1;
	//console.log('series', iTESTSERIES, 'case', iTEST, ALLTESTS[iTESTSERIES])

	if (RSG_SOURCE == 'test') {
		onClickNextTestOfSeries();
	} else if (RSG_SOURCE == 'direct') {
		//console.log('------------------hallooooooooo')
		await testPicto(20, {
			ROOT: { _NODE: 'pics', params: { orientation: 'h' } },
			pics: { cond: 'all', data: '.key', type: 'picto', params: { margin: 4 } }
		}, genServerDataPicto);

		// await testCardsUni(2, {
		// 	ROOT: { _NODE: 'cards', type: 'hand' },
		// 	cards: { cond: 'all', data: '.cardKey', type: 'card52' }
		// }, genServerDataCards52);

		// await testCardsUni(5,{
		// 	ROOT: { _NODE: 'cards', params:{orientation:'h'} },
		// 	cards: { cond: 'all', data: '.cardKey', type: 'card52' }
		// }, genServerDataCards52);

		//await testCard();

		//await testCardHorizontal();

		// await testGeneralBoard(2, 2, 'quad', true, true,
		// 	{
		// 		fieldContent: { a: 'ja', b: 'nein' },
		// 		// nodeContent: { a: 'ja', b: 'nein' },
		// 		// edgeContent: { a: 'ja', b: 'nein' }
		// 	});

		//await testTtt(4,4);

		//await testCatan(3,1);
	} else {
		//console.log('hallooooooooooooooo')
		//[sp, defs, sdata] = [testEngine.spec, testEngine.defs, testEngine.sdata];
		await rParse(RSG_SOURCE, { defs: testEngine.defs, spec: testEngine.spec, sdata: testEngine.sdata });
		// await testEngine.init(defs, sdata, TEST_SERIES);
		// await present00_(testEngine.spec, testEngine.defs, testEngine.sdata);
	}

	//rParse(RSG_SOURCE,)

	//initPosArray_(10, 10); console.log(randomPos()); return;

	//testCreateDivWithDivFixedSize(); return;


	//await testAblauf02(defs,spec,sdata);return;
	//await testAblauf00(defs,spec,sdata);return;
	//testComposeShapesAndResize();
	//return;

	//let x = recListToString([[0,1,2],4,[5,6,7]]);
	//console.log('x',x)

	//testGetElements();
	//testSolutionConverter();	return;
	//present00__(DEFS,SPEC, sData);
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

	let numNodes = Object.keys(R.rNodes).length;
	//console.log(numNodes)

	if (numNodes <= 200 && SHOW_RTREE) {
		presentDictTree(R.rNodes, R.tree.uid, 'rTree', 'children', R,
			['children'], null, ['info'], { 'max-width': '35%', font: '14px arial' });
	}

	if (numNodes <= 25 && SHOW_UITREE) {

		let numNodes = Object.keys(R.uiNodes).length;
		//console.log('numNodes',numNodes);
		if (numNodes <= 10) {
			presentDictTree(R.uiNodes, R.tree.uid, 'uiTree', 'children', R,
				['children'],
				// null, //show
				// ['ui', 'ui_bg', 'act', 'bi', 'info', 'params', 'defParams', 'cssParams', 'typParams', 'stdParams'], //omit
				['uid', 'pos', 'size', 'uidParent', 'params', 'class', 'type', 'content'],
				//['uid', 'size', 'rcenter','oid','params', 'uidParent', 'type', 'uiType', 'sizeMeasured', 'sizeAvailable', 'sizeNeeded','rpos','apos','acenter'], //show
				null, //omit
				{ 'max-width': '50%', font: '14px arial' });

		} else {
			presentDictTree(R.uiNodes, R.tree.uid, 'uiTree', 'children', R,
				['children'],
				// null, //show
				// ['ui', 'ui_bg', 'act', 'bi', 'info', 'params', 'defParams', 'cssParams', 'typParams', 'stdParams'], //omit
				['uid', 'pos', 'size', 'uidParent', 'class', 'type', 'content'],//,'params'],
				//['uid', 'size', 'rcenter','oid','params', 'uidParent', 'type', 'uiType', 'sizeMeasured', 'sizeAvailable', 'sizeNeeded','rpos','apos','acenter'], //show
				null, //omit
				{ 'max-width': '35%', font: '14px arial' });

		}

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

