//#region june08

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
	let mapData = [' W ', 'O Y', ' S '];
	let shape = 'hex';
	let b = makeBoard(mapData, shape);
	//console.log('board', b);
	for (const oid in b.sdata) {
		let o = b.sdata[oid];
		if (isdef(o.neighbors)) {
			//consout(o.neighbors.map(x => x)); //''+b.sdata[x._obj].row+','+b.sdata[x._obj].col));
		}
	}

}
function comp_() { return [...arguments].join('_'); }
function makeBoard(mapData, shape) {
	let sdata = {};
	//for now only hex and quad shapes
	const hexNeiInc = [{ r: -1, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 1 }, { r: 1, c: -1 }, { r: 0, c: -2 }, { r: -1, c: -1 }];
	const quadNeiInc = [{ r: -1, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 0, c: -1 }];
	let neiInc = shape == 'hex' ? hexNeiInc : quadNeiInc;
	let b = { oid: getUID(), rows: mapData.length, cols: mapData[0].length, shape: shape, fields: [] };
	sdata[b.oid] = b;
	let byRC = {};
	for (let r = 0; r < b.rows; r++) {
		byRC[r] = {};
		for (let c = 0; c < b.cols; c++) {
			let letter = mapData[r][c];
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

			//console.log(x, efields);

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




//#region june07: habe current state in june07 dir gemoved (ganze files)
async function rParse_dep(source, context) {
	if (source == 'test') {
		let fStruct = context.fStruct;
		let options = context.options;
		let rTemp = makeTableTreeX(fStruct, options);
		let root = rTemp.root;

		if (root.params.sizing == 'sizeToContent') {
			recMeasureAbs(rTemp.tree.uid, rTemp);
			updateOutput(rTemp);
			adjustTableSize(rTemp);
		} else if (root.params.sizing == 'fixed') {
			let [minx, maxx, miny, maxy] = recMeasureArrangeFixedSizeAndPos(rTemp.tree.uid, rTemp);
			root.size = { w: maxx, h: maxy };
			root.ui.style.minWidth = (root.size.w + 4) + 'px';
			root.ui.style.minHeight = (root.size.h + 4) + 'px';
			adjustTableSize(rTemp);
		}
	} else if (source == 'main') {
		//supposedly context should contain spec,data,defs
		let sp = context.spec;
		let defs = context.defs;
		let sdata = context.sdata;
		T = R = new RSG(sp, defs, sdata);

		R.initialChannels = []; //do not provide anything here or ALL tests before 04 will fail!!!!
		ensureRtree(R);
		R.baseArea = 'table';
		createStaticUi(R.baseArea, R);
		addNewlyCreatedServerObjects(sdata, R);

		let uidRoot = R.tree.uid;
		R.rRoot = R.rNodes[uidRoot];
		R.uiRoot = R.root = R.uiNodes[uidRoot];

		recMeasureOverride(R.tree.uid, R);
		adjustTableSize(R);
		updateOutput(R);
		testEngine.verify(R);
	} else {

	}
	return R;
}

function arrangeFusion(uid, R) {
	//das macht mehr oder weniger was adjustLayout gemacht hat!!!
	//console.log('arrange', uid)
	let n = R.uiNodes[uid];

	if (nundef(n.children)) return { w: 0, h: 0 }

	// let w, h, res;
	if (n.type == 'grid') {
		resizeBoard(n, R);

		//only NOW arrange of children of board members is done!!! 
		for (const uidMember of n.children) {
			let tile = R.uiNodes[uidMember];
			if (nundef(tile.children)) continue;

			//simpleLayoutForOneChildPosition(n,tile,R);
			wrapLayoutPosition(n, tile, R);
		}
		return { w: n.wTotal, h: n.hTotal };

	} else if (n.uiType == 'd' && !startsWith(n.type, 'manual')) {

		return sizeToContent(n.uid, R);

		panelLayout(n, R);
		console.log('______________ : panel!')
		return { w: n.sizeMeasured.w, h: n.sizeMeasured.h };

		// if (root.params.sizing == 'sizeToContent') {
		// 	recMeasureAbs(rTemp.tree.uid, rTemp);
		// 	updateOutput(rTemp);
		// 	adjustTableSize(rTemp);
		// } else if (root.params.sizing == 'fixed') {
		// 	let [minx, maxx, miny, maxy] = recMeasureArrangeFixedSizeAndPos(rTemp.tree.uid, rTemp);
		// 	root.size = { w: maxx, h: maxy };
		// 	root.ui.style.minWidth = (root.size.w + 4) + 'px';
		// 	root.ui.style.minHeight = (root.size.h + 4) + 'px';
		// 	adjustTableSize(rTemp);
		// }


	} else if (n.info) {

		console.log('______________ : wrap!')
		//hier wird platzreservierung fuer children auf einem board member gemacht!!!!!!!
		// alle children kommen dann ja direkt auf das board selbst! sind aber immer noch node children von tile!!!
		//2 children case

		//new code: multiple children
		n.sizeNeeded = wrapLayoutSizeNeeded(n.children, R);
		//console.log('wrapLayoutSizeNeeded returned',n.sizeNeeded);

		//old code: only 1 child
		//n.sizeNeeded = simpleLayoutForOneChildSizeNeeded(n.children[0],R);

		//but: since relies on board sizing, need to resize board and arrange board first!
		let nBoard = R.uiNodes[n.uidParent];
		addResizeInfo(nBoard, n, n.sizeNeeded);
		// console.log('child', nChild.uid, 'needs', nChild.size, 'layout 1/1', '\nresizeInfo:', nBoard.resizeInfo);

		return { w: n.sizeNeeded.w, h: n.sizeNeeded.h };

	} else if (n.type == 'manual00') {
		console.log('______________ : manual00');
		standardLayout(n, R);
		return { w: n.sizeMeasured.w, h: n.sizeMeasured.h };

	} else {
		console.log('!!!!!!!!!!case NOT catched in arrangeOverride!!!!!!!!!!', n);

	}
	return res;
}
async function present00_(sp, defaults, sdata) {
	console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPP')
	T = R = new RSG(sp, defaults, sdata);

	//console.log('R',R,sp,defaults,sdata)

	//creation sequence:
	//wann und wie wird start channels bestimmt?
	//lets do that hardcoded for now!
	R.initialChannels = []; //do not provide anything here or ALL tests before 04 will fail!!!!
	//console.log(R)
	ensureRtree(R);

	R.baseArea = 'table'; //'basediv'
	createStaticUi(R.baseArea, R);

	addNewlyCreatedServerObjects(sdata, R);

	//recAdjustDirtyContainers(R.tree.uid, R, true);

	recMeasureOverride(R.tree.uid, R);

	//output and testing
	updateOutput(R);

	//for (let i = 0; i < 5; i++) testAddObject(R);
	//updateOutput(R);
	//activateUis(R);

	testEngine.verify(R);

	//setTimeout(onClickResizeBoard,500);

}


//uses deprecated relpos.js!
function testRelativePositioning() {
	let d = makeBaseDiv('basediv');
	//console.log(d);
	let letter = randomLetter();
	//console.log('letter is',letter);

	R = { rNodes: {}, uiNodes: {}, defs: DEFS };
	let n = R.tree = addRandomNode(null, R);

	let n1;
	for (let i = 0; i < 3; i++) {
		n1 = addRandomNode(n, R);
	}
	for (let i = 0; i < 3; i++) {
		addRandomNode(n1, R);
	}

	console.log('______________00present', R)
	R.baseArea = 'table';//'basediv';
	recUiTest(R.tree, R);
	//addRandomChildren(n,R);
	//console.log(R.tree);

	recMeasureOverride(R.tree.uid, R);
	//still need to set pos of root element!!!
	let root = R.uiNodes[R.tree.uid];
	let b = getBounds(d);
	let b1 = getBounds(root.ui);
	root.rpos = { left: b1.left - b.left, top: b1.top - b.top };
	root.apos = { left: b1.left, top: b1.top };

	recPositions(R.tree.uid, R);

	updateOutput(R);
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		let w = Math.round(n.size.w);
		let h = Math.round(n.size.h);
		let x = Math.round(n.apos.left);
		let y = Math.round(n.apos.top);
		let cx = Math.round(n.acenter.x);
		let cy = Math.round(n.acenter.y);

		console.log('=> ', uid, 'size = ' + w + ' x ' + h, 'pos = ' + x + ' x ' + y, 'cx', cx, 'cy', cy);
	}
}

//#region june06
function makeTestBoard(rows, cols, shape) {
	//shape quad
	let fieldSize = 50;
	let dims = { fieldSize: fieldSize };
	let bpos = {};

	for (let r = 0; r < rows; r++) {
		bpos[r] = {};
		y = r * fieldSize;
		for (let c = 0; c < cols; c++) {
			bpos[r][c] = { x: c * fieldSize, y: y };
		}
	}
	dims.positions = bpos;
	return dims;
}

//#region random pos and size
function recPosRandomUiTree(uid, R, wmax = 4, hmax = 2, gran = 10, usedPositions) {
	let n = R.uiNodes[uid];
	n.params.size = { w: randomNumber(1, wmax) * gran, h: randomNumber(1, hmax) * gran };
	n.params.pos = randomPos(wmax, hmax, gran);
	n.params.sizing = 'fixed';
	//console.log('pos and size set:', uid, n)
	if (nundef(n.children)) return;
	for (const ch of n.children) { recPosRandomUiTree(ch, R); }
}
var posArray; var posArrayRows; var posArrayCols;
function initPosArray(n, m) {
	posArray = []; posArrayRows = n; posArrayCols = m;
	for (let r = 0; r < n * m; r++) { posArray[r] = true; }
}
function randomPos(w, h, granularity = 20) {
	if (nundef(posArray)) return { x: randomNumber(2, w - 2), y: randomNumber(2, h - 2) };
	else {
		let len = posArray.length;
		let i = randomNumber(0, len - 1);
		while (!posArray[i]) i = (i + 1) % len;
		posArray[i] = false;
		return { y: Math.floor(i / posArrayRows) * granularity, x: i % posArrayCols * granularity };
		// let rows = posArray.length;
		// let cols = posArray[0].length;
		// let r = randomNumber(0, rows - 1);
		// let c = randomNumber(0, cols - 1);
		// while (!posArray[r][c]) { }
	}
}
//#endregion

function fixedSizePos(uid) {

	console.log('fixedSizePos_', uid);
	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.params.left)) return sizeToContent(uid);

	//assuming all nodes have set position
	if (isdef(n.params.left)) {
		console.log('style of', n.uid, n.ui.style);

		n.size = { w: n.params.width, h: n.params.height };
		n.pos = { x: n.params.left, y: n.params.top, cx: n.params.left + n.size.w / 2, cy: n.params.top + n.size.h / 2 };
		n.ui.style.position = 'absolute';
		n.ui.style.left = 20 + 'px';
		n.ui.style.top = 20 + 'px';
		n.ui.style.width = n.params.width + 'px';
		n.ui.style.backgroundColor = 'red'
		n.ui.style.height = n.params.height + 'px';

	}

	if (nundef(n.children)) return { w: 0, h: 0 }
	let children = n.children.map(x => R.uiNodes[x]);

	let minx, miny, maxx, maxy;
	for (const n1 of children) {
		if (nundef(n1.pos)) continue;
		minx = Math.min(minx, n1.pos.x);
		maxx = Math.max(maxx, n1.pos.x + n1.size.w);
		miny = Math.min(miny, n1.pos.y);
		maxy = Math.max(maxy, n1.pos.y + n1.size.h);
		fixedSizePos(uid);
	}

	return { w: maxx - minx, h: maxy - miny };
}

