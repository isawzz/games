function test09_zViewer(){
	ensureSymByType();
	let keys = symKeysByType.icon;
	zViewer(keys);
}
function test08_towerAndOtherSymbols(dParent) {
	let sdict = {
		tower: { k: 'white-tower', bg: 'dimgray' }, clock: { k: 'watch', bg: 'navy' }, crown: { k: 'crown', bg: 'black' },
		tree: { k: 'tree', bg: GREEN },
		bulb: { k: 'lightbulb', bg: 'purple' }, factory: { k: 'factory', bg: 'red' }
	};

	for (const sym of ['tower', 'clock', 'crown', 'tree', 'bulb', 'factory']) {
		let key = sdict[sym].k;
		d1 = zPic(key, dParent, { sz: 40, bg: sdict[sym].bg, rounding: '10%' });
		console.log(d1.outerDims, d1.innerDims, d1.info)

	}
}

function test07_showDeck(dParent) {
	let keys = getRandomCards(5, { type: 'inno', color: 'purple' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'green' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'blue' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'yellow' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'purple' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)


}
function test06_showCards(dParent) {
	let keys = getRandomCards(5, { type: 'inno', color: 'purple' }); console.log(keys);
	showInnoCards(keys, dParent);

}
function test05_ElectricitySuburbia(dParent) {
	let keys1 = ['Electricity', 'Suburbia']
	for (const k of keys1) {
		let c = cardInno(k); console.log(c); mAppend(dParent, c.div);
		c = cardInnoSZ(k); console.log(c); mAppend(dParent, c.div);
		c = cardInnoz(k); console.log(c); mAppend(dParent, c.div);
	}

}
function test04_Electricity(dParent) {
	let c = cardInnoz('Electricity'); console.log(c); mAppend(dParent, c.div);
	//let res = zPic('lightbulb',dParent,{sz:40,bg:'green',rounding:'50%'}); 
	//console.log(res.outerDims,res.innerDims)
}

function test03_lighbulb(dParent) {
	let res = zPic('lightbulb', dParent, { sz: 40, bg: 'green', rounding: '50%' });
	console.log(res.outerDims, res.innerDims)
}
function test02_zPic(dParent) {
	let sz = 200; gap = 50;
	let res = zPic('lightbulb', dParent, { bg: 'green', padding: gap, rounding: '50%', w: sz, h: sz });
	console.log(res.outerDims, res.innerDims, 'sz', sz)

	gap = 5;
	res = zPic('lightbulb', dParent, { bg: 'green', padding: gap, rounding: '50%', w: sz, h: sz });

	console.log(res.outerDims, res.innerDims, 'sz', sz)
	console.log(res);

}
function test01_oldMaPicAusgleichVonPadding(dParent) {
	let sz = 200; gap = 50;
	let res = _zPicPaddingAddedToSize('lightbulb', dParent, { bg: 'green', padding: gap, rounding: '50%', w: sz, h: sz });
	console.log(res.outerDims, res.innerDims, 'sz', sz)

	gap = 5;
	res = _zPicPaddingAddedToSize('lightbulb', dParent, { bg: 'green', padding: gap, rounding: '50%', w: sz, h: sz });

	console.log(res.outerDims, res.innerDims, 'sz', sz)
	console.log(res);

}
function test00_oldMaPic(dParent) {
	let sz = 100; gap = 50;
	let res = _zPicPaddingAddedToSize('lightbulb', dParent, { bg: 'green', padding: gap, rounding: '50%', w: sz, h: sz });
	console.log(res.outerDims, res.innerDims, 'sz', sz)

	sz = 190; gap = 5;
	res = _zPicPaddingAddedToSize('lightbulb', dParent, { bg: 'green', padding: gap, rounding: '50%', w: sz, h: sz });

	console.log(res.outerDims, res.innerDims, 'sz', sz)
	console.log(res);

}