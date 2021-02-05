function getPictureItems(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	//#region prelim: default ifs and options, keys & infos
	//console.log('ifs', jsCopy(ifs)); console.log('options', jsCopy(options));

	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	//keys=['eye'];//['toolbox','tiger']; //keys[0] = 'butterfly'; //keys[0]='man in manual wheelchair';	//keys=['sun with face'];
	// keys=['house','socks','hammer'];

	// let showLabels = Settings.labels == true;
	let infos = keys.map(k => (isdef(Settings.language) ? getRandomSetItem(Settings.language, k) : symbolDict[k]));
	//ifs and options: defaults
	let bg = isdef(options.colorKeys) ? 'white' : (i) => options.sameBackground ? computeColor('random') : 'random';
	let fg = (i, info, item) => colorIdealText(item.bg);
	let defIfs = { bg: bg, fg: fg, label: isdef(labels) ? labels : (i, info) => info.best, contrast: .32, fz: 20, padding: 10 };
	let defOptions = { showLabels: Settings.labels == true, shufflePositions: true, sameBackground: true, showRepeat: false, repeat: 1, onclick: onClickPictureHandler, iStart: 0 };
	ifs = deepmergeOverride(defIfs, ifs);
	options = deepmergeOverride(defOptions, options);
	//console.log('keys', keys); console.log('ifs', ifs); 
	//console.log('options', options);
	//#endregion

	//#region phase1: make items: hier jetzt mix and match
	let items = zItems(infos, ifs, options);
	if (options.repeat > 1) items = zRepeatEachItem(items, options.repeat, options.shufflePositions);
	if (isdef(options.colorKeys)) items = zRepeatInColorEachItem(items, options.colorKeys);
	items.map(x => x.label = x.label.toUpperCase());
	//#endregion phase1

	//#region phase2: prepare items for container
	prepareItemsForContainerRegularGrid(items,ifs,options,isdef(options.colorKeys) ? options.colorKeys.length : undefined)
	//#endregion

	return [items,options.rows];
}
function presentItems(items,dParent,rows){
	//#region phase3: prep container for items
	mClass(dParent, 'flexWrap');
	//#endregion

	//#region phase4: add items to container!
	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, x.div));
	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4 };
	let gridSize = layoutGrid(items, dGrid, gridStyles, { rows: rows, isInline: true });
	// console.log('size of grid',gridSize,'table',getBounds(dTable))

	//#endregion
	

	//console.log('*** THE END ***', Pictures[0]);
	return {dGrid:dGrid,sz:gridSize};
}

function showPicturesSpeechTherapyGames(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	Pictures = [];
	//#region prelim: default ifs and options, keys & infos
	//console.log('ifs', jsCopy(ifs)); console.log('options', jsCopy(options));

	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	//keys=['eye'];//['toolbox','tiger']; //keys[0] = 'butterfly'; //keys[0]='man in manual wheelchair';	//keys=['sun with face'];
	//keys=['hundred points']; //house','socks','hammer'];
	//keys=['framed picture'];ifs.border="4px solid red";options.sz=80;options.showLabels=false;

	// let showLabels = Settings.labels == true;
	let infos = keys.map(k => (isdef(Settings.language) ? getRandomSetItem(Settings.language, k) : symbolDict[k]));
	//ifs and options: defaults
	let bg = isdef(options.colorKeys) ? 'white' : (i) => options.sameBackground ? computeColor('random') : 'random';
	let fg = (i, info, item) => colorIdealText(item.bg);
	let defIfs = { bg: bg, fg: fg, label: isdef(labels) ? labels : (i, info) => info.best, contrast: .32, fz: 20, padding: 10 };
	let defOptions = { showLabels: Settings.labels == true, shufflePositions: true, sameBackground: true, showRepeat: false, repeat: 1, onclick: onClickPictureHandler, iStart: 0 };
	ifs = deepmergeOverride(defIfs, ifs);
	options = deepmergeOverride(defOptions, options);
	//console.log('keys', keys); console.log('ifs', ifs); 
	console.log('options', options);
	//#endregion

	//#region phase1: make items: hier jetzt mix and match
	let items = zItems(infos, ifs, options);
	if (options.repeat > 1) items = zRepeatEachItem(items, options.repeat, options.shufflePositions);
	if (isdef(options.colorKeys)) items = zRepeatInColorEachItem(items, options.colorKeys);
	items.map(x => x.label = x.label.toUpperCase());
	Pictures = items;
	//items.map(x=>console.log(x));
	//#endregion phase1

	//#region phase2: prepare items for container
	prepareItemsForContainerRegularGrid(items,ifs,options,isdef(options.colorKeys) ? options.colorKeys.length : undefined)
	//#endregion

	//#region phase3: prep container for items
	mClass(dTable, 'flexWrap');
	//#endregion

	//#region phase4: add items to container!
	let dGrid = mDiv(dTable);
	items.map(x => mAppend(dGrid, x.div));
	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4 };
	let gridSize = layoutGrid(items, dGrid, gridStyles, { rows: options.rows, isInline: true });
	// console.log('size of grid',gridSize,'table',getBounds(dTable))

	//#endregion

	//console.log('*** THE END ***', Pictures[0]);
}





