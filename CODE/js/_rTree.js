function convertToList(x) {
	if (isList(x)) return x;
	if (isString(x) && x != '') return [x];
	return [];
}
function buildChanav(n, rParent) {
	let parentChanav = convertToList(rParent ? rParent.chanav : R.initialChannels);
	let ownChanav = convertToList(n.chanav);

	//which one has higher priority??? sagma own
	let res = ownChanav;
	parentChanav.map(x => addIf(res, x));

	return isEmpty(res) ? null : res.length == 1 ? res[0] : res;
}

function mixinChannel(n, rParent, R) {
	//determin channel: for now first available channel that is implemented
	//if none, none
	let chanav = buildChanav(n,rParent); // rParent ? rParent.chanav : R.initialChannels;
	chanavList = isList(chanav) ? chanav : isString(chanav) ? [chanav] : [];
	let chanimpl = n.channels;
	chanimpl = isDict(chanimpl) ? Object.keys(chanimpl) : isList(chanimpl) ? chanimpl : isString(chanimpl) ? [chanimpl] : [];
	//console.log('chanInitial', R.initialChannels, '\nrParent', rParent, '\nchanav', chanav, '\nchanimpl', chanimpl);

	let activeChannelKey = null; let activeChannel = null;
	for (const ch of chanimpl) {
		let k = Object.keys(ch)[0];
		let val = ch[k];
		//console.log('key', k, 'val', val);
		if (chanavList.includes(k)) { activeChannelKey = k; activeChannel = val; }
	}
	//console.log('active channel:', activeChannel);
	if (activeChannel) {
		//console.log('vor merge:', jsCopy(n));
		n = deepmerge(n, activeChannel);
		//console.log('nach merge:', jsCopy(n));
	}

	return [n,chanav];
}

function recTree(n, rParent, R, oid, key) {
	//CYCLES += 1; if (CYCLES > MAX_CYCLES) return 'idiot';
	//console.log('***recTree_ input:', '\nn', n, '\nParent', rParent)
	let uid = getUID();
	let n1 = {};

	let chanav;
	[n,chanav] = mixinChannel(n, rParent, R);
	//console.log('uid',uid,'chanav',chanav)

	let expandProp = '_NODE'; let nodeName = n[expandProp];
	if (isString(nodeName)) {
		//console.log('________ found _NODE', nodeName, '\nn', n);
		let nSpec = R.getSpec(nodeName);
		if (nundef(n.cond) && nundef(nSpec.cond)) {
			let merged = merge1(nSpec, n, { dataMerge: 'reverse' });
			//console.log('__________ ',nodeName,'\nn',n,'\nnSpec',nSpec,'\nmerged',merged);

			delete merged._NODE;
			if (isdef(nSpec._NODE)) merged._NODE = nSpec._NODE;

			//console.log('*** calling recTree_',merged)
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
	}

	n1 = mergeOverrideArrays(n, n1);
	if (isdef(n1.sub)) delete n1.sub;
	n1.uid = uid;
	n1.uidParent = rParent ? rParent.uid : null;
	if (isdef(oid)) n1.oid = oid;

	if (chanav) n1.chanav = chanav;
	//console.log('\nweitergabe', n1.chanav)

	let chProp = 'sub'; let chlist = n[chProp];
	if (isdef(chlist)) {
		n1.children = [];
		for (const chInfo of chlist) {
			let ch = recTree(chInfo, n1, R, oid, key);
			R.rNodes[ch.uid] = ch;
			n1.children.push(ch.uid);
		}
	}

	//if (oid == '9') console.log('Board: recTree_ returns',jsCopy(n1))
	//if (oid == '0') console.log('Member: recTree_ returns',jsCopy(n1))

	//console.log('am ende!')
	return n1;
}























