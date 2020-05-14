function layoutHand(n) {
	if (isdef(n.params.overlap) && n.children.length > 1) {
		let cards = n.children.map(x => x.ui);
		let clast = last(cards);
		//console.log('card',clast);
		let b = getBounds(clast);
		//console.log('bounds',b);
		let wIs = b.width;
		let overlap = firstNumber(n.params.overlap);
		let sOverlap = '' + overlap;
		let unit = stringAfter(n.params.overlap, sOverlap);
		//console.log('num',overlap,'unit',unit)
		let wSoll = 0;
		if (unit == '%') {
			overlap /= 100;
			wSoll = wIs - wIs * overlap;

		} else { wSoll = wIs - overlap; }
		//console.log('wSoll ...', wSoll);
		let wTotal = wIs + wSoll * (cards.length - 1);
		n.ui.style.maxWidth = '' + (wTotal + 2) + 'px';
	}
}
function pictoDiv(key, color, w, h) { let d = mPic(key); mColor(d, color); mSizePic(d, w, h); return d; }

function picDiv(size) { return o => pictoDiv(o.key, o.color, size, size); }

function makePictoPiece(mk, o, sz, color) {

	//console.log('unit',unit,'percent',percent,'sz',sz);
	let [w, h] = [sz, sz];

	let sym = o.obj_type;
	if (sym in SPEC.symbol) { sym = SPEC.symbol[sym]; }
	if (!(sym in iconChars)) {
		//console.log("didn't find key", sym);
		symNew = Object.keys(iconChars)[randomNumber(5, 120)]; //abstract symbols
		//console.log('will rep', sym, 'by', symNew)
		SPEC.symbol[sym] = symNew;
		sym = symNew;
	}
	//console.log(iconChars,sym,iconChars[sym])
	mk.ellipse({ w: w, h: h, fill: color, alpha: .3 });
	let pictoColor = color == 'black' ? randomColor() : color;
	mk.pictoImage(sym, pictoColor, sz * 2 / 3); //colorDarker(color),sz*2/3);
}















