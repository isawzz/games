
function createPresentationNodeForOid(oid, R) {
	let o = R.sData[oid];
	let stypes = o._rsg;
	// if (verbose) consOutput(oid, stypes);
	//if (isEmpty(stypes)) continue;
	//if no type is found, use default presentation! this child is not presented!

	let nrep = {};
	if (isEmpty(stypes)) {
		nrep = defaultPresentationNode(oid, o, R);
	} else {
		for (const t of stypes) { nrep = deepmergeOverride(nrep, R.lastSpec[t]); }
		delete nrep.source;
		delete nrep.pool;
	}

	// if (verbose) consOutput('YES', oid, stypes, nrep);
	// if (verbose) consOutput('need to make a child for', oid, n, nrep);
	let n1 = nrep;
	n1.oid = oid;
	n1.content = nrep.data ? calcContent(R.sData[oid], nrep.data) : null;

	return n1;
}
function defaultPresentationNode(oid, o, R) {

	//if o is a list of oids: again, look for spec nodes!
	let nrep = {};
	//console.log('def rep:', oid, o);

	//if o has one or more properties that are lists of oids
	//can present this in a better way!!!
	let objLists = getElementLists(o);
	//console.log('-------', objLists);
	if (isEmpty(objLists)) {
		let litProp = firstCondDictKV(o, (k, v) => k != 'obj_type' && isLiteral(v));
		let content = litProp ? o[litProp] : o.obj_type + ' ' + oid;
		nrep = { type: 'info', data: content };

	} else {
		//work with objLists
		//erstmal nur 1. list
		let key1 = Object.keys(objLists)[0];
		let list1 = Object.values(objLists)[0];
		console.log('defaultPresentationNode: first list is:', key1,list1);
		//let content = list1.join(' ');
		//in wirklichkeit such ich hier nach available spec node fuer jedes el von list1
		nrep = { type: 'list', pool: list1, elm: '.'+key1};

		//createPresentationNodeForOid(oid, R)
	}

	return nrep;


}





function mergeChildrenWithRefs(o, R) {
	for (const k in o) {
		let ch = o[k];
		if (nundef(ch._id)) continue;
		let loc = ch._id;
		let refs = R.refs[loc];
		if (nundef(refs)) continue;
		let spKey = Object.keys(refs)[0];
		let nSpec = R.lastSpec[spKey];
		//console.log('nSpec', nSpec);
		let oNew = deepmerge(o[k], nSpec);
		//console.log('neues child', oNew);
		o[k] = oNew;


	}
}


var R = null;
function run03(sp, defaults, sdata) {

	R = new RSG(sp, defaults, sdata);

	R.gen10(); //addSourcesAndPools, need cond to add _rsg to objects!
	//console.log(R.lastSpec.ROOT);

	R.gen11(); // add top level panel to root unless is single(!) panel
	R.gen12(); // creates places & refs and adds a specKey prop to each spec Node
	R.gen13(); // merges _ref nodes into _id nodes
	//console.log('ROOT vor synthesis:\n',R.lastSpec.ROOT);

	R.gen20('table'); // expands root, creates 1 node for each ui and uis

	presentRoot(R.lastSpec.ROOT, 'results');
}






























class Engine {
	constructor() {
		this.examples = { a: 5, b: 0 };
		this.sDataExamples = ['a00', 'b00'];
		this.urls = [];
		let serverDataName = null;
		this.iTest = 0;
		for (const [k, v] of Object.entries(this.examples)) {
			let urlServerData = '/EXAMPLES/' + k + '00/serverData.yaml';
			for (let i = 0; i <= v; i++) {
				let fdName = k + '0' + i;
				let testInfo = {
					urlSpec: '/EXAMPLES/spec/' + fdName + '.yaml',
					urlServerData: urlServerData,
				}
				this.urls.push(testInfo);
			}
		}
		console.log(this.urls);
	}
	loadNextExample() {

	}
}


