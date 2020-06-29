const LAYOUT = {};
const GAP=2;
const PADDING=2;
function recMeasureAbs(uid, R) {
	//console.log('measureAbs', uid);
	let n = R.uiNodes[uid];

	if (isdef(n.children)) {
		for (const ch of n.children) {
			recMeasureAbs(ch, R);
		}
	}

	n.sizeMeasured = calcSizeMeasured(uid, R); //das ist mit getBounds, also ist size
	//console.log('measured:',n.sizeMeasured)
	n.sizeNeeded = arrangeAbs(uid, R);
	//console.log('node', uid, 'measured', n.sizeMeasured, 'needed:', n.sizeNeeded);


	n.size = {
		w: Math.max(n.sizeMeasured.w, n.sizeNeeded.w),
		h: Math.max(n.sizeMeasured.h, n.sizeNeeded.h)
	}
	n.ui.style.width = n.size.w + 'px';
	n.ui.style.height = n.size.h + 'px';
	//console.log('final size', n.uid, n.size);
}

function arrangeAbs(uid, R) {
	let n = R.uiNodes[uid];	//n is the parent

	if (nundef(n.children)) return { w: 0, h: 0 }

	let parentPadding = PADDING;
	parentPadding = isdef(n.params.paddingAroundChildren)?n.params.paddingAroundChildren:PADDING;
	let childMargin = GAP;
	childMargin = isdef(n.params.gapBetweenChildren)?n.params.gapBetweenChildren:GAP;

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,yCentered
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;
	console.log('wmin',wmin)

	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		//console.log('first child of parent is', cont);
		let b = getBounds(cont, true);
		//console.log('size of first child is', b.width, b.height);
		//console.log('bounds', b)
		wmin = b.width + 2 * parentPadding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	}else y0=parentPadding;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let x0 = parentPadding;
	let x = x0;
	let y = y0;
	let children = n.children.map(x=>R.uiNodes[x]);
	let hmax = Math.max(...children.map(x=>x.size.h));
	//console.log('hmax is',children,hmax);
	//let hmax = 0;
	let lastChild = R.uiNodes[n.children[n.children.length-1]];
	for (const n1 of children) {
		y=y0+(hmax-n1.size.h)/2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';
		x += n1.size.w;
		if (n1!=lastChild) x += childMargin;
	}
	let wParent = Math.max(wmin, x) + parentPadding;
	let hParent = y0 + hmax + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}
function recPositionsAbs(uid, R) {
	let n = R.uiNodes[uid];
	if (!n.uidParent) {
		n.pos = { left: 0, top: 0 };
		n.apos = jsCopy(n.pos);
		n.rpos = jsCopy(n.pos);
	} else {
		nParent = R.uiNodes[n.uidParent];
		n.apos = {
			left: nParent.apos.left + n.rpos.left,
			top: nParent.apos.top + n.rpos.top
		};
		n.pos = jsCopy(n.apos);
	}
	n.rcenter = {
		x: n.rpos.left + n.size.w / 2,
		y: n.rpos.top + n.size.h / 2
	};
	n.acenter = {
		x: n.apos.left + n.size.w / 2,
		y: n.apos.top + n.size.h / 2
	};
	if (nundef(n.children)) {
		//console.log('no children', n.uid)
		return;
	}
	for (const uidChild of n.children) {
		recPositionsAbs(uidChild, R);
	}
}


function absLayout(n, R) {
	//arrange children of n and return size needed
	//is n resized here??? NO
	let b = getBounds(n.ui);

	let maxBottom = 0;
	let maxRight = 0;
	for (const uid of n.children) {
		let n1 = R.uiNodes[uid];
		let b1 = getBounds(n1.ui);
		//console.log(b1)
		n1.rpos = { left: b1.left - b.left, top: b1.top - b.top };
		n1.apos = { left: b1.left, top: b1.top };
		let m = n1.cssParams.margin; if (nundef(m)) m = 0;
		let bottom = b1.bottom + m - b.top;
		let right = b1.right + m - b.left;
		if (bottom > maxBottom) maxBottom = bottom;
		if (right > maxRight) maxRight = right;
		//console.log('BR', bottom, right);
	}
	return { w: maxRight, h: maxBottom };
}












