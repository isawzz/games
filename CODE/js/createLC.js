function createLC(n, area, R) {
	// n ist already a copy of the node to be created

	R.registerNode(n);

	let content = n.content;

	if (isContainerType(n.type)) {

		createUi(n, area, R);

		//pass n.content as pool to container content
		if (isdef(content) && isList(content)) {
			let prop = RCONTAINERPROP[n.type];
			let n1 = n[prop];
			n1.pool = content; //intersect!
			//console.log('JETZT!!!', n.pool)
		}

		replaceChildrenBySpecNodes(n, R); //why expand here? sollte das nicht gemacht sein?

		n.children = createChi(n, R);

		adjustContainerLayout(n, R);
	}

	//das wird spaeter generalisiert auf alle types
	else if (isGridType(n.type)) {

		//console.log('board',jsCopy(n));
		detectBoardOidAndType(n, R);
		detectBoardParams(n, R);
		createBoard(n, area, R); // *** calling hexGrid or quadGrid!!!!!!!!!!!!!! ***
		//console.log('board',jsCopy(n));
		n.children = [];
		console.log('_______________');
		for (const name of ['fields', 'edges', 'corners']) {
			let group = n.bi[name];
			for (const fid in group) {
				let n1 = group[fid]; //ist bereits mit indiv params gemerged!!!
				n1.uiType = 'g';
				R.registerNode(n1);
				R.setUid(n1);
				n.children.push(n1);
				n1.content = calcContent(n1.o, n1.data);
				if (n1.type == 'info') { createLabel(n1, R); }
			}
		}
	}

	//leaf
	else if (isLeafType(n.type)) {

		createUi(n, area, R);

	}
	return n;
}






