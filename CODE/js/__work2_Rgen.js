function sizeToContent(uid, r) {

	console.log('sizeToContent');
	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	//params that influence this layout
	let or = n.params.orientation;
	// let centered = true;// n.params.baseline == 'center';// n.params.sizing == 'sizeToContent';

	console.log('or', uid, 'is', or);

	//berechne wTitle und y0
	let y0 = 0;
	let wTitle = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wTitle = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wTitle += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;

	console.log('wTitle', wTitle, 'y0', y0);
	//have wTitle and y0 right unter title!
	let children = n.children.map(x => R.uiNodes[x]);

	let axMain, ax2;
	if (or == 'v') {
		axMain = 'h';
		ax2 = 'w';
	} else {
		axMain = 'w';
		ax2 = 'h';

	}
	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	let wmax = (or == 'v' ? ax2Max : axMainSum);//!!!
	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('x', x, 'y', y)
	console.log('wTitle', wTitle, 'maxChildWidth', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];

	for (const n1 of children) {
		if (or == 'v') {
			x = x0 + (ax2Max - n1.size[ax2]) / 2;
			//x = x0 + centered? (ax2Max - n1.size[ax2]) / 2:0;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			
			y += n1.size[axMain];
			if (n1 != lastChild) y += childMargin;
		} else {
			y = y0 + (ax2Max - n1.size[ax2]) / 2;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			// let ui = n1.ui;
			// ui.style.left = n1.pos.x + 'px';
			// ui.style.top = n1.pos.y + 'px';
			x += n1.size.w;
			if (n1 != lastChild) x += childMargin;

			// y = y0 + (ax2Max - n1.size[ax2]) / 2;
			// y = y0 + centered?(ax2Max - n1.size[ax2]) / 2:0;
			// n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			// x += n1.size.w;
			// if (n1 != lastChild) x += childMargin;
		}

		n1.ui.style.left = n1.pos.x + 'px';
		n1.ui.style.top = n1.pos.y + 'px';

	}
	console.log('wTitle', wTitle, 'x', x, 'y', y)

	let wParent, hParent;
	if (or == 'v') {
		wParent = Math.max(wTitle + parentPadding * 2, ax2Max + 2 * x0);
		hParent = y + parentPadding;
	} else {
		wParent = Math.max(wTitle + parentPadding * 2, x + parentPadding);
		hParent = y0 + ax2Max + parentPadding;
	}
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };

}










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





















