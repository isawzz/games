function einhaengen0(oid, o, R) {
	//console.log('_____________ einhaengen', oid, R.oidNodes[oid]);
	//let nodes = R.oidNodes[oid];

	let nodes = R.getR(oid);
	if (isEmpty(nodes)) return false;
	for (const key of nodes) { //} in nodes) {
		if (o.loc) addOidByLocProperty0(oid, key, R);
		else addOidByParentKeyLocation0(oid, key, R);
	}
	return true;
}
function addOidByLocProperty0(oid, key, R) {
	let o = R.getO(oid);
	let ID = o.loc; //ID is oid ob obj AUF DEM o dargestellt werden soll!

	//gibt es spec key fuer ID?
	// let IDNode = R.oidNodes[ID];
	// let IDkeys = Object.keys(IDNode);
	// for (const k of IDkeys) {
	let IDkeys = R.getR(oid);

	for (const k of IDkeys) {
		//now find parents that have same key and same oid
		let parents = lookup(R.rNodesOidKey, [ID, k]);
		//console.log('parents for robber', parents);

		if (!parents || isEmpty(parents)) {
			console.log('LOC PARENT MISSING!!!! trying to add', oid, 'with loc', o.loc);
			continue;
		}
		for (const uidParent of parents) {
			//console.log('oid', oid, 'key', key, 'uidParent', uidParent)
			instantiateOidKeyAtParent(oid, key, uidParent, R);
		}
	}
}
function addOidByParentKeyLocation0(oid, key, R) {
	//console.log('_____________ addOidByParentKeyLocation', oid, key);
	let nodes = R.getR(oid); //R.oidNodes[oid];
	if (isEmpty(nodes)) return;
	let parents = R.Locations[key]; //for now just 1 allowed!!!!!!!!!!
	//console.log('found parents:',parents)
	if (nundef(parents)) return;
	for (const uidParent of parents) { instantiateOidKeyAtParent(oid, key, uidParent, R); }
}
function instantiateOidKeyAtParent(oid, key, uidParent, R) {
	//console.log('>>>>>ooooooooooooooooooooooold!!!!!! instantiate', oid, 'using', key, 'at', uidParent, '\nrParent', R.rNodes[uidParent], '\nuiParent', R.uiNodes[uidParent]);

	let rtreeParent = R.rNodes[uidParent];

	//console.log('rtreeParent',rtreeParent);

	//return;
	if (nundef(rtreeParent.children)) {
		//if (isdef(R.uiNodes[uidParent])) change_parent_type_if_needed(rtreeParent, R);
		rtreeParent.children = [];
	}
	let index = rtreeParent.children.length;
	let newPath = isdef(rtreeParent.sub) ? extendPath(rtreeParent.path, index) : '.';// index == 0 ? '.' : extendPath(n.path, index);

	//=================================================

	let nsp = R.lastSpec[key];
	let n1 = recBuildRTree(nsp, key, '.', rtreeParent, R.lastSpec, R, oid);
	//let n1 = { uid: getUID(), uidParent: uidParent, oid: oid, path: newPath, key: key };
	R.rNodes[n1.uid] = n1;
	lookupAddToList(R.rNodesOidKey, [oid, key], n1.uid);
	rtreeParent.children.push(n1.uid);

	if (isdef(R.uiNodes) && isdef(R.uiNodes[uidParent])) {
		let parent = R.uiNodes[uidParent];
		parent.adirty = true;
		recBuildUiFromNode(n1, uidParent, R, parent.defParams, oid);
		parent.children = rtreeParent.children;
	} else {
		console.log('UI not creatable! No suitable parent found! uidParent', uidParent, 'oid', oid, 'key', key, R.uiNodes);
	}
}

