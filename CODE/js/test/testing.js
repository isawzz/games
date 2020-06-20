//#region test drawing, shapes, elements & functions
async function testAblauf0(defs, spec, sdata0) {
	await testEngine.init(defs, sdata0, TEST_SERIES);
	let [sp, defaults, sdata] = [testEngine.spec, testEngine.defs, testEngine.sdata];
	T = R = new RSG(sp, defaults, sdata);
	R.initialChannels = []; //do not provide anything here or ALL tests before 04 will fail!!!!
	ensureRtree(R);
	R.baseArea = 'table';
	createStaticUi(R.baseArea, R);

	//addNewlyCreatedServerObjects
	for (const oid in sdata) { R.addObject(oid, sdata[oid]); R.addRForObject(oid); }
	for (const oid in sdata) {
		let o = sdata[oid];
		if (isdef(o.loc)) { continue; }

		let topUids;
		for (const key of R.getR(oid)) {
			let specNode = R.getSpec(key);

			//add rtree: topUids will be newly created top level rNodes
			if (o.loc && nundef(R.Locations[key]) && nundef(specNode._ref)) {
				topUids = addOidByLocProperty(oid, key, R);
			} else if (isdef(R.Locations[key])) {
				topUids = addOidByParentKeyLocation(oid, key, R);
			}

			if (isEmpty(topUids)) { continue; } // no rNode was produced, therefore, no uiNode

			//for each rtree add corresponding uiNodes
			for (const top of topUids) {
				let uiParent = R.uiNodes[top.uidParent];
				let rParent = R.rNodes[top.uidParent];
				if (isdef(uiParent)) {
					uiParent.adirty = true;
					uiParent.children = rParent.children.map(x => x);
				}
				recUi(R.rNodes[top.uid], top.uidParent, R, oid, key);
			}
		}
	}
	sieveLocOids(R); // process .loc objects that have not been able to be added because parent is also loc and hasn't been added!

	recAdjustDirtyContainers(R.tree.uid, R, true);

	updateOutput(R);
	testEngine.verify(R);
}


function testComposeShapesAndResize() {
	let g = gCanvas('table', 400, 300, 'skyblue');
	//let g = testMakeACanvas();

	//testResizeRect(g);
	//testResizeEllipse(g);
	testResizeHex(g);


}
function testResizeHex(g) {
	let el = agHex(g, 50, 50);// agRect(g,100,50); //der macht nicht ein shape mit rect als ground sondern NUR ein rect!!!!!!
	gBg(el, 'blue');
	gPos(el, 100, 110);
	gSize(el, 20, 20, 'hex');//hex info MUSS dabei sein!!!!
}
function testResizeEllipse(g) {
	let el = agEllipse(g, 100, 100);// agRect(g,100,50); //der macht nicht ein shape mit rect als ground sondern NUR ein rect!!!!!!
	gBg(el, 'violet');
	gPos(el, 100, 110);
	gSize(el, 50, 20);
}
function testResizeRect(g) {
	let el = agRect(g, 100, 50); //der macht nicht ein shape mit rect als ground sondern NUR ein rect!!!!!!
	gBg(el, 'violet');
	gPos(el, 100, 110);
	gSize(el, 50, 20);
}
function testMakeACanvas() {
	let dParent = mBy('table');

	let div = stage3_prepContainer(dParent);
	div.style.width = 400 + 'px';
	div.style.height = 300 + 'px';
	mColor(div, 'orange');

	//addTitleToGrid(n,d)

	let svg = gSvg();

	let style = `margin:0;padding:0;position:absolute;top:0px;left:0px;width:100%;height:100%;`
	svg.setAttribute('style', style);
	mColor(svg, 'green');
	div.appendChild(svg);

	let g = gG();
	g.style.transform = "translate(50%, 50%)";
	gBg(g, 'blue');

	svg.appendChild(g);
	return g;
}




//#endregion

//#region server data change!
var TV = {};
function reAddServerObject(label) {
	//the server object has been removed previously! (or oid,o is in TV)
	let tv = TV[label];
	if (nundef(tv)) {
		console.log('this object has NOT been entered in TV!!! did you remove the object?!?', label);
		return;
	}
	let oid = tv.oid;
	let o = tv.o;
	addServerObject(oid, o, R);

}

function removeServerObject(oid, label) {
	let o = R.getO(oid);
	if (nundef(o)) {
		console.log('object cannot be removed because not in R', oid);
		return;
	}
	if (isdef(label)) TV[label] = { oid: oid, o: o };

	let activate = R.isUiActive;
	if (activate) deactivateUis(R);

	delete sData[oid];
	//also have to remove all the children!
	completelyRemoveServerObjectFromRsg(oid, R);
	console.log('removed oid', oid);
	updateOutput(R);

	if (activate) activateUis(R);

}

