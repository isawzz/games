function generateUis(area, R) {
	//go through rsg tree DFS 
	//merge info for each node (temp!)
	//eval content =>could lead to more nodes being added as children!
	ensureUiNodes(R);
	let n = R.tree;
	let defParams = {};// { bg: 'blue', fg: 'white' };
	//console.log(n);
	recBuildUis(n, area, R, 'ROOT', '.', defParams, null);
}
function ensureUiNodes(R){if(nundef(R.uiNodes)) R.uiNodes = {};}
function recBuildUis(n, area, R, key, relpath, params={}, oid=null) {
	let n1 = {};//assembled node!its ui should be in mBy(area)

	//console.log('________________ recBuildUis')
	//console.log('n', n, '\narea', area, '\nkey', key, 'relpath', relpath, '\nparams', params, '\noid', oid);
	//console.log('was jetzt? =>brauche spec node');

	let sp = R.getSpec();
	key = isdef(n.key) ? n.key : key;
	let nSpec = sp[key];

	//console.log('......nSpec',key, nSpec);
	//console.log('was jetzt? =>copy some props to n1, which ones?');

	if (isdef(n.key)) n1 = deepmergeOverride(nSpec, n);
	else {
		//console.log('TODO!!!! evalSpecPath')
		let nRel = evalSpecPath(nSpec, relpath, R);
		n1 = deepmergeOverride(nRel, n);
		//console.log('ergebnis von evalSpecPath', nRel)
		//console.log('n1', n1)
	}

	//als erstes kommen default params fuer type
	//dann kommen nSpec.params falls key oder params+nSpec.params falls nicht n.key

	//reset params if have a new spec key!
	// n1.params = isdef(n.key) ? isdef(nSpec.params) ? nSpec.params : {}
	// 	: isdef(nSpec.params) ? nSpec.params : params;
	
	//if (nundef(n1.params)) n1.params=params; else n1.params = deepmergeOverride(params,n1.params);
	n.defParams = params;

	//console.log('HAAAAAAAAAAAAAAAALo')
	oid = n1.oid ? n1.oid : oid;
	let o = oid ? R.getO(oid) : null;
	//console.log('HAAAAAAAAAAAAAAAALo')
	if (n1.data) n1.content = calcContentFromData(oid, o, n1.data, R);

	//console.log('HAAAAAAAAAAAAAAAALo',n1.content)
	
	// if (oid == 'p1'){
	// 	console.log('===>params',n1.params);
	// }

	n1.ui = createUi(n1, area, R);

	//console.log('n1', n1);
	R.uiNodes[n1.uid]=n1;

	//return;
	//recurse for ch property
	if (nundef(n1.children)) return;
	let i = 0;
	for (const ch of n1.children) {
		//console.log('ch ...should be _2, then _7...', ch);
		let nNew = R.NodesByUid[ch];
		let keyNew = key;
		//console.log('key ...should be ROOT, then A...', keyNew);
		let relpathNew = isdef(n.key) ? '.' + i : extendPath(relpath, i);
		//console.log('relpath ...should be .0, then .0...', relpathNew);
		let paramsNew = n1.params;
		//console.log('params ...should be bg:green..., then info params...', paramsNew);
		let oidNew = isdef(n1.oid) ? n1.oid : null;
		//console.log('oid ...should be null, then c1...', oidNew);

		recBuildUis(nNew, n1.uid, R, keyNew, relpathNew, paramsNew, oidNew);

		i += 1;
	}
}


function evalSpecPath(n, relpath, R) {
	//for now NUR panels oder ch als children prop erlaubt!
	//return partial spec node under n, following relpath
	//console.log('path', relpath, 'n', n);
	if (isEmpty(relpath)) return null;
	if (relpath == '.') return n;
	let iNext = firstNumber(relpath);

	nNext = n.panels[iNext];
	//let uidNext = n.children[next];
	//let nNext=R.NodesByUid[uidNext];
	let newPath = stringAfter(relpath, '.' + iNext);
	if (isEmpty(newPath)) return nNext;
	else return evalSpecPath(nNext, newPath, R);


}

function normalizeSpec(sp) {
	//preprocess sp:
	//each spec node is normalized: gets type, container prop=>ch, _id prop=>p
	let spNew = {};
	for (const k in sp) {
		spNew[k] = recNormalize(sp[k], sp);
	}
	return spNew;

}
function recNormalize(n, sp) {
	let n1 = jsCopy(n);
	let t = n1.type = nundef(n.type) ? inferType(n) : n.type;

	let locProp = 'panel';// isdef(n._id) ? '_id' : isString(n.type) && isdef(sp[n.type]) ? 'type' : 'p';
	if (locProp != 'p') {
		n1.p = n[locProp];
		delete n1[locProp];
	}
	let contProp = 'panels';// nundef(n.ch) && isContainerType(n1.type) ? RCONTAINERPROP[n1.type] : null;
	//console.log(contProp);
	if (contProp && isdef(n[contProp])) {
		n1.ch = n[contProp].map(x => recNormalize(x, sp));
		delete n1[contProp];
	}
	return n1;

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


