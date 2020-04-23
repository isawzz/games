const RCREATE = {
	info: mInfo,
	list: mList,
	card: mCard,
	hand: mHand,
	panel: mPanel,
	title: mTitle,
}
const RCONTAINERPROP = {
	list: 'elm',
	hand: 'elm',
	panel: 'panels',
}

function mPanel(n, dParent, R) {
	let ui;
	ui = mDiv(dParent);
	let params = decodeParams(n,{},R);
	mStyle(ui,params);
	return ui;
}
function mList(n, dParent, R) {

	let ui = mDiv(dParent);
	let params = decodeParams(n,{},R);
	mStyle(ui, params);
	//mColor(ui, randomColor());
	return ui;
}

function mHand(n, dParent, R) {

	let ui = mDiv(dParent);
	addClass(ui,'hand');
	let params = decodeParams(n,{},R);
	mStyle(ui, params);
	//mColor(ui, randomColor());
	return ui;
}
function mCard(n, dParent, R) {

	//fuer solution 2:
	let uiWrapper = mDiv(dParent);
	addClass(uiWrapper,'cardWrapper');
	let ui=mTextDiv(n.content, uiWrapper);
	addClass(ui,'card'); 

	// let ui = mTextDiv(n.content, dParent);
	// addClass(ui,'card'); 

	let params = decodeParams(n,{},R);
	mStyle(ui, params);

	return ui;
}


function mTitle(n,dParent,R){
	//console.log(n,dParent)
	let ui = mTextDiv(n.content, dParent);
	mStyle(ui, paramsToCss(n.params));
	return ui;
}

function mInfo(n, dParent, R) {
	//console.log(n.content)
	let ui = mNode(n.content, { dParent: dParent });
	mStyle(ui, paramsToCss(n.params));
	return ui;
}

function isSpecType(t) { return isdef(R.lastSpec[t]); }
function isContainerType(t) { return t == 'panel' || t == 'list' || t == 'hand'; }
function isLeafType(t) { return t == 'info' || t == 'title' || t == 'card'; }
//function isPositionedType(t) { return t == 'boardElement'; }
function isGridType(t) { return t == 'grid'; }








