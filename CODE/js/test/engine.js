class TestEngine {
	constructor() {
		this.Dict = {};
		this.series = null; //name of test dir
		this.index = 0; //index of test case
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
	async loadTestCase(series, index) {
		let di = this.Dict[series];
		if (nundef(di)) { await this.loadSeries(series); di = this.Dict[series]; }

		let spec = di.specs[index];
		if (nundef(spec)) { index = 0; spec = di.specs[0]; }
		let serverData = di.serverData;

		this.series = series;
		this.index = index;
		localStorage.setItem('testSeries', this.series);
		localStorage.setItem('testIndex', this.index);
		//console.log('stored', this.series, this.index);

		mBy(this.buttonPrefix + series).innerHTML = series + ' ' + index;
		mBy('message').innerHTML = 'Rsg tester: ' + series + ' ' + index;

		this.presentCallback(spec, this.defs, serverData);
	}
	async loadSeries(series) {
		let path = '/assetsTEST/' + series + '/';
		this.series = series;
		//console.log('loading', path);
		this.Dict[series] = {
			specs: await loadYamlDict(path + '_spec.yaml'),
			serverData: await loadYamlDict(path + 'server.yaml')
		};

		//sowie in assets lade ich hier ein yaml dict 
		//lade es jedesmal frisch weil ja aenderungen!!!!!!
	}

	saveLastSpec(R) { saveObject(R.lastSpec, 'lastSpec_' + this.series + '_' + this.index); }
	saveRTree(R) { 
		console.log('saving',R);
		let r1=normalizeRTree(R);
		console.log('normalized',R)
		saveObject(normalizeRTree(R), 'rTree_' + this.series + '_' + this.index); 
	}
	saveUiTree(R) { 
		saveObject(uiNodesToUiTree(R.uiNodes), 'uiTree_' + this.series + '_' + this.index); 
	}
	saveOidNodes(R) { saveObject(R.oidNodes, 'oidNodes_' + this.series + '_' + this.index); }
	loadLastSpec() { return loadObject('lastSpec_' + this.series + '_' + this.index); }
	loadRTree() { return loadObject('rTree_' + this.series + '_' + this.index); }
	loadUiTree() { return loadObject('uiTree_' + this.series + '_' + this.index); }
	loadOidNodes() { return loadObject('oidNodes_' + this.series + '_' + this.index); }

	loadSolution() {
		let lastSpec = this.loadLastSpec();
		if (nundef(lastSpec)) { return null; }
		let rTree = this.loadRTree();
		let uiTree = this.loadUiTree();
		let oidNodes = this.loadOidNodes();

		this.solution = {
			lastSpec: lastSpec,
			rTree: rTree,
			uiTree: uiTree,
			oidNodes: oidNodes
		};
		return this.solution;
	}
	saveAsSolution(R) {
		this.saveLastSpec(R);
		this.saveRTree(R);
		this.saveUiTree(R);
		this.saveOidNodes(R);

	}
	verify(R) {
		//console.log('R',R.rNodes);
		let rTreeNow = normalizeRTree(R);//.rNodes;
		let solution = this.loadSolution();

		if (!solution) {
			//console.log('No solution available for test',this.series,this.index);
			this.saveAsSolution(R);
			return;
		}else{
			//console.log('solution',this.solution.rTree);
		}
		let rTreeSolution = this.solution.rTree;
		let changes = propDiffSimple(rTreeNow,rTreeSolution);
		if (changes.hasChanged) {
			console.log('changed:','rTree','\nchanges',changes);
		} else {
			console.log('correct!','rTree')
		}

		return;
		let rProcessed ={
			lastSpec:R.lastSpec,
			rTree:R.rNodes,
			uiTree: uiNodesToUiTree(R.uiNodes),
			oidNodes:R.oidNodes,
		};


		for (const k of ['lastSpec', 'rTree', 'uiTree', 'oidNodes']) {
			//console.log(this.solution)
			
			let changes = propDiffSimple(this.solution[k], rProcessed[k]);
			if (changes.hasChanged) {
				console.log('change:',k,'\nchanges',changes,'\nsolution',this.solution,'\nactual',R);
			} else {
				console.log('correct!',k)
			}
		}

	}
}

function uiNodesToUiTree(R){
	let uiTree = {};
	for(const k in R.uiNodes){
		let n=R.uiNodes[k];
		uiTree[k]=jsCopyMinus(n,'act','ui','defParams','params');
	}
	return uiTree;
}
function saveObject(o, name) { localStorage.setItem(name, JSON.stringify(o)); }

function loadObject(name) { return JSON.parse(localStorage.getItem(name)); }

function normalizeRTree(R){
	let rTree = jsCopy(R.rNodes);

	let first = R.tree.uid;
	let num = firstNumber(first);
	//console.log('lowest number is:',num,R)

	//prop = 'uid';
	// recFindExecute(rTree, prop, x=>normalizeObjectProp(x,prop,num) );
	//usage: safeRecurse(o, func, params, tailrec) 
	safeRecurse(rTree, normalizeNode, num, false );

	let newRTree = {};
	for(const k in rTree){
		let kNew = normalizeVal(k,num);
		newRTree[kNew]=rTree[k];
	}
	rTree = newRTree;

	//console.log('old',R.rNodes);
	//console.log('new',rTree);
	return rTree;
}
function normalizeNode(o,num){
	//console.log('________',o,num)
	//normalize uid
	if (isdef(o.uid)) normalizeObjectProp(o,'uid',num);
	//normalize children
	if (isdef(o.children)){
		//console.log('has children',o.children)
		o.children = o.children.map(x=>normalizeVal(x,num));
		//console.log('has children',o.children)
	} 
	//normalize uidParent
	if (isdef(o.uidParent)) normalizeObjectProp(o,'uidParent',num);
	//console.log('result',o)
}
function normalizeObjectProp(o,prop,num){
	//console.log(o[prop])
	o[prop]=normalizeVal(o[prop],num);
	//console.log(o)
}
function normalizeVal(val,num){
	let nval = firstNumber(val);
	//console.log(val,num,nval,typeof nval);
	nval-=num;
	return '_'+nval;
}








