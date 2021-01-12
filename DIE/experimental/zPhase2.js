// determine size and position of items
// set a min(fit content) and a max(limited by container & layout)
function findLongestLabel(items){
	let longestLabel = '';
	let maxlen = 0;
	let iLongest = -1;
	for (let i = 0; i < items.length; i++) {
		let label = items[i].label;

		if (isdef(label)) {
			let tlen = label.length;
			if (tlen > maxlen) { maxlen = tlen; longestLabel = label; iLongest = i; }
		}
	}

	return {label:longestLabel,len:maxlen,i:iLongest};

}

function calcRowsColsSize(n, lines, cols, dParent, wmax, hmax) {

	//berechne outer dims
	let ww, wh, hpercent, wpercent;
	if (isdef(dParent)) {
		let b = getBounds(dParent);
		ww = b.width;
		wh = b.height;
		hpercent = .9;
		wpercent = .9;
	} else if (isdef(wmax) && isdef(hmax)) {
		ww = wmax;
		wh = hmax;
		hpercent = .6;
		wpercent = .6;
	} else {
		ww = window.innerWidth;
		wh = window.innerHeight;
		hpercent = .56;
		wpercent = .64;
	}

	//console.log(ww,wh)
	let sz;//, picsPerLine;
	//if (lines <= 1) lines = undefined;
	let dims = calcRowsColsX(n, lines);
	let hpic = wh * hpercent / dims.rows;
	let wpic = ww * wpercent / dims.cols;
	sz = Math.min(hpic, wpic);
	//picsPerLine = dims.cols;
	sz = Math.max(50, Math.min(sz, 200));
	return [sz, dims.rows, dims.cols]; //pictureSize, picsPerLine];
}















