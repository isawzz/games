
class RSG {
	constructor(sp, defs, sdata) {
		this.gens = [sp];
		this.sp = sp;
		this.defs = defs;
		this.sData = sdata;
		this.UIS = {};
	}
	register(node) { this.UIS[node.uid] = node; }
	gen10() {
		let [gen, pools] = addSourcesAndPools(this);

		for (const k in gen) {
			let n = gen[k];
			for (const oid in n.pool) {
				let o = n.pool[oid];
				lookupAddToList(o, ['_rsg', 'spKeys'], k);
			}
		}

		this.gens.push(gen);
		this.POOLS = pools;
	}
	gen20(area) {
		let spec = jsCopy(this.lastGen());
		let n = spec.ROOT; //this IS already a new copy!!!

		//createUI(n, dParent, this.sData, this.defs);

		// R.root = createNode(n, 'ROOT', '.', area, null, R);
		// console.log(R.ROOT);

		//besser:
		R.root = createRoot(n, area, R);
		console.log('----- THE END -----')
		console.log('root', R.root)
		console.log('UIS', R.UIS);
	}
	lastGen() { return last(this.gens); }

}
function isContainerType(t) { return t == 'panel' || t == 'list' || t == 'dict'; }
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

	console.log('isContainer', isContainer, 'pool', n.pool)
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

		console.log('params fuer container:',root.params)

		//falls params in n muss diese auf container anwenden!!!
		RSTYLE[root.type](root.ui, root.params);
		root.ui.innerHTML='HALOOOOOOOO'
		console.log('anderer fall mit type list', root);

		//jetzt muss ich die container eigenschaft finden!!!
		let containerPropName = root.type == 'list' ? 'elm' : 'panels';

		console.log('containerPropName', containerPropName);

		//jetzt muss ich proto fuer list elements machen
		let el=n.elm;
		if (isDict(el)){
			console.log(el)
		}

	}


	return root;
}

function addChildren(n, root, R) {
	let skey = root.skey;
	let i = 0;
	let path = root.path;
	let area = root.uid;
	let nodes = [];
	if (nundef(n.pool) || isEmpty(n.pool)) {
		let content = n.data;
		let n1 = createNode(n, content, skey, childrenPath(path, i), area, R);
		nodes.push(n1);
	} else {
		for (const oid in n.pool) {
			let content = calcContent(n.pool[oid], n.data);
			//console.log(n)
			let n1 = createNode(n, content, skey, childrenPath(path, i), area, R);
			nodes.push(n1);
			i += 1;
		}
	}

	root.children = nodes.map(x => x.uid);
	nodes.map(x => R.register(x));
}
function createNode(n, content, skey, path, idParent, R) {
	//actually area == idParent
	if (nundef(n)) return;
	//n is a prototype? or what????
	let n1 = {};
	//this creates exactly 1 node
	//what if multiple in pool?
	//at this time, n.oid should already be there!!!
	n1.type = n.type;
	n1.data = n.data;
	n1.content = content;
	//console.log('data:', n1.data);
	n1.idParent = idParent;

	let d = mBy(idParent);

	n1.address = path;
	n1.spKey = skey; //closest spec key this comes from
	//console.log(R)
	n1.params = deepmerge(R.defs[n.type].params, isdef(n.params) ? n.params : {});
	n1.ui = RCREATE[n.type](n1.content, d);
	//console.log(d);
	RSTYLE[n.type](n1.ui, n1.params);
	n1.uid = n1.ui.id = getUID();


	if (isContainerType(n.type)) {

	}

	return n1;
}











function createNode_dep2(n, content, spKey, path, area, parent, R) {
	if (nundef(n)) return;
	//n is a prototype? or what????
	let n1 = {};
	//this creates exactly 1 node
	//what if multiple in pool?
	//at this time, n.oid should already be there!!!
	n1.type = n.type;
	n1.data = n.data;
	n1.content = content;
	//console.log('data:', n1.data);
	n1.parentArea = area;
	n1.dParent = mBy(area);
	n1.parent = parent;
	n1.address = path;
	n1.spKey = spKey; //closest spec key this comes from
	n1.params = deepmerge(R.defs[n.type].params, isdef(n.params) ? n.params : {});
	n1.ui = RCREATE[n.type](n1.content, n1.dParent);
	RSTYLE[n.type](n1.ui, n1.params);
	n1.uid = n1.ui.id = getUID();
	return n1;
}
function createNode_dep(n, content, spKey, path, area, parent, R) {
	if (nundef(n)) return;
	//n is a prototype? or what????
	let n1 = {};
	switch (n.type) {
		case 'info':
			//this creates exactly 1 node
			//what if multiple in pool?
			//at this time, n.oid should already be there!!!
			n1.type = n.type;
			n1.data = n.data;
			n1.content = content;
			//console.log('data:', n1.data);
			n1.parentArea = area;
			n1.dParent = mBy(area);
			n1.parent = parent;
			n1.address = path;
			n1.spKey = spKey; //closest spec key this comes from
			n1.params = deepmerge(R.defs[n.type].params, isdef(n.params) ? n.params : {});
			n1.ui = RCREATE[n.type](n1.content, n1.dParent);
			RSTYLE[n.type](n1.ui, n1.params);
			n1.uid = n1.ui.id = getUID();
			break;
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
			n.source = R.sData;
			pools[k] = n.pool = makePool(n.cond, n.source);
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
			pools[k] = node.pool = makePool(node.cond, node.source);
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
function makePool(cond, source) {
	if (nundef(cond)) return {};
	// console.log('cond', cond, 'source', source);
	let pool = {};
	for (const oid in source) {

		let o = source[oid];
		// console.log('o', o)
		if (!evalConds(o, cond)) continue;

		pool[oid] = o;
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


