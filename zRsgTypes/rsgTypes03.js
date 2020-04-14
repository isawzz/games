
class RSG {
	constructor(sp, defs, sdata) {
		this.gens = [sp];
		this.sp = sp;
		this.defs = defs;
		this.sData = sdata;
		this.UIS = {};
	}
	registerNode(n) { n.uid = getUID(); this.UIS[n.uid] = n; }
	setUid(n) { n.ui.id = n.uid; }
	gen10() {
		let [gen, pools] = addSourcesAndPools(this);

		console.log(gen, pools)

		for (const k in gen) {
			let n = gen[k];
			for (const oid of n.pool) {
				let o = this.sData[oid];
				lookupAddToList(o, ['_rsg', 'spKeys'], k);
			}
		}

		this.gens.push(gen);
		this.POOLS = pools;
	}
	gen20(area) {
		let spec = jsCopy(this.lastGen());

		//mTextDiv('haaaaaaaaaaaaaaaaalo',mBy('tree'))
		R.ROOT=createLC(spec.ROOT, null, area, R);
		console.log('UIS',R.UIS)
		return;

		//createUI(n, dParent, this.sData, this.defs);

		// R.root = createNode(n, 'ROOT', '.', area, null, R);
		// console.log(R.ROOT);

		//besser:
		let n = spec.ROOT; //this IS already a new copy!!!
		R.root = createRoot(n, area, R);
		console.log('----- THE END -----')
		console.log('root', R.root)
		console.log('UIS', R.UIS);
	}
	lastGen() { return last(this.gens); }

}

function createLC(n, content, area, R) {
	// n ist already a copy of the node to be created

	R.registerNode(n);
	console.log('createLC', n.uid, n.type, isdef(n.pool) ? n.pool.map(x => x) : 'no_pool', n.oid);
	if (isContainerType(n.type)) { //replace by isContainerType
		n.ui = mDiv(mBy(area));
		R.setUid(n);
		n.children = createChi(n, R);
	} else {
		n.ui = mInfo(content, mBy(area)); // mTextDiv(content,mBy(area));
		R.setUid(n);
	}
	return n;
}

