async function rParse(source, context) {
	if (source == 'test') {
		let fStruct = context.fStruct;
		let options = context.options;
		let rTemp = makeTableTreeX(fStruct, options);
		let root = rTemp.root;


		//hier habe einen fertigen uitree / R gesetzt

		if (root.params.sizing == 'sizeToContent') {
			recMeasureAbs(rTemp.tree.uid, rTemp);
			updateOutput(rTemp);
			adjustTableSize(rTemp);
		} else if (root.params.sizing == 'fixed') {
			let [minx, maxx, miny, maxy] = recMeasureArrangeFixedSizeAndPos(rTemp.tree.uid, rTemp);
			root.size = { w: maxx, h: maxy };
			root.ui.style.minWidth = (root.size.w + 4) + 'px';
			root.ui.style.minHeight = (root.size.h + 4) + 'px';
			adjustTableSize(rTemp);
		}
	} else if (source == 'main') {
		//supposedly context should contain spec,data,defs


		let sp = context.spec;
		let defs = context.defs;
		let sdata = context.sdata;
		// await testEngine.init(defs, sdata, TEST_SERIES);

		// [sp, defs, sdata] = [testEngine.spec, testEngine.defs, testEngine.sdata];
		T = R = new RSG(sp, defs, sdata);

		R.initialChannels = []; //do not provide anything here or ALL tests before 04 will fail!!!!
		ensureRtree(R);
		R.baseArea = 'table';
		console.log(R)
		createStaticUi(R.baseArea, R);
		addNewlyCreatedServerObjects(sdata, R);

		let uidRoot=R.tree.uid;
		R.rRoot=R.rNodes[uidRoot];
		R.uiRoot=R.root=R.uiNodes[uidRoot];

		//hier auch
		console.log('R',R)

		recMeasureOverride(R.tree.uid, R);

		updateOutput(R);

		testEngine.verify(R);
	} else 
	{ 

	}
	return R;
}











