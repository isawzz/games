
function catan31() {
	//mach eine map
	let mapdata = [' W ', 'O Y', ' S '];
	let shape = 'hex';
	console.log('map',mapdata);

	//count letters in first row ... top cols = cols
	let line0 = mapdata[0];
	let cols = 0; for (const letter of line0) { if (letter != ' ') cols += 1; }

	//count rows
	let rows = mapdata.length;
	console.log('rows',rows,'cols',cols);

	//call SimpleGrid
	let b1 = new SimpleGrid('b1',{rows:rows,cols:cols,hasEdges:true,hasNodes:true,randomizeIds:true});
	console.log('board b1',b1)

	//transform to board object as in serverData
	//transform fields,edges,corners to sdata objects
	//return sdata
}





function catan00() {
	let map =
	{
		_ndarray: [
			[{ _obj: '3' }, null, { _obj: '4' }, null, { _obj: '5' }, null, { _obj: '6' }, null, null],
			[null, { _obj: '8' }, null, { _obj: '9' }, null, { _obj: '10' }, null, { _obj: '11' }, { _obj: '7' }],
			[{ _obj: '12' }, null, { _obj: '13' }, null, { _obj: '14' }, null, { _obj: '15' }, null, null],
			[null, { _obj: '16' }, null, { _obj: '17' }, null, { _obj: '18' }, null, null, null],
			[null, { _obj: '0' }, null, { _obj: '1' }, null, { _obj: '2' }, null, null, null]
		],
		_dtype: 'object'
	};

	let map1 =
	{
		_ndarray: [
			[null, { _obj: '0' }, null, { _obj: '1' }, null, { _obj: '2' }, null, null, null]
			[{ _obj: '3' }, null, { _obj: '4' }, null, { _obj: '5' }, null, { _obj: '6' }, null, null],
			[null, { _obj: '8' }, null, { _obj: '9' }, null, { _obj: '10' }, null, { _obj: '11' }, { _obj: '7' }],
			[{ _obj: '12' }, null, { _obj: '13' }, null, { _obj: '14' }, null, { _obj: '15' }, null, null],
			[null, { _obj: '16' }, null, { _obj: '17' }, null, { _obj: '18' }, null, null, null],
		],
		_dtype: 'object'
	};

	let map2 =
	{
		_ndarray: [
			[{ _obj: null, r: 0, c: 0 }, { _obj: '0', r: 0, c: 1 }, { _obj: null, r: 0, c: 2 }, { _obj: '1', r: 0, c: 3 }, { _obj: null, r: 0, c: 4 }, { _obj: '2', r: 0, c: 5 }, { _obj: null, r: 0, c: 6 }, { _obj: null, r: 0, c: 7 }, { _obj: null, r: 0, c: 8 }]
			[{ _obj: '3', r: 1, c: 0 }, { _obj: null, r: 1, c: 1 }, { _obj: '4', r: 1, c: 2 }, { _obj: null, r: 1, c: 3 }, { _obj: '5', r: 1, c: 4 }, { _obj: null, r: 1, c: 5 }, { _obj: '6', r: 1, c: 6 }, { _obj: null, r: 1, c: 7 }, { _obj: null, r: 1, c: 8 }],
			[{ _obj: null, r: 2, c: 0 }, { _obj: '8', r: 2, c: 1 }, { _obj: null, r: 2, c: 2 }, { _obj: '9', r: 2, c: 3 }, { _obj: null, r: 2, c: 4 }, { _obj: '10', r: 2, c: 5 }, { _obj: null, r: 2, c: 6 }, { _obj: '11', r: 2, c: 7 }, { _obj: '7', r: 2, c: 8 }],
			[{ _obj: '12', r: 3, c: 0 }, { _obj: null, r: 3, c: 1 }, { _obj: '13', r: 3, c: 2 }, { _obj: null, r: 3, c: 3 }, { _obj: '14', r: 3, c: 4 }, { _obj: null, r: 3, c: 5 }, { _obj: '15', r: 3, c: 6 }, { _obj: null, r: 3, c: 7 }, { _obj: null, r: 3, c: 8 }],
			[{ _obj: null, r: 4, c: 0 }, { _obj: '16', r: 4, c: 1 }, { _obj: null, r: 4, c: 2 }, { _obj: '17', r: 4, c: 3 }, { _obj: null, r: 4, c: 4 }, { _obj: '18', r: 4, c: 5 }, { _obj: null, r: 4, c: 6 }, { _obj: null, r: 4, c: 7 }, { _obj: null, r: 4, c: 8 }],
		],
		_dtype: 'object'
	};

	// '0',0,1 neighbors: '1',0,3   '3',1,0   '4',1,2
	// '2',0,5 neighbors: '1',0,3   '5',1,4   '6',1,6
	// '1',0,3 neighbors: '0',0,1   '2',0,5   '4',1,2   '5',1,4
	// '3',1,0 neighbors: '0',0,1   '4',1,2   '8',2,1   '7',2,8

	/*
		
	*/
	let mapdata = [' W ', 'O Y', ' S '];
	let shape = 'hex';
	let b = makeBoard(mapdata, shape);
	//console.log('board', b);
	for (const oid in b.sdata) {
		let o = b.sdata[oid];
		if (isdef(o.neighbors)) {
			//consout(o.neighbors.map(x => x)); //''+b.sdata[x._obj].row+','+b.sdata[x._obj].col));
		}
	}

}

