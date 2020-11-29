function ensureColors() {
	let colorlist = lookupSet(Settings, ['games', 'gTouchColors', 'colors'], SIMPLE_COLORS);
	//let shadeColor = lookupSet(Settings, ['games', 'gTouchColors', 'shadeColor'], 'red');
	let contrast = lookupSet(Settings, ['games', 'gTouchColors', 'contrast'], .35);
	let shade = anyColorToStandardString(shadeColor, contrast);
	console.log('===>shadeColor',shadeColor,'contrast',contrast,'shade',shade)
	return [colorlist, shade];
}
function maPicLabelButtonFitText(info, label, { w, h, shade, bgPic, contrast }, handler, dParent, styles, classes = 'picButton', isText, isOmoji, focusElement) {
	// if (nundef(handler)) handler = (ev) => {
	// 	let id = evToClosestId(ev);
	// 	let info = symbolDict[id.substring(1)];
	// 	if (isLabelVisible(id)) maHideLabel(id, info); else maShowLabel(id, info);
	// 	if (isdef(focusElement)) focusElement.focus(); else if (isdef(mBy('dummy'))) mBy('dummy').focus();
	// }
	let picLabelStyles = getHarmoniousStylesPlusPlus(styles, {}, {}, w, h, 65, 0, 'arial', bgPic, 'transparent', null, null, true);

	//console.log(label)
	let x = maPicLabelFitX(info, label.toUpperCase(), { wmax: w, shade: shade, contrast: contrast }, dParent, picLabelStyles[0], picLabelStyles[1], picLabelStyles[2], isText, isOmoji);
	x.id = 'd' + info.key;
	if (isdef(handler)) x.onclick = handler;
	x.style.cursor = 'pointer';
	x.lastChild.style.cursor = 'pointer';
	x.style.userSelect = 'none';
	mClass(x, classes);
	return x;
}
function maPicLabelFitX(info, label, { wmax, hmax, shade, contrast = '#00000030' }, dParent, containerStyles, picStyles, textStyles, isText = true, isOmoji = false) {
	let d = mDiv(dParent);
	//console.log('picStyles',picStyles);


	if (isdef(shade)) {

		//console.log('===>shade',shade,'contrast',contrast);
		//console.log(picStyles);
		let sShade = '0 0 0 ' + shade; //green';
		picStyles['text-shadow'] = sShade;// +', '+sShade+', '+sShade;
		picStyles.fg =  contrast; //'#00000080' '#00000030' 
	}

	let dPic = maPic(info, d, picStyles, isText, isOmoji);
	// mText(info.annotation, d, textStyles, ['truncate']);
	let maxchars = 15; let maxlines = 1;
	//console.log(containerStyles, picStyles, textStyles);

	//if (isdef(hmax))
	//console.log('maPicLabelFitX_', 'wmax', wmax, 'hmax', hmax)
	let wAvail, hAvail;
	hAvail = containerStyles.h - (containerStyles.patop + picStyles.h);// + containerStyles.pabottom);
	wAvail = containerStyles.w;
	//console.log('=>', 'wAvail', wAvail, 'hAvail', hAvail);
	if (isdef(hmax)) {
		hAvail = containerStyles.h - (containerStyles.patop + picStyles.h);// + containerStyles.pabottom);
		if (hmax != 'auto') {
			hAvail = Math.min(hAvail, hmax);
		}
	}
	if (isdef(wmax)) {
		wAvail = containerStyles.w;
		if (wmax != 'auto') {
			wAvail = Math.min(wAvail, wmax);
		}
	}
	let fz = textStyles.fz;
	//measure text height and width with this font!
	//console.log('_ avail:', wAvail, hAvail)
	let styles1 = textStyles;
	let size = getSizeWithStylesX(label, styles1, isdef(wmax) ? wAvail : undefined, isdef(hmax) ? hAvail : undefined);
	//console.log('__', 'size', size);
	let size1 = getSizeWithStylesX(label, styles1);//, isdef(wmax) ? wAvail : undefined, isdef(hmax) ? hAvail : undefined);
	//console.log('__', 'size1', size1);

	let f1 = wAvail / size1.w;
	let isTextOverflow = f1 < 1;
	if (f1 < 1) {
		textStyles.fz *= f1;
		textStyles.fz = Math.floor(textStyles.fz);
		//console.log('text overflow! textStyles', textStyles);
	}

	let [wBound, hBound] = [isdef(wmax) ? size.w : undefined, isdef(hmax) ? size.h : undefined];

	let isOverflow = isdef(wBound) && size.w > wAvail || isdef(hBound) && size.h > hAvail;
	//console.log('___ isOverflow',isOverflow);


	let dText = mTextFit(label, { wmax: wBound, hmax: hBound }, d, textStyles, isTextOverflow ? ['truncate'] : null);
	// d.style.textAlign = 'center';
	// dText.style.textAlign = 'center';
	// containerStyles.align = 'center';

	mStyleX(d, containerStyles);

	dText.style.margin = 'auto';
	// console.log('____', d.id, d.style.textAlign, d, containerStyles)

	////console.log(dParent,'\nd',d,'\ndPic',dPic,'\ndText',dText);

	return d;
}
function showPictures1(onClickPictureHandler, { colors, overlayShade } = {}, keys, labels) {
	Pictures = [];

	if (nundef(keys)) keys = choose(currentKeys, NumPics);
	//keys=['sun with face'];
	Pictures = maShowPictures(keys,labels,dTable,onClickPictureHandler,{lang:currentLanguage, colors:colors, overlayShade:overlayShade });return;

	let infos = keys.map(x => getRandomSetItem(currentLanguage, x));
	if (nundef(labels)) {
		labels = [];
		for (const info of infos) {
			labels.push(info.best);
		}
	}

	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');
	let bgPic = isdef(colors) ? 'white' : 'random';

	let lines = isdef(colors) ? colors.length : 1;

	let ww = window.innerWidth;
	let wh = window.innerHeight;
	let hpercent = 0.60; let wpercent = .6;
	let sz, picsPerLine;
	if (lines > 1) {
		let hpic = wh * hpercent / lines;
		let wpic = ww * wpercent / NumPics;
		sz = Math.min(hpic, wpic);
		picsPerLine = keys.length;
	} else {
		let dims = calcRowsColsX(NumPics);
		let hpic = wh * hpercent / dims.rows;
		let wpic = ww * wpercent / dims.cols;
		sz = Math.min(hpic, wpic);
		picsPerLine = dims.cols;
	}

	pictureSize = Math.max(50, Math.min(sz, 200));
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };

	for (let line = 0; line < lines; line++) {
		let shade = isdef(colors) ? colors[line] : undefined;
		for (let i = 0; i < keys.length; i++) {
			let info = infos[i];
			let label = labels[i];
			let ipic = (line * keys.length + i);
			if (ipic % picsPerLine == 0 && ipic > 0) mLinebreak(dTable);
			let id = 'pic' + ipic; // (line * keys.length + i);
			let d1 = maPicLabelButtonFitText(info, label,
				{
					w: pictureSize, h: pictureSize, bgPic: bgPic, shade: shade,
					overlayColor: overlayShade
				}, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;
			Pictures.push({ shade: shade, key: info.key, info: info, div: d1, id: id, index: i, label: label, isLabelVisible: true });
		}
	}

	let totalPics = Pictures.length;

	if (Settings.program.labels) {
		if (NumLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - NumLabels);
		for (const p of remlabelPic) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }
	} else {
		for (const p of Pictures) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }

	}

}
function showPicturesX(onClickPictureHandler, { border, colors, overlayShade, repeat = 1, shufflePositions = true } = {}, keys, labels) {
	Pictures = [];

	if (nundef(keys)) keys = choose(currentKeys, NumPics / repeat);
	console.log(repeat, NumPics);

	if (isdef(repeat)) {
		let keys1 = jsCopy(keys);
		for (let i = 0; i < repeat - 1; i++) { keys = keys.concat(keys1); }
		if (shufflePositions) shuffle(keys)
	}

	console.log(keys);

	let infos = keys.map(x => getRandomSetItem(currentLanguage, x));
	if (nundef(labels)) {
		labels = [];
		for (const info of infos) {
			labels.push(info.best);
		}
	}

	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');

	let bgPic = isdef(colors) ? 'white' : 'random';
	let bgs = {};
	for (const l of labels) {
		if (isdef(bgs[l])) continue;
		bgs[l] = computeColor(bgPic);
	}


	let lines = isdef(colors) ? colors.length : 1;
	let [pictureSize, picsPerLine] = calcDimsAndSize(NumPics, lines);
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };
	if (isdef(border)) stylesForLabelButton.border = border;

	for (let line = 0; line < lines; line++) {
		let shade = isdef(colors) ? colors[line] : undefined;
		for (let i = 0; i < keys.length; i++) {
			let info = infos[i];
			let label = labels[i];
			let ipic = (line * keys.length + i);
			if (ipic % picsPerLine == 0 && ipic > 0) mLinebreak(dTable);
			let id = 'pic' + ipic; // (line * keys.length + i);
			let d1 = maPicLabelButtonFitText(info, label,
				{
					w: pictureSize, h: pictureSize, bgPic: bgs[label], shade: shade,
					overlayColor: overlayShade
				}, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;
			Pictures.push({ shade: shade, key: info.key, info: info, div: d1, id: id, index: i, label: label, isLabelVisible: true, isSelected: false });
		}
	}

	let totalPics = Pictures.length;

	if (Settings.program.labels) {
		if (NumLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - NumLabels);
		for (const p of remlabelPic) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }
	} else {
		for (const p of Pictures) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }

	}

}
function showPicturesXt(onClickPictureHandler, { border, colors, overlayShade, repeat = 1, shufflePositions = true } = {}, keys, labels){
	let pics = Pictures = maShowPictures(keys, labels, dTable, onClickPictureHandler, { lang:currentLanguage, border:border, colors:colors, overlayShade:overlayShade, repeat:repeat, shufflePositions:shufflePositions } = {});
	
	let totalPics = pics.length;
	if (Settings.program.labels) {
		if (NumLabels == totalPics) return;
		let remlabelPic = choose(pics, totalPics - NumLabels);
		for (const p of remlabelPic) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }
	} else {
		for (const p of pics) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }

	}
}
function showPictures(onClickPictureHandler, { colors, overlayShade } = {}, keys, labels) {
	Pictures = [];

	if (nundef(keys)) keys = choose(currentKeys, NumPics);
	//Pictures = maPicShowPictures(keys,labels,dTable,onClickPictureHandler,{ colors, overlayShade });

	let infos = keys.map(x => getRandomSetItem(currentLanguage, x));
	if (nundef(labels)) {
		labels = [];
		for (const info of infos) {
			labels.push(info.best);
		}
	}

	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');
	let bgPic = isdef(colors) ? 'white' : 'random';

	let lines = isdef(colors) ? colors.length : 1;

	let ww = window.innerWidth;
	let wh = window.innerHeight;
	let hpercent = 0.60; let wpercent = .6;
	let sz, picsPerLine;
	if (lines > 1) {
		let hpic = wh * hpercent / lines;
		let wpic = ww * wpercent / NumPics;
		sz = Math.min(hpic, wpic);
		picsPerLine = keys.length;
	} else {
		let dims = calcRowsColsX(NumPics);
		let hpic = wh * hpercent / dims.rows;
		let wpic = ww * wpercent / dims.cols;
		sz = Math.min(hpic, wpic);
		picsPerLine = dims.cols;
	}

	pictureSize = Math.max(50, Math.min(sz, 200));
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };

	for (let line = 0; line < lines; line++) {
		let shade = isdef(colors) ? colors[line] : undefined;
		for (let i = 0; i < keys.length; i++) {
			let info = infos[i];
			let label = labels[i];
			let ipic = (line * keys.length + i);
			if (ipic % picsPerLine == 0 && ipic > 0) mLinebreak(dTable);
			let id = 'pic' + ipic; // (line * keys.length + i);
			let d1 = maPicLabelButtonFitText(info, label,
				{
					w: pictureSize, h: pictureSize, bgPic: bgPic, shade: shade,
					overlayColor: overlayShade
				}, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;
			Pictures.push({ shade: shade, key: info.key, info: info, div: d1, id: id, index: i, label: label, isLabelVisible: true });
		}
	}

	let totalPics = Pictures.length;

	if (Settings.program.labels) {
		if (NumLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - NumLabels);
		for (const p of remlabelPic) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }
	} else {
		for (const p of Pictures) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }

	}

}
function maShowPictures(keys, labels, dParent, onClickPictureHandler, { container, lang, border, bgs, colors, overlayShade, repeat = 1, shufflePositions = true } = {}) {
	let pics = [];

	console.log('keys', keys, '\n', 'labels', labels, '\n', 'bgs', bgs)

	let numPics = keys.length * repeat;

	//make a label for each key
	let items = [];
	for(let i=0;i<keys;i++){
		let k=keys[i];
		let info = isdef(lang)? getRnadomSetItem(lang,k):symbolDict[k];
		let bg = isList(bgs)?gsb[i]:isdef(colors)?'white':'random';
		let label = isList(labels)?labels[i]:isdef(lang)?info.best:k;
		items.push({key:k,info:info,label:label,bg:bg});
	}

	if (isdef(repeat)) {
		let items1 = jsCopy(items);
		for (let i = 0; i < repeat - 1; i++) { items = items.concat(items1); }
	}

	let isText = true;
	let isOmoji = false;
	if (isdef(lang)){
		let textStyle = getParamsForMaPicStyle('twitterText');
		isText = textStyle.isText;
		isOmoji = textStyle.isOmoji;
	}

	// let infos = keys.map(x => symbolDict[x]);

	if (isdef(repeat)) {
		let keys1 = jsCopy(keys);
		for (let i = 0; i < repeat - 1; i++) { keys = keys.concat(keys1); }
	}

	let isText = true;
	let isOmoji = false;
	if (isdef(lang)) {
		infos = keys.map(x => getRandomSetItem(lang, x));
		if (nundef(labels)) {
			labels = [];
			for (const info of infos) {
				labels.push(info.best);
			}
		}
		let textStyle = getParamsForMaPicStyle('twitterText');
		isText = textStyle.isText;
		isOmoji = textStyle.isOmoji;
	}

	console.log('bgs', bgs, typeof bgs)
	if (nundef(bgs)) {
		let bgPic = isdef(colors) ? 'white' : 'random';
		bgs = {};
		for (const l of labels) {
			if (isdef(bgs[l])) continue;
			bgs[l] = computeColor(bgPic);
		}
	} else if (isList(bgs)) {
		let bglist = bgs;
		bgs = {};
		for (let i = 0; i < bglist.length; i++) {
			bgs[labels[i]] = bglist[i];
		}

	}



	console.log(keys);

	let isText = true;
	let isOmoji = false;
	if (isdef(lang)) {
		infos = keys.map(x => getRandomSetItem(lang, x));
		if (nundef(labels)) {
			labels = [];
			for (const info of infos) {
				labels.push(info.best);
			}
		}
		let textStyle = getParamsForMaPicStyle('twitterText');
		isText = textStyle.isText;
		isOmoji = textStyle.isOmoji;
	}

	//sollte es so machen dass list of numList {info:info,key:key,label:label,bgs:bgs} habe
	//dann erst shuffle!
	if (shufflePositions) shuffle(keys);

	let lines = isdef(colors) ? colors.length : 1;
	let [pictureSize, picsPerLine] = calcDimsAndSize(numPics, lines, container);
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };
	if (isdef(border)) stylesForLabelButton.border = border;

	for (let line = 0; line < lines; line++) {
		let shade = isdef(colors) ? colors[line] : undefined;
		for (let i = 0; i < keys.length; i++) {
			let item = items[i];
			let info = item.info; //infos[i];
			let label = item.label; //labels[i];
			let bgPic = item.bg; //bgs[i];
			let ipic = (line * keys.length + i);
			if (ipic % picsPerLine == 0 && ipic > 0) mLinebreak(dParent);
			let id = 'pic' + ipic; // (line * keys.length + i);
			let d1 = maPicLabelButtonFitText(info, label,
				{ w: pictureSize, h: pictureSize, bgPic: bg, shade: shade, overlayColor: overlayShade },
				onClickPictureHandler, dParent, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;
			pics.push({ shade: shade, key: info.key, info: info, div: d1, id: id, index: i, label: label, isLabelVisible: true, isSelected: false });
		}
	}

	return pics;


}
function layoutGrid(elist, dGrid, containerStyles, { rows, cols, isInline = false } = {}) {
	//console.log(elist, elist.length)

	let dims = calcRowsCols(elist.length, rows, cols);
	//console.log('dims', dims);

	let parentStyle = jsCopy(containerStyles);
	parentStyle.display = isInline ? 'inline-grid' : 'grid';
	parentStyle['grid-template-columns'] = `repeat(${dims.cols}, auto)`;
	parentStyle['box-sizing'] = 'border-box'; // TODO: koennte ev problematisch sein, leave for now!

	//console.log('parentStyle', parentStyle)

	mStyleX(dGrid, parentStyle);
	let b = getBounds(dGrid);
	return { w: b.width, h: b.height };

}
function onClickRestartProgram() {

	let i = Settings.program.currentGameIndex = 0;
	Settings.program.currentLevel = currentLevel = getUserStartLevel(i); //0; //Settings.program.gameSequence[0].startLevel_;

	localStorage.setItem(SETTINGS_KEY_FILE, JSON.stringify(Settings));
	loadSettingsFromLocalStorage();

}