function recMeasureArrangeFixedSizeAndPos1(uid, R) {
	//console.log('measureAbs', uid);
	let n = R.uiNodes[uid];

	let [minx, maxx, miny, maxy] = [100000, 0, 100000, 0];
	if (isdef(n.children)) {

		for (const ch of n.children) {
			let [xmin, xmax, ymin, ymax] = recMeasureArrangeFixedSizeAndPos(ch, R);
			minx = Math.min(minx, xmin);
			maxx = Math.max(maxx, xmax);
			miny = Math.min(miny, ymin);
			maxy = Math.max(maxy, ymax);
		}
	} else {
		console.log('===>LEAF');
		//LEAF what shoul this return???
		//supposedly it does have n.pos and n.size set
		//it should return 
		setFixedSizeAndPos(n);
		let b = getBounds(n.ui);
		// console.log(b, n.size);
		return [n.pos.x, n.pos.x + b.width, n.pos.y, n.pos.y + b.height];

	}


	//set size and pos, there is no arrange actually!
	if (nundef(n.params.pos)) return [minx, maxx, miny, maxy];
	setFixedSizeAndPos(n);
	minx = Math.min(minx, n.pos.x);
	maxx = Math.max(maxx, n.pos.x + n.size.w);
	miny = Math.min(miny, n.pos.y);
	maxy = Math.max(maxy, n.pos.y + n.size.h);
	return [minx, maxx, miny, maxy];



}

