//#region sample R = {tree,uiNodes,rNodes} construction (see testData.js)
function makeTableTreeX(fStruct, { positioning = 'none', rootContent = true, extralong = false, params, data } = {}) {
	//rtree is constructed
	console.log('test',iTESTSERIES,iTEST,'params',params)
	R = fStruct();
	if (!rootContent) delete R.tree.content; else if (extralong) R.tree.content = 'hallo das ist ein besonders langer string!!!';

	let r1 = normalizeRTree(R);
	let num = firstNumber(R.tree.uid);
	for (const uid in r1) {
		r1[uid].realUid = '_' + (firstNumber(uid) + num);
	}
	//rtree is modified by params,content
	if (isdef(params)) {
		for (const uid in params) {
			let realUid = r1[uid].realUid;
			let n = R.rNodes[realUid];
			n.params = params[uid];
			//if (n.params.orientation) console.log('===>',n.uid,n.params.orientation)
		}
	}
	if (isdef(data)) {
		for (const uid in data) {
			let realUid = r1[uid].realUid;
			let n = R.rNodes[realUid];
			n.content = data[uid];
		}
	}

	//uitree is constructed
	let d = mBy('table');
	//clearElement(d);
	d.style.position = 'relative';
	R.baseArea = 'table';
	recUiTestX(R.tree, R);

	let root = R.root = R.uiRoot = R.uiNodes[R.tree.uid];
	R.rRoot = R.rNodes[R.tree.uid];

	//uitree is modified adding size,pos to uinode.params.size (w,h) ,uinode.params.pos (x,y)
	if (positioning == 'random') {
		recPosRandomUiTreeX(R.tree.uid, R, { wmax: 6, hmax: 4, xmax: 50, ymax: 25, granularity: 10 });
		delete root.params.size;
		delete root.params.pos;
	} else if (positioning == 'regular') {
		recPosQuadUiTree(R.tree.uid, R);
		delete root.params.size;
		delete root.params.pos;
	} else {
		//console.log('positions NOT set',iTEST,params)
	}

	return R; 
}

//#region rTree
function addManual00Node(nParent, R, funcContent) {

	let uidParent = nParent ? nParent.uid : null;
	//console.log('setting nParent='+uidParent)
	let nChild = { uidParent: uidParent, idUiParent: uidParent, uid: getUID(), type:'manual00', content: randomLetter() };
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

//#region uitree
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
	//console.log('createUiTestX_',n)
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
function recPosQuadUiTree(uid, R) {
	let n = R.uiNodes[uid];
	n.params.sizing = 'fixed';
	if (nundef(n.children)) return;
	for (const ch of n.children) { recPosQuadUiTree(ch, R); }

	let num = n.children.length;
	if ([4, 6, 8, 9, 12, 16, 20].includes(num)) arrangeChildrenAsQuad(n, R);
	else if (num > 1 && num < 10) arrangeChildrenAsCircle(n, R);
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









