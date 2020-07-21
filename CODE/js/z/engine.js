class TestEngine {
	constructor() {
		this.Dict = {};
		this.specs = null;
		this.solutions = null;

		this.series = null; //name of test dir
		this.index = 0; //index of test case
		this.autosave = false;

		this.defs = null;
		this.spec = null;
		this.sdata = null;
	}
	async init(defs, sdata, series, index, ifrom, ito) {
		//consout('1. starting test ==>', series, index);

		this.defs = defs;
		this.sdata = sdata;
		series = isdef(series) ? series : localStorage.getItem('testSeries');
		if (nundef(series)) series = TEST_SERIES;
		index = isdef(index) ? index : localStorage.getItem('testIndex');
		if (nundef(index)) index = '0';

		//consout('starting test ==>', series, index);

		ifrom = isdef(ifrom) ? ifrom : localStorage.getItem('iTestCaseFrom');
		if (nundef(ifrom)) ifrom = '0'; mBy('iTestCaseFrom').value = ifrom;
		ito = isdef(ito) ? ito : localStorage.getItem('iTestCaseTo');
		if (nundef(ito)) ito = '2'; mBy('iTestCaseTo').value = ito;

		index = Number(index);
		await this.loadTestCase(series, index);
		updateTestInput(index);
	}

	async loadSeries(series) {
		let path = '/assetsTEST/' + series + '/';
		this.series = series;
		this.Dict[series] = {
			specs: await loadYamlDict(path + '_spec.yaml'),
			sdata: await loadServerDataForTestSeries(series),
			solutions: await loadSolutions(series),
		};
		if (nundef(this.Dict[series].solutions)) this.Dict[series].solutions = {};
		this.sdata = this.Dict[series].sdata;
		this.specs = this.Dict[series].specs;
		this.solutions = this.Dict[series].solutions;
		//console.log('series data',this.sdata)
		let numCases = Object.keys(this.specs).length;
		return numCases;
	}
	async loadNextTestCase() { await this.loadTestCase(this.series, this.index + 1); }
	async loadPrevTestCase() { await this.loadTestCase(this.series, this.index - 1); }
	async repeatTestCase() { await this.loadTestCase(this.series, this.index); }
	async loadTestCase(series, index) {
		if (CLEAR_BETWEEN_TESTS) await onClickClearTable(); //clearElement_('table');
		let di = this.Dict[series];
		if (nundef(di)) { await this.loadSeries(series); di = this.Dict[series]; }

		let numCases = Object.keys(di.specs).length;
		if (index < 0) index = numCases - 1;
		else if (index >= numCases) index = 0;

		let spec = di.specs[index];
		if (nundef(spec)) { index = 0; spec = di.specs[0]; }

		this.series = series;
		this.index = index;
		localStorage.setItem('testSeries', this.series);
		localStorage.setItem('testIndex', this.index);

		//console.log('series',series,'index',index)
		mBy('message').innerHTML = '(main) ' + series + ' case: ' + index;

		this.spec = spec;
		this.sdata = di.sdata;

		return numCases;
	}

	saveSolutions() { saveSolutions(this.series, this.solutions); }

	loadSolution() {
		let rTree = this.solutions[this.index];
		this.solution = { rTree: rTree };
		return this.solution;
	}
	saveSolution(R, download = false) {
		let r1 = normalizeRTree(R);
		this.solutions[this.index] = r1;
		if (download) this.saveSolutions();
	}

	invalidate() { delete this.solutions[this.index]; }
	verify(R) {
		//console.log('verifying test case', this.series, this.index, '...');
		let rTreeNow = normalizeRTree(R); //also sorts keys rec!
		let solution = this.loadSolution();

		if (!solution.rTree) {
			//console.log('No solution available for test (autosave: ' + this.austosave + ')', this.series, this.index);
			if (this.autosave) this.saveSolution(R);
			return;
		}
		let rTreeSolution = this.solution.rTree;
		let changes = propDiffSimple(rTreeNow, rTreeSolution);
		if (changes.hasChanged) {
			console.log('verifying test case', this.series, this.index, 'FAIL!!!!!!!');
			//console.log('FAIL!!! ' + this.index, '\nis:', rTreeNow, '\nshould be:', rTreeSolution);
			console.log('changes:', changes)
		} else {
			console.log('verifying test case', this.series, this.index, 'correct!');
			// console.log('*** correct! ', this.index, '***', rTreeNow)
		}
	}
}
function updateTestInput(index) {
	//set max on input element called iTestCase if exists
	let elem = mBy('iTestCase');
	if (isdef(elem)) {
		elem.max = Object.keys(testEngine.specs).length - 1;
		elem.min = 0;
		elem.value = index;
	}

}
function sat() {
	let R = T;
	let rtree = normalizeRTree(R);
	let sol = {};
	sol[testEngine.index] = rtree;
	downloadFile(sol, 'sol' + testEngine.index);
}
function satall() { testEngine.saveSolutions(); }

