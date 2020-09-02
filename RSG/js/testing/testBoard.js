
async function testCatan(r, c) {
	let sdata = genServerDataCatan(r, c);
	let spec = { ROOT: { cond: { obj_type: 'Board' }, type: 'grid', data: '.uid' } };
	//console.log(sdata,spec)

	await rParse('direct', { defs: DEFS, spec: spec, sdata: sdata });
	mBy('message').innerHTML = '(direct) ' + getFunctionCallerName();

}
async function testTtt(r, c) {
	let sdata = genServerDataTtt(r, c);
	let spec = { ROOT: { cond: { obj_type: 'Board' }, type: 'grid', data: '.uid' } };
	//console.log(sdata,spec)

	await rParse('direct', { defs: DEFS, spec: spec, sdata: sdata });
	mBy('message').innerHTML = '(direct) ' + getFunctionCallerName();

}
async function testGeneralBoard(r, c, shape, hasNodes, hasEdges, { mapVariant, fieldContent, nodeContent, edgeContent } = {}) {
	let sdata = genServerDataGeneralBoard(r, c, shape, hasNodes, hasEdges, { mapVariant, fieldContent, nodeContent, edgeContent });
	console.log('sdata', sdata)
	let spec = {
		ROOT: { cond: { obj_type: 'Board' }, type: 'grid' }
	};
	if (isdef(fieldContent)) {
		spec.fields = { cond: { obj_type: 'Field' }, data: '.content' };
	}
	if (isdef(nodeContent)) {
		spec.nodes = { cond: { obj_type: 'Corner' }, data: '.content' };
	}
	if (isdef(edgeContent)) {
		spec.edges = { cond: { obj_type: 'Edge' }, data: '.content' };
	}
	//console.log(sdata,spec)

	await rParse('direct', { defs: DEFS, spec: spec, sdata: sdata });
	mBy('message').innerHTML = '(direct) ' + getFunctionCallerName();

}


//#region gen server data
function genMapData(rows, cols, shape, letters = ['X']) {
	let res = []; let topcols = cols;
	if (shape == 'reghex') {
		//habe zB rows=5,cols=9 bei catan board
		//oder koennt sagen rows=5,cols=3
		//berechne maxColIndex
		imiddleRow = (rows - 1) / 2;
		let colarr = _calc_hex_col_array(rows, cols);
		let maxColIndex = 2 * colarr[imiddleRow] - 1;
		let cmiddle = Math.floor(maxColIndex / 2);
		let isMiddleEmpty = (cols % 2 == 0);
		let line = isMiddleEmpty ? ' ' : chooseRandom(letters);
		//console.log('rows', rows, 'topcols', cols, 'maxColIndex', maxColIndex, 'cmiddle', cmiddle, 'isMiddleEmpty', isMiddleEmpty,'line',line);
		//console.log('colarr',colarr)
		for (let r = 0; r < rows; r++) {

			let rest = '';
			let isLetter = (line == ' ');
			let numLetters = Math.floor(colarr[r] / 2);
			//console.log('___ r',r,'isLetter',isLetter,'numLetters',numLetters)


			for (let c = cmiddle + 1; c < maxColIndex; c++) {
				//console.log('c',c,'isLetter',isLetter)
				if (isLetter && numLetters > 0) {
					rest += chooseRandom(letters);
					numLetters -= 1;
				}
				else { rest += ' '; }
				isLetter = (!isLetter);
			}

			let revrest = reverseString(rest);
			revrest = replaceNonEmptyByRandom(revrest, letters);
			//console.log('r', r, 'line=' + line, 'rest=' + rest, 'rev=' + revrest);
			res.push(revrest + line + rest);
			line = line == ' ' ? chooseRandom(letters) : ' ';
			//break;
		}
		//count letters in first row ... top cols = cols
		let line0 = res[0];
		topcols = 0; for (const letter of line0) { if (letter != ' ') cols += 1; }
	} else if (shape == 'regquad') {
		//alle fields werden mit letter gefuellt
		for (let r = 0; r < rows; r++) {
			let line = '';
			for (let c = 0; c < cols; c++) {
				line += chooseRandom(letters);
			}
			res.push(line);
		}
	}
	return [res, topcols]; // [' W ', 'O Y', ' S '];
}

