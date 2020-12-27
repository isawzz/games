function logicSelector(nClauses, useExcept, useOrAndAnd, useAllComparisonOps) {

	let props = { label: { vals: getDistinctVals(Pictures, 'label'), friendly: '' } };
	if (G.numColors > 1) props.colorKey = { vals: getDistinctVals(Pictures, 'colorKey'), friendly: 'color' };
	if (G.numRepeat > 1) props.iRepeat = { vals: getDistinctVals(Pictures, 'iRepeat'), friendly: 'number' };

	console.log('props', props)

	//level 0: eliminate all backpacks | eliminate all with color=blue | elim all w/ number=2
	let lstSpoken, lstWritten;

	if (G.level >= 3){
		//pick another val of the same type as before
		let proplist = choose(Object.keys(props),2);
		console.log('proplist is', proplist, 'vals', props[proplist].vals)
		let val = chooseRandom(props[proplist].vals);
		console.log('val chosen', val)
		//val = chooseRandom(myProps[prop])
		let lst = ['eliminate', 'all'];
		if (proplist == 'label') lst.push(val + (Settings.language == 'E' ? 's' : ''));
		else lst = lst.concat(['with', props[proplist].friendly, val]);
		lstSpoken = lst;
		console.log(lstSpoken)
	} else if (G.level >= 0) {
		let proplist = choose(Object.keys(props),2);
		console.log('prop is', proplist);//, 'vals', props[prop].vals)
		for(const prop of proplist){
			
		}
		let vals = choose(props[prop].vals,2);
		console.log('val chosen', vals)
		//val = chooseRandom(myProps[prop])
		let lst = ['eliminate', 'all'];
		if (prop == 'label') {
			lst.push(vals[0]);// + (Settings.language == 'E' ? 's' : ''));
			for(const val of vals.slice(1)){
				lst.push('and');
				lst.push(val);// + (Settings.language == 'E' ? 's' : ''));
			}
		}else {
			lst.push('with');lst.push(props[prop].friendly);
			lst.push(vals[0]);
			for(const val of vals.slice(1)){
				lst.push('or')
				lst.push(val);
			}
		}
		lstSpoken = lst;
		console.log(lstSpoken)
	} else if (G.level >= 0) {
		let prop = chooseRandom(Object.keys(props));
		console.log('prop is', prop, 'vals', props[prop].vals)
		let vals = choose(props[prop].vals,2);
		console.log('val chosen', vals)
		//val = chooseRandom(myProps[prop])
		let lst = ['eliminate', 'all'];
		if (prop == 'label') {
			lst.push(vals[0]);// + (Settings.language == 'E' ? 's' : ''));
			for(const val of vals.slice(1)){
				lst.push('and');
				lst.push(val);// + (Settings.language == 'E' ? 's' : ''));
			}
		}else {
			lst.push('with');lst.push(props[prop].friendly);
			lst.push(vals[0]);
			for(const val of vals.slice(1)){
				lst.push('or')
				lst.push(val);
			}
		}
		lstSpoken = lst;
		console.log(lstSpoken)
	} else if (G.level >= 0) {
		let prop = chooseRandom(Object.keys(props));
		console.log('prop is', prop, 'vals', props[prop].vals)
		let val = chooseRandom(props[prop].vals);
		console.log('val chosen', val)
		//val = chooseRandom(myProps[prop])
		let lst = ['eliminate', 'all'];
		if (prop == 'label') lst.push(val + (Settings.language == 'E' ? 's' : ''));
		else lst = lst.concat(['with', props[prop].friendly, val]);
		lstSpoken = lst;
		console.log(lstSpoken)
	}
	if (nundef(lstWritten)) lstWritten = lstSpoken;

	return [lstSpoken.join(' '), lstWritten.join(' ')];

}

function getDistinctVals(list, prop) {
	let res = [];
	for (const item of list) {
		let val = item[prop];
		addIf(res, val);
	}
	return res;
}