function comp_() { return [...arguments].join('_'); }
function makeBoard(mapdata, shape) {
	let sdata = {};
	//for now only hex and quad shapes
	const hexNeiInc = [{ r: -1, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 1 }, { r: 1, c: -1 }, { r: 0, c: -2 }, { r: -1, c: -1 }];
	const quadNeiInc = [{ r: -1, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 0, c: -1 }];
	let neiInc = shape == 'hex' ? hexNeiInc : quadNeiInc;
	let b = { oid: getUID(), rows: mapdata.length, cols: mapdata[0].length, shape: shape, fields: [] };
	sdata[b.oid] = b;
	let byRC = {};
	for (let r = 0; r < b.rows; r++) {
		byRC[r] = {};
		for (let c = 0; c < b.cols; c++) {
			let letter = mapdata[r][c];
			if (letter == ' ') { byRC[r][c] = null; continue; }
			let f = makeField(r, c, { obj_type: 'Field', res: chooseRandom(['wood', 'brick']), num: chooseRandom([2, 4, 6, 8]) });
			sdata[f.oid] = f;
			b.fields.push(f.oid);
			byRC[r][c] = f;
		}
	}
	//console.log('board', b);
	for (let r = 0; r < b.rows; r++) {
		for (let c = 0; c < b.cols; c++) {
			let f = byRC[r][c];
			//console.log('field',f)
			if (!f) continue;
			//console.log('f byRC', r, c, f)
			f.neighbors = [];
			let len = neiInc.length;
			//set nei in clockwise order
			for (let i = 0; i < len; i++) {
				let inc = neiInc[i];
				//console.log('inc',inc)
				let iRow = r + inc.r;
				let iCol = c + inc.c;
				if (iRow < 0 || iCol < 0 || iRow >= b.rows || iCol >= b.cols) {
					f.neighbors.push(null);
				} else {
					let nei = byRC[iRow][iCol];
					f.neighbors.push({ _obj: nei.oid });
				}
			}
		}
	}

	//edges for first field
	let fields = b.fields.map(x => sdata[x]);
	//console.log('fields', fields);
	let help = {};
	for (const f of fields) {
		f.edges = [];
		f.corners = [];
		for (const x of f.neighbors) {
			//NE neighbor
			//make edge that has 2 oids: f.oid and nei.oid
			//let f2 = sdata[x];
			let e = makeEdge();
			sdata[e.oid] = e;

			let efields = [f.oid];

			if (x) {
				//console.log('daaaaaaaaaaa')
				efields.push(x._obj); efields.sort();
			}
			else efields.push(null);
			efields = efields.map(x => x ? x : null);

			f.edges.push({ _obj: e.oid });//??? or _obj:

			console.log(x, efields);

			e.fields = efields;

			//break;
		}
		//break;
	}

	return { sdata: sdata, board: b };
}
function makeEdge() {
	return { oid: getUID(), obj_type: 'Edge' };
}
function makeField(r, c, props) {
	let f = { oid: getUID(), row: r, col: c };
	for (const k in props) {
		f[k] = props[k];
	}
	return f;

}









