const RCREATE = {
	info: mInfo,
	list: mInfo,
	panel: mInfo,
}

const RSTYLE = {
	info: (ui, params) => mStyle(ui, paramsToCss(params)),
	list: (ui, params) => mStyle(ui, paramsToCss(params)),
	panel: (ui, params) => mStyle(ui, paramsToCss(params)),
}

const RCONTAINERPROP ={
	list:'elm',
	panel:'panels',
}

function mInfo(content, dParent = null) {
	let ui = mNode(content, { dParent: dParent });
	return ui;
}
function mInfo_dep(content, params, dParent = null) {
	//console.log('__________',params)
	let ui = mNode(content, { dParent: dParent });
	let cssParams = paramsToCss(params);
	// console.log(cssParams);
	// ui.style.fontSize='40px';
	//mClass(ui,'info');
	//ui.style.fontFamily='Work Sans';//"'Work Sans', sans-serif";//"//'Arial, Helvetica, sans-serif';
	mStyle(ui, cssParams);
	//	ui.style.fontFamily='AlgerianRegular';

	return ui;
}
