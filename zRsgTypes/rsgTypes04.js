
class RSG {
	constructor(sp, defs, sdata) {
		this.gens = [sp];
		this.sp = sp;
		this.lastSpec = sp;
		this.defs = defs;
		this.sData = sdata;
		this.UIS = {};
	}
	registerNode(n) { n.uid = getUID(); this.UIS[n.uid] = n; }
	unregisterNode(n) { delete this.UIS[n.uid]; }
	setUid(n) { n.ui.id = n.uid; }
	gen10() {
		let [gen, pools] = addSourcesAndPools(this);
		this.gens.push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.POOLS = pools; //not sure if need this.POOLS at all!!!
	}
	gen20(area) {
		let spec = jsCopy(this.lastSpec);

		this.ROOT = createLC(spec.ROOT, spec.ROOT.content, area, this);
		console.log('UIS', R.UIS);
		console.log('ROOT', R.ROOT);
	}
	// lastGen() { return last(this.gens); }

}

function showNodeInfo(n, title) {
	console.log(title,
		isdef(n.type) ? ' type:' + n.type : '',
		isdef(n.uid) ? 'uid:' + n.uid : '',
		isdef(n.pool) ? 'pool:' + n.pool.map(x => x) : '',
		isdef(n.content) ? 'content:' + (isList(n.content) ? n.content.map(x => x) : n.content) : '',
		isdef(n.oid) ? 'oid:' + n.oid : '');
}

function createLC(n, content, area, R) {
	// n ist already a copy of the node to be created

	R.registerNode(n);
	console.log('_____________________ createLC');
	showNodeInfo(n, 'n');
	//let content = n.content;
	//console.log(' content', content);
	if (isContainerType(n.type)) { //replace by isContainerType
		n.ui = mDiv(mBy(area));
		//console.log('::pool', isdef(n.pool) ? n.pool.map(x => x) : 'no_pool')
		if (isdef(content) && isList(content)) {
			//pass as pool to container content
			let prop = RCONTAINERPROP[n.type];
			let n1 = n[prop];
			n1.pool = content; //intersect!
			console.log('JETZT!!!', n.pool)
		}
		R.setUid(n);
		n.children = createChi(n, R);
	} else if (isdef(R.lastSpec[n.type])) {
		//merge node n w/ that spec node
		console.log('haaaaaaaaaaaaaaaaaaaaalo')
		let pool = n.pool;
		let nType = R.lastSpec[n.type];
		R.unregisterNode(n)
		n = deepmergeOverride(n, nType);
		//intersect pools!!!
		if (isdef(pool)) n.pool = intersection(n.pool,pool);
		console.log('new node',n,n.pool);
		return createLC(n, n.content, area, R);

	} else {
		n.ui = mInfo(content, mBy(area)); // mTextDiv(content,mBy(area));
		R.setUid(n);
	}
	return n;
}

