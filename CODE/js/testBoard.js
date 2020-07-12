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
	let mapdata=[' W ','O Y',' S '];
	let shape='hex';


}
function makeBoard(mapdata,shape){
	let b={oid:getUID(),rows:mapdata.length,cols:mapdata[0].length,shape:shape};
	for(let r=0;r<b.rows;r++){
		for(let c=0;c<b.cols;c++){
			let letter = mapdata[r][c];
			if (letter==' ') continue;
			let f=makeField(r,c,{obj_type:'Field',res:chooseRandom(['wood','brick']),num:chooseRandom([2,4,6,8])});

		}
	}
}
function makeField(r,c,props){
	let f={oid:getUID(),row:r,col:c};
	for (const k in props){
		f[k]=props[k];
	}
	return f;
	
}









