function calcDirectParentAndIdUiParent(n, uidParent, R) {
	if (uidParent && isBoardMember(uidParent, R)) {
		let divParent = findAncestorElemOfType(mBy(uidParent), 'div');
		n.idUiParent = divParent.id;
	} else {
		n.idUiParent = uidParent;
	}
}

function createUi(n, uidParent, R) {

	// if (n == R.uiNodes[n.uid]){
	// 	//console.log('n in createUi is uiNode',n.uid);
	// }else if (n == R.rNodes[n.uid]){
	// 	console.log('n in createUi is rNode',n.uid);
	// }
	//if (n.uid == '_14') {		console.log('createUi', n)	}
	if (nundef(n.type)) {
		n.type = inferType(n);
		//console.log('inferring type:',n.type);
	}

	R.registerNode(n);

	decodeParams(n, R, {});

	calcDirectParentAndIdUiParent(n, uidParent, R);
	//console.log('in createUi_',n.idUiParent)

	//console.log('create ui for',n.uid,n.type,n.content,n.uidParent,n.idUiParent)

	let ui = RCREATE[n.type](n, uidParent, R);

	if (nundef(n.uiType)) n.uiType = 'd'; // d, g, h (=hybrid)

	if (n.uiType == 'NONE') return ui;

	if (n.uiType != 'childOfBoardElement') {
		if (isBoard(n.uid, R)) { delete n.cssParams.padding; }
		applyCssStyles(n.uiType == 'h' ? mBy(n.uidStyle) : ui, n.cssParams);
	}

	if (!isEmpty(n.stdParams)) {
		//console.log('rsg std params!!!', n.stdParams);
		switch (n.stdParams.show) {
			case 'if_content': if (!n.content) hide(ui); break;
			case 'hidden': hide(ui); break;
			default: break;
		}
	}

	R.setUid(n, ui);

	let b=getBounds(ui,true);
	//console.log('________createUi: ',n.uid,'\n',ui,'\nbounds',b.width,b.height);

	return ui;

}

