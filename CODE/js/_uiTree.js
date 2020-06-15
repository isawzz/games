function isListOfServerObjects(x) {
	let oids = getElements(x);
	console.log('getElements returns', oids);
	return false;
}
function recUi(n, area, R, oid, key) {

	// *** n is rNode ***
	//just take rNode and make ui node

	//rNode can have a cond - deal with that later!
	//basically just eval data and params

	//if (n.uid=='_3') console.log('create uitree node','uid',n.uid,'oid',oid);
	let n1 = jsCopy(n);
	let o = isdef(oid) ? R.getO(oid) : null;
	//console.log('o',oid,o)
	if (isdef(n1.data)) {
		// if (n1.uid == '_3') {
		// 	console.log('calling calContentFromData',oid,n1.data,n1.default_data)
		// }
		n1.content = calcContentFromData(oid, o, n1.data, R, n1.default_data);
		//console.log('content:',n1.content,'uid',n1.uid,'n1.default_data',n1.default_data);
		//console.log('content',n1.uid,n1.data,typeof n1.content,n1.content);
	}

	//console.log('ui node',jsCopy(n1))
	R.uiNodes[n1.uid] = n1; // ONLY DONE HERE!!!!!!!
	if (n1.type == 'grid') {
		// R.uiNodes[n1.uid] = n1; // ONLY DONE HERE!!!!!!!
		createBoard(n1, area, R);
	} else {
		let oids = getElements(n1.content);
		if (isdef(oids) && !isEmpty(oids)) {
			//console.log('found list of elements', oids, '\nWAS JETZT???');
			//hier muss ich jetzt die hand machen!
			//was ist der unterschied zu board???
			if (nundef(n1.type)) n1.type = 'panel';
			n1.content = null;
			n1.ui = createUi(n1, area, R);
			let rTreePanel = R.rNodes[n1.uid];


			let keysForOids = findOrCreateKeysForObjTypes(oids,R);
			//console.log('__________ END __________')

			for (const oid1 of oids) {
				//find a specNode!
				//how to do that???
				let o1 = R.getO(oid1);
				let key = keysForOids[oid1]; // createArtificialSpecForBoardMemberIfNeeded(oid1, o1, R);

				// let nSpec=R.getSpec(key);
				// console.log(nSpec);
				// if (nundef(nSpec.data)){
				// 	let dataExp={};
				// 	for(const k1 in o1){
				// 		if (k1 == 'obj_type' || k1 == 'oid' || !isLiteral(o1[k1])) continue;
				// 		dataExp[k1]='.'+k1;

				// 	}
				// 	let dataKeys=Object.keys(dataExp);
				// 	if (dataKeys.length == 0) dataExp='X';
				// 	else if (dataKeys.length == 1) dataExp = '.'+dataKeys[0];
				// 	nSpec.data=dataExp;
				// }

				//console.log('found key for', oid1, '=', key);
				let ntree, nui;
				//console.log('jetzt kommt',oid)
				ntree = instantOidKey(oid1, key, n1.uid, R);
				nui = recUi(ntree, n1.uid, R, oid1, key);
			}
			//console.log('rtree children',rTreePanel.children)
			n1.children = rTreePanel.children;
		} else {
			n1.ui = createUi(n1, area, R);
			// R.uiNodes[n1.uid] = n1; // ONLY DONE HERE!!!!!!!

		}
	}

	//console.log('R.uiNodes eingehaegt fuer','uid',n1.uid,'oid',oid);

	if (R.isUiActive) n1.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);

	if (nundef(n1.children) || n1.type == 'grid') return n1;

	//hier werden weitere children mit derselben oid created:
	//falls spec node complex ist!
	//aber wann werden deren rtree nodes eigentlich created??? da stimmt was nicht!!!
	n1.adirty = true;
	for (const ch of n1.children) {
		if (isdef(R.uiNodes[ch])) {
			//console.log('ui node',ch,'has already been created!!!!')
			continue;
		}
		recUi(R.rNodes[ch], n1.uid, R, oid, key);
	}

	return n1;

}