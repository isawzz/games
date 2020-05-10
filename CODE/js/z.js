//#region spec normalization => vielleicht brauch ich das noch!!!
function normalizeSpec(sp) {
	//preprocess sp:
	//each spec node is normalized: gets type, container prop=>ch, _id prop=>p
	let spNew = {};
	for (const k in sp) {
		spNew[k] = recNormalize(sp[k], sp);
	}
	return spNew;

}
function recNormalize(n, sp) {
	let n1 = jsCopy(n);
	let t = n1.type = nundef(n.type) ? inferType(n) : n.type;

	let locProp = 'panel';// isdef(n._id) ? '_id' : isString(n.type) && isdef(sp[n.type]) ? 'type' : 'p';
	if (locProp != 'p') {
		n1.p = n[locProp];
		delete n1[locProp];
	}
	let contProp = 'sub';// nundef(n.ch) && isContainerType(n1.type) ? RCONTAINERPROP[n1.type] : null;
	//console.log(contProp);
	if (contProp && isdef(n[contProp])) {
		n1.ch = n[contProp].map(x => recNormalize(x, sp));
		delete n1[contProp];
	}
	return n1;

}

//#region misc utils
function hasChildren(n) {
	let ch = RCONTAINERPROP[n.type];
	if (nundef(ch)) ch = 'ch';
	return isdef(n[ch]);
}
function calcContent_dep(oid, o, path) {

	if (isString(path)) {
		if (path[0] != '.') return path;

		//console.log('PATH:', path, 'oid', oid, 'o', o);
		let props = path.split('.').slice(1);
		//console.log('props', props, isEmpty(props));

		let content = isEmpty(props) ? o.obj_type : lookup(o, props);
		return content;
	} else if (isDict(path)) {
		let content = {};
		for (const k in path) {
			let c = calcContent_dep(oid, o, path[k]);
			if (c) content[k] = c;
		}
		return content;
	}
	return null;

}


//#region createSTree gen20 FAIL!!!!
function createSTree(n, idParent, R) {
	n = createNode(n, idParent, R);

	if (isContainerType(n.type)) {
		let prop = RCONTAINERPROP[n.type];

		//daraus mach jetzt liste von einzelnen els von verlangtem type
		//geht eigentlich nicht weil kann ja hand oder so sein! und was mach ich dann????
	}

}
function createNode(sp, idParent, R) {
	let n = jsCopy(sp);
	n.idParent = idParent;
	let id = n.nid = getUid();
	n.fullPath = R.NODES[idParent].fullPath + '.' + id;
	return n;
}

