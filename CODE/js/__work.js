
function completeUiTree(R){
	// rtree is complete by this time!!!!!!!
	let uiRoot = R.uiNodes[R.tree.uid];
	console.log('uiRoot is',uiRoot);
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