function genServerDataGeneralBoard(rows = 3, cols = 1, shape = 'quad', hasNodes = true, hasEdges = false, { mapVariant = 'reg', fieldContent = { A: 'hallo', B: 'heduda' }, nodeContent, edgeContent } = {}) {
	let mapSpec = isdef(mapVariant) ? mapVariant + shape : shape;
	let [mapData, topcols] = genMapData(rows, cols, mapSpec, Object.keys(fieldContent));

	//count rows
	rows = mapData.length;
	//console.log('rows', rows, 'cols', cols);

	//call SimpleGrid
	let b1 = new SimpleGrid('b1', {
		mapData: mapData,
		shape: shape,
		rows: rows,
		cols: topcols,
		hasEdges: hasEdges,
		hasNodes: hasNodes,
		randomizeIds: true,
		mapData: mapData,
	});
	//console.log('board b1', b1)

	//transform to board object as in serverData
	//example of serverData board:
	let sdata = {};
	let oidBoard = getUID();
	let board = simpleGridToServerData(b1);
	sdata[oidBoard] = board;
	board.oid = oidBoard;
	//console.log('board server object:', board);

	//make field objects
	let fields = Object.values(b1.objects).filter(x => x.obj_type == 'field');
	//console.log('fields', fields);

	for (const oid in b1.objects) {
		let o = jsCopy(b1.objects[oid]);
		o.oid = o.id; delete o.id;
		o.obj_type = capitalize(o.obj_type); //.toCapital(); //toUpperCase(); //'Field';

		// o.row -= 1; //0 based!
		// o.col -= 1;

		if (o.obj_type == 'Field' && isdef(fieldContent)) {
			o.mapKey = b1.mapData[o.row][o.col];
			o.content = fieldContent[o.mapKey];
			// o.num = chooseRandom(numbers);
		} else { delete o.row; delete o.col; }
		if (isdef(o.neighbors)) o.neighbors = o.neighbors.map(x => (x ? { _obj: x } : null));
		if (isdef(o.edges)) o.edges = o.edges.map(x => (x ? { _obj: x } : null));
		if (isdef(o.corners)) o.corners = o.corners.map(x => (x ? { _obj: x } : null));
		if (isdef(o.fields)) o.fields = o.fields.map(x => (x ? { _obj: x } : null));
		if (o.obj_type == 'Corner' && isdef(nodeContent)) {
			o.content = chooseRandom(Object.values(nodeContent));
		}	else if (o.obj_type == 'Edge' && isdef(edgeContent)) {
			o.content = chooseRandom(Object.values(edgeContent));
			console.log('edge:',o)
		}
		sdata[o.oid] = o;
	}

	Object.values(sdata).map(x => stripObject(x, ['x', 'y', 'x1', 'x2', 'y1', 'y2', 'thickness', 'w', 'h', 'done', 'rightField', 'leftField', 'startNode', 'endNode', 'poly']))
	//console.log(sdata);
	return sdata;
}