function adjustLayoutForBoardMember(n, R) {
	console.log('adjust layout for', n.uid);

	//first assume there is only 1 child (because if there is more than 1, there should have been placed a panel!!!!)
	//console.assert(n.children.length == 1, 'board member as parent: adjusting layout for MORE THAN 1 CHILD!!!!!! - should have used a panel!!!!!!')
	let ch = n.children[0];
	//console.log('child of board member is', ch, R.uiNodes[ch]);
	let n1 = R.uiNodes[ch];
	console.log('id_divParent', n1.idUiParent, 'id_directParent', n1.uidParent)
	let divParent = mBy(n1.idUiParent);
	let directParent = mBy(n1.uidParent);

	let ui = n1.ui;

	let nuiBoard = R.uiNodes[n.uidParent];
	console.log(nuiBoard)

	//als LETZTES: positioning!
	let bmk = getBounds(directParent, false, divParent);
	let arr;
	let [wTotal, hTotal, wBoard, hBoard, fw, fh, fSpacing, fSize, gap] =
		[nuiBoard.wTotal, nuiBoard.hTotal, nuiBoard.wBoard, nuiBoard.hBoard, nuiBoard.fw, nuiBoard.fh, nuiBoard.fSpacing, nuiBoard.fSize, nuiBoard.gap];
	console.log('wTotal', wTotal, 'hTotal', hTotal, 'wBoard', wBoard,
		'hBoard', hBoard, 'fw', fw, 'fh', fh, 'fSpacing', fSpacing, 'fSize', fSize, 'gap', gap)
	let bdiv = getBounds(divParent);
	divParent.style.backgroundColor = 'yellow';
	ui.style.position = 'absolute';
	ui.style.display = 'inline-block';

	//das darf erst NACH inline-block sein weil size veraendert!!!!!!!!!
	let bel = getBounds(ui);
	let x = 0;// wTotal/2 + -22;//bdiv.width/2-bmk.width/2;//(bdiv.width/2 + bmk.left + (bmk.width - bel.width) / 2);
	let y = 0;// (bmk.top + (bmk.height - bel.height) / 2);
	ui.style.left = x + 'px';
	ui.style.top = y + 'px';
	//ui.style.left = '11px';
	//ui.style.top = '12px';
	ui.style.margin = '0px';

	//let b=getBounds(ui);
	console.log('x', x, '\nbdiv left', bdiv.left, 'w', bdiv.width, '\nbmk left', bmk.left, 'w', bmk.width, '\nbel left', bel.left, 'w', bel.width);
	// console.log('x',x,'y',y,'\nbdiv',bdiv.left,bdiv.top,bdiv.width,bdiv.height,'\nbmk',bmk.left,bmk.top,bmk.width,bmk.height,'\nbel',bel.left,bel.top,bel.width,bel.height);
	//console.log('tile bounds bmk', bmk, '\nui bounds bel', bel, '\nleft', x, '\ntop', y, '\nui', ui);
	//console.log('tile size', bmk.width,'x',bmk.height, '\nui size', bel.width,'x',bel.height); 
	n.sizeNeeded = { w: Math.max(bmk.width, bel.width), h: Math.max(bmk.height, bel.height) };

	if (bmk.width < bel.width || bmk.height < bel.height) {
		//need to adjust layout for board as well!!!!!!!
		let nBoard = R.uiNodes[n.uidParent];
		//console.log('______________\nboard should be',nBoard);
		nBoard.adirty = true;

		//1. which type of member is n?
		let memType = n.info.memType;
		let curSize = n.typParams.size;
		let newSize = Math.max(bel.width, bel.height);
		newSize = Math.ceil(newSize / 4);
		newSize *= 4;
		if (newSize % 4 != 0) newSize += 4;

		if (nundef(nBoard.resizeInfo)) nBoard.resizeInfo = {};
		nBoard.resizeInfo[memType + 's'] = newSize;

		//ALL board member sizes must be divisible by 4!!!!!!!


		//console.log('memType',memType,'\ncurSize',curSize,'\nnewSize',newSize);




	}

	n.uiType = 'childOfBoardElement';
	n.potentialOverlap = true;

}
function adjustContainerLayout(n, R) {

	console.log('...........adjustContainer____________', n.uid);
	n.adirty = false;

	//console.log(n);return;
	if (n.type == 'grid') {
		//console.log('adjustContainerLayout! ja grid kommt auch hierher!!!', n);
		resizeBoard(n, R);
		return;
	}

	if (n.type == 'hand') { layoutHand(n); return; }
	//if (n.type == 'hand') { sortCards(n); return; }

	//hier kommt jetzt das adjusting wenn parent ein board member ist und child ein div ist
	// n ist hier der parent also das board member!!!!
	if (n.uid && isBoardMember(n.uid, R)) {
		//console.log('88888888888888888888888')
		adjustLayoutForBoardMember(n, R);
	}


	//console.log('==>', n.params)
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

function calcRays(n, gParent, R) {
	//console.log(n);
	//console.assert(n.type == 'grid','calcRays on NON-grid type!!!! (geht nicht!)')
	if (n.params.dray) {
		let ui = n.ui;
		let buid = n.uidParent;
		let b = R.rNodes[buid];
		//let gParent = R.uiNodes[buid].ui;
		let bui = R.UIS[buid];
		let size = 20;
		//console.log('===>size',size,buid,b,'\nbui',bui);
		let fsp = bui.params.field_spacing;
		//console.log('fieldSpacing',fsp);
		let info = n.info;
		//console.log('info',info,'\nn',n);
		let x = info.x * fsp;
		let y = info.y * fsp;
		let w = size;
		let h = size;
		let D = distance(0, 0, x, y);
		//console.log(x,y,w,h,D);
		let p = n.params.dray;
		let rel = p.rel;

		let nanc = n;
		if (rel == 'ancestor') {
			console.log('haaaaaaaaaaaaaaaaalllllllllllllllooooooooooooo')
			//eval next clause!
			while (true) {
				nanc = R.rNodes[nanc.uidParent];
				if (nundef(nanc) || nundef(nanc.oid)) { nanc = null; break; }
				let o = R.getO(nanc.oid);
				let conds = p.cond;
				let tf = evalConds(o, conds);
				if (tf) { break; }
			}

		}
		let by = p.by;
		nby = isNumber(by) ? by : firstNumber(by);
		if (isString(by) && by[by.length - 1] == '%') {
			//let n=firstNumber(by);
			nby = nby * size / 100;
		}
		let elem = isdef(nanc) ? nanc : rel == 'parent' ? gParent : ui;
		let norm = nby / D;
		let xdisp = x * norm;//nby*norm;//*x;
		let ydisp = y * norm; //nby*norm;//*y;

		//console.log('verschiebe label um',xdisp,ydisp,'\nnorm',norm,'\nlabel',n.label);
		let txt = n.label.texts;
		let el = n.label.texts[0].ui;
		el.setAttribute('x', xdisp);
		el.setAttribute('y', ydisp);

		if (isdef(n.label.textBackground)) {
			if (n.params.bgText) {
				let tb = n.label.textBackground;
				let tbb = getBounds(tb);
				//console.log('tb bounds',tbb)
				//console.log('text background', tb,'x',xdisp,'y',ydisp)
				let origX = tb.getAttribute('x');
				let newX = origX + xdisp;
				tb.setAttribute('x', xdisp - tbb.width / 2);// newX);
				let origY = tb.getAttribute('y');
				let newY = origY + ydisp;
				tb.setAttribute('y', ydisp - tbb.height * 4 / 5);
				//how to add translate transform to g?
			} else {
				n.label.textBackground.remove();
				delete n.label.textBackground;
			}


		}
	}

}

