//#region orig measureArrange
function recMeasureOverride(uid, R) {
	//console.log('measure', uid);
	let n = R.uiNodes[uid];

	if (isdef(n.children)) { for (const ch of n.children) { recMeasureOverride(ch, R); } }
	n.sizeMeasured = calcSizeMeasured(n, R);
	n.sizeNeeded = arrangeOverride(n, R);

	//if (uid == R.tree.uid) { console.log('hallooooooo', uid, n.sizeNeeded, n.sizeMeasured) }
	n.size = {
		w: Math.max(n.sizeMeasured.w, n.sizeNeeded.w),
		h: Math.max(n.sizeMeasured.h, n.sizeNeeded.h)
	}
	//console.log('final size', n.uid, n.size);
	//showSizes(n, R);
}
function arrangeOverride(n, R) {

	if (nundef(n.children)) return { w: 0, h: 0 }


	if (isdef(RLAYOUT[n.type])) {
		//console.log('uid', n.uid, 'FOUND RLAYOUT FUNC type=' + n.type, RLAYOUT[n.type].name)
		return RLAYOUT[n.type](n, R);
	}

	if (n.type == 'grid') {
		console.log('should have been done')
	} else if (n.type == 'hand') {
		console.log('should have been done')

		let szNeeded = handLayout(n, R);
		return szNeeded;

	} else if (n.info) {
		//console.log('uid', n.uid, 'wrapLayoutSizeNeeded wird fuer type=' + n.type, 'ausgerufen!!!! weil n.info gesetzt!')
		n.sizeNeeded = wrapLayoutSizeNeeded(n.children, R);
		let nBoard = R.uiNodes[n.uidParent];
		addResizeInfo(nBoard, n, n.sizeNeeded);
		return { w: n.sizeNeeded.w, h: n.sizeNeeded.h };

	} else if (n.uiType == 'd') {
		//console.log('uid', n.uid, '===> (panelLayout_) type=' + n.type)
		let szNeeded = panelLayout(n, R);
		//console.log('height needed returned from panelLayout_',szNeeded.h)
		return szNeeded;

	} else {
		console.log('!!!!!!!!!!case NOT catched in arrangeOverride_!!!!!!!!!!', n);

	}
	return res;
}
function calcSizeMeasured(n, R) {
	// let n = R.uiNodes[uid];
	if (isdef(n.info)) { //board member
		return { w: n.info.size, h: n.info.size };

	} else if (n.type == 'grid') {
		calcBoardDimensions(n, R);
		return { w: n.wTotal, h: n.hTotal };
	} else if (n.type == 'hand' || n.ui.style.display == 'flex' && isdef(n.children)) { //$$$

		//consout('ALERT!!! flex style:measure AFTER arrange!!!',n.uid);
		return { w: 0, h: 0 };
	} else {


		let b = getBounds(n.ui, true);

		//if (n.uid == R.tree.uid) { consout_('222222', n.uid, n.type, '\ndisplay', n.ui.style.display, b.height) }

		return { w: b.width, h: b.height };
	}
}

function addResizeInfo(nBoard, nMember, sizeNeeded) {
	//console.log('addrrrrrrrrrrrrrrrrr')
	let szNeeded = Math.max(sizeNeeded.w, sizeNeeded.h);
	if (nMember.info.size < szNeeded) {
		//console.log('szNeeded',szNeeded)
		let memType = nMember.info.memType;
		let newSize = Math.max(sizeNeeded.w, sizeNeeded.h);
		newSize = Math.ceil(newSize / 4);
		newSize *= 4;
		if (newSize % 4 != 0) newSize += 4;
		let key = memType + 's';

		//instead of edge resize do field resize
		if (memType == 'edge') {
			newSize *= 2;
			memType = 'field';
			key = 'fields';
		}
		if (nundef(nBoard.resizeInfo)) nBoard.resizeInfo = {};
		if (nundef(nBoard.resizeInfo[key]) || nBoard.resizeInfo[key] < newSize) {
			//console.log('updating resizeInfo')
			nBoard.resizeInfo[key] = newSize;
			nMember.sizeNeeded = { w: newSize, h: newSize }

			//if node resize, in addition to node resize
			if (key == 'corners') {
				//how to find field size?
				let fSize = isdef(nBoard.resizeInfo.fields);
				if (nundef(fSize)) {

					let f0 = R.uiNodes[nBoard.children[0]];
					fSize = f0.info.size;
				}
				if (fSize < newSize * 3) {
					nBoard.resizeInfo.fields = newSize * 3;
				}
			}
		}
		nBoard.adirty = nMember.adirty = true;
	}
}

