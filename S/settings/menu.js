function initMainMenu() {
	dMenu = mBy('dMenu')
}
function loadMenuX() {
	createMenuUi();
	loadMenuFromLocalStorage();
}
function loadMenuFromLocalStorage() {
	//console.log('loading menu')
}
function saveMenuX() {
	//console.log('saving menu')


	// let ta = mBy('dMenu_ta');
	// let t1 = ta.value.toString();
	// let t2 = jsyaml.load(t1);
	// let t3 = JSON.stringify(t2);
	// localStorage.setItem(SETTINGS_KEY_FILE, t3);
	// //console.log('______________SAVED SETTINGS\n', 't1', typeof (t1), t1, '\nt2', typeof (t2), t2, '\nt3', typeof (t3), t3)

}

function openMenu() { stopAus(); hide('dMenuButton'); show('dMenu'); loadMenuX(); }
function closeMenu() { show('dMenuButton'); saveMenuX(); loadMenuFromLocalStorage(); hide(dMenu); continueResume(); }
function toggleMenu() { if (isVisible2('dMenu')) closeMenu(); else openMenu(); }


function createMenuUi() {
	let dParent = mBy('dMenu');
	let dOuter = createCommonUi(dParent, resetMenuToDefaults, () => { closeMenu(); startGame(); });

	let b = getBounds(dOuter);
	let d = mDiv(dOuter, { h: b.height - 60, margin: 20, bg: 'blue', border: '20px solid transparent', rounding: 20 });
	mClass(d, 'flexWrap');

	//hier kommt main menu
	//einfach nur games gallery
	//current game markiert


	//jedes game bekommt ein logo =>GFUNC
	let games = ['gTouchPic', 'gWritePic', 'gSayPic', 'gTouchColors', 'gMissingLetter', 'gPreMem', 'gMem'];
	let labels = games.map(g => GFUNC[g].friendlyName);
	let keys = games.map(g => GFUNC[g].logo);
	let bgs = games.map(g => GFUNC[g].color);

	//console.log('-----------------bgs', bgs);

	//let b=getBounds(d);
	//console.log('____________ bounds',b)

	maShowPictures(keys, labels, d, null, { bgs: bgs }); //, shufflePositions: false });
	// gridLabeledX(keys, labels, d, { rows: 2, layout: 'flex' });
}

function resetMenuToDefaults() {
	//console.log('reset menu to defaults')
}

function maShowPictures(keys, labels, dParent, onClickPictureHandler,
	{ container, lang, border, bgs, colors, contrast, repeat = 1, shufflePositions = true } = {}) {
	let pics = [];

	//console.log('maShowPictures', 'keys', keys, '\n', 'labels', labels, '\n', 'bgs', bgs)

	let numPics = keys.length * repeat;

	//make a label for each key
	let items = [];
	for (let i = 0; i < keys.length; i++) {
		let k = keys[i];
		let info = isdef(lang) ? getRandomSetItem(lang, k) : symbolDict[k];
		let bg = isList(bgs) ? bgs[i] : isdef(colors) ? 'white' : 'random';
		let label = isList(labels) ? labels[i] : isdef(lang) ? info.best : k;
		items.push({ key: k, info: info, label: label, bg: bg });
	}

	//console.log('________________',items,repeat)
	let items1 = jsCopy(items);
	for (let i = 0; i < repeat - 1; i++) { items = items.concat(items1); }
	//console.log('________________',items,repeat)


	let isText = true;
	let isOmoji = false;
	if (isdef(lang)) {
		let textStyle = getParamsForMaPicStyle('twitterText');
		isText = textStyle.isText;
		isOmoji = textStyle.isOmoji;
	}

	//console.log(items);
	numPics = items.length;

	//dann erst shuffle!
	if (shufflePositions) shuffle(items);

	let lines = isdef(colors) ? colors.length : 1;
	let [pictureSize, picsPerLine] = calcDimsAndSize(numPics, lines, container);
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };
	if (isdef(border)) stylesForLabelButton.border = border;

	for (let line = 0; line < lines; line++) {
		let textShadowColor = isdef(colors) ? colors[line] : undefined;
		for (let i = 0; i < numPics; i++) {
			let item = items[i];
			let info = item.info; //infos[i];
			let label = item.label; //labels[i];
			let bg = item.bg; //bgs[i];
			let ipic = (line * keys.length + i);
			if (ipic % picsPerLine == 0 && ipic > 0) mLinebreak(dParent);
			let id = 'pic' + ipic; // (line * keys.length + i);
			let d1 = maPicLabelButtonFitText(info, label,
				{ w: pictureSize, h: pictureSize, bgPic: bg, textShadowColor: textShadowColor, contrast: contrast },
				onClickPictureHandler, dParent, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;
			pics.push({ textShadowColor: textShadowColor, key: info.key, info: info, bg:bg, div: d1, id: id, 
				index: i, label: label, isLabelVisible: true, isSelected: false });
		}
	}

	return pics;


}
function calcDimsAndSize(numPics, lines, container) {

	let ww, wh, hpercent, wpercent;
	if (isdef(container)) {
		let b = getBounds(container);
		ww = b.width;
		wh = b.height;
		hpercent = .9;
		wpercent = .9;
	} else {
		ww = window.innerWidth;
		wh = window.innerHeight;
		hpercent = .6;
		wpercent = .6;
	}
	let sz, picsPerLine;
	if (lines > 1) {
		let hpic = wh * hpercent / lines;
		let wpic = ww * wpercent / numPics;
		sz = Math.min(hpic, wpic);
		picsPerLine = numPics; //keys.length;
	} else {
		let dims = calcRowsColsX(numPics);
		let hpic = wh * hpercent / dims.rows;
		let wpic = ww * wpercent / dims.cols;
		sz = Math.min(hpic, wpic);
		picsPerLine = dims.cols;
	}

	pictureSize = Math.max(50, Math.min(sz, 200));
	return [pictureSize, picsPerLine];
}

