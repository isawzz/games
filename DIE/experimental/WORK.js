function visualizeNumber(n, color) {

	//moecht ein kleines grid mit inside n dots in random colors

	//#region prelim: keys,labels,ifs,options
	let keys=new Array(n).fill('plain-circle');
	let options = {repeat:n, showLabels:false};
	let infos = keys.map(x => symbolDict[x]);
	let ifs = {fg:color}

	//#endregion

	//#region phase1: make items: hier jetzt mix and match
	let items = zItems(infos, ifs, options);
	//items.map(x=>console.log(x));
	//#endregion phase1

	//#region phase2: prepare items for container
	// let [options.sz,options.rows,options.cols] = calcRowsColsSize(n,null,null,null,200,200);//(n, lines, cols, dParent, wmax, hmax)
	// console.log(options)
	let [sz, rows, cols] = calcRowsColsSize(items.length);
	sz=25;
	if (nundef(options.sz)) options.sz = sz;
	if (nundef(options.rows)) options.rows = rows;
	if (nundef(options.cols)) options.cols = cols;
	items.map(x => x.sz = options.sz);
	prep1(items, ifs, options);

	//#endregion

	//#region phase3: prep container for items
	//#endregion

	//#region phase4: add items to container!
	let dGrid = mDiv(dTable);
	items.map(x => mAppend(dGrid, x.div));
	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg:'white', rounding:10 };
	let gridSize = layoutGrid(items, dGrid, gridStyles, { rows: options.rows, isInline: true });
	//console.log('size of grid', gridSize, 'table', getBounds(dTable))
	//#endregion

	//console.log('*** THE END ***');
	return dGrid;
}
function animateVerschmelzung(d1,d2){

}



function maShowCards(keys, labels, dParent, onClickPictureHandler, { showRepeat, containerForLayoutSizing, lang, border, picSize, bgs, colorKeys, contrast, repeat = 1, sameBackground, shufflePositions = true } = {}, { sCont, sPic, sText } = {}) {
	Pictures = [];

	//zInno('Steam Engine',dParent); return;

	keys = zInnoRandom(10); // ['Gunpowder']; //zInnoRandom(10); 
	keys.map(x => zInno(x, dParent)); //console.log(keys); 	

	let cards = [];
	for (const k of keys) {
		let card = zInno(k, dParent);
		cards.push(card);
		zMeasure(card);
	}

	//test09_zViewer(); return;;
	//test10_zViewerClockCrownFactory(); return;
	//test08_towerAndOtherSymbols(dParent); return;
	//test07_showDeck(dParent);
	//test06_showCards(dParent); 
	//test05_ElectricitySuburbia(dParent);
	//test04_Electricity(dParent); return;
	//test03_lighbulb(dParent); return;
	//test00_oldMaPic(dParent); 
	//test02_zPic(dParent);test01_oldMaPicAusgleichVonPadding(dParent); return;
	// let c=card52();	console.log(c);	
	// showSingle52(dParent);


	//showAllInnoCards(dParent);

	return;

	mLinebreak(dParent);

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






