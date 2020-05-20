function createUi(n, area, R) {

	if (nundef(n.type)) { n.type = inferType(n); }

	R.registerNode(n);

	decodeParams(n, R, {}); //defParams);

	//console.log(n,n.type)
	let ui = RCREATE[n.type](n, mBy(area), R);

	if (nundef(n.uiType)) n.uiType = 'd'; // d, g, h (=hybrid)

	if (n.uiType == 'NONE') return ui;


	//if (n.uiType != 'g') applyCssStyles(n.uiType == 'h'?mBy(n.uidStyle):ui, n.cssParams);
	applyCssStyles(n.uiType == 'h' ? mBy(n.uidStyle) : ui, n.cssParams);
	// else{
	// 	console.log(ui);
	// 	ui.style.filter='grayscale(0.5)';

	// }
	// if (n.uiType == 'h') {
	// 	// console.log('NOT APPLYING CSS STYLES!!!', n.uid, n.uiType, n.params)
	// 	applyCssStyles(mBy(n.uidStyle), n.cssParams);
	// } else {
	// 	applyCssStyles(ui, n.cssParams);
	// }

	//TODO: hier muss noch die rsg std params setzen (same for all types!)
	if (!isEmpty(n.stdParams)) {
		//console.log('rsg std params!!!', n.stdParams);
		switch (n.stdParams.display) {
			case 'if_content': if (!n.content) hide(ui); break;
			case 'hidden': hide(ui); break;
			default: break;
		}
	}

	R.setUid(n, ui);
	return ui;

}

function adjustContainerLayout(n, R) {


	n.adirty = false;

	//console.log(n);return;
	if (n.type == 'grid') {
		console.log('adjustContainerLayout! ja grid kommt auch hierher!!!', n);
		return;
	}

	if (n.type == 'hand') { layoutHand(n); return; }
	//if (n.type == 'hand') { sortCards(n); return; }

	//console.log('==>', n)
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
		//if (n.children[i].uid == '_19') console.log(jsCopy(n.children[i]));
		let d = R.uiNodes[n.children[i]].ui;
		mFlexChildSplit(d, split);

		if (reverseSplit) { split = 1 - split; }
	}
}


