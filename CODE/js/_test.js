//#region server data change!
var TV={};
function testAddObject(R) {

	let oid = getUID('o');
	let o = { obj_type: 'card' };
	o.short_name = chooseRandom(['K', 'Q', 'J', 'A', 2, 3, 4, 5, 6, 7, 8]);
	if (!serverData.table) serverData.table = {};
	serverData.table[oid] = o;
	sData[oid] = jsCopy(o);
	//console.log('adding a new object', oid);
	addNewServerObjectToRsg(oid, o, R);

	recAdjustDirtyContainers(R.tree.uid, R, true);

	//console.log(R.instantiable)
	updateOutput(R);
}
function testRemoveObject(R) {
	//hier mache policy not to remove board members!!!
	//lock in objects that are not independent! these are objects
	let data = dict2list(sData);
	//data = data.filter(x=>(isdef(x.map) || nundef(x.fields)) && nundef(x.neighbors));
	data = data.filter(x=>(nundef(x.fields)) && nundef(x.neighbors)); //board weg!
	if (isEmpty(data)) {
		console.log('no objects left in sData!!!');
		return;
	}
	let oid = chooseRandom(data).id;

	delete sData[oid];
	//also have to remove all the children!
	completelyRemoveServerObjectFromRsg(oid, R);
	console.log('removed oid',oid);
	updateOutput(R);
}
function testAddLocObject(R) {
	let oid = getUID('o');
	let o = { name: 'felix' + oid, loc: 'p1' };
	serverData.table[oid] = o;
	sData[oid] = jsCopy(o);
	addNewServerObjectToRsg(oid, o, R);
	updateOutput(R);
}
function testAddBoard(R) {
	let oid = TV.boardOid; //detectFirstBoardObject(R); //chooseRandomDictKey(sData);
	let o=TV.oBoard;
	console.log('boardOid is',oid);
	if (R.getO(oid)) {
		console.log('please click remove board first!');
		return;
	}
	// let o =
	// {
	// 	fields:
	// 	{
	// 		_set: [
	// 			{ _obj: '0' },
	// 			{ _obj: '1' },
	// 			{ _obj: '2' },
	// 			{ _obj: '3' },
	// 			{ _obj: '4' },
	// 			{ _obj: '5' },
	// 			{ _obj: '6' },
	// 			{ _obj: '7' },
	// 			{ _obj: '8' }]
	// 	},
	// 	rows: 3,
	// 	cols: 3,
	// 	obj_type: 'Board',
	// 	map: 'hallo',
	// };
	if (!serverData.table) serverData.table = {};
	serverData.table[oid] = o;
	sData[oid] = jsCopy(o);
	//console.log('adding a new object', oid);
	addNewServerObjectToRsg(oid, o, R);

	recAdjustDirtyContainers(R.tree.uid, R, true);

	updateOutput(R);
}
function testRemoveBoard(R) {

	let activate = R.isUiActive;
	if (activate) deactivateUis(R);

	let oid = detectFirstBoardObject(R); //chooseRandomDictKey(sData);
	console.log('testRemoveBoard: first board object detected has oid',oid);

	if (isdef(oid)) {TV.boardOid = oid;TV.oBoard=R.getO(oid);}
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

function testSorting(){
	let o = { z: [3, 2, 5, 1], d: { w: 2, r: 3 } };
	let d = mBy('spec');
	mNodeFilter(o, { dParent: d, title: 'orig' });
	mNodeFilter(o, { sort: 'all', dParent: d, title: 'sorted' });
	mNodeFilter(o, { sort: 'keys', dParent: d, title: 'justkeys' });
	// presentAddNode(o,'orig','spec');
	// presentAddNode(JSON.sort(jsCopy(o)),'sorted','spec');
	// presentAddNode(sortKeys(o),'justkeys','spec');

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

//#endregion

//#region add or remove oid/key
function getRandomUidNodeWithAct(R) {
	//das geht garnicht!!!!!!!!!!!!!!!!!!!!!!!
	//der node existiert ja nicht mehr!
	//geht fuer remove aber nicht fuer add!!!!!
	let cands = Object.values(R.uiNodes).filter(x => isdef(x.act) && isdef(x.oid));
	//console.log(cands);
	if (isEmpty(cands)) return null;
	let n = chooseRandom(cands);
	//console.log(n);
	return n;
}
function testRemoveOidKey(R) {

	// let { oid, key } = getRandomOidAndKey(R);
	let n = getRandomUidNodeWithAct(R);
	if (!n) {
		console.log('there is no oid to remove!!!');
		return;
	}
	let [oid, key] = [n.oid, n.key];

	let nodeInstances = lookup(R.rNodesOidKey, [oid, key]);
	console.log('_________ testRemoveOidKey', 'remove all', oid, key, nodeInstances);
	//console.log('remove', oid, key);
	removeOidKey(oid, key, R);

	updateOutput(R);

}

function getRandomNodeThatCanBeAdded(R) {
	let nonEmpty = allCondDict(R.oidNodes, x => !isEmpty(x));
	//console.log(nonEmpty);
	// let random_oid = chooseRandom(nonEmpty);
	// let locs = Object.keys(R.oidNodes[random_oid]);
	// let random_loc = chooseRandom(locs);
	// return { oid: random_oid, loc: random_loc };
}
function testAddOidKey(R) {

	//let n=chooseRandom(R.instantiable);
	console.log(R.instantiable)
	let n = lastCond(R.instantiable, x => !lookup(R.rNodesOidKey, [x.oid, x.key]));
	if (!n) {
		console.log('all nodes are instantiated!!!');
		return;
	}
	//console.log(n);

	let [oid, key] = [n.oid, n.key];
	let o = R.getO(oid);
	if (!o) {
		console.log('no object with oid', oid, 'found!!!');
		return;
	}
	//console.log(' T_____________________ testAddOidLoc: add', oid, '/', key);
	if (o.loc) addOidByLocProperty(oid, key, R); else addOidByParentKeyLocation(oid, key, R);

	//hier brauch ich noch generateUi fuer neue nodes!!!
	//addOidByLocProperty(oid, key, R);

	updateOutput(R);

}
//#endregion





















