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

	//do your own styling!or WHAT??????????

	return ui;

}


//container types
function mPanel(n, dParent, R) {
	let ui;
	ui = mDiv(dParent);
	if (isdef(n.content)) {
		let d1 = mTextDiv(n.content, ui);
		//mStyle(d1,{padding:10});
	}

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

function mInfo(n, dParent, R) {
	//console.log(dParent)
	//console.log('--->info content',n.content)

	console.assert(isdef(n.content), 'mInfo with NO CONTENT!!!!!!!!!!!');

	let ui;
	if (getTypeOf(dParent) == 'g') {

		let pf = n.params;

		//if (n.oid=='1') console.log('params of board member', n.oid, jsCopy(pf))
		ui = gShape(pf.shape, pf.size, pf.size, pf.bg);
		if (n.content) {
			createLabel_dep(n, ui, R);
			// let color = nundef(pf.fg) ? nundef(pf.bg) ? null : colorIdealText(pf.bg) : pf.fg;
			// n.label = agText(ui, n.content, color, pf.font);
		}

	} else {
		//console.log(n.content)

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



