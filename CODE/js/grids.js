function createBoard(n, area, R) {
	//console.log('createBoard anfang:', jsCopy(n).params)
	n.bi = window[n.boardType](R.sData[n.oid], R.sData);
	generalGrid(n, area, R);
}

function quadGrid(o, pool) {
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
	return gridSkeleton(o, pool, boardInfo, fieldInfo);

	// let layoutInfo = gridSkeleton(o, pool, boardInfo, fieldInfo);

	// let olist = [];
	// for (const id in layoutInfo.fields) { olist.push(id); }
	// for (const id in layoutInfo.corners) { olist.push(id); }
	// for (const id in layoutInfo.edges) { olist.push(id); }

	// return { olist: olist, layoutInfo: layoutInfo };
}
function hexGrid(o, pool) {
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
	return gridSkeleton(o, pool, boardInfo, fieldInfo);
	// let layoutInfo = gridSkeleton(o, pool, boardInfo, fieldInfo);

	// let olist = [];
	// for (const id in layoutInfo.fields) { olist.push(id); }
	// for (const id in layoutInfo.corners) { olist.push(id); }
	// for (const id in layoutInfo.edges) { olist.push(id); }

	// return { olist: olist, layoutInfo: layoutInfo };
}

function gridSkeleton(omap, pool, gridInfoFunc, fieldInfoFunc) {
	//calc pos skeleton of board
	let board = { o: omap, info: gridInfoFunc(omap.rows, omap.cols) };

	let fields = {};
	for (const fid of getElements(omap.fields)) {
		let o = pool[fid];
		fields[fid] = { oid: fid, o: pool[fid], info: fieldInfoFunc(board.info, o.row, o.col) };
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
				corners[cid] = { oid: cid, o: pool[cid], info: { shape: 'circle', memType: 'corner', x: pt.x, y: pt.y, w: 1, h: 1 } };
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
				let el = pool[eid];
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
function generalGrid(n, area, R) {

	//n.bi ist  { board: board, fields: fields, corners: corners, edges: edges };
	// 1 dictionary mit 4 dictionaries

	//n.params ist { fields:..., edges:..., corners:... , gap:...}

	let bpa = n.params;
	//console.log('board params composed:', n.params)

	//bei fields wird gap taken into account!
	let bFieldParams = bpa.fields;
	if (nundef(bFieldParams)) bFieldParams = {};
	for (const [oid, f] of Object.entries(n.bi.fields)) {
		let o = f.o;
		// if (nundef(bFieldParams)) bFieldParams = {};
		let tNode = isEmpty(o._rsg) ? {} : jsCopy(R.lastSpec[o._rsg[0]]);
		//console.log(tNode)
		if (nundef(tNode.params)) tNode.params = {};
		if (!isEmpty(bFieldParams)) tNode.params = deepmerge(bFieldParams, tNode.params);

		let fNew = deepmerge(tNode, f);
		//console.log(fNew)
		//fNew.params = mapValues(o, fNew.params, bFieldParams, R.lastSpec);
		//if (fNew.params.size > maxSize) { fNew.params.size = maxSize; }//*** */
		n.bi.fields[oid] = fNew;
	}
	for (const name of ['edges', 'corners']) {
		let bMemberParams = bpa[name];
		if (nundef(bMemberParams)) bMemberParams = {};
		for (const [oid, f] of Object.entries(n.bi[name])) {
			let o = f.o;
			let tNode = isEmpty(o._rsg) ? {} : jsCopy(R.lastSpec[o._rsg[0]]);

			if (nundef(tNode.params)) tNode.params = {};
			tNode.params = deepmerge(bMemberParams, tNode.params);
			let fNew = deepmerge(tNode, f);
			//console.log(jsCopy(fNew));
			//fNew.params = mapValues(o, fNew.params, bMemberParams, R.lastSpec);
			n.bi[name][oid] = fNew;
		}
	}

	//mach param decoding extra!
	for (const name of ['fields', 'edges', 'corners']) {
		let bMemberParams = bpa[name];
		if (nundef(bMemberParams)) bMemberParams = {};
		for (const [oid, f] of Object.entries(n.bi[name])) {
			f.params = decodeParams(f,bMemberParams,R);
			//console.log('params for board el',bMemberParams,f.params.css)
		}
	}

	// *** stage 1: convert objects into uis ***

	for (const name of ['fields', 'edges', 'corners']) {
		let group = n.bi[name];
		//console.log(group)
		for (const oid in group) {

			let f = group[oid];
			let pf = f.params;
			//console.log(pf);
			//console.log('size',pf.size);

			f.ui = gShape(pf.shape, pf.size, pf.size, pf.bg);
		}
		// mergeEachBoardMemberWithItsSpecNodeN(n.bi.boardMembers[i],n.bi.boardMemberBaseParams[i],R);
	}

	// *** stage 2: prep area div (loc 'areaTable') as flexWrap ***
	let d = stage2_prepArea(area);

	// *** stage 3: prep container div/svg/g (board) as posRel ***
	let boardDiv = stage3_prepContainer(d);

	let boardSvg = gSvg();
	let style = `margin:0;padding:0;position:absolute;top:0px;left:0px;width:100%;height:100%;`
	boardSvg.setAttribute('style', style);
	boardDiv.appendChild(boardSvg);

	let boardG = gG();
	boardSvg.appendChild(boardG);

	n.bi.boardDiv = boardDiv;
	mColor(boardDiv, 'blue'); //apply stylings?
	boardDiv.id = n.uid + '_div';
	n.bi.boardSvg = boardSvg;
	n.ui = n.bi.boardG = boardG;
	R.setUid(n);

	// *** stage 4: layout! means append & positioning = transforms... ***
	let boardInfo = n.bi.board.info;
	let fSpacing = bpa.field_spacing;// = bpa.fields.size+bpa.gap;
	if (nundef(fSpacing)) fSpacing = 60;
	let margin = bpa.margin;
	if (nundef(margin)) margin = 8;
	let [fw, fh] = [fSpacing / boardInfo.wdef, fSpacing / boardInfo.hdef];

	let cornerSize = isEmpty(n.bi.corners) ? 0 : isdef(bpa.corners) ? bpa.corners.size : 15;
	// console.log('cornerSize',cornerSize)

	let [wBoard, hBoard] = [fw * boardInfo.w + cornerSize, fh * boardInfo.h + cornerSize];
	let [wTotal, hTotal] = [wBoard + 2 * margin, hBoard + 2 * margin];

	//console.log(wBoard,hBoard)

	mStyle(boardDiv, { 'min-width': wTotal, 'min-height': hTotal, 'border-radius': margin, margin: 'auto 4px' });
	boardG.style.transform = "translate(50%, 50%)"; //geht das schon vor append???

	for (const f of Object.values(n.bi.fields)) {
		boardG.appendChild(f.ui);
		gPos(f.ui, fw * f.info.x, fh * f.info.y);
	}
	for (const f of Object.values(n.bi.edges)) {
		boardG.appendChild(f.ui);
		if (f.params.shape == 'line') agLine(f.ui, f.info.x1 * fw, f.info.y1 * fw, f.info.x2 * fw, f.info.y2 * fw);
		else gPos(f.ui, fw * f.info.x, fh * f.info.y);
	}
	for (const f of Object.values(n.bi.corners)) {
		boardG.appendChild(f.ui);
		gPos(f.ui, fw * f.info.x, fh * f.info.y);
	}

}

function detectBoardOidAndType(n, R) {
	//detect n.oid if not set!
	let sd = R.sData;//TODO!!! eigentlich muss ich hier _source nehmen!!!
	if (!n.oid) n.oid = detectBoardObject(sd);

	let oBoard = sd[n.oid];
	//console.log('board server object',oBoard);
	if (!n.boardType) n.boardType = detectBoardType(oBoard, sd);
}
var countDetectBoardParamsCalls=0;//TODO: remove!
function detectBoardParams(n, R) {

	countDetectBoardParamsCalls+=1;//TODO: remove!

	//set params for board!
	//console.log('......... detectBoardParams1')
	//console.log(R.defs1.grid, R.defs1[n.boardType])
	//console.log('n.params',jsCopy(n.params));
	let boardDefs = R.defs.grid;
	if (isdef(boardDefs)) {
		let specific = R.defs[n.boardType];
		if (isdef(specific)) boardDefs = deepmerge(boardDefs, specific);
		if (isdef(boardDefs.params)) {
			if (isdef(n.params)) n.params = deepmerge(boardDefs.params, n.params);
			else n.params = boardDefs.params;
		}
	}

	//console.log('......... RESULT',n.params);
	return n.params;
}
function detectBoardObject(data) { return firstCondDictKeys(data, x => isdef(data[x].map)); }
function detectBoardType(oBoard, data) {
	//console.log(oBoard)
	let fid0 = getElements(oBoard.fields)[0];
	//console.log(fid0)
	let nei = data[fid0].neighbors;
	//console.log('nei',nei);
	let len = nei.length;
	return len == 6 ? 'hexGrid' : 'quadGrid'; //for now!
}














