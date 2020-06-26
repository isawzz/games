
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

//#region measure and arrange! ==>eigenes file!
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
	//console.log('final size',n.uid,n.size);
	showSizes(n,R);
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

			//simpleLayoutForOneChildPosition(n,tile,R);
			wrapLayoutPosition(n,tile,R);
		}
		return { w: n.wTotal, h: n.hTotal };

	} else if (n.uiType == 'd') { 
		panelLayout(n,R);
		// if (n.params.orientation == 'h'){
		// 	//console.log('horizontal layout!')
		// 	horLayout(n,R);
		// }else{
		// 	panelLayout(n,R);
		// }

		return { w: n.sizeMeasured.w, h: n.sizeMeasured.h };

	} else if (n.info) {

		//hier wird platzreservierung fuer children auf einem board member gemacht!!!!!!!
		// alle children kommen dann ja direkt auf das board selbst! sind aber immer noch node children von tile!!!
		//2 children case

		//new code: multiple children
		n.sizeNeeded = wrapLayoutSizeNeeded(n.children,R);
		//console.log('wrapLayoutSizeNeeded returned',n.sizeNeeded);

		//old code: only 1 child
		//n.sizeNeeded = simpleLayoutForOneChildSizeNeeded(n.children[0],R);

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

function calcSizeMeasured(uid, R) {
	let n = R.uiNodes[uid];
	if (isdef(n.info)) { //board member
		return { w: n.info.size, h: n.info.size };

	} else if (n.type == 'grid') {
		calcBoardDimensions(n, R);
		return { w: n.wTotal, h: n.hTotal };

	} else {
		let b = getBounds(n.ui,);
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

function showSizes(nLast,R){
	//console.log('______showSizes_______',nLast.uid);
	for(const uid in R.UIS){
		let n = R.UIS[uid];
		// if (isdef(n.size)) {
		// 	console.log(n.uid,'size',n.size.w,n.size.h,			'measured',n.sizeMeasured.w,n.sizeMeasured.h,			'needed',n.sizeNeeded.w,n.sizeNeeded.h,); //R.UIS[uid]);
		// }
	}
}
































