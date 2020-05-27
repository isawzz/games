function recTree(n, rParent, R, oid, key) {
	//CYCLES += 1; if (CYCLES > MAX_CYCLES) return 'idiot';
	//console.log('***recTree input:', '\nn', n, '\nParent', rParent)
	let uid = getUID();
	let n1 = {};

	let expandProp = '_NODE'; let nodeName = n[expandProp];
	if (isString(nodeName)) {
		//console.log('________ found _NODE', nodeName, '\nn', n);
		let nSpec = R.getSpec(nodeName);
		if (nundef(n.cond) && nundef(nSpec.cond)) {
			let merged = merge1(nSpec, n, { dataMerge: 'reverse' });
			//console.log('__________ ',nodeName,'\nn',n,'\nnSpec',nSpec,'\nmerged',merged);

			delete merged._NODE;
			if (isdef(nSpec._NODE)) merged._NODE = nSpec._NODE;

			//console.log('*** calling recTree',merged)
			return recTree(merged, rParent, R, oid, key);
		} else if (n.cond) {
			//console.log('=====n.cond MIT _NODE!!!!!!\n',n,nodeName)
			n = merge1(nSpec, n, { dataMerge: 'none' });
			delete n._NODE;
		} else {
			if (n.cond) { console.log('ja, n.cond kann sein!!!!', '\nn', n, '\nnSpec', nSpec) }
			lookupAddToList(R.Locations, [nodeName], uid);
			n1.here = nodeName;
			//console.log(n1,n)
			if (nundef(n.data)) n1.type = 'invisible';
		}
	} else if (isList(nodeName)) {

		console.log('REINGEFALLEN!!!!!!!!!!!!!!!!!!!!!!')

		let [mergedCondNodes, mergedNoCondNodes, newNodeList, hereList] = makeMergedSpecNodes_dep(nodeName, n, R);
		console.log('_______', '\nn', n, '\nmergedCond', mergedCondNodes, '\nmergedNoCond', mergedNoCondNodes)

		// case 1. n is no cond, only no cond nodes 
		if (nundef(n.cond) && isEmpty(mergedCondNodes)) {
			let merged = merge1(mergedNoCondNodes, n, { dataMerge: 'reverse' });
			//console.log('__________ ',nodeName,'\nn',n,'\nnSpec',nSpec,'\nmerged',merged);

			delete merged._NODE;
			if (!isEmpty(newNodeList)) {
				if (newNodeList.length == 1) merged._NODE = newNodeList[0];
				else merged._NODE = newNodeList;
			}

			//console.log('*** calling recTree',merged)
			return recTree(merged, rParent, R, oid, key);
		}
		// case 1. n is no cond, only cond nodes 
		else if (nundef(n.cond) && isEmpty(mergedNoCondNodes)) {
			let combiName = getCombNodeName(hereList);
			//if (R.)

			//da es mehrere nodes waren die reingemerged wurde, muss ich immer noch orig node
			//testen? nein, jetzt is orig node ein cond node! also kommt ein here node!
			//wenn es mehr als 1 name MIT cond gibt, muss einen neuen spec node adden der alle cond nodes gemerged hat
			//for now ASSUME THERE IS ONLY 1 merged in node w/ cond!!!!!!!
			if (hereList.length > 0)
				lookupAddToList(R.Locations, [nodeName], uid);
			n1.here = nodeName;
			//console.log(n1,n)
			if (nundef(n.data)) n1.type = 'invisible';
		}




		//old code:
		// merged = merge1(merged, n, {reverseData:true});
		// delete merged._NODE;
		// if (!isEmpty(newNodeList)) merged._NODE = newNodeList.length == 1 ? newNodeList[0] : newNodeList;
		// if (!isEmpty(hereList)) {
		// 	merged.here = hereList.length == 1 ? hereList[0] : hereList;
		// 	if (nundef(n.data)) merged.type = 'invisible';
		// }
		// return recTree(merged, rParent, R, oid, key);
	}

	n1 = mergeOverrideArrays(n, n1);
	if (isdef(n1.sub)) delete n1.sub;
	n1.uid = uid;
	n1.uidParent = rParent ? rParent.uid : null;
	if (isdef(oid)) n1.oid = oid;

	let chProp = 'sub'; let chlist = n[chProp];
	if (isdef(chlist)) {
		n1.children = [];
		for (const chInfo of chlist) {
			let ch = recTree(chInfo, n1, R, oid, key);
			R.rNodes[ch.uid] = ch;
			n1.children.push(ch.uid);
		}
	}

	//if (oid == '9') console.log('Board: recTree returns',jsCopy(n1))
	//if (oid == '0') console.log('Member: recTree returns',jsCopy(n1))

	//console.log('am ende!')
	return n1;
}