//#region abspos
// Function: recMeasureArrangeFixedSizeAndPos
// assumes that all children of uid have n.params.size and n.params.pos
// 
function recMeasureArrangeFixedSizeAndPos(uid, R) {
	//console.log('measureAbs', uid);
	let n = R.uiNodes[uid];

	let [minx, maxx, miny, maxy] = [100000, 0, 100000, 0];
	if (isdef(n.children)) {

		//calculate maximal dimensions to fit all children's x,y,w,h
		for (const ch of n.children) {
			let [xmin, xmax, ymin, ymax] = recMeasureArrangeFixedSizeAndPos(ch, R);
			minx = Math.min(minx, xmin);
			maxx = Math.max(maxx, xmax);
			miny = Math.min(miny, ymin);
			maxy = Math.max(maxy, ymax);
		}

		//kann das ueberhaupt vorkommen???????
		if (nundef(n.params.pos)) {
			//console.log('parent has no position set!!!', uid)
			return [minx, maxx, miny, maxy];
		}

		//console.log('__________ ', uid)
		//console.log('children need', 'x', minx, maxx, 'y', miny, maxy);
		//console.log('parent size', n.params.size, 'pos', n.params.pos)
		let wParent = Math.max(n.params.size.w, maxx);
		let hParent = Math.max(n.params.size.h, maxy);
		n.params.size.w = wParent + 4;
		n.params.size.h = hParent + 4;
		setFixedSizeAndPos(n);
		n.ui.style.opacity = .5;

		minx = Math.min(minx, n.pos.x);
		maxx = Math.max(maxx, n.pos.x + n.size.w);
		miny = Math.min(miny, n.pos.y);
		maxy = Math.max(maxy, n.pos.y + n.size.h);
		return [minx, maxx, miny, maxy];

	} else {
		setFixedSizeAndPos(n);
		let b = getBounds(n.ui);
		return [n.pos.x, n.pos.x + b.width, n.pos.y, n.pos.y + b.height];

	}
}
function recMeasureAbs(uid, R) {
	//console.log('measureAbs', uid);
	let n = R.uiNodes[uid];

	if (isdef(n.children)) {
		for (const ch of n.children) {
			recMeasureAbs(ch, R);
		}
	}

	n.sizeMeasured = calcSizeMeasured(n, R); //das ist mit getBounds, also ist size
	//console.log('measured:',n.sizeMeasured)
	n.sizeNeeded = uniformSizeToContent(uid, R);
	// n.sizeNeeded = sizeToContent(uid, R);

	//console.log('node', uid, 'measured', n.sizeMeasured, 'needed:', n.sizeNeeded);


	n.size = {
		w: Math.max(n.sizeMeasured.w, n.sizeNeeded.w),
		h: Math.max(n.sizeMeasured.h, n.sizeNeeded.h)
	}
	n.ui.style.width = n.size.w + 'px';
	n.ui.style.height = n.size.h + 'px';
	//console.log('final size', n.uid, n.size);
}
function calcParentContentYOffsetAndWidth(n, parentPadding) {
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
	return [y0, wTitle];
}
function sizeToContent(uid) {

	//console.log('sizeToContent_', uid);
	let n = R.uiNodes[uid];	//n is the parent
	//if (isdef(n.params.left)) return fixedSizePos_(uid);

	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : DEFS.defaultPadding;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : DEFS.defaultGap;

	let or = n.params.orientation;
	let bl = n.params.baseline;
	//console.log('or', or, 'baseline', bl)

	//berechne wTitle und y0
	let [y0, wTitle] = calcParentContentYOffsetAndWidth(n, parentPadding);

	let children = n.children.map(x => R.uiNodes[x]);

	let axMain, ax2;
	if (or == 'v') { axMain = 'h'; ax2 = 'w'; } else { axMain = 'w'; ax2 = 'h'; }

	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	let wmax = (or == 'v' ? ax2Max : axMainSum);//!!!
	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	//console.log('wmin', wTitle, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];

	for (const n1 of children) {
		if (or == 'v') {
			switch (bl) {
				case 'start': x = x0; break;
				case 'end': x = x0 + ax2Max - n1.size[ax2]; break;
				case 'centered': x = x0 + (ax2Max - n1.size[ax2]) / 2; break;
				case 'stretch':
					x = x0;
					if (n1.size.w < ax2Max) {
						//console.log('adjust',n1.uid);
						n1.size.w = ax2Max;
						n1.ui.style.minWidth = n1.size.w + 'px';

					}
					break;
				default: x = x0 + (ax2Max - n1.size[ax2]) / 2; break;
			}

			//x = x0 + (ax2Max - n1.size[ax2]) / 2;
			//x = x0 + centered? (ax2Max - n1.size[ax2]) / 2:0;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };

			y += n1.size[axMain];
			if (n1 != lastChild) y += childMargin;
		} else { //or is HORIZONTAL!!!!!!!! or=='h'!!!!!!!!!!!!!!!!!! y abhaengig von baseline!!!!!!!!!!

			switch (bl) {
				case 'start': y = y0; break;
				case 'end': y = y0 + ax2Max - n1.size[ax2]; break;
				case 'centered': y = y0 + (ax2Max - n1.size[ax2]) / 2; break;
				case 'stretch':
					y = y0;
					if (n1.size.h < ax2Max) {
						//console.log('adjust',n1.uid);
						n1.size.h = ax2Max;
						n1.ui.style.minHeight = n1.size.h + 'px';

					}
					break;
				default: y = y0 + (ax2Max - n1.size[ax2]) / 2; break;
			}
			// y = y0 + (ax2Max - n1.size[ax2]) / 2;

			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			x += n1.size.w;
			if (n1 != lastChild) x += childMargin;
		}

		n1.ui.style.left = n1.pos.x + 'px';
		n1.ui.style.top = n1.pos.y + 'px';

	}

	let wParent, hParent;
	if (or == 'h') {
		wParent = Math.max(wTitle + parentPadding * 2, x + parentPadding);
		hParent = y0 + ax2Max + parentPadding;
		//console.log('parent size should be', wParent, hParent);

	} else {
		wParent = Math.max(wTitle + parentPadding * 2, ax2Max + 2 * x0);
		//hParent = y + parentPadding;
		hParent = y0 + axMainSum + parentPadding;

	}
	return { w: wParent, h: hParent };
}
function uniformSizeToContent(uid) {

	//console.log('uniformSizeToContent_', uid);
	let n = R.uiNodes[uid];	//n is the parent
	//if (isdef(n.params.left)) return fixedSizePos_(uid);

	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : DEFS.defaultPadding;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : DEFS.defaultGap;

	let or = n.params.orientation;
	let rows = cols = 1; //da kann ich eigentlich auf 1 row,1 col machen fuer h und v layout!!!
	if (or == 'w') { rows = n.params.rows; cols = n.params.cols; }
	let bl = n.params.baseline;
	//console.log('or', or, 'baseline', bl)

	// if (uid == '_1') console.log('?????????',uid,n,or);

	//berechne wTitle und y0
	let [y0, wTitle] = calcParentContentYOffsetAndWidth(n, parentPadding);

	let children = n.children.map(x => R.uiNodes[x]);

	if (or == 'w') {
		let wchi = Math.max(...children.map(x => x.size.w));
		let hchi = Math.max(...children.map(x => x.size.h));
		//console.log('parent', uid, 'wchi', wchi, 'hchi', hchi);
		let wpar = 2 * parentPadding + wchi * cols + (cols - 1) * childMargin;
		//console.log('y0', y0, 'parentPadding', parentPadding)
		let hpar = y0 + parentPadding + hchi * rows + (rows - 1) * childMargin;
		//console.log('parent', uid, 'szchi', wchi, hchi, 'szpar', wpar, hpar);

		let xoff = (wTitle > wpar) ? (wTitle - wpar) / 2 : 0;

		//klar, y0 immer noch runtersetzen when title
		//hab eh y0 und wTitle!
		//immer noch ein xOffset wenn title wider that wpar!
		let x = xoff + parentPadding;
		let y = y0;
		let i = 0;
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				let ch = children[i];
				i += 1;
				//console.log('.........',children.length,i,ch,n.uid)
				ch.params.size = { w: wchi, h: hchi };
				ch.params.pos = { x: x, y: y };
				x += wchi + childMargin;
				setFixedSizeAndPos(ch);
			}
			x = xoff + parentPadding;
			y += hchi + childMargin;
		}


		return { w: wpar, h: hpar };
	}

	let axMain, ax2;
	if (or == 'v') { axMain = 'h'; ax2 = 'w'; }
	else if (or == 'h') { axMain = 'w'; ax2 = 'h'; }

	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	let wmax = (or == 'v' ? ax2Max : axMainSum);//!!!
	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	//console.log('wmin', wTitle, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];

	for (const n1 of children) {
		if (or == 'v') {
			switch (bl) {
				case 'start': x = x0; break;
				case 'end': x = x0 + ax2Max - n1.size[ax2]; break;
				case 'centered': x = x0 + (ax2Max - n1.size[ax2]) / 2; break;
				case 'stretch':
					x = x0;
					if (n1.size.w < ax2Max) {
						//console.log('adjust',n1.uid);
						n1.size.w = ax2Max;
						n1.ui.style.minWidth = n1.size.w + 'px';

					}
					break;
				default: x = x0 + (ax2Max - n1.size[ax2]) / 2; break;
			}

			//x = x0 + (ax2Max - n1.size[ax2]) / 2;
			//x = x0 + centered? (ax2Max - n1.size[ax2]) / 2:0;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };

			y += n1.size[axMain];
			if (n1 != lastChild) y += childMargin;
		} else { //or is HORIZONTAL!!!!!!!! or=='h'!!!!!!!!!!!!!!!!!! y abhaengig von baseline!!!!!!!!!!

			switch (bl) {
				case 'start': y = y0; break;
				case 'end': y = y0 + ax2Max - n1.size[ax2]; break;
				case 'centered': y = y0 + (ax2Max - n1.size[ax2]) / 2; break;
				case 'stretch':
					y = y0;
					if (n1.size.h < ax2Max) {
						//console.log('adjust',n1.uid);
						n1.size.h = ax2Max;
						n1.ui.style.minHeight = n1.size.h + 'px';

					}
					break;
				default: y = y0 + (ax2Max - n1.size[ax2]) / 2; break;
			}
			// y = y0 + (ax2Max - n1.size[ax2]) / 2;

			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			x += n1.size.w;
			if (n1 != lastChild) x += childMargin;
		}

		n1.ui.style.left = n1.pos.x + 'px';
		n1.ui.style.top = n1.pos.y + 'px';

	}

	let wParent, hParent;
	if (or == 'h') {
		wParent = Math.max(wTitle + parentPadding * 2, x + parentPadding);
		hParent = y0 + ax2Max + parentPadding;
		//console.log('parent size should be', wParent, hParent);

	} else {
		wParent = Math.max(wTitle + parentPadding * 2, ax2Max + 2 * x0);
		//hParent = y + parentPadding;
		hParent = y0 + axMainSum + parentPadding;

	}
	return { w: wParent, h: hParent };
}

