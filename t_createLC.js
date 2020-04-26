function createLC_dep(n, area, R) {
	// n ist already a copy of the node to be created

	// R.registerNode(n);
	//if (nundef(n.params)) n.params = {};

	//if (n.name=='hallo') console.log(n);

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

		//EXPERIMENTAL FIX!!!!!!!!!!!!!!! ==> wird jetzt in gen14 gemacht!!!
		//replaceChildrenBySpecNodes(n, R); //why expand here? sollte das nicht gemacht sein?
		//return;

		n.children = createChi(n, R);

		//console.log(n)
		adjustContainerLayout(n, R);
	}

	//das wird spaeter generalisiert auf alle types
	else if (isGridType(n.type)) {

		//console.log('board',jsCopy(n));
		detectBoardOidAndType(n, R);
		//detectBoardParams(n, R); // ==> wird jetzt in generalGrid gemacht!

		//createBoard ist statt createUI, und damit muss board+alle members selbst decodeParams machen!!!
		createBoard(n, area, R); // *** calling hexGrid or quadGrid!!!!!!!!!!!!!! ***
		
	}

	//leaf
	else if (isLeafType(n.type)) {

		createUi(n, area, R);

	}
	return n;
}
