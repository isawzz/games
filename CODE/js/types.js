function mInvisible(n, uidParent, R) {
	//console.log('invisible',n.uid,n.data,n.params)
	let dParent = mBy(n.idUiParent);
	let d = mDiv(dParent);
	// console.log('invisible')
	//if (n.data) { console.log('habe data', n.data) }
	if (n.content) { 
		//console.log('habe content!!!', n.content); 
		mTextDiv(n.content, d); 
	}
	//n.idUiParent = d.id;
	return d;
}
function mInfo(n, uidParent, R) {
	//console.log('info',n.uid,n.data,n.params)

	let ui;
	let dParent = mBy(n.idUiParent); //uidParent);
	//console.log(uidParent, dParent, R.uiNodes)
	// if (uidParent && isBoardMember(uidParent, R)) {
	// 	//console.log('--------------isBoardMember', n.content)
	// 	ui = makeUiOnBoardMember(n, uidParent, R);
	// } else 
	if (getTypeOf(dParent) == 'g') {
		//console.log('--------------g', n.content)
		return gInfo(n, uidParent, R);
	} else if (isdef(n.content)) {
		//console.log('--------------isdef(content)', n.content)
		ui = mNode(n.content, dParent);
		//n.idUiParent = dParent.id;
		mClass(ui, 'node');
	} else {
		//console.log('--------------else', n.content)
		ui = mDiv(dParent);
		//n.idUiParent = dParent.id;
		ui.style.display = 'hidden';
	}
	return ui;
}
function gInfo(n, uidParent, R) {
	let pf = n.params;
	n.uiType = 'g';
	let ui = gShape(pf.shape, pf.size, pf.size, pf.bg, pf.rounding);

	//the ui parent should be the g element under the next highest svg element
	let gParent = findAncestorElemWithParentOfType(mBy(uidParent), 'svg'); // calculateTopLevelGElement(mBy(uidParent));

	gParent.appendChild(ui);
	n.idUiParent = gParent.id;


	if (n.content) {
		let bgText = pf.bgText ? pf.bgText : null; // pf.dray ? null : pf.bg;
		let color = nundef(pf.fg) ? nundef(pf.bgText) ? null : colorIdealText(pf.bgText) : pf.fg;
		//console.log(n)
		n.label = agText(ui, n.content, color, bgText, pf.font);
		//console.log('gInfo', '\nparams', pf, '\nlabel', n.label)
		calcRays(n, gParent, R);
	}

	if (pf.border) {
		let th = isdef(pf.thickness) ? pf.thickness : 1;

		let color = decodeColor(pf.border);

		// let alpha=firstFloat(pf.border);
		// console.log('alpha',alpha);
		// let color = stringBefore(pf.border,' ');
		// if (alpha) color = anyColorToStandardString(color,alpha);
		let ch = ui.children[0];
		//console.log('child w/ shape that should get border is',ch,'\np:',pf, '\nport',n.content);
		ch.setAttribute('stroke', color);
		ch.setAttribute('stroke-width', th);
	}

	//g element needs to be positioned on top of its parent's uid pos
	positionGElement(ui, uidParent, gParent);

	return ui;
}
function positionGElement(ui, uidParent, topG) {
	let uiParent = mBy(uidParent);
	
	if (isdef(uiParent) && topG != uiParent) {

		console.log('positionGElement',ui.id, uiParent.id, topG.id);
		console.log(ui,uiParent,topG)

		//if (uidParent == '_4' || uidParent == '_5') console.log('uiParent', uiParent);
		let bds = getBounds(uiParent, true);
		let trans = getTransformInfo(uiParent);
		console.log('positionGElement,trans',trans)
		let [x, y] = [trans.translateX, trans.translateY];
		//console.log('______________ TRANS:', '\nx', x, '\ny', y, '\ntrans', trans, '\nw', bds.width, '\nh', bds.height);
		let x1 = -22; // x - bds.width / 2;
		let y1 = 0;//y - bds.height / 2;
		//console.log('______________ TRANS:', '\nx', x, '\ny', y, '\ntrans', trans, '\nw', bds.width, '\nh', bds.height);
		//console.log('ui:', ui, '\nuiParent', uiParent)

		let x2 = 0; let y2 = 0;
		let trans1 = uiParent.style.transform;
		let tt = trans1.split('translate');
		if (tt.length <= 1) {
			console.log('there is NO translate transform!!! uiParent',uiParent);
		} else {
			//assuming only translate transform!
			let traNumbersX = trans1.split('('); //getAttribute('transform');
			x2 = firstNumber(traNumbersX[1]);
			let traNumbersY = trans1.split(','); //getAttribute('transform');
			y2 = firstNumber(traNumbersY[1]);

		}
		//console.log('trans1', trans1, 'x2', x2, 'y2', y2);
		//ich brauche das translate nicht das bounds
		//if (uidParent == '_4' || uidParent == '_5') console.log('bounds of parent', bds);
		gPos(ui, x2, y2);

		//console.log('bbox', ui.getBBox());
		//console.log('bbox parent', uiParent.getBBox(), uidParent);

		let nParent = R.uiNodes[uidParent]
		let par1 = R.uiNodes[nParent.uidParent];
		let par2 = R.uiNodes[par1.uidParent];
		//console.log('nParent', nParent, 'par1', par1, 'par2', par2);

	}

	return ui;
}

//#region special types

//TODO: refine!!!
function addTitleToGrid(n,d){
	//if (n.data) { console.log('habe data', n.data) }
	if (n.content && n.params.padding) { 
		//console.log('habe content!!!', n.content); 
		let d1=mTextDiv(n.content, d); 
		d1.style.display='block';
		d1.style.backgroundColor='black';
	}
}
function mGrid(n, uidParent, R) { //enspricht jetzt dem basic type grid!!!!
	// *** stage 3: prep container div/svg/g (board) as posRel ***
	let dParent = mBy(n.idUiParent);

	let boardDiv = stage3_prepContainer(dParent);

	addTitleToGrid(n,boardDiv)

	let boardSvg = gSvg();

	let style = `margin:0;padding:0;position:absolute;top:0px;left:0px;width:100%;height:100%;`
	boardSvg.setAttribute('style', style);
	boardSvg.id = n.uid + '_svg';
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
	n.uidSvg = boardSvg.id;
	n.uidG = n.uid;

	//do your own styling!or WHAT??????????

	return ui;

}

//container types
function mPanel(n, uidParent, R) {
	//console.log('panel',n.uid,n.data,n.params)
	let dParent = mBy(n.idUiParent);

	if (getTypeOf(dParent) == 'g') { return gPanel(n, uidParent, R); }

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

	return ui;
}
function gPanel(n, uidParent, R) {
	gParent = mBy(uidParent);
	n.idUiParent = gParent.id;

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


function mList(n, uidParent, R) {

	let dParent = mBy(n.idUiParent);

	let ui = mDiv(dParent);

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);
	//mColor(ui, randomColor());
	return ui;
}
function mHand(n, uidParent, R) {
	let dParent = mBy(n.idUiParent);

	let ui = mDiv(dParent);
	addClass(ui, 'handStyle');

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);
	//mColor(ui, randomColor());
	return ui;
}

//leaf types
function mCard(n, uidParent, R) {
	let dParent = mBy(n.idUiParent);

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
function mPicto(n, uidParent, R) {

	let dParent = mBy(n.idUiParent);

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
function mTitle(n, uidParent, R) {
	let dParent = mBy(n.idUiParent);

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




