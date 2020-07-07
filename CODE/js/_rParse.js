async function generateTree(source, context) {
	if (source == 'test') {
		let fStruct = context.fStruct;
		let options = context.options;
		T = R = makeTableTreeX(fStruct, options);
	} else if (source == 'main') {
		//supposedly context should contain spec,data,defs
		let sp = context.spec;
		let defs = context.defs;
		let sdata = context.sdata;
		T = R = new RSG(sp, defs, sdata);
		R.initialChannels = []; //do not provide anything here or ALL tests before 04 will fail!!!!
		ensureRtree(R);
		R.baseArea = 'table';
		createStaticUi(R.baseArea, R);
		addNewlyCreatedServerObjects(sdata, R);
	}
	let uidRoot = R.tree.uid;
	R.rRoot = R.rNodes[uidRoot];
	R.uiRoot = R.root = R.uiNodes[uidRoot];
	return R;
}
async function presentTree(root, R) {
	if (root.params.sizing == 'sizeToContent') {
		console.log('hier!!! bei recMeasureAbs')
		recMeasureAbs(R.tree.uid, R);

		recArrangeContent(R.tree.uid,R);

		adjustTableSize(R);
	} else if (root.params.sizing == 'fixed') {
		let [minx, maxx, miny, maxy] = recMeasureArrangeFixedSizeAndPos(R.tree.uid, R);
		root.size = { w: maxx, h: maxy };
		root.ui.style.minWidth = (root.size.w + 4) + 'px';
		root.ui.style.minHeight = (root.size.h + 4) + 'px';
		adjustTableSize(R);
	} else {
		recMeasureOverride(R.tree.uid, R);
		testEngine.verify(R);

	}
	updateOutput(R);


}

async function rParse(source, context) {
	R = await generateTree(source, context);
	// recMeasureOverride(R.tree.uid, R);
	// adjustTableSize(R);
	// updateOutput(R);
	// testEngine.verify(R);
	await presentTree(R.root,R);
}










