function addObjectToRoot(oid, o, R) {

	//console.log('_____________ add object', oid, o);

	R.addObject(oid, o);
	addRForObject(oid,R);

	//console.log('spec nodes:', R.getR(oid)); //spec nodes for this object

	//console.log('tree:', R.tree);
	if (nundef(R.tree)) R.tree = {};

	//console.log('places', R.places);
	//console.log('refs', R.refs);

	// *** simplification: rsg[oid] only 1 element!
	// *** simplification: cond node are ONLY type info! ***
	let t1 = makeNodesForObject(oid, o, R);

	ensureRoot(R);

	//console.log('==>NO',R.NO)
	//console.log('==>TREENODES',R.TREENODES)

	einhaengen(t1, R);



}
function ensureRoot(R){
	//console.log('-----------',R.tree,isEmpty(R.tree))
	if (nundef(R.tree) || isEmpty(R.tree)){
		console.log('____________ creating new tree!!!!!!!!!!!!!!!!!')
		R.TREENODES={};
		R.LOCATIONS={};
		R.NodesByUid = {};
		R.tree=recBuild(R.lastSpec.ROOT,'.',null,R.lastSpec,R);
		R.TREENODES['.']=R.tree;

	}else{
		//console.log('(tree present!)');

	}
	//console.log('==> R.tree:',R.tree)
}
function recBuild(n,path,parent,sp,R){
	//console.log('***',n,path,parent,sp)
	let n1={uid:getUID(),uidParent:parent?parent.uid:null,path:path};

	let locProp = isdef(n._id)?'_id':isString(n.type)&&isdef(sp[n.type])?'type':'p';
	if (isString(n[locProp])) {
		console.log('location:',n[locProp],n1);
		lookupAddToList(R.LOCATIONS,[n[locProp]],n1.path)
	}

	let chProp = isContainerType(n.type)? RCONTAINERPROP[n.type]:'ch';
	let chlist=n[chProp];
	if (isdef(chlist)){
		n1.children=[];
		let i=0;
		for(const chInfo of chlist){
			//console.log('info',info);
			let newPath = path+(endsWith(path,'.')?'':'.')+i;
			i+=1;
			let ch=recBuild(chInfo,newPath,n1,sp,R);
			R.TREENODES[newPath]=ch;
			R.NodesByUid[ch.uid]=ch;
			n1.children.push(ch.uid);
		}
	}
	return n1;

}
function addRForObject(oid, R) {
	let o = R.getO(oid);
	let sp = R.getSpec();
	for (const k in sp) {
		let n = sp[k];
		//console.log('node', n)
		if (nundef(n.cond)) continue;
		if (n.cond == 'all' || evalConds(o, n.cond)) {
			//console.log('...valid for', oid)
			R.addR(oid, k);
			//console.log('...keys for',oid,R.getR(oid));
		}
	}
}
function makeNodeForOid(oid,o,k,R){
	let n = R.getSpec(k);
	//console.log('build', k, n, 'for', oid, o);
	let n1 = { key: k, oid: oid, uid: getUID() };
	return n1;
}
function makeNodesForObject(oid, o, R) {
	let klist = R.getR(oid);
	let nlist = {};
	for(const k of klist){
		let n1=makeNodeForOid(oid,o,k,R);
		nlist[k]=n1;
	}
	R.NO[oid]=nlist;
}


function einhaengen(n1, R) {
	//for now, n1 is a leaf (info type)
	//wo muss n1 eingehaengt werden?
	let t = R.tree;
	if (isEmpty(t)) {
		console.log('root is empty!!!');
		buildRoot(R);
	}
}
function buildRoot(R) {
	let t = R.tree;
	let k = 'ROOT';
	let sp = R.lastSpec;

	let tres = recBuild(t, k, sp, R);
	console.log(tres)
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


