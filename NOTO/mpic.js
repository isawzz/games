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








