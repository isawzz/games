/*
Function: recArrangeContent
starting from uid and top down, arranges content according to params.contentwalign and contenthalign

*/
function recArrangeContent(uid, R) {

	//console.log('............')
	let n = R.uiNodes[uid];	//n is the parent

	if (nundef(n.children)) return;

	let parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : DEFS.defaultPadding;
	let childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : DEFS.defaultGap;
	let posModified = false;
	let sizeModified = false;
	let children = n.children.map(x => R.uiNodes[x]);

	if (isdef(n.children) && isdef(n.params.contentwalign) && n.params.contentwalign == 'center') {
		//calc total with of content
		//console.log('...................................>>')
		let children = n.children.map(x => R.uiNodes[x]);
		let xchimin = Math.min(...children.map(x => x.pos.x));
		let xchimax = Math.max(...children.map(x => x.pos.x + x.size.w));
		let diff = xchimax - xchimin;
		let wpar = n.size.w - 2 * parentPadding;
		//console.log('wpar', wpar, 'diff', diff, 'should align?', wpar > diff + 2 ? 'yes' : 'no');
		//align each child by (wpar-diff)/2
		let displ = (wpar - diff) / 2;
		if (displ >= 1) {
			posModified = true;
			for (const ch of children) { ch.params.pos = { x: ch.pos.x + displ, y: ch.pos.y }; }
		}
	}
	if (isdef(n.children) && isdef(n.params.contenthalign) && n.params.contenthalign == 'center') {
		//calc total with of content
		//console.log('...................................>>')
		let ychimin = Math.min(...children.map(ch => ch.pos.y));
		let ychimax = Math.max(...children.map(ch => ch.pos.y + ch.size.h));
		let diff = ychimax - ychimin;
		let hpar = n.size.h - 2 * parentPadding;
		//console.log('hpar', hpar, 'diff', diff, 'should align?', hpar > diff + 2 ? 'yes' : 'no');
		//align each child by (wpar-diff)/2
		let displ = (hpar - diff) / 2;
		if (displ >= 1) {
			posModified = true;
			for (const ch of children) { ch.params.pos = { x: ch.pos.x, y: ch.pos.y + displ }; }
		}
	}

	if (posModified || sizeModified) { for (const ch of children) { setFixedSizeAndPos(ch); } } 
	else return;


	for (const ch of n.children) recArrangeContent(ch, R);

}









function dPP1(o, plist, R) {
	//plist is a list of properties
	//pool is a dictionary that contains all objects that might be involved

	//console.log('dPP', o, plist)

	if (isEmpty(plist)) {
		let res = isdef(o._player) ? [o._player] : isdef(o._obj) ? [o._obj] : o;
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





