//#region helpers
function adjustTableSize(R) {
	let d = mBy('table');
	let root = R.root;
	let b = getBounds(root.ui, true)
	//consout_('b',b.height,'root.size',root.size);
	if (!isdef(root.size)) {
		setSP(root);
		//console.log('>>>> root size not set',root)
	} else {
		//console.log('root size',root.size)
	}
	d.style.minWidth = root.size.w + 'px';
	d.style.minHeight = (root.size.h + 4) + 'px';
}
function setFixedSizeAndPos(n) {
	let ui = n.ui;
	if (nundef(n.params.size)) return;
	//console.log(n.params.pos, n.params.size);
	n.size = jsCopy(n.params.size);
	n.pos = jsCopy(n.params.pos);
	n.pos.cx = n.pos.x + n.size.w / 2;
	n.pos.cy = n.pos.y + n.size.h / 2;
	ui.style.position = 'absolute';
	ui.style.left = n.pos.x + 'px';
	ui.style.top = n.pos.y + 'px';
	ui.style.minWidth = n.size.w + 'px';
	ui.style.minHeight = n.size.h + 'px';
	// ui.style.left = '0px';
	// ui.style.width = '100px';
	// ui.style.top = '0px';
	// ui.style.height = '50px';
	//console.log('size',n.size,'pos',n.pos);
}


