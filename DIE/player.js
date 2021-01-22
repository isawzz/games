
function splayout(items, dParent, containerStyles, ovPercent = 20, splay = 'right', faceUp) {

	if (isEmpty(items)) return { w: 0, h: 0 };
	let [w, h] = [items[0].w, items[0].h];
	let isHorizontal = splay == 'right' || splay == 'left';

	if (nundef(containerStyles)) containerStyles = {};
	containerStyles = deepmergeOverride({ display: 'block', position: 'relative', bg: GREEN, rounding: 12, padding: 10 }, containerStyles);
	let d = mDiv(dParent, containerStyles);

	//phase 4: add items to container
	let gap = 10;
	let overlap = (isHorizontal ? w : h) * ovPercent / 100;
	let x = y = gap;
	[x, y] = window['splay'+capitalize(splay)](items, d, x, y, overlap);
	// if (splay == 'right') [x, y] = splayRight(items, d, x, y, overlap);
	// else if (splay == 'left') [x, y] = splayLeft(items, d, x, y, overlap);
	// else if (splay == 'down') [x, y] = splayDown(items, d, x, y, overlap);
	// else if (splay == 'up') [x, y] = splayUp(items, d, x, y, overlap);
	let sz={w:(isHorizontal ? (x - 1.5 * overlap + w) : w),h:(isHorizontal ? (y - 1.5 * overlap + h) : h)};
	d.style.width = '' + sz.w + 'px';
	d.style.height = '' + sz.h + 'px';
	return sz;

}


//player has 

class Player {
	constructor(id, color) {
		this.id = id;
		this.color = getColorDictColor(color);
	}
}

