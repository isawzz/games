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

	//console.log('board node before detectBoardParams!',jsCopy(n));

	// *** 1 *** merge of node params and default params for grid and n.boardType
	let allParams={};
	let boardDefs = R.defs.grid;
	if (isdef(boardDefs)) {
		let specific = R.defs[n.boardType];
		if (isdef(specific)) boardDefs = deepmerge(boardDefs, specific);
		if (isdef(boardDefs.params)) {
			if (isdef(n.params)) allParams = deepmerge(boardDefs.params, n.params);
			else allParams = boardDefs.params;
		}
	}

	n.bi.params = {fields:{},corners:{},edges:{}};
	let justBoardParams = jsCopy(allParams);
	for(const name of ['fields','corners','edges']){
		n.bi.params[name] = justBoardParams[name];
		delete justBoardParams[name];
	}
	return justBoardParams;
	
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