function createChi(nCont, R) {
	let prop = RCONTAINERPROP[nCont.type];
	//console.log('prop is', prop);
	let n = nCont[prop];
	//console.log('createChildren', n.uid,n.pool,n.oid);

	//console.log(isList(n),n);
	if (isList(n)) { n.map(x => createLC(x, null, nCont.uid, R)); return; }

	console.log('createChildren', n.uid, n.type, isdef(n.pool) ? n.pool.map(x => x) : 'no_pool', n.oid);

	//case 1: wenn n ein pool besitzt muss fuer jedes el im pool 1 child gemacht werden
	let chNodes = [];
	if (isdef(n.pool)) {
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
	//case 5: wenn n data hat, nicht containerType ist, aber kein oid in sicht muss 1 static content child gemacht werden
	else if (isdef(n.data) && !isContainerType(n.type) && nundef(nCont.oid)) {
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
function createRoot(n, area, R) {
	//console.log(n);
	if (nundef(n)) return;

	//area is a container, so if n.type is not a container, make area a panel container!
	//and place whatever n.type is inside of it
	let isContainer = isContainerType(n.type);
	let d = mBy(area);
	let root = {
		isParent: null, //uid of parent!
		dParent: null,
		area: null,
		ui: d,
		uid: area,
		content: null,
		type: isContainer ? n.type : 'panel',
		skey: 'ROOT',
		path: '.',
	};
	R.register(root);
	//es fehlen noch:	//ui	//oid	//pool	//data	//children	//params

	//console.log('isContainer', isContainer, 'pool', n.pool)
	if (!isContainer || n.pool && n.pool.length > 1) {
		//whatever is in ROOT will become children of ROOT
		root.oid = null;
		root.pool = [];
		root.data = null;
		root.params = null;

		addChildren(n, root, R);


	} else {
		//if root is a container type and it is a singleton, then root is the
		//replica of n itself
		root.oid = n.pool && !isEmpty(n.pool) ? n.pool[0] : null;
		root.pool = n.pool;
		root.data = n.data;
		root.params = deepmerge(R.defs[root.type].params, isdef(n.params) ? n.params : {});

		//console.log('params fuer container:',root.params)

		//falls params in n muss diese auf container anwenden!!!
		RSTYLE[root.type](root.ui, root.params);
		//root.ui.innerHTML='HALOOOOOOOO'
		//console.log('anderer fall mit type list', root);

		//jetzt muss ich die container eigenschaft finden!!!
		//let containerPropName = root.type == 'list' ? 'elm' : 'panels';

		//console.log('containerPropName', containerPropName);

		//jetzt muss ich proto fuer list elements machen
		nowAddChildren(n, root, R);

	}


	return root;
}

function nowAddChildren(n, nParent, R) {
	let el = n[RCONTAINERPROP[n.type]];
	if (isDict(el)) {
		console.log('>>>list property is', el);
		addChildren(el, nParent, R);
	} else if (isList(el)) {
		//the container of the containers is
		//need to create individual container elements according to 
		//each list element
		// let i = 0;
		// for (const x of el) {
		// 	x.pool = [];
		// 	let path = childrenPath(nParent.path, i)
		// 	console.log(x);
		// 	let n1 = createNode(x, null, nParent.skey, childrenPath(path, i), nParent.uid, R);

		// }
	}

}

function addChildren(n, nParent, R) {
	let skey = nParent.skey;
	let i = 0;
	let path = nParent.path;
	let area = nParent.uid;
	let nodes = [];
	if (nundef(n.pool) || isEmpty(n.pool)) {
		let content = n.data;
		let n1 = createNode(n, content, skey, childrenPath(path, i), area, R);
		nodes.push(n1);
	} else {
		for (const oid of n.pool) {
			let content = calcContent(R.sData[oid], n.data);
			//console.log(n)
			let n1 = createNode(n, content, skey, childrenPath(path, i), area, R);
			nodes.push(n1);
			i += 1;
		}
	}

	nParent.children = nodes.map(x => x.uid);
	nodes.map(x => R.register(x));
}
function createNode(n, content, skey, path, idParent, R) {
	//actually area == idParent
	if (nundef(n)) return;
	//n is a prototype? or what????
	let n1 = jsCopy(n);
	//this creates exactly 1 node
	//what if multiple in pool?
	//at this time, n.oid should already be there!!!
	// n1.type = n.type;
	// n1.data = n.data;
	n1.content = content;
	//console.log('data:', n1.data);
	n1.idParent = idParent;

	let d = mBy(idParent);

	n1.address = path;
	n1.spKey = skey; //closest spec key this comes from
	//console.log(R)
	n1.params = deepmerge(R.defs[n.type].params, isdef(n.params) ? n.params : {});
	console.log('....n1', n1)
	n1.ui = RCREATE[n1.type](n1.content, d);
	//console.log(d);
	RSTYLE[n.type](n1.ui, n1.params);
	n1.uid = n1.ui.id = getUID();


	if (isContainerType(n1.type)) {
		let pName = n[RCONTAINERPROP[n.type]];
		if (isDict(n1[pName])) {
			let el = n1[pName];
			console.log('>>>list property is', el);
			addChildren(el, n1, R);
		} else if (isList(el)) {
			//the container of the containers is
			//need to create individual container elements according to 
			//each list element
			let i = 0;
			for (const x of el) {
				x.pool = [];
				let path = childrenPath(nParent.path, i)
				console.log(x);
				let n1 = createNode(x, null, nParent.skey, childrenPath(path, i), nParent.uid, R);

			}
		}
	}

	return n1;
}



















function createUI(tree, dParent, sdata, defs) {
	if (nundef(tree)) return;
	switch (tree.type) {
		case 'info':
			let uis = [];
			if (isEmpty(tree.pool)) {
				let ui = mInfo(tree.data, {}, dParent);
				uis.push(ui);
			} else {
				let path = tree.data;
				for (const oid in tree.pool) {
					let o = tree.pool[oid];
					let props = isdef(path) ? path[0] == '.' ? path.split('.').slice(1)
						: null : [];
					let content = props ? isEmpty(props) ? o : lookup(o, props) : path;
					let ui = mInfo(content, {}, dParent);
					uis.push(ui);
				}
			}
			break;
		//multiply info x pool or create single
		//append infoUI 
		//
	}
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

	let sp = jsCopy(R.lastGen());
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


















function TD(n, nParent, sdata, defs) {
	//n is a spec node, nParent its parent node
	if (n.type == 'list') {
		//elm would be the elements of the list => auslagern to list type
		let items = []; //sollen nodes sein!
		let itemSpec = n.elm;
		//a: koennte sein: type list,
		//a: sind in elm specified
		//b: 
		let params = {}; //ignore for now
		if (isEmpty(n.pool)) {
			let ui = mInfo(tree.data, params, dParent);
			items.push(ui);
		} else {
			let path = tree.data;
			for (const oid in tree.pool) {
				let o = tree.pool[oid];
				let props = isdef(path) ? path[0] == '.' ? path.split('.').slice(1)
					: null : [];
				let content = props ? isEmpty(props) ? o : lookup(o, props) : path;
				let ui = mInfo(content, params, dParent);
				items.push(ui);
			}
		}

	}
}

function makeElNodes(n, data) {

}


