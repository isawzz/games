var R = null;
function run03(sp, defaults, sdata) {

	R = new RSG(sp, defaults, sdata);

	R.gen10(); //addSourcesAndPools, need cond to add _rsg to objects!
	//console.log(R.lastSpec.ROOT);

	R.gen11(); // add top level panel to root unless is single(!) panel
	R.gen12(); // creates places & refs and adds a specKey prop to each spec Node
	R.gen13(); // merges _ref nodes into _id nodes (_id & _ref) disappear?
	//R.gen14(); // merges type nodes into spec nodes =>type names disappear!
	//console.log('ROOT vor synthesis:\n',R.lastSpec.ROOT);

	R.gen20('table'); // expands root, creates 1 node for each ui and uis

	presentRoot(R.lastSpec.ROOT, 'results');
}

function createPresentationNodeForOid(oid, R) {
	let o = R.sData[oid];
	let stypes = o._rsg;
	// if (verbose) consOutput(oid, stypes);
	//if (isEmpty(stypes)) continue;
	//if no type is found, use default presentation! this child is not presented!

	let nrep = {};
	if (isEmpty(stypes)) {
		nrep = defaultPresentationNode(oid, o, R);
	} else {
		for (const t of stypes) { nrep = deepmergeOverride(nrep, R.lastSpec[t]); }
		delete nrep.source;
		delete nrep.pool;
	}

	// if (verbose) consOutput('YES', oid, stypes, nrep);
	// if (verbose) consOutput('need to make a child for', oid, n, nrep);
	let n1 = nrep;
	n1.oid = oid;
	n1.content = nrep.data ? calcContent(R.sData[oid], nrep.data) : null;

	return n1;
}
function defaultPresentationNode(oid, o, R) {

	//if o is a list of oids: again, look for spec nodes!
	let nrep = {};
	//console.log('def rep:', oid, o);

	//if o has one or more properties that are lists of oids
	//can present this in a better way!!!
	let objLists = getElementLists(o);
	//console.log('-------', objLists);
	if (isEmpty(objLists)) {
		let litProp = firstCondDictKV(o, (k, v) => k != 'obj_type' && isLiteral(v));
		let content = litProp ? o[litProp] : o.obj_type + ' ' + oid;
		nrep = { type: 'info', data: content };

	} else {
		//work with objLists
		//erstmal nur 1. list
		let key1 = Object.keys(objLists)[0];
		let list1 = Object.values(objLists)[0];
		console.log('defaultPresentationNode: first list is:', key1, list1);
		//let content = list1.join(' ');
		//in wirklichkeit such ich hier nach available spec node fuer jedes el von list1
		nrep = { type: 'list', pool: list1, elm: '.' + key1 };

		//createPresentationNodeForOid(oid, R)
	}

	return nrep;


}
function mergeChildrenWithRefs(o, R) {
	for (const k in o) {
		let ch = o[k];
		if (nundef(ch._id)) continue;
		let loc = ch._id;
		let refs = R.refs[loc];
		if (nundef(refs)) continue;
		let spKey = Object.keys(refs)[0];
		let nSpec = R.lastSpec[spKey];
		//console.log('nSpec', nSpec);
		let oNew = deepmerge(o[k], nSpec);
		//console.log('neues child', oNew);
		o[k] = oNew;


	}
}
function mergeSpecTypes(o, R) {
	for (const k in o) {
		let ch = o[k];
		//if (ch.type == )
		if (nundef(ch._id)) continue;
		let loc = ch._id;
		let refs = R.refs[loc];
		if (nundef(refs)) continue;
		let spKey = Object.keys(refs)[0];
		let nSpec = R.lastSpec[spKey];
		//console.log('nSpec', nSpec);
		let oNew = deepmerge(o[k], nSpec);
		//console.log('neues child', oNew);
		o[k] = oNew;


	}
}
function replaceChildrenBySpecNodes(n, R) {
	//replace children by spec nodes
	let prop = RCONTAINERPROP[n.type];
	let nOrList = n[prop];
	if (isList(nOrList)) {
		//each list element can only result in <= 1 binding!!!
		//so if it's type is a list, simply merge all the types in it
		for (let i = 0; i < nOrList.length; i++) {
			let nch = nOrList[i];
			//#region merge multiple types NOT IMPLEMENTED!!!
			if (isList(nch.type)) {
				let types = nch.type.filter(x => isSpecType(x));
				let standardTypes = nch.type.filter(x => !isSpecType(x));
				let newel = nch;
				for (const t of types) {
					newel = mergeWithSpecType(newel, t, R);
				}
				nOrList[i] = newel;
				//console.log('^^^newel has type', newel.type);
			}
			//#endregion

			if (isSpecType(nch.type)) {
				nOrList[i] = mergeWithSpecType(nch, nch.type, R);
			}
		}
	} else if (isDict(nOrList)) {
		let nch = nOrList;
		//#region merge multiple types NOT IMPLEMENTED!!!
		if (isList(nch.type) && nch.type.length == 1) {
			nch.type = nch.type[0];
		} else if (isList(nch.type) && nch.type.length > 1) {
			let specTypes = nch.type.filter(x => isSpecType(x));

			let standardTypes = nch.type.filter(x => !isSpecType(x));
			let newel = nch;
			//console.log('specTypes', specTypes);
			let newNProp = [];
			//first make 1 list element for each different 
			for (const t of specTypes) {

				newel = mergeWithSpecType(newel, t, R);
			}
			n[prop] = newel;
			//console.log('^^^newel has type', newel.type);
		}
		//#endregion

		if (isSpecType(nOrList.type)) {
			n[prop] = mergeWithSpecType(nOrList, nOrList.type, R);
		}
	} else {
		//console.log('hhhhhhhhhhhhhh')
	}

}

