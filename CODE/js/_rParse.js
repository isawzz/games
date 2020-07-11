//Function: rParse
//source: test | main
//
//context: {fStruct, options} | {spec,sdata,defs}
async function rParse(source, context) {
	R = await generateTree(source, context);
	timit.show('present');
	await presentTree(R.root, R);
	consout('==>uiRoot',R.root,'\nh',R.root.ui.style.height,R.root.ui.style.minHeight,R.root.ui.style.display)
	showSetSizes(R.root,R); //all sizes that have not been set are set here!
	adjustTableSize(R);
	timit.show('done!')
	updateOutput(R);
	//outype();
	//ouparams();
	//oupos();
}
async function generateTree(source, context) {
	if (source == 'test') {
		let fStruct = context.fStruct;
		let options = context.options;
		T = R = makeTableTreeX(fStruct, options);
	} else if (source == 'main') {
		//supposedly context should contain spec,data,defs
		T = R = new RSG(context.spec, context.defs);//, context.sdata);
		R.initialChannels = []; //do not provide anything here or ALL tests before 04 will fail!!!!
		ensureRtree(R);
		R.baseArea = 'table';
		createStaticUi(R.baseArea, R);
		addNewlyCreatedServerObjects(context.sdata, R);
	}
	let uidRoot = R.tree.uid;
	R.rRoot = R.rNodes[uidRoot];
	R.uiRoot = R.root = R.uiNodes[uidRoot];
	return R;
}
function setSP(n) {
	let ui = n.ui;
	let b = getBounds(ui, true);
	consout('-------------------',b)
	n.size = { w: b.width, h: b.height };
	n.pos = { x: b.x, y: b.y };

}
function getSizing(n, R, currentSizing) {
	//console.log(n)
	return isdef(n.params) && isdef(n.params.sizing) ? n.params.sizing
		: isdef(currentSizing) ? currentSizing : R.defs.defaultSizing;
}
/* Function: presentTree
depending on R.presentationStrategy and root.params.sizing, size and pos set for every node
*/
async function presentTree(uiRoot, R) {
	consout('__________________presentationStrategy: ' + R.presentationStrategy+', root-sizing: ' + uiRoot.params.sizing);
	if (R.presentationStrategy == 'rec') {
		consout('calling recPresentNode')
		recPresentNode(uiRoot, R, getSizing(uiRoot, R));
	} else if (R.presentationStrategy == 'new') {
		consout('NOTHING is called in presentTree')
		//adjustTableSize_(R);
	} else {
		if (uiRoot.params.sizing == 'sizeToContent') {
			consout('calling recMeasureAbs, recArrangeSize, adjustTableSize_');
			recMeasureAbs(R.tree.uid, R);
			recArrangeContent(R.tree.uid, R);
			//adjustTableSize_(R);
		} else if (uiRoot.params.sizing == 'fixed') {
			consout('calling recMeasureArrangeFixedSizeAndPos, adjustTableSize_');
			let [minx, maxx, miny, maxy] = recMeasureArrangeFixedSizeAndPos(R.tree.uid, R);
			uiRoot.size = { w: maxx, h: maxy };
			uiRoot.ui.style.minWidth = (uiRoot.size.w + 4) + 'px';
			uiRoot.ui.style.minHeight = (uiRoot.size.h + 4) + 'px';
			//adjustTableSize_(R);
		} else {
			consout('calling recMeasureOverride');
			recMeasureOverride(R.tree.uid, R);
			testEngine.verify(R);
		}
	}
	
}
function recPresentNode(n, R, sizing) {
	consout('sizing', n.uid, sizing);

	if (nundef(n.children)) return;
	for (const ch of n.children) {
		let n1 = R.uiNodes[ch];
		recPresentNode(n1, R, getSizing(n1, R, sizing));
	}
}

//#region output helpers in console
function showSetSizes(nLast, R) {
	//consout('______showSizes_______',nLast.uid);
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		if (isdef(n.size) && isdef(n.sizeNeeded)) {
			consout(n.uid, 'size', n.size.w, n.size.h, 'measured', n.sizeMeasured.w, n.sizeMeasured.h, 'needed', n.sizeNeeded.w, n.sizeNeeded.h,); //R.UIS[uid]);
		}else{
			setSP(n);
			consout(n.uid, 'size', n.size.w, n.size.h,'pos',n.pos.x,n.pos.y); //R.UIS[uid]);
		}
	}
}
function showSizes(nLast, R) {
	//consout('______showSizes_______',nLast.uid);
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		if (isdef(n.size) && isdef(n.sizeNeeded)) {
			consout(n.uid, 'size', n.size.w, n.size.h, 'measured', n.sizeMeasured.w, n.sizeMeasured.h, 'needed', n.sizeNeeded.w, n.sizeNeeded.h,); //R.UIS[uid]);
		}else{
			setSP(n);
			consout(n.uid, 'size', n.size.w, n.size.h,'pos',n.pos.x,n.pos.y); //R.UIS[uid]);
		}
	}
}
function outype() {
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		consout(n.uid + ':', n.type);
	}
}
function ouparams() {
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		consout(n.uid + ':', n.params);
	}
}
function oupos() {
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		consout(n.uid + ':position', n.params.position,'size',n.size,'pos',n.pos);
	}
}




