var R = null;
function run02(sp, defaults, sdata) {

	R = new RSG(sp, defaults, sdata);

	R.gen10();

	presentGeneration(R.lastGen(), 'results');
	presentServerData(R.sData, 'sData');

	R.gen20('tree');

	//first, sources are made for each sp object
	//let stepEngine=new Engine();


}

function getFirstKey(o) { return Object.keys(o)[0]; }


function calcContent(o,path){

	if (path[0] != '.') return path;

	let props = path.split('.').slice(1);
	// console.log(props, 'props');
	let content = isEmpty(props) ? o : lookup(o, props);
	return content;

}
function infoCalcData_dep(n, R) {
	if (nundef(n.data)) return 'empty';
	if (n.data[0] != '.') return n.data;

	// path! starts with '.'
	//n.oid should already be there!!!!!!!!!!!
	if (nundef(n.oid)) { n.oid = getFirstKey(n.pool); }
	let o = n.pool[oid];

	let path = n.data;
	let props = path.split('.').slice(1);

	console.log(props, 'props');

	let content = isEmpty(props) ? o : lookup(o, props);
	return content;
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