function logicSelector0(nClauses, useExcept, useOrAndAnd, useAllComparisonOps) {

	if (nundef(nClauses)) nClauses = G.level + 1;
	let selected = [];
	let unselected = Pictures.map(x => x.div.id);
	let valsUsed = [];
	let propsUser = [];
	console.log(Pictures[0]);
	let props = { label: { vals: getDistinctVals(Pictures, 'label'), friendly: '' } };

	if (G.numColors > 1) props.colorKey = { vals: getDistinctVals(Pictures, 'colorKey'), friendly: 'color' };
	if (G.numRepeat > 1) props.iRepeat = { vals: getDistinctVals(Pictures, 'iRepeat'), friendly: 'number' };

	let total = 0; let propvals = [];
	for (const k in props) {
		for (const k1 of props[k].vals) { total += 1; propvals.push([k, k1, total]) }
	}
	nClauses = Math.min(nClauses, total - 1);

	console.log('propvals', propvals);

	let ops = { eq: (k, v) => Pictures.filter(x => x[k] == v), neq: (k, v) => Pictures.filter(x => x[k] != v) };
	let compOps = {
		eq: ops.eq,
		neq: ops.neq,
		leq: (k, v) => Pictures.filter(x => x[k] <= v),
		//less: (k, v) => Pictures.filter(x => x[k] < v),
		geq: (k, v) => Pictures.filter(x => x[k] >= v),
		//greater: (k, v) => Pictures.filter(x => x[k] >= v),
	};
	let boolOps = {
		and: (a, b) => Pictures.filter(x => a(x) && b(x)),
		or: (a, b) => Pictures.filter(x => a(x) && b(x)),
		not: a => Pictures.filter(x => !a(x)),
		nor: (a, b) => Pictures.filter(x => !a(x) && !b(x)),
		nand: (a, b) => Pictures.filter(x => !(a(x) && b(x))),
		equiv: (a, b) => Pictures.filter(x => a(x) == b(x)),
		xor: (a, b) => Pictures.filter(x => a(x) != b(x)),
	};
	let listOps = dict2list(ops);
	let listBoolOps = dict2list(boolOps);
	let listCompOps = dict2list(compOps);

	console.log('listBoolOps', listBoolOps)

	//need to select nClause propvals
	let propKeys = Object.keys(props);

	console.log(jsCopy(propKeys))
	shuffle(propKeys);

	let pvList = choose(propvals, nClauses);

	let myProps = propKeys.map(x => ({ k: x, v: [] }));
	for (const pv of pvList) {
		let prop = pv[0];
		let val = pv[1];
		let idx = pv[2];

		let item = firstCond(myProps, x => x.k == prop);
		item.v.push(val);

	}
	//console.log('===>myProps',myProps,propKeys);
	console.log('props', props)

	//level 0: eliminate all backpacks | eliminate all with color=blue | elim all w/ number=2
	let lstSpoken, lstWritten;
	if (G.level >= 0) {
		let prop = chooseRandom(propKeys);
		let val = chooseRandom(props[prop].vals);
		//val = chooseRandom(myProps[prop])
		let lst = ['eliminate', 'all'];
		if (prop == 'label') lst.push(val + Settings.language == 'E' ? 's' : '');
		lstSpoken = lst;
	}
	if (nundef(lstWritten)) lstWritten = lstSpoken;

	return [lstSpoken.join(' '), lstWritten.join(' ')];

	//only use or

	// let ipics=Pictures.map(x=>x.).filter(x=>{
	// 	let match=true;
	// 	for(const item of myProps){
	// 		let prop = item.k;
	// 		for(const val of item.v){
	// 			if (x[prop]==val)
	// 		}

	// 	}
	// })
	return;

	sortBy(pvList, 0);


	console.log(nClauses, nClauses)

	for (let i = 0; i < nClauses; i++) {

		//select a property and a value
		let pv = pvList[i];
		//formulate mission
		let prop = pv[0];
		let val = pv[1];
		let idx = pv[2];


		let op1 = isNumber(val) ? chooseRandom(listCompOps) : chooseRandom(listOps);

		//filter pictures to build set
		//have op1.id, op1.value
		let allPics = op1.value(prop, val);

		console.log('allPics', prop, val, op1.id, allPics)

		if (i > 0) {
			// choose a bool ops
			let op2 = chooseRandom(Object.keys(boolOps));

		}



	}

}


function multiFilter(props) {
	//props is list like [{k:label,v:[car,eye]},{k:iRepeat,v:[]},{k:colorKey,v:[blue,red]}]
	//wenn fuer eine prop mehr als 1 value ist dann kann ich entweder machen
	// wenn es no
}





