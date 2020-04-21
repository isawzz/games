var FUNCTIONS = {
	instanceof: 'instanceOf',
	obj_type: (o, v) => o.obj_type == v,
	prop: (o, v) => isdef(o[v]),
	no_prop: (o, v) => nundef(o[v]),
}
const RCREATE = {
	info: mInfo,
	list: mList,
	panel: mPanel,
}
const RCONTAINERPROP = {
	list: 'elm',
	panel: 'panels',
}

function mPanel(n, dParent, R) {

	let ui;
	if (n.oid) {
		let outer = mDiv(dParent);
		//mStyle(outer,{border:'solid 1px silver'});
		let d=mTextDiv(n.oid,outer);
		mStyle(d,{'text-align':'left','margin-left':4})
		ui = mDiv(outer);
	}else{
		ui = mDiv(dParent);
	}

	mStyle(ui, paramsToCss(n.params));
	mColor(ui, randomColor());
	return ui;
}
function mList(n, dParent, R) {

	let ui = mDiv(dParent);
	mStyle(ui, paramsToCss(n.params));
	//mColor(ui, randomColor());
	return ui;
}
function mInfo(n, dParent, R) {
	let ui = mNode(n.content, { dParent: dParent });
	mStyle(ui, paramsToCss(n.params));
	return ui;
}

function instanceOf(o, className) {
	let otype = o.obj_type;
	switch (className) {
		case '_player':
		case 'player': return ['me', '_me', 'player', '_player', 'opp', 'opponent', '_opponent'].includes(otype); break;
		// case '_player': return otype == 'GamePlayer' || otype == 'opponent'; break;
		case 'building': return otype == 'farm' || otype == 'estate' || otype == 'chateau' || otype == 'settlement' || otype == 'city' || otype == 'road'; break;
	}
}

function createUi(n, area, R) {
	let defs = R.defs[n.type].params;

	if (nundef(n.params)) n.params = jsCopy(defs);
	else n.params = deepmergeOverride(defs, n.params);

	n.ui = RCREATE[n.type](n, mBy(area), R);

	// //console.log(n.params)
	// RSTYLE[n.type](n.ui, n.params);

	R.setUid(n);

}

function adjustContainerLayout(n, R) {
	//console.log('==>', n)
	let params = n.params;
	let num = n.children.length;

	let or = params.orientation ? params.orientation : DEF_ORIENTATION;

	//console.log(params, num, or);

	let reverseSplit = false;
	let split = params.split ? params.split : DEF_SPLIT;

	if (split == 'equal') split = (1 / num);
	else if (isNumber(split)) reverseSplit = true;

	mFlex(n.ui, or);

	// for (let i = 0; i < num; i++) {
	// 	let d = n.children[i].ui;
	// 	mFlexChildSplit(d, split);

	// 	if (reverseSplit) { split = 1 - split; }
	// }
}
function adjustBoardLayout(n, R) {
	
}

//#region small helpers
function detectBoardObject(data){	return firstCondDictKeys(data,x=>isdef(data[x].map));}
function detectBoardType(oBoard,data){
	//console.log(oBoard)
	let fid0 = getElements(oBoard.fields)[0];
	//console.log(fid0)
	let nei=data[fid0].neighbors;
	//console.log('nei',nei);
	let len = nei.length;
	return len==6?'hexGrid':'quadGrid'; //for now!
}







