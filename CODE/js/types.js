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
	boardDiv.id = n.uid + '_div';
	n.bi.boardSvg = boardSvg;
	let ui = n.bi.boardG = boardG;
	n.uiType = 'h';

	n.uidDiv = n.uidStyle = boardDiv.id;
	n.uidG = n.uid;

	return ui;

}

//container types
function mList(n, dParent, R) {

	let ui = mDiv(dParent);
	return ui;
}
function mHand(n, dParent, R) {

	let ui = mDiv(dParent);
	addClass(ui, 'handStyle');
	return ui;
}
function gPanel(n, gParent, R) {
	if (isdef(n.ui)) {
		// removeAllEvents(n.ui);
		// n.act = null;
		delete n.changing;
		return n.ui;
	}

	console.log('EIN NEUES G PANEL?????? ECHT?????')
	let ui = agG(gParent);
	n.uiType = 'g';
	return ui;
}
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
//leaf types
function mInfo(n, dParent, R) {
	let ui;
	if (getTypeOf(dParent) == 'g') {
		return gInfo(n, dParent, R);
	} else if (isdef(n.content)) {
		ui = mNode(n.content, dParent);
		mClass(ui,'node'); //@@@5
	} else {
		ui = mDiv(dParent);
		ui.style.display = 'hidden';
	}
	return ui;
}
function gInfo(n, gParent, R) {
	let pf = n.params;
	let ui = gShape(pf.shape, pf.size, pf.size, pf.bg, pf.rounding);
	gParent.appendChild(ui);
	if (n.content) {
		let color = nundef(pf.fg) ? nundef(pf.bg) ? null : colorIdealText(pf.bg) : pf.fg;
		n.label = agText(ui, n.content, color, pf.font);
	}



	return ui;
}
function mCard(n, dParent, R) {
	let uiWrapper = mDiv(dParent);
	addClass(uiWrapper, 'cardWrapper');
	let ui = mTextDiv(n.content, uiWrapper);
	addClass(ui, 'cardStyle');
	return ui;
}
function mPicto(n, dParent, R) {
	let uiWrapper = mDiv(dParent);
	addClass(uiWrapper, 'cardWrapper');

	let key = n.content; //key='crow';
	let ui = mPic(key);
	mAppend(uiWrapper, ui);
	addClass(ui, 'pictoStyle');
	return ui;
}
function mTitle(n, dParent, R) {
	//console.log(n,dParent)
	let ui = mTextDiv(n.content, dParent);
	return ui;
}

function isSpecType(t) { return isdef(R.lastSpec[t]); }
function isContainerType(t) { return t == 'panel' || t == 'list' || t == 'hand'; }
function isLeafType(t) { return t == 'info' || t == 'title' || t == 'card' || t == 'picto'; }
//function isPositionedType(t) { return t == 'boardElement'; }
function isGridType(t) { return t == 'grid'; }


const RCREATE = {
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
const DEF_ORIENTATION = 'h';
const DEF_SPLIT = 'equal';




