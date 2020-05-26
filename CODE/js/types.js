function mInvisible(n, dParent, R) { let d = mDiv(dParent); return d; }
function mInfo(n, dParent, R) {


	//console.log(n,'\ndParent:',dParent)
	//if (n.oid == '3') console.log('params',n)

	let ui;
	if (getTypeOf(dParent) == 'g') {
		return gInfo(n, dParent, R);
	} else if (isdef(n.content)) {
		ui = mNode(n.content, dParent);
		mClass(ui, 'node')
	} else {
		ui = mDiv(dParent);
		ui.style.display = 'hidden';
	}
	return ui;
}
function gInfo(n, gParent, R) {
	let pf = n.params;
	n.uiType = 'g';
	let ui = gShape(pf.shape, pf.size, pf.size, pf.bg, pf.rounding);
	
	gParent.appendChild(ui);
	
	if (n.content) {
		let color = nundef(pf.fg) ? nundef(pf.bg) ? null : colorIdealText(pf.bg) : pf.fg;
		n.label = agText(ui, n.content, color, pf.font);
		calcRays(n, gParent, R);
	}

	if (pf.border){
		let th=isdef(pf.thickness)?pf.thickness:1;

		let color=decodeColor(pf.border);

		// let alpha=firstFloat(pf.border);
		// console.log('alpha',alpha);
		// let color = stringBefore(pf.border,' ');
		// if (alpha) color = anyColorToStandardString(color,alpha);
		let ch=ui.children[0];
		//console.log('child w/ shape that should get border is',ch,'\np:',pf, '\nport',n.content);
		ch.setAttribute('stroke', color);
		ch.setAttribute('stroke-width',th);
	}

	return ui;
}

//#region special types
function mGrid(n, dParent, R) { //enspricht jetzt dem basic type grid!!!!
	// *** stage 3: prep container div/svg/g (board) as posRel ***
	let boardDiv = stage3_prepContainer(dParent);

	let boardSvg = gSvg();

	let style = `margin:0;padding:0;position:absolute;top:0px;left:0px;width:100%;height:100%;`
	boardSvg.setAttribute('style', style);
	boardDiv.appendChild(boardSvg);

	let boardG = gG();
	boardSvg.appendChild(boardG);

	n.bi.boardDiv = boardDiv;
	// mColor(boardDiv, 'blue'); //apply stylings?
	boardDiv.id = n.uid + '_div';
	n.bi.boardSvg = boardSvg;
	let ui = n.bi.boardG = boardG;
	n.uiType = 'h';

	n.uidDiv = n.uidStyle = boardDiv.id;
	n.uidG = n.uid;


	//do your own styling!or WHAT??????????

	return ui;

}

//container types
function mPanel(n, dParent, R) {

	if (getTypeOf(dParent) == 'g') { return gPanel(n, dParent, R); }

	let ui = n.ui;
	if (n.changing && isdef(ui)) {
		// console.log(n)
		// n.act.deactivate();
		// n.act = null;
		clearIncludingAttr(ui);
		delete n.changing;
	} else {
		ui = mDiv(dParent);
	}

	//content
	if (isdef(n.content)) {
		let d1 = mTextDiv(n.content, ui);
	}

	//apply n.typParams!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// }
	// else if (n.uiType == 'g'){
	// 	//now dParent is a g element!

	// }

	return ui;
}
function gPanel(n, gParent, R) {
	if (isdef(n.ui)) {
		// removeAllEvents(n.ui);
		// n.act = null;
		delete n.changing;
		return n.ui;
	}

	//console.log('EIN NEUES G PANEL?????? ECHT?????')
	let ui = agG(gParent);
	n.uiType = 'g';
	return ui;
}
function mList(n, dParent, R) {

	let ui = mDiv(dParent);

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);
	//mColor(ui, randomColor());
	return ui;
}
function mHand(n, dParent, R) {

	let ui = mDiv(dParent);
	addClass(ui, 'handStyle');

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);
	//mColor(ui, randomColor());
	return ui;
}

//leaf types
function mCard(n, dParent, R) {

	//fuer solution 2:
	let uiWrapper = mDiv(dParent);
	addClass(uiWrapper, 'cardWrapper');
	let ui = mTextDiv(n.content, uiWrapper);
	addClass(ui, 'cardStyle');

	// let ui = mTextDiv(n.content, dParent);
	// addClass(ui,'cardStyle'); 

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);

	return ui;
}
function mPicto(n, dParent, R) {

	//console.log('haloooooooooooooooooo')
	//content should be key to iconChars
	let uiWrapper = mDiv(dParent);
	addClass(uiWrapper, 'cardWrapper');

	let key = n.content; //key='crow';
	let ui = mPic(key);
	mAppend(uiWrapper, ui);
	addClass(ui, 'pictoStyle');

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);

	return ui;
}
function mTitle(n, dParent, R) {
	//console.log(n,dParent)
	let ui = mTextDiv(n.content, dParent);

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);
	// mStyle(ui, paramsToCss(n.params));
	return ui;
}

const RCREATE = {
	invisible: mInvisible,
	info: mInfo,
	list: mList,
	card: mCard,
	hand: mHand,
	panel: mPanel,
	title: mTitle,
	picto: mPicto,
	grid: mGrid,
}
const RCONTAINERPROP = {
	list: 'elm',
	hand: 'elm',
	panel: 'sub',
}

const DEF_ORIENTATION = 'v';
const DEF_SPLIT = 'equal';


//#region old functions
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


//#region helpers
function isSpecType(t) { return isdef(R.lastSpec[t]); }
function isContainerType(t) { return t == 'panel' || t == 'list' || t == 'hand'; }
function isLeafType(t) { return t == 'info' || t == 'title' || t == 'card' || t == 'picto'; }
//function isPositionedType(t) { return t == 'boardElement'; }
function isGridType(t) { return t == 'grid'; }




