function randomHybridGrid(n, picLabelStyles, picStyles, isText = false, isOmoji = true) {
	let list = isList(n) ? n : picRandom('emo', null, n);
	let dGrid = mDiv(table);
	let elems = [];
	for (const info of list) {
		let el = coin() ? maPicLabel(info, dGrid, picLabelStyles[0], picLabelStyles[1], picLabelStyles[2], isText, isOmoji)
			: maPicFrame(info, dGrid, picStyles[0], picStyles[1], isText, isOmoji);
		elems.push(el);
	}
	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let size = layoutGrid(elems, dGrid, gridStyles, { rows:20, isInline: true });
	//console.log(size);
}

function gridLabeled(list, picLabelStyles) {
	//cont,pic,text
	let dGrid = mDiv(table);
	let elems = [];
	let isText = true;
	let isOmoji = false;
	for (const k of list) {
		let info = symbolDict[k];
		let el = maPicLabel(info, dGrid, picLabelStyles[0], picLabelStyles[1], picLabelStyles[2], isText, isOmoji)
		elems.push(el);
	}
	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let size = layoutGrid(elems, dGrid, gridStyles, { rows:10, isInline: true });
	//console.log(size);
}

function gridFunc(list, picLabelStyles) {
	//cont,pic,text
	let dGrid = mDiv(table);
	let elems = [];
	let isText = true;
	let isOmoji = false;
	for (const k of list) {
		let info = symbolDict[k];
		let el = maPicLabel(info, dGrid, picLabelStyles[0], picLabelStyles[1], picLabelStyles[2], isText, isOmoji)
		elems.push(el);
	}
	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let size = layoutGrid(elems, dGrid, gridStyles, { rows:10, isInline: true });
	//console.log(size);
}












