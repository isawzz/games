const LAYOUT = {};
const GAP = 2;
const PADDING = 2;

//#region random pos and size
var posArray; var posArrayRows; var posArrayCols;
function initPosArray(n, m) {
	posArray = []; posArrayRows = n; posArrayCols = m;
	for (let r = 0; r < n * m; r++) { posArray[r] = true; }
}
function randomPos(w, h, granularity = 20) {
	if (nundef(posArray)) return { x: randomNumber(2, w - 2), y: randomNumber(2, h - 2) };
	else {
		let len = posArray.length;
		let i = randomNumber(0, len - 1);
		while (!posArray[i]) i = (i + 1) % len;
		posArray[i] = false;
		return { y: Math.floor(i / posArrayRows) * granularity, x: i % posArrayCols * granularity };
		// let rows = posArray.length;
		// let cols = posArray[0].length;
		// let r = randomNumber(0, rows - 1);
		// let c = randomNumber(0, cols - 1);
		// while (!posArray[r][c]) { }
	}
}
function recPosRandomUiTree(uid, R, wmax = 4, hmax = 2, gran = 10) {
	let n = R.uiNodes[uid];
	n.params.size = { w: randomNumber(1, wmax) * gran, h: randomNumber(1, hmax) * gran };
	n.params.pos = randomPos(wmax, hmax, gran);
	n.params.sizing = 'fixed';
	//console.log('pos and size set:', uid, n)
	if (nundef(n.children)) return;
	for (const ch of n.children) { recPosRandomUiTree(ch, R); }
}
function recPosQuadUiTree(uid, R, wmax = 4, hmax = 2, gran = 10) {
	let n = R.uiNodes[uid];
	n.params.size = { w: randomNumber(1, wmax) * gran, h: randomNumber(1, hmax) * gran };
	n.params.pos = randomPos(wmax, hmax, gran);
	n.params.sizing = 'fixed';
	//console.log('pos and size set:', uid, n)
	if (nundef(n.children)) return;
	for (const ch of n.children) { recPosQuadUiTree(ch, R); }

	let num = n.children.length;
	if ([4,6,8,9,12,16,20].includes(num)) arrangeChildrenAsQuad(n,R);
	else if (num>1 && num <10) arrangeChildrenAsCircle(n,R);
}
function arrangeChildrenAsCircle(n,R){

}
function arrangeChildrenAsQuad(n,R){
	let children = n.children.map(x=>R.uiNodes[x]);
	
	let num = children.length;
	let rows=Math.ceil(Math.sqrt(num));
	let cols = Math.floor(Math.sqrt(num));
	let size = 20;
	let padding=4;
	let i=0;

	//calc max size of children first! set size accordingly!
	for(const n1 of children){
		let b=getBounds(n1.ui);
		size = Math.max(Math.max(b.width,b.height),size);
	}

	for(let r=0;r<rows;r++){
		for(let c=0;c<cols;c++){
			let n1=children[i]; i+=1;
			n1.params.size = { w: size-1,h:size-1};
			n1.params.pos = {x:padding+r*size,y:padding+c*size};
			n1.params.sizing = 'fixed';
		
		}
	}

}
//#endregion

function setFixedSizeAndPos(n) {
	let ui = n.ui;
	if (nundef(n.params.size)) return;
	//console.log(n.params.pos, n.params.size);
	n.size = jsCopy(n.params.size);
	n.pos = jsCopy(n.params.pos);
	n.pos.cx = n.pos.x + n.size.w / 2;
	n.pos.cy = n.pos.y + n.size.h / 2;
	ui.style.position = 'absolute';
	ui.style.left = n.pos.x + 'px';
	ui.style.top = n.pos.y + 'px';
	ui.style.minWidth = n.size.w + 'px';
	ui.style.minHeight = n.size.h + 'px';
	// ui.style.left = '0px';
	// ui.style.width = '100px';
	// ui.style.top = '0px';
	// ui.style.height = '50px';
	//console.log('size',n.size,'pos',n.pos);
}

