function createUi(n, area, R) {

	if (nundef(n.type)) { n.type = inferType(n); }

	R.registerNode(n);

	decodeParams(n, R, {}); 

	let ui = RCREATE[n.type](n, area, R);

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

