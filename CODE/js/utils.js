//todo: multiple types!!!!!!!!!
function recMergeSpecTypes(n, spec, defType, counter) {
	counter += 1;
	if (counter > 200) { error('rec overflow: recMergeSpecTypes'); return n; }

	let testN = jsCopy(n);
	let nNew = n;
	let COUNTERMAX = 20;
	while (counter < 20) {
		counter += 1;

		let t = nNew.type;
		//console.log('type is', t);
		nNew = correctType(nNew, spec, defType);
		let newType = nNew.type;
		//console.log('type is NOW', newType);
		if (t == newType) break;
	}

	if (counter >= COUNTERMAX) { error('OVERFLOW!!!!!!!!'); return; }

	//der type von n ist jetzt ein standard type!
	//merge n auch noch mit defaults here!
	//dann hab ich fuer jeden type der vorkommt alle defaults zusammen!
	let type = nNew.type;
	if (type == 'grid') {
		console.log('param merging and paramsToCss *** NOT *** done for grid type!');
		//console.log('GRID ENCOUNTER in gen14!!!! hier koennt was machen!', n);
		//NEIN NOCH NICHTdetectBoardParams(nNew,R);
		//return;
	} else if (nundef(type)) {
		return nNew;
	} else {

		//alle uebrigen types koennte hier bereits defs mergen!!!
		let ndefs = R.defs[type];
		if (isdef(ndefs)) {
			nNew = deepmerge(ndefs, nNew);
			//console.log('...type', type)
			//console.log('merged defs in:', type, nNew.params)
		} else {
			console.log('***************no defs for type', type, testN);
		}
		nNew.DParams =  paramsToCss(nNew.params);
		
	}

	//else console.log('GOTT SEI DANK!!!');

	if (isContainerType(nNew.type)) {

		let prop = RCONTAINERPROP[nNew.type];
		let n1 = nNew[prop];

		//console.log(nNew);
		//console.log('nNew[',prop,'] will be evaluated');
		//console.log('...before rec:','nNew',nNew,'n1',n1, isList(n1),isDict(n1));

		if (isList(n1)) {
			let newList = [];
			for (const nChi of n1) {
				newList.push(recMergeSpecTypes(nChi, spec, defType, counter));
			}
			nNew[prop] = newList;

		} else if (isDict(n1)) {
			nNew[prop] = recMergeSpecTypes(n1, spec, defType, counter);
		} else {
			//	console.log('have to eval',nNew[prop]);
		}
		//console.log('...after rec',nNew[prop])
	}

	return nNew;

}
function correctType(n, spec, defType) {

	let type = n.type;
	if (nundef(type)) {

		let t = detectType(n, defType);
		if (t) {
			n.type = t;
			console.log('type missing ersetzt durch', n, n.type);
		}
		return n;
	}

	let nSpec = spec[type];
	if (isdef(nSpec)) {
		//console.log('merging', type, 'and', nSpec.type);
		return deepmerge(n, nSpec);
	}

	//console.log('no change', type)
	return n;
}














function sortCards_dep(n) {
	console.log('jaaaaaaaaaaaaaaaaaaaaaa', n);
	let parentEl = n.ui;

	if (n.children.length > 1) {
		var cards = n.children.map(x => x.ui),
			cw = parentEl.clientWidth,
			sw = parentEl.scrollWidth,
			diff = sw - cw,
			offset = diff / (cards.length - 1);
		for (var i = 1; i < cards.length; i++) {
			cards[i].style.transform = "translateX(-" + offset * i + "px)";
		}
	}
}

