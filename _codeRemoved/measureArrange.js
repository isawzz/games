function recMeasureOverride(uid, R) {
	console.log('measure', uid);
	let n = R.uiNodes[uid];

	if (isdef(n.children)) {
		for (const ch of n.children) {
			recMeasureOverride(ch, R);
		}
	}
	n.sizeMeasured = calcSizeMeasured(uid, R);
	//console.log('measured:',n.sizeMeasured)
	n.sizeNeeded = arrangeOverride(uid, R);
	//n.sizeAvailable = calcSizeAvailable(uid,R); //
	//n.sizeMeasured; // calcSizeAvailable(uid, R);
	//console.log('n', n.uid, 'type', n.type, 'avail', n.sizeAvailable, 'needed', n.sizeNeeded);

	n.size = {
		w: Math.max(n.sizeMeasured.w, n.sizeNeeded.w), //,n.sizeAvailable.w),
		h: Math.max(n.sizeMeasured.h, n.sizeNeeded.h) //,n.sizeAvailable.h)
	};
	//console.log('final size',n.size);
	//hier muss dann actualSize setzen wenn needed > available/measured

	// n.sizeNeeded.w = Math.max(n.sizeNeeded.w,n.sizeAvailable.w);
	// n.sizeNeeded.h = Math.max(n.sizeNeeded.h,n.sizeAvailable.h);
}
function calcSizeMeasured(uid, R) {
	let n = R.uiNodes[uid];
	if (isdef(n.info)) { //board member
		//soll ich hier schon zu board den size propagaten?
		//console.log('board member', n.uid, n.info.size,n.info.size)
		w = h = n.info.size;
		return { w: w, h: h };
		//console.log('.......calcSizeAvailable',n.info)
		//nParent.sizeNeeded = 
		//this is a board member
		//width and height is nuiBoard.fSize
	} else if (n.type == 'grid') {
		calcBoardDimensions(n, R);
		//console.log('board, size cannot be measured!', n.wTotal,n.hTotal);
		w = n.wTotal;
		h = n.hTotal;
		return { w: w, h: h };

	} else {
		let b = getBounds(n.ui);
		w = b.width;
		h = b.height;
		return { w: w, h: h };
	}
}

function addResizeInfo(nBoard, nMember, sizeNeeded) {
	let szMax = Math.max(sizeNeeded.w, sizeNeeded.h);
	//let bmk = { w: nMember.info.size, h: nMember.info.size };
	if (nMember.info.size < szMax) {
		let memType = nMember.info.memType;
		let newSize = Math.max(sizeNeeded.w, sizeNeeded.h);
		newSize = Math.ceil(newSize / 4);
		newSize *= 4;
		if (newSize % 4 != 0) newSize += 4;
		let key = memType + 's';
		if (nundef(nBoard.resizeInfo)) nBoard.resizeInfo = {};
		if (nundef(nBoard.resizeInfo[key]) || nBoard.resizeInfo[key] < newSize) {
			//console.log('updating resizeInfo')
			nBoard.resizeInfo[key] = newSize;
			nMember.sizeNeeded = { w: newSize, h: newSize }
		}
		nBoard.adirty = nMember.adirty = true;
	}
}

