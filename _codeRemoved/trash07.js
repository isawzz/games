//#region maPic
function maPic_2(infokey, dParent, styles, isText = true) {
	//koennte auch im endeffekt die styles aendern
	let info = isString(infokey) ? picInfo(infokey) : infokey;

	//console.log(info)

	let outerStyles = isdef(styles) ? jsCopy(styles) : {};
	outerStyles.display = 'inline-block';
	let innerStyles = { family: info.family };
	let [padw, padh] = isdef(styles.padding) ? [styles.padding, styles.padding] : [0, 0];

	let dOuter = mDiv(dParent);
	let d = mDiv(dOuter);
	d.innerHTML = info.text;

	let wdes, hdes, fzdes, wreal, hreal, fzreal, f;

	if (isdef(styles.w) && isdef(styles.h)) {
		[wdes, hdes] = [styles.w, styles.h];

		let fw = wdes / info.w;
		let fh = hdes / info.h;
		f = Math.min(fw, fh);
		fzreal = f * info.fz;
		wreal = f * info.w;
		hreal = f * info.h;

		padw += (wdes - wreal) / 2;
		padh += (hdes - hreal) / 2;
	} else if (isdef(styles.w) && isdef(styles.fz)) {
		[wdes, fzdes] = [styles.w, styles.fz];

		let fw = wdes / info.w;
		let ffz = fzdes / info.fz;
		f = Math.min(fw, ffz);
		fzreal = f * info.fz;
		wreal = f * info.w;
		hreal = f * info.h;

		padw += (wdes - wreal) / 2;
		padh += 0;

	} else if (isdef(styles.h) && isdef(styles.fz)) {
		[hdes, fzdes] = [styles.h, styles.fz];

		let fh = hdes / info.h;
		let ffz = fzdes / info.fz;
		f = Math.min(fh, ffz);
		fzreal = f * info.fz;
		wreal = f * info.w;
		hreal = f * info.h;

		padw += 0;
		padh += (hdes - hreal) / 2;

	} else if (isdef(styles.h)) {
		hdes = styles.h;
		f = hdes / info.h;
		fzreal = f * info.fz;
		wreal = f * info.w;
		hreal = f * info.h;
		padw += 0;
		padh += (hdes - hreal) / 2;
	} else if (isdef(styles.w)) {
		wdes = styles.w;
		f = wdes / info.w;
		fzreal = f * info.fz;
		wreal = f * info.w;
		hreal = f * info.h;
		padw += (wdes - wreal) / 2;
		padh += 0;
	} else if (isdef(styles.fz)) {
		fzdes = styles.fz;
		f = fzdes / info.fz;
		fzreal = f * info.fz;
		wreal = f * info.w;
		hreal = f * info.h;
		padw += 0;
		padh += 0;
	}
	fzreal = f * info.fz;
	wreal = f * info.w;
	hreal = f * info.h;
	padw += isdef(styles.w) ? (wdes - wreal) / 2 : 0;
	padh += isdef(styles.h) ? (hdes - hreal) / 2 : 0;

	console.assert(padw >= 0 && padh >= 0, 'BERECHNUNG FALSCH!!!!')

	innerStyles.fz = fzreal;
	innerStyles.weight = 900;
	innerStyles.w = wreal;
	innerStyles.h = hreal;
	mStyleX(d, innerStyles);

	outerStyles.padding = '' + padh + 'px ' + padw + 'px';
	outerStyles.w = wreal;
	outerStyles.h = hreal;
	//console.log(outerStyles)
	mStyleX(dOuter, outerStyles);

}

