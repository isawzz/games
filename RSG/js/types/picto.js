
function mPicto(n, R, uidParent) {

	let dParent = mBy(n.idUiParent);

	//console.log(n.params)
	let ui;
	let w = (isdef(n.params.size.w)? n.params.size.w:50);
	let h = (isdef(n.params.size.h)? n.params.size.h:50);
	let fz = (isdef(n.params.fontSize)? n.params.fontSize:20);
	let bg = isdef(n.params.bg)?n.params.bg:randomColor();
	let fg = isdef(n.params.fg)?n.params.fg:colorIdealText(bg);

	let key = n.content; //key='crow';
	
	ui = pictoDiv(key, bg, w, h)
	mAppend(dParent, ui);

	//ui = createPicto({key:key,w:w,h:h,fg:fg,bg:bg,parent:dParent})

	// ui = maPicSimple(key);
	// ui.style.backgroundColor = randomColor();
	// ui.style.color = colorIdealText(ui.style.backgroundColor);
	// ui.style.minWidth = w+'px'; //n.params.size.w+'px';
	// ui.style.minHeight = h+'px'; //n.params.size.h+'px';
	// ui.style.boxSizing = 'border-box';
	// let gap = 10;
	// ui.style.fontSize = (h-gap)+'px';
	// let padh=' '+gap/2 + 'px ';
	// ui.style.padding = gap*.8+'px' + padh+gap*.2+'px'+padh;
	// ui.style.borderRadius = gap/2+'px';
	// mAppend(dParent, ui);

	//ui.style.paddingTop = gap*.75+'px';
	//addClass(ui.children[0],'centeredTL')
	// mAppend(uiWrapper, ui);
	//addClass(ui, 'pictoStyle');

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);

	return ui;
}

function lPicto(){}




function mPictoWrapper(n, R, uidParent) {

	let dParent = mBy(n.idUiParent);

	//console.log('haloooooooooooooooooo')
	//content should be key to iconChars_
	let uiWrapper = mDiv(dParent);
	addClass(uiWrapper, 'cardWrapper');

	let key = n.content; //key='crow';
	let ui = maPicSimple(key);
	mAppend(uiWrapper, ui);
	addClass(ui, 'pictoStyle');

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);

	return ui;
}
