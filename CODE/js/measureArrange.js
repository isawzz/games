







//#region orig measure and arrange! 
function recMeasureOverride(uid, R) {
	//console.log('measure', uid);
	let n = R.uiNodes[uid];

	if (isdef(n.children)) { for (const ch of n.children) { recMeasureOverride(ch, R); } }
	n.sizeMeasured = calcSizeMeasured(uid, R);
	n.sizeNeeded = arrangeOverride(uid, R);
	if (uid == R.tree.uid){		consout('hallooooooo',uid,n.sizeNeeded,n.sizeMeasured)	}
	n.size = {
		w: Math.max(n.sizeMeasured.w, n.sizeNeeded.w),
		h: Math.max(n.sizeMeasured.h, n.sizeNeeded.h)
	}
	//console.log('final size', n.uid, n.size);
	//showSizes(n, R);
}
function arrangeOverride(uid, R) {
	//das macht mehr oder weniger was adjustLayout gemacht hat!!!
	console.log('arrange', uid)
	let n = R.uiNodes[uid];

	//if (n.type == 'manual00') { if (isdef(n.children)) { n.type = 'panel'; } else { n.type = 'info'; } }


	if (nundef(n.children)) return { w: 0, h: 0 }

	// let w, h, res;
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

	} else if (n.uiType == 'd' && !startsWith(n.type, 'manual')) {
		// console.log('===>type',n.type)

		let szNeeded = panelLayout(n, R);
		//console.log('______________ : panel!',n.uid,n);

		return szNeeded; // { w: n.sizeMeasured.w, h: n.sizeMeasured.h };

	} else if (n.uiType == 'd') {// && !startsWith(n.type, 'manual')) {

		console.log('===>type', n.type)
		if (isdef(n.children)) {
			panelLayout(n, R);
			//console.log('______________ : panel!',n.uid,n);

			return { w: n.sizeMeasured.w, h: n.sizeMeasured.h };
		} else {
			//wrapLayout
		}

	} else if (n.info) {

		//console.log('______________ : wrap!')
		//hier wird platzreservierung fuer children auf einem board member gemacht!!!!!!!
		// alle children kommen dann ja direkt auf das board selbst! sind aber immer noch node children von tile!!!
		//2 children case

		//new code: multiple children
		n.sizeNeeded = wrapLayoutSizeNeeded(n.children, R);
		//console.log('wrapLayoutSizeNeeded returned',n.sizeNeeded);

		//old code: only 1 child
		//n.sizeNeeded = simpleLayoutForOneChildSizeNeeded(n.children[0],R);

		//but: since relies on board sizing, need to resize board and arrange board first!
		let nBoard = R.uiNodes[n.uidParent];
		addResizeInfo(nBoard, n, n.sizeNeeded);
		// console.log('child', nChild.uid, 'needs', nChild.size, 'layout 1/1', '\nresizeInfo:', nBoard.resizeInfo);

		return { w: n.sizeNeeded.w, h: n.sizeNeeded.h };

	} else if (n.type == 'manual00') {
		console.log('______________ : manual00');
		standardLayout(n, R);
		return { w: n.sizeMeasured.w, h: n.sizeMeasured.h };

	} else {
		console.log('!!!!!!!!!!case NOT catched in arrangeOverride!!!!!!!!!!', n);

	}
	return res;
}
function recPositions(uid, R) {
	let n = R.uiNodes[uid];
	if (!n.uidParent) {
		// n.pos = {left:0,top:0};
		// n.apos=jsCopy(n.pos);
		// n.rpos=jsCopy(n.pos);

		//n is root node!
		let d = mBy(R.baseArea);
		let b = getBounds(d);
		let b1 = getBounds(n.ui);
		n.rpos = { left: b1.left - b.left, top: b1.top - b.top };
		n.apos = { left: b1.left, top: b1.top };
		//n.apos = jsCopy(n.rpos);
	} else {
		nParent = R.uiNodes[n.uidParent];
		n.apos = {
			left: nParent.apos.left + n.rpos.left,
			top: nParent.apos.top + n.rpos.top
		};
	}
	n.rcenter = {
		x: n.rpos.left + n.size.w / 2,
		y: n.rpos.top + n.size.h / 2
	};
	n.acenter = {
		x: n.apos.left + n.size.w / 2,
		y: n.apos.top + n.size.h / 2
	};
	if (nundef(n.children)) return;
	for (const uidChild of n.children) {
		recPositions(uidChild, R);
	}
}
function calcSizeMeasured(uid, R) {
	let n = R.uiNodes[uid];
	if (isdef(n.info)) { //board member
		return { w: n.info.size, h: n.info.size };

	} else if (n.type == 'grid') {
		calcBoardDimensions(n, R);
		return { w: n.wTotal, h: n.hTotal };
	}else if (n.ui.style.display == 'flex'){ //$$$

		consout('ALERT!!! flex style:measure AFTER arrange!!!',uid);return {w:0,h:0};
	} else {


		let b = getBounds(n.ui,true);

		if (uid == R.tree.uid){		consout('222222',uid,n.type,'\ndisplay',n.ui.style.display,b.height)	}

		return { w: b.width, h: b.height };
	}
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
function standardLayout(n, R) {

	if (nundef(n.children)) return;
	//horLayout(n, R); return;


	let b = getBounds(n.ui);

	for (const uid of n.children) {
		let n1 = R.uiNodes[uid];
		let b1 = getBounds(n1.ui);
		n1.rpos = { left: b1.left - b.left, top: b1.top - b.top };
		n1.apos = { left: b1.left, top: b1.top };
	}
}