//#region __work dep


function recPresentNode_dep(n, R, sizing) {
	console.log('sizing', n.uid, sizing);

	if (isdef(n.children)) {
		for (const ch of n.children) {
			let n1 = R.uiNodes[ch];
			recPresentNode_dep(n1, R, getSizing(n1, R, sizing));
		}
	}

	//hier muss dann das sizing machen
	if (sizing == 'sizeToContent') { }
	else if (sizing == 'fixed') { }
	else if (sizing == 'sizeChildren') { }
	else { //das ist eigentlich sizeToContent: sizing so dass layout fitted,
		//if has no children: sizin g so dass gesetzter size
		//if no children and no size, just measure natural size!
		if (isdef(n.children)) {
			//make layout and then set size to max needed size and set size or 0
			// sizing is: growIfNeeded
			let fLayout = n.params.layout;
			if (nundef(fLayout)) fLayout = RLAYOUT[n.type];
			if (nundef(fLayout)) fLayout = panelLayout;
			let szNeeded = fLayout(n, R);
			//let sz = calc
			//if (n.params.size){

		}


	}
	//zuerst das arranging??? denk schon
}




//#region __work_Rgen
/*
Function: recArrangeContent
starting from uid and top down, arranges content according to params.contentwalign_ and contenthalign

*/
function recArrangeContent(uid, R) {

	let n = R.uiNodes[uid];	//n is the parent
	//console.log('............',uid,'children',n.children,'\nparams',n.params)

	if (nundef(n.children)) return;

	let parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : DEFS.defaultPadding;
	let childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : DEFS.defaultGap;
	let posModified = false;
	let sizeModified = false;
	let children = n.children.map(x => R.uiNodes[x]);

	if (isdef(n.params.contentwalign) && n.params.contentwalign == 'center') {
		//calc total with of content
		//console.log('...................................>>')
		let children = n.children.map(x => R.uiNodes[x]);
		let xchimin = Math.min(...children.map(x => x.pos.x));
		let xchimax = Math.max(...children.map(x => x.pos.x + x.size.w));
		let diff = xchimax - xchimin;
		let wpar = n.size.w - 2 * parentPadding;
		//console.log('wpar', wpar, 'diff', diff, 'should align?', wpar > diff + 2 ? 'yes' : 'no');
		//align each child by (wpar-diff)/2
		let displ = (wpar - diff) / 2;
		if (displ >= 1) {
			posModified = true;
			for (const ch of children) { ch.params.pos = { x: ch.pos.x + displ, y: ch.pos.y }; }
		}
	}
	if (isdef(n.params.contenthalign) && n.params.contenthalign == 'center') {
		//calc total with of content
		//console.log('...................................>>')
		let ychimin = Math.min(...children.map(ch => ch.pos.y));
		let ychimax = Math.max(...children.map(ch => ch.pos.y + ch.size.h));
		let diff = ychimax - ychimin;
		let hpar = n.size.h - 2 * parentPadding;
		//console.log('hpar', hpar, 'diff', diff, 'should align?', hpar > diff + 2 ? 'yes' : 'no');
		//align each child by (wpar-diff)/2
		let displ = (hpar - diff) / 2;
		if (displ >= 1) {
			posModified = true;
			for (const ch of children) { ch.params.pos = { x: ch.pos.x, y: ch.pos.y + displ }; }
		}
	}

	if (posModified || sizeModified) {
		for (const ch of children) { setFixedSizeAndPos(ch); }
	}
	// else return;

	for (const ch of n.children) recArrangeContent(ch, R);

}


