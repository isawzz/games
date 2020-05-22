
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


//#region server data change!
var TV = {};
function testAddObject(R) {
	R.initRound();
	let oid = getUID('o');
	let o = { obj_type: 'card' };
	o.short_name = chooseRandom(['K', 'Q', 'J', 'A', 2, 3, 4, 5, 6, 7, 8]);
	if (!serverData.table) serverData.table = {};
	serverData.table[oid] = o;
	sData[oid] = jsCopy(o);
	//console.log('adding a new object', oid);
	addSO(oid, o, R);

	sieveLocOids(R);
	//recheckAllObjectsForLoc(R);

	recAdjustDirtyContainers(R.tree.uid, R, true);

	//console.log(R.instantiable)
	updateOutput(R);
}
function testRemoveObject(R) {

	//muss ein object removen das nicht ein board member ist, nicht ein board ist,
	//aber schon irgendwo represented it!

	//hier mache policy not to remove board members!!!
	//lock in objects that are not independent! these are objects
	let data = dict2list(sData);
	//data = data.filter(x=>(isdef(x.map) || nundef(x.fields)) && nundef(x.neighbors));
	data = data.filter(x => (nundef(x.fields)) && nundef(x.neighbors)); //board weg!

	data = data.filter(x => firstCondDict(R.rNodes, y => y.oid == x.id));
	console.log('data gefiltered:', data)

	if (isEmpty(data)) {
		console.log('no objects left in sData!!!');
		return;
	}
	let oid = chooseRandom(data).id;

	delete sData[oid];
	//also have to remove all the children!
	completelyRemoveServerObjectFromRsg(oid, R);
	console.log('removed oid', oid);
	updateOutput(R);
}
function testAddLocObject(R) {
	R.initRound();

	let oid = getUID('o');
	let o = { name: 'felix' + oid, loc: 'p1' };
	serverData.table[oid] = o;
	sData[oid] = jsCopy(o);
	addSO(oid, o, R);
	sieveLocOids(R);
	updateOutput(R);
}
function addSO(oid,o,R){	let sd={};sd[oid]=o;addNewlyCreatedServerObjects(sd,R);}
function testAddBoard(R) {
	R.initRound();

	let oid = TV.boardOid; //detectFirstBoardObject(R); //chooseRandomDictKey(sData);
	let o = TV.oBoard;
	console.log('boardOid is', oid);
	if (R.getO(oid)) {
		console.log('please click remove board first!');
		return;
	}
	if (!serverData.table) serverData.table = {};
	serverData.table[oid] = o;
	sData[oid] = jsCopy(o);
	//console.log('adding a new object', oid);
	addSO(oid, o, R);

	sieveLocOids(R);

	recAdjustDirtyContainers(R.tree.uid, R, true);

	updateOutput(R);
}
function testRemoveBoard(R) {

	let activate = R.isUiActive;
	if (activate) deactivateUis(R);

	let oid = detectFirstBoardObject(R); //chooseRandomDictKey(sData);
	console.log('testRemoveBoard: first board object detected has oid', oid);

	if (isdef(oid)) { TV.boardOid = oid; TV.oBoard = R.getO(oid); }
	if (!oid) {
		console.log('no objects left in sData!!!');
		return;
	}
	delete sData[oid];
	//also have to remove all the children!
	completelyRemoveServerObjectFromRsg(oid, R);
	//console.log('removed oid',oid);
	updateOutput(R);
	if (activate) activateUis(R);
}

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

























