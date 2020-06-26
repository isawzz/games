//#region layout functions
function calcTotalDims(n, uids, R) {
	let hMax = 0;
	let margin = isdef(n.params.margin) ? n.params.margin : 0;
	let wTotal = margin;
	for (const ch of uids) {
		let n1 = R.uiNodes[ch];
		let w = n1.size.w;
		let h = n1.size.h;
		hMax = Math.max(hMax, h);
		wTotal += w + margin;

	}
	return {w:wTotal,h:hMax+2*margin,margin:margin};
}

function infoLayout(n,R){

}

function horLayout(n, R) {
	console.log('n', n, n.ui);
	let uids = n.children;

	let dims = calcTotalDims(n, uids, R);
	let margin = dims.margin;
	console.log('dims',dims);
	let x = margin;
	let y = margin;
	let uiParent = n.ui;
	uiParent.style.position = 'relative';
	uiParent.style.boxSizing = 'border-box';
	console.log(uiParent);
	for (const ch of uids) {
		let n = R.uiNodes[ch];
		let w = n.size.w;
		let h = n.size.h;
		n.pos = { x: x, y: y };
		let ui = n.ui;
		ui.style.position = 'absolute';
		ui.style.display = 'inline-block';
		ui.style.boxSizing = 'border-box';
		ui.style.left = x + 'px';
		ui.style.top = y + 'px';
		ui.style.margin = 'auto';
		x += w + 2;
	}
	uiParent.style.width = dims.w + 'px';
	uiParent.style.minHeight = dims.h+'px';

}

//#region wrap layout
function wrapLayoutColarr(num) {
	const arr = [[0], [1], [2], [1, 2], [2, 2], [2, 3], [3, 3], [2, 3, 2], [2, 3, 3], [3, 3, 3], [3, 4, 3], [3, 4, 4], [4, 4, 4]];
	return num < arr.length ? arr[num] : [num];
}
function wrapLayoutPosition(nBoard, tile, R) {
	let margin = 2;
	let uids = tile.children;
	let colarr = wrapLayoutColarr(uids.length);
	//console.log('num',num,'lay',lay,uids)
	let rows = colarr.length;
	let iNode = 0;
	let nChild = R.uiNodes[uids[0]];
	let size0 = R.uiNodes[uids[0]].size;
	let wChild = getBounds(nChild.ui).width;

	let xOffset = nBoard.size.w / 2 + tile.pos.x - size0.w / 2;
	let yOffset = nBoard.size.h / 2 + tile.pos.y - size0.h / 2;
	let x = 0;
	let y = 0;
	let dx = size0.w + margin;
	let dy = size0.h + margin;

	// console.log(tile,uids,'layout rows', colarr,'rows',rows);
	// console.log('child size',size0);
	// console.log('tile: size',tile.size,'pos',tile.pos)
	// console.log('nBoard.params.sizes',nBoard.params.sizes)
	// console.log('R.uiNodes[uids[0]]',R.uiNodes[uids[0]])
	// console.log('wChild (getBounds)',wChild,'ui',nChild.ui)

	// assume that all elements have same size!
	for (let r = 0; r < rows; r++) {
		x = 0;
		y = r * dy - (rows * dy - dy) / 2;
		let wrow = colarr[r] * dx - dx;
		for (let c = 0; c < colarr[r]; c++) {

			let robber = R.uiNodes[uids[iNode]];
			let ui = robber.ui;
			ui.style.position = 'absolute';
			ui.style.display = 'inline-block';
			ui.style.boxSizing = 'border-box'

			let xPos = x + xOffset - wrow / 2;
			let yPos = y + yOffset;
			robber.pos = { x: xPos, y: yPos };
			ui.style.left = xPos + 'px';
			ui.style.top = yPos + 'px';
			ui.style.margin = '0px';
			//console.log('wrap', robber.uid, 'x', xPos, 'y', yPos);

			x += dx;
			iNode += 1;

		}
	}
}
function wrapLayoutSizeNeeded(uids, R) {
	const arr = [[0], [1], [2], [1, 2], [2, 2], [2, 3], [3, 3], [2, 3, 2], [2, 3, 3], [3, 3, 3], [3, 4, 3], [3, 4, 4], [4, 4, 4]];
	let colarr = wrapLayoutColarr(uids.length);
	let rows = colarr.length;
	let iNode = 0;
	let wmax = 0;
	let maxNumPerRow = 0;
	let htot = 0;
	for (let r = 0; r < rows; r++) {
		let hmax = 0;
		let wtot = 0;
		for (let c = 0; c < colarr[r]; c++) {

			let n = R.uiNodes[uids[iNode]];
			//console.log('wrap', n.uid, n.size);
			let h = n.size.h;
			let w = n.size.w;
			hmax = Math.max(hmax, h);
			wtot += w;
			maxNumPerRow = Math.max(maxNumPerRow, c);

		}
		wmax = Math.max(wmax, wtot);
		htot += hmax;
	}
	let margin = 2;
	let wNeeded = wmax + margin * (maxNumPerRow + 1);
	let hNeeded = htot + margin * (rows + 1);
	//console.log('num',uids.length,'ley',colarr,'size needed',wNeeded,hNeeded)
	return { w: wNeeded, h: hNeeded };
	//let cols = 

}

function simpleLayoutForOneChildSizeNeeded(ch, R) {
	let nChild = R.uiNodes[ch];

	//since this is a board member, layout is 1/1
	let wNeeded = nChild.size.w + 12; //just testing: give child more space for margin
	let hNeeded = nChild.size.h + 12;
	return { w: wNeeded, h: hNeeded };
}
function simpleLayoutForOneChildPosition(nBoard, tile, R) {
	let ch = tile.children[0];
	let robber = R.uiNodes[ch];
	let ui = robber.ui;

	// console.log('arranging:', uidMember)
	// console.log('board size', n.size, '\ntile size', tile.size, '\nrobber size', robber.size)

	ui.style.position = 'absolute';
	ui.style.display = 'inline-block';

	let x = nBoard.size.w / 2 + tile.pos.x - robber.size.w / 2;// 10;// wTotal/2 + -22;//bdiv.width/2-bmk.width/2;//(bdiv.width/2 + bmk.left + (bmk.width - bel.width) / 2);
	let y = nBoard.size.h / 2 + tile.pos.y - robber.size.h / 2;// 10;// wTotal/2 + -22;//bdiv.width/2-bmk.width/2;//(bdiv.width/2 + bmk.left + (bmk.width - bel.width) / 2);

	ui.style.left = x + 'px';
	ui.style.top = y + 'px';

	robber.pos = { x: x, y: y };

	ui.style.margin = '0px';

}

function panelLayout(n, R) {
	let params = n.params;
	let num = n.children.length;

	let or = params.orientation ? params.orientation : DEF_ORIENTATION;
	mFlex(n.ui, or);

	//console.log(params, num, or);

	//setting split
	let split = params.split ? params.split : DEF_SPLIT;
	if (split == 'min') return;

	let reverseSplit = false;

	if (split == 'equal') split = (1 / num);
	else if (isNumber(split)) reverseSplit = true;

	for (let i = 0; i < num; i++) {
		let d = R.uiNodes[n.children[i]].ui;
		mFlexChildSplit(d, split);

		if (reverseSplit) { split = 1 - split; }
	}

}












