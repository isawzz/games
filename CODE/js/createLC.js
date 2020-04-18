function createLC(n, area, R) {
	// n ist already a copy of the node to be created

	R.registerNode(n);

	let content = n.content;

	//inner node
	if (isContainerType(n.type)) {

		createUi(n, area, R);

		if (isdef(content) && isList(content)) {
			//pass as pool to container content
			let prop = RCONTAINERPROP[n.type];
			let n1 = n[prop];
			n1.pool = content; //intersect!
			//console.log('JETZT!!!', n.pool)
		}

		//replace children by spec nodes
		//also: process case where container prop is a path .neutral zB
		//try to do it in createChi first!
		let prop = RCONTAINERPROP[n.type];
		let nOrList = n[prop];
		if (isList(nOrList)) {
			//each list element can only result in <= 1 binding!!!
			//so if it's type is a list, simply merge all the types in it
			for (let i = 0; i < nOrList.length; i++) {
				let nch = nOrList[i];
				//#region merge multiple types NOT IMPLEMENTED!!!
				if (isList(nch.type)) {
					let types = nch.type.filter(x => isSpecType(x));
					let standardTypes = nch.type.filter(x => !isSpecType(x));
					let newel = nch;
					for (const t of types) {
						newel = mergeWithSpecType(newel, t, R);
					}
					nOrList[i] = newel;
					//console.log('^^^newel has type', newel.type);
				}
				//#endregion

				if (isSpecType(nch.type)) {
					nOrList[i] = mergeWithSpecType(nch, nch.type, R);
				}
			}
		} else if (isDict(nOrList)) {
			let nch = nOrList;
			//#region merge multiple types NOT IMPLEMENTED!!!
			if (isList(nch.type) && nch.type.length == 1) {
				nch.type = nch.type[0];
			} else if (isList(nch.type) && nch.type.length > 1) {
				let specTypes = nch.type.filter(x => isSpecType(x));

				let standardTypes = nch.type.filter(x => !isSpecType(x));
				let newel = nch;
				//console.log('specTypes', specTypes);
				let newNProp = [];
				//first make 1 list element for each different 
				for (const t of specTypes) {

					newel = mergeWithSpecType(newel, t, R);
				}
				n[prop] = newel;
				//console.log('^^^newel has type', newel.type);
			}
			//#endregion

			if (isSpecType(nOrList.type)) {
				n[prop] = mergeWithSpecType(nOrList, nOrList.type, R);
			}
		} else {
			//console.log('hhhhhhhhhhhhhh')
		}

		n.children = createChi(n, R);

		adjustLayout(n,R);
	}

	//leaf
	else {

		createUi(n, area, R);

	}
	return n;
}