function arrangeAbs(uid, R) {

	return fixedSizePos(uid);
	return sizeToContent(uid);

}

function sizeToContent(uid, r) {

	console.log('sizeToContent!!!!!!!!!!!!!!!!!!!');
	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	//params that influence this layout
	let or = n.params.orientation;
	// let centered = true;// n.params.baseline == 'center';// n.params.sizing == 'sizeToContent';

	console.log('or', uid, 'is', or);

	//berechne wTitle und y0
	let y0 = 0;
	let wTitle = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wTitle = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wTitle += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;

	console.log('wTitle', wTitle, 'y0', y0);
	//have wTitle and y0 right unter title!
	let children = n.children.map(x => R.uiNodes[x]);

	let axMain, ax2;
	if (or == 'v') {
		axMain = 'h';
		ax2 = 'w';
	} else {
		axMain = 'w';
		ax2 = 'h';

	}
	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	let wmax = (or == 'v' ? ax2Max : axMainSum);//!!!
	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('x', x, 'y', y)
	console.log('wTitle', wTitle, 'maxChildWidth', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];

	for (const n1 of children) {
		if (or == 'v') {
			x = x0 + (ax2Max - n1.size[ax2]) / 2;
			//x = x0 + centered? (ax2Max - n1.size[ax2]) / 2:0;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };

			y += n1.size[axMain];
			if (n1 != lastChild) y += childMargin;
		} else {
			y = y0 + (ax2Max - n1.size[ax2]) / 2;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			// let ui = n1.ui;
			// ui.style.left = n1.pos.x + 'px';
			// ui.style.top = n1.pos.y + 'px';
			x += n1.size.w;
			if (n1 != lastChild) x += childMargin;

			// y = y0 + (ax2Max - n1.size[ax2]) / 2;
			// y = y0 + centered?(ax2Max - n1.size[ax2]) / 2:0;
			// n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			// x += n1.size.w;
			// if (n1 != lastChild) x += childMargin;
		}

		n1.ui.style.left = n1.pos.x + 'px';
		n1.ui.style.top = n1.pos.y + 'px';

	}
	console.log('wTitle', wTitle, 'x', x, 'y', y)

	let wParent, hParent;
	if (or == 'v') {
		wParent = Math.max(wTitle + parentPadding * 2, ax2Max + 2 * x0);
		hParent = y + parentPadding;
	} else {
		wParent = Math.max(wTitle + parentPadding * 2, x + parentPadding);
		hParent = y0 + ax2Max + parentPadding;
	}
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };

}