function recMeasureArrangeFixedSizeAndPos(uid, R) {
	//console.log('measureAbs', uid);
	let n = R.uiNodes[uid];

	let [minx, maxx, miny, maxy] = [100000, 0, 100000, 0];
	if (isdef(n.children)) {

		for (const ch of n.children) {
			let [xmin, xmax, ymin, ymax] = recMeasureArrangeFixedSizeAndPos(ch, R);
			// if (xmax>maxx){
			// 	maxx=xmax
			// }
			minx = Math.min(minx, xmin);
			maxx = Math.max(maxx, xmax);
			miny = Math.min(miny, ymin);
			maxy = Math.max(maxy, ymax);
		}
		//set size and pos, there is no arrange actually!
		if (nundef(n.params.pos)) {
			console.log('parent has no position set!!!', uid)
			return [minx, maxx, miny, maxy];
		}

		//muss den parent vielleicht groesser machen!!
		console.log('__________ ', uid)
		console.log('children need', 'x', minx, maxx, 'y', miny, maxy);
		console.log('parent size', n.params.size, 'pos', n.params.pos)
		let wParent = Math.max(n.params.size.w, maxx);
		let hParent = Math.max(n.params.size.h, maxy);
		n.params.size.w = wParent+4;
		n.params.size.h = hParent+4;
		setFixedSizeAndPos(n);
		n.ui.style.opacity=.5;

		minx = Math.min(minx, n.pos.x);
		maxx = Math.max(maxx, n.pos.x + n.size.w);
		miny = Math.min(miny, n.pos.y);
		maxy = Math.max(maxy, n.pos.y + n.size.h);
		return [minx, maxx, miny, maxy];

	} else {
		//console.log('===>LEAF');
		//LEAF what shoul this return???
		//supposedly it does have n.pos and n.size set
		//it should return 
		setFixedSizeAndPos(n);
		let b = getBounds(n.ui);
		//console.log(b, n.size);
		return [n.pos.x, n.pos.x + b.width, n.pos.y, n.pos.y + b.height];

	}





}
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
	n.sizeNeeded = sizeToContent(uid, R);
	//console.log('node', uid, 'measured', n.sizeMeasured, 'needed:', n.sizeNeeded);


	n.size = {
		w: Math.max(n.sizeMeasured.w, n.sizeNeeded.w),
		h: Math.max(n.sizeMeasured.h, n.sizeNeeded.h)
	}
	n.ui.style.width = n.size.w + 'px';
	n.ui.style.height = n.size.h + 'px';
	//console.log('final size', n.uid, n.size);
}
function sizeToContent(uid) {

	console.log('sizeToContent_', uid);
	let n = R.uiNodes[uid];	//n is the parent
	//if (isdef(n.params.left)) return fixedSizePos(uid);

	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	let or = n.params.orientation;
	let bl = n.params.baseline;
	//console.log('or', or, 'baseline', bl)

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
			switch (bl) {
				case 'start': x = x0; break;
				case 'end': x = x0 + ax2Max - n1.size[ax2]; break;
				case 'centered': x = x0 + (ax2Max - n1.size[ax2]) / 2; break;
				case 'stretch':
					x = x0;
					if (n1.size.w < ax2Max) {
						//console.log('adjust',n1.uid);
						n1.size.w = ax2Max;
						n1.ui.style.minWidth = n1.size.w + 'px';

					}
					break;
				default: x = x0 + (ax2Max - n1.size[ax2]) / 2; break;
			}

			//x = x0 + (ax2Max - n1.size[ax2]) / 2;
			//x = x0 + centered? (ax2Max - n1.size[ax2]) / 2:0;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };

			y += n1.size[axMain];
			if (n1 != lastChild) y += childMargin;
		} else { //or is HORIZONTAL!!!!!!!! or=='h'!!!!!!!!!!!!!!!!!! y abhaengig von baseline!!!!!!!!!!

			switch (bl) {
				case 'start': y = y0; break;
				case 'end': y = y0 + ax2Max - n1.size[ax2]; break;
				case 'centered': y = y0 + (ax2Max - n1.size[ax2]) / 2; break;
				case 'stretch':
					y = y0;
					if (n1.size.h < ax2Max) {
						//console.log('adjust',n1.uid);
						n1.size.h = ax2Max;
						n1.ui.style.minHeight = n1.size.h + 'px';

					}
					break;
				default: y = y0 + (ax2Max - n1.size[ax2]) / 2; break;
			}
			// y = y0 + (ax2Max - n1.size[ax2]) / 2;

			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			x += n1.size.w;
			if (n1 != lastChild) x += childMargin;
		}

		n1.ui.style.left = n1.pos.x + 'px';
		n1.ui.style.top = n1.pos.y + 'px';

	}

	let wParent, hParent;
	if (or == 'h') {
		wParent = Math.max(wTitle + parentPadding * 2, x + parentPadding);
		hParent = y0 + ax2Max + parentPadding;
		//console.log('parent size should be', wParent, hParent);

	} else {
		wParent = Math.max(wTitle + parentPadding * 2, ax2Max + 2 * x0);
		//hParent = y + parentPadding;
		hParent = y0 + axMainSum + parentPadding;

	}
	return { w: wParent, h: hParent };
}

function fixedSizePos(uid) {

	console.log('fixedSizePos_', uid);
	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.params.left)) return sizeToContent(uid);

	//assuming all nodes have set position
	if (isdef(n.params.left)) {
		console.log('style of', n.uid, n.ui.style);

		n.size = { w: n.params.width, h: n.params.height };
		n.pos = { x: n.params.left, y: n.params.top, cx: n.params.left + n.size.w / 2, cy: n.params.top + n.size.h / 2 };
		n.ui.style.position = 'absolute';
		n.ui.style.left = 20 + 'px';
		n.ui.style.top = 20 + 'px';
		n.ui.style.width = n.params.width + 'px';
		n.ui.style.backgroundColor = 'red'
		n.ui.style.height = n.params.height + 'px';

	}

	if (nundef(n.children)) return { w: 0, h: 0 }
	let children = n.children.map(x => R.uiNodes[x]);

	let minx, miny, maxx, maxy;
	for (const n1 of children) {
		if (nundef(n1.pos)) continue;
		minx = Math.min(minx, n1.pos.x);
		maxx = Math.max(maxx, n1.pos.x + n1.size.w);
		miny = Math.min(miny, n1.pos.y);
		maxy = Math.max(maxy, n1.pos.y + n1.size.h);
		fixedSizePos(uid);
	}

	return { w: maxx - minx, h: maxy - miny };
}











