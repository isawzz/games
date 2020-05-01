//#region spec nodes for oid types
function createPresentationNodeForOid(oid, R) {
	let stypes = R.getR(oid);
	let o = R.getO(oid);
	// if (verbose) consOutput(oid, stypes);
	//if (isEmpty(stypes)) continue;
	//if no type is found, use default presentation! this child is not presented!

	let nrep = {};
	if (isEmpty(stypes)) {
		nrep = defaultPresentationNode(oid, o, R);
	} else {
		for (const t of stypes) { nrep = deepmergeOverride(nrep, R.getSpec(t)); }
		delete nrep.source;
		delete nrep.pool;
	}

	// if (verbose) consOutput('YES', oid, stypes, nrep);
	// if (verbose) consOutput('need to make a child for', oid, n, nrep);
	let n1 = nrep;
	n1.oid = oid;
	n1.content = nrep.data ? calcContentFromData(oid, o, nrep.data, R) : null;

	return n1;
}
function mergeInBasicSpecNodesForOid(oid, n, R) {
	let r = R.getR(oid);
	if (isEmpty(r)) return n;
	else {
		rlist = r;
		for (const specNodeName of rlist) {
			let nCand = R.getSpec(specNodeName); //TODO??? removed jsCopy
			n = deepmergeOverride(n, nCand);
		}
		return n;
	}
}

//#region merge _ids _refs
function mergeAllRefsToIdIntoNode(n, R) {
	//n has prop _id
	let loc = n._id;
	let refDictBySpecNodeName = R.refs[loc];
	let nNew = jsCopy(n); //returns new copy of n TODO=>copy check when optimizing(=nie?)
	for (const spNodeName in refDictBySpecNodeName) {
		let reflist = refDictBySpecNodeName[spNodeName];
		for (const ref of reflist) {
			nNew = deepmergeOverride(nNew, ref);
		}
	}
	return nNew;
	//console.log(refDictBySpecNodeName);
}
function mergeChildrenWithRefs(n, R) {
	for (const k in n) {
		//muss eigentlich hier nur die containerProp checken!
		let ch = n[k];
		if (nundef(ch._id)) continue;

		let loc = ch._id;
		//console.log('node w/ id', loc, ch);
		//console.log('parent of node w/ id', loc, jsCopy(n));

		//frage is container node n[containerProp] ein object (b) oder eine list (c)?
		//oder ist _id at top level (n._id) =>caught in caller


		let refs = R.refs[loc];
		if (nundef(refs)) continue;

		//have refs and ids to 1 _id location loc (A)
		//console.log('refs for', loc, refs);

		//parent node is 


		let spKey = Object.keys(refs)[0];
		let nSpec = R.lastSpec[spKey];
		//console.log('nSpec', nSpec);
		let oNew = deepmerge(n[k], nSpec);
		//console.log('neues child', oNew);
		n[k] = oNew;


	}
}
function mergeCorrectType(n, spec, defType) {

	let type = n.type;
	if (nundef(type)) {

		let t = detectType(n, defType);
		if (t) {
			n.type = t;
			//console.log('type missing ersetzt durch', n, n.type);
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












