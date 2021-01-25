
function getColorDictColor(c) { return isdef(ColorDict[c]) ? ColorDict[c].c : c; }

function showCards52(arr, splay = 'right') {
	if (isEmpty(arr)) return {w:0,h:0};
	if (isNumber(arr[0])) arr=arr.map(x => Card52.getItem(x));
	szHand = splayout(arr, dTable, { bg: 'transparent' }, 20, splay);
	//console.log(arr)
	return szHand;
	//console.log(items);
}
function splayout(items, dParent, containerStyles, ovPercent = 20, splay = 'right') {
	function splayRight(items, d, x, y, overlap) {
		//console.log('right: topmost should be', items[items.length - 1])
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
		//console.log('left: topmost should be', items[items.length - 1])

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
		//console.log('down: topmost should be', items[items.length - 1])
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
		//console.log('left: topmost should be', items[items.length - 1])
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
	
	//console.log('hhhhhhhhhhhhhhhhh')
	if (isEmpty(items)) return { w: 0, h: 0 };
	let [w, h] = [items[0].w, items[0].h];
	//console.log('w',w,'h',h)
	let isHorizontal = splay == 'right' || splay == 'left';

	if (nundef(containerStyles)) containerStyles = {};
	let defStyles = { display: 'block', position: 'relative'};//, bg: 'transparent', rounding: 12, padding: 10 };
	containerStyles = deepmergeOverride(defStyles, containerStyles);
	let d = mDiv(dParent, containerStyles);

	//phase 4: add items to container
	let gap = isdef(containerStyles.padding)?containerStyles.padding:0;//10;
	let overlap = ovPercent == 0? .5 : (isHorizontal ? w : h) * ovPercent / 100;
	let x = y = gap;
	[x, y] = (eval('splay' + capitalize(splay)))(items, d, x, y, overlap);
	let sz = { w: (isHorizontal ? (x - overlap + w) : w), h: (isHorizontal ? (y - overlap + h) : h) };
	d.style.width = '' + sz.w + 'px';
	d.style.height = '' + sz.h + 'px';
	return sz;

}






