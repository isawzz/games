const RCREATE = {
	info: mInfo,
	list: mList,
	card: mCard,
	hand: mHand,
	panel: mPanel,
	title: mTitle,
	picto: mPicto,
}
const RCONTAINERPROP = {
	list: 'elm',
	hand: 'elm',
	panel: 'panels',
}

//container types
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

//leaf types
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
function mPicto(n, dParent, R) {

	//console.log('haloooooooooooooooooo')
	//content should be key to iconChars
	let uiWrapper = mDiv(dParent);
	addClass(uiWrapper,'cardWrapper');

	let key = n.content; //key='crow';
	let ui = mPic(key);
	mAppend(uiWrapper,ui);
	addClass(ui,'wrapped'); 

	let params = decodeParams(n,{},R);
	mStyle(ui, params);

	return ui;
}
function mTitle(n,dParent,R){
	//console.log(n,dParent)
	let ui = mTextDiv(n.content, dParent);

	let params = decodeParams(n,{},R);
	mStyle(ui, params);
	// mStyle(ui, paramsToCss(n.params));
	return ui;
}
function mInfo(n, dParent, R) {
	//console.log(n.content)
	let ui = mNode(n.content, { dParent: dParent });

	let params = decodeParams(n,{},R);
	mStyle(ui, params);
	// mStyle(ui, paramsToCss(n.params));
	return ui;
}

function isSpecType(t) { return isdef(R.lastSpec[t]); }
function isContainerType(t) { return t == 'panel' || t == 'list' || t == 'hand'; }
function isLeafType(t) { return t == 'info' || t == 'title' || t == 'card' || t == 'picto'; }
//function isPositionedType(t) { return t == 'boardElement'; }
function isGridType(t) { return t == 'grid'; }








