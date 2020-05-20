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
	async init(defs, sdata, series, index) {
		this.defs = defs;
		this.sdata = sdata;
		series = isdef(series) ? series : localStorage.getItem('testSeries');
		if (nundef(series)) series = TEST_SERIES;
		index = isdef(index) ? index : localStorage.getItem('testIndex');
		if (nundef(index)) index = '0';

		index = Number(index);
		await this.loadTestCase(series, index);
		updateTestInput(index);
	}
	async loadSeries(series) {
		let path = '/assetsTEST/' + series + '/';
		this.series = series;
		this.Dict[series] = {
			specs: await loadYamlDict(path + '_spec.yaml'),
			solutions: await loadSolutions(series),
		};
		if (nundef(this.Dict[series].solutions)) this.Dict[series].solutions = {};

		this.specs = this.Dict[series].specs;
		this.solutions = this.Dict[series].solutions;

	}
	async loadNextTestCase() { await this.loadTestCase(this.series, this.index + 1); }
	async loadPrevTestCase() { await this.loadTestCase(this.series, this.index - 1); }
	async repeatTestCase() { await this.loadTestCase(this.series, this.index); }
	async loadTestCase(series, index) {
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

		mBy('message').innerHTML = ' ' + series + ' case: ' + index;

		this.spec = spec;
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
			console.log('No solution available for test (autosave: ' + this.austosave + ')', this.series, this.index);
			if (this.autosave) this.saveSolution(R);
			return;
		}
		let rTreeSolution = this.solution.rTree;
		let changes = propDiffSimple(rTreeNow, rTreeSolution);
		if (changes.hasChanged) {
			//console.log('verifying test case', this.series, this.index, 'FAIL');
			//console.log('FAIL!!! ' + this.index, '\nis:', rTreeNow, '\nshould be:', rTreeSolution);
			//console.log('changes:', changes)
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
function normalizeRTree(R) {
	let rTree = jsCopy(R.rNodes);
	let first = R.tree.uid;
	let num = firstNumber(first);
	safeRecurse(rTree, normalizeNode, num, false);

	let newRTree = {};
	for (const k in rTree) {
		let kNew = normalizeVal(k, num);
		newRTree[kNew] = rTree[k];
	}
	rTree = newRTree;
	return sortKeys(rTree);
}
function normalizeNode(o, num) {
	if (isdef(o.uid)) normalizeObjectProp(o, 'uid', num);
	if (isdef(o.children)) { o.children = o.children.map(x => normalizeVal(x, num)); }
	if (isdef(o.uidParent)) normalizeObjectProp(o, 'uidParent', num);
	if (isdef(o.key) && startsWith(o.key, 'sp_')) {
		let val = o.key.substring(2);
		o.key = 'sp' + normalizeVal(val, num);
	}
	if (isdef(o._NODE) && startsWith(o._NODE, 'sp_')) {
		let val = o._NODE.substring(2);
		o._NODE = 'sp' + normalizeVal(val, num);
	}
	if (isdef(o.here) && startsWith(o.here, 'sp_')) {
		let val = o.here.substring(2);
		o.here = 'sp' + normalizeVal(val, num);
	}
}
function normalizeObjectProp(o, prop, num) {
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








