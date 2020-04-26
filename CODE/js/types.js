//das sollte noch ueber createUi gehen fuer setUid und param stuff!!!
function mGrid(n, dParent, R) { //enspricht jetzt dem basic type grid!!!!
	// *** stage 2: prep area div (loc 'areaTable') as flexWrap ***
	//console.log(area)
	//let d = stage2_prepArea(area);

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


	//do your own styling!or WHAT??????????

	return ui;
	//R.setUid(n);

}


//container types
function mPanel(n, dParent, R) {
	let ui;
	ui = mDiv(dParent);

	//apply n.typParams!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// let params = decodeParams(n,{},R);
	// mStyle(ui,params);
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
	addClass(ui, 'hand');

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
	addClass(ui, 'card');

	// let ui = mTextDiv(n.content, dParent);
	// addClass(ui,'card'); 

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
	addClass(ui, 'wrapped');

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

function mInfo(n, dParent, R) {
	//console.log(dParent)
	console.log('--->info content',n.content)

	let ui;
	if (getTypeOf(dParent) == 'g') {

		let pf = n.params;
		//console.log('params of board member', n.oid, pf)
		ui = gShape(pf.shape, pf.size, pf.size, pf.bg);
		if (n.content) {
			//hier das createLabel!
			// createLabel(n, R);
			let color = nundef(pf.fg) ? nundef(pf.bg) ? null : colorIdealText(pf.bg) : pf.fg;
			n.label = agText(ui, n.content, color, pf.font)
		}

	} else {
		ui = mNode(n.content, { dParent: dParent });
	}




	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);
	// mStyle(ui, paramsToCss(n.params));
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
	panel: 'panels',
}





