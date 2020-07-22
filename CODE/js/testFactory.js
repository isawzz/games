//#region Function: makeTableTreeX

//Function: makeTableTreeX
//fStruct ... function that produces a (fake) R = {uiNodes, rNodes, defs, root, uiRoot, rRoot}
//
//options ... multiple options
//
//example: makeTableTreeX(makeSimplestTree, options: { fType: typeEmpty })
//#endregion
function makeTableTreeX(fStruct, { presentationStrategy, fContent, fType, autoType, positioning = 'none', params } = {}) {
	R = fStruct(); //gibt jedem node manual00 type!

	// rtree is modified
	if (isdef(params)) { for (const uid in params) { R.rNodes[uid].params = params[uid]; } }
	if (isdef(autoType)) {
		for (const uid in R.rNodes) {
			let v = R.rNodes[uid];
			let val = autoType;
			if (!val) delete v.type; else v.type = val;
		}
	}
	if (isdef(fType)) {
		for (const uid in R.rNodes) {
			let v = R.rNodes[uid];
			let val = fType(v, R);
			if (!val) delete v.type; else v.type = val;
		}
	}
	if (isdef(fContent)) {
		for (const uid in R.rNodes) {
			let v = R.rNodes[uid];
			let val = fContent(v, R);
			if (!val) delete v.content; else v.content = val;
		}
	}

	//uitree is constructed
	let d = mBy('table');
	d.style.position = 'relative';
	R.baseArea = 'table';
	recUiTestX(R.tree, R);

	let root = R.uiNodes[R.tree.uid];

	//uitree is modified adding size,pos to uiNode.params.size (w,h) ,uiNode.params.pos (x,y)
	if (positioning == 'random') {
		recPosRandomUiTreeX(R.tree.uid, R, { wmax: 6, hmax: 4, xmax: 50, ymax: 25, granularity: 10 });
		delete root.params.size;
		delete root.params.pos;
	} else if (positioning == 'regular') {
		recPosRegularUiTree(R.tree.uid, R);
		delete root.params.size;
		delete root.params.pos;
	} else {
		//console.log('positions NOT set',iTEST,params)
	}

	//console.log('sizing of root is',root.params.sizing)
	R.presentationStrategy = isdef(presentationStrategy) ? presentationStrategy : R.defs.defaultPresentationStrategy;
	return R;
}