function dPP1(o, plist, R) {
	//plist is a list of properties
	//pool is a dictionary that contains all objects that might be involved

	//console.log('dPP', o, plist)

	if (isEmpty(plist)) {
		let res = isdef(o._player) ? [o._player] : isdef(o._obj) ? [o._obj] : o;
		//console.log('empty plist: o',o, '\nreturning',res)
		return res;
	}
	if (isList(o) && isNumber(plist[0])) {
		let i = Number(plist[0]);
		return dPP1(o[i], plist.slice(1), R);
	}
	if (!isDict(o)) {
		let o1 = R.getO(o);
		if (isdef(o1)) return dPP1(o1, plist, R);
		console.log('dPP1 ERROR!!! o', o, 'plist', plist, '\no1', o1);
		return null;
	}

	let k1 = plist[0];
	let o1 = isdef(o._player) ? R.getO(o._player)[k1]
		: isdef(o._obj) ? R.getO(o._obj)[k1]
			: o[k1];
	//console.log('o',o,'o1',o1)
	if (nundef(o1)) return null; //o does NOT have this prop!
	let plist1 = plist.slice(1);
	if (o1._set) {
		o1 = o1._set;
		//console.log('was soll hier returned werden?', 'o1', o1, 'plist1', plist1)
		if (plist1.length > 0 && !isNumber(plist1[0])) {
			//console.log('WAS!!!!!!!')
			return o1.map(x => dPP1(x, plist1, R));
		}
	}
	//if (o1._player) { o1 = R.getO(o1._player); }
	//else if (o1._obj) { o1 = R.getO(o1._obj); }
	//console.log('calling dPP1', o1, plist1)
	return dPP1(o1, plist1, R);
}

function dPP(o, plist, R) {
	//plist is a list of properties
	//pool is a dictionary that contains all objects that might be involved

	//console.log('dPP',o,plist)

	if (isEmpty(plist)) return o;
	if (isList(o) && isNumber(plist[0])) {
		let i = Number(plist[0]);
		return dPP(o[i], plist.slice(1), R);
	}
	if (!isDict(o)) {
		let o1 = R.getO(o);
		if (isdef(o1)) return dPP(o1, plist, R);
		console.log('dPP ERROR!!! o', o, 'plist', plist, '\no1', o1);
		return null;
	}

	let k1 = plist[0];
	let o1 = o[k1];
	if (nundef(o1)) return null; //o does NOT have this prop!
	let plist1 = plist.slice(1);
	if (o1._set) {
		o1 = o1._set;
		if (plist1.length > 0 && isNumber(plist1[0])) {
			let i = Number(plist1[0]);
			return dPP(o1[i], plist1.slice(1), R);
		} else {
			return o1.map(x => dPP(x, plist1, R));
		}
	}
	if (o1._player) { o1 = R.getO(o1._player); }
	else if (o1._obj) { o1 = R.getO(o1._obj); }
	return dPP(o1, plist1, R);
}



//#region types

//#region layout
function panelLayout(n, R) {
	let params = n.params;
	let num = n.children.length;

	//console.log('ich bin in panelLayout_!!!!!!!!!!!!',n.params)

	let or = params.orientation ? params.orientation : DEF_ORIENTATION;
	mFlex(n.ui, or);

	//console.log(params, num, or);

	//setting split
	let split = params.split ? params.split : DEF_SPLIT;
	if (split == 'min') {
		let b = getBounds(n.ui, true); //n.sizeMeasured = { w: b.width, h: b.height };
		return { w: b.width, h: b.height }; //n.sizeMeasured;
	}

	let reverseSplit = false;

	if (split == 'equal') split = (1 / num);
	else if (isNumber(split)) reverseSplit = true;

	for (let i = 0; i < num; i++) {
		let d = R.uiNodes[n.children[i]].ui;
		mFlexChildSplit(d, split);

		if (reverseSplit) { split = 1 - split; }
	}
	// let b = getBounds(n.ui, true); n.sizeMeasured = { w: b.width, h: b.height };return n.sizeMeasured;
	let b = getBounds(n.ui, true); //n.sizeMeasured = { w: b.width, h: b.height };
	//console.log('height',b.height);
	//n.ui.style.height=b.height+'px';
	return { w: b.width, h: b.height }; //n.sizeMeasured;

}

// const RSGTYPES = { board: 1, hand: 2, field: 101, edge: 102, corner: 103 };//unter 100:container types
// const CARD_SZ = 80;
// const LABEL_SZ = 40;
// const FIELD_SZ = 40;

function handLayout_Wrapper(n, R) {
	//let size = CARD_SZ;
	//let [w, h, gap] = [size * .66, size, 4];
	//console.log('n', n)
	let uis = n.children.map(x => R.uiNodes[x].ui.parentNode);
	let area = n.uid;

	let ch0 = R.uiNodes[n.children[0]];
	let size = ch0.params.size;
	let [w, h, gap] = [size.w, size.h, 4];

	if (isEmpty(uis)) return [0, 0];
	let x = y = gap;
	let ov = n.params.overlap / 100;
	if (nundef(ov)) ov = .20;
	console.log('overlap', ov, n.params);
	let overlap = .1 * w;
	//console.log(uis);
	let dParent = mBy(area);
	dParent.style.position = 'relative';

	uis.map(d => {
		//console.log('parent',dParent,'child',d)
		mAppend(dParent, d);
		d.style.position = 'absolute';
		mPos(d, x, y);

		x += overlap;
	});
	//let h=getBounds(uis[0]).height; //getBounds kann erst NACH appendChild benuetzt werden!!!!!!!!!!!!!!!!!!!
	//console.log('h',h)
	let sz = { w: x - overlap + w + gap, h: y + h + gap };
	console.log('x', x, 'w', w, 'y', y, 'h', h, 'gap', gap, 'sz', sz)
	dParent.style.minHeight = (sz.h) + 'px';
	dParent.style.minWidth = (sz.w) + 'px';

	return sz; // {w:x+w,h:y+h+gap}; //x is total width for layout
}

