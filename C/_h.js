
function getColorDictColor(c) { return isdef(ColorDict[c]) ? ColorDict[c].c : c; }

function showCards52(arr) {
	let items = arr.map(x => Card52.getItem(x));
	splayout(items, dTable, {bg:'transparent'});
	console.log(items)
}
function splayout(items, dParent, containerStyles, ovPercent = 20, orientation = 'h', isFaceUp) {
	//phase 1: schon gemacht!
	//phase 2: items are sized and row,col (das ist aber nur fuer grid layout!)
	//supposedly, items should have div,w,h
	//phase 3: prep container for items!

	if (isEmpty(items)) return { w: 0, h: 0 };
	let [w, h] = [items[0].w, items[0].h];

	if (nundef(containerStyles)) containerStyles = {};
	containerStyles = deepmergeOverride({ display: 'block', position: 'relative', bg: GREEN, rounding: 12, padding: 10 }, containerStyles);
	let d = mDiv(dParent, containerStyles);


	//phase 4: add items to container
	let gap = 10;
	let overlap = w * ovPercent / 100;
	let x = y = gap;
	for (let i = 0; i < items.length; i++) {
		let c = items[i];
		mAppend(d, c.div);
		mStyleX(c.div, { position: 'absolute', left: x, top: y });
		c.row = 0;
		c.col = i;
		c.index = i;
		x += overlap;
	}
	d.style.width = (x - 1.5 * overlap + w) + 'px';
	//console.log(Pictures[0])
	//console.log(Pictures[0].div)
	d.style.height = firstNumber(items[0].div.style.height) + 'px';


}






