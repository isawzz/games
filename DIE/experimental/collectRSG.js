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
function mCard52(n, R, uidParent) {
	let dParent = mBy(n.idUiParent);

	console.log('...MCARD52')
	// let uiWrapper = mDiv(dParent);
	// addClass(uiWrapper, 'cardWrapper');

	let ui;

	//console.log(n.content);

	//wenn garkein content mach eine back flipped card!
	let w, h;
	if (n.params.size) { w = n.params.size.w; h = n.params.size.h; }
	else[w, h] = [70, 110]; //TODO: change this!!!

	if (nundef(n.content)) ui = cardFace({}, w, h);
	else {
		//n.content kann sein: rank (1 letter), cardKey (2 letters), object (dann hat es rank,suit,cardKey,key), more than 2 letters interpretiere als key
		if (isDict(n.content)) {
			let o = n.content;
			let rank = isdef(o.rank) ? o.rank : null;
			let key = isdef(o.key) ? o.key : null;
			let suit = isdef(o.suit) ? o.suit : null;
			let cardKey = isdef(o.cardKey) ? o.cardKey : null;
			ui = cardFace({ rank: rank, suit: suit, key: key, cardKey: cardKey }, w, h);
		} else if (isString(n.content)) {
			let s = n.content;
			let len = s.length;
			if (len == 1) ui = cardFace({ rank: s }, w, h);
			else if (len == 2) {
				//console.log('RICHTIG!', n.content, s);
				ui = cardFace({ cardKey: s }, w, h);
			} else ui = cardFace({ key: s }, w, h);
		}

	}

	//ui.style.border= 'solid #666 1px';
	//ui.style.borderRadius='3px';
	mAppend(dParent, ui);
	n.potentialOverlap = true;
	// mAppend(uiWrapper, ui);

	// let ui = mText(n.content, uiWrapper);
	// mAppend(d,ui);


	//addClass(ui, 'cardStyle');

	return ui;
}
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
