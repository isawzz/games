function adjustContainerLayout(n, R) {


	n.adirty = false;

	//console.log(n);return;
	if (n.type == 'grid') {
		console.log('adjustContainerLayout! ja grid kommt auch hierher!!!', n);
		return;
	}

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
		//if (n.children[i].uid == '_19') console.log(jsCopy(n.children[i]));
		let d = R.uiNodes[n.children[i]].ui;
		mFlexChildSplit(d, split);

		if (reverseSplit) { split = 1 - split; }
	}
}
function calcContentFromData(oid, o, data, R) {

	// ex: data: .player.name
	if (!o) return data; //static data

	if (isLiteral(data)) {
		if (isString(data)) {
			if (data[0] != '.') return data;

			//console.log('PATH:', data, 'oid', oid, 'o', o);
			let props = data.split('.').slice(1);
			//console.log('props', props, isEmpty(props));
			//bei '.' kommt da [""] raus! also immer noch 1 empty prop!

			if (props.length == 1 && isEmpty(props[0])) return o;

			else return dPP(o, props, R);

		} else {
			//it's a literal but NOT a string!!!
			return data;
		}
	}
	else if (isDict(data)) {
		//beispiel? data is dictionary {vsp:.vsp,money:.money}
		let content = {};
		for (const k in data) {
			let c = calcContentFromData(oid, o, data[k], R);
			if (c) content[k] = c;
		}
		return content;
	} else if (isList(data)) {
		//ex: data:[.vps, .money]
		let content = data.map(x => calcContentFromData(oid,o,x,R));
		return content;
	}
	return null;

}
function calcAddressWithin(o, addr, R) {

	// ex: data: .player.name
	if (!o) return addr; //static data

	if (isLiteral(addr)) {
		if (isString(addr)) {
			if (addr[0] != '.') return addr;

			//console.log('PATH:', data, 'oid', oid, 'o', o);
			let props = addr.split('.').slice(1);
			//console.log('props', props, isEmpty(props));
			//bei '.' kommt da [""] raus! also immer noch 1 empty prop!

			if (props.length == 1 && isEmpty(props[0])) {
				console.log('ERROR!!!!!!!! sollte abgefangen werden!!!! props empty!')
				return o;
			}else if (props.length == 1){
				return {key:props[0],obj:o};
			}
			else{
				//take last property from props
				let key = last(props);
				let len = props.length;
				let props1=props.slice(0,len-1);
				//console.log('props',props,'props1',props1)
				return {key:key, obj:dPP(o, props1, R)};
			}

		} else {
			//it's a literal but NOT a string!!!
			return addr;
		}
	}
	else if (isDict(addr)) {
		//beispiel? data is dictionary {vsp:.vsp,money:.money}
		let content = {};
		for (const k in addr) {
			let c = calcAddressWithin(o, addr[k], R);
			if (c) content[k] = c;
		}
		return content;
	} else if (isList(addr)) {
		//ex: data:[.vps, .money]
		let content = addr.map(x => calcAddressWithin(o,x,R));
		return content;
	}
	return null;

}
function dPP(o, plist, R) {
	//plist is a list of properties
	//pool is a dictionary that contains all objects that might be involved
	if (isEmpty(plist)) return o;
	if (isList(o) && isNumber(plist[0])) { let i = Number(plist[0]); return dPP(o[i]); }
	if (!isDict(o)) {
		let o1 = R.getO(o);
		if (isdef(o1)) return dPP(o1, plist, R);
		console.log('dPP ERROR!!! o', o, 'plist', plist, '\no1', o1);
		return null;
	}

	let k1 = plist[0];
	let o1 = o[k1];
	if (nundef(o1)) return null; //o does NOT have this prop!
	let plist1 = plist.slice(1);
	if (o1._set) { o1 = o1._set; return o1.map(x => dPP(x, plist1, R)); }
	if (o1._player) { o1 = R.getO(o1._player); }
	else if (o1._obj) { o1 = R.getO(o1._obj); }
	return dPP(o1, plist1, R);
}
function decodePropertyPath(o, path) {
	if (isString(path) && path[0] == '.') {
		let props = path.split('.').slice(1);
		console.log('o',o,'path', path,'props', props);
		console.log(lookup(o,props));
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
function inferType(n, defType) { if (isdef(n.children)) return 'panel'; else return 'info'; }

function extendPath(path, postfix) { return path + (endsWith(path, '.') ? '' : '.') + postfix; }

function hasId(o) { return isdef(o._id); }

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

//#region source, pool
function addNewObjectToSourcesAndPools(o, R) {
	let sp = R.getSpec();

	//to each sp node add pool if does not have _source
	let missing = [];
	for (const k in sp) {
		let n = sp[k];
		//console.log('node is', k, n)
		if (nundef(n._source)) {
			n.source = R.defSource;
			pools[k] = n.pool = makePool(n.cond, n.source, R);

			n.pool.map(x => R.addR(x, k));
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

			n.pool.map(x => R.addR(x, k));

			done = k;
			break;

		}
		removeInPlace(missing, done);
		//console.log('missing', missing);
	}

	//console.log('POOLS', pools);
	return [sp, pools];
}

function addSourcesAndPools(R) {
	//source and cond can only occur at top level!

	let sp = jsCopy(R.getSpec());
	let pools = {}; //cache pools koennt ma auch an R anhaengen!!!

	//to each sp node add pool if does not have _source
	let missing = [];
	for (const k in sp) {
		let n = sp[k];
		//console.log('node is', k, n)
		if (nundef(n._source)) {
			n.source = R.defSource;
			pools[k] = n.pool = makePool(n.cond, n.source, R);
			n.pool.map(x => R.addR(x, k));
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

			n.pool.map(x => R.addR(x, k));

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
	else if (cond == 'all') return source;

	// //console.log('cond', cond, 'source', source);
	let pool = [];
	for (const oid of source) {

		let o = R.getO(oid);
		// //console.log('o', o)
		if (!evalConds(o, cond)) continue;

		pool.push(oid);//[oid] = o;
	}
	return pool;

}
//#endregion

//#region cond, eval, eval FUNCTIONS
var FUNCTIONS = {
	instanceof: 'instanceOf',
	obj_type: (o, v) => o.obj_type == v,
	prop: (o, v) => isdef(o[v]),
	no_prop: (o, v) => nundef(o[v]),
	no_spec: (o, v) => false, //this has to be checked differently!
}
function instanceOf(o, className) {
	let otype = o.obj_type;
	switch (className) {
		case '_player':
		case 'player': return ['GamePlayer', 'me', '_me', 'player', '_player', 'opp', 'opponent', '_opponent'].includes(otype); break;
		// case '_player': return otype == 'GamePlayer' || otype == 'opponent'; break;
		case 'building': return otype == 'farm' || otype == 'estate' || otype == 'chateau' || otype == 'settlement' || otype == 'city' || otype == 'road'; break;
	}
}
function evalCond(o, condKey, condVal) {
	let func = FUNCTIONS[condKey];
	if (isString(func)) func = window[func];
	if (nundef(func)) return isdef(o[condKey]) ? o[condKey] == condVal : null;
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
	defaultType: false,
	display: false,
	overlap: true,
	orientation: true, // TODO: false
	split: true, // TODO: false
	shape: true,
	field_spacing: true,
	size: true,
	rounding: true,
};
function decodeParams(n, R, defParams) {

	console.assert(isdef(n.type), 'decodeParams NO TYPE!!!!')
	console.assert(isdef(n.params), 'decodeParams: n.params MISSING!!!!!');
	console.assert(isdef(defParams), 'decodeParams: defParams MISSING!!!!!');
	// console.log('________ decodeParams for type',n.type);
	//  console.log('n.params', n.params);
	//  console.log('n.defParams', n.defParams);

	let inherited = lookup(defParams, [n.type, 'params']);
	let defaults = lookup(R.defs, [n.type, 'params']);
	let defs = n.params.inherit ? inherited : defaults;
	if (n.type != 'grid') n.params = deepmergeOverride(defs, n.params);

	let o = isdef(n.oid) ? R.getO(n.oid) : null;
	let pNew = {};
	if (o) {
		pNew = mapValues(o, n.params, defs, R.getSpec());
		for (const k in pNew) { pNew[k] = calcContentFromData(n.oid, o, pNew[k], R); }
	} else pNew = n.params;

	if (isdef(pNew.bg) || isdef(pNew.fg)) {
		[pNew.bg, pNew.fg] = getExtendedColors(pNew.bg, pNew.fg);
	}

	//finally, special param values are converted
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
		//console.log(k,p);
		if (nundef(p[k])) continue;
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
		else if (isdef(m.default)) { oNew[k] = m.default; }
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












