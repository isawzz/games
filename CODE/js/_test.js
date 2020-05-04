//#region server data change!
function testAddLocObject(R){
	let oid=getUID('o');
	let o={name:'felix'+oid,loc:'p1'};
	serverData.table[oid]=o;
	sData[oid]=jsCopy(o);
	addNewServerObjectToRsg(oid,o,R);
	updateOutput(R);
}
function testAddObject(R){
	let oid=getUID('o');
	let o={name:'amanda'+oid};
	serverData.table[oid]=o;
	sData[oid]=jsCopy(o);
	addNewServerObjectToRsg(oid,o,R);
	console.log(R.instantiable)
	updateOutput(R);
}
function testRemoveObject(R){
	let oid = chooseRandomDictKey(sData);
	if (!oid) {
		console.log('no objects left in sData!!!');
		return;
	}
	delete sData[oid];
	completelyRemoveServerObjectFromRsg(oid,R);
	console.log('removed oid',oid);
	updateOutput(R);
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

	let nodeInstances = lookup(R.treeNodesByOidAndKey, [oid, key]);
	console.log('_________ testRemoveOidKey', 'remove all', oid, key, nodeInstances);
	//console.log('remove', oid, key);
	removeOidFromLoc(oid, key, R);

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
	let n = lastCond(R.instantiable, x => !lookup(R.treeNodesByOidAndKey, [x.oid, x.key]));
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





















