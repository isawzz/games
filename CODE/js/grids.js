function createArtificialSpecForBoardMemberIfNeeded(oid,o,R){
	let key = R.getR(oid);
	if (!isEmpty(key)) {
		//console.log('***FOUND KEY FOR',oid,key);
		key = key[0]; //weil rsg eine liste ist!
	}
	//if null key make a standard key for board member! plus oidNode
	else {
		console.log('key',key)
		key = getUID();
		//TODO: AENDERN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		R.lastSpec[key] = { cond: { obj_type: o.obj_type }, type: 'info'};//, data: '.' };
		R.addR(oid, key);
		R.oidNodes[key] = key;

		//retest all objects in R for this cond!
		R.updateR(key);
	}
	return key;
}

function generalGrid(nuiBoard, area, R, defParams) {

	// *** stage 1 create parent *** (kommt von createLC mit n...spec node COPY)
	let bpa = nuiBoard.params = detectBoardParams(nuiBoard, R);
	//console.log('bpa', bpa);

	nuiBoard.ui = createUi(nuiBoard, area, R, defParams);
	//console.log('NACH board CREATEUI!!!!!!!!!!!', nuiBoard);

	// *** stage 2 create children *** (in n.bi)
	// *** START TEMP CODE ***
	//vorbereitungen die brauche damit algo ablaufen kann (ev. elim later stage!!!)
	let rtreeParent = R.NodesByUid[nuiBoard.uid];
	rtreeParent.children = [];//noetig damit nicht changed type to panel!!!
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
			let uid = n1.uid = getUID();

			// ***TEMP!!!! hier wird ein artificial key gemacht falls kein spec key fuer oid!
			let key = n1.key = createArtificialSpecForBoardMemberIfNeeded(oid,o,R);

			//*** instantiateOidKeyAtParent(oid, key, uidParent, R)
			let ntree = { uid: getUID(), uidParent: uidBoard, oid: oid, path: '.', key: key };
			R.NodesByUid[uid] = ntree;
			lookupAddToList(R.treeNodesByOidAndKey, [oid, key], uid);
			rtreeParent.children.push(uid);

			//*** recBuildUiFromNode(ntree, uidBoard, R, nuiBoard.defParams, oid);
			let nsub = R.lastSpec[key];
			let nui = jsCopy(n1); //deepmergeOverride(nSpec, n1);
			nui.uiType = 'g';
			nui.type = nsub.type;
			nui.data = nsub.data;
			if (isdef(nsub.params)) nui.params = deepmergeOverride(n1.params, nsub.params);
			let defsMember = lookup(defParams, ['grid', 'params', name]);
			if (defsMember) nui.defParams = deepmergeOverride(n1.defParams, defsMember);
			nui.content = calcContentFromData(oid, o, nui.data, R);
			nui.ui = createUi(nui, nuiBoard.uid, R, nui.defParams);// *************************** HIER !!!!!!!!!!!!!!!!!!!!!!
			R.uiNodes[uid] = nui;
			if (R.isUiActive) nui.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);
		}
	}
	nuiBoard.children = rtreeParent.children; 
	// *** END TEMP CODE ***

	// *** stage 4: layout! means append & positioning = transforms... ***
	let boardInfo = nuiBoard.bi.board.info;
	let fSpacing = bpa.field_spacing;
	if (nundef(fSpacing)) fSpacing = 60;
	let margin = bpa.margin;
	if (nundef(margin)) margin = 8;
	let [fw, fh] = [fSpacing / boardInfo.wdef, fSpacing / boardInfo.hdef];

	let cornerSize = isEmpty(nuiBoard.bi.corners) ? 0 : isdef(bpa.corners) ? bpa.corners.size : 15;
	// console.log('cornerSize',cornerSize)

	let [wBoard, hBoard] = [fw * boardInfo.w + cornerSize, fh * boardInfo.h + cornerSize];
	let [wTotal, hTotal] = [wBoard + 2 * margin, hBoard + 2 * margin];
	//console.log(wBoard,hBoard)

	let boardDiv = nuiBoard.bi.boardDiv;
	let boardG = nuiBoard.ui;
	mStyle(boardDiv, { 'min-width': wTotal, 'min-height': hTotal, 'border-radius': margin, margin: 'auto 4px' });
	boardG.style.transform = "translate(50%, 50%)"; //geht das schon vor append???

	for (const fid of nuiBoard.children) {
		let f = R.uiNodes[fid];
		let uiChild = f.ui;
		boardG.appendChild(uiChild);
		if (f.params.shape == 'line') agLine(f.ui, f.info.x1 * fw, f.info.y1 * fw, f.info.x2 * fw, f.info.y2 * fw);
		else gPos(f.ui, fw * f.info.x, fh * f.info.y);
	}
}

