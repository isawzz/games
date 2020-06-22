function recMeasureOverride(uid, R) {
	let n = R.uiNodes[uid];

	if (isdef(n.children)) { for (const ch of n.children) { recMeasureOverride(ch, R); } }
	n.sizeMeasured = calcSizeMeasured(uid, R);
	//console.log('measured:',n.sizeMeasured)
	n.sizeNeeded = arrangeOverride(uid, R);
	n.sizeAvailable = calcSizeAvailable(uid,R); //
	//n.sizeMeasured; // calcSizeAvailable(uid, R);
	//console.log('n', n.uid, 'type', n.type, 'avail', n.sizeAvailable, 'needed', n.sizeNeeded);

	n.size={w:Math.max(Math.max(n.sizeMeasured.w,n.sizeNeeded.w),n.sizeAvailable.w),
		h:Math.max(Math.max(n.sizeMeasured.h,n.sizeNeeded.h),n.sizeAvailable.h)
	};
	//console.log('final size',n.size);
	//hier muss dann actualSize setzen wenn needed > available/measured

	// n.sizeNeeded.w = Math.max(n.sizeNeeded.w,n.sizeAvailable.w);
	// n.sizeNeeded.h = Math.max(n.sizeNeeded.h,n.sizeAvailable.h);
}
function calcSizeMeasured(uid, R) { 
	let n = R.uiNodes[uid]; 
	//if (n.type == 'grid'){
		//return {w:n.wTotal,h:n.hTotal};
	//}
	let b = getBounds(n.ui); 
	w = b.width; 
	h = b.height; 
	return { w: w, h: h }; 
}

function arrangeOverride(uid, R) {
	//das macht mehr oder weniger was adjustLayout gemacht hat!!!
	let n = R.uiNodes[uid];

	if (nundef(n.children)) return { w: 0, h: 0 }

	// let w, h, res;
	if (n.type == 'grid') {
		//console.log('arranging grid elements!!! ==>gridLayout!');
		//console.log('(each board member should have sizeNeeded set!)');
		gridLayout(n, R);
		// for(const ch of n.children){
		// 	let n1=R.uiNodes[ch];
		// 	//console.log(n1.uid,'has sizeNeeded:',n1.sizeNeeded)
		// }
		return { w: n.wTotal, h: n.hTotal };
		//w=n.wTotal;h=n.hTotal;
	} else if (n.uiType == 'd'){ // && n.ui.style.display == 'flex') {
		//console.log('arranging d parent: arranges itself (flex)', n);
		//console.log(n.ui);
		return {w:n.sizeMeasured.w,h:n.sizeMeasured.h};
	} else if (n.info) {
		//console.log('arranging board member parent, children', n.children);
		let ch = n.children[0];
		let nChild = R.uiNodes[ch];
		return {w:n.sizeMeasured.w,h:n.sizeMeasured.h};
		// return nChild.sizeAvailable;
	} else {
		console.log('case NOT catched in arrangeOverride', n);
		
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
		return {w:w,h:h};
		console.log('.......calcSizeAvailable',n.info)
		//nParent.sizeNeeded = 
		//this is a board member
		//width and height is nuiBoard.fSize
	} else if (n.type == 'grid') {
		calcBoardDimensions(n, R);
		//console.log('board, size cannot be measured!', n.wTotal,n.hTotal);
		w = n.wTotal;
		h = n.hTotal;
		return {w:w,h:h};

	} else if (n.uiType == 'd') {
		return 	{w:n.sizeMeasured.w,h:n.sizeMeasured.h};
		//return n.sizeMeasured;
	} else {
		console.log('case NOT catched in calcSizeAvailable', n);
		return 	{w:n.sizeMeasured.w,h:n.sizeMeasured.h};
		//w = h = 0;
	}
	// if (isdef(n.sizeNeeded)) {
	// 	w = Math.max(w, n.sizeNeeded.w);
	// 	h = Math.max(h, n.sizeNeeded.h);
	// }
	return 	{w:n.sizeMeasured.w,h:n.sizeMeasured.h};
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