function removeRobber(R) {
	let robberOid = firstCondDict(R._sd, x => x.o.obj_type == 'robber');
	if (nundef(robberOid)) {
		console.log('this test is not applicable!');
	}
	removeServerObject(robberOid, 'robber');
}
function addRobber(R) { R.initRound(); reAddServerObject('robber'); }
function removeBoard(R) {
	let oid = detectFirstBoardObject(R);
	removeServerObject(oid, 'board');
}
function addBoard(R) { R.initRound(); reAddServerObject('board'); }
function addServerObject(oid, o, R) {
	if (!serverData.table) serverData.table = {};
	serverData.table[oid] = o;
	sData[oid] = jsCopy(o);
	//console.log('adding a new object', oid);
	addSO(oid, o, R);

	recAdjustDirtyContainers(R.tree.uid, R, true);
	updateOutput(R);
}
function addSO(oid, o, R) { let sd = {}; sd[oid] = o; addNewlyCreatedServerObjects(sd, R); }
function testAddObject(R) {
	R.initRound();
	let oid = getUID('o');
	let o = { obj_type: 'card' };
	o.short_name = chooseRandom(['K', 'Q', 'J', 'A', 2, 3, 4, 5, 6, 7, 8]);
	addServerObject(oid, o, R);
	// if (!serverData.table) serverData.table = {};
	// serverData.table[oid] = o;
	// sData[oid] = jsCopy(o);
	// //console.log('adding a new object', oid);
	// addSO(oid, o, R);
	// sieveLocOids(R);
	// //recheckAllObjectsForLoc(R);
	// recAdjustDirtyContainers_(R.tree.uid, R, true);
	// //console.log(R.instantiable)
	// updateOutput(R);
}
function testRemoveObject(R) {
	let data = dict2list(sData);

	//nur die sdata die nicht board or board members sind:
	data = data.filter(x => (nundef(x.fields)) && nundef(x.neighbors)); //board weg!

	//von denen, nur die die einen node in rtree besitzen!!!
	data = data.filter(x => firstCondDict(R.rNodes, y => y.oid == x.id));
	console.log('data gefiltered:', data)

	if (isEmpty(data)) {
		console.log('no objects left in sData!!!');
		return;
	}

	//oid ergibt object das in rtree present ist aber NICHT zu board gehoert!
	let oid = chooseRandom(data).id;

	removeServerObject(oid, 'random');
	// delete sData[oid];
	// //also have to remove all the children!
	// completelyRemoveServerObjectFromRsg(oid, R);
	// console.log('removed oid', oid);
	// updateOutput(R);
}
function testAddLocObject(R) {
	R.initRound();

	let oidLoc = getRandomExistingObjectWithRep(R);
	let oid = getUID('o');
	let o = { name: 'felix' + oid, loc: oidLoc };
	addServerObject(oid, o, R);

	// serverData.table[oid] = o;
	// sData[oid] = jsCopy(o);
	// addSO(oid, o, R);
	// sieveLocOids(R);
	// updateOutput(R);
}

function testAddBoard(R) {
	R.initRound();

	reAddServerObject('board');

	// let oid = TV.boardOid; //detectFirstBoardObject(R); //chooseRandomDictKey(sData);
	// let o = TV.oBoard;
	// console.log('boardOid is', oid);
	// if (R.getO(oid)) {
	// 	console.log('please click remove board first!');
	// 	return;
	// }
	// if (!serverData.table) serverData.table = {};
	// serverData.table[oid] = o;
	// sData[oid] = jsCopy(o);
	// //console.log('adding a new object', oid);
	// addSO(oid, o, R);
	// sieveLocOids(R);
	// recAdjustDirtyContainers_(R.tree.uid, R, true);
	// updateOutput(R);
}
function testRemoveBoard(R) {

	// let activate = R.isUiActive;
	// if (activate) deactivateUis(R);

	let oid = detectFirstBoardObject(R);
	console.log('testRemoveBoard: first board object detected has oid', oid);

	removeServerObject(oid, 'board');


	// if (isdef(oid)) { TV.boardOid = oid; TV.oBoard = R.getO(oid); }
	// if (!oid) {
	// 	console.log('no objects left in sData!!!');
	// 	return;
	// }

	// delete sData[oid];
	// //also have to remove all the children!
	// completelyRemoveServerObjectFromRsg(oid, R);
	// //console.log('removed oid',oid);
	// updateOutput(R);
	// if (activate) activateUis(R);
}

