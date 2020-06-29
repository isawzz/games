//#region june05
function arrangeAbsHorizontalFinal(uid, R) {

	let n = R.uiNodes[uid];	//n is the parent

	if (nundef(n.children)) return { w: 0, h: 0 }

	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,yCentered
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;

	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wmin = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wmin += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let children = n.children.map(x => R.uiNodes[x]);
	let hmax = Math.max(...children.map(x => x.size.h));
	let wmax = children.reduce((a, b) => a + (b.size.w || 0), 0);
	wmax += childMargin * (children.length - 1);
	let xoff = 0;
	if (wmin > wmax) xoff = (wmin - wmax) / 2;
	//console.log('hmax',hmax,'wmax',wmax);
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wmin', wmin, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];
	for (const n1 of children) {
		y = y0 + (hmax - n1.size.h) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';
		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
	}
	let wParent = Math.max(wmin + parentPadding * 2, x + parentPadding);

	let hParent = y0 + hmax + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}

function simplestContent() { return makeTableTree(makeSimplestTree); }
function simplestNoContent() { return makeTableTree(makeSimplestTree, false); }
function simple2Content() { return makeTableTree(makeSimpleTree); }
function simple2NoContent() { return makeTableTree(makeSimpleTree, false); }
function arrangeAbs_final(uid, R) {
	let n = R.uiNodes[uid];	//n is the parent

	if (nundef(n.children)) return { w: 0, h: 0 }

	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,yCentered
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;

	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wmin = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wmin += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let children = n.children.map(x => R.uiNodes[x]);
	let hmax = Math.max(...children.map(x => x.size.h));
	let wmax = children.reduce((a, b) => a + (b.size.w || 0), 0);
	wmax += childMargin * (children.length - 1);
	let xoff = 0;
	if (wmin > wmax) xoff = (wmin - wmax) / 2;
	//console.log('hmax',hmax,'wmax',wmax);
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wmin', wmin, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];
	for (const n1 of children) {
		y = y0 + (hmax - n1.size.h) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';
		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
	}
	let wParent = Math.max(wmin + parentPadding * 2, x + parentPadding);

	let hParent = y0 + hmax + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}
function arrangeAbs_0(uid, R) {
	//das macht mehr oder weniger was adjustLayout gemacht hat!!!
	//console.log('arrangeAbs', uid)
	let n = R.uiNodes[uid];

	if (nundef(n.children)) return { w: 0, h: 0 }

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		//console.log('first child of parent is', cont);
		let b = getBounds(cont, true);
		//console.log('size of first child is', b.width, b.height);
		//console.log('bounds', b)
		wmin = b.width + 2 * GAP;
		y0 = GAP + b.top + b.height + GAP;
	} else y0 = GAP;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let x0 = GAP;
	let x = x0;
	let y = y0;
	let hmax = 0;
	for (const uid of n.children) {
		let n1 = R.uiNodes[uid];
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';

		x += n1.size.w + GAP;
		//y bleibt gleich!
		if (n1.size.h > hmax) hmax = n1.size.h
	}
	let wParent = Math.max(wmin, x) + 2 * PADDING;
	let hParent = y0 + hmax + 2 * GAP + PADDING;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}
function arrangeAbs_1(uid, R) {
	//das macht mehr oder weniger was adjustLayout gemacht hat!!!
	//console.log('arrangeAbs', uid)
	let n = R.uiNodes[uid];
	//n is the parent
	//let parentMargin = isdef(n.margin)?n.margin:PARENT_MARGIN;
	let parentPadding = PADDING;// 
	//parentPadding = isdef(n.params.padding)?n.params.padding:PADDING;
	let childMargin = GAP;//CHILD_MARGIN;


	if (nundef(n.children)) return { w: 0, h: 0 }

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,yCentered
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;
	console.log('wmin', wmin)

	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		//console.log('first child of parent is', cont);
		let b = getBounds(cont, true);
		//console.log('size of first child is', b.width, b.height);
		//console.log('bounds', b)
		wmin = b.width + 2 * parentPadding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let x0 = parentPadding;
	let x = x0;
	let y = y0;
	let children = n.children.map(x => R.uiNodes[x]);
	let hmax = Math.max(...children.map(x => x.size.h));
	//console.log('hmax is',children,hmax);
	//let hmax = 0;
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];
	for (const n1 of children) {
		//let n1 = R.uiNodes[uid];

		//if (n1.params.margin) childMargin = n1.params.margin;
		//console.log('childMargin',childMargin);

		y = y0 + (hmax - n1.size.h) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';

		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
		//y bleibt gleich!
		//if (n1.size.h > hmax) hmax = n1.size.h
	}
	let wParent = Math.max(wmin, x) + parentPadding;
	let hParent = y0 + hmax + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}

//#region june01
function transformParentsToBags(parents, R) {
	let parentPanels = [];
	for (const p of parents) {
		let nParent = R.uiNodes[p];
		let uidNewParent = p;
		// if parent has no child at all, make invisible container and use that for loc node
		if (isEmpty(nParent.children)) {
			console.log('parent', p, 'does NOT have any child!');

			//create an invisible node 
			let nPanel = addInvisiblePanel(p, R);
			uidNewParent = nPanel.uid;
			//also need to create uiNode for this panel!

			console.log(nParent);
			//parentPanels.push(nPanel.uid);
		}

		parentPanels.push(uidNewParent);
		//if this parent already has a child that is a container,
		//dann kann ich diesen container als echten parent nehmen

		//sonst mache einen container

		//was wenn parent genau 1 child hat aber das ist NICHT ein container?
		//dann mache ein weiteres child das ein container ist


	}
	console.log('parentPanels', parentPanels)
	return parentPanels;

}
function addInvisiblePanel(uidParent, R) {
	let uid = getUID();
	let n = { uid: uid, uidParent: uidParent, type: 'invisible' };
	R.rNodes[uid] = n;
	let rParent = R.rNodes[uidParent];
	if (nundef(rParent.children)) rParent.children = [];
	rParent.children.push(uid);
	recUi(n, uidParent, R);
	return n;
}

