//#region orig absLayoutTests
const absLayoutTestsSolutions =
{
	"0": {
		"_1": {
			"w": 69,
			"h": 103
		},
		"_2": {
			"w": 19,
			"h": 19
		},
		"_3": {
			"w": 19,
			"h": 19
		},
		"_4": {
			"w": 23,
			"h": 82
		},
		"_5": {
			"w": 19,
			"h": 19
		},
		"_6": {
			"w": 19,
			"h": 19
		},
		"_7": {
			"w": 19,
			"h": 19
		}
	},
	"1": {
		"_8": {
			"w": 80,
			"h": 103
		},
		"_9": {
			"w": 19,
			"h": 19
		},
		"_10": {
			"w": 24,
			"h": 19
		},
		"_11": {
			"w": 28,
			"h": 82
		},
		"_12": {
			"w": 24,
			"h": 19
		},
		"_13": {
			"w": 24,
			"h": 19
		},
		"_14": {
			"w": 24,
			"h": 19
		}
	},
	"2": {
		"_15": {
			"w": 86,
			"h": 103
		},
		"_16": {
			"w": 24,
			"h": 19
		},
		"_17": {
			"w": 24,
			"h": 19
		},
		"_18": {
			"w": 82,
			"h": 40
		},
		"_19": {
			"w": 24,
			"h": 19
		},
		"_20": {
			"w": 24,
			"h": 19
		},
		"_21": {
			"w": 24,
			"h": 19
		}
	},
	"3": {
		"_22": {
			"w": 139,
			"h": 61
		},
		"_23": {
			"w": 24,
			"h": 19
		},
		"_24": {
			"w": 24,
			"h": 19
		},
		"_25": {
			"w": 82,
			"h": 40
		},
		"_26": {
			"w": 24,
			"h": 19
		},
		"_27": {
			"w": 24,
			"h": 19
		},
		"_28": {
			"w": 24,
			"h": 19
		}
	},
	"4": {
		"_29": {
			"w": 32,
			"h": 145
		},
		"_30": {
			"w": 24,
			"h": 19
		},
		"_31": {
			"w": 24,
			"h": 19
		},
		"_32": {
			"w": 28,
			"h": 82
		},
		"_33": {
			"w": 24,
			"h": 19
		},
		"_34": {
			"w": 24,
			"h": 19
		},
		"_35": {
			"w": 24,
			"h": 19
		}
	},
	"5": {
		"_36": {
			"w": 147,
			"h": 124
		},
		"_37": {
			"w": 24,
			"h": 19
		},
		"_38": {
			"w": 24,
			"h": 19
		},
		"_39": {
			"w": 143,
			"h": 61
		},
		"_40": {
			"w": 55,
			"h": 40
		},
		"_43": {
			"w": 24,
			"h": 19
		},
		"_44": {
			"w": 24,
			"h": 19
		},
		"_41": {
			"w": 24,
			"h": 19
		},
		"_42": {
			"w": 55,
			"h": 40
		},
		"_45": {
			"w": 24,
			"h": 19
		},
		"_46": {
			"w": 24,
			"h": 19
		}
	},
	"6": {
		"_47": {
			"w": 174,
			"h": 103
		},
		"_48": {
			"w": 24,
			"h": 19
		},
		"_49": {
			"w": 24,
			"h": 19
		},
		"_50": {
			"w": 116,
			"h": 82
		},
		"_51": {
			"w": 28,
			"h": 61
		},
		"_54": {
			"w": 24,
			"h": 19
		},
		"_55": {
			"w": 24,
			"h": 19
		},
		"_52": {
			"w": 24,
			"h": 19
		},
		"_53": {
			"w": 55,
			"h": 40
		},
		"_56": {
			"w": 24,
			"h": 19
		},
		"_57": {
			"w": 24,
			"h": 19
		}
	}
};
const absLayoutTests = {
	0: { func: makeTree33, params: { rootContent: true, extralong: false, params: { '_3': { fg: 'red', orientation: 'v' } } } },
	1: { func: makeTree33, params: { rootContent: true, extralong: false, params: { '_3': { orientation: 'v' } } } },
	2: { func: makeTree33, params: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' } } } },
	3: { func: makeTree33, params: { rootContent: true, extralong: false, params: { '_1': { orientation: 'v' } } } },
	4: { func: makeTree33, params: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' }, '_3': { orientation: 'v' } } } },
	5: { func: makeTree332x2, params: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' } } } },
	6: { func: makeTree332x2, params: { rootContent: true, extralong: false, params: { '_4': { orientation: 'v' } } } },
	7: { func: makeTree332x2, params: { rootContent: true, extralong: false, params: { '_6': { orientation: 'v' } } } },
};

var iAbsLayoutTest = 0;
function runAllAbsLayoutTests() {
	console.log('resetting AbsLayoutTests')
	iAbsLayoutTest = 0;
	startTestLoop();
	//testDict = {};

}
function isLastTest() {
	let numtests = Object.keys(absLayoutTests).length;
	//console.log('iAbsLayoutTest',iAbsLayoutTest,'numtests-1',numtests-1);
	return iAbsLayoutTest >= numtests - 1;
}
function startAbsTestLoop() {
	if (isLastTest()) {
		console.log('TESTS COMPLETED!');
	} else {
		nextAbsLayoutTest();
		if (!isLastTest()) setTimeout(startTestLoop, 1000);
	}
}
function nextAbsLayoutTest() {
	if (isLastTest()) {
		console.log('press next test again');
		return;
	}
	clearElement('table'); mBy('table').style.minWidth = 0; mBy('table').style.minHeight = 0;
	//console.log('halooooooooooooo')
	// console.log('iAbsLayoutTest',iAbsLayoutTest)
	// if (nundef(absLayoutTests[iAbsLayoutTest])){
	// 	console.log('sollte da nicht hinein!',iAbsLayoutTest);
	// 	iAbsLayoutTest+=1;
	// 	return;
	// }
	let { func, params } = absLayoutTests[iAbsLayoutTest];
	//console.log('test', iAbsLayoutTest, func, params);
	let root = makeTableTreeX(func, params);
	recMeasureAbs(R.tree.uid, R);
	updateOutput(R);
	adjustTableSize(R);
	let sols = {};
	recCollectSolutions(R.uiNodes[R.tree.uid], R, sols);
	//console.log('solutions to test', iAbsLayoutTest, sols);
	let changes = propDiffSimple(sols, absLayoutTestsSolutions[iAbsLayoutTest]);
	if (changes.hasChanged) {
		console.log('verifying test case', iAbsLayoutTest, 'FAIL!!!!!!!');
		//console.log('FAIL!!! ' + this.index, '\nis:', rTreeNow, '\nshould be:', rTreeSolution);
		console.log('changes:', changes)
	} else {
		console.log('verifying test case', iAbsLayoutTest, 'correct!');
		// console.log('*** correct! ', this.index, '***', rTreeNow)
	}

	testDict[iAbsLayoutTest] = sols;
	let len = Object.keys(absLayoutTests).length;
	iAbsLayoutTest += 1;// (iAbsLayoutTest + 1) % len;
	//console.log('iAbsLayoutTest incremented to',iAbsLayoutTest)
	if (isLastTest()) {
		console.log('last test in series! NOW should download solutions!');
		downloadFile(testDict, 'testDict');
	}
}
function testAbsolutePositioning() {

	//let root=makeTableTreeX(makeSimplestTree);
	//let root=makeTableTreeX(makeSimplestTree,{rootContent:false});
	//let root = makeTableTreeX(makeSimpleTree);
	//let root = makeTableTreeX(makeSimpleTree,{ rootContent: true, extralong: false, params: { '_1': { orientation: 'v' } } });
	//let root = makeTableTreeX(makeSimpleTree,{rootContent:false});
	// let root = makeTableTreeX(makeTree33,{rootContent:false});
	//let root = makeTableTreeX(makeTree332x2);
	//let root = makeTableTreeX(makeTree332x2,{rootContent:false});
	//let root = makeTableTreeX(()=>makeSimpleTree(20),{rootContent:false});
	//let root = makeTableTreeX(makeSimplestTree,{rootContent:true,extralong:true});
	//let root = makeTableTreeX(makeTree33,{rootContent:true,extralong:true});
	//let root = makeTableTreeX(()=>makeSimpleTree(3),{rootContent:true,extralong:true});
	//let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: false, params: { '_1': { orientation: 'v' } } });
	//let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: false, params: { '_4': { orientation: 'v' } } });
	//let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: false, params: { '_2': { orientation: 'v' } } });
	// let root = makeTableTreeX(makeTree33, {
	// 	rootContent: true, extralong: false, params: {
	// 		'_1': { bg: 'black', orientation: 'v' },
	// 		'_4': { bg: 'inherit', orientation: 'v' }
	// 	}
	// });

	//mixed!
	//let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: true, params: { '_1': { orientation: 'v' } } });
	let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: true, params: { '_3': { orientation: 'v' } } });

	recMeasureAbs(R.tree.uid, R);

	updateOutput(R);

	adjustTableSize(R);
}
//#endregion obsolete

//#region june05
function horizontalSizeToContentCentered(uid, r) {

	console.log('horizontalSizeToContent');
	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	//berechne wTitle und y0
	let y0 = 0;
	let wTitle = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wTitle = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wTitle += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;

	//have wTitle and y0 right unter title!
	let children = n.children.map(x => R.uiNodes[x]);

	let axMain = 'w';//!!!
	let ax2 = 'h';//!!!
	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	let wmax = axMainSum;//!!!

	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wmin', wTitle, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];

	for (const n1 of children) {
		y = y0 + (ax2Max - n1.size[ax2]) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';
		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
	}
	let wParent = Math.max(wTitle + parentPadding * 2, x + parentPadding);
	let hParent = y0 + ax2Max + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };

}