//#region engine
async function testSolutionConverter() {
	let series = TEST_SERIES;
	let sols = await loadSolutions(series);
	console.log('solutions', sols);

	await saveSolutions(series, sols);
}
async function loadSolutions(series) {
	//when loading solutions from disk:convert keys into numbers
	let solFilename = 'sol';
	let sol = await loadJsonDict('/assetsTEST/' + series + '/' + solFilename + '.json');
	let sol1 = {};
	for (const k in sol) { sol1[firstNumber(k)] = sol[k]; }
	let solutions = sol1;
	return solutions;
}
async function saveSolutions(series, solutions) {
	//solutions have number keys, make it string and sort!
	let keys = Object.keys(solutions);
	//console.log(keys[0],typeof keys[0]);
	let n = firstNumber(keys[0]);
	//console.log('n',n,'type',typeof n);
	//console.log(solutions[10],'number');
	//console.log(solutions['10'],'string');
	keys.sort(x => Number(x)).reverse();
	//console.log('keys',keys);
	let sortedObject = {};
	for (const k of keys) {
		let x = sortKeys(solutions[k]);
		sortedObject[' ' + k + ' '] = x; //solutions[k];
	}
	downloadFile(sortedObject, 'solutions' + series);
}

//#endregion

//#region activate, deactivate
function testActivate(R) {
	activateUis(R);

}
function testDeactivate(R) {
	deactivateUis(R);

}
//#endregion

//#region helper function tests
function testSaveLoadUiTree() {
	let uiTree = jsCopyMinus(T.uiTree, 'act', 'ui', 'defParams', 'params');
	console.log(uiTree);

}
function testSorting() {
	let o = { z: [3, 2, 5, 1], d: { w: 2, r: 3 } };
	let d = mBy('spec');
	mNodeFilter(o, { dParent: d, title: 'orig' });
	mNodeFilter(o, { sort: 'all', dParent: d, title: 'sorted' });
	mNodeFilter(o, { sort: 'keys', dParent: d, title: 'justkeys' });
	// presentAddNode(o,'orig','spec');
	// presentAddNode(JSON.sort(jsCopy(o)),'sorted','spec');
	// presentAddNode(sortKeys(o),'justkeys','spec');

}
function testLookupRemoveFromList() {
	//usage: lookupRemoveFromList({a:{b:[2]}}, [a,b], 2) => {a:{b:[]}} OR {a:{}} (wenn deleteIfEmpty==true)
	let d = { a: { b: [2] } };
	let res = lookupRemoveFromList(d, ['a', 'b'], 2);
	console.log('res', res, 'd', d);
	d = { a: { b: [2] } };
	res = lookupRemoveFromList(d, ['a', 'b'], 2, true);
	console.log('res', res, 'd', d);

	//usage: lookupRemoveFromList({a:{b:[2,3]}}, [a,b], 3) => {a:{b:[2]}}
	d = { a: { b: [2, 3] } };
	res = lookupRemoveFromList(d, ['a', 'b'], 3, true);
	console.log('res', res, 'd', d);

	//usage: lookupRemoveFromList({a:[ 0, [2], {b:[]} ] }, [a,1], 2) => { a:[ 0, [], {b:[]} ] }
	d = { a: [0, [2], { b: [] }] };
	res = lookupRemoveFromList(d, ['a', 1], 2);
	console.log('res', res, 'd', d);

}
function deepmergeTestArray() {
	//=> all 3 objects are different copies!!!
	let o1 = { a: 1, b: [1, 2, 3], c: 1 };
	let o2 = { a: 2, b: [2, 3, 4, 5] };

	let o3 = deepmerge(o1, o2);
	logVals('___\no1', o1); logVals('o2', o2); logVals('o3', o3);

	o3 = mergeOverrideArrays(o1, o2); //, {arrayMerge: overwriteMerge});
	logVals('___\no1', o1); logVals('o2', o2); logVals('o3', o3);

	o3 = safeMerge(o1, o2); //override array semantics!
	logVals('___\no1', o1); logVals('o2', o2); logVals('o3', o3);
}
function deepmergeTest() {
	//=> all 3 objects are different copies!!!
	let o1 = { a: 1, c: 1 };
	let o2 = { a: 2, b: 2 };

	let o3 = deepmerge(o1, o2);
	logVals('___\no1', o1); logVals('o2', o2); logVals('o3', o3);

	o1.a = 11;
	logVals('___\no1', o1); logVals('o2', o2); logVals('o3', o3);

	o2.a = 22;
	logVals('___\no1', o1); logVals('o2', o2); logVals('o3', o3);

	o3.a = 33;
	logVals('___\no1', o1); logVals('o2', o2); logVals('o3', o3);
}
function logVals(title, o) {
	let s = title + ':  ';
	for (const k in o) { s += k + ':' + o[k] + ' '; }
	console.log(s);
}
function testGetElements() {
	let x = getElements([0, 1, 2]);
	console.log('x', x);
	x = getElements([[3, 2], [0, 1, 2]]);
	console.log('x', x);
}

























