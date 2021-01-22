
function getColorDictColor(c) { return isdef(ColorDict[c]) ? ColorDict[c].c : c; }

function showCards52(arr, splay = 'right') {
	let items = arr.map(x => Card52.getItem(x));
	szHand=splayout(items, dTable, { bg: 'transparent' }, 20, splay);
	console.log(items);
}
function splayRight(items, d, x, y, overlap) {
	console.log('right: topmost should be', items[items.length - 1])
	let zIndex = 0;
	for (let i = 0; i < items.length; i++) {
		let c = items[i];
		mAppend(d, c.div);
		mStyleX(c.div, { position: 'absolute', left: x, top: y });
		c.row = 0;
		c.col = i;
		c.index = i;
		c.div.style.zIndex = zIndex; zIndex += 1;
		x += overlap;
	}
	return [x, y];
}
function splayLeft(items, d, x, y, overlap) {
	console.log('left: topmost should be', items[items.length - 1])
	let zIndex = 0;//items.length;
	x += (items.length - 2) * overlap;
	let xLast = x;
	// for (let i = items.length-1; i >= 0; i--) {
	for (let i = 0; i < items.length; i++) {
		let c = items[i];
		mAppend(d, c.div);
		mStyleX(c.div, { position: 'absolute', left: x, top: y });
		c.div.style.zIndex = zIndex; zIndex += 1;
		c.row = 0;
		c.col = i;
		c.index = i;
		x -= overlap;
	}
	return [xLast, y];
}
function splayDown(items, d, x, y, overlap) {
	console.log('down: topmost should be', items[items.length - 1])
	let zIndex = 0;
	for (let i = 0; i < items.length; i++) {
		let c = items[i];
		mAppend(d, c.div);
		mStyleX(c.div, { position: 'absolute', left: x, top: y });
		c.row = i;
		c.col = 0;
		c.index = i;
		c.div.style.zIndex = zIndex; zIndex += 1;
		y += overlap;
	}
	return [x, y];
}
function splayUp(items, d, x, y, overlap) {
	console.log('left: topmost should be', items[items.length - 1])
	let zIndex = 0;//items.length;
	y += (items.length - 1) * overlap;
	let yLast = y;
	// for (let i = items.length-1; i >= 0; i--) {
	for (let i = 0; i < items.length; i++) {
		let c = items[i];
		mAppend(d, c.div);
		mStyleX(c.div, { position: 'absolute', left: x, top: y });
		c.div.style.zIndex = zIndex; zIndex += 1;
		c.row = i;
		c.col = 0;
		c.index = i;
		y -= overlap;
	}
	return [x, yLast];
}