//#region layout functions
function calcTotalDims(n, uids, R) {
	let hMax = 0;
	let margin = isdef(n.params.margin) ? n.params.margin : 0;
	let wTotal = margin;
	for (const ch of uids) {
		let n1 = R.uiNodes[ch];
		let w = n1.size.w;
		let h = n1.size.h;
		hMax = Math.max(hMax, h);
		wTotal += w + margin;

	}
	return { w: wTotal, h: hMax + 2 * margin, margin: margin };
}

function infoLayout(n, R) {

}

function horLayout(n, R) {
	console.log('n', n, n.ui);
	let uids = n.children;

	let dims = calcTotalDims(n, uids, R);
	let margin = dims.margin;
	console.log('dims', dims);
	let x = margin;
	let y = margin;
	let uiParent = n.ui;
	uiParent.style.position = 'relative';
	//uiParent.style.boxSizing = 'border-box';
	console.log(uiParent);
	for (const ch of uids) {
		let n = R.uiNodes[ch];
		let w = n.size.w;
		let h = n.size.h;
		n.pos = { x: x, y: y };
		let ui = n.ui;
		ui.style.position = 'absolute';
		ui.style.display = 'inline-block';
		ui.style.boxSizing = 'border-box';
		ui.style.left = x + 'px';
		ui.style.top = y + 'px';
		ui.style.margin = 'auto';
		x += w + 2;
	}
	uiParent.style.width = dims.w + 'px';
	uiParent.style.minHeight = dims.h + 'px';

}

//#region wrap layout
function wrapLayoutColarr(num) {
	const arr = [[0], [1], [2], [1, 2], [2, 2], [2, 3], [3, 3], [2, 3, 2], [2, 3, 3], [3, 3, 3], [3, 4, 3], [3, 4, 4], [4, 4, 4]];
	return num < arr.length ? arr[num] : [num];
}
function wrapLayoutPosition(nBoard, tile, R) {
	let margin = 2;
	let uids = tile.children;
	let colarr = wrapLayoutColarr(uids.length);
	//console.log('num',num,'lay',lay,uids)
	let rows = colarr.length;
	let iNode = 0;
	let nChild = R.uiNodes[uids[0]];
	let size0 = R.uiNodes[uids[0]].size;
	let wChild = getBounds(nChild.ui).width;

	let xOffset = nBoard.size.w / 2 + tile.pos.x - size0.w / 2;
	let yOffset = nBoard.size.h / 2 + tile.pos.y - size0.h / 2;
	let x = 0;
	let y = 0;
	let dx = size0.w + margin;
	let dy = size0.h + margin;

	// console.log(tile,uids,'layout rows', colarr,'rows',rows);
	// console.log('child size',size0);
	// console.log('tile: size',tile.size,'pos',tile.pos)
	// console.log('nBoard.params.sizes',nBoard.params.sizes)
	// console.log('R.uiNodes[uids[0]]',R.uiNodes[uids[0]])
	// console.log('wChild (getBounds)',wChild,'ui',nChild.ui)

	// assume that all elements have same size!
	for (let r = 0; r < rows; r++) {
		x = 0;
		y = r * dy - (rows * dy - dy) / 2;
		let wrow = colarr[r] * dx - dx;
		for (let c = 0; c < colarr[r]; c++) {

			let robber = R.uiNodes[uids[iNode]];
			let ui = robber.ui;
			ui.style.position = 'absolute';
			ui.style.display = 'inline-block';
			ui.style.boxSizing = 'border-box'

			let xPos = x + xOffset - wrow / 2;
			let yPos = y + yOffset;
			robber.pos = { x: xPos, y: yPos };
			ui.style.left = xPos + 'px';
			ui.style.top = yPos + 'px';
			ui.style.margin = '0px';
			//console.log('wrap', robber.uid, 'x', xPos, 'y', yPos);

			x += dx;
			iNode += 1;

		}
	}
}
function wrapLayoutSizeNeeded(uids, R) {
	const arr = [[0], [1], [2], [1, 2], [2, 2], [2, 3], [3, 3], [2, 3, 2], [2, 3, 3], [3, 3, 3], [3, 4, 3], [3, 4, 4], [4, 4, 4]];
	let colarr = wrapLayoutColarr(uids.length);
	let rows = colarr.length;
	let iNode = 0;
	let wmax = 0;
	let maxNumPerRow = 0;
	let htot = 0;
	for (let r = 0; r < rows; r++) {
		let hmax = 0;
		let wtot = 0;
		for (let c = 0; c < colarr[r]; c++) {

			let n = R.uiNodes[uids[iNode]];
			//console.log('wrap', n.uid, n.size);
			let h = n.size.h;
			let w = n.size.w;
			hmax = Math.max(hmax, h);
			wtot += w;
			maxNumPerRow = Math.max(maxNumPerRow, c);

		}
		wmax = Math.max(wmax, wtot);
		htot += hmax;
	}
	let margin = 2;
	let wNeeded = wmax + margin * (maxNumPerRow + 1);
	let hNeeded = htot + margin * (rows + 1);
	//console.log('num',uids.length,'ley',colarr,'size needed',wNeeded,hNeeded)
	return { w: wNeeded, h: hNeeded };
	//let cols = 

}

