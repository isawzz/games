function generateUis(area, R) {
	//go through rsg tree DFS 
	//merge info for each node (temp!)
	//eval content =>could lead to more nodes being added as children!
	ensureUiNodes(R);
	let n = R.tree;
	let defParams = {};// { bg: 'blue', fg: 'white' };
	//console.log(n);
	recBuildUiFromNode(n, area, R, 'ROOT', '.', defParams, null);

	R.instantiable = [];
	for (const x in R.UIS) {
		let y = R.UIS[x];
		if (isdef(y.act) && isdef(y.oid) && isdef(y.key)) R.instantiable.push({ oid: y.oid, key: y.key });
		// Object.values(R.UIS).map(x=>{x.uid,x.oid,x.key});
	}

}
function ensureUiNodes(R) { if (nundef(R.uiNodes)) R.uiNodes = {}; }


function recBuildUiFromNode(n, area, R, key, relpath, params = {}, oid = null) {
	//n is unique tree node (treeNodesByOidAndKey) for oid and key
	let n1 = {};
	let sp = R.getSpec();

	//find specNode[s] (for now just 1 allowed!) for this oid and merge it into tree node n
	//invariant: if oid != null n.key is defined! (so evalSpec wont be called with an oid)
	console.assert(oid==null || isdef(n.key), 'recBuildUiFromNode assertion does NOT hold!!!!',n);
	key = isdef(n.key) ? n.key : key;
	
	let nSpec = sp[key];
	if (isdef(n.key)) n1 = deepmergeOverride(nSpec, n);
	else { let nRel = evalSpecPath(nSpec, relpath, R); n1 = deepmergeOverride(nRel, n); }

	n.defParams = params;
	oid = n1.oid ? n1.oid : oid;
	let o = oid ? R.getO(oid) : null;
	if (n1.data) n1.content = calcContentFromData(oid, o, n1.data, R);
	n1.ui = createUi(n1, area, R);
	R.uiNodes[n1.uid] = n1;
	
	if (R.isUiActive) n1.act.activate(highSelfAndRelatives,unhighSelfAndRelatives,selectUid);
	
	if (nundef(n1.children)) return;

	let i = 0;
	for (const ch of n1.children) {
		let nNew = R.NodesByUid[ch];
		let keyNew = key;
		let relpathNew = isdef(n.key) ? '.' + i : extendPath(relpath, i);
		let paramsNew = n1.params;
		let oidNew = isdef(n1.oid) ? n1.oid : null;
		recBuildUiFromNode(nNew, n1.uid, R, keyNew, relpathNew, paramsNew, oidNew);
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


