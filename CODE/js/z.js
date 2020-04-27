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
function showTree(o, childrenKeys = ['panels', 'elm'], plus, minus) {
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
function presentServerData(sdata, area) {
	let d = mBy(area);
	clearElement(d);
	//console.log(d)
	for (const [k, v] of Object.entries(sdata)) {
		mNode(v, { title: k, dParent: d, omitEmpty: true });
	}
}

function recPresent_dep(n, level, dLevel, lstFlatten, lstShow) {
	let n1 = jsCopy(n);// filterByKey(n, lstShow); // ['type', 'pool', 'oid', 'data', 'content']);
	n1 = filterByNoKey(n, ['panels', '_id', '_ref', 'children', 'source', 'specKey', 'params', 'cssParams', 'typParams', 'stdParams', 'uid', 'ui'])
	mNode(n1, { dParent: dLevel[level], listOfProps: lstFlatten });
	if (nundef(n.children)) return level;
	let max = 0;
	for (const x of n.children) {
		let newMax = recPresent_dep(x, level + 1, dLevel, lstFlatten, lstShow);
		if (newMax > max) max = newMax;
	}
	return max;
}