function simpleLayoutForOneChildSizeNeeded(ch, R) {
	let nChild = R.uiNodes[ch];

	//since this is a board member, layout is 1/1
	let wNeeded = nChild.size.w + 12; //just testing: give child more space for margin
	let hNeeded = nChild.size.h + 12;
	return { w: wNeeded, h: hNeeded };
}
function simpleLayoutForOneChildPosition(nBoard, tile, R) {
	let ch = tile.children[0];
	let robber = R.uiNodes[ch];
	let ui = robber.ui;

	// console.log('arranging:', uidMember)
	// console.log('board size', n.size, '\ntile size', tile.size, '\nrobber size', robber.size)

	ui.style.position = 'absolute';
	ui.style.display = 'inline-block';

	let x = nBoard.size.w / 2 + tile.pos.x - robber.size.w / 2;// 10;// wTotal/2 + -22;//bdiv.width/2-bmk.width/2;//(bdiv.width/2 + bmk.left + (bmk.width - bel.width) / 2);
	let y = nBoard.size.h / 2 + tile.pos.y - robber.size.h / 2;// 10;// wTotal/2 + -22;//bdiv.width/2-bmk.width/2;//(bdiv.width/2 + bmk.left + (bmk.width - bel.width) / 2);

	ui.style.left = x + 'px';
	ui.style.top = y + 'px';

	robber.pos = { x: x, y: y };

	ui.style.margin = '0px';

}



//#region factory
function cardFace({ cardKey, rank, suit, key } = {}, w, h) {
	let svgCode;
	//console.log('cardFace',rank,suit,key,cardKey,w,h)
	if (isdef(cardKey)) {
		cardKey = 'card_' + cardKey;
		//console.log('cardKey kommt an:',cardKey,c52[cardKey])
		svgCode = isdef(c52[cardKey]) ? c52[cardKey] : testCards[cardKey];
		if (!svgCode) svgCode = vidCache.getRandom('c52');
	} else if (isdef(key)) {
		cardKey = key;
		svgCode = testCards[cardKey];
		if (!svgCode) svgCode = vidCache.getRandom('c52');
	} else {
		if (nundef(rank)) { rank = '2'; suit = 'B'; }
		if (rank == '10') rank = 'T';
		if (rank == '1') rank = 'A'; // ranks: A 2 3 4 5 6 7 8 9 T J Q K 
		if (nundef(suit)) suit = 'H';// suits: C D H S
		// joker:1J,2J, back:1B,2B
		cardKey = 'card_' + rank + suit; //eg., card_ST
		svgCode = c52[cardKey]; //c52 is cached asset loaded in _start
		//svgCode = c52['card_AD']; //c52 is cached asset loaded in _start
		//console.log(cardKey,c52[cardKey])
	}
	svgCode = '<div>' + svgCode + '</div>';
	//console.log('div ist',svgCode)
	let el = createElementFromHTML(svgCode);
	//console.log(el)
	if (isdef(h)) { mSize(el, w, h); }
	//console.log('__________ERGEBNIS:',w,h)
	return el;
}