function sizeToContentCentered(uid, r) {

	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	//params that influence this layout
	let or = n.params.orientation;
	let centered = n.params.baseline == 'center';// n.params.sizing == 'sizeToContent';

	console.log('or', uid, 'is', or);

	//berechne wTitle und y0
	let y0 = 0;
	let wTitle = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wTitle = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wTitle += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;

	console.log('wTitle', wTitle, 'y0', y0);
	//have wTitle and y0 right unter title!
	let children = n.children.map(x => R.uiNodes[x]);

	let axMain, ax2;
	if (or == 'v') {
		axMain = 'h';//!!!
		ax2 = 'w';//!!!
	} else {
		axMain = 'w';//!!!
		ax2 = 'h';//!!!

	}
	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	// let ax2Max = Math.max(...children.map(x => x.size.w));
	// let axMainSum = children.reduce((a, b) => a + (b.size.h || 0), 0);
	// axMainSum += childMargin * (children.length - 1);

	//***********HERE */
	//immer noch xoffset berechnen, nur statt sumChidrenWidth hab jetzt maxChildWidth

	// let xoff = 0;
	// if (wTitle > ax2Max) xoff = (wTitle - ax2Max) / 2;
	// let x0 = parentPadding + xoff;
	// let x = x0;
	// let y = y0;


	let wmax = (or == 'v' ? ax2Max : axMainSum);//!!!
	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('x', x, 'y', y)
	console.log('wTitle', wTitle, 'maxChildWidth', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];

	for (const n1 of children) {

		if (or == 'v') {
			x = x0 + centered ? (ax2Max - n1.size[ax2]) / 2 : 0;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			y += n1.size[axMain];
			if (n1 != lastChild) y += childMargin;
		} else {
			y = y0 + centered ? (ax2Max - n1.size[ax2]) / 2 : 0;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			x += n1.size.w;
			if (n1 != lastChild) x += childMargin;
		}

		n1.ui.style.left = n1.pos.x + 'px';
		n1.ui.style.top = n1.pos.y + 'px';

	}
	console.log('wTitle', wTitle, 'x', x, 'y', y)

	let wParent, hParent;
	if (or == 'v') {
		wParent = Math.max(wTitle + parentPadding * 2, ax2Max + 2 * x0);
		hParent = y + parentPadding;
	} else {
		wParent = Math.max(wTitle + parentPadding * 2, x + parentPadding);
		hParent = y0 + ax2Max + parentPadding;
	}
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };

}
//#region abs layout variants
function arrangeAbs(uid, R) {

	let n = R.uiNodes[uid];	//n is the parent
	if (n.params.orientation == 'v') return verticalSizeToContentCentered(uid, R);
	else return horizontalSizeToContentCentered(uid, R);

}
function horizontalSizeToContentCentered(uid, r) {
	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	//berechne wTitle und y0
	let y0 = 0;
	let wTitle = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wTitle = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wTitle += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;

	//have wTitle and y0 right unter title!
	let children = n.children.map(x => R.uiNodes[x]);

	let axMain = 'w';//!!!
	let ax2 = 'h';//!!!
	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	let wmax = axMainSum;//!!!
	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wmin', wTitle, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];

	for (const n1 of children) {
		y = y0 + (ax2Max - n1.size[ax2]) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';
		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
	}
	let wParent = Math.max(wTitle + parentPadding * 2, x + parentPadding);
	let hParent = y0 + ax2Max + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };

}
function verticalSizeToContentCentered(uid, r) {
	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	//berechne wTitle und y0
	let y0 = 0;
	let wTitle = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wTitle = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wTitle += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;

	//have wTitle and y0 right unter title!
	let children = n.children.map(x => R.uiNodes[x]);

	let axMain = 'h';//!!!
	let ax2 = 'w';//!!!
	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	// let ax2Max = Math.max(...children.map(x => x.size.w));
	// let axMainSum = children.reduce((a, b) => a + (b.size.h || 0), 0);
	// axMainSum += childMargin * (children.length - 1);

	//***********HERE */
	//immer noch xoffset berechnen, nur statt sumChidrenWidth hab jetzt maxChildWidth

	// let xoff = 0;
	// if (wTitle > ax2Max) xoff = (wTitle - ax2Max) / 2;
	// let x0 = parentPadding + xoff;
	// let x = x0;
	// let y = y0;

	let wmax = ax2Max;//!!!
	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wTitle', wTitle, 'maxChildWidth', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];

	for (const n1 of children) {

		if (axMain == 'h') {
			x = x0 + (ax2Max - n1.size[ax2]) / 2;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			y += n1.size[axMain];
			if (n1 != lastChild) y += childMargin;
		} else {
			y = y0 + (ax2Max - n1.size[ax2]) / 2;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			x += n1.size.w;
			if (n1 != lastChild) x += childMargin;
		}

		n1.ui.style.left = n1.pos.x + 'px';
		n1.ui.style.top = n1.pos.y + 'px';

	}
	let wParent = Math.max(wTitle + parentPadding * 2, ax2Max + 2 * x0);

	let hParent = y + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };

}