//#region stages
function stage1_makeUis(omap, objectPool, w, h, gap, domelFunc) {
	// *** stage 1: convert objects into uis ***
	let olist = mapOMap(omap, objectPool);
	//console.log('olist', olist);
	if (isEmpty(olist)) return null;

	let otrans = olist; //.map(item =>  ({ color: convertToColor(item.key), label: convertToLabel(item.value) }));
	//console.log('otransformed', otrans);

	let uis = getUis(otrans, domelFunc(w, h));
	//console.log(uis);
	return uis;
}
function stage2_prepArea(area) { let d = mBy(area); mClass(d, 'flexWrap'); return d; }
function stage3_prepContainer(area) { let container = mDiv(area); mPosRel(container); return container; }
function stage4_layout(uis, container, w, h, gap, layoutFunc) {
	// *** stage 4: create layout of objects within container *** >>returns size needed for collection
	let [wTotal, hTotal] = layoutFunc(uis, container, w, h, gap);
	mStyle(container, { width: wTotal, height: hTotal, 'border-radius': gap });
}
//#endregion


const SHAPEFUNCS = {
	'circle': agCircle,
	'hex': agHex,
	'rect': agRect,
}
function agColoredShape(g, shape, w, h, color) {
	//console.log(shape)
	SHAPEFUNCS[shape](g, w, h);
	gBg(g, color);

}
function gShape(shape, w, h, color) {
	//console.log(shape)
	let el = gG();
	if (shape != 'line') agColoredShape(el, shape, w, h, color);
	else gStroke(el, color, w); //agColoredLine(el, w, color);
	return el;
}

function decodePropertyPath(o, path) {
	if (isString(path) && path[0] == '.') {
		let props = path.split('.').slice(1);
		return lookup(o, props);

	}
}
function mapValues(o, p, pdef, spec) {
	//console.log('__________ mapValues',p,pdef,spec);
	let oNew = {};//newParams = jsCopy(baseParams);
	for (const k in p) {
		if (nundef(p[k]._map)) { oNew[k] = p[k]; continue; }
		//console.log('o is',p);

		let p1 = p[k];
		//console.log('k is',k);
		//console.log('o1 is',p1);
		let m = p1._map;
		//console.log('m is',m);
		let mapName = m.map;
		//console.log('mapName is',mapName);
		let _map = spec[mapName];
		//console.log('_map is',_map);
		let propPath = m.key;
		//console.log('propPath is',propPath);
		//console.log(mapName,propPath,'_map',_map);
		let _key = decodePropertyPath(o, propPath);
		//console.log('_key is',_key);
		//console.log('o1',o1,'',_key,_key);
		let val = _map[_key];
		//console.log('val is',val);
		if (isdef(val) && isdef(val[k])) { oNew[k] = val[k]; }
		else if (isdef(pdef[k])) { oNew[k] = pdef[k]; }
		//console.log('oNew[k] is',oNew[k]);
		//console.log('change!!! old',params[p],'new',newParams[p])
	}
	return oNew;
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