//#region io
function consExpand(o, keys, indent = 0) {
	console.log('.'.repeat(indent), o);
	for (const k in o) {
		if (!keys.includes(k)) continue;
		let oNew = o[k];
		console.log('.'.repeat(indent), k + ':')
		if (isList(oNew)) {
			for (const el of oNew) {
				consExpand(el, keys, indent + 2);
			}
		} else if (isDict(oNew)) {
			consExpand(oNew, keys, indent + 2);
		}
	}
}
function compactObjectString(o) {
	let s = '';
	for (const k in o) {
		if (isSimple(o[k]) && !isComplexColor(o[k])) {
			if (isDict(o[k])) { error('!!!!!!!!!!!!!!!!isDict', o[k]); }
			s += k + ':' + o[k] + ' ';
		}
	}
	return s;
}
function showFullObject(o, indent = 0, onlySimple = false) {
	for (const k in o) {
		if (isSimple(o[k])) console.log(' '.repeat(indent), k, o[k]);
		else if (!onlySimple) console.log(' '.repeat(indent), k, anyString3(o[k]));
		else {
			console.log(' '.repeat(indent), k);
			showFullObject(o[k], indent + 2);
		}
	}
}
function showObject(o, indent = 0, simple = true, lstShow = null, lstOmit = null) {
	let s = extendedObjectString(o, indent, simple, lstShow, lstOmit);
	console.log(s);
}
function showTree(o, childrenKeys = ['sub', 'elm'], plus, minus) {
	recShowTree(o, 0, childrenKeys, plus, minus);

}
function findFirstListKey(o, childrenKeys) {
	for (const k in o) {
		let val = o[k];
		if (childrenKeys && childrenKeys.includes(k) || isList(val)) {
			return k;
		}
	}
	return null;
}
function recShowTree(o, indent, childrenKeys, lstShow, lstOmit) {
	// recShowTree(R.ROOT,0,['children'],null,null,['source','bi'])
	showObject(o, indent, true, lstShow, lstOmit);
	let chkey = findFirstListKey(o, childrenKeys);
	//console.log(chkey,o[chkey])
	if (chkey) {
		console.log(' '.repeat(indent + 2) + chkey + ':');
		for (const ch of o[chkey]) {
			recShowTree(ch, indent + 4, childrenKeys, lstShow, lstOmit);
		}
	}

}
function anyString2(x, indent = 0, proplist, include = true, toplevelOnly = false) {
	if (isLiteral(x)) return x;// ' '.repeat(indent)+x;
	else if (isListOfLiterals(x)) return x.join(' '); // ' '.repeat(indent)+x.join(' ');
	else if (isEmpty(x)) return x;
	else if (isList(x)) {
		if (toplevelOnly) proplist = null;
		return x.map(el => anyString2(el, indent + 1, proplist, include)).join(' ');
	}
	else if (isDict(x)) {
		let plist = proplist;
		if (toplevelOnly) proplist = null;
		//console.log('dict!',plist,include,x);
		let s = '';
		if (isdef(plist)) {
			if (include) {
				for (const k of plist) {
					if (nundef(x[k])) { console.log('continue', x, k); continue; }
					s += '\n' + ' '.repeat(indent) + k + ': ' + anyString2(x[k], indent + 1, proplist, include);
				}
			} else {
				for (const k of plist) {
					if (isdef(x[k])) continue;
					s += '\n' + ' '.repeat(indent) + k + ': ' + anyString2(x[k], indent + 1, proplist, include);
				}
			}
		} else {
			for (const k in x) { s += '\n' + ' '.repeat(indent) + k + ': ' + anyString2(x[k], indent + 1, proplist, include); }
		}
		return s;
	}
}
function anyString(x, indent = 0, ifDict = 'entries') {
	if (isLiteral(x)) return x;// ' '.repeat(indent)+x;
	else if (isListOfLiterals(x)) return x.join(' '); // ' '.repeat(indent)+x.join(' ');
	else if (isEmpty(x)) return x;
	else if (isList(x)) { return x.map(el => anyString(el, indent + 1, ifDict)).join(' '); }
	else if (isDict(x)) {
		let s = '';
		for (const k in x) { s += '\n' + ' '.repeat(indent) + k + ': ' + anyString(x[k], indent + 1, ifDict); }
		return s;
	}
}
function anyToString1(x, indent = 0, ifDict = 'entries') {
	if (isList(x) && !isEmpty(x)) { return x.join(' '); }
	else if (isDict(x)) {
		return ifDict == 'keys' ? Object.keys(x).join(' ')
			: ifDict == 'entries' ? Object.entries(x).map(([k, v]) => k + ': ' + dictOrListToString(v, 'ifDict', indent + 2)).join('\n')
				: Object.entries(x).join(' ');
	}
	else return x;
}

//#region present
function mNode_dep(o, { dParent, title, listOfProps, omitProps, className = 'node', omitEmpty = false } = {}) {
	let d = mCreate('div');
	if (isdef(className)) mClass(d, className);
	// console.log(className)
	let oCopy = jsCopy(o);
	//console.log(oCopy)
	if (isdef(listOfProps)) recConvertToSimpleList(oCopy, listOfProps);
	if (nundef(omitProps)) omitProps = [];
	//console.log(omitProps,omitEmpty)
	if (omitEmpty || !isEmpty(omitProps)) oCopy = recDeleteKeys(oCopy, omitEmpty, omitProps);
	//console.log(oCopy);
	mYaml(d, oCopy);
	let pre = d.getElementsByTagName('pre')[0];
	pre.style.fontFamily = 'inherit';
	if (isdef(title)) mInsert(d, mTextDiv(title));
	if (isdef(dParent)) mAppend(dParent, d);
	return d;// {div:d,pre:pre};
}