function genServerDataCatan(rows = 3, cols = 1) {
	//mach eine map
	let resources = { W: 'wood', Y: 'wheat', B: 'brick', O: 'ore', S: 'sheep' };
	let [mapData, topcols] = genMapData(rows, cols, 'reghex', Object.keys(resources));
	cols = topcols;
	let shape = 'hex';
	//console.log('map', mapData);

	//count letters in first row ... top cols = cols
	let line0 = mapData[0];
	cols = 0; for (const letter of line0) { if (letter != ' ') cols += 1; }

	//count rows
	rows = mapData.length;
	//console.log('rows', rows, 'cols', cols);

	//call SimpleGrid
	let b1 = new SimpleGrid('b1', {
		mapData: mapData,
		shape: shape,
		rows: rows,
		cols: cols,
		hasEdges: true,
		hasNodes: true,
		randomizeIds: true,
		mapData: mapData,
	});
	//console.log('board b1', b1)

	//transform to board object as in serverData
	//example of serverData board:
	let sdata = {};
	let oidBoard = getUID();
	let board = simpleGridToServerData(b1);
	sdata[oidBoard] = board;
	board.oid = oidBoard;
	//console.log('board server object:', board);

	//make field objects
	let fields = Object.values(b1.objects).filter(x => x.obj_type == 'field');
	//console.log('fields', fields);

	let numbers = arrRange(2, 12);

	for (const oid in b1.objects) {
		let o = jsCopy(b1.objects[oid]);
		o.oid = o.id; delete o.id;
		o.obj_type = capitalize(o.obj_type); //.toCapital(); //toUpperCase(); //'Field';
		if (o.obj_type == 'Field') {
			//console.log('catan', o.row, o.col)
			//o.row -= 1; //0 based!
			//o.col -= 1;
			o.letter = b1.mapData[o.row][o.col];
			o.res = resources[o.letter];
			o.num = chooseRandom(numbers);
		} else { delete o.row; delete o.col; }
		if (isdef(o.neighbors)) o.neighbors = o.neighbors.map(x => (x ? { _obj: x } : null));
		if (isdef(o.edges)) o.edges = o.edges.map(x => (x ? { _obj: x } : null));
		if (isdef(o.corners)) o.corners = o.corners.map(x => (x ? { _obj: x } : null));
		if (isdef(o.fields)) o.fields = o.fields.map(x => (x ? { _obj: x } : null));
		//console.log(o.obj_type, o)
		sdata[o.oid] = o;
	}

	Object.values(sdata).map(x => stripObject(x, ['x', 'y', 'x1', 'x2', 'y1', 'y2', 'thickness', 'w', 'h', 'done', 'rightField', 'leftField', 'startNode', 'endNode', 'poly']))
	//console.log(sdata);
	return sdata;
}
function genServerDataTtt(rows = 3, cols = 3) {
	let [mapData, topcols] = genMapData(rows, cols, 'regquad', ['X']);
	let shape = 'quad';

	//call SimpleGrid
	let b1 = new SimpleGrid('b1', {
		mapData: mapData,
		shape: shape,
		rows: rows,
		cols: cols,
		hasEdges: false,
		hasNodes: false,
		randomizeIds: true,
		mapData: mapData,
	});
	//console.log('board b1', b1);
	//return;

	//transform to board object as in serverData
	//example of serverData board:
	let sdata = {};
	let oidBoard = getUID();
	let board = simpleGridToServerData(b1);
	sdata[oidBoard] = board;
	board.oid = oidBoard;
	//console.log('board server object:', board);

	//make field objects
	let fields = Object.values(b1.objects).filter(x => x.obj_type == 'field');
	//console.log('fields', fields);

	let numbers = arrRange(2, 12);

	for (const oid in b1.objects) {
		let o = jsCopy(b1.objects[oid]);
		o.oid = o.id; delete o.id;
		o.obj_type = capitalize(o.obj_type); //.toCapital(); //toUpperCase(); //'Field';
		// o.row -= 1; //0 based!
		// o.col -= 1;
		if (o.obj_type == 'Field') {
			o.letter = b1.mapData[o.row][o.col];
			// o.res = resources[o.letter];
			// o.num = chooseRandom(numbers);
		} else { delete o.row; delete o.col; }
		if (isdef(o.neighbors)) o.neighbors = o.neighbors.map(x => (x ? { _obj: x } : null));
		if (isdef(o.edges)) o.edges = o.edges.map(x => (x ? { _obj: x } : null));
		if (isdef(o.corners)) o.corners = o.corners.map(x => (x ? { _obj: x } : null));
		if (isdef(o.fields)) o.fields = o.fields.map(x => (x ? { _obj: x } : null));
		//console.log(o.obj_type, o)
		sdata[o.oid] = o;
	}

	Object.values(sdata).map(x => stripObject(x, ['x', 'y', 'x1', 'x2', 'y1', 'y2', 'thickness', 'w', 'h', 'done', 'rightField', 'leftField', 'startNode', 'endNode', 'poly']))
	//console.log(sdata);
	return sdata;
}
//#endregion

//#region helpers
function _calc_hex_col_array(rows, topcols) {
	let colarr = []; //how many cols in each row
	for (let i = 0; i < rows; i++) {
		colarr[i] = topcols;
		if (i < (rows - 1) / 2) topcols += 1;
		else topcols -= 1;
	}
	return colarr;
}
function replaceNonEmptyByRandom(s, letters) {
	let res = '';
	for (const l of s) {
		if (l == ' ') res += ' '; else res += chooseRandom(letters);
	}
	return res;
}

//#endregion