function uiNodesToUiTree(R) {
	let uiTree = {};
	for (const k in R.uiNodes) {
		let n = R.uiNodes[k];
		uiTree[k] = jsCopyMinus(n, 'act', 'ui', 'defParams', 'params');
	}
	return uiTree;
}
//Function: normalizeDict
// t is a dict, each key is normalized by smallest key (as number)
//
// returns {num: , result: }
//
// example: normalizeDict({_23:'bla',_28:'blabla'}) => {num:23, dictNew:{_0:'bla',_5:'blabla'}}
//
// NOTE! only modifies keys, *not* all occurrences of key values in dict
function normalizeDict(t) {
	let tNew = {};
	let keys = Object.keys(t);
	let minKey = Math.min(...keys.map(x => firstNumber(x)));
	//console.log('minKey is',minKey);
	for (const k in t) {
		tNew['_' + (firstNumber(k) - minKey)] = jsCopy(t[k]);
	}
	return { num: minKey, result: sortKeys(tNew) };
}

//Function: normalizeTree
// t is a tree, uid in each node, children is branching property
//
// r is an r structure that has rNodes, uiNodes, root
// returns a copy of t where uids are normalized by the number value of root.uid
//
// example: if root.uid == '_24', result will have root.uid = '_0' and each uid subtracted 24
function normalizeTree(t, r) {
	let tNew = jsCopy(t);
	let first = r.tree.uid;
	let num = firstNumber(first);
	safeRecurse(tNew, normalizeNode, num, false);

	let newRTree = {};
	for (const k in tNew) {
		let kNew = normalizeVal(k, num);
		newRTree[kNew] = tNew[k];
	}
	tNew = newRTree;
	return sortKeys(tNew);
}
function normalizeRTree(R) { return normalizeTree(R.rNodes, R); }
function normalizeNode(o, num) {
	if (isdef(o.uid)) normalizeSimpleUidProp(o, 'uid', num);
	if (isdef(o.children)) { o.children = o.children.map(x => normalizeVal(x, num)); }
	if (isdef(o.uidParent)) normalizeSimpleUidProp(o, 'uidParent', num);
	if (isdef(o._NODE)) normalizeSpecKeyProp(o, '_NODE', num);
	if (isdef(o.here)) normalizeSpecKeyProp(o, 'here', num);
}
function correctNumbersInString(s, dec) {
	//console.log('input:',s,dec);
	let parts = s.split('_');
	for (let i = 0; i < parts.length; i++) {
		let p = parts[i];
		if (isNumber(p)) {
			let n = Number(p);
			n -= dec;
			parts[i] = '' + n;
		}
	}
	let res = parts.join('_');
	//console.log('output:',res);
	return res;
}
function normalizeSpecKeyProp(o, prop, num) {
	let node1 = o[prop];
	if (isString(node1) && node1.includes('_')) {
		o[prop] = correctNumbersInString(node1, num);
	} else if (isList(node1)) {
		let newlist = [];
		for (const el of node1) {
			if (el.includes('_')) {
				newlist.push(correctNumbersInString(el, num));
			}
		}
		console.log('SOLLTE NIEEEEEEEEEEEEEEEEEEE VORKOMMEN!!!!!!');
		o[prop] = newlist;

	}
}
function normalizeSimpleUidProp(o, prop, num) {
	//console.log(o[prop])
	o[prop] = normalizeVal(o[prop], num);
	//console.log(o)
}
function normalizeVal(val, num) {
	let nval = firstNumber(val);
	//console.log(val,num,nval,typeof nval);
	nval -= num;
	return '_' + nval;
}
async function loadServerDataForTestSeries(series) {
	let path = '/assetsTEST/' + series + '/server.yaml';
	await loadTestServerData(path);

	//console.log('______ loadServerDataForTestSeries',serverData)

	preProcessData();
	//isTraceOn = SHOW_TRACE;
	sData = makeDefaultPool(jsCopy(serverData));
	//console.log('______ loadServerDataForTestSeries',sData)
	return sData;
}








