function picDraw(info, dParent, styles, classes) {
	if (info.type == 'icon' || info.type == 'emotext') {
		console.log('text', info.text);

		let res = mPicX(info, dParent, styles, classes);
		//von styles kann einige wegnehmen!
		if (isdef(styles)) {
			let addStyles = {};
			for (const k in styles) {
				if (['bg', 'fg', 'rounding', 'w', 'h', 'padding', 'border'].includes(k)) continue;
				addStyles[k] = styles[k];
			}
			//mStyleX(res, addStyles);
		}
		console.log('res', res);
		info.ui = res;
		return info;
	} else {
		let d = mDiv(dParent);
		mClass(d, 'picOuter')
		let ui = mSvg(info.path, d); //, { w: 200, h: 200 });
		console.log('d', d);
		info.ui = d;
		return info;
	}

}

function fitsWithFont(text, styles, w, h, fz) {
	styles.fz = fz;
	let size = getSizeWithStyles(text, styles);
	if (isdef(styles.w)) return size.h <= h;
	else if (isdef(styles.h)) return size.w <= w;

}
function textTooBigByFactor(text, styles, w, h, fz) {
	styles.fz = fz;
	let size = getSizeWithStyles(text, styles);
	if (isdef(styles.w) && size.h > h + 1) {
		console.log('h', h, '\nsz', size.h, '\nfactor', h / size.h);
		return h / size.h;
	} else if (isdef(styles.h) && size.w > w + 1) {
		return w / size.w;
	} else return 0;

}
function textCorrectionFactor(text, styles, w, h, fz) {
	styles.fz = fz;
	let size = getSizeWithStyles(text, styles);
	if (isdef(styles.w) && Math.abs(size.h - h) > fz) {
		//console.log('h',h,'\nsz',size.h,'\nfactor',h/size.h);
		return size.h / h;
	} else if (isdef(styles.h) && Math.abs(size.w - w) > fz) {
		return size.w / w;
	} else return 0;

}

function fontTransition(fz, over) {
	console.log(over)
	if (over > 1.5) over = 1.5;
	else if (over < .5) over = 0.5;
	else if (over > 1) return fz - 1; else if (over < 1) return fz + 1;
	//if (over>=1) over=.9;else if (over<.5) over = .5;
	return fz /over;
}
function fitText(text, rect, dParent, styles, classes) {
	let l = rect.cx - (rect.w / 2); let t = rect.cy - (rect.h / 2); let d = mDivPosAbs(l, t, dParent);
	styles.family = 'arial'; styles['font-weight'] = 'normal'; styles.display = 'inline-block'; styles.w = rect.w; styles.bg = 'red'; let fz = 25;

	let over = textCorrectionFactor(text, styles, rect.w, rect.h, fz); let MAX = 20; let cnt = 0;
	let oldFz=0;let oldOldFz=0;
	while (over > 0 && fz >= 8) {
		cnt += 1; if (cnt > MAX) { console.log('MAX reached!!!'); break; }
		//console.log('over',over);
		if (over == 0) break; //perfect font!
		oldOldFz=oldFz;
		oldFz = fz;
		fz = Math.round(fontTransition(fz, over));
		if (oldFz == fz || oldOldFz == fz) break;

		//fz=Math.floor(fz*over);
		//console.log('using over',over);
		let newOver = textCorrectionFactor(text, styles, rect.w, rect.h, fz);
		let change = over - newOver;
		console.log('change', change, 'fz change from', oldFz, 'to', fz);
		over = newOver;
		//fz=fz*over;
	}

	console.log(fz)
	//styles.fz=25;
	d.innerHTML = text;
	mStyleX(d, styles);

	let b = getBounds(d);
	console.log('bounds', b)

	let h = getBounds(d).height;
	console.log(h, rect.h)

}