function arrangeOverride(uid, R) {
	//das macht mehr oder weniger was adjustLayout gemacht hat!!!
	console.log('arrange', uid)
	let n = R.uiNodes[uid];

	if (nundef(n.children)) return { w: 0, h: 0 }

	// let w, h, res;
	if (n.type == 'grid') {
		//console.log('arranging grid elements!!! ==>gridLayout!');
		//console.log('(each board member should have sizeNeeded set!)');
		resizeBoard(n, R);

		//only NOW arrange of children of board members is done!!! 
		for (const uidMember of n.children) {
			let tile = R.uiNodes[uidMember];
			if (nundef(tile.children)) continue;
			console.log('arranging:', uidMember)
			let ch = tile.children[0];
			let robber = R.uiNodes[ch];

			//console.log('id_divParent', n1.idUiParent, 'id_directParent', n1.uidParent)
			// let divParent = mBy(robber.idUiParent);
			// let directParent = mBy(robber.uidParent);

			let ui = robber.ui;

			// let nuiBoard = R.uiNodes[tile.uidParent];
			// console.assert(nuiBoard == n, 'NO!!!!!!!!!');

			console.log('board size', n.size, '\ntile size', tile.size, '\nrobber size', robber.size)
			//console.log(nuiBoard)

			//als LETZTES: positioning!
			// let bmk = getBounds(directParent, false, divParent);
			// let arr;
			// let [wTotal, hTotal, wBoard, hBoard, fw, fh, fSpacing, fSize, gap] = [n.wTotal, n.hTotal, n.wBoard, n.hBoard, n.fw, n.fh, n.fSpacing, n.fSize, n.gap];
			//console.log('wTotal',wTotal,'hTotal',hTotal,'wBoard',wBoard,'hBoard',hBoard,'fw',fw,'fh',fh,'fSpacing',fSpacing,'fSize',fSize,'gap',gap)
			// let bdiv = getBounds(divParent);
			// divParent.style.backgroundColor = 'yellow';

			ui.style.position = 'absolute';
			ui.style.display = 'inline-block';

			//das darf erst NACH inline-block sein weil size veraendert!!!!!!!!!
			// let bel = getBounds(ui);

			// console.log('board',n,'\ntile',tile,'\nrobber',robber);
			// console.log('board:',n.size.w/2,'tile',tile.pos.x,'robber',robber.size.w/2)

			let x = n.size.w / 2 + tile.pos.x - robber.size.w / 2;// 10;// wTotal/2 + -22;//bdiv.width/2-bmk.width/2;//(bdiv.width/2 + bmk.left + (bmk.width - bel.width) / 2);
			let y = n.size.h / 2 + tile.pos.y - robber.size.h / 2;// 10;// wTotal/2 + -22;//bdiv.width/2-bmk.width/2;//(bdiv.width/2 + bmk.left + (bmk.width - bel.width) / 2);

			ui.style.left = x + 'px';
			ui.style.top = y + 'px';
			ui.style.margin = '0px';

			//let b=getBounds(ui);
			//console.log('x', x, '\nbdiv left', bdiv.left, 'w', bdiv.width, '\nbmk left', bmk.left, 'w', bmk.width, '\nbel left', bel.left, 'w', bel.width);
			// console.log('x',x,'y',y,'\nbdiv',bdiv.left,bdiv.top,bdiv.width,bdiv.height,'\nbmk',bmk.left,bmk.top,bmk.width,bmk.height,'\nbel',bel.left,bel.top,bel.width,bel.height);
			//console.log('tile bounds bmk', bmk, '\nui bounds bel', bel, '\nleft', x, '\ntop', y, '\nui', ui);
			//console.log('tile size', bmk.width,'x',bmk.height, '\nui size', bel.width,'x',bel.height); 
			// let newSizeNeeded = { w: Math.max(bmk.width, bel.width), h: Math.max(bmk.height, bel.height) };

		}

		//gridLayout(n, R);
		// for(const ch of n.children){
		// 	let n1=R.uiNodes[ch];
		// 	//console.log(n1.uid,'has sizeNeeded:',n1.sizeNeeded)
		// }
		return { w: n.wTotal, h: n.hTotal };
		//w=n.wTotal;h=n.hTotal;
	} else if (n.uiType == 'd') { // && n.ui.style.display == 'flex') {
		//console.log('arranging d parent: arranges itself (flex)', n);
		//console.log(n.ui);
		return { w: n.sizeMeasured.w, h: n.sizeMeasured.h };
	} else if (n.info) {
		//console.log('arranging board member parent, children', n.children);
		let ch = n.children[0];
		let nChild = R.uiNodes[ch];

		//since this is a board member, layout is 1/1
		let wNeeded = nChild.size.w + 24; //just testing: give child more space for margin
		let hNeeded = nChild.size.h + 24;
		n.sizeNeeded = { w: wNeeded, h: hNeeded };

		//but: since relies on board sizing, need to resize board and arrange board first!
		let nBoard = R.uiNodes[n.uidParent];
		//hier muss ich jetzt die resizeInfo hingeben!!!!!!!]
		addResizeInfo(nBoard, n, n.sizeNeeded);
		console.log('child', nChild.uid, 'needs', nChild.size, 'layout 1/1', '\nresizeInfo:', nBoard.resizeInfo);

		// arrangeOverride(nBoard.uid, R);


		return { w: n.sizeNeeded.w, h: n.sizeNeeded.h };
		// return nChild.sizeAvailable;
	} else {
		console.log('!!!!!!!!!!case NOT catched in arrangeOverride!!!!!!!!!!', n);

	}
	return res;
}
function calcSizeAvailable(uid, R) {

	//console.log('hallllllllllllllllllllllllllloooooooooooooo')
	let n = R.uiNodes[uid];
	// let nParent = R.uiNodes[n.uidParent];
	let w, h;
	//console.log(n)
	if (isdef(n.info)) {
		//soll ich hier schon zu board den size propagaten?
		//console.log('board member', n.uid, n.info.size,n.info.size)
		w = h = n.info.size;
		return { w: w, h: h };
		console.log('.......calcSizeAvailable', n.info)
		//nParent.sizeNeeded = 
		//this is a board member
		//width and height is nuiBoard.fSize
	} else if (n.type == 'grid') {
		calcBoardDimensions(n, R);
		//console.log('board, size cannot be measured!', n.wTotal,n.hTotal);
		w = n.wTotal;
		h = n.hTotal;
		return { w: w, h: h };

	} else if (n.uiType == 'd') {
		return { w: n.sizeMeasured.w, h: n.sizeMeasured.h };
		//return n.sizeMeasured;
	} else {
		console.log('case NOT catched in calcSizeAvailable', n);
		return { w: n.sizeMeasured.w, h: n.sizeMeasured.h };
		//w = h = 0;
	}
	// if (isdef(n.sizeNeeded)) {
	// 	w = Math.max(w, n.sizeNeeded.w);
	// 	h = Math.max(h, n.sizeNeeded.h);
	// }
	return { w: n.sizeMeasured.w, h: n.sizeMeasured.h };
}