function recPositionsAbs(uid, R) {
	let n = R.uiNodes[uid];
	if (!n.uidParent) {
		n.pos = { left: 0, top: 0 };
		n.apos = jsCopy(n.pos);
		n.rpos = jsCopy(n.pos);
	} else {
		nParent = R.uiNodes[n.uidParent];
		n.apos = {
			left: nParent.apos.left + n.rpos.left,
			top: nParent.apos.top + n.rpos.top
		};
		n.pos = jsCopy(n.apos);
	}
	n.rcenter = {
		x: n.rpos.left + n.size.w / 2,
		y: n.rpos.top + n.size.h / 2
	};
	n.acenter = {
		x: n.apos.left + n.size.w / 2,
		y: n.apos.top + n.size.h / 2
	};
	if (nundef(n.children)) {
		//console.log('no children', n.uid)
		return;
	}
	for (const uidChild of n.children) {
		recPositionsAbs(uidChild, R);
	}
}


function absLayout(n, R) {
	//arrange children of n and return size needed
	//is n resized here??? NO
	let b = getBounds(n.ui);

	let maxBottom = 0;
	let maxRight = 0;
	for (const uid of n.children) {
		let n1 = R.uiNodes[uid];
		let b1 = getBounds(n1.ui);
		//console.log(b1)
		n1.rpos = { left: b1.left - b.left, top: b1.top - b.top };
		n1.apos = { left: b1.left, top: b1.top };
		let m = n1.cssParams.margin; if (nundef(m)) m = 0;
		let bottom = b1.bottom + m - b.top;
		let right = b1.right + m - b.left;
		if (bottom > maxBottom) maxBottom = bottom;
		if (right > maxRight) maxRight = right;
		//console.log('BR', bottom, right);
	}
	return { w: maxRight, h: maxBottom };
}