//#region rTree
function addManual00Node(nParent, R, funcContent) {

	let uidParent = nParent ? nParent.uid : null;
	//console.log('setting nParent='+uidParent)
	let nChild = { uidParent: uidParent, idUiParent: uidParent, uid: getUID(), type: 'manual00', content: randomLetter() };
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
function makeHugeBoardInBoardOld(num, rowsPerBoard) {
	let r = makeTreeNNEach(num, num);
	return r;
	let params = { contentwalign: 'center', contenthalign: 'center', orientation: 'w', rows: rowsPerBoard, cols: num / rowsPerBoard };
	//need uid of each child of root
	let uidRoot = r.tree.uid;
	let root = r.rNodes[uidRoot];
	root.params = params;
	for (const ch of root.children) {
		let n = r.rNodes[ch];
		n.params = params;
	}
	return r;

}
function makeHugeBoardInBoard(num, rowsPerBoard) {
	let r = makeTreeNNEach(num, num);

	let params = { contentwalign: 'center', contenthalign: 'center', orientation: 'w', rows: rowsPerBoard, cols: num / rowsPerBoard };
	//need uid of each child of root
	let uidRoot = r.tree.uid;
	let root = r.rNodes[uidRoot];
	root.params = params;
	for (const ch of root.children) {
		let n = r.rNodes[ch];
		n.params = params;
	}
	return r;

}
function makeTreeNNEach(num1, num2) {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = r.tree = addManual00Node(null, r);

	for (let i = 0; i < num1; i++) {
		let n1 = addManual00Node(n, r);
		for (let j = 0; j < num2; j++) {
			addManual00Node(n1, r);
		}
	}

	return r;
}
function makeTreeNN(num1, num2) {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = r.tree = addManual00Node(null, r);

	let n1;
	for (let i = 0; i < num1; i++) {
		n1 = addManual00Node(n, r);
	}
	for (let i = 0; i < num2; i++) {
		addManual00Node(n1, r);
	}

	return r;
}
function makeTree33() {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = r.tree = addManual00Node(null, r);

	let n1;
	for (let i = 0; i < 3; i++) {
		n1 = addManual00Node(n, r);
	}
	for (let i = 0; i < 3; i++) {
		addManual00Node(n1, r);
	}

	return r;
}
function makeTree332x2() {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = r.tree = addManual00Node(null, r);

	let n1;
	for (let i = 0; i < 3; i++) {
		n1 = addManual00Node(n, r);
	}
	let n2, n3;
	for (let i = 0; i < 3; i++) {
		let nChild = addManual00Node(n1, r);
		if (i == 0) n2 = nChild;
		else if (i == 2) n3 = nChild;
	}
	//n1 and n2 get each 2 children
	//console.log('uids of last parents', n2.uid, n3.uid)
	for (let i = 0; i < 2; i++) { addManual00Node(n2, r); }
	for (let i = 0; i < 2; i++) { addManual00Node(n3, r); }
	return r;
}
function makeSimplestTree() {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = r.tree = addManual00Node(null, r);
	addManual00Node(n, r);
	return r;
}
function makeSimpleTree(numChildren = 2) {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = r.tree = addManual00Node(null, r);
	for (let i = 0; i < numChildren; i++) addManual00Node(n, r);
	return r;
}
function makeRoot() {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	r.tree = addManual00Node(null, r);
	return r;
}

//#region uitree
function recUiTestX(n, R) {
	let n1 = R.uiNodes[n.uid] = jsCopy(n);
	let area = isdef(n1.uidParent) ? n1.uidParent : R.baseArea;
	n1.ui = createUiTestX(n1, R, area);

	//console.log('************ have uiNode',n.uid,n1)

	if (nundef(n1.children)) return;
	for (const ch of n1.children) {
		recUiTestX(R.rNodes[ch], R);
	}
}
function createUiTestX(n, R, area) {
	//console.log('createUiTestX_',n)
	if (nundef(n.type)) { n.type = inferType(n); }

	//n.type = 'manual01';// ^^^
	//console.log(n)

	//console.log('type='+n.type,DEFS)
	// R.registerNode(n);

	decodeParams(n, R, {});

	calcDirectParentAndIdUiParent(n, R, area);

	//console.log('create ui for',n.uid,n.type,n.content,n.uidParent,n.idUiParent)

	let ui;
	if (isdef(RCREATE[n.type])) ui = RCREATE[n.type](n, R, area);
	else ui = mDefault(n, R, area);

	if (nundef(n.uiType)) n.uiType = 'd'; // d, g, h (=hybrid)

	if (n.uiType == 'NONE') return ui;

	if (n.uiType != 'childOfBoardElement') {
		if (isBoard(n.uid, R)) { delete n.cssParams.padding; }
		applyCssStyles(n.uiType == 'h' ? mBy(n.uidStyle) : ui, n.cssParams);
	}
	//console.log(n.uid,n.params,n.cssParams)

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
function recPosRandomUiTreeX(uid, R, context) {
	let n = R.uiNodes[uid];
	let gran = context.granularity;
	n.params.size = { w: randomNumber(1, context.wmax) * gran, h: randomNumber(1, context.hmax) * gran };
	n.params.pos = { x: randomNumber(1, context.xmax) * gran, y: randomNumber(1, context.ymax) * gran }
	n.params.sizing = 'fixed';
	//console.log('pos and size set:', uid, n)
	if (nundef(n.children)) return;
	for (const ch of n.children) { recPosRandomUiTreeX(ch, R, context); }
}
function recPosRegularUiTree(uid, R) {
	let n = R.uiNodes[uid];
	n.params.sizing = 'fixed';
	if (nundef(n.children)) return;
	for (const ch of n.children) { recPosRegularUiTree(ch, R); }

	let num = n.children.length;
	if ([2, 4, 6, 8, 9, 12, 16, 20].includes(num)) arrangeChildrenAsQuad(n, R);
	else if (num > 1 && num < 10) arrangeChildrenAsCircle(n, R);
}
function arrangeChildrenAsQuad(n, R) {
	//console.log('arrangeChildrenAsQuad', n.children);
	let children = n.children.map(x => R.uiNodes[x]);


	let num = children.length;
	let rows = Math.ceil(Math.sqrt(num));
	let cols = Math.floor(Math.sqrt(num));
	let size = 20;
	let padding = 4;
	let i = 0;

	//calc max size of children first! set size accordingly!
	for (const n1 of children) {
		let b = getBounds(n1.ui);
		//console.log('uid', n1.uid, 'w', b.width)
		let newMax = Math.max(Math.max(b.width, b.height), size);
		if (newMax > size) {
			//console.log('got new max:', newMax);
			size = newMax;
		}
	}

	let [y0, wTitle] = calcParentContentYOffsetAndWidth(n, padding);

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			let n1 = children[i]; i += 1;
			n1.params.size = { w: size - 1, h: size - 1 };
			n1.params.pos = { x: padding + r * size, y: y0 + c * size };
			n1.params.sizing = 'fixed';

		}
	}

}
function arrangeChildrenAsCircle(n, R) {
}


//#region random rtree
const MAXNODES = 5; //max amount of nodes in rTree (not exact!)

function makeRandomTree() {
	let r = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = r.tree = addManual00Node(null, r);
	recPopulateTree(n, r, 3);
	return r;
}
function addRandomChildren(n, R) {
	let num = randomNumber(1, 4);
	for (let i = 0; i < num; i++) {
		addManual00Node(n, R);
	}
	return n;
}
function recPopulateTree(t, R, levels) {
	//console.log('tree',t)

	if (levels > 0) {
		addRandomChildren(t, R);
		if (Object.keys(R.rNodes).length >= MAXNODES) { console.log('MAXNODES REACHED!!!'); return; }

		for (const id of t.children) {
			if (chooseRandom([true, false])) {
				recPopulateTree(R.rNodes[id], R, levels - 1);
			}
		}
	}
}
function randomLetter() {
	let letters = 'ABCDEFGHIJKLMOPQRSTUVWXZ';
	return chooseRandom(letters);
}
//#endregion









