function mCard52(n, uidParent, R) {
	let dParent = mBy(n.idUiParent);

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

	// let ui = mTextDiv(n.content, uiWrapper);
	// mAppend(d,ui);


	//addClass(ui, 'cardStyle');

	return ui;
}

function lCard52(n,R){
	// only need func for positioned children
}