function createBoard(nui, area, R, defParams) {
	let ntree = R.NodesByUid[nui.uid];
	let nSpec = R.lastSpec[ntree.key];
	let [oid, boardType] = detectBoardOidAndType(ntree.oid, nSpec.boardType, R);
	nui.oid = oid;
	nui.boardType = boardType;
	nui.bi = window[nui.boardType](R.getO(nui.oid), R);
	generalGrid(nui, area, R, defParams);
}
//#region detect
function detectBoardOidAndType(oid, boardType, R) {
	//detect n.oid if not set!
	if (!oid) oid = detectFirstBoardObject(R);

	let oBoard = R.getO(oid);
	//console.log('board server object',oBoard);
	if (!boardType) boardType = detectBoardType(oBoard, R);
	return [oid, boardType];
}
function detectBoardParams(n, R) {
	// console.log('board node before detectBoardParams!',jsCopy(n));

	// *** 1 *** merge of node params and default params for grid and n.boardType
	let allParams = {};
	let boardDefs = R.defs.grid;
	if (isdef(boardDefs)) {
		let specific = R.defs[n.boardType];
		if (isdef(specific)) boardDefs = deepmerge(boardDefs, specific);
		if (isdef(boardDefs.params)) {
			if (isdef(n.params)) allParams = deepmerge(boardDefs.params, n.params);
			else allParams = boardDefs.params;
		}
	}

	n.bi.params = { fields: {}, corners: {}, edges: {} };
	let justBoardParams = jsCopy(allParams);
	for (const name of ['fields', 'corners', 'edges']) {
		n.bi.params[name] = justBoardParams[name];
		delete justBoardParams[name];
	}
	return justBoardParams;

}
function detectFirstBoardObject(R) {
	for (const oid of R.defSource) {
		let o = R.getO(oid);
		if (isdef(o.map) && isdef(o.fields)) return oid;
	}
}
function detectBoardType(oBoard, R) {
	//console.log(oBoard)
	let fid0 = getElements(oBoard.fields)[0];
	//console.log(fid0)
	let nei = R.getO(fid0).neighbors;
	//console.log('nei',nei);
	let len = nei.length;
	return len == 6 ? 'hexGrid' : 'quadGrid'; //for now!
}
//#endregion

