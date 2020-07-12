function arrangeOverride(n, R) {
	if (nundef(n.children)) return { w: 0, h: 0 }

	if (n.type == 'grid') {
		resizeBoard(n, R);

		//only NOW arrange of children of board members is done!!! 
		for (const uidMember of n.children) {
			let tile = R.uiNodes[uidMember];
			if (nundef(tile.children)) continue;

			//simpleLayoutForOneChildPosition(n,tile,R);
			wrapLayoutPosition(n, tile, R);
		}
		return { w: n.wTotal, h: n.hTotal };

	} else if (n.uiType == 'd') {
		// console.log('===> (panelLayout) type',n.type)
		let szNeeded = panelLayout(n, R);
		return szNeeded;

	} else if (n.info) {

		n.sizeNeeded = wrapLayoutSizeNeeded(n.children, R);
		let nBoard = R.uiNodes[n.uidParent];
		addResizeInfo(nBoard, n, n.sizeNeeded);
		return { w: n.sizeNeeded.w, h: n.sizeNeeded.h };

	} else {
		console.log('!!!!!!!!!!case NOT catched in arrangeOverride_!!!!!!!!!!', n);

	}
	return res;
}
function calcSizeMeasured(n, R) {
	// let n = R.uiNodes[uid];
	if (isdef(n.info)) { //board member
		return { w: n.info.size, h: n.info.size };

	} else if (n.type == 'grid') {
		calcBoardDimensions(n, R);
		return { w: n.wTotal, h: n.hTotal };
	} else if (n.ui.style.display == 'flex' && isdef(n.children)) { //$$$

		//consout('ALERT!!! flex style:measure AFTER arrange!!!',uid);
		return { w: 0, h: 0 };
	} else {


		let b = getBounds(n.ui, true);

		if (n.uid == R.tree.uid) { consout('222222', n.uid, n.type, '\ndisplay', n.ui.style.display, b.height) }

		return { w: b.width, h: b.height };
	}
}
function recMeasureOverride(uid, R) {
	//console.log('measure', uid);
	let n = R.uiNodes[uid];

	if (isdef(n.children)) { for (const ch of n.children) { recMeasureOverride(ch, R); } }
	n.sizeMeasured = calcSizeMeasured(n, R);
	n.sizeNeeded = arrangeOverride(n, R);
	//if (uid == R.tree.uid){		consout('hallooooooo',uid,n.sizeNeeded,n.sizeMeasured)	}
	n.size = {
		w: Math.max(n.sizeMeasured.w, n.sizeNeeded.w),
		h: Math.max(n.sizeMeasured.h, n.sizeNeeded.h)
	}
	//console.log('final size', n.uid, n.size);
	//showSizes(n, R);
}




function addResizeInfo(nBoard, nMember, sizeNeeded) {
	//console.log('addrrrrrrrrrrrrrrrrr')
	let szNeeded = Math.max(sizeNeeded.w, sizeNeeded.h);
	if (nMember.info.size < szNeeded) {
		//console.log('szNeeded',szNeeded)
		let memType = nMember.info.memType;
		let newSize = Math.max(sizeNeeded.w, sizeNeeded.h);
		newSize = Math.ceil(newSize / 4);
		newSize *= 4;
		if (newSize % 4 != 0) newSize += 4;
		let key = memType + 's';

		//instead of edge resize do field resize
		if (memType == 'edge') {
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
			if (key == 'corners') {
				//how to find field size?
				let fSize = isdef(nBoard.resizeInfo.fields);
				if (nundef(fSize)) {

					let f0 = R.uiNodes[nBoard.children[0]];
					fSize = f0.info.size;
				}
				if (fSize < newSize * 3) {
					nBoard.resizeInfo.fields = newSize * 3;
				}
			}
		}
		nBoard.adirty = nMember.adirty = true;
	}
}