function determineGame_dep(data) {
	//determining currentGame: data undefined, game name or game index
	if (nundef(data)) {
		if (GameSelectionMode == 'program') {
			data = gameSequence[Settings.program.currentGameIndex];
			currentGame = data.game;
			currentLevel = Settings.program.currentLevel;
		} else if (GameSelectionMode == 'training') {
			currentGame = 'gSayPicAuto';
			currentLevel = 0;
			//MASTER_VOLUME = 1;
			show('divControls');
		} else {
			console.log('hard-coded: currentGame', currentGame, 'currentLevel', currentLevel);
		}
	} else if (isNumber(data)) {
		GameSelectionMode = 'indiv';
		currentLevel = Number(data) % MAXLEVEL;

	} else if (isString(data)) {
		//data is the name of a game
		GameSelectionMode = 'indiv';
		currentGame = data;
		currentLevel = startAtLevel[currentGame];
	}
}
function scoreSummary() {

	let game = {};
	for (const gdata of CurrentSessionData.games) {
		//let gData=CurrentSessionData.games[gname];
		let gname = gdata.name;
		let nTotal = 0;
		let nCorrect = 0;
		for (const ldata of gdata.levels) {
			if (nundef(ldata.numTotalAnswers)) continue;
			nTotal += ldata.numTotalAnswers;
			nCorrect += ldata.numCorrectAnswers;
		}
		if (nTotal == 0) continue;
		if (isdef(game[gname])) {
			game[gname].nTotal += nTotal;
			game[gname].nCorrect += nCorrect;
		} else {
			game[gname] = { name: gname, nTotal: nTotal, nCorrect: nCorrect };
		}


	}
	console.log('game',game);
	for (const gname in game) {
		let tot=game[gname].nTotal;
		let corr = game[gname].nCorrect;
		console.log(gname,tot,corr)
		game[gname].percentage = (game[gname].nCorrect / Math.max(1, game[gname].nTotal))*100;
	}



	//let dParent=mBy('freezer2');
	let d = mBy('dContentFreezer2');
	clearElement(d);
	mStyleX(d, { fz: 20, matop: 40, bg: 'silver', fg: 'indigo', rounding: 20, padding: 25 })
	let style = { matop: 4 };
	mText('Unit Score:', d, { fz: 22 });
	
	for(const gname in game){
		//let name = gname.substring(1);
		let sc=game[gname];

		mText(`${GFUNC[gname].friendlyName}: ${sc.nCorrect}/${sc.nTotal} correct answers (${sc.percentage}%) `, d, style);

	}
	// mText('Writing: 10/15 correct answers (70%)', d, style);
	// mText('Speaking: 10/15 correct answers (70%)', d, style);
	// mText('Completing Words: 10/15 correct answers (70%)', d, style);
	// mText('Identifying Words: 10/15 correct answers (70%)', d, style);
	// mText('Colors and Words: 10/15 correct answers (70%)', d, style);

	//session scores should be downloaded!
	return game;

}

