//#region sample R
function makeTableTreeX(fStruct, { positioning='none', rootContent = true, extralong = false, params, data } = {}) {
	R = fStruct();
	if (!rootContent) delete R.tree.content; else if (extralong) R.tree.content = 'hallo das ist ein besonders langer string!!!';

	let r1 = normalizeRTree(R);
	let num = firstNumber(R.tree.uid);
	for (const uid in r1) {
		r1[uid].realUid = '_' + (firstNumber(uid) + num);
	}

	if (isdef(params)) {
		for (const uid in params) {
			let realUid = r1[uid].realUid;
			let n = R.rNodes[realUid];
			//console.log('giving caption:'+realUid,'= index:'+uid,'params',params[uid]);
			n.params = params[uid];
		}
	}
	if (isdef(data)) {
		for (const uid in data) {
			let realUid = r1[uid].realUid;
			let n = R.rNodes[realUid];
			//console.log('giving caption:'+realUid,'= index:'+uid,'params',params[uid]);
			n.content = data[uid];
		}
	}

	//construct ui
	let d = mBy('table');
	d.style.position = 'relative';
	R.baseArea = 'table';
	recUiTestX(R.tree, R);

	let root = R.root = R.uiNodes[R.tree.uid];

	if (positioning == 'random') {
		//console.log('posRandom!!!')
		initPosArray(10, 10);
		recPosRandomUiTree(R.tree.uid, R);
		delete root.params.size;
		delete root.params.pos;
	}else if (positioning == 'regular'){
		recPosQuadUiTree(R.tree.uid, R);
		delete root.params.size;
		delete root.params.pos;
	}

	return root;
}
function recUiTestX(n, R) {
	let n1 = R.uiNodes[n.uid] = jsCopy(n);
	let area = isdef(n1.uidParent) ? n1.uidParent : R.baseArea;
	n1.ui = createUiTestX(n1, area, R);

	//console.log('************ have uiNode',n.uid,n1)

	if (nundef(n1.children)) return;
	for (const ch of n1.children) {
		recUiTestX(R.rNodes[ch], R);
	}
}
function createUiTestX(n, area, R) {
	//console.log('createUiTest',n)
	if (nundef(n.type)) { n.type = inferType(n); }
	//console.log('type='+n.type)
	// R.registerNode(n);

	decodeParams(n, R, {});

	calcDirectParentAndIdUiParent(n, area, R);

	//console.log('create ui for',n.uid,n.type,n.content,n.uidParent,n.idUiParent)

	let ui;
	if (isdef(RCREATE[n.type])) ui = RCREATE[n.type](n, area, R);
	else ui = standardCreate(n, area, R);

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

	//R.setUid(n, ui);

	// let b=getBounds(ui,true);console.log('________createUi: ',n.uid,'\n',ui,'\nbounds',b.width,b.height);

	ui.id = n.uid;
	return ui;

}


//#region rTree
function makeRandomTree() {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = r.tree = addRandomNode(null, r);
	recPopulateTree(n, r, 3);
	return r;
}
function makeTree33() {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = r.tree = addRandomNode(null, r);

	let n1;
	for (let i = 0; i < 3; i++) {
		n1 = addRandomNode(n, r);
	}
	for (let i = 0; i < 3; i++) {
		addRandomNode(n1, r);
	}

	return r;
}
function makeTree332x2() {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = r.tree = addRandomNode(null, r);

	let n1;
	for (let i = 0; i < 3; i++) {
		n1 = addRandomNode(n, r);
	}
	let n2, n3;
	for (let i = 0; i < 3; i++) {
		let nChild = addRandomNode(n1, r);
		if (i == 0) n2 = nChild;
		else if (i == 2) n3 = nChild;
	}
	//n1 and n2 get each 2 children
	//console.log('uids of last parents', n2.uid, n3.uid)
	for (let i = 0; i < 2; i++) { addRandomNode(n2, r); }
	for (let i = 0; i < 2; i++) { addRandomNode(n3, r); }
	return r;
}
function makeSimplestTree() {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = r.tree = addRandomNode(null, r);
	addRandomNode(n, r);
	return r;
}
function makeSimpleTree(numChildren = 2) {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = r.tree = addRandomNode(null, r);
	for (let i = 0; i < numChildren; i++) addRandomNode(n, r);
	return r;
}
function adjustTableSize(R) {
	let d = mBy('table');
	let root = R.root;
	d.style.minWidth = root.size.w + 'px';
	d.style.minHeight = (root.size.h +4)+ 'px';
}


function addRandomNode(nParent, R, funcContent) {

	let uidParent = nParent ? nParent.uid : null;
	//console.log('setting nParent='+uidParent)
	let nChild = { uidParent: uidParent, idUiParent: uidParent, uid: getUID(), content: randomLetter() };
	nChild.content = isdef(funcContent) ? funcContent(nChild) : nChild.uid;
	//console.log(nChild.uidParent, nChild.idUiParent)
	if (nParent) {
		if (nundef(nParent.children)) nParent.children = [];
		nParent.children.push(nChild.uid);
	} else {
		//console.log('NPARENT IS NULL!!!!!!!!!!!!!!!!')
	}
	R.rNodes[nChild.uid] = nChild;
	return nChild;
}


function makeTestBoard(rows, cols, shape) {
	//shape quad
	let fieldSize = 50;
	let dims = { fieldSize: fieldSize };
	let bpos = {};

	for (let r = 0; r < rows; r++) {
		bpos[r] = {};
		y = r * fieldSize;
		for (let c = 0; c < cols; c++) {
			bpos[r][c] = { x: c * fieldSize, y: y };
		}
	}
	dims.positions = bpos;
	return dims;
}









