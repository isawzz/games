//#region Function: rParse

//Function: rParse
//source: test | main | direct
//
//context: {fStruct, options} | {spec,sdata,defs} | 
//#endregion
async function rParse(source, context) {
	R = await generateTree(source, context);
	//console.log('____________',R)
	timit.show('present');
	await presentTree(R.root, R);
	//console.log('==>uiRoot',R.root,'\nh',R.root.ui.style.height,R.root.ui.style.minHeight,R.root.ui.style.display)
	showSetSizes(R.root, R); //all sizes that have not been set are set here!
	adjustTableSize(R);
	if (ACTIVATE_UI) {
		//console.log('should activate!!!!!!')
		activateUis(R);
	}

	timit.show('done!')
	updateOutput(R);
	if (source == 'main') testEngine.verify(R);
	//outype();
	//ouparams();
	//oupos();
}

//#region Function: generateTree

// Function: generateTree
//
// depending on source (main/direct or test) generates R
//
// sets R.uidRoot, R.uiRoot=R.root, R.rRoot
//
// returns R
//
// TODO: currently, uses global var R and T (setting those)
// #endregion
async function generateTree(source, context) {
	if (source == 'test') {
		let fStruct = context.fStruct;
		let options = context.options;
		T = R = makeTableTreeX(fStruct, options);
	} else if (source == 'main' || source == 'direct') {
		//console.log('generating tree for main!!!!!!!!!')
		//supposedly context should contain spec,data,defs
		T = R = new RSG(context.spec, context.defs);//, context.sdata);
		R.initialChannels = []; //do not provide anything here or ALL tests before 04 will fail!!!!
		ensureRtree(R);
		R.baseArea = 'table';
		createStaticUi(R.baseArea, R);
		addNewlyCreatedServerObjects(context.sdata, R);
	}
	let uidRoot = R.uidRoot = R.tree.uid;
	R.rRoot = R.rNodes[uidRoot];
	R.uiRoot = R.root = R.uiNodes[uidRoot];
	return R;
}

//#region Function: presentTree

// Function: presentTree
// depending on R.presentationStrategy and root.params.sizing, size and pos set for every node
//#endregion
async function presentTree(uiRoot, R) {
	trace('___source=' + RSG_SOURCE, 'presStrategy=' + R.presentationStrategy + ', sizing=' + uiRoot.params.sizing);
	if (R.presentationStrategy == 'rec') {
		console.log('calling recPresentNode_')
		recPresentNode(uiRoot, R, uiRoot.params);
	} else if (R.presentationStrategy == 'new') {
		//console.log('NOTHING is called in presentTree')
		recMeasureOverride(R.tree.uid, R);
		//adjustTableSize_(R);
	} else if (R.presentationStrategy == 'orig') {
		if (uiRoot.params.sizing == 'sizeToContent') {
			console.log('calling recMeasureAbs, recArrangeContent, adjustTableSize_');
			recMeasureAbs(R.tree.uid, R);
			recArrangeContent(R.tree.uid, R);
			//adjustTableSize_(R);
		} else if (uiRoot.params.sizing == 'fixed') {
			//console.log('calling recMeasureArrangeFixedSizeAndPos, adjustTableSize_');
			let [minx, maxx, miny, maxy] = recMeasureArrangeFixedSizeAndPos(R.tree.uid, R);
			uiRoot.size = { w: maxx, h: maxy };
			uiRoot.ui.style.minWidth = (uiRoot.size.w + 4) + 'px';
			uiRoot.ui.style.minHeight = (uiRoot.size.h + 4) + 'px';
			//adjustTableSize_(R);
		} else {
			//console.log('calling recMeasureOverride');
			recMeasureOverride(R.tree.uid, R);
			testEngine.verify(R);
		}
	} else if (nundef(R.presentationStrategy)) {
		if (uiRoot.params.sizing == 'sizeToContent') {
			console.log('calling recMeasureAbs, recArrangeContent, adjustTableSize_');
			recMeasureAbs(R.tree.uid, R);
			recArrangeContent(R.tree.uid, R);
			//adjustTableSize_(R);
		} else if (uiRoot.params.sizing == 'fixed') {
			//console.log('calling recMeasureArrangeFixedSizeAndPos, adjustTableSize_');
			let [minx, maxx, miny, maxy] = recMeasureArrangeFixedSizeAndPos(R.tree.uid, R);
			uiRoot.size = { w: maxx, h: maxy };
			uiRoot.ui.style.minWidth = (uiRoot.size.w + 4) + 'px';
			uiRoot.ui.style.minHeight = (uiRoot.size.h + 4) + 'px';
			//adjustTableSize_(R);
		} else {
			//console.log('calling recMeasureOverride');
			recMeasureOverride(R.tree.uid, R);
		}
	} else {
		console.log('UNKNOWN presentationStrategy!!!!!!', R.presentationStrategy)
	}

}



//#region output helpers in console
function showSetSizes(nLast, R) {
	//console.log('______showSizes_______',nLast.uid);
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		if (isdef(n.size) && isdef(n.sizeNeeded)) {
			//console.log(n.uid, 'size w=' + n.size.w, 'h=' + n.size.h, 'measured', n.sizeMeasured.w, n.sizeMeasured.h, 'needed', n.sizeNeeded.w, n.sizeNeeded.h,); //R.UIS[uid]);
		} else {
			setSP(n);
			//console.log(n.uid, 'size (unset) w=' + n.size.w, 'h=' + n.size.h, 'pos', n.pos.x, n.pos.y); //R.UIS[uid]);
		}
	}
}
function showSizes(nLast, R) {
	//console.log('______showSizes_______',nLast.uid);
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		if (isdef(n.size) && isdef(n.sizeNeeded)) {
			console.log(n.uid, 'size', n.size.w, n.size.h, 'measured', n.sizeMeasured.w, n.sizeMeasured.h, 'needed', n.sizeNeeded.w, n.sizeNeeded.h,); //R.UIS[uid]);
		} else {
			setSP(n);
			console.log(n.uid, 'size', n.size.w, n.size.h, 'pos', n.pos.x, n.pos.y); //R.UIS[uid]);
		}
	}
}
function outype() {
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		console.log(n.uid + ':', n.type);
	}
}
function ouparams() {
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		console.log(n.uid + ':', n.params);
	}
}
function oupos() {
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		console.log(n.uid + ':position', n.params.position, 'size', n.size, 'pos', n.pos);
	}
}
function setSP(n) {
	let ui = n.ui;
	let b = getBounds(ui, true);
	//console.log('-------------------',b)
	n.size = { w: b.width, h: b.height };
	n.pos = { x: b.x, y: b.y };

}
function getSizing(n, R, currentSizing) {
	//console.log(n)
	return isdef(n.params) && isdef(n.params.sizing) ? n.params.sizing
		: isdef(currentSizing) ? currentSizing : R.defs.defaultSizing;
}
function trickleDown(n, R, trickle) {
	//console.log(n)
	currentSizing = trickle.sizing;
	let res = {};
	res.sizing = isdef(n.params) && isdef(n.params.sizing) ? n.params.sizing
		: isdef(currentSizing) ? currentSizing : R.defs.defaultSizing;
	return res;
}