function adjustContainerLayout(n, R) {

	if (n.type == 'hand') { layoutHand(n); return; }
	//if (n.type == 'hand') { sortCards(n); return; }

	//console.log('==>', n)
	let params = n.params;
	let num = n.children.length;

	let or = params.orientation ? params.orientation : DEF_ORIENTATION;
	mFlex(n.ui, or);

	//console.log(params, num, or);


	//setting split
	let split = params.split ? params.split : DEF_SPLIT;
	if (split == 'min') return;

	let reverseSplit = false;

	if (split == 'equal') split = (1 / num);
	else if (isNumber(split)) reverseSplit = true;

	for (let i = 0; i < num; i++) {
		if (n.children[i].uid == '_19') console.log(jsCopy(n.children[i]));
		let d = n.children[i].ui;
		mFlexChildSplit(d, split);

		if (reverseSplit) { split = 1 - split; }
	}
}
function calcContent(o, path) {

	if (isString(path)) {
		if (path[0] != '.') return path;

		let props = path.split('.').slice(1);
		// console.log(props, 'props');
		let content = isEmpty(props) ? o : lookup(o, props);
		return content;
	} else if (isDict(path)) {
		let content = {};
		for (const k in path) {
			let c = calcContent(o, path[k]);
			if (c) content[k] = c;
		}
		return content;
	}
	return null;

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
function createUi(n, area, R) {
	//if (n.type == 'title') console.log(n,area,R)
	let defs = lookup(R, ['defs', n.type, 'params']);
	//if (n.type == 'title') console.log(defs)
	if (defs) {
		if (nundef(n.params)) n.params = jsCopy(defs);
		else n.params = deepmergeOverride(defs, n.params);
	}

	n.ui = RCREATE[n.type](n, mBy(area), R);

	// //console.log(n.params)
	// RSTYLE[n.type](n.ui, n.params);

	R.setUid(n);

}
function decodePropertyPath(o, path) {
	if (isString(path) && path[0] == '.') {
		let props = path.split('.').slice(1);
		return lookup(o, props);

	}
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
function hasId(o) { return isdef(o._id); }
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
				error('NEIIIIIIIIIIIIIN');
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
			error('NEIIIIIIIIIIIIIN');

			n[prop] = mergeWithSpecType(nOrList, nOrList.type, R);
		}
	} else {
		//console.log('hhhhhhhhhhhhhh')
	}

}

//#region source, pool, cond, eval
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

//cond, eval, eval FUNCTIONS
var FUNCTIONS = {
	instanceof: 'instanceOf',
	obj_type: (o, v) => o.obj_type == v,
	prop: (o, v) => isdef(o[v]),
	no_prop: (o, v) => nundef(o[v]),
}
function instanceOf(o, className) {
	let otype = o.obj_type;
	switch (className) {
		case '_player':
		case 'player': return ['me', '_me', 'player', '_player', 'opp', 'opponent', '_opponent'].includes(otype); break;
		// case '_player': return otype == 'GamePlayer' || otype == 'opponent'; break;
		case 'building': return otype == 'farm' || otype == 'estate' || otype == 'chateau' || otype == 'settlement' || otype == 'city' || otype == 'road'; break;
	}
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

//#region params
const PARAMCSS = {
	bg: 'background-color',
	fg: 'color',

};
const PARAMRSG_T = {
	// true heisst: type handles this param
	overlap: true,
	orientation: true, // TODO: false
	split: true, // TODO: false
	shape: true,
};
function decodeParams(n, defParams, R) {

	//console.log('__________ decodeParams')
	//console.log('n.params', n.params);
	//console.log('def params', defParams);

	let o = isdef(n.oid) ? R.sData[n.oid] : null;
	let pNew = {};
	if (o) pNew = mapValues(o, n.params, defParams, R.lastSpec);

	//console.log('pNew nach mapValues', jsCopy(pNew));
	//console.log('o', o)

	if (o) {
		//todo: muss recursive werden!!!
		for (const k in pNew) {
			let val = pNew[k];
			//console.log('val von pNew',k,val)
			if (isString(val) && val[0] == '.') {
				//console.log('...decoding');
				val = decodePropertyPath(o, val);
				//console.log('result:',val)
			}
			pNew[k] = val;
		}
	}

	//console.log('pNew nach decode prop vals', jsCopy(pNew));

	if (!o) pNew = n.params;

	return paramsToCss(pNew);

}
function paramsToCss(params) {
	let res = { css: {}, std: {}, typ: {} };
	for (const k in params) {
		//console.log('k', k, params[k])
		let rsgParam = PARAMRSG_T[k];
		if (isdef(rsgParam)) if (rsgParam) res.typ[k] = params[k]; else res.std[k] = params[k];
		else {
			let name = PARAMCSS[k];
			if (isdef(name)) {
				res.css[name] = params[k];
			} else {
				res.css[k] = params[k];
			}
		}
	}
	//console.log('params:', res.css, '\n', res.typ, '\n', res.std)
	return res;
}
function paramsToCss_dep(params) {
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
//endregion

//#region presentation

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
function gShape(shape, w = 20, h = 20, color = 'green') {
	//console.log(shape)
	let el = gG();
	if (nundef(shape)) shape = 'rect'
	if (shape != 'line') agColoredShape(el, shape, w, h, color);
	else gStroke(el, color, w); //agColoredLine(el, w, color);
	return el;
}

//stages
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












