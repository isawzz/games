
//#region merge deprecated
function check_prop_dep(specKey, node, prop, dResults, R) {
	let akku = {};
	recFindProp(node, prop, 'self', akku);
	for (const k in akku) {
		let node = akku[k].node;
		let path = k;
		let name = akku[k].name;
		lookupAddToList(dResults, [name], { name: name, specKey: specKey, ppath: path, node: node });
	}
}
function mergeObj_dep(a, b, opt) {
	var res = {}
	if (isDictOrList(a)) {
		Object.keys(a).forEach(function (key) {
			res[key] = cloneIfNecessary(a[key], opt);
		})
	}
	Object.keys(b).forEach(function (key) {
		let func = opt.func;
		if (func) {
			res[key] = func(a[key], b[key], opt);
		} else if (!isDictOrList(b[key]) || !a[key]) {

			//console.log('das sollte bei data triggern!',key,source[key])
			res[key] = cloneIfNecessary(b[key], opt);
		} else {
			res[key] = dm1(a[key], b[key], opt);
		}
	})
	return res;
}
function makeMergedSpecNodes_dep(nodeNameList, n, R) {
	let mergedCondNodes = {};
	let mergedNoCondNodes = {};
	//let merged = {};//jsCopy(n);
	let newNodeList = [];
	let hereList = [];
	for (const name of nodeNameList) {
		let nSpec = R.getSpec(name);
		if (nundef(nSpec.cond)) {
			mergedNoCondNodes = merge1(mergedNoCondNodes, nSpec);// deepmerge(merged, nSpec);
			if (isdef(nSpec._NODE)) addIf(newNodeList, nSpec._NODE);
		} else {
			mergedCondNodes = deepmerge(mergedCondNodes, nSpec); //,{dataMerge: 'none'});// deepmerge(merged, nSpec);
			if (isdef(nSpec._NODE)) addIf(hereList, nSpec._NODE);
		}
	}
	return [mergedCondNodes, mergedNoCondNodes, newNodeList, hereList];
}


//#endregion


