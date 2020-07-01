const MAXNODES = 5;
// var iNode=0;
function makeUiNodeFromRNode(n, R) {
	let n1 = jsCopy(n);
	//console.log('00000000000000000000000000make uiNode for rNode',n)
	//n1 brauch einen type (macht er eh default!)
	//n1 braucht eine ui
	let area = isdef(n1.uidParent) ? n1.uidParent : R.baseArea;
	//console.log('--- calling createUiTest area='+area)
	n1.ui = createUiTest(n1, area, R);
	R.uiNodes[n1.uid] = n1;
	//console.log('===>',n1)
	return n1;
}



function reArrange(R) {
	recMeasureOverride(R.tree.uid, R);
	recPositions(R.tree.uid, R);
}

function modeNodeBy(n, dx, dy, R) {
	n.rcenter.x + dx;
	n.rcenter.y += dy;
	n.acenter.x += dx;
	n.acenter.y += dy;
	n.rpos.left += dx;
	n.rpos.top += dy;
	n.apos.left += dx;
	n.apos.top += dy;
	let uidParent = n.idUiParent ? n.idUiParent : R.baseArea;
	let uiParent = mBy(uidParent);
	let ui = n.ui;
	if (uidParent != R.baseArea) mPosAbs(uiParent);
	mPosAbs(ui);
	// let parentCssPosition = uiParent.style.position;
	// console.log('css position of parent',parentCssPosition);
	// if (parentCssPosition!='relative'){uiParent.style.position='relative';}
	// let cssPosition = ui.style.position;
	// console.log('css position',cssPosition);
	// if (cssPosition!='relative'){ui.style.position='relative';}
	if (isdef(ui.style.left)) {
		let x = firstNumber(ui.style.left);
		ui.style.left = (x + dx) + 'px';
	} else {
		ui.style.left = dx + 'px';
	}
	//ui.style.left = n.rpos.left+'px';
	//ui.style.top = n.rpos.top+'px';
	//ui.style.left = n.rpos.left+'px';
	//ui.style.top = n.rpos.top+'px';
}
function setRCenter(n, x, y, R) {
	let dx = x - n.rcenter.x;
	let dy = y - n.rcenter.y;
	modeNodeBy(n, dx, dy, R);
}

function addRandomChildren(n, R) {
	let num = randomNumber(1, 4);
	for (let i = 0; i < num; i++) {
		addRandomNode(n, R);
	}
	return n;
}
function makeBaseDiv() {
	let d = mBy('table');
	d.style.position = 'relative';
	d.classList.remove('flexWrap');
	let d1 = mDiv(d);
	d1.id = 'basediv';
	d1.style.position = 'relative';
	d1.style.display = 'inline-block';
	d1.style.backgroundColor = 'blue';

	// let b=getBounds(d1);
	// console.log(b.width,b.height);
	// d1.style.borderRadius='4px';
	// b=getBounds(d1);
	// console.log(b.width,b.height);
	return d1;
}
function randomLetter() {
	let letters = 'ABCDEFGHIJKLMOPQRSTUVWXZ';
	return chooseRandom(letters);
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


//#region test versions of functions
function createUiTest(n, area, R) {
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
function recUiTest(n, R) {
	//console.log('hooooooooooooooo')
	let n1 = R.uiNodes[n.uid] = makeUiNodeFromRNode(n, R);
	//console.log('************ have uiNode',n.uid,n1)
	if (nundef(n1.children)) return;
	//console.log(n1.children, n1.children.map(x=>R.rNodes[x]))
	for (const ch of n1.children) {
		recUiTest(R.rNodes[ch], R);
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