function makeUiOnBoardMember(n, uidParent, R) {
	let ui;
	let divParent = findAncestorElemOfType(mBy(uidParent), 'div');
	n.idUiParent = divParent.id;
	let directParent = mBy(uidParent); //parent of robber
	console.log('\ndivParent is', divParent, '\ndirectParent is', directParent, '\nn.content', n.content);

	//ui = mTextDiv(n.content	); 
	//ui = isdef(n.content)?mNode(n.content, divParent):mDiv(divParent);
	ui = mNode(n.content, divParent);

	//als erstes alle stylings!
	let pre = ui.children[0];
	if (!n.content) {
		pre.innerHTML = '';
		n.adirty = true;
	} else {
		pre.style.fontSize = '10pt';
	}
	ui.style.borderRadius = '6px';
	ui.style.padding = '2px 10px 2px 8px';

	applyCssStyles(ui, n.cssParams);

	//als zweites append damit getBounds functioniert
	mAppend(divParent, ui);

	//als LETZTES: positioning!
	let bmk = getBounds(directParent, false, divParent);//false,mBy('table'));
	ui.style.position = 'absolute';
	ui.style.display = 'inline-block';

	//das darf erst NACH inline-block sein weil size veraendert!!!!!!!!!
	let bel = getBounds(ui);
	ui.style.left = (bmk.left + (bmk.width - bel.width) / 2) + 'px';
	ui.style.top = (bmk.top + (bmk.height - bel.height) / 2) + 'px';
	n.uiType = 'childOfBoardElement';
	n.potentialOverlap = true;
	return ui;

}



