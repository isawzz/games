
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

	R.registerNode(n);

	decodeParams(n, R);

	n.ui = RCREATE[n.type](n, mBy(area), R);

	if (n.type != 'grid') { applyCssStyles(n.ui, n.cssParams); }

	//TODO: hier muss noch die rsg std params setzen (same for all types!)
	if (!isEmpty(n.stdParams)) { console.log('rsg std params!!!', n.stdParams); }

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
		console.log('defaultPresentationNode1: first list is:', key1, list1);
		//let content = list1.join(' ');
		//in wirklichkeit such ich hier nach available spec node fuer jedes el von list1
		nrep = { type: 'list', pool: list1, elm: '.' + key1 };

	}

	return nrep;


}
function hasId(o) { return isdef(o._id); }

function mergeInBasicSpecNodesForOid(oid, n, R) {
	let o = R.sData[oid];
	if (isEmpty(o._rsg)) return n;
	else {
		rlist = o._rsg;
		for (const specNodeName of rlist) { 
			//how to combine multiple nodes?
			//could do this more intelligently!!!
			//right now they will simply override each other!
			let nCand = jsCopy(R.lastSpec[specNodeName]);
			//if (nundef(nCand._ref)) //nein falsch!!!
			//gibt es irgendwelche conditions die einen node ausschliessen?
			n = deepmergeOverride(n, nCand); 
		}
		return n;
	}
}

//#region merging types, _id, _ref helpers
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

function mergeCorrectType(n, spec, defType) {

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

		if (!isEmpty(nSpec.pool) && !isEmpty(n.pool)) {
			console.log('building pool intersection !!!!!')
			pool = intersection(pool, nt.pool);
		}

		return deepmerge(n, nSpec);
	}

	//console.log('no change', type)
	return n;
}
function mergeCorrectTypeList_BROKEN(n, spec, defType) {

	let type = n.type;
	if (nundef(type)) {

		let t = detectType(n, defType);
		if (t) {
			n.type = t;
			console.log('type missing ersetzt durch', n, n.type);
		}
		return n;
	}

	if (!isList(n.type) && nundef(spec[n.type])) {
		//console.log('no type change...', n)
		return n;
	}

	console.log('______________________ VOR list merging =====>',n.type);
	if (isList(n.pool)) console.log('==> new pool',jsCopy(n.pool));
	if (isList(n.type)) console.log('==> new type',jsCopy(n.type));
	if (isDict(n)) console.log('==> start n',jsCopy(n));

	let typelst = isList(type) ? type : [type];
	let specTypes = typelst.filter(x => isdef(spec[x]));
	let standardTypes = typelst.filter(x => nundef(spec[x]));

	console.log('type list:', typelst);
	console.log('spec types:', specTypes);
	console.log('standard types:', standardTypes);

	let merged = n;
	merged.type = [];
	let pool = n.pool;

	for (const t of specTypes) {
		let nSpec = spec[t];

		//console.log('merging in type', t);

		if (!isEmpty(nSpec.pool) && !isEmpty(pool)) {
			console.log('building pool intersection !!!!!')
			pool = intersection(pool, nt.pool);
		}

		merged = deepmerge(merged, nSpec);
		//was macht deepmerge mit lists???
	}

	n = merged;

	n.pool = pool;

	console.log('nach list merging:');
	if (isList(n.pool)) console.log('==> new pool',jsCopy(n.pool));
	if (isList(n.type)) console.log('==> new type',jsCopy(n.type));
	if (isDict(n)) console.log('==> FINAL n',n);
	//will nur noch 1 type haben hier!!!


	if (isList(n.type)) n.type = n.type[0];
	console.log('types at the end of merging:', n.type);
	return n;
}
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

		// nNew = mergeCorrectType(nNew, spec, defType);
		nNew = mergeCorrectType(nNew, spec, defType);

		let newType = nNew.type;
		//console.log('type is NOW', newType);
		if (t == newType) break;
	}

	if (counter >= COUNTERMAX) { error('OVERFLOW!!!!!!!!'); return; }

	//der type von n ist jetzt ein standard type!
	//merge n auch noch mit defaults here!
	//dann hab ich fuer jeden type der vorkommt alle defaults zusammen!
	let type = nNew.type;

	//#region param merging DOCH NICHT JETZT!!!

	// if (type == 'grid') {
	// 	console.log('param merging and paramsToCss *** NOT *** done for grid type!');
	// 	//console.log('GRID ENCOUNTER in gen14!!!! hier koennt was machen!', n);
	// 	//NEIN NOCH NICHTdetectBoardParams(nNew,R);
	// 	//return;
	// } else if (nundef(type)) {
	// 	return nNew;
	// } else {

	// 	//alle uebrigen types koennte hier bereits defs mergen!!!

	// 	let ndefs = R.defs[type];
	// 	if (isdef(ndefs)) {
	// 		nNew = deepmerge(ndefs, nNew);
	// 		//console.log('...type', type)
	// 		//console.log('merged defs in:', type, nNew.params)
	// 	} else {
	// 		console.log('***************no defs for type', type, testN);
	// 	}
	// 	nNew.DParams =  paramsToCss(nNew.params);

	// }
	//#endregion

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
//#endregion

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
	field_spacing: true,
	size: true,
};
function decodeParams(n, R) {

	//console.log('__________ decodeParams')
	//console.log('n.params', n.params);
	//console.log('def params', defParams);

	//if (n.type == 'grid') console.log(n.params)

	let defParams = lookup(R, ['defs', n.type, 'params']);
	if (n.type != 'grid' && defParams) {
		if (nundef(n.params)) n.params = jsCopy(defParams);
		else n.params = deepmergeOverride(defParams, n.params);
	}

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

	let params = paramsToCss(pNew);
	n.params = pNew;
	n.typParams = params.typ;
	n.cssParams = params.css;
	n.stdParams = params.std;

}
function getFontString(params) {
	let f = params.font;
	if (nundef(f)) return null;
	if (isString(f)) return f;
	else {
		let fz = f.size; if (isNumber(fz)) fz = '' + fz + 'px';
		let ff = f.family;
		let fv = f.variant;
		let fw = isdef(f.bold) ? 'bold' : isdef(f.light) ? 'light' : f.weight;
		let fs = isdef(f.italic) ? 'italic' : f.style;
		if (nundef(fz) || nundef(ff)) return null;
		let s = fz + ' ' + ff;
		if (isdef(fw)) s = fw + ' ' + s;
		if (isdef(fv)) s = fv + ' ' + s;
		if (isdef(fs)) s = fs + ' ' + s;
		return s;

	}
}
function paramsToCss(params) {
	//console.log('phase is',phase)
	let res = { css: {}, std: {}, typ: {} };

	for (const k in params) {
		//console.log('k', k, params[k])
		if (k == 'font') {
			//special treatment wegen composition of font!
			let f = getFontString(params.font);
			if (f) res.css.font = f;
		}
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