function presentTree_dep(n, treeProperty, area, R, lf, ls, lo) {
	d = mBy(area);

	let depth = 10;
	let dLevel = [];
	for (let i = 0; i < depth; i++) {
		let d1 = dLevel[i] = mDiv(d);
		mColor(d1, colorTrans('black', i * .1));
	}

	let nDict = R.NodesByUid;
	//console.log('nDict',nDict)
	//console.log('n',n)
	//console.log('nDict',nDict);
	maxLevel = 1 + recPresent(n, 0, dLevel, nDict, treeProperty, { lstFlatten: lf, lstShow: ls, lstOmit: lo });
}
function presentRoot_dep(n, area, lf, ls, lo) {
	d = mBy(area);
	let depth = 10;
	let dLevel = [];
	for (let i = 0; i < depth; i++) {
		let d1 = dLevel[i] = mDiv(d);
		mColor(d1, colorTrans('black', i * .1));
	}
	addIf(lo, 'act');
	addIf(lo, 'ui');

	maxLevel = 1 + recPresentFilter(n, 0, dLevel, { lstFlatten: lf, lstShow: ls, lstOmit: lo });
}
function presentRootPresetLists_dep(n, area) {
	let lstFlatten = ['type', 'pool', 'source', 'data', 'content'];
	let lstShow = ['type', 'oid', 'data', 'content', 'pool'];
	let lstOmit = ['act', 'bi', 'sub', '_id', '_ref', 'children', 'source', 'specKey', 'params', 'cssParams', 'typParams', 'stdParams', 'uid', 'ui'];
	//show('contROOT');
	d = mBy(area);
	let level = 0;
	let depth = 10;
	let dLevel = [];
	for (let i = 0; i < depth; i++) {
		let d1 = dLevel[i] = mDiv(d);
		mColor(d1, colorTrans('black', i * .1));
	}

	maxLevel = 1 + recPresentFilter(n, 0, dLevel, { lstFlatten: lstFlatten, lstShow: lstShow, lstOmit: lstOmit });
	//console.log('tree has depth',maxLevel);

	removeInPlace(lstOmit, 'children');
}
function presentGenerations_dep(indices, area, R, genKey = 'G') {
	d = mBy(area);
	let level = 0;
	let depth = 10;
	let dLevel = [];
	for (let i = 0; i < depth; i++) {
		let d1 = dLevel[i] = mDiv(d);
		mSize(d1, '100%', 'auto');
		mFlexWrap(d1)
		mColor(d1, colorTrans('black', i * .1));
	}

	let di = 0;
	for (const i of indices) {
		let div = dLevel[di]; di++;
		presentNodes(R.gens[genKey][i], div);
	}
}



function presentServerData(sdata, area) {
	let d = mBy(area);
	clearElement(d);
	//console.log(d)
	for (const [k, v] of Object.entries(sdata)) {
		mNode_dep(v, { title: k, dParent: d, omitEmpty: true });
	}
}
function recPresent_dep1(n, level, dLevel, lstFlatten, lstShow) {
	let n1 = jsCopy(n);// filterByKey(n, lstShow); // ['type', 'pool', 'oid', 'data', 'content']);
	n1 = filterByNoKey(n, ['sub', '_id', '_ref', 'children', 'source', 'specKey', 'params', 'cssParams', 'typParams', 'stdParams', 'uid', 'ui'])
	mNode_dep(n1, { dParent: dLevel[level], listOfProps: lstFlatten });
	if (nundef(n.children)) return level;
	let max = 0;
	for (const x of n.children) {
		let newMax = recPresent_dep1(x, level + 1, dLevel, lstFlatten, lstShow);
		if (newMax > max) max = newMax;
	}
	return max;
}
function recPresent_dep(n, level, dLevel, { lstFlatten, lstShow, lstOmit } = {}) {
	let n1 = jsCopy(n);// filterByKey(n, lstShow); // ['type', 'pool', 'oid', 'data', 'content']);
	n1 = filterByNoKey(n, lstOmit);
	mNode_dep(n1, { dParent: dLevel[level], listOfProps: lstFlatten });
	if (nundef(n.children)) return level;
	let max = 0;
	for (const x of n.children) {
		let newMax = recPresent_dep(x, level + 1, dLevel, { lstFlatten: lstFlatten, lstShow: lstShow, lstOmit: lstOmit });
		if (newMax > max) max = newMax;
	}
	return max;
}











