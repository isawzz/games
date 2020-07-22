function mPicto(n, R, uidParent) {

	let dParent = mBy(n.idUiParent);

	//console.log('haloooooooooooooooooo')
	//content should be key to iconChars
	//let uiWrapper = mDiv(dParent);
	//addClass(uiWrapper, 'cardWrapper');

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

	// ui = mPic(key);
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
function createPicto({ key, w = 60, h = 60, unit = 'px', fg = 'blue', bg, padding = 6, cat, parent, border='1px solid red', rounding=4 }) {
	if (nundef(key)) key = getRandomKey(iconChars);
	let ch = iconChars[key];
	let family = (ch[0] == 'f' || ch[0] == 'F') ? 'pictoFa' : 'pictoGame';
	let text = String.fromCharCode('0x' + ch);
	cat = isdef(parent) ? getTypeOf(parent) == 'div' ? 'd' : 'g' : isdef(cat) ? cat : 'd';
	let domel;
	if (cat == 'd') {
		let d = document.createElement('div');
		d.style.textAlign = 'center';
		d.style.fontFamily = family;
		d.style.fontWeight = 900;
		d.style.fontSize = h + unit;
		if (isdef(bg)) d.style.backgroundColor = bg;
		if (isdef(fg)) d.style.color = fg;
		d.innerHTML = text;
		domel = d;
		if (isdef(padding)) d.style.padding = padding + unit;
		d.style.display = 'inline-block';
		d.style.height = h + 2 * padding + unit;
		d.style.width = d.style.height;
		//d.style.textAlign = 'center';
		console.log('padding', padding, 'unit', unit, 'w', d.style.width, 'h', d.style.height);
		if (isdef(border)) d.style.border = border;
		if (isdef(rounding)) d.style.borderRadius = rounding + unit;
	} else {
		//create a g element
		//add a rectangle element w/ or wo/ stroke and rounding
		//add a text element

	}
	domel.key = key;
	if (parent) parent.appendChild(domel);
	return domel;
}
