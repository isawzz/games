function addObjectToRoot(oid, o, R) {

	//console.log('_____________ add object', oid, o);

	R.addObject(oid, o);
	addRForObject(oid, R);

	//console.log('spec nodes:', R.getR(oid)); //spec nodes for this object

	//console.log('tree:', R.tree);
	if (nundef(R.tree)) R.tree = {};

	//console.log('places', R.places);
	//console.log('refs', R.refs);

	// *** simplification: rsg[oid] only 1 element!
	// *** simplification: cond node are ONLY type info! ***
	makeNodesForObject(oid, o, R);

	ensureRoot(R);

	//console.log('==>NO',R.oidNodes)
	//console.log('==>NodesByUid',R.NodesByUid)

	einhaengen(oid, o, R);



}
function ensureRoot(R) {
	//console.log('-----------',R.tree,isEmpty(R.tree))
	if (nundef(R.tree) || isEmpty(R.tree)) {
		console.log('____________ creating new tree!!!!!!!!!!!!!!!!!')
		R.LocToUid = {};
		R.NodesByUid = {};
		R.tree = recBuild(R.lastSpec.ROOT, '.', null, R.lastSpec, R);
		R.NodesByUid[R.tree.uid] = R.tree;

	} else {
		//console.log('(tree present!)');

	}
	//console.log('==> R.tree:',R.tree)
}
function extendPath(path, postfix) { return path + (endsWith(path, '.') ? '' : '.') + postfix; }
function recBuild(n, path, parent, sp, R) {
	//console.log('***',n,path,parent,sp)
	let n1 = { uid: getUID(), uidParent: parent ? parent.uid : null, path: path };

	let locProp = isdef(n._id) ? '_id' : isString(n.type) && isdef(sp[n.type]) ? 'type' : 'p';
	let nodeName = n[locProp];
	if (isString(nodeName)) {
		//console.log('location:', nodeName, n1);
		//lookupAddToList(R.LOCATIONS, [nodeName], n1.path);
		lookupAddToList(R.LocToUid, [nodeName], n1.uid);
		n1.here = nodeName;
	}

	let chProp = isContainerType(n.type) ? RCONTAINERPROP[n.type] : 'ch';
	let chlist = n[chProp];
	if (isdef(chlist)) {
		n1.children = [];
		let i = 0;
		for (const chInfo of chlist) {
			//console.log('info',info);
			let newPath = extendPath(path, i);// path + (endsWith(path, '.') ? '' : '.') + i;
			i += 1;
			let ch = recBuild(chInfo, newPath, n1, sp, R);
			R.NodesByUid[ch.uid] = ch;
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
function makeNodeForOid(oid, o, k, R) {
	let n = R.getSpec(k);
	//console.log('build', k, n, 'for', oid, o);
	let n1 = { key: k, oid: oid, uid: getUID() };
	return n1;
}
function makeNodesForObject(oid, o, R) {
	let klist = R.getR(oid);
	let nlist = {};
	for (const k of klist) {
		let n1 = makeNodeForOid(oid, o, k, R);
		nlist[k] = n1;
	}
	R.oidNodes[oid] = nlist;
}

function removeOidFromLoc(oid, loc, R) {
	//muss es auch noch geben!!!! wenn oid noch existiert aber cond nicht mehr fuer diese loc zutrifft!
	let oidNode = R.oidNodes[oid][loc];
	delete R.oidNodes[oid][loc];
	//console.log('...oidNode',oid,loc,'deleted')
	//return; 

	let parents = R.LocToUid[loc];
	for (const uidParent of parents) {
		//console.log('?????????????', uidParent);
		let n = R.NodesByUid[uidParent]; //jetzt habe tree nodes von parent in dem oid haengt!

		//muss jetzt von diesem parent children das child finden das oid corresponded
		if (nundef(n.children)) {
			error('SOMETHING IS SERIOUSLY WRONG!!!!!!! PARENT', uidParent, 'DOES NOT HAVE CHILDREN!!!!!');
			return;
		}
		let ch = firstCond(n.children, x => R.NodesByUid[x].oid == oid);
		if (!ch) {
			error('SOMETHING IS SERIOUSLY WRONG!!!!!!! CHILD', oid, 'DOES NOT EXIST!!!!!');
			return;
		}

		//diese plus alle descendants muessen removed werden!!!!
		let n1 = R.NodesByUid[ch];

		//console.log('will remove branch starting at:', ch, n1);
		recRemove(n1, R);
		//ev koennte auch falls kein child mehr bei diesem parent ist, den parent removen??
	}
}

function recRemove(n, R) {
	delete R.NodesByUid[n.uid];
	let parent = R.NodesByUid[n.uidParent];
	removeInPlace(parent.children,n.uid);
	if (isEmpty(parent.children)) delete parent.children;
	if (nundef(n.children)) return;
	for (const ch of n.children) recRemove(R.NodesByUid[ch], R);
}


function aushaengen(oid, R) {
	//remove all nodes representing oid from R.tree
	//passiert wenn eine server object removed wird

	//an welchen locations gibt es dieses oid object als child?
	let nodes = R.oidNodes[oid];
	if (isEmpty(nodes)) return;
	//return;
	console.log('_______REMOVE!', oid, nodes);
	for (const loc in nodes) {
		//hier kann: removeOidFromLoc aufrufen, das das folgende macht
		removeOidFromLoc(oid, loc, R);
	}
}

function einhaengen(oid, o, R) {

	let t = R.tree;

	//LocToUid: nodeName => uid, eg. A: _3, _5
	//NodesByUid: uid => node, eg. _3: {uid,uidParent,path,children,here} =>R.tree
	//oidNodes: oid,loc => {uid,key,oid} =>need to pull o from sData, key from spec & combine
	let nodes = R.oidNodes[oid];
	if (isEmpty(nodes)) return;
	//return;
	//console.log('_______einhaengen', oid, nodes);
	for (const loc in nodes) {
		let oidNode = nodes[loc];
		let uid = oidNode.uid;

		let parents = R.LocToUid[loc];
		for (const uidParent of parents) {
			//console.log('?????????????', uidParent)
			let n = R.NodesByUid[uidParent];
			if (nundef(n.children)) n.children = [];
			let index = n.children.length;
			//muss aber auch noch einen node produzieren fuer dieses child!!!
			let newPath = extendPath(n.path, index);
			//console.log('newPath', newPath)
			let n1 = { uid: getUID(), uidParent: uidParent, oid: oid, uidOidNode: uid, path: newPath };
			//console.log('uid', n1.uid)
			R.NodesByUid[n1.uid] = n1;
			n.children.push(n1.uid);

		}

	}

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


