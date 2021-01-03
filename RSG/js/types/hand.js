
function mHand(n, R, uidParent) {
	let dParent = mBy(n.idUiParent);

	let ui = mDiv(dParent);
	addClass(ui, 'handStyle');

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);
	//mColor(ui, randomColor());
	return ui;
}

function lHand(n,R){return handLayout(n,R)}

function handLayout(n, R) {
	//let size = CARD_SZ;
	//let [w, h, gap] = [size * .66, size, 4];
	//console.log('n', n)

	let uis = n.children.map(x => R.uiNodes[x].ui);
	// let uis = n.children.map(x => R.uiNodes[x].ui.parentNode);
	let area = n.uid;

	let ch0=R.uiNodes[n.children[0]];
	let size = ch0.params.size;
	console.log('I am in handLayout!!!!!!!!!!!!!!')

	if (nundef(size)) size={w:70,h:110};
	//size={w:70,h:110};

	let [w, h, gap] = [size.w,size.h, 4];

	if (isEmpty(uis)) return [0, 0];
	let x = y = gap;
	let ov = n.params.overlap;
	ov /= 100; // / 100;
	//console.log('ov',ov,typeof ov);
	if (nundef(ov) || isNaN(ov)) ov=.20;
	//console.log('overlap',ov,n.params);
	let overlap = ov * w;
	//console.log(uis);
	let dParent = mBy(area);
	dParent.style.position = 'relative';

	console.log('_______________',x,y,gap,w,ov)

	uis.map(d => {
		//console.log('parent',dParent,'child',d)
		mAppend(dParent, d);
		d.style.position = 'absolute';
		d.style.borderRadius = '12px';
		d.style.padding = '4px';
		// d.style.backgroundColor = 'blue';
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

