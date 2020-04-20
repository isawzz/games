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

		replaceChildrenBySpecNodes(n,R); //why expand here? sollte das nicht gemacht sein?

		n.children = createChi(n, R);

		adjustContainerLayout(n,R);
	}

	//das wird spaeter generalisiert auf alle types
	else if (isGridType(n.type)){
		//weiss ich den context von n?		//ja, alle nodes haben pool bzw oid
		//or, detect board id+type from sData //or already did that in prev pass
		console.log('board node:',n,'oid:'+n.oid);

		//detect n.oid if not set!
		let sd = R.sData;//TODO!!! eigentlich muss ich hier _source nehmen!!!
		if (!n.oid) n.oid = detectBoardObject(sDasdta);
		let oBoard = sd[n.oid]; 
		//console.log('board server object',oBoard);
		if (!n.boardType) n.boardType = detectBoardType(oBoard,sd);
		//console.log(R.sData);
		// console.log('first board oid is',detectBoardObject(R.sData));
		//n.boardType = detectBoardType(oBoard,sd);
		//console.log('board is of type',n.boardType)

		
		// *** calling hexGrid or quadGrid!!!!!!!!!!!!!! ***
		let boardInfo = window[n.boardType](R.sData[n.oid],sd);
		console.log(boardInfo);
		let bi=boardInfo.layoutInfo;

		generalGrid(bi.board, bi.fields, bi.corners, bi.edges, area, agRect);

		// let lay=boardInfo.layoutInfo;
		// n.rsgInfo=boardInfo;

		// //set params for board!
		// //let boardDefs = R.defs.grid;
		// //console.log(R.defs.grid, R.defs[n.boardType])
		// let boardDefs = deepmerge(R.defs.grid,R.defs[n.boardType]);
		// //console.log(boardDefs);
		// if (isdef(n.params)) boardDefs = deepmerge(boardDefs,n.params);
		// n.params = boardDefs.params;
		// //console.log('board params:',n.params);

		// //einziges ding: muss schauen ob fuer childnodes spec habe! => here come loose spec nodes!!!
		// //das seh ich aber doch eh in sData[oid]._rsg
		// //mach erstmal die fields
		// //muss erstmal board ui machen!!!
		
		// makeBoardUi(n,area,R); //adds a board ui, n.ui.uid is G container that will host board elements!!!!
		// //console.log('board params:',n.params);

		// //achtung!!! NO NEED to jsCopy n!!!!!
		// //das IST bereits eine instance die registered ist mit unique id!!!
		// //let nBoard = n; 
		// n.children = [];
		// //console.log(lay)
		// for(const oid in lay.fields){
		// 	let oField = sd[oid];
		// 	let fieldInfo = lay.fields[oid].info;

		// 	//ich mach jetzt das was normalerweise createChi macht!!!
		// 	let n1={boardMember:'f', oid:oid, parentUid:n.uid, rsgInfo:fieldInfo};
		// 	//console.log('WIEEEEEEEEEEEEE',n.params);
		// 	//console.log('HAAAAAAAAAAAALO',typeof n.params.field);
		// 	n1.params = jsCopy(n.params.field); //need to merge w/ spec type params if any!!!
		// 	//console.log(n1)
		// 	createLC(n1,n.uid,R);
		// 	n.children.push(n1);

		// 	//wo sollen die defaults fuer board field definiert sein??? in defaults!


		// }

		// //finally, show uis on board in certain position
		// adjustBoardLayout(n,R);//this will position the elements!!! =>need type specific!


	}

	//verwend ich mal erst fuer svgs mit pos transforms, eg., board elements
	// else if (isdef(n.boardMember)){
	// 	//hier werden fields etc. produziert!!!
	// 	//console.log('YEAHHHHHHHHH!!!!!!!!!!!!!!!!!');
	// 	//console.log(n)
	// 	//hier muss 1 field oder corner oder edge object produziert werden!!!
	// 	//woher nehme shape,w,h,bg???


	// 	let pa=n.params;
	// 	n.ui = gShape(pa.shape,pa.size,pa.size,pa.bg);
	// 	R.setUid(n);
	// 	console.log('made ui',n.ui)

	// }

	//leaf
	else if (isLeafType(n.type)){

		createUi(n, area, R);

	}
	return n;
}

const SHAPEFUNCS={
	'circle':agCircle,
	'hex':agHex,
	'rect':agRect,
}
function gShape(shape,w,h,bg){
	let el = gG(); 
	SHAPEFUNCS[shape](el, w, h); 
	gBg(el, bg); 
	return el;
}





