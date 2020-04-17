function mergeChildrenWithRefs(o, R) {
	for (const k in o) {
		let ch = o[k];
		if (nundef(ch._id)) continue;
		let loc = ch._id;
		let refs = R.refs[loc];
		if (nundef(refs)) continue;
		// console.log('sollte', o, 'o[' + k + '] mit', refs, 'mergen');
		// console.log('refs', refs);
		// console.log('refs', Object.keys(refs));
		let spKey = Object.keys(refs)[0];
		let nSpec = R.lastSpec[spKey];
		console.log('nSpec', nSpec);
		// console.log(refs[loc]);
		// console.log(R);
		// console.log(R);
		let oNew = deepmerge(o[k], nSpec);
		console.log('neues child', oNew);
		o[k]=oNew;


	}
}


var R = null;
function run03(sp, defaults, sdata) {

	R = new RSG(sp, defaults, sdata);

	R.gen10(); //addSourcesAndPools, need cond to add _rsg to objects!
	console.log(R.lastSpec.ROOT);

	R.gen11(); // add top level panel to root if root.type != panel, nothing else!
	R.gen12(); // creates places & refs and adds a specKey prop to each spec Node
	R.gen13(); // merges _ref nodes into _id nodes
	console.log(R.lastSpec.ROOT);

	R.gen20('table'); // expands root, creates 1 node for each ui and uis

	presentRoot(R.lastSpec.ROOT,'results');
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


