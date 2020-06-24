function recMeasureOverride(uid, R) {
	//console.log('measure', uid);
	let n = R.uiNodes[uid];

	if (isdef(n.children)) {
		for (const ch of n.children) {
			recMeasureOverride(ch, R);
		}
	}
	n.sizeMeasured = calcSizeMeasured(uid, R);
	//console.log('measured:',n.sizeMeasured)
	n.sizeNeeded = arrangeOverride(uid, R);

	n.size = {
		w: Math.max(n.sizeMeasured.w, n.sizeNeeded.w), 
		h: Math.max(n.sizeMeasured.h, n.sizeNeeded.h) 
	};
	//console.log('final size',n.size);
}
function calcSizeMeasured(uid, R) {
	let n = R.uiNodes[uid];
	if (isdef(n.info)) { //board member
		return { w: n.info.size, h: n.info.size };

	} else if (n.type == 'grid') {
		calcBoardDimensions(n, R);
		return { w: n.wTotal, h: n.hTotal };

	} else {
		let b = getBounds(n.ui);
		return { w: b.width, h: b.height };
	}
}

function addResizeInfo(nBoard, nMember, sizeNeeded) {
	//console.log('addrrrrrrrrrrrrrrrrr')
	let szNeeded = Math.max(sizeNeeded.w, sizeNeeded.h);
	if (nMember.info.size < szNeeded) {
		console.log('szNeeded')
		let memType = nMember.info.memType;
		let newSize = Math.max(sizeNeeded.w, sizeNeeded.h);
		newSize = Math.ceil(newSize / 4);
		newSize *= 4;
		if (newSize % 4 != 0) newSize += 4;
		let key = memType + 's';

		//instead of edge resize do field resize
		if (memType == 'edge'){
			newSize *= 2;
			memType = 'field';
			key = 'fields';
		}
		if (nundef(nBoard.resizeInfo)) nBoard.resizeInfo = {};
		if (nundef(nBoard.resizeInfo[key]) || nBoard.resizeInfo[key] < newSize) {
			//console.log('updating resizeInfo')
			nBoard.resizeInfo[key] = newSize;
			nMember.sizeNeeded = { w: newSize, h: newSize }

			//if node resize, in addition to node resize
			if (key == 'corners'){
				//how to find field size?
				let fSize = isdef(nBoard.resizeInfo.fields);
				if (nundef(fSize)){

					let f0 = R.uiNodes[nBoard.children[0]];
					fSize = f0.info.size;
				}
				if (fSize < newSize * 3){
					nBoard.resizeInfo.fields = newSize * 3;
				}
			}
		}
		nBoard.adirty = nMember.adirty = true;
	}
}

function arrangeOverride(uid, R) {
	//das macht mehr oder weniger was adjustLayout gemacht hat!!!
	//console.log('arrange', uid)
	let n = R.uiNodes[uid];

	if (nundef(n.children)) return { w: 0, h: 0 }

	// let w, h, res;
	if (n.type == 'grid') {
		resizeBoard(n, R);

		//only NOW arrange of children of board members is done!!! 
		for (const uidMember of n.children) {
			let tile = R.uiNodes[uidMember];
			if (nundef(tile.children)) continue;
			let ch = tile.children[0];
			let robber = R.uiNodes[ch];
			let ui = robber.ui;

			// console.log('arranging:', uidMember)
			// console.log('board size', n.size, '\ntile size', tile.size, '\nrobber size', robber.size)

			ui.style.position = 'absolute';
			ui.style.display = 'inline-block';

			let x = n.size.w / 2 + tile.pos.x - robber.size.w / 2;// 10;// wTotal/2 + -22;//bdiv.width/2-bmk.width/2;//(bdiv.width/2 + bmk.left + (bmk.width - bel.width) / 2);
			let y = n.size.h / 2 + tile.pos.y - robber.size.h / 2;// 10;// wTotal/2 + -22;//bdiv.width/2-bmk.width/2;//(bdiv.width/2 + bmk.left + (bmk.width - bel.width) / 2);

			ui.style.left = x + 'px';
			ui.style.top = y + 'px';
			ui.style.margin = '0px';
		}
		return { w: n.wTotal, h: n.hTotal };

	} else if (n.uiType == 'd') { 
		return { w: n.sizeMeasured.w, h: n.sizeMeasured.h };

	} else if (n.info) {
		//console.log('arranging board member parent, children', n.children);
		let ch = n.children[0];
		let nChild = R.uiNodes[ch];

		//since this is a board member, layout is 1/1
		let wNeeded = nChild.size.w+12; //just testing: give child more space for margin
		let hNeeded = nChild.size.h+12;
		n.sizeNeeded = { w: wNeeded, h: hNeeded };

		//but: since relies on board sizing, need to resize board and arrange board first!
		let nBoard = R.uiNodes[n.uidParent];
		addResizeInfo(nBoard, n, n.sizeNeeded);
		// console.log('child', nChild.uid, 'needs', nChild.size, 'layout 1/1', '\nresizeInfo:', nBoard.resizeInfo);

		return { w: n.sizeNeeded.w, h: n.sizeNeeded.h };

	} else {
		console.log('!!!!!!!!!!case NOT catched in arrangeOverride!!!!!!!!!!', n);

	}
	return res;
}
function calcSizeAvailable(uid, R) {
	let n = R.uiNodes[uid];
	if (isdef(n.info)) {

		return { w: n.info.size, h: n.info.size };

	} else if (n.type == 'grid') {
		calcBoardDimensions(n, R);
		return { w: n.wTotal, h: n.hTotal };

	} else if (n.uiType == 'd') {

		return { w: n.sizeMeasured.w, h: n.sizeMeasured.h };

	} else {
		console.log('case NOT catched in calcSizeAvailable', n);
		return { w: n.sizeMeasured.w, h: n.sizeMeasured.h };
	}
}


































