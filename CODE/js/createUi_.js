function createUi(n, area, R) {

	if (nundef(n.type)) { n.type = inferType(n); }

	R.registerNode(n);

	decodeParams(n, R, {}); //defParams);

	//console.log(n,n.type)
	let ui = RCREATE[n.type](n, mBy(area), R);

	if (nundef(n.uiType)) n.uiType = 'd'; // d, g, h (=hybrid)

	if (n.uiType == 'NONE') return ui;

	//console.log('\ntype',n.type,'\ncssParams',n.cssParams,'\nparams',n.params);
	if (n.type != 'invisible') applyCssStyles(n.uiType == 'h' ? mBy(n.uidStyle) : ui, n.cssParams);
	//applyCssStyles(n.uiType == 'h' ? mBy(n.uidStyle) : ui, n.cssParams);

	//TODO: hier muss noch die rsg std params setzen (same for all types!)
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
		//if (n.children[i].uid == '_19') console.log(jsCopy(n.children[i]));
		let d = R.uiNodes[n.children[i]].ui;
		mFlexChildSplit(d, split);

		if (reverseSplit) { split = 1 - split; }
	}
}

function calcRays(n, gParent, R) {
	//console.log(n);
	if (n.params.dray) {
		let ui = n.ui;
		let buid = n.uidParent;
		let b = R.rNodes[buid];
		//let gParent = R.uiNodes[buid].ui;
		let bui = R.UIS[buid]
		let size = 20;
		//console.log('===>size',size,buid,b,'\nbui',bui);
		let fsp = bui.params.field_spacing;
		//console.log('fieldSpacing',fsp);
		let info = n.info;//R.rNodes[n.uid].info;
		//console.log('info',info,'\nn',n);
		let x = info.x * fsp;
		let y = info.y * fsp;
		let w = size;
		let h = size;
		let D = distance(0, 0, x, y);
		//console.log(x,y,w,h,D);
		let p = n.params.dray;
		let rel = p.rel;

		//console.log('haaaaaaaaaaaaaaaaalllllllllllllllooooooooooooo')
		let nanc = n;//R.rNodes(n.uidParent);
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

		//console.log('------------------------>nanc', nanc);
		let by = p.by;
		nby = isNumber(by) ? by : firstNumber(by);
		if (isString(by) && by[by.length - 1] == '%') {
			//let n=firstNumber(by);
			nby = nby * size / 100;
		}
		nby = 22;
		let elem = isdef(nanc) ? nanc : rel == 'parent' ? gParent : ui;
		let norm = nby / D;
		let xdisp = x * norm;//nby*norm;//*x;
		let ydisp = y * norm; //nby*norm;//*y;
		//console.log(elem,ui)
		//console.log(n)
		//console.log(elem.id, R.uiNodes[gParent.id])

		//console.log('verschiebe label um',xdisp,ydisp,'\nnorm',norm,'\nlabel',n.label);
		let txt = n.label.texts;
		let el = n.label.texts[0].el;
		el.setAttribute('x', xdisp)
		el.setAttribute('y', ydisp)
		//console.log(n.label.texts[0].el)
		//console.log('txt elem',txt);

		//setAttribute(txttransform: translate(10px, 10px);

		//gPos(txt, x,y);// xdisp, ydisp);
		//need to compute center of parent relative to center of this elem!
		//center of parent is 0,0
		//center of this elem is: 
		// need to computer size of this elem

	}

}

