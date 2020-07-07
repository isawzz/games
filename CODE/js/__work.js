function uniformSizeToContent(uid) {

	console.log('uniformSizeToContent_', uid);
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

	//berechne wTitle und y0
	let [y0, wTitle] = calcParentContentYOffsetAndWidth(n, parentPadding);

	let children = n.children.map(x => R.uiNodes[x]);

	if (or == 'w') {
		let wchi = Math.max(...children.map(x => x.size.w));
		let hchi = Math.max(...children.map(x => x.size.h));
		console.log('parent', uid, 'wchi', wchi, 'hchi', hchi);
		let wpar = 2 * parentPadding + wchi * cols + (cols - 1) * childMargin;
		console.log('y0', y0, 'parentPadding', parentPadding)
		let hpar = y0 + parentPadding + hchi * rows + (rows - 1) * childMargin;
		console.log('parent', uid, 'szchi', wchi, hchi, 'szpar', wpar, hpar);

		let xoff = (wTitle > wpar) ? (wTitle - wpar) / 2 : 0;

		//klar, y0 immer noch runtersetzen when title
		//hab eh y0 und wTitle!
		//immer noch ein xOffset wenn title wider that wpar!
		let x = xoff + parentPadding;
		let y = y0;
		let i = 0;
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				let ch = children[i]; i += 1;
				ch.params.size = { w: wchi, h: hchi };
				ch.params.pos = { x: x, y: y };
				x += wchi + childMargin;
				setFixedSizeAndPos(ch);
			}
			x = xoff+parentPadding;
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






