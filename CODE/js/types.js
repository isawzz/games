function makeUiOnBoardMember(n, uidParent, R) {
	let ui;
	let divParent = findAncestorElemOfType(mBy(uidParent), 'div');
	n.idUiParent = divParent.id;
	let directParent = mBy(uidParent); //parent of robber
	//console.log('\ndivParent is', divParent, '\ndirectParent is', directParent);

	//el = mTextDiv(n.content	); 
	ui = mNode(n.content, divParent);
	//ui = isdef(n.content)?mNode(n.content, divParent):mDiv(divParent);

	//als erstes alle stylings!

	let pre = ui.children[0];
	if (!n.content) {
		//console.log('n.content is null!');
		pre.innerHTML = '';
		n.adirty=true;
	} else {
		//pre.style.color = 'black';
		pre.style.fontSize = '10pt';
	}
	//ui.style.backgroundColor='white';
	ui.style.borderRadius = '6px';
	ui.style.padding = '2px 10px 2px 8px';

	applyCssStyles(ui, n.cssParams);
	//ui.style.textAlign = 'left';

	//als zweites append damit getBounds functioniert
	mAppend(divParent, ui);

	//als LETZTES: positioning!
	let bmk = getBounds(directParent, false, divParent);//false,mBy('table'));
	ui.style.position = 'absolute';
	ui.style.display = 'inline-block';

	//das darf erst NACH inline-block sein weil size veraendert!!!!!!!!!
	let bel = getBounds(ui);
	ui.style.left = (bmk.left + (bmk.width - bel.width) / 2) + 'px';
	ui.style.top = (bmk.top + (bmk.height - bel.height) / 2) + 'px';
	//ui.style.left = (bmk.left+bmk.width/2)+'px';// (bmk.left + (bmk.width - bel.width) / 2) + 'px';
	// ui.style.top = (bmk.top + (bmk.height - bel.height) / 2) + 'px';

	//console.log('left', ui.style.left, 'top', ui.style.top, 'bounds', bmk, '\nui', ui)
	//console.log('params', n.params, '\ncssParams', n.cssParams);
	//n.cssParams = {};
	n.uiType = 'childOfBoardElement';
	n.potentialOverlap = true;
	return ui;

}
function mInvisible(n, uidParent, R) { let dParent = mBy(uidParent); let d = mDiv(dParent); n.idUiParent = d.id; return d; }
function mInfo(n, uidParent, R) {

	let ui;
	let dParent = mBy(uidParent);
	//console.log(uidParent, dParent, R.uiNodes)
	if (uidParent && isBoardMember(uidParent, R)) {
		//console.log('--------------isBoardMember', n.content)
		ui = makeUiOnBoardMember(n, uidParent, R);
	} else if (getTypeOf(dParent) == 'g') {
		//console.log('--------------g', n.content)
		return gInfo(n, uidParent, R);
	} else if (isdef(n.content)) {
		//console.log('--------------isdef(content)', n.content)
		ui = mNode(n.content, dParent);
		n.idUiParent = dParent.id;
		mClass(ui, 'node');
	} else {
		//console.log('--------------else', n.content)
		ui = mDiv(dParent);
		n.idUiParent = dParent.id;
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
		//if (uidParent == '_4' || uidParent == '_5') console.log('uiParent', uiParent);
		let bds = getBounds(uiParent, true);
		let trans = getTransformInfo(uiParent);
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
			console.log('there is NO tarnslate transform!!!');
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
function mGrid(n, uidParent, R) { //enspricht jetzt dem basic type grid!!!!
	// *** stage 3: prep container div/svg/g (board) as posRel ***
	let dParent = mBy(uidParent);
	n.idUiParent = dParent.id;

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
function mPanel(n, uidParent, R) {
	let dParent = mBy(uidParent);
	n.idUiParent = dParent.id;

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

	//apply n.typParams!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// }
	// else if (n.uiType == 'g'){
	// 	//now dParent is a g element!

	// }

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

	let dParent = mBy(uidParent);
	n.idUiParent = dParent.id;

	let ui = mDiv(dParent);

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);
	//mColor(ui, randomColor());
	return ui;
}
function mHand(n, uidParent, R) {
	let dParent = mBy(uidParent);
	n.idUiParent = dParent.id;

	let ui = mDiv(dParent);
	addClass(ui, 'handStyle');

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);
	//mColor(ui, randomColor());
	return ui;
}

//leaf types
function mCard(n, uidParent, R) {
	let dParent = mBy(uidParent);
	n.idUiParent = dParent.id;

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

	let dParent = mBy(uidParent);
	n.idUiParent = dParent.id;

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
	let dParent = mBy(uidParent);
	n.idUiParent = dParent.id;

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




function makeUiOnBoardMember_trial1(n, uidParent, R) {
	//let uiParent = R.uiNodes[uidParent];
	let ui; let el;
	let dParent = mBy(uidParent);
	if (isdef(n.content)) {
		el = ui = mNode(n.content, dParent);
		//mClass(ui, 'node');
	}
	//positioning
	let divParent = findAncestorElemOfType(mBy(uidParent), 'div');
	let directParent = mBy(uidParent); //parent of robber
	console.log('\ndivParent is', divParent, '\ndirectParent is', directParent);

	el = mTextDiv('HALLO');

	//console.log(bmk);
	// let domel=mDiv(); //makeRandomElement();//ok
	// let bo=document.getElementsByTagName('body')[0];
	// mAppend(bo,el);
	let dMain = mBy('table');
	dMain.style.position = 'relative';
	mAppend(divParent, el);
	//mAppend(mBy('main'),el);

	//console.log('elem',ibox.elem);//////////////////////////////
	el.style.position = 'relative';
	el.style.backgroundColor = 'blue';
	el.style.height = '100px';

	let bmk = getBounds(directParent, false, divParent);//false,mBy('table'));
	let bel = getBounds(el);
	el.style.left = (bmk.left + (bmk.width - bel.width) / 2) + 'px';
	el.style.top = (bmk.top + (bmk.height - bel.height) / 2) + 'px';
	// el.style.left = (bmk.left + bmk.width / 2) + 'px';
	// el.style.top = (bmk.top + bmk.height / 2) + 'px';
	//el.style.transform = 'translate(-50%,-50%)';
	el.style.display = 'inline-block';
	el.style.color = 'red';
	el.style.textAlign = 'center';
	console.log('left', el.style.left, 'top', el.style.top, 'bounds', bmk, '\nel', el)
	n.cssParams = {};
	ui = el;
	return ui;

}
function makeUiOnBoardMember_trial2(n, uidParent, R) {
	let ui; let el;
	let divParent = findAncestorElemOfType(mBy(uidParent), 'div');
	let directParent = mBy(uidParent); //parent of robber
	console.log('\ndivParent is', divParent, '\ndirectParent is', directParent);

	//el = mTextDiv(n.content); 
	el = mNode(n.content, divParent);
	let pre = el.children[0];
	pre.style.color = 'black'; el.style.backgroundColor = 'white';
	//pre.style.borderRadius = '6px';
	//pre.style.padding= '2px 10px 2px 8px';
	pre.style.fontSize = '10pt';


	//als erstes alle stylings!
	//el.style.color = 'red';el.style.backgroundColor='blue';
	el.style.borderRadius = '6px';
	el.style.padding = '2px 10px 2px 8px';
	//el.style.fontSize = '10pt';
	//mClass(el,'node')

	//als zweites append damit getBounds functioniert
	mAppend(divParent, el);

	//als LETZTES: positioning!
	let bmk = getBounds(directParent, false, divParent);//false,mBy('table'));
	let bel = getBounds(el);
	el.style.position = 'relative';
	el.style.display = 'inline-block';
	el.style.left = (bmk.left + (bmk.width - bel.width) / 2) + 'px';
	el.style.top = (bmk.top + (bmk.height - bel.height) / 2) + 'px';


	// font-size: 10pt;
	// background-color:white;
	// color:black;
	// text-align: left;
	// margin: 6px;
	// box-sizing: border-box;
	// padding: 2px 10px 2px 8px;
	// border-radius: 6px;

	// let d = mCreate('div');
	// mYaml(d, o);
	// let pre = d.getElementsByTagName('pre')[0];
	// pre.style.fontFamily = 'inherit';
	// if (isdef(title)) mInsert(d, mTextDiv(title));
	// if (isdef(dParent)) mAppend(dParent, d);
	// return d;


	// mClass(el,'node');
	// el.style.padding = '4px';
	//el.style.backgroundColor='yellow';
	//el.style.height='100px';


	console.log('left', el.style.left, 'top', el.style.top, 'bounds', bmk, '\nel', el)
	n.cssParams = {};
	ui = el;
	return ui;

}
function mInfo_lang(n, uidParent, R) {

	let ui;

	if (isBoardMember(uidParent, R)) {

	}


	let dParent = mBy(uidParent);

	//find out if this parent also has a div


	let uiParent = R.uiNodes[uidParent];
	console.log('.....uiParent of', n.uid, 'is', uidParent, uiParent);
	//er kommt hierher mit dem robber
	//stellt fest dass dParent ein G elem ist
	//2 choices:
	//a: suche last div ueber svg (gehoert zu board)
	//wie bekomme ich das object zu uid?
	let uid = n.uid;
	let oid = R.uid2oids[uid];
	let o = R.getO(oid);
	//console.log('ROBBER>>>???',o)
	if (o.obj_type == 'robber') {

		//obj mit parent der g ist == parent ist ein board oder board element,
		//dh, alles wird auf div von parent plaziert
		//1. parent ist board: no need to do this, placement ist done in genGrid
		//how to find out if parent is a board?
		//right now could ask if parent has a div, svg and g elements
		let uiParent = R.uiNodes[uidParent];

		//2. parent is board elem: this elem



		console.log('ja found robber', n, o);
		let gTest = findAncestorElemOfType(mBy(uidParent), 'div');
		console.log('gTest is', gTest);

		let p = mBy(uidParent); //parent of robber
		console.log(p)
		let bmk = getBounds(p, false, gTest);//false,mBy('table'));
		//console.log(bmk);
		let el = mTextDiv('HALLO');
		// let domel=mDiv(); //makeRandomElement();//ok
		// let bo=document.getElementsByTagName('body')[0];
		// mAppend(bo,el);
		let dMain = mBy('table');
		dMain.style.position = 'relative';
		mAppend(gTest, el)
		//mAppend(mBy('main'),el);

		//console.log('elem',ibox.elem);//////////////////////////////
		el.style.position = 'relative';
		let bel = getBounds(el);
		console.log('bounds of robber elem', bel);
		el.style.left = (bmk.left + (bmk.width - bel.width) / 2) + 'px';
		el.style.top = (bmk.top + (bmk.height - bel.height) / 2) + 'px';
		el.style.color = 'red';
		el.style.textAlign = 'center';
		// el.style.left = (bmk.left + bmk.width / 2) + 'px';
		// el.style.top = (bmk.top + bmk.height / 2) + 'px';
		console.log('left', el.style.left, 'top', el.style.top, 'bounds', bmk, '\nel', el)
		n.cssParams = {};
		ui = el;
		return ui;
	}
	// dann berechne pos und place info there
	//b: mach ein gInfo

	//console.log(n,'\ndParent:',dParent)
	//if (n.oid == '3') console.log('params',n)

	if (getTypeOf(dParent) == 'g') {
		return gInfo(n, uidParent, R);
	} else if (isdef(n.content)) {
		ui = mNode(n.content, dParent);
		mClass(ui, 'node')
	} else {
		ui = mDiv(dParent);
		ui.style.display = 'hidden';
	}
	return ui;
}
