function getRandomCard({ rank, suit, type } = {}) {
	if (isdef(rank) || isdef(suit)) return card52(rank, suit);
	else if (type == 'c52') return card52();
	else if (type == 'inno') return cardInno();
}
function mSymbol(key,dParent, sz, styles={}){

	if (key == 'clock') key='watch';
	let info = symbolDict[key];

	//ich brauche einen size der macht dass das symbol in sz passt
	fzStandard=info.fz;
	hStandard = info.h[0];
	wStandard = info.w[0];

	//fzStandard/fz = hStandard/sz= wStandard/wz;
	//fzStandard = fz*hStandard/sz= fz*wStandard/wz;
	//fzStandard = fz*hStandard/sz= fz*wStandard/wz;

	let fzMax=fzStandard*sz / Math.max(hStandard,wStandard);
	fzMax *= .9;


	let fz=isdef(styles.fz)&& styles.fz<fzMax?styles.fz:fzMax;

	let wi=wStandard*fz/100;
	let hi=hStandard*fz/100;
	let vpadding=2+Math.ceil((sz-hi)/2); console.log('***vpadding',vpadding)
	let hpadding=Math.ceil((sz-wi)/2);

	let margin=''+vpadding+ 'px '+hpadding+ 'px'; //''+vpadding+'px '+hpadding+' ';

	styles=deepmergeOverride(styles,{fz:fz,align:'center',w:sz,h:sz,bg:'white'});
	let d=mDiv(dParent,styles);
	
	console.log(key,info)
	//let fz=sz;
	//if (isdef(styles.h)) styles.fz=info.h[0]*
	let txt=mText(info.text,d,{family:info.family});

	console.log('-----------',margin,hpadding,vpadding)
	mStyleX(txt,{margin:margin, 'box-sizing':'border-box'})

	return d;
}
function cardInno(key, w = 320, h = 180) {
	if (nundef(key)) key = chooseRandom(Object.keys(cinno));

	key = 'Flight';
	let info = cinno[key];

	info.key = key;

	//make empty card with dogmas on it
	let d = mDiv();
	mSize(d, w, h);
	let szSym = 50; let fz=szSym*.8;
	mStyleX(d, { align: 'left', bg: info.color, rounding: 10, patop: 10, paright: 10, pabottom: szSym, paleft: szSym, position: 'relative' })
	mText(info.key, d, { fz: 24, weight: 'bold', margin:'auto'});
	mLinebreak(d);
	for (const dog of info.dogmas) {
		console.log(dog);
		mText(dog, d);
		mLinebreak(d);
	}

	let syms = [];let d1;

	szSym -= 6;

	for (const sym of info.resources) {
		console.log(sym)
		if (sym == 'None'){
			//einfach nur das age als text
			console.log('age of card:', info.age)
			//mTextFit(text, { wmax, hmax }, dParent, styles, classes)
			d1 = mDiv(d,{ fz:fz, fg:'black', bg: 'white', rounding:'50%', display: 'inline' });
			let d2=mText(''+info.age, d1, {});
			console.log('vvvvvvvvvvvvvvv',d1);

			mClass(d2,'centerCentered')

		}else if (sym == 'echo'){

		}else{
			d1 = mSymbol(sym, d, szSym, { fz:fz, bg: 'white', rounding:'50%', display: 'inline' });
		}
		
		syms.push(d1);
	}

	console.log(syms[0])
	//let 
	mStyleX(syms[0], { position: 'absolute', w: szSym, h: szSym, left: 0, top: 0, margin:4 });
	mStyleX(syms[1], { position: 'absolute', w: szSym, h: szSym, left: 0, bottom: 0, margin:4 });
	mStyleX(syms[2], { position: 'absolute', w: szSym, h: szSym, left: w/2, bottom: 0, margin:4 });
	mStyleX(syms[3], { position: 'absolute', w: szSym, h: szSym, right: 0, bottom: 0, margin:4 });

	// let d=mText(info.dogmas.join('\n'));
	info.div = d;

	return info;
	return 'hallo';
}
function card52(rankey, suit, w, h) {
	//console.log('cardFace',rank,suit,w,h)

	//#region set rank and suit from inputs
	let rank = rankey;
	if (nundef(rankey) && nundef(suit)) {
		rankey = chooseRandom(Object.keys(c52));
		rank = rankey[5];
		suit = rankey[6];
	} else if (nundef(rankey)) {
		//face down card!
		rankey = '2';
		suit = 'B';
	} else if (nundef(suit)) {
		rank = rankey[5];
		suit = rankey[6];
	}
	//
	console.log('rank', rank, 'suit', suit);

	if (rank == '10') rank = 'T';
	if (rank == '1') rank = 'A';
	if (nundef(suit)) suit = 'H'; else suit = suit[0].toUpperCase(); //joker:J1,J2, back:1B,2B
	//#endregion

	//#region load svg for card_[rank][suit] (eg. card_2H)
	let cardKey = 'card_' + rank + suit;
	let svgCode = c52[cardKey]; //c52 is cached asset loaded in _start
	// console.log(cardKey, c52[cardKey])
	svgCode = '<div>' + svgCode + '</div>';
	let el = createElementFromHTML(svgCode);
	if (isdef(h) || isdef(w)) { mSize(el, w, h); }
	//console.log('__________ERGEBNIS:',w,h)
	//#endregion

	return { rank: rank, suit: suit, key: cardKey, div: el };
}

function showSingle52(dParent, rank, suit, w, h) {
	let c = card52(rank, suit, w, h);
	mAppend(dParent, c.div);
	//console.log(c52)
	return c;
}
function showHand52(cards, dParent, splayed = 'left', w, h) {
	//cards is list of {...card props je nach game ...,div};
	//dParent is container of Hand div tbc
	//splayed in 'left','right','up','down','diag','diag2','diagup','diag2up','none'



}