function gridSkeleton(omap, R, gridInfoFunc, fieldInfoFunc) {
	//calc pos skeleton of board
	let board = { o: omap, info: gridInfoFunc(omap.rows, omap.cols) };

	let fields = {};
	for (const fid of getElements(omap.fields)) {
		let o = R.getO(fid);
		fields[fid] = { oid: fid, o: o, info: fieldInfoFunc(board.info, o.row, o.col) };
	}
	// console.log('fields', fields);

	//now vertices
	board.info.vertices = correctPolys(Object.values(fields).map(x => x.info.poly), 1);

	let dhelp = {}; //remember nodes that have already been created!!!
	let corners = {};
	for (const fid in fields) {
		let f = fields[fid];
		let i = 0;
		for (const cid of getElements(f.o.corners)) {
			if (cid && nundef(dhelp[cid])) {
				let pt = f.info.poly[i];
				corners[cid] = { oid: cid, o: R.getO(cid), info: { shape: 'circle', memType: 'corner', x: pt.x, y: pt.y, w: 1, h: 1 } };
				dhelp[cid] = true;
			}
			i += 1;
		}
	}
	// console.log('corners', corners);

	//now edges
	dhelp = {}; //remember edges that have already been created!!!
	let edges = {};
	for (const fid in fields) {
		let f = fields[fid];
		for (const eid of getElements(f.o.edges)) {
			if (eid && nundef(dhelp[eid])) {
				let el = R.getO(eid);
				let n1 = corners[el.corners[0]._obj];
				let n2 = corners[el.corners[1]._obj];
				let [x1, y1, x2, y2] = [n1.info.x, n1.info.y, n2.info.x, n2.info.y];
				//console.log(el, n1, n2)
				edges[eid] = { oid: eid, o: el, info: { shape: 'line', memType: 'edge', x1: x1, y1: y1, x2: x2, y2: y2, x: (x1 + x2) / 2, y: (y1 + y2) / 2, thickness: 1, w: 1, h: 1 } };
				dhelp[eid] = true;
			}
		}
	}
	// console.log('edges', edges);

	return { board: board, fields: fields, corners: corners, edges: edges };

}











function quadGrid(o, R) {
	function boardInfo(rows, cols) {
		[wdef, hdef] = [4, 4];
		let info = {
			structType: 'quadGrid',
			rows: rows,
			cols: cols,
			wdef: 4,
			hdef: 4,
			dx: wdef,
			dy: hdef,
			w: wdef * cols,
			h: hdef * rows,
			minRow: 1,
			minCol: 1,
		};
		return info;
	}
	function fieldInfo(boardInfo, row, col) {
		//is exactly same as for hex field except for shape! >so unify after testing!
		let info = {
			shape: 'rect',
			memType: 'field',
			row: row,
			col: col,
			x: -boardInfo.w / 2 + (col - boardInfo.minCol) * boardInfo.dx + boardInfo.wdef / 2,
			y: -boardInfo.h / 2 + (row - boardInfo.minRow) * boardInfo.dy + boardInfo.hdef / 2,
			w: boardInfo.wdef,
			h: boardInfo.hdef,
		};
		//console.log('col',col,'minCol',boardInfo.minCol,boardInfo.w,boardInfo.dx,boardInfo.wdef,'==>',info.x)
		info.poly = getQuadPoly(info.x, info.y, info.w, info.h);
		return info;
	}
	return gridSkeleton(o, R, boardInfo, fieldInfo);

}
function hexGrid(o, R) {
	function boardInfo(rows, cols) {
		[wdef, hdef] = [4, 4];
		[dx, dy] = [wdef / 2, (hdef * 3) / 4];
		let info = {
			structType: 'hexGrid',
			rows: rows,
			cols: cols,
			wdef: 4,
			hdef: 4,
			dx: dx,
			dy: dy,
			w: wdef + (cols - 1) * dx,
			h: hdef + (rows - 1) * dy,
			minRow: 0,
			minCol: 0,
		};
		return info;
	}
	function fieldInfo(boardInfo, row, col) {
		let info = {
			shape: 'hex',
			memType: 'field',
			row: row,
			col: col,
			x: -boardInfo.w / 2 + (col - boardInfo.minCol) * boardInfo.dx + boardInfo.wdef / 2,
			y: -boardInfo.h / 2 + boardInfo.hdef / 2 + (row - boardInfo.minRow) * boardInfo.dy,
			w: boardInfo.wdef,
			h: boardInfo.hdef,
		};
		info.poly = getHexPoly(info.x, info.y, info.w, info.h);
		return info;
	}
	return gridSkeleton(o, R, boardInfo, fieldInfo);
}