async function loadSession_yet(){
	fetch('http://localhost:3000/users/1', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		// body: JSON.stringify(payload)
	}).then(data => {
		CurrentSessionData = await data.json();
		console.log(CurrentSessionData);
		SessionStart();
	});
}
async function saveSession() {
	//localStorage.
	console.log('posting...');

	let payload = {
		"id": 1,
		"email": "john@doe.com"
	};
	fetch('http://localhost:3000/users/1', {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	}).then(data => {
		console.log(data);
		// this.notifications.show({
		//     message: 'Изменения сохранены'
		// });
	});

	// const response = await fetch('http://localhost:3000/users', {
	// 	method: 'POST', // *GET, POST, PUT, DELETE, etc.
	// 	mode: 'no-cors', // no-cors, *cors, same-origin
	// 	cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
	// 	credentials: 'same-origin', // include, *same-origin, omit
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 		// 'Content-Type': 'application/x-www-form-urlencoded',
	// 	},
	// 	redirect: 'follow', // manual, *follow, error
	// 	referrerPolicy: 'no-referrer', // no-referrer, *client
	// 	body: JSON.stringify({ userId:566, name: 'toto' })}); // body data type must match "Content-Type" header
	//});
	//return await response.json(); // parses JSON response into native JavaScript objects

	// fetch('http://localhost:3000/users', {
	//   username: 'max',
	//   password: 'hallo',
	//   mode: 'no-cors',
	//   method: 'post',
	//   url: `http://localhost:3000`,
	//   credentials: 'include'
	// });
	//postData('https://localhost:3000/users', { userId:566, name: 'toto' })
}
