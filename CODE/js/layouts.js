//#region layout functions
function wrapLayoutPosition_dep(nBoard, tile, R) {
	let margin = 2;
	let dx = 10;
	let i = 0;
	for (const ch of tile.children) {
		let robber = R.uiNodes[ch];
		console.log(ch);
		let ui = robber.ui;

		// console.log('arranging:', uidMember)
		// console.log('board size', n.size, '\ntile size', tile.size, '\nrobber size', robber.size)

		ui.style.position = 'absolute';
		ui.style.display = 'inline-block';

		let x = i * dx + nBoard.size.w / 2 + tile.pos.x - robber.size.w / 2;// 10;// wTotal/2 + -22;//bdiv.width/2-bmk.width/2;//(bdiv.width/2 + bmk.left + (bmk.width - bel.width) / 2);
		let y = nBoard.size.h / 2 + tile.pos.y - robber.size.h / 2;// 10;// wTotal/2 + -22;//bdiv.width/2-bmk.width/2;//(bdiv.width/2 + bmk.left + (bmk.width - bel.width) / 2);
		i += 1;

		robber.pos = { x: x, y: y };
		console.log('x', x, 'y', y)

		ui.style.left = x + 'px';
		ui.style.top = y + 'px';
		ui.style.margin = '0px';
	}

}
function wrapLayoutPosition(nBoard, tile, R) {
	const arr = [[1], [2], [1, 2], [2, 2], [2, 3], [3, 3], [2, 3, 2], [2, 3, 3], [3, 3, 3], [3, 4, 3], [3, 4, 4], [4, 4, 4]];
	let margin = 2;
	let uids = tile.children;
	let num = uids.length - 1;
	let lay = arr[num];
	if (nundef(lay)) {
		console.log('num', num, 'not in arr!!!');
		lay = [num];
	}
	let rows = lay.length;
	let iNode = 0;
	let size0 = R.uiNodes[uids[0]].size;
	let xOffset = nBoard.size.w / 2 + tile.pos.x - size0.w / 2;
	let yOffset = nBoard.size.h / 2 + tile.pos.y - size0.h / 2;
	let x = 0;
	let y = 0;
	let dx = size0.w+margin;
	let dy = size0.h+margin;

	//console.log('layout rows', lay);
	// assume that all elements have same size!
	for (let r = 0; r < rows; r++) {
		x = 0;
		y = r * dy - (rows*dy-dy)/2;
		let wrow=lay[r]*dx-dx;
		for (let c = 0; c < lay[r]; c++) {

			let robber = R.uiNodes[uids[iNode]];
			let ui = robber.ui;
			ui.style.position = 'absolute';
			ui.style.display = 'inline-block';

			let xPos = x + xOffset - wrow/2;
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
	const arr = [[1], [2], [1, 2], [2, 2], [2, 3], [3, 3], [2, 3, 2], [2, 3, 3], [3, 3, 3], [3, 4, 3], [3, 4, 4], [4, 4, 4]];
	let num = uids.length;
	let lay = arr[num];
	if (nundef(lay)) {
		console.log('num', num, 'not in arr!!!');
		lay = [num];
	}
	let rows = lay.length;
	let iNode = 0;
	let wmax = 0;
	let maxNumPerRow = 0;
	let htot = 0;
	for (let r = 0; r < rows; r++) {
		let hmax = 0;
		let wtot = 0;
		for (let c = 0; c < lay[r]; c++) {

			let n = R.uiNodes[uids[iNode]];
			//console.log('wrap', n.uid, n.size);
			let h = n.size.h;
			let w = n.size.w;
			hmax = 	Math.max(hmax, h);
			wtot += w;
			maxNumPerRow = Math.max(maxNumPerRow, c);

		}
		wmax = Math.max(wmax, wtot);
		htot += hmax;
	}
	let margin = 2;
	let wNeeded = wmax + margin * (maxNumPerRow + 1);
	let hNeeded = htot + margin * (rows + 1);
	//console.log('size needed',wNeeded,hNeeded)
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













