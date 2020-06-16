function bringToFront(ui) {
	ui.style.zIndex = maxZIndex;
	maxZIndex += 1;
}
function recListToString(lst){

	if (!isList(lst)) return lst;
	if (isListOfLiterals(lst)) return lst.join(',');// '['+ lst.join(',') +']';
	else{
		let res=[];
		for(const el of lst){
			let elString = recListToString(el);
			res.push(elString); // += elString + ',';
		}
		//res= res.substring(0,res.length-1);
		return res;
	}
}
function calcContentFromData(oid, o, data, R, default_data) {

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

			else {
				//console.log('___________',props)
				let res = dPP1(o, props, R);
				if (res) return res;
			} 

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
		let content = data.map(x => calcContentFromData(oid, o, x, R));
		return content;
	}

	if (isdef(default_data)) {
		//console.log('need to call CalcContentFromData again!!!', default_data);
		let finalRes = calcContentFromData(oid, o, default_data, R);
		//console.log('finalRes',finalRes)
		return finalRes;
	}else	return null;

}

function calculateTopLevelGElement(el) {
	while (el && el.parentNode) {
		let t = getTypeOf(el);
		let tParent = getTypeOf(el.parentNode);
		//console.log('el', t, tParent, 'el.id', el.id, 'parentNode.id', el.parentNode.id);
		if (tParent == 'svg') break;
		el = el.parentNode;
	}
	return el;

}
function findOrCreateKeysForObjTypes(oids, R) {
	//similar as createArtificialSpecForBoardMemberIfNeeded but also sets data

	//console.log('oids',oids)
	let keysForOids = {};
	//als erstes divide up oids into obj_types
	for (const oid of oids) {
		let key = R.getR(oid);
		if (!isEmpty(key)) {
			//console.log('***FOUND KEY FOR', oid, key);
			keysForOids[oid] = key[0]; //weil rsg eine liste ist!
		} else {
			key = getUID();
			let o = R.getO(oid);
			//console.log('oid',oid,'o',o)
			let nSpec = R.lastSpec[key] = { cond: { obj_type: o.obj_type }, type: 'info' };//, data: '.' };
			R.addR(oid, key);

			let otype = o.obj_type;
			let sameTypeOids = oids.filter(x => R.getO(x).obj_type == otype);
			//console.log('sameTypeOids', sameTypeOids);

			//for these objects find all fields that are literal value
			//make 1 object that has all the fields together
			let oSuper = {};
			for (const oid1 of sameTypeOids) {
				let o1 = R.getO(oid1);
				for (const k1 in o1) {
					if (k1 == 'obj_type' || k1 == 'oid' || !isLiteral(o1[k1])) continue;
					if (isdef(oSuper[k1])) continue;
					oSuper[k1] = '.' + k1;

				}

			}
			let dataKeys = Object.keys(oSuper);
			if (dataKeys.length == 0) oSuper = 'X';
			else if (dataKeys.length == 1) oSuper = '.' + dataKeys[0];

			//console.log('oSuper is', oSuper, '\nsoll das jetzt dann data sein?');
			nSpec.data = oSuper;
			keysForOids[oid] = key;
			R.updateR(key); //retest all objects in R for this cond! so that next time find key for this type of object!
		}
	}

	return keysForOids;
}

function findAddress(kSelf, x, path) {
	//x muss noch dem path folgen bis es bei der richtigen branch
	//angekommen ist!
	//let path = ppath;
	let path1 = stringAfter(path, 'self');
	path1 = kSelf + path1;
	if (path1[0] != '.') path1 = '.' + path1;
	//if (isEmpty(path1)) path1='spk';
	//console.log('path', path, 'path1', path1);
	let x1 = calcAddressWithin(x, path1);
	return [x1.key, x1.obj];
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
			} else if (props.length == 1) {
				return { key: props[0], obj: o };
			}
			else {
				//take last property from props
				let key = last(props);
				let len = props.length;
				let props1 = props.slice(0, len - 1);
				//console.log('props',props,'props1',props1)
				return { key: key, obj: dPP(o, props1, R) };
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
		let content = addr.map(x => calcAddressWithin(o, x, R));
		return content;
	}
	return null;

}
function decodePropertyPath(o, path) {
	if (isString(path) && path[0] == '.') {
		let props = path.split('.').slice(1);
		//console.log('o',o,'path', path,'props', props);
		//console.log(lookup(o,props));
		return lookup(o, props);

	}
}
function findAncestorElemWithParentOfType(el, type) {
	while (el && el.parentNode) {
		let t = getTypeOf(el);
		let tParent = getTypeOf(el.parentNode);
		//console.log('el', t, tParent, 'el.id', el.id, 'parentNode.id', el.parentNode.id);
		if (tParent == type) break;
		el = el.parentNode;
	}
	return el;

}
function findAncestorElemOfType(el, type) {
	while (el) {
		let t = getTypeOf(el);
		if (t == type) break;
		el = el.parentNode;
	}
	return el;

}
function getParentUi(n) { return n.idUiParent ? mBy(n.idUiParent) : null; }
function getParentRNode(n, R) { return n.uidParent ? R.rNodes(n.uidParent) : null; }
function getParentUiNodes(n, R) { return n.uidParent ? R.uiNodes(n.uidParent) : null; }
function getO(n, R) { let oid = n.oid; if (isdef(oid)) return R.getO(oid); else return null; }
function inferType(n, defType = 'panel') { if (isdef(n.children)) return 'panel'; else return 'info'; }
function isBoard(uid, R) {
	if (!uid) return false;
	let n = R.uiNodes[uid];
	return isdef(n) && isdef(n.bi) && isdef(n.bi.boardDiv);
}
function isBoardMember(uid, R) {
	//console.log('uid',uid);
	let n = R.uiNodes[uid];
	return isdef(n) ? isBoard(n.uidParent, R) : false;

}
function extendPath(path, postfix) { return path + (endsWith(path, '.') ? '' : '.') + postfix; }

