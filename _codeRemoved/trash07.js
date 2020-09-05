//#region DOC
function genCollapsible(path, info) {
	let caption = stringAfterLast(path, '/');
	let classes = ['collapsible'];
	let dParent = mBy('menu');
	let b = mButton(caption, null, dParent, {}, classes);
	b.id = info.idLink;

	//let bView = mButton('view', e => showCollapsibleContent(e), b, { float: 'right' }, null);
	let bView = mPicButtonSimple('search', e => showCollapsibleContent(e), b,
	//  { float: 'right', margin: 0, 'background-color': 'dimgray' }, null);
	 { float: 'right', margin: 0 }, null);

	//let bView = mPicButton('search', e => showCollapsibleContent(e), b, { float: 'right', margin: 0 }, null);

	bView.addEventListener('mouseenter', ev => {
		let domel = ev.target;
		//domel.origColor = domel.style.backgroundColor;
		//domel.style.backgroundColor = 'red';
		domel.classList.remove('picButton');
		domel.classList.add('picButtonHover');
		console.log('==>classList',domel.classList);//,'\norig color',domel.origColor,domel);
		//mClass(domel,'picButtonHover');
		//ev.cancelBubble = true; 
		ev.stopPropagation = true; 
		//ev.defaultPrevented = true;
		//console.log('entering view button', '\nevent', ev, '\nbutton', this);
	});
	bView.addEventListener('mouseleave', ev => {
		let domel = ev.target;
		domel.classList.remove('picButtonHover')
		domel.classList.add('picButton');
		console.log('==>classList',domel.classList);
		// domel.style.backgroundColor = domel.origColor; //'violet';
		//ev.cancelBubble = true; 
		ev.stopPropagation = true; 
		//ev.defaultPrevented = true;
		// console.log('leaving view button', '\nevent', ev, '\nbutton', this);
	});

	//console.log('haaaaaaaaaaaaaaaaalo',b.style.padding)
	b.style.padding = '4px';

	return b;
}
//#endregion

//#region NOTO
function maPicText(info, dParent, outerStyles, innerStyles, classes) {
	let d = mDiv(dParent); mStyleX(d, outerStyles);
	let d1 = mDiv(d); mStyleX(d1, innerStyles);

	d1.innerHTML = info.text;

	let fz = innerStyles.fz;
	let [wdes, hdes] = [outerStyles.w - 2 * outerStyles.padding, outerStyles.h - 2 * outerStyles.padding];

	// let hc = getComputedStyle(d.firstChild).getPropertyValue('height'); //console.log('hc', hc);
	// let b = getBounds(d.firstChild); let bw = b.width; let bh = b.height;
	let size=getWordSize(info.text, fz, info.family);
	// let i = 0;
	// let a={d:d,child:d1};
	//console.log('a',a)
	while (size.w > wdes || size.h > hdes) {
		//console.log('round', i, 'w', bw, 'h', bh)
		fz -= 1;
		if (fz < 9) break;

		//fz of d.firstChild
		let child = d.firstChild;
		child.style.fontSize = fz + 'px';
		size=getWordSize(info.text, fz, info.family);
		//console.log('size',size,'fz',fz);
		// hc = getComputedStyle(d.firstChild).getPropertyValue('height');//console.log('hc',hc);
		// b = getBounds(child); bw = b.width; bh = b.height;
		//console.log('w', b.width, 'h', b.height, 'fz', fz, info.type, info.key);
		//padding of d
	}
	//console.log(b.width, b.height, fz, info.type, info.key);
	info.ui = d;
	info.uiInner = d.firstChild;
	return info;

}
function maPicText_dep2(info, dParent, styles = {}, classes) {

	let wTotal = isdef(styles.w) ? styles.w : 100;
	let hTotal = isdef(styles.h) ? styles.h : 100;
	// let padding = isdef(styles.padding) ? styles.padding : 0;
	// wTotal -= 2*padding;
	// hTotal -= 2*padding; //TODO koennte padx,pady machen!!!
	let rect = { w: wTotal, h: hTotal, cx: 120, cy: 100 };
	let text = info.text;

	let fg = isdef(styles.fg) ? styles.fg : null;

	let l = rect.cx - (rect.w / 2);
	let t = rect.cy - (rect.h / 2);
	let d;
	if (isdef(styles.x) || isdef(styles.y) || isdef(styles.left) || isdef(styles.top)) d = mDivPosAbs(l, t, dParent);
	else d = mDiv(dParent);
	// d.style.boxSizing = 'border-box';
	//d.style.display = 'inline';

	let dInner = fitWord(text, rect, d, { padding: 0, bg: 'green', fg: fg, family: info.family, weight: 900 });//, padding: 0}); //, 'box-sizing': 'border-box' });



	let b = getBounds(dInner);
	console.log('inner bounds', b.width, b.height)
	console.log()

	//jetzt muss ich padding machen
	let padx = (wTotal - b.width) / 2;
	let pady = (hTotal - b.height) / 2;
	// console.log('padx',padx,'pady',pady);

	// let newStyles = jsCopy(styles);
	// if (isdef(newStyles.padding)) delete newStyles.padding;
	// mStyleX(d,newStyles);
	d.style.width = wTotal + 'px';
	d.style.height = hTotal + 'px';
	d.style.backgroundColor = 'red';
	d.style.padding = pady + 'px ' + padx + 'px';

	info.ui = d;
	info.inner = dInner;

	let b1 = getBounds(dInner);
	console.log('inner bounds', b1.width, b1.height);
	console.log('...........', dInner.clientWidth, dInner.clientHeight)
	console.log(getBounds(dInner))
	setTimeout(() => console.log(getBounds(dInner)), 500)

	// d.style.display = 'inline-table';
	// d.style.width = wTotal+'px';

	return info;
}
function maPicText_dep(o, dParent, styles, classes) {
	//#region doc 
	/*	
usage: info* = maPicText('hallo',table);

o ... string or info or param for picSearch
dParent ... div object
styles ... dict of styles
classes ... list of classes

effect: draws info object as TEXT (so for emo this means: emoNoto font text)

returns info* ... info with ui (so info.ui will be a div)
	*/
	//#endregion 
	let info = isdef(o.hexcode) ? o : isString(o) ? picInfo(o) : picSearch(o);
	if (isList(info)) info = first(info);
	if (nundef(info)) return 'NOT POSSIBLE';

	let [w, h] = [100, 100];
	let [x, y] = [100, 100];

	let d = mDiv(dParent);
	d.style.position = 'relative';
	d.style.backgroundColor = 'red';
	let dt = mDiv(d);
	dt.style.position = 'absolute';
	dt.style.color = 'white';
	dt.style.backgroundColor = 'blue';



	let [w1, h1, fz] = findFittingFontSize(info.text, info.family, w, h);
	console.log('fz', fz, 'w,h', w, h, 'inner size: w1,h1', w1, h1);

	dt.style.fontSize = fz + 'px';//h * 6 / 7 + 'px';
	// dt.style.height = h + 'px';
	// dt.style.width = w + 'px';

	let [padx, pady] = [10, 10];
	d.style.height = h + 2 * pady + 'px';
	d.style.width = w + 2 * padx + 'px';
	let l = (w - w1) / 2 + padx;
	let t = (h - h1) / 2 + pady;
	dt.style.left = l + 'px';
	dt.style.top = t + 'px';

	dt.style.fontFamily = info.family;
	dt.innerHTML = info.text;


	//console.log(info);
	//jetzt hab ein info


	return info;
}
//#endregion