function mixedOr2() {
	let params = {
		'_1': { bg: 'black', orientation: 'v' },
		'_4': { bg: 'inherit', orientation: 'v' }
	};
	let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: false, params: params });
	return root;
}
function mixedOrientation() {
	let root = makeTableTreeX(makeTree33, {
		rootContent: true, extralong: false,
		params: {
			'_1': { bg: 'black', orientation: 'v' },
			'_4': { bg: 'inherit', orientation: 'v' }
		}
	});
	//_1 soll type v bekommen!
	root.params.orientation = 'v';
	return root;
}


function makeTableTree(fStruct, rootContent = true, extralong = false) {
	R = fStruct();
	if (!rootContent) delete R.tree.content; else if (extralong) R.tree.content = 'hallo das ist ein besonders langer string!!!';
	let d = mBy('table');
	d.style.position = 'relative';
	R.baseArea = 'table';
	recUiTest(R.tree, R);
	let root = R.root = R.uiNodes[R.tree.uid];
	//root.ui.position='relative';
	return root;
}

function arrangeAbsHorizontalFinal(uid, R) {

	let n = R.uiNodes[uid];	//n is the parent

	if (nundef(n.children)) return { w: 0, h: 0 }

	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,yCentered
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;

	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wmin = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wmin += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let children = n.children.map(x => R.uiNodes[x]);
	let hmax = Math.max(...children.map(x => x.size.h));
	let wmax = children.reduce((a, b) => a + (b.size.w || 0), 0);
	wmax += childMargin * (children.length - 1);
	let xoff = 0;
	if (wmin > wmax) xoff = (wmin - wmax) / 2;
	//console.log('hmax',hmax,'wmax',wmax);
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wmin', wmin, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];
	for (const n1 of children) {
		y = y0 + (hmax - n1.size.h) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';
		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
	}
	let wParent = Math.max(wmin + parentPadding * 2, x + parentPadding);

	let hParent = y0 + hmax + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}

