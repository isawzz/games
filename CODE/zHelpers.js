// code that should be or is already deprecated: backward compatibility only & to be replaced!
function mFlex(d, or = 'h') {
	d.style.display = 'flex';
	d.style.flexFlow = (or == 'v' ? 'column' : 'row') + ' ' + (or == 'w' ? 'wrap' : 'nowrap');
	// d.style.alignItems = 'stretch';
	// d.style.alignContent = 'stretch';
	// d.style.justiifyItems = 'stretch';
	// d.style.justifyContent = 'stretch';
}
function mFlexCenterContent(d) { mStyle(d, { 'justify-content': 'center', 'align-items': 'center' }); }
function mFlexChild(d, grow = 1, shrink = 0, base = 'auto') {
	// d.style.flexGrow=1;
	// d.style.flexBase='50%';
	d.style.flex = '' + grow + ' ' + shrink + ' ' + base;
}
function mFlexChildSplit(d, split) {
	if (split != 1) { split *= 10; if (split % 2 == 0) split /= 2; }
	d.style.flex = '' + split + ' 0 auto'; //NO
	//trace(split)
	// d.style.flex = '1 0 auto'; //NO
	// d.style.flex = '1 0 ' + (split * 100) + '%';
}
function mFlexLinebreak(d) { if (isString(d)) d = mBy(d); let lb = mDiv(d); mClass(lb, 'linebreak'); return lb; }
function mFlexWrap(d) { d.style.display = 'flex'; d.style.flexWrap = 'wrap'; }
function mFlexWrapGrow(d) { d.style.display = 'flex'; d.style.flexWrap = 'wrap'; d.style.flex = 1; }

function mPicButton(key, handler, dParent, styles, classes) {
	let x = createPicto({
		key: key, w: 20, h: 20, unit: 'px', fg: 'yellow', bg: 'violet',
		padding: 2, margin: 0, cat: 'd', parent: dParent, rounding: 4
	});
	//return x;
	// let x = mCreate('button');
	// x.innerHTML = caption;
	if (isdef(handler)) x.onclick = handler;
	// if (isdef(dParent)) dParent.appendChild(x);
	if (isdef(styles)) {
		//console.log('style of picButton', styles)
		mStyle(x, styles);
		//mClass(dParent,'vCentered')
	}
	if (isdef(classes)) { mClass(x, ...classes); }
	else mClass(x, 'picButton');
	return x;
}
function mPicButtonSimple(key, handler, dParent, styles, classes) {
	
	let x = createPictoSimple({ key: key, cat: 'd', parent: dParent });
	if (isdef(handler)) x.onclick = handler;
	if (isdef(styles)) { mStyle(x, styles); }
	if (isdef(classes)) { mClass(x, ...classes); }
	//else mClass(x, 'picButton');
	return x;
}

function mSizePic(d, w, h = 0, unit = 'px') {
	return mStyle(d, { 'font-size': h / 2, 'font-weight': 900, 'padding-top': h / 4, 'text-align': 'center', 'box-sizing': 'border-box', width: w, height: h ? h : w }, unit);
}

function mStyle(elem, styles, unit = 'px') {
	//console.log(':::::::::styles',styles)
	for (const k in styles) {
		//if (k=='font-family') continue;
		//console.log('setting',k,'to',styles[k]);
		elem.style.setProperty(k, makeUnitString(styles[k], unit));
	}

}
function mStyleX(elem, styles, unit = 'px') {
	const paramDict = {
		bg: 'background-color',
		fg: 'color',
		align: 'text-align',
		matop: 'margin-top',
		maleft: 'margin-left',
		mabottom: 'margin-bottom',
		maright: 'margin-right',
		patop: 'padding-top',
		paleft: 'padding-left',
		pabottom: 'padding-bottom',
		paright: 'padding-right',
		rounding: 'border-radius',
		w: 'width',
		h: 'height',
		fontSize: 'font-size',
		fz: 'font-size',
		family: 'font-family',
		weight: 'font-weight',
	};
	//console.log(':::::::::styles',styles)
	let bg, fg;
	if (isdef(styles.bg) || isdef(styles.fg)) {
		[bg, fg] = getExtendedColors(styles.bg, styles.fg);
	}
	if (isdef(styles.vmargin) && isdef(styles.hmargin)) {
		styles.margin = vmargin + unit + ' ' + hmargin + unit;
	}
	if (isdef(styles.vpadding) && isdef(styles.hpadding)) {
		styles.padding = vpadding + unit + ' ' + hpadding + unit;
	}

	//console.log(styles.bg,styles.fg);

	for (const k in styles) {
		let val = styles[k];
		let key = k;
		if (isdef(paramDict[k])) key = paramDict[k];
		else if (k == 'font' && !isString(val)) {
			//font would be specified as an object w/ size,family,variant,bold,italic
			// NOTE: size and family MUST be present!!!!!!! in order to use font param!!!!
			let fz = f.size; if (isNumber(fz)) fz = '' + fz + 'px';
			let ff = f.family;
			let fv = f.variant;
			let fw = isdef(f.bold) ? 'bold' : isdef(f.light) ? 'light' : f.weight;
			let fs = isdef(f.italic) ? 'italic' : f.style;
			if (nundef(fz) || nundef(ff)) return null;
			let s = fz + ' ' + ff;
			if (isdef(fw)) s = fw + ' ' + s;
			if (isdef(fv)) s = fv + ' ' + s;
			if (isdef(fs)) s = fs + ' ' + s;
			elem.style.setProperty(k, s);
			continue;
		} else if (k == 'border') {
			if (val.indexOf(' ') < 0) val = 'solid 1px ' + val;
		}

		//console.log(key,val,isNaN(val));if (isNaN(val) && key!='font-size') continue;

		if (key == 'font-weight') { elem.style.setProperty(key, val); continue; }
		else if (key == 'background-color') elem.style.background = bg;
		else if (key == 'color') elem.style.color = fg;
		else {
			//console.log('set property',key,makeUnitString(val,unit),val,isNaN(val));
			//if ()
			elem.style.setProperty(key, makeUnitString(val, unit));
		}
	}
}



















