function zPic(key, dParent, styles = {}, isText = true, isOmoji = false) {
	let w=styles.w,h=styles.h,padding=styles.padding,hpadding=styles.hpadding,wpadding=styles.wpadding;
	if (isdef(styles.sz)){
		if (nundef(w)) w=styles.sz;
		if (nundef(h)) h=styles.sz;
	}
	let stylesNew = jsCopy(styles);
	if (isdef(w)){
		if (isdef(padding)) {w-=2*padding;}//stylesNew.padding=0;}
		else if (isdef(wpadding)) {w-=2*wpadding;}//stylesNew.wpadding=0;}
		stylesNew.w=w;
	}
	if (isdef(h)){
		if (isdef(padding)) {h-=2*padding;}//stylesNew.padding=0;}
		else if (isdef(hpadding))  {h-=2*hpadding;}//stylesNew.hpadding=0;}
		stylesNew.h=h;
	}
	// console.log('old',styles)
	// console.log('new:',stylesNew)
	return _zPicPaddingAddedToSize(key,dParent,stylesNew,isText,isOmoji);
}




//#region helpers
function _zPicPaddingAddedToSize(infokey, dParent, styles = {}, isText = true, isOmoji = false) {

	let info = isString(infokey) ? picInfo(infokey) : infokey;
	//console.log(infokey)
	//console.log('isText', isText, 'isOmoji', isOmoji);

	// as img
	if (!isText && info.type == 'emo') {

		//ensureSvgDict(); geht NICHT weil ja awaited werden muss!!!!!!!

		let dir = isOmoji ? 'openmoji' : 'twemoji';
		let hex = info.hexcode;
		if (isOmoji && hex.indexOf('-') == 2) hex = '00' + hex;
		let ui = mImg('/assets/svg/' + dir + '/' + hex + '.svg', dParent);
		if (isdef(styles)) mStyleX(ui, styles);
		return ui;
	}

	// as text
	let outerStyles = isdef(styles) ? jsCopy(styles) : {};
	outerStyles.display = 'inline-block';
	let family = info.type == 'emo' && isString(isOmoji) ? isOmoji : isOmoji == true ? 'emoOpen' : info.family;

	// let i = (family == info.family) ? 0 : EMOFONTLIST.indexOf(family)+1;
	// console.log('i is', i,'\n',info.w,'\n',info.family,'\n',family,'\n',EMOFONTLIST)

	// let iwInfo = (family == info.family) ? 0 : info.w.indexOf(family);
	let i = (family == info.family) ? 0 : EMOFONTLIST.indexOf(family) + 1;
	if (i < 0) {
		i = 1; console.log('iiiiiii', i, family, info.family);
	}
	let wInfo = info.w[i];
	// let ihInfo = (family == info.family) ? 0 : info.h.indexOf(family);
	let hInfo = info.h[i];
	if (info.type == 'icon' && hInfo == 133) hInfo = 110;

	// console.log('family', family, 'orig', info.family)
	let innerStyles = { family: family };
	let [padw, padh] = isdef(styles.padding) ? [styles.padding, styles.padding] : [0, 0];

	let dOuter = isdef(dParent) ? mDiv(dParent) : mDiv();
	let d = mDiv(dOuter);
	d.innerHTML = info.text;

	let wdes, hdes, fzdes, wreal, hreal, fzreal, f;

	//console.log(info);
	if (isdef(styles.w) && isdef(styles.h) && isdef(styles.fz)) {
		[wdes, hdes, fzdes] = [styles.w, styles.h, styles.fz];
		let fw = wdes / wInfo;
		let fh = hdes / hInfo;
		let ffz = fzdes / info.fz;
		f = Math.min(fw, fh, ffz);
	} else if (isdef(styles.w) && isdef(styles.h)) {
		[wdes, hdes] = [styles.w, styles.h];
		let fw = wdes / wInfo;
		let fh = hdes / hInfo;
		f = Math.min(fw, fh);
	} else if (isdef(styles.w) && isdef(styles.fz)) {
		[wdes, fzdes] = [styles.w, styles.fz];
		let fw = wdes / wInfo;
		let ffz = fzdes / info.fz;
		f = Math.min(fw, ffz);
	} else if (isdef(styles.h) && isdef(styles.fz)) {
		[hdes, fzdes] = [styles.h, styles.fz];
		let fh = hdes / hInfo;
		let ffz = fzdes / info.fz;
		f = Math.min(fh, ffz);
	} else if (isdef(styles.h)) {
		hdes = styles.h;
		f = hdes / hInfo;
	} else if (isdef(styles.w)) {
		wdes = styles.w;
		f = wdes / wInfo;
		// } else if (isdef(styles.fz)) {
		// 	fzdes = styles.fz;
		// 	f = fzdes / info.fz;
	} else {
		mStyleX(d, innerStyles);
		mStyleX(dOuter, outerStyles);
		return dOuter;
	}
	fzreal = f * info.fz;
	wreal = Math.round(f * wInfo);
	hreal = Math.round(f * hInfo);
	wdes = Math.round(wdes);
	hdes = Math.round(hdes);
	padw += isdef(styles.w) ? (wdes - wreal) / 2 : 0;
	padh += isdef(styles.h) ? (hdes - hreal) / 2 : 0;

	//console.log('padh',padh)
	//console.log('====>>>>', family, '\nw.info', wInfo, '\nh.info', hInfo, '\nfactor', f, '\nw', wreal, '\nh', hreal);

	if (!(padw >= 0 && padh >= 0)) {
		console.log(info)
		console.log('\nstyles.w', styles.w, '\nstyles.h', styles.h, '\nstyles.fz', styles.fz, '\nstyles.padding', styles.padding, '\nwInfo', wInfo, '\nhInfo', hInfo, '\nfzreal', fzreal, '\nwreal', wreal, '\nhreal', hreal, '\npadw', padw, '\npadh', padh);
	}
	//console.assert(padw >= 0 && padh >= 0, 'BERECHNUNG FALSCH!!!!', padw, padh, info, '\ninfokey', infokey);

	innerStyles.fz = fzreal;
	innerStyles.weight = 900;
	innerStyles.w = wreal;
	innerStyles.h = hreal;
	mStyleX(d, innerStyles);

	outerStyles.padding = '' + padh + 'px ' + padw + 'px';
	outerStyles.w = wreal; //das ist groesse von inner!
	outerStyles.h = hreal;
	//console.log(outerStyles)
	mStyleX(dOuter, outerStyles);

	return {
		info: info, key: info.key, div: dOuter, outerDims: { w: wdes, h: hdes, hpadding: padh, wpadding: padw },
		innerDims: { w: wreal, h: hreal, fz: fzreal }
	};

}


//#endregion





















