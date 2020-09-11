// code that should be or is already deprecated: backward compatibility only & to be replaced!
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




















