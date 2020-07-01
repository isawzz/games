const LAYOUT = {};
const GAP = 2;
const PADDING = 2;
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
	
	return sizeToContent(uid);

}

function sizeToContent(uid) {

	//console.log('sizeToContent');
	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	let or = n.params.orientation;

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

	let children = n.children.map(x => R.uiNodes[x]);

	let axMain, ax2;
	if (or == 'v') { axMain = 'h'; ax2 = 'w'; } else { axMain = 'w'; ax2 = 'h'; }

	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	let wmax = (or == 'v' ? ax2Max : axMainSum);//!!!
	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	//console.log('wmin', wTitle, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
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
			x += n1.size.w;
			if (n1 != lastChild) x += childMargin;
		}

		n1.ui.style.left = n1.pos.x + 'px';
		n1.ui.style.top = n1.pos.y + 'px';

	}

	let wParent,hParent;
	if (or == 'h') {
		 wParent = Math.max(wTitle + parentPadding * 2, x + parentPadding);
		 hParent = y0 + ax2Max + parentPadding;
		//console.log('parent size should be', wParent, hParent);
		
	} else {
		 wParent = Math.max(wTitle + parentPadding * 2, ax2Max + 2 * x0);
		 hParent = y + parentPadding;
		
	}
	return { w: wParent, h: hParent };
}