//das muss doch irgendwie einfacher gehen!!!
function createChi(nCont, R) {
	let prop = RCONTAINERPROP[nCont.type];
	//console.log('prop is', prop);
	let n = nCont[prop];
	//console.log('createChildren', n.uid,n.pool,n.oid);


	console.log('_____________________ createChildren of', nCont.uid)
	showNodeInfo(nCont, 'container');
	if (!isList(n)) showNodeInfo(n, 'children'); else console.log('liste!!!')
	//, n.type, isdef(n.pool) ? n.pool.map(x => x) : 'no_pool', n.oid);

	let chNodes = [];
	//cases 0: n is a list
	if (isList(n)) {
		console.log('...case 0');
		for (const x of n) {
			let n1 = jsCopy(x);
			let content = null;
			if (isdef(nCont.oid) && nundef(n1.oid)) {
				n1.oid = nCont.oid;
				content = calcContent(R.sData[n1.oid], n1.data);
			}
			n1.content = content;
			createLC(n1, n1.content, nCont.uid, R);
			chNodes.push(n1);
		}
	}
	//cases 1-4: n is a dict
	//case 1: wenn n ein pool besitzt muss fuer jedes el im pool 1 child gemacht werden
	else if (isdef(n.pool)) {
		console.log('...case 1')
		for (let i = 0; i < n.pool.length; i++) {
			let n1 = jsCopy(n);
			n1.oid = n.pool[i];
			n1.content = n.data ? calcContent(R.sData[n1.oid], n.data) : null;
			createLC(n1, n1.content, nCont.uid, R);
			chNodes.push(n1);
		}
	}
	//case 2: wenn n ein oid besitzt muss fuer dieses 1 child gemacht werden
	else if (isdef(n.oid)) {
		console.log('...case 2')
		let n1 = jsCopy(n);
		n1.content = n.data ? calcContent(R.sData[n1.oid], n.data) : null;
		createLC(n1, n1.content, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 3: wenn n ein data besitzt muss fuer dieses 1 child gemacht werden
	else if (isdef(n.data) && n.data[0] == '.' && isdef(nCont.oid)) {
		console.log('...case 3')
		let n1 = jsCopy(n);
		n1.oid = nCont.oid;
		n1.content = calcContent(R.sData[n1.oid], n.data);
		createLC(n1, n1.content, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 4: wenn n containerType ist und parent container ein oid hat muss fuer dieses 1 child gemacht werden
	else if (isContainerType(n.type) && isdef(nCont.oid)) {
		console.log('...case 4')
		let n1 = jsCopy(n);
		n1.oid = nCont.oid;
		n1.content = null;
		createLC(n1, n1.content, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 5: n.data, n NOT container, nCont.pool + nCont.data, NO nCont.oid, 
	else if (isdef(n.data) && !isContainerType(n.type) && nundef(nCont.oid) && isdef(nCont.pool) && isdef(nCont.data)) {
		console.log('...case 5');
		//dieses pool darf nur 1 element haben!!!
		nCont.oid = nCont.pool[0];
		//die data muessen in diesem fall eine liste (of objects!)
		//erstmal brauch ich die data
		let data = calcContent(R.sData[nCont.oid], nCont.data);
		console.log('::::::::data', data);
		//let n1 = jsCopy(n);
		n.pool = data;
		console.log('have to create info foreach of pool of', n);
		chNodes = createChi(nCont, R);
	}
	//case 6: n.data, n NOT container, nCont.pool, NO nCont.oid, NO nCont.data
	else if (isdef(n.data) && !isContainerType(n.type) && nundef(nCont.oid) && isdef(nCont.pool) && isdef(nCont.data)) {
		console.log('...case 6');
		//dieses pool darf nur 1 element haben!!!
		nCont.oid = nCont.pool[0];
		//die data muessen in diesem fall eine liste sein
		let n1 = jsCopy(n);
		n1.content = n.data;
		createLC(n1, n1.content, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 10: n.data, n NOT container, NO nCont.pool, NO nCont.oid, NO nCont.data
	else if (isdef(n.data) && !isContainerType(n.type) && nundef(nCont.oid) && nundef(nCont.pool)) {
		console.log('...case 10')
		let n1 = jsCopy(n);
		n1.content = n.data;
		createLC(n1, n1.content, nCont.uid, R);
		chNodes.push(n1);
	}
	return chNodes;

}

function isContainerType(t) { return t == 'panel' || t == 'list'; }
function childrenPath(path, i) {
	return path + (path[path.length - 1] == '.' ? '' : '.') + 'children.' + i;
}
const PARAMCSS = {
	bg: 'background-color',
	fg: 'color',
	font: 'font'
}
function paramsToCss(params) {
	let res = {};
	for (const k in params) {
		let name = PARAMCSS[k];
		if (nundef(name)) name = k;
		res[name] = params[k];
	}
	return res;
}
function justIds(o) {
	return Object.keys(o);
}
//#region _source, cond => source, pool, _rsg
function addSourcesAndPools(R) {
	//source and cond can only occur at top level!

	let sp = jsCopy(R.lastSpec);
	let pools = {}; //cache pools koennt ma auch an R anhaengen!!!

	//to each sp node add pool if does not have _source
	let missing = [];
	for (const k in sp) {
		let n = sp[k];
		//console.log('node is', k, n)
		if (nundef(n._source)) {
			n.source = justIds(R.sData);
			pools[k] = n.pool = makePool(n.cond, n.source, R);
			console.log(n.source, n.pool);
		} else missing.push(k);
	}

	//console.log('missing', missing);
	//let safe = 10;
	while (missing.length > 0) { // || safe < 0) {
		//safe -= 1;

		//find key in missing for which 
		let done = null;
		for (const k of missing) {
			let node = sp[k];
			let sourceNode = sp[node._source];
			//console.log('search', k, node._source);
			if (nundef(sourceNode.pool)) continue;

			node.source = sourceNode.pool;
			pools[k] = node.pool = makePool(node.cond, node.source, R);
			done = k;
			break;

		}
		removeInPlace(missing, done);
		//console.log('missing', missing);
	}

	//console.log('POOLS', pools);
	return [sp, pools];
}

// helpers
function makePool(cond, source, R) {
	if (nundef(cond)) return [];
	// console.log('cond', cond, 'source', source);
	let pool = [];
	for (const oid of source) {

		let o = R.sData[oid];
		// console.log('o', o)
		if (!evalConds(o, cond)) continue;

		pool.push(oid);//[oid] = o;
	}
	return pool;

}
function evalCond(o, condKey, condVal) {
	let func = FUNCTIONS[condKey];
	if (isString(func)) func = window[func];
	if (nundef(func)) return false;
	return func(o, condVal);
}
function evalConds(o, conds) {
	for (const [f, v] of Object.entries(conds)) {
		if (!evalCond(o, f, v)) return false;
	}
	return true;
}
//#endregion





