
function mergedSpecNode(n1, n2) {
	if (nundef(n1.cond) && nundef(n2.cond)) {
		return merge1(n1,n2);// deepmerge(merged, nSpec);
	} else {
		return deepmerge(n1,n2); //,{dataMerge: 'none'});// deepmerge(merged, nSpec);
	}
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
function getCombNodeName(namelist) {
	return namelist.join('_');
}



function mergeArr(a, b, opt) {
	var res = a.slice()
	b.forEach(function (e, i) {
		if (typeof res[i] === 'undefined') { //el[i] nur in source
			res[i] = cloneIfNecessary(e, opt)
		} else if (isDictOrList(e)) { //el[i] in beidem
			res[i] = dm1(a[i], e, opt);
		} else if (a.indexOf(e) === -1) { //el[i] nur in target
			res.push(cloneIfNecessary(e, opt));
		}
	})
	return res
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
function dm1(a, b, opt) {
	//console.log('a',a,'b',b);
	if (nundef(a)) return b;
	else if (nundef(b)) return a;
	else if (isLiteral(a)) return b;
	else if (isLiteral(b)) return a;
	else if (Array.isArray(b)) {
		return Array.isArray(a) ? mergeArr(a, b, opt) : cloneIfNecessary(b, opt);
	} else {
		return mergeObj(a, b, opt);
	}
}
function mergeObj(a, b, opt) {
	//console.log('a',a)
	var res = {}
	if (nundef(a)) return b;
	else if (nundef(b)) return a;
	else if (isLiteral(a)) return b;
	else if (isLiteral(b)) return a;
	else if (isDictOrList(a)) {
		Object.keys(a).forEach(function (key) {
			res[key] = cloneIfNecessary(a[key], opt);
		})
	};
	Object.keys(b).forEach(function (key) {
		let func = opt[key];
		if (!res[key]) {
			//console.log('hier!!!')
			res[key] = isLiteral(b[key]) ? b[key] : jsCopy(b[key]); //cloneIfNecessary(b[key], opt);
		} else if (func) {
			//console.log('have custom func:',key,func);
			res[key] = func(a[key], b[key], opt);
			//console.log('...','a',a[key],'b',b[key],res[key]);
		} else if (isLiteral(a[key])) {
			res[key] = cloneIfNecessary(b[key], opt);//override a
		} else {
			res[key] = dm1(a[key], b[key], opt);
		} //else if (!isDictOrList(b[key]) || !a[key]) {			res[key] = cloneIfNecessary(b[key], opt);		} 

	})
	return res;
}

function merge1(sp1, sp2, { dataMerge } = {}) {
	//console.log('calling dm1')
	//return merge(sp1,sp2);
	let options = {
		sub: (a, b, opt) => b.concat(a),
		data: (a, b, opt) => isLiteral(a) && isLiteral(b) ?
			nundef(dataMerge)||dataMerge=='concat'? a + ' ' + b
			:dataMerge == 'reverse'?b + ' ' + a
			:b
			: dm1(a, b, opt),
		//params: (a, b, opt) => ({ bg: 'green' }),
	};
	return dm1(sp1, sp2, options);
}















