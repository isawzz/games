
class RSG {
	constructor(sp, defs, sdata) {
		this.gens = [sp];
		this.sp = sp;
		this.lastSpec = sp;
		this.defs = defs;
		this.sData = sdata;
		this.UIS = {};
		this.places = {};
		this.refs = {};
	}
	addToPlaces(specKey, placeName, propList) {
		lookupAddToList(this.places, [placeName, specKey], { idName: placeName, specKey: specKey, propList: propList });
	}
	getPlaces(placeName) {
		return (placeName in this.places) ? this.places[placeName] : {};
	}
	addToRefs(specKey, placeName, propList) {
		lookupAddToList(this.refs, [placeName, specKey], { idName: placeName, specKey: specKey, propList: propList });
	}
	getRefs(placeName) {
		return (placeName in this.places) ? this.refs[placeName] : {};
	}
	registerNode(n) { n.uid = getUID(); this.UIS[n.uid] = n; }
	//TODO: delete ui also if exists and all its links!
	unregisterNode(n) { delete this.UIS[n.uid]; }
	setUid(n) { n.ui.id = n.uid; }
	gen10() {
		let [gen, pools] = addSourcesAndPools(this);
		this.gens.push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;
		this.POOLS = pools; //not sure if need this.POOLS at all!!!
	}
	gen11() {
		//brauch ich nur wenn nicht eh schon ROOT.type == panel ist
		if (this.ROOT.type == 'panel' && this.ROOT.pool.length <= 1) return;
		let gen = jsCopy(this.lastSpec);
		gen.ROOT = { type: 'panel', panels: gen.ROOT };
		this.gens.push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;

	}
	gen12() {
		//add a specKey to each spec node
		//check_id recursively => fill this.places
		//check_ref recursively => fill this.refs
		this.places = {};
		let gen = jsCopy(this.lastSpec);
		for (const k in gen) {
			let n = gen[k];
			n.specKey = k;
		}
		for (const k in gen) {
			let n = gen[k];
			check_id(k, n, this);
		}
		for (const k in gen) {
			let n = gen[k];
			check_ref(k, n, this);
		}
		//console.log('____________________ places', this.places);
		//console.log('____________________ refs', this.refs);

		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;

	}
	gen13() {
		//merge _ref nodes into _id
		let gen = jsCopy(this.lastSpec);

		for (const k in gen) {
			let n = gen[k];
			safeRecurse(n, mergeChildrenWithRefs, this, true);
		}
		this.lastSpec = gen;
		this.ROOT = gen.ROOT;


	}
	gen14() {
		//merge _ref nodes into _id
		let gen = jsCopy(this.lastSpec);

		for (const k in gen) {
			let n = gen[k];
			safeRecurse(n, mergeSpecTypes, this, true);
		}
		this.lastSpec = gen;
		this.ROOT = gen.ROOT;


	}
	gen20(area) {
		let gen = jsCopy(this.lastSpec);

		this.ROOT = createLC(gen.ROOT, area, this);

		this.lastSpec = gen;
		//console.log('UIS', R.UIS);
		//console.log('ROOT', R.ROOT);
	}
	// gen21() {
	// 	//match refs and ids
	// 	let gen = jsCopy(this.lastSpec);

	// 	console.log('ROOT:', gen.ROOT)
	// 	safeRecurse(gen.ROOT, mergeChildrenWithRefs, this, true);
	// 	this.lastSpec = gen;
	// 	this.ROOT = gen.ROOT;
	// 	//console.log(gen);	
	// }
	// lastGen() { return last(this.gens); }

}



function calcContent(o, path) {

	if (isString(path)) {
		if (path[0] != '.') return path;

		let props = path.split('.').slice(1);
		// console.log(props, 'props');
		let content = isEmpty(props) ? o : lookup(o, props);
		return content;
	}else if (isDict(path)){
		let content = {};
		for(const k in path){
			let c=calcContent(o,path[k]);
			if (c) content[k]=c;
		}
		return content;
	}

}
function check_id(specKey, node, R) {
	let akku = {};
	recFindProp(node, '_id', 'self', akku);
	//console.log(node.specKey, node, akku);
	for (const k in akku) { R.addToPlaces(specKey, akku[k], k); }
	//console.log('places', this.places)
}
function check_ref(specKey, node, R) {
	let akku = {};
	recFindProp(node, '_ref', 'self', akku);
	//console.log(node.specKey, node, akku);
	for (const k in akku) { R.addToRefs(specKey, akku[k], k); }
	//console.log('places', this.places)
}
function hasId(o) { console.log('HALLLLLLLLLLLLLLLO'); return isdef(o._id); }
function isSpecType(t) { return isdef(R.lastSpec[t]); }
function isContainerType(t) { return t == 'panel' || t == 'list'; }
function isLeafType(t) { return t == 'info'; }
function isPositionedType(t) { return t == 'boardElement'; }
function isGridType(t) { return t == 'grid'; }
function mergeWithSpecType(n, t, R) {
	//console.log('......mergine nodes!');
	let pool = n.pool;
	let nt = R.lastSpec[t];

	//console.log('n', n.pool, 'nt', nt.pool)
	//TODO!!!! da muss noch sehr viel geschehen bez cards vis,all,non-vis!!!!
	if (!isEmpty(nt.pool) && !isEmpty(n.pool)) { pool = intersection(pool, nt.pool); }

	n = deepmergeOverride(n, nt);
	//intersect pools!!! nein nicht wenn specType empty pool hat!!!

	if (isdef(pool)) n.pool = pool; // intersection(n.pool,pool);
	//console.log('new node', n, n.pool);
	return n;
}
function showNodeInfo(n, title) {
	console.log(title,
		isdef(n.type) ? ' type:' + n.type : '',
		isdef(n.uid) ? 'uid:' + n.uid : '',
		isdef(n.pool) ? 'pool:' + n.pool.map(x => x) : '',
		isdef(n.content) ? 'content:' + (isList(n.content) ? n.content.map(x => x) : n.content) : '',
		isdef(n.oid) ? 'oid:' + n.oid : '');
}

//#region params
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

			n.pool.map(x => lookupAddToList(R.sData[x], ['_rsg'], k));
			//console.log(n.source, n.pool);
		} else missing.push(k);
	}

	//console.log('missing', missing);
	//let safe = 10;
	while (missing.length > 0) { // || safe < 0) {
		//safe -= 1;

		//find key in missing for which 
		let done = null;
		for (const k of missing) {
			let n = sp[k];
			let sourceNode = sp[n._source];
			//console.log('search', k, node._source);
			if (nundef(sourceNode.pool)) continue;

			n.source = sourceNode.pool;
			pools[k] = n.pool = makePool(n.cond, n.source, R);

			n.pool.map(x => lookupAddToList(R.sData[x], ['_rsg'], k));

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
	// //console.log('cond', cond, 'source', source);
	let pool = [];
	for (const oid of source) {

		let o = R.sData[oid];
		// //console.log('o', o)
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