function recBuildRTree(n, key, path, parent, sp, R, oid) {
	CYCLES += 1; if (CYCLES > MAX_CYCLES) return;
	//console.log('***',n,path,parent,sp)
	let n1 = { uid: getUID(), key: key, uidParent: parent ? parent.uid : null, path: path };
	if (isdef(oid)) n1.oid = oid;

	let expandProp = '_NODE'; let nodeName = n[expandProp];
	if (isString(nodeName)) {
		let nSpec = sp[nodeName];
		if (nundef(nSpec.cond)) {
			let branch = recBuildRTree(nSpec, nodeName, '.', parent, sp, R, oid); //oder '.0'?
			n1 = branch;
			R.rNodes[n1.uid] = branch;
		} else {
			lookupAddToList(R.Locations, [nodeName], n1.uid);
			n1.here = nodeName;
		}
	}

	let chProp = 'sub'; let chlist = n[chProp];
	if (isdef(chlist)) {
		n1.children = [];
		let i = 0;
		for (const chInfo of chlist) {
			let newPath = extendPath(path, i);
			i += 1;
			let ch = recBuildRTree(chInfo, key, newPath, n1, sp, R, oid);
			R.rNodes[ch.uid] = ch;
			n1.children.push(ch.uid);
		}
	}
	return n1;
}
function recBuildUiFromNode(n, uidParent, R, iParams = {}) {
	CYCLES += 1; if (CYCLES > MAX_CYCLES) return;

	//console.log('build ui for',n.uid);
	let n1 = {}; // n is rtree, n1 is uiNode for eg. board
	let sp = R.getSpec();
	n1.uid = n.uid;
	if (isdef(n.children)) {
		n1.children = n.children.map(x => x);
		//console.log('should I set adirty false?',n,n.oid); //NO!!!!!
		n1.adirty = true;
	}
	let parent = lookup(R.rNodes, [uidParent]);
	//let k = parent ? parent.key : 'ROOT';
	let nsp = sp[n.key];
	let nsub = evalSpecPath(nsp, n.path, R);
	n1.type = nsub.type;
	n1.data = nsub.data;
	n1.params = isdef(nsub.params) ? nsub.params : {};
	n1.defParams = jsCopy(iParams);
	let oid = n1.oid = n.oid; //?n.oid:oid; // von rtree node or inherited!
	let o = oid ? R.getO(oid) : null;
	if (n1.data) {
		n1.content = calcContentFromData(oid, o, n1.data, R);
		if (isString(n1.content)) {
			//console.log(n1.content)
			let oid1 = n1.content;
			//console.log('oid of card', oid1, '\noid of n1', oid);
			if (oid1 != oid) {
				let o1 = R.getO(oid1);
				if (o1) {
					//jetzt muss ich dieses object darstellen wenn es geht!

					let oid1keys = R.getR(oid1);
					if (!isEmpty(oid1keys)) {
						let key1 = oid1keys[0];
						instantiateOidKeyAtParent(oid1, key1, uidParent, R);
					}

					// let oidNode1 = R.oidNodes[oid1];
					// if (isdef(oidNode1)) {
					// 	let key1list = Object.keys(oidNode1);
					// 	//console.log('following keys available for', oid1, key1list);
					// 	let key1 = key1list[0];
					// 	//console.log('FOUND BETTER REP FOR O', oid1, key1, '\nWAS JETZT???????');
					// 	//hier muss ich eine neue branch bauen in RTREE!
					// 	//habe oid, key, uidParent (is eigene uid)
					// 	//console.log('der rNode muss doch existieren!!!', R.rNodes[n.uid])
					// 	instantiateOidKeyAtParent(oid1, key1, uidParent, R);
					// 	//console.log('HALLOOOOOOOO');
					// }
				}
			}
		}
	}

	if (n1.type == 'grid') {
		createBoard0(n1, uidParent, R, iParams);
	} else {
		//console.log('call createUi__ for',n1.uid)
		n1.ui = createUi0(n1, uidParent, R, iParams);
	}
	R.uiNodes[n1.uid] = n1;
	if (R.isUiActive) n1.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);
	if (nundef(n1.children) || n1.type == 'grid') { return; }

	//if children
	iParams = jsCopy(iParams);
	if (nundef(iParams[n1.type])) iParams[n1.type] = {};
	iParams[n1.type].params = n1.defParams;
	for (const ch of n1.children) {
		let nNew = R.rNodes[ch];
		recBuildUiFromNode(nNew, n1.uid, R, iParams, n1.oid);
	}
}
function createUi0(n, area, R, defParams) {

	if (nundef(n.type)) { n.type = inferType(n); }
	R.registerNode(n);
	decodeParams(n, R, defParams);

	console.log(n, n.type)
	let ui = RCREATE[n.type](n, mBy(area), R);

	if (nundef(n.uiType)) n.uiType = 'd'; // d, g, h (=hybrid)

	if (n.uiType == 'NONE') return ui;


	//if (n.uiType != 'g') applyCssStyles(n.uiType == 'h'?mBy(n.uidStyle):ui, n.cssParams);
	applyCssStyles(n.uiType == 'h' ? mBy(n.uidStyle) : ui, n.cssParams);
	// else{
	// 	console.log(ui);
	// 	ui.style.filter='grayscale(0.5)';

	// }
	// if (n.uiType == 'h') {
	// 	// console.log('NOT APPLYING CSS STYLES!!!', n.uid, n.uiType, n.params)
	// 	applyCssStyles(mBy(n.uidStyle), n.cssParams);
	// } else {
	// 	applyCssStyles(ui, n.cssParams);
	// }

	//TODO: hier muss noch die rsg std params setzen (same for all types!)
	if (!isEmpty(n.stdParams)) {
		//console.log('rsg std params!!!', n.stdParams);
		switch (n.stdParams.display) {
			case 'if_content': if (!n.content) hide(ui); break;
			case 'hidden': hide(ui); break;
			default: break;
		}
	}

	R.setUid(n, ui);
	return ui;

}


