const InnoDict = {
	red: 'red1', blue: 'blue1', green: 'green1', yellow: 'yellow1', purple: 'purple',
	tower: { k: 'white-tower', bg: 'dimgray' }, clock: { k: 'watch', bg: 'navy' },
	crown: { k: 'crown', bg: 'black' }, tree: { k: 'tree', bg: GREEN },
	bulb: { k: 'lightbulb', bg: 'purple' }, factory: { k: 'factory', bg: 'red' }
};

function zInno(key, dParent) {
	let info = cinno[key]; info.key = key;
	info.c = colorDarker(ColorDict[InnoDict[info.color]].c, .6);

	//make prefabs
	let item = { key: key, info: info };
	//each symbol make pic for 
	let d = item.div = mDiv(null, { position: 'relative' });

	let title = item.title = zText(key.toUpperCase(), d, { weight: 'bold', margin:5 });

	let dogmas = [];
	let dMain = item.dMain=mDiv(d,{align:'left'});
	for (const dog of info.dogmas) { dogmas.push(zText(dog, dMain, { fz: 20 })); }
	item.dogmas = dogmas;

	let resources = [];
	console.log(info.resources)
	//info.resources[2]='tree';
	for (const sym of info.resources) {
		let t =
			sym == 'None' ? zText(info.age.toString(), d, {margin:5, w: 40, fz: 20, align: 'center', fg: 'black', bg: 'white', rounding: '50%', display: 'inline-block' }, 40, true)
				: sym == 'echo' ? zText(info.echo[0], d, { fz: 20, fg: 'white', bg: 'black' })
					: zPic(InnoDict[sym].k, d, { margin:5, padding: 4, w: 40, h: 40, bg: InnoDict[sym].bg, rounding: '10%' });
		resources.push(t);
	}
	item.resources = resources;

	console.log(item);
	mAppend(dParent, d)
	//return item;

	//compose items w/ abs positioning
	posTR(title.div);
	posTL(resources[0].div);
	posBL(resources[1].div);
	posBC(resources[2].div);
	posBR(resources[3].div);

	mStyleX(d, { w: 420, h: 200, padding: 50, 'box-sizing': 'border-box', bg: 'firebrick' });

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
	// let [bg,fg] = getExtendedColors(outerStyles.bg,outerStyles.fg);
	// outerStyles.bg = bg;
	// outerStyles.bg = fg;
	//console.log(outerStyles)
	mStyleX(dOuter, outerStyles);

	return {
		info: info, key: info.key, div: dOuter, outerDims: { w: wdes, h: hdes, hpadding: padh, wpadding: padw },
		innerDims: { w: wreal, h: hreal, fz: fzreal }, bg: dOuter.style.backgroundColor, fg: dOuter.style.color
	};

}
function parseDims(w, h, padding) {
	let allpads = allIntegers(padding);
	let len = allpads.length;
	let patop = allpads[0];
	let paright = len == 1 ? patop : allpads[1];
	let pabot = len <= 2 ? patop : allpads[2];
	let paleft = len == 1 ? patop : len < 4 ? paright : allpads[3];

	return { w: w, h: h, patop: patop, paright: paright, pabot: pabot, paleft: paleft };
}


//#endregion





















