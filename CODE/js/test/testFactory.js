//#region sample R
function makeTableTree(fStruct, rootContent = true, extralong = false) {
	R = fStruct();
	if (!rootContent) delete R.tree.content; else if (extralong) R.tree.content = 'hallo das ist ein besonders langer string!!!';
	let d = mBy('table');
	d.style.position = 'relative';
	R.baseArea = 'table';
	recUiTest(R.tree, R);
	let root = R.root = R.uiNodes[R.tree.uid];
	//root.ui.position='relative';
	return root;
}
function makeTableTreeX(fStruct, { rootContent = true, extralong = false, params }) {
	R = fStruct();
	if (!rootContent) delete R.tree.content; else if (extralong) R.tree.content = 'hallo das ist ein besonders langer string!!!';

	if (isdef(params)) {
		for (const uid in params) {
			let n = R.rNodes[uid];
			n.params = params[uid];
		}
	}

	//construct ui
	let d = mBy('table');
	d.style.position = 'relative';
	R.baseArea = 'table';
	recUiTest(R.tree, R);
	let root = R.root = R.uiNodes[R.tree.uid];
	//root.ui.position='relative';


	return root;
}

function mixedOr2() {
	let params = { '_1': { bg: 'black',orientation:'v' },
	'_4': { bg: 'inherit',orientation:'v' }
 };
	let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: false, params: params });
	return root;
}
function mixedOrientation() {
	let root = makeTableTree(makeTree33);
	//_1 soll type v bekommen!
	root.params.orientation = 'v';
	return root;
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
	console.log('uids of last parents', n2.uid, n3.uid)
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
	console.log('size of root is:', root.size)
	d.style.minHeight = root.size.h + 25 + 'px';

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










