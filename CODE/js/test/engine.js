class TestEngine {
	constructor() {
		this.Dict = {}; // {series: {}, specs: {}, solutions: {}};
		this.series = null; //name of test dir
		this.index = 0; //index of test case
		this.autosave = false;
	}
	async init(buttonPrefix, defs, presentCallback) {
		this.presentCallback = presentCallback;
		this.buttonPrefix = buttonPrefix;
		this.defs = defs;
		let series = localStorage.getItem('testSeries');
		if (nundef(series)) series = '00';
		let index = localStorage.getItem('testIndex');
		if (nundef(index)) index = '0';

		index = Number(index);
		await this.loadTestCase(series, index);
	}
	async clicked(caption) {
		let parts = caption.split(' ');
		// console.log('clicked button with caption', caption, parts)
		let series = parts[0];
		let index = parts.length > 1 ? Number(parts[1]) + 1 : 0;

		if (nundef(this.Dict[series])) await this.loadSeries(series);
		this.loadTestCase(series, index);

	}
	loadNextTestCase() { this.loadTestCase(this.series, this.index + 1); }
	loadPrevTestCase() { this.loadTestCase(this.series, this.index - 1); }
	repeatTestCase() { this.loadTestCase(this.series, this.index); }
	async loadTestCase(series, index) {
		let di = this.Dict[series];

		if (nundef(di)) { await this.loadSeries(series); di = this.Dict[series]; }

		let numCases = Object.keys(di.specs).length;
		if (index < 0) index = numCases - 1;
		else if (index >= numCases) index = 0;

		let spec = di.specs[index];
		if (nundef(spec)) { index = 0; spec = di.specs[0]; }
		let serverData = di.serverData;

		this.series = series;
		this.index = index;
		localStorage.setItem('testSeries', this.series);
		localStorage.setItem('testIndex', this.index);
		//console.log('stored', this.series, this.index);

		//mBy(this.buttonPrefix + series).innerHTML = series + ' ' + index;
		mBy('message').innerHTML = ' ' + series + ' case: ' + index;

		this.presentCallback(spec, this.defs, serverData);
	}
	async loadSeries(series) {
		let path = '/assetsTEST/' + series + '/';
		this.series = series;
		//console.log('loading', path);
		this.Dict[series] = {
			specs: await loadYamlDict(path + '_spec.yaml'),
			serverData: await loadYamlDict(path + 'server.yaml'),
			solutions: await loadJsonDict(path + 'solution.json'),
		};

		//console.log('solutions', this.Dict[series].solutions);
		if (nundef(this.Dict[series].solutions)) this.Dict[series].solutions = {};
		//sowie in assets lade ich hier ein yaml dict 
		//lade es jedesmal frisch weil ja aenderungen!!!!!!
	}

	//saveLastSpec(R) { saveObject(R.lastSpec, 'lastSpec_' + this.series + '_' + this.index); }
	saveRTree(R, download = false) {
		//console.log('saving',R.rNodes);
		let r1 = normalizeRTree(R);
		console.log('normalized', sortKeys(r1));
		this.Dict[this.series].solutions[this.index] = r1;

		if (download) this.saveDict();

		//saveObject(r1, 'rTree_' + this.series + '_' + this.index); 
	}
	saveDict() { downloadFile(this.Dict[this.series].solutions, 'solution'); }
	//saveUiTree(R) { 
	//	saveObject(uiNodesToUiTree(R.uiNodes), 'uiTree_' + this.series + '_' + this.index); 
	//}
	//saveOidNodes(R) { saveObject(R.oidNodes, 'oidNodes_' + this.series + '_' + this.index); }
	//loadLastSpec() { return loadObject('lastSpec_' + this.series + '_' + this.index); }
	loadRTree() { return loadObject('rTree_' + this.series + '_' + this.index); }
	//loadUiTree() { return loadObject('uiTree_' + this.series + '_' + this.index); }
	//loadOidNodes() { return loadObject('oidNodes_' + this.series + '_' + this.index); }

	loadSolution() {
		//let lastSpec = this.loadLastSpec();
		//if (nundef(lastSpec)) { return null; }
		//let uiTree = this.loadUiTree();
		//let oidNodes = this.loadOidNodes();
		// let rTree = this.loadRTree();
		let rTree = this.Dict[this.series].solutions[this.index]; //loadRTree();

		this.solution = {
			//lastSpec: lastSpec,
			rTree: rTree,
			//uiTree: uiTree,
			//oidNodes: oidNodes
		};

		return this.solution;
	}
	invalidate() {
		//localStorage.removeItem('rTree_' + this.series + '_' + this.index);
		delete this.Dict[this.series].solutions[this.index];
	}
	saveAsSolution(R) {
		//this.saveLastSpec(R);
		this.saveRTree(R);
		//this.saveUiTree(R);
		//this.saveOidNodes(R);

	}
	verify(R) {
		//console.log('R',R.rNodes);
		console.log('verifying test case', this.series, this.index, '...');
		let rTreeNow = normalizeRTree(R);//.rNodes;
		let solution = this.loadSolution();
		//console.log(solution)
		//let rTreeNow = normalizeRTree(R);//.rNodes;

		if (!solution.rTree) {
			console.log('No solution available for test', this.series, this.index);
			if (this.autosave) this.saveAsSolution(R);
			return;
		} else {
			//console.log('solution',this.solution.rTree);
		}
		let rTreeSolution = this.solution.rTree;
		let changes = propDiffSimple(rTreeNow, rTreeSolution);
		if (changes.hasChanged) {
			console.log('!!!!!!!!!!!!!!!PROBLEM!!! ', this.index, '!!!!!!!!!!!!!!!!\n', sortKeys(rTreeNow), '\nshould be', sortKeys(rTreeSolution));
			localStorage.removeItem('rTree_' + this.series + '_' + this.index)
			console.log('FAIL!!!!!!!!!!!! ' + this.index);
		} else {
			console.log('*** correct! ', this.index, '***', sortKeys(rTreeNow))
		}

		return;
		let rProcessed = {
			lastSpec: R.lastSpec,
			rTree: R.rNodes,
			uiTree: uiNodesToUiTree(R.uiNodes),
			oidNodes: R.oidNodes,
		};


		for (const k of ['lastSpec', 'rTree', 'uiTree', 'oidNodes']) {
			//console.log(this.solution)

			let changes = propDiffSimple(this.solution[k], rProcessed[k]);
			if (changes.hasChanged) {
				console.log('change:', k, '\nchanges', changes, '\nsolution', this.solution, '\nactual', R);
			} else {
				console.log('correct!', k)
			}
		}

	}

}

