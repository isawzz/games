function verticalSizeToContentCentered(uid, r) {
	let n = R.uiNodes[uid];	//n is the parent

	if (nundef(n.children)) return { w: 0, h: 0 }

	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	let xStart = 0;

	//berechne wTitle wie vorher! auch y0 ist unter title! sowie vorher!!!
	let wTitle = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wTitle = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wTitle += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;

	//have wTitle and y0 right unter title!

	let children = n.children.map(x => R.uiNodes[x]);

	let maxChildWidth = Math.max(...children.map(x => x.size.w));

	let sumChildrenHeight = children.reduce((a, b) => a + (b.size.h || 0), 0);
	sumChildrenHeight += childMargin * (children.length - 1);

	//***********HERE */
	//immer noch xoffset berechnen, nur statt sumChidrenWidth hab jetzt maxChildWidth

	let xoff = 0;
	if (wTitle > maxChildWidth) xoff = (wTitle - maxChildWidth) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wTitle', wTitle, 'maxChildWidth', maxChildWidth, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];
	for (const n1 of children) {
		x = x0 + (maxChildWidth - n1.size.w) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';
		y += n1.size.h;
		if (n1 != lastChild) y += childMargin;
	}
	let wParent = Math.max(wTitle + parentPadding * 2, maxChildWidth+2*x0);

	let hParent = y +parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };

}







