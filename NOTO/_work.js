function prelims(rect, dParent, styles) {
	let l = rect.cx - (rect.w / 2);
	let t = rect.cy - (rect.h / 2);

	let d = mDivPosAbs(l, t, dParent);

	styles.display = 'inline-block'; styles.bg = 'orange';
	//styles.w = rect.w;
	return [l, t, d];
}
function fontCorrection(text, styles, w, h, fz) {
	styles.fz = fz;
	styles.w = w;
	let size = getSizeWithStylesX(text, styles);
	console.log(size);
	let dw = w - size.w;
	let dh = h - size.h;

	//if dw>0 was bedeutet das?
	//habe mehr platz, dh schrift=fz zu klein

	//if dh>0 was bedeutet das?
	//habe mehr platz, dh schrift=fz zu klein

	if (dw < 0 || dh < 0) {
		//bedeutet dass fz zu GROSS ist!!!!
		//reduziere fz!
		return fz - 1;
	}

	return Math.max(size.h / h, size.w / w);


	if (size.h > h - 10 || size.w > w - 10) { return Math.max(size.h / h, size.w / w); }
	else if (size.h < h - 10 && size.w < w - 10) { return Math.min(size.h / h, size.w / w); }
	if (Math.abs(size.h - h) > fz || size.w > w) {
		//console.log('h',h,'\nsz',size.h,'\nfactor',h/size.h);
		return size.h / h;
		// } else if (isdef(styles.h) && Math.abs(size.w - w) > fz) {
		// 	return size.w / w;
	} else return 0;
}

function fitTextXX(text, rect, dParent, styles, classes) {
	let [l, t, d] = prelims(rect, dParent, styles);

	let fz = 20;
	let newFont = 100;let MAX = 5; let cnt = 0;
	while (newFont != fz) {
		cnt+=1;if (cnt>MAX){ console.log('MAX reached!!!'); break; }

		let res = fontCorrection(text, styles, rect.w, rect.h, fz); 


	}

	// textCorrectionFactorX(text, styles, rect.w, rect.h, fz); 
	// let oldFz = 0; let oldOldFz = 0;


	// return;

	// while (over > 0 && fz >= 8) {
	// 	cnt += 1; if (cnt > MAX) { console.log('MAX reached!!!'); break; }
	// 	console.log('over', over, 'fz', fz);
	// 	if (over == 0) break; //perfect font!
	// 	oldOldFz = oldFz;
	// 	oldFz = fz;
	// 	fz = Math.round(fontTransition(fz, over));
	// 	if (oldFz == fz || oldOldFz == fz) break;

	// 	//fz=Math.floor(fz*over);
	// 	//console.log('using over',over);
	// 	let newOver = textCorrectionFactorX(text, styles, rect.w, rect.h, fz);
	// 	let change = over - newOver;
	// 	//console.log('change', change, 'fz change from', oldFz, 'to', fz);
	// 	over = newOver;
	// 	//fz=fz*over;
	// }

	// //console.log(fz)
	// //styles.fz=25;
	// d.innerHTML = text;
	// mStyleX(d, styles);

	// let b = getBounds(d);
	// //console.log('bounds', b.width, b.height, 'rect', rect.w, rect.h)

}



//#region old
function fitTextX(text, rect, dParent, styles, classes) {
	let [l, t, d] = prelims(rect, dParent, styles);

	let fz = 20;
	let over = textCorrectionFactorX(text, styles, rect.w, rect.h, fz); let MAX = 20; let cnt = 0;
	let oldFz = 0; let oldOldFz = 0;
	while (over > 0 && fz >= 8) {
		cnt += 1; if (cnt > MAX) { console.log('MAX reached!!!'); break; }
		console.log('over', over, 'fz', fz);
		if (over == 0) break; //perfect font!
		oldOldFz = oldFz;
		oldFz = fz;
		fz = Math.round(fontTransition(fz, over));
		if (oldFz == fz || oldOldFz == fz) break;

		//fz=Math.floor(fz*over);
		//console.log('using over',over);
		let newOver = textCorrectionFactorX(text, styles, rect.w, rect.h, fz);
		let change = over - newOver;
		//console.log('change', change, 'fz change from', oldFz, 'to', fz);
		over = newOver;
		//fz=fz*over;
	}

	//console.log(fz)
	//styles.fz=25;
	d.innerHTML = text;
	mStyleX(d, styles);

	let b = getBounds(d);
	//console.log('bounds', b.width, b.height, 'rect', rect.w, rect.h)

}

function textCorrectionFactorX(text, styles, w, h, fz) {
	styles.fz = fz;
	//styles.w = w;
	//styles.h = h;
	let size = getSizeWithStyles(text, styles);
	console.log(size);
	let dw = w - size.w;
	let dh = h - size.h;

	//if dw>0 was bedeutet das?
	//habe mehr platz, dh schrift=fz zu klein

	//if dh>0 was bedeutet das?
	//habe mehr platz, dh schrift=fz zu klein

	if (dw < 0 || dh < 0) {
		//bedeutet dass fz zu GROSS ist!!!!
		//reduziere fz!
		return fz - 1;
	}

	return Math.max(size.h / h, size.w / w);


	if (size.h > h - 10 || size.w > w - 10) { return Math.max(size.h / h, size.w / w); }
	else if (size.h < h - 10 && size.w < w - 10) { return Math.min(size.h / h, size.w / w); }
	if (Math.abs(size.h - h) > fz || size.w > w) {
		//console.log('h',h,'\nsz',size.h,'\nfactor',h/size.h);
		return size.h / h;
		// } else if (isdef(styles.h) && Math.abs(size.w - w) > fz) {
		// 	return size.w / w;
	} else return 0;
}
//#endregion