//#region grid vor cleanup!
function generalGrid(nuiBoard, area, R) {

	// *** stage 1 create parent *** (kommt von createLC mit n...spec node COPY)
	let bParams = nuiBoard.params = detectBoardParams(nuiBoard, R);
	let ui = nuiBoard.ui = createUi(nuiBoard, area, R);

	// *** stage 2 create children *** (in n.bi)
	let rtreeParent = R.rNodes[nuiBoard.uid];
	//rtreeParent.children = []; //noetig damit nicht changed type to panel!!!
	let uidBoard = nuiBoard.uid;
	for (const name of ['fields', 'edges', 'corners']) {
		let groupParams = lookup(DEFS, ['grid', 'params', name]);	if (!groupParams) groupParams = {};
		groupParams = safeMerge(groupParams, nuiBoard.bi.params[name]);

		//if (name=='corners') console.log('groupParams corners:',groupParams)

		let group = nuiBoard.bi[name];
		for (const oid in group) {
			let n1 = group[oid];
			let o = n1.o;
			delete n1.o;

			//if (oid == '0') console.log('Member: creation gengrid!', jsCopy(n1))
			//if (oid == '0') console.log('Member: obj wird geadded, key created if needed, einhaengen SKIP!');

			// if (!R.getO(oid)) { addNewServerObjectToRsg(oid, o, R, true); }
			// //ACHTUNG!!!! the following is NEEDED to be able to re-add board after removing it!
			// else if (isEmpty(R.getR(oid))) { R.addRForObject(oid); }

			let key = createArtificialSpecForBoardMemberIfNeeded(oid, o, R);
			//console.log('key',key)

			let newCode = true;
			let ntree, nui;
			if (newCode) {
				ntree = instantOidKey(oid, key, uidBoard, R);

				ntree.params = isdef(ntree.params)? safeMerge(groupParams, ntree.params):groupParams;
				//console.log('final params for',name,ntree.params);

				ntree.info = n1.info;
				nui = recUi(ntree, uidBoard, R, oid, key);

			} else {
				//*** instantiateOidKeyAtParent(oid, key, uidParent, R)
				if (oid == '0') console.log('Member: obj wird geadded, key created if needed, einhaengen SKIP!');
				let uid = n1.uid = getUID();
				ntree = { uid: uid, uidParent: uidBoard, oid: oid, path: '.', key: key };
				R.rNodes[uid] = ntree;
				lookupAddToList(R.rNodesOidKey, [oid, key], uid);
				rtreeParent.children.push(uid);
				//*** recBuildUiFromNode1(ntree, uidBoard, R, nuiBoard.defParams, oid);
				let nsub = R.lastSpec[key];
				nui = jsCopy(n1); //deepmergeOverride(nSpec, n1);
				nui.uiType = 'g';
				nui.type = nsub.type;
				nui.data = nsub.data;

				n1.params = n1.defParams = jsCopy(groupParams);
				if (isdef(nsub.params)) nui.params = deepmergeOverride(n1.params, nsub.params);
				let defsMember = lookup(DEFS, ['grid', 'params', name]);
				if (defsMember) nui.defParams = deepmergeOverride(n1.defParams, defsMember);
				nui.content = calcContentFromData(oid, o, nui.data, R);
				//*********** createUi__ *************** */
				nui.ui = createUi(nui, nuiBoard.uid, R, nui.defParams);// *************************** HIER !!!!!!!!!!!!!!!!!!!!!!
				R.uiNodes[uid] = nui;
				if (R.isUiActive) nui.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);
			}

			//if (oid == '0') console.log('Member: created!', '\nn1', jsCopy(n1), '\nntree', jsCopy(ntree), '\nnui', jsCopySafe(nui))

		}
	}
	nuiBoard.children = rtreeParent.children; 

	// *** stage 4: layout! means append & positioning = transforms... ***
	let boardInfo = nuiBoard.bi.board.info;
	let fSpacing = bParams.field_spacing;
	if (nundef(fSpacing)) nuiBoard.params.field_spacing = fSpacing = 60;
	let margin = isdef(bParams.margin) ? bParams.margin : 0;
	let [fw, fh] = [fSpacing / boardInfo.wdef, fSpacing / boardInfo.hdef];

	let cornerSize = isEmpty(nuiBoard.bi.corners) ? 0 : isdef(bParams.corners) ? bParams.corners.size : 15;
	// console.log('cornerSize',cornerSize)

	let [wBoard, hBoard] = [fw * boardInfo.w + cornerSize, fh * boardInfo.h + cornerSize];
	let [wTotal, hTotal] = [wBoard + 2 * margin, hBoard + 2 * margin];
	//console.log(wBoard,hBoard)

	let boardDiv = nuiBoard.bi.boardDiv;
	let boardG = nuiBoard.ui;
	mStyle(boardDiv, { 'min-width': wTotal, 'min-height': hTotal });//, 'border-radius': margin, margin: 'auto 4px' });
	boardG.style.transform = "translate(50%, 50%)"; //geht das schon vor append???NEIN!

	//positioning of elements!
	for (const fid of nuiBoard.children) {
		let f = R.uiNodes[fid];
		//let uiChild = f.ui;
		//boardG.appendChild(uiChild);
		if (f.params.shape == 'line') agLine(f.ui, f.info.x1 * fw, f.info.y1 * fw, f.info.x2 * fw, f.info.y2 * fw);
		else gPos(f.ui, fw * f.info.x, fh * f.info.y);

		//DONE IN createUi!!!!!!!!!!!!!!!!!!!!!
		//calcRays(f, boardG, R); // DAS GEHT AUCH ERST NACH APPEND!!!
		//aber wart: ich hab doch schon appended??????
	}
}