function recTree_work(n, rParent, R, oid, key) {
	//CYCLES += 1; if (CYCLES > MAX_CYCLES) return 'idiot';
	//console.log('***recTree input:', '\nn', n, '\nParent', rParent)
	let uid = getUID();
	let n1 = {};

	let expandProp = '_NODE'; let nodeName = n[expandProp];

	//als erstes process if list
	//am ende soll nur noch 1 _NODE da sein!

	if (isList(nodeName)) {
		let mergedCondNodes = {};
		let mergedNoCondNodes = {};
		let newNodeList = [];
		let hereList = [];
		for (const name of nodeName) {
			let nSpec = R.getSpec(name);
			if (nundef(nSpec.cond)) {
				mergedNoCondNodes = merge1(mergedNoCondNodes, nSpec);// deepmerge(merged, nSpec);
				if (isdef(nSpec._NODE)) addIf(newNodeList, nSpec._NODE);
			} else {
				mergedCondNodes = merge1(mergedCondNodes, nSpec);// deepmerge(merged, nSpec);
				if (isdef(nSpec._NODE)) addIf(hereList, nSpec._NODE);
			}
		}
		//wenn n.cond merge mergedCondNodes hinein else merge mergedNoCondNodes hinein
		// if (n.cond) {
		// 	console.log('_______', '\nn', n, '\nmergedCond', mergedCondNodes, '\nmergedNoCond', mergedNoCondNodes)
		// 	n = merge1(mergedCondNodes, n, { dataMerge: 'none' });
		// }



		//again hier hab ich 1 mergedNoCondNodes und 1 mergedCondNodes
		//jetzt muss n wie oben mergen!
		//new code:
		// ich hab jetzt 2 specNodes und n
		console.log('_______', '\nn', n, '\nmergedCond', mergedCondNodes, '\nmergedNoCond', mergedNoCondNodes)
		//console.log('TEST: isEmpty({})',isEmpty({}))
		if (nundef(n.cond) && isEmpty(mergedCondNodes)) {
			let merged = merge1(mergedNoCondNodes, n, { dataMerge: 'reverse' });
			//console.log('__________ ',nodeName,'\nn',n,'\nnSpec',nSpec,'\nmerged',merged);

			delete merged._NODE;
			if (!isEmpty(newNodeList)) {
				if (newNodeList.length == 1) merged._NODE = newNodeList[0];
				else merged._NODE = newNodeList;
			}

			//console.log('*** calling recTree',merged)
			return recTree(merged, rParent, R, oid, key);
		} else {
			//da es mehrere nodes waren die reingemerged wurde, muss ich immer noch orig node
			//testen? nein, jetzt is orig node ein cond node! also kommt ein here node!
			//wenn es mehr als 1 name MIT cond gibt, muss einen neuen spec node adden der alle cond nodes gemerged hat
			//for now ASSUME THERE IS ONLY 1 merged in node w/ cond!!!!!!!
			if (hereList.length > 0)
				lookupAddToList(R.Locations, [nodeName], uid);
			n1.here = nodeName;
			//console.log(n1,n)
			if (nundef(n.data)) n1.type = 'invisible';
		}




		//old code:
		// merged = merge1(merged, n, {dataMerge: 'reverse'});
		// delete merged._NODE;
		// if (!isEmpty(newNodeList)) merged._NODE = newNodeList.length == 1 ? newNodeList[0] : newNodeList;
		// if (!isEmpty(hereList)) {
		// 	merged.here = hereList.length == 1 ? hereList[0] : hereList;
		// 	if (nundef(n.data)) merged.type = 'invisible';
		// }
		// return recTree(merged, rParent, R, oid, key);
	}



	if (isString(nodeName) || combiNode) {
		console.log('________ found _NODE', nodeName, '\nn', n);
		let nSpec = combiNode ? combinedNode : R.getSpec(nodeName);
		if (nundef(n.cond) && nundef(nSpec.cond)) {
			let merged = merge1(nSpec, n, { dataMerge: 'reverse' });
			//console.log('__________ ',nodeName,'\nn',n,'\nnSpec',nSpec,'\nmerged',merged);

			delete merged._NODE;
			if (isdef(nSpec._NODE)) merged._NODE = nSpec._NODE;

			//console.log('*** calling recTree',merged)
			return recTree(merged, rParent, R, oid, key);
		} else if (n.cond) {
			//console.log('=====n.cond MIT _NODE!!!!!!\n',n,nodeName)
			n = merge1(nSpec, n, { dataMerge: 'none' });
			delete n._NODE;
		} else { //also ist nSpec ein conde node! aber n nicht!
			//if (n.cond) { console.log('ja, n.cond kann sein!!!!','\nn', n,'\nnSpec',nSpec) }
			lookupAddToList(R.Locations, [nodeName], uid);
			n1.here = nodeName;
			//console.log(n1,n)
			if (nundef(n.data)) n1.type = 'invisible';
		}
	}

	n1 = mergeOverrideArrays(n, n1);
	if (isdef(n1.sub)) delete n1.sub;
	n1.uid = uid;
	n1.uidParent = rParent ? rParent.uid : null;
	if (isdef(oid)) n1.oid = oid;

	let chProp = 'sub'; let chlist = n[chProp];
	if (isdef(chlist)) {
		n1.children = [];
		for (const chInfo of chlist) {
			let ch = recTree(chInfo, n1, R, oid, key);
			R.rNodes[ch.uid] = ch;
			n1.children.push(ch.uid);
		}
	}

	//if (oid == '9') console.log('Board: recTree returns',jsCopy(n1))
	//if (oid == '0') console.log('Member: recTree returns',jsCopy(n1))

	//console.log('am ende!')
	return n1;
}



















