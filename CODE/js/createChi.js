var recSafetyCheck=null;
function createChi(nCont, R) {
	let prop = RCONTAINERPROP[nCont.type];
	let n = nCont[prop];

	//showNodeInfo(nCont, 'container');
	//if (!isList(n)) showNodeInfo(n, 'children'); else consOutput('liste!!!');
	let verbose = false;// (isString(n) && n[0] == '.');

	let chNodes = [];

	//case a: n is a string eg., .neutral
	//geht wahrsceinlich nicht fuer multiple levels, must study this!!!!!
	if (isString(n)) {
		console.log('case .aaaa')
		//zuerst muss dataset finden
		if (verbose) showNodeInfo(nCont, 'beispiel');

		//replace this by calcContent
		let ownerId = nCont.oid;
		let owner = R.sData[ownerId];
		let olist = calcContent(owner, n);

		// console.log('string case olist=',owner,n,olist);
		//if owner does not have corresponding property, nothing is created!
		if (!olist) return [];
		
		for (const oid of olist) {
			//each of these is becoming 1 child the type of which is unknown!!!
			let o = R.sData[oid];
			let stypes = o._rsg;
			if (verbose) consOutput(oid, stypes);

			//if (isEmpty(stypes)) continue;
			//if no type is found, use default presentation! this child is not presented!

			let nrep = {};
			if (isEmpty(stypes)) { nrep = defaultPresentationNode(oid, o); }
			else {
				for (const t of stypes) { nrep = deepmergeOverride(nrep, R.lastSpec[t]); }
				delete nrep.source;
				delete nrep.pool;
			}

			if (verbose) consOutput('YES', oid, stypes, nrep);

			if (verbose) consOutput('need to make a child for', oid, n, nrep);
			let n1 = nrep;
			n1.oid = oid;
			n1.content = nrep.data ? calcContent(R.sData[oid], nrep.data) : null;
			createLC(n1, nCont.uid, R);
			chNodes.push(n1);

		}
	}
	//cases 0: n is a list
	else if (isList(n)) {
		console.log('...case 0');
		for (const x of n) {
			let n1 = jsCopy(x);
			let content = null;
			if (isdef(x.data) && isdef(nCont.oid) && nundef(n1.oid)) {
				n1.oid = nCont.oid;
				content = calcContent(R.sData[n1.oid], n1.data);
			} else if (isdef(x.data)) {
				content = x.data;
			} else if (isdef(nCont.oid) && nundef(n1.oid)) { n1.oid = nCont.oid; }
			n1.content = content;
			createLC(n1, nCont.uid, R);
			chNodes.push(n1);
		}
	}
	//cases 1-4: n is a dict
	//case 1: wenn n ein pool besitzt muss fuer jedes el im pool 1 child gemacht werden
	else if (!isEmpty(n.pool)) {
		console.log('...case 1')
		for (let i = 0; i < n.pool.length; i++) {
			let n1 = jsCopy(n);
			n1.oid = n.pool[i];
			n1.content = n.data ? calcContent(R.sData[n1.oid], n.data) : null;
			createLC(n1, nCont.uid, R);
			chNodes.push(n1);
		}
	}
	//case 2: wenn n ein oid besitzt muss fuer dieses 1 child gemacht werden
	else if (isdef(n.oid)) {
		console.log('...case 2')
		let n1 = jsCopy(n);
		n1.content = n.data ? calcContent(R.sData[n1.oid], n.data) : null;
		createLC(n1, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 3: wenn n ein data besitzt muss fuer dieses 1 child gemacht werden
	else if (isdef(n.data) && n.data[0] == '.' && isdef(nCont.oid)) {
		console.log('...case 3')
		let n1 = jsCopy(n);
		n1.oid = nCont.oid;
		n1.content = calcContent(R.sData[n1.oid], n.data);
		createLC(n1, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 4: wenn n containerType ist und parent container ein oid hat muss fuer dieses 1 child gemacht werden
	else if (isContainerType(n.type) && isdef(nCont.oid)) {
		console.log('...case 4')
		let n1 = jsCopy(n);
		n1.oid = nCont.oid;
		n1.content = null;
		createLC(n1, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 5: n.data, n NOT container, nCont.pool + nCont.data, NO nCont.oid, 
	else if (isdef(n.data) && !isContainerType(n.type) && nundef(nCont.oid) && isdef(nCont.pool) && isdef(nCont.data)) {
		console.log('...case 5');
		//dieses pool darf nur 1 element haben!!!
		nCont.oid = nCont.pool[0];
		//die data muessen in diesem fall eine liste (of objects!)
		//erstmal brauch ich die data
		let data = calcContent(R.sData[nCont.oid], nCont.data);
		//console.log('::::::::data', data);
		//let n1 = jsCopy(n);
		n.pool = data;
		//console.log('have to create info foreach of pool of', n);
		chNodes = createChi(nCont, R);
	}
	//case 6: n.data, n NOT container, nCont.pool, NO nCont.oid, NO nCont.data
	else if (isdef(n.data) && !isContainerType(n.type) && nundef(nCont.oid) && isdef(nCont.pool) && isdef(nCont.data)) {
		console.log('...case 6');
		//dieses pool darf nur 1 element haben!!!
		nCont.oid = nCont.pool[0];
		//die data muessen in diesem fall eine liste sein
		let n1 = jsCopy(n);
		n1.content = n.data;
		createLC(n1, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 10: n.data, n NOT container, NO nCont.pool, NO nCont.oid, NO nCont.data
	else if (isdef(n.data) && !isContainerType(n.type) && nundef(nCont.oid) && nundef(nCont.pool)) {
		console.log('...case 10')
		let n1 = jsCopy(n);
		n1.content = n.data;
		createLC(n1, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 11
	else if (isContainerType(n.type) && nundef(nCont.oid) && nundef(nCont.pool)) {
		console.log('...case 11')
		let n1 = jsCopy(n);
		n1.content = n.data;
		createLC(n1, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 12
	else if (isContainerType(n.type) && nundef(nCont.oid) && isdef(nCont.pool)) {
		//instantiate this node n foreach element in nCont.pool
		console.log('...case 12!!!!!!!!!!!!!!!!!!!');
		//console.log('nCont',nCont)
		//console.log('n',n);

		n.pool = nCont.pool;
		if (!recSafetyCheck) {
			recSafetyCheck=true;
			return createChi(nCont, R);
		}else {
			recSafetyCheck=false;
			console.log('...case 12: prevented endlosrecursion!!!!!!!!!!!');
			console.log('nCont',nCont)
			console.log('n',n);
		}	
		// for (let i = 0; i < n.pool.length; i++) {
		// 	let n1 = jsCopy(n);
		// 	n1.oid = n.pool[i];
		// 	n1.content = n.data ? calcContent(R.sData[n1.oid], n.data) : null;
		// 	createLC(n1, nCont.uid, R);
		// 	chNodes.push(n1);
		// }

	}
	else{
		console.log('...case 13!!!!!!! dont know what to do with:')
		console.log('nCont',nCont)
		console.log('n',n);
	}
	return chNodes;

}
