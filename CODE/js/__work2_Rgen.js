









function dPP1(o, plist, R) {
	//plist is a list of properties
	//pool is a dictionary that contains all objects that might be involved

	//console.log('dPP', o, plist)

	if (isEmpty(plist)) {
		let res = isdef(o._player)?[o._player]:isdef(o._obj)?[o._obj]: o;
		//console.log('empty plist: o',o, '\nreturning',res)
		return res;
	}
	if (isList(o) && isNumber(plist[0])) {
		let i = Number(plist[0]);
		return dPP1(o[i], plist.slice(1), R);
	}
	if (!isDict(o)) {
		let o1 = R.getO(o);
		if (isdef(o1)) return dPP1(o1, plist, R);
		console.log('dPP1 ERROR!!! o', o, 'plist', plist, '\no1', o1);
		return null;
	}

	let k1 = plist[0];
	let o1 = isdef(o._player) ? R.getO(o._player)[k1]
		: isdef(o._obj) ? R.getO(o._obj)[k1]
			: o[k1];
	//console.log('o',o,'o1',o1)
	if (nundef(o1)) return null; //o does NOT have this prop!
	let plist1 = plist.slice(1);
	if (o1._set) {
		o1 = o1._set;
		//console.log('was soll hier returned werden?', 'o1', o1, 'plist1', plist1)
		if (plist1.length > 0 && !isNumber(plist1[0])) {
			//console.log('WAS!!!!!!!')
			return o1.map(x => dPP1(x, plist1, R));
		}
	}
	//if (o1._player) { o1 = R.getO(o1._player); }
	//else if (o1._obj) { o1 = R.getO(o1._obj); }
	//console.log('calling dPP1', o1, plist1)
	return dPP1(o1, plist1, R);
}

function dPP(o, plist, R) {
	//plist is a list of properties
	//pool is a dictionary that contains all objects that might be involved

	//console.log('dPP',o,plist)

	if (isEmpty(plist)) return o;
	if (isList(o) && isNumber(plist[0])) {
		let i = Number(plist[0]);
		return dPP(o[i], plist.slice(1), R);
	}
	if (!isDict(o)) {
		let o1 = R.getO(o);
		if (isdef(o1)) return dPP(o1, plist, R);
		console.log('dPP ERROR!!! o', o, 'plist', plist, '\no1', o1);
		return null;
	}

	let k1 = plist[0];
	let o1 = o[k1];
	if (nundef(o1)) return null; //o does NOT have this prop!
	let plist1 = plist.slice(1);
	if (o1._set) {
		o1 = o1._set;
		if (plist1.length > 0 && isNumber(plist1[0])) {
			let i = Number(plist1[0]);
			return dPP(o1[i], plist1.slice(1), R);
		} else {
			return o1.map(x => dPP(x, plist1, R));
		}
	}
	if (o1._player) { o1 = R.getO(o1._player); }
	else if (o1._obj) { o1 = R.getO(o1._obj); }
	return dPP(o1, plist1, R);
}





















