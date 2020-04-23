var R = null;
function run03(sp, defaults, sdata) {

	R = new RSG(sp, defaults, sdata);

	R.gen10(); //addSourcesAndPools, need cond to add _rsg to objects!
	//console.log(R.lastSpec.ROOT);

	R.gen11(); // add top level panel to root unless is single(!) panel
	R.gen12(); // creates places & refs and adds a specKey prop to each spec Node
	R.gen13(); // merges _ref nodes into _id nodes (_id & _ref) disappear?
	//R.gen14(); // merges type nodes into spec nodes =>type names disappear!
	//console.log('ROOT vor synthesis:\n',R.lastSpec.ROOT);

	R.gen20('table'); // expands root, creates 1 node for each ui and uis

	presentRoot(R.lastSpec.ROOT, 'results');

	//console.log(R.ROOT)
	//showString(R.ROOT);
	//showNodeInfo(R.ROOT, 'ROOT');
	//console.log(anyString3(R.ROOT));
	//recrec(R.ROOT,['row']);
	//showString(R.UIS)
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