function maPic_1(infokey, dParent, styles, isText = true) {
	//koennte auch im endeffekt die styles aendern
	let info = isString(infokey) ? picInfo(infokey) : infokey;

	//console.log(info)

	let outerStyles = isdef(styles) ? jsCopy(styles) : {};
	outerStyles.display = 'inline-block';
	let innerStyles = { family: info.family };
	let [padw, padh] = isdef(styles.padding) ? [styles.padding, styles.padding] : [0, 0];

	let dOuter = mDiv(dParent);
	let d = mDiv(dOuter);
	d.innerHTML = info.text;

	let wdes, hdes, fzdes, fz, wreal, hreal;

	if (isdef(styles.w) && isdef(styles.h)) {
		[wdes, hdes] = [styles.w, styles.h];

		let fw = wdes / info.w;
		let fh = hdes / info.h;
		let f = Math.min(fw, fh);
		fz = f * info.fz;
		wreal = f * info.w;
		hreal = f * info.h;

		padw += (wdes - wreal) / 2;
		padh += (hdes - hreal) / 2;
	}

	console.assert(padw >= 0 && padh >= 0, 'BERECHNUNG FALSCH!!!!')

	innerStyles.fz = fz;
	innerStyles.weight = 900;
	innerStyles.w = wreal;
	innerStyles.h = hreal;
	mStyleX(d, innerStyles);

	outerStyles.padding = '' + padh + 'px ' + padw + 'px';
	outerStyles.w = wreal;
	outerStyles.h = hreal;
	//console.log(outerStyles)
	mStyleX(dOuter, outerStyles);

}


//#endregion

//#region PIC
$.fn.resizeText = function (options) {

	var settings = $.extend({ maxfont: 40, minfont: 4 }, options);

	var style = $('<style>').html('.nodelays ' +
		'{ ' +
		'-moz-transition: none !important; ' +
		'-webkit-transition: none !important;' +
		'-o-transition: none !important; ' +
		'transition: none !important;' +
		'}');

	function shrink(el, fontsize, minfontsize) {
		if (fontsize < minfontsize) return;

		el.style.fontSize = fontsize + 'px';

		if (el.scrollHeight > el.offsetHeight) shrink(el, fontsize - 1, minfontsize);
	}

	$('head').append(style);

	$(this).each(function (index, el) {
		var element = $(el);

		element.addClass('nodelays');

		shrink(el, settings.maxfont, settings.minfont);

		element.removeClass('nodelays');
	});

	style.remove();
}





//#endregion

//#region PIC sammelDict - symbolDict
async function correctExistingSammelDict(filename, n) {
	let mod = await correctSammelDict(filename, 10);
	console.log(mod);
}
async function komplettNeuesSammelDict() {
	await sammelDictFromCsv();
	saveSammelDict();
}
async function correctSammelDict(filename, n) {
	sammelDict = await route_symbolDict(filename);
	//console.log(sammelDict);
	let modifiedRecords = {};
	//makeSymYaml();
	//jetzt hab ich das sammelDict und kann fuer die emos corrections machen!!!
	symbolKeys = Object.keys(sammelDict);
	let MAX = isdef(n) ? n : symbolKeys.length;
	let i = -1;
	symbolKeys.sort();
	for (const k of symbolKeys) {
		i += 1; if (i >= MAX) break;
		let info = sammelDict[k];
		info.index = i;
		if (info.type != 'emo') { modifiedRecords[k] = jsCopy(info); continue; }
		let tags = [];
		//let tbdel = [];
		modifiedRecords[k] = {};
		for (const k1 in info) {
			//console.log(k1)
			if (keysForAll.includes(k1) || keysForEmo.includes(k1)) { modifiedRecords[k][k1] = info[k1]; }
			else {
				let val = info[k1];
				if (!isString(val)) { continue; }
				//console.log(val)
				val = val.trim();
				//console.log(val);
				if (isEmpty(val)) { continue; }
				if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(val[0])) { console.log(val); continue; }
				if (firstNumber(val)) { continue; }
				console.log('durchgekommen:', val)
				tags.push(val);
			}
		}
		modifiedRecords[k].tags = tags;
		//tbdel.map(x => delete info[x])
		// if (!isEmpty(tags)) { console.log(k, tags); }
		//order ist sowieso mist, hau ich gleich raus
		//brauch eigentlich NUR die 
	}
	// if (MAX>0)
	console.log('DONE!');
	if (MAX == symbolKeys.length) { sammelDict = modifiedRecords; saveSammelDict(); }
	return modifiedRecords;
}

//#endregion

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
		console.log('==>classList', domel.classList);//,'\norig color',domel.origColor,domel);
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
		console.log('==>classList', domel.classList);
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
	let size = getWordSize(info.text, fz, info.family);
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
		size = getWordSize(info.text, fz, info.family);
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