function sat() {
	let R = T;
	let rtree = normalizeRTree(R);
	let sol = {};
	sol[testEngine.index] = rtree;
	downloadFile(sol, 'sol' + testEngine.index);
}

function uiNodesToUiTree(R) {
	let uiTree = {};
	for (const k in R.uiNodes) {
		let n = R.uiNodes[k];
		uiTree[k] = jsCopyMinus(n, 'act', 'ui', 'defParams', 'params');
	}
	return uiTree;
}
function saveObject(o, name) { localStorage.setItem(name, JSON.stringify(o)); }

function loadObject(name) { return JSON.parse(localStorage.getItem(name)); }

function normalizeRTree(R) {
	let rTree = jsCopy(R.rNodes);

	let first = R.tree.uid;
	let num = firstNumber(first);
	//console.log('lowest number is:',num,R)

	//prop = 'uid';
	// recFindExecute(rTree, prop, x=>normalizeObjectProp(x,prop,num) );
	//usage: safeRecurse(o, func, params, tailrec) 
	safeRecurse(rTree, normalizeNode, num, false);

	let newRTree = {};
	for (const k in rTree) {
		let kNew = normalizeVal(k, num);
		newRTree[kNew] = rTree[k];
	}
	rTree = newRTree;

	//console.log('old',R.rNodes);
	//console.log('new',rTree);
	return rTree;
}
function normalizeNode(o, num) {
	//console.log('________',o,num)
	//normalize uid
	if (isdef(o.uid)) normalizeObjectProp(o, 'uid', num);
	//normalize children
	if (isdef(o.children)) {
		//console.log('has children',o.children)
		o.children = o.children.map(x => normalizeVal(x, num));
		//console.log('has children',o.children)
	}
	//normalize uidParent
	if (isdef(o.uidParent)) normalizeObjectProp(o, 'uidParent', num);
	//console.log('result',o)
	if (isdef(o.key) && startsWith(o.key, 'sp_')) {
		let val = o.key.substring(2);
		o.key = 'sp' + normalizeVal(val, num);
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








