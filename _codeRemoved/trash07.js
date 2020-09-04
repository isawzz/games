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