//#region helpers
function change_parent_type_if_needed(n, R) {

	let uiNode = R.uiNodes[n.uid];

	if (uiNode.type == 'invisible') { clearElement(uiNode.ui); return; }
	if (!isContainerType(uiNode.type)) {
		uiNode.type = 'panel'; //TRANSPARENT FOR 'g', 'd', 'h' type!!!
		uiNode.changing = true;
		let uidParent = n.uidParent;
		let area = uidParent ? uidParent : R.baseArea;
		let uiNew = createUi0(uiNode, area, R, uiNode.defParams);
	}
}

//#region grid
function generalGrid0(nuiBoard, area, R, defParams) {

	// *** stage 1 create parent *** (kommt von createLC mit n...spec node COPY)
	let bpa = nuiBoard.params = detectBoardParams(nuiBoard, R);
	//console.log('bpa', bpa);

	let ui = nuiBoard.ui = createUi(nuiBoard, area, R, defParams);
	//console.log('board',ui, nuiBoard);
	//console.log('NACH board CREATEUI!!!!!!!!!!!', nuiBoard);

	// *** stage 2 create children *** (in n.bi)
	// *** START TEMP CODE ***
	//vorbereitungen die brauche damit algo ablaufen kann (ev. elim later stage!!!)
	let rtreeParent = R.rNodes[nuiBoard.uid];
	rtreeParent.children = []; //noetig damit nicht changed type to panel!!!
	let uidBoard = nuiBoard.uid;
	for (const name of ['fields', 'edges', 'corners']) {
		let bMemberParams = nuiBoard.bi.params[name];
		let group = nuiBoard.bi[name];
		for (const oid in group) {
			let n1 = group[oid];
			let o = n1.o;
			delete n1.o;

			n1.params = n1.defParams = jsCopy(bMemberParams);
			if (!R.getO(oid)) { addNewServerObjectToRsg(oid, o, R, true); }

			//ACHTUNG!!!! the following is NEEDED to be able to re-add board after removing it!
			else if (isEmpty(R.getR(oid))) { R.addRForObject(oid); }
			else {
				//console.log('ueberpruefung NICHT gelaufen!!!',R.getR(oid))
			}
			let uid = n1.uid = getUID();

			// ***TEMP!!!! hier wird ein artificial key gemacht falls kein spec key fuer oid!
			let key = n1.key = createArtificialSpecForBoardMemberIfNeeded(oid, o, R);

			//*** instantiateOidKeyAtParent(oid, key, uidParent, R)
			let ntree = { uid: uid, uidParent: uidBoard, oid: oid, path: '.', key: key };
			R.rNodes[uid] = ntree;
			lookupAddToList(R.rNodesOidKey, [oid, key], uid);
			rtreeParent.children.push(uid);

			//*** recBuildUiFromNode1(ntree, uidBoard, R, nuiBoard.defParams, oid);
			let nsub = R.lastSpec[key];
			let nui = jsCopy(n1); //deepmergeOverride(nSpec, n1);
			nui.uiType = 'g';
			nui.type = nsub.type;
			nui.data = nsub.data;
			if (isdef(nsub.params)) nui.params = deepmergeOverride(n1.params, nsub.params);
			let defsMember = lookup(defParams, ['grid', 'params', name]);
			if (defsMember) nui.defParams = deepmergeOverride(n1.defParams, defsMember);
			nui.content = calcContentFromData(oid, o, nui.data, R);

			//*********** createUi__ *************** */
			nui.ui = createUi(nui, nuiBoard.uid, R, nui.defParams);// *************************** HIER !!!!!!!!!!!!!!!!!!!!!!


			R.uiNodes[uid] = nui;
			if (R.isUiActive) nui.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);
		}
	}
	nuiBoard.children = rtreeParent.children;
	// *** END TEMP CODE ***

	// *** stage 4: layout! means append & positioning = transforms... ***
	let boardInfo = nuiBoard.bi.board.info;
	//console.log(bpa);
	let fSpacing = bpa.field_spacing;
	if (nundef(fSpacing)) nuiBoard.params.field_spacing = fSpacing = 60;
	let margin = isdef(bpa.margin) ? bpa.margin : 0;
	//if (nundef(margin)) nuiBoard.params.margin = margin = 4;
	let [fw, fh] = [fSpacing / boardInfo.wdef, fSpacing / boardInfo.hdef];

	let cornerSize = isEmpty(nuiBoard.bi.corners) ? 0 : isdef(bpa.corners) ? bpa.corners.size : 15;
	// console.log('cornerSize',cornerSize)

	let [wBoard, hBoard] = [fw * boardInfo.w + cornerSize, fh * boardInfo.h + cornerSize];
	let [wTotal, hTotal] = [wBoard + 2 * margin, hBoard + 2 * margin];
	//console.log(wBoard,hBoard)

	let boardDiv = nuiBoard.bi.boardDiv;
	let boardG = nuiBoard.ui;
	mStyle(boardDiv, { 'min-width': wTotal, 'min-height': hTotal });//, 'border-radius': margin, margin: 'auto 4px' });
	boardG.style.transform = "translate(50%, 50%)"; //geht das schon vor append???

	//positioning of elements!
	for (const fid of nuiBoard.children) {
		let f = R.uiNodes[fid];
		let uiChild = f.ui;
		//boardG.appendChild(uiChild);
		if (f.params.shape == 'line') agLine(f.ui, f.info.x1 * fw, f.info.y1 * fw, f.info.x2 * fw, f.info.y2 * fw);
		else gPos(f.ui, fw * f.info.x, fh * f.info.y);
	}
}
function createBoard0(nui, area, R, defParams) {
	let ntree = R.rNodes[nui.uid];
	console.log('createBoard0', '\nntree', ntree, '\nnui', nui)
	let nSpec = R.lastSpec[ntree.key];
	let [oid, boardType] = detectBoardOidAndType(ntree.oid, nSpec.boardType, R);
	nui.oid = oid;
	nui.boardType = boardType;
	nui.bi = window[nui.boardType](R.getO(nui.oid), R);
	generalGrid0(nui, area, R, defParams);
}