function simplestContent() { return makeTableTree(makeSimplestTree); }
function simplestNoContent() { return makeTableTree(makeSimplestTree, false); }
function simple2Content() { return makeTableTree(makeSimpleTree); }
function simple2NoContent() { return makeTableTree(makeSimpleTree, false); }
function arrangeAbs_final(uid, R) {
	let n = R.uiNodes[uid];	//n is the parent

	if (nundef(n.children)) return { w: 0, h: 0 }

	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,yCentered
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;

	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wmin = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wmin += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let children = n.children.map(x => R.uiNodes[x]);
	let hmax = Math.max(...children.map(x => x.size.h));
	let wmax = children.reduce((a, b) => a + (b.size.w || 0), 0);
	wmax += childMargin * (children.length - 1);
	let xoff = 0;
	if (wmin > wmax) xoff = (wmin - wmax) / 2;
	//console.log('hmax',hmax,'wmax',wmax);
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wmin', wmin, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];
	for (const n1 of children) {
		y = y0 + (hmax - n1.size.h) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';
		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
	}
	let wParent = Math.max(wmin + parentPadding * 2, x + parentPadding);

	let hParent = y0 + hmax + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}
function arrangeAbs_0(uid, R) {
	//das macht mehr oder weniger was adjustLayout gemacht hat!!!
	//console.log('arrangeAbs', uid)
	let n = R.uiNodes[uid];

	if (nundef(n.children)) return { w: 0, h: 0 }

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		//console.log('first child of parent is', cont);
		let b = getBounds(cont, true);
		//console.log('size of first child is', b.width, b.height);
		//console.log('bounds', b)
		wmin = b.width + 2 * GAP;
		y0 = GAP + b.top + b.height + GAP;
	} else y0 = GAP;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let x0 = GAP;
	let x = x0;
	let y = y0;
	let hmax = 0;
	for (const uid of n.children) {
		let n1 = R.uiNodes[uid];
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';

		x += n1.size.w + GAP;
		//y bleibt gleich!
		if (n1.size.h > hmax) hmax = n1.size.h
	}
	let wParent = Math.max(wmin, x) + 2 * PADDING;
	let hParent = y0 + hmax + 2 * GAP + PADDING;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}
function arrangeAbs_1(uid, R) {
	//das macht mehr oder weniger was adjustLayout gemacht hat!!!
	//console.log('arrangeAbs', uid)
	let n = R.uiNodes[uid];
	//n is the parent
	//let parentMargin = isdef(n.margin)?n.margin:PARENT_MARGIN;
	let parentPadding = PADDING;// 
	//parentPadding = isdef(n.params.padding)?n.params.padding:PADDING;
	let childMargin = GAP;//CHILD_MARGIN;


	if (nundef(n.children)) return { w: 0, h: 0 }

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,yCentered
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;
	console.log('wmin', wmin)

	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		//console.log('first child of parent is', cont);
		let b = getBounds(cont, true);
		//console.log('size of first child is', b.width, b.height);
		//console.log('bounds', b)
		wmin = b.width + 2 * parentPadding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let x0 = parentPadding;
	let x = x0;
	let y = y0;
	let children = n.children.map(x => R.uiNodes[x]);
	let hmax = Math.max(...children.map(x => x.size.h));
	//console.log('hmax is',children,hmax);
	//let hmax = 0;
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];
	for (const n1 of children) {
		//let n1 = R.uiNodes[uid];

		//if (n1.params.margin) childMargin = n1.params.margin;
		//console.log('childMargin',childMargin);

		y = y0 + (hmax - n1.size.h) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';

		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
		//y bleibt gleich!
		//if (n1.size.h > hmax) hmax = n1.size.h
	}
	let wParent = Math.max(wmin, x) + parentPadding;
	let hParent = y0 + hmax + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}

//#region june01
function transformParentsToBags(parents, R) {
	let parentPanels = [];
	for (const p of parents) {
		let nParent = R.uiNodes[p];
		let uidNewParent = p;
		// if parent has no child at all, make invisible container and use that for loc node
		if (isEmpty(nParent.children)) {
			console.log('parent', p, 'does NOT have any child!');

			//create an invisible node 
			let nPanel = addInvisiblePanel(p, R);
			uidNewParent = nPanel.uid;
			//also need to create uiNode for this panel!

			console.log(nParent);
			//parentPanels.push(nPanel.uid);
		}

		parentPanels.push(uidNewParent);
		//if this parent already has a child that is a container,
		//dann kann ich diesen container als echten parent nehmen

		//sonst mache einen container

		//was wenn parent genau 1 child hat aber das ist NICHT ein container?
		//dann mache ein weiteres child das ein container ist


	}
	console.log('parentPanels', parentPanels)
	return parentPanels;

}
function addInvisiblePanel(uidParent, R) {
	let uid = getUID();
	let n = { uid: uid, uidParent: uidParent, type: 'invisible' };
	R.rNodes[uid] = n;
	let rParent = R.rNodes[uidParent];
	if (nundef(rParent.children)) rParent.children = [];
	rParent.children.push(uid);
	recUi(n, uidParent, R);
	return n;
}

