function hasId(o) { return isdef(o._id); }

function normalizeToList(n, prop) {
	let val = n[prop];
	if (isdef(val) && !isList(val)) n[prop] = [val];
}

//#region cond, eval, eval FUNCTIONS
var FUNCTIONS = {
	instanceof: 'instanceOf',
	//obj_type: (o, v) => o.obj_type == v,
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
	//if (isList(condVal)) console.log('liste',func)
	if (isString(func)) func = window[func];
	if (nundef(func)) {
		//condKey and condVal interpreted as property of object
		//console.log('haaaaaaaaaaaaaalllllllllllo')
		if (nundef(o[condKey])) return null;
		if (isList(condVal)) {
			//console.log('list!')
			for (const v of condVal) if (o[condKey] == v) return true;
			return null;
		} else {
			return isdef(o[condKey]) ? o[condKey] == condVal : null;

		}
	}
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
	show: false,
	overlap: true,
	orientation: true, // TODO: false
	split: true, // TODO: false
	shape: true,
	field_spacing: true,
	size: true,
	rounding: true,
};
const COLORPARAMNAMES = {
	bg: true,
	fg: true,
	color: true,
	'font-color': true,
	border: true,
	highlight: true,
	highlight1: true,
	highlight1: true,
}
function decodeColor(c) {
	//color of form: [name lum alpha] is turned into corresponding number
	//name...knowncolor, lum...percent helligkeit (0=black,100=white), alpha:0-1
	//if form is [name float] float is interpreted as alpha, lum=50
	//if form is [name int] int is interpreted as lum, alpha=1
	//if form is [name] lum=50,alpha=1
	//console.log(c)
	let parts = c.split(' ');
	if (parts.length == 1) return c;
	else if (parts.length == 2 && (parts[1][0] == '.' || parts[1][0] == '0')) {
		return anyColorToStandardString(parts[0], Number(parts[1]));
	} else {
		//has parts[1] and this is lum, may also have parts[2] alpha
		let n = Number(parts[1]);
		let lumParam = n / 50 - 1.0;
		let cAltered = colorShade(lumParam, parts[0]);
		if (parts.length > 2) { cAltered = anyColorToStandardString(cAltered, Number(parts[2])); }
		//console.log('c', c, 'cAltered', cAltered);
		return cAltered;

	}

}
function decodeParams(n, R, defParams) {


	if (isdef(n.params) && isdef(n.params._NODE)) {
		//console.log('spaetestens JETZT muss ich ersetzen!!!!',n.params);
		//wie wird ersetzt???
		let spk = n.params._NODE;
		//console.log('params spec key is',spk);
		let oParams = R.getSpec()[spk];
		//console.log(oParams);
		for (const k in oParams) {
			n.params[k] = oParams[k];
		}
		delete n.params._NODE;
		//rueckwirkend aendere auch rtree node!!!
		let r = R.rNodes[n.uid];
		r.params = jsCopy(n.params);
	}

	if (nundef(n.params)) n.params = lookup(R.defs, [n.type, 'params']);
	if (!n.params) n.params = {};
	//console.log('________ decodeParams for type',n.type);
	// console.log('n.params', n.params);
	// console.log('n.defParams', n.defParams);

	let inherited = lookup(defParams, [n.type, 'params']);
	let defaults = lookup(R.defs, [n.type, 'params']);
	let defs = n.params.inherit ? inherited : defaults;
	if (n.type != 'grid') n.params = mergeOverrideArrays(defs, n.params);

	let o = isdef(n.oid) ? R.getO(n.oid) : null;
	let pNew = {};
	if (o) {
		//if (isdef(o.port)) console.log('o', o, '\nparams', n.params)
		pNew = mapValues(o, n.params, defs, R.getSpec());
		for (const k in pNew) { pNew[k] = calcContentFromData(n.oid, o, pNew[k], R); }
	} else pNew = n.params;

	if (isdef(pNew.bg) || isdef(pNew.fg)) {
		[pNew.bg, pNew.fg] = getExtendedColors(pNew.bg, pNew.fg);
	}

	//finally, special param values are converted
	//console.log('vor dem loop', pNew);

	//remove all params that have a value of undefined!!!!
	let pNew1 = {};
	for (const k in pNew) { if (nundef(pNew[k])) continue; pNew1[k] = pNew[k]; }
	pNew = pNew1;

	for (const k in pNew) { if (COLORPARAMNAMES[k]) pNew[k] = decodeColor(pNew[k]); }
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
		//console.log('_key is', _key);
		//console.log('o1',o1,'',_key,_key);
		let val = _map[_key];
		//console.log('val is', val); //this will usually be a dict

		let valKey = isdef(m.value) ? m.value : k;

		//console.log('===>the key of value to use is', valKey)

		if (isdef(val) && isdef(val[valKey])) { oNew[k] = val[valKey]; }

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












