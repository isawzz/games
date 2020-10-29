var infoDictionary;
var lastIndex = 0;
function showNM(dParent,N,M) {
	clearElement(dParent);
	let picLabelStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true);
	let picStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', false);
	ensureSymByType();
	let num=N*M;
	let keys = takeFromTo(symKeysByType['icon'], lastIndex, lastIndex + num);//chooseRandom() ['keycap: 0', 'keycap: 1', 'keycap: #', 'keycap: *'];
	lastIndex += num;
	//console.log(keys)
	mpGridLabeled(dParent,keys, picLabelStyles);
}

function itemFunc1() {
	let picLabelStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true);
	let picStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', false);
	let picOverStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true);

}
function showPics() {
	clearElement(table);
	// let picLabelStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true);
	//let picLabelStyles = getHarmoniousStylesPlus({ rounding: 10, margin: 24 }, {}, {}, 60, 60, 0, 'arial', 'random', 'transparent', true);
	//let picStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', false);
	// ensureSymByType();
	let keys = ['island', 'justice star', 'materials science', 'mayan pyramid', 'medieval gate',
		'great pyramid', 'meeple', 'smart', 'stone tower', 'trophy cup', 'viking helmet',
		'flower star', 'island', 'justice star', 'materials science', 'mayan pyramid',];
	const LIGHTGREEN = '#bfef45';
	const LIGHTBLUE = '#42d4f4';
	const YELLOW = '#ffe119';
	const RED = '#e6194B';
	const GREEN = '#3cb44b';
	const BLUE = '#4363d8';
	const PURPLE = '#911eb4';
	const YELLOW2 = '#ffa0a0';
	const TEAL = '#469990';
	const ORANGE = '#f58231';
	const FIREBRICK = '#800000';
	const OLIVE = '#808000';
	let bgs = [LIGHTGREEN, LIGHTBLUE, YELLOW, 'orange', RED,
		GREEN, BLUE, PURPLE, YELLOW2, 'deepskyblue', 
		'deeppink', TEAL, ORANGE, 'seagreen', FIREBRICK, OLIVE,
		// '#911eb4', '#42d4f4', '#f032e6',	'#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#aaffc3', 
		'#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', 'gold', 'orangered', 'skyblue', 'pink', 'deeppink',
		'palegreen', '#e6194B'];
	let fg = '#00000080';
	let textColor = 'white';
	let texts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

	mpGrid(keys, bgs, fg, textColor, texts);
	// let dGrid = mDiv(table);
	// let elems = [];
	// let isText = true;
	// let isOmoji = false;

	// for (let i=0;i<keys.length;i++) {
	// 	let k=keys[i];
	// 	let bg=bgs[i];

	// 	let info = symbolDict[k];
	// 	let el = maPicLabel(info, dGrid, picLabelStyles[0], picLabelStyles[1], picLabelStyles[2], isText, isOmoji)
	// 	elems.push(el);
	// }

	// let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	// let size = layoutGrid(elems, dGrid, gridStyles, { rows:10, isInline: true });

}
function show100() {
	clearElement(table);
	let picLabelStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true);
	let picStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', false);
	ensureSymByType();
	let keys = takeFromTo(symKeysByType['icon'], lastIndex, lastIndex + 100);//chooseRandom() ['keycap: 0', 'keycap: 1', 'keycap: #', 'keycap: *'];
	lastIndex += 100;
	//console.log(keys)
	gridLabeled(keys, picLabelStyles);
}

function test43() {
	let g2Pics = [];

	let keys = ['ant', 'T-Rex'];//'horse'];// 
	//let keys = choose(emoGroupKeys, g2N); // ['T-Rex']; //choose(emoGroupKeys, g2N);

	//console.log('keys',keys)
	//let styles = { w: 200, h: 200, margin: 20, bg: 'random', cursor: 'pointer', rounding: 16, padding: 10 };
	let stylesForLabelButton = { rounding: 10, margin: 24 };
	const picStyles = ['twitterText', 'twitterImage', 'openMojiText', 'openMojiImage', 'segoe', 'openMojiBlackText', 'segoeBlack'];
	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');

	for (let i = 0; i < keys.length; i++) {
		let info = getRandomSetItem('E', keys[i]);

		let label = last(info.words); //'hallo das ist ja bloed';//last(info.words)
		//let maxw=100;
		let d1 = maPicLabelButtonFitText(info, label, { w: 200, h: 200 }, null, table, stylesForLabelButton, 'frameOnHover', isText, isOmoji);

		// let d1 = maPicLabelButton(info, last(info.words), onClickPicture, table, styles, 'frameOnHover', isText, isOmoji); d1.id = id;
		//let d1 = maPicButton(info, onClickPicture, table, styles, 'frameOnHover', isText, isOmoji); d1.id = id;
		//console.log('table',table,'\ndPic',d1)
		g2Pics.push({ key: info.key, info: info, div: d1, id: d1.id, index: i });
	}


}

function test42() {
	//nicht in ein grid sondern einfach so auflinen!
	handler = (ev) => {
		let id = evToClosestId(ev);
		console.log('=>hasLabel?', isLabelVisible(id))
		let info = infoDictionary[id.substring(1)];
		if (isLabelVisible(id)) maHideLabel(id, info); else maShowLabel(id, info);

		mBy('dummy').focus();
		// maHideLabel(id,info);
	}
	mClass(table, 'flexWrap');
	let keys = ['ant', 'horse', 'poodle', 'frog', 'elephant'];
	let infolist = keys.map(x => picInfo(x));
	infoDictionary = {};
	for (const info of infolist) {
		infoDictionary[getBestWord(info, 'E')] = info;
	}
	let styles = { w: 200, h: 200, margin: 20, bg: 'random', cursor: 'pointer', rounding: 16, padding: 10 };
	let picLabelStyles = getHarmoniousStylesPlus(styles, {}, {}, 200, 200, 0, 'arial', 'random', 'transparent', true);
	// let picLabelStyles = getHarmoniousStylesPlus({ rounding: 10, margin: 24 }, {}, {}, 200, 200, 0, 'arial', 'random', 'transparent', true);
	for (const info of infolist) {
		let label = getBestWord(info, 'E');
		let x = maPicLabelX(info, label.toUpperCase(), table, picLabelStyles[0], picLabelStyles[1], picLabelStyles[2], true, false)
		x.id = 'd' + label;
		x.onclick = handler;
		x.style.cursor = 'pointer';
		x.lastChild.style.cursor = 'pointer';
		x.style.userSelect = 'none'
		//x.style.display='inline-box'
	}
}
function test41() {
	//nicht in ein grid sondern einfach so auflinen!
	mClass(table, 'flexWrap')
	let keys = ['ant', 'horse', 'poodle'];
	let infolist = keys.map(x => picInfo(x));
	let picLabelStyles = getHarmoniousStylesPlus({ rounding: 10, margin: 24 }, {}, {}, 200, 200, 0, 'arial', 'random', 'transparent', true);
	for (const info of infolist) {
		let label = getBestWord(info, 'E');
		let x = maPicLabelX(info, label.toUpperCase(), table, picLabelStyles[0], picLabelStyles[1], picLabelStyles[2], true, false)
		x.id = 'd' + label;
		//x.style.display='inline-box'
	}
}
function test40() {

	let picLabelStyles = getHarmoniousStylesPlus({ rounding: 10, margin: 24 }, {}, {}, 200, 200, 0, 'arial', 'random', 'transparent', true);
	let picStyles = getHarmoniousStylesPlus({ rounding: 10, margin: 24 }, {}, {}, 200, 200, 10, 'arial', 'random', 'transparent', false);
	let keys = ['ant', 'horse', 'poodle'];
	let infolist = keys.map(x => picInfo(x));
	randomHybridGrid(infolist, picLabelStyles, picStyles, false, true);
}











//#region svg stuff

function getSvgKeyFor(key, isOmoji) {
	ensureSvgDict();
	return 0;
}
function saveSvgFor(twodi, k, isOmoji, text) {
	let dir = isOmoji ? 'openmoji' : 'twemoji';

}

async function makeExtraSvgFiles() {
	mStyleX(table, { display: 'flex', 'flex-flow': 'row wrap' });
	let ftext = '';
	let di = symbolDict;
	let twodi = {}; //let twdi={};
	let MAX = 0; let cnt = 0;
	for (const k in symbolDict) {
		if (MAX && cnt > MAX) break; cnt += 1;
		let info = symbolDict[k];
		if (info.type != 'emo') continue;
		//console.log(info)
		for (const dir of ['openmoji', 'twemoji']) {

			let hex = info.hexcode;
			if (dir == 'openmoji' && hex.indexOf('-') == 2) hex = '00' + hex;
			let path = '/assets/svg/' + dir + '/' + hex + '.svg';

			let text = await loadAsText(path);
			text = stringBefore(text, '<!-- Code');
			text += '</svg>';
			// let d = mDiv(table, { w: 100, h: 100 });
			// d.innerHTML = text;
			lookupSet(twodi, [k, dir.substring(0, 2) + 'Svg'], text);
			console.log('svg', k, text.substring(0, 20))
		}
	}
	downloadAsYaml(twodi, 'svgDict');
	console.log('DONE!')
}

async function makeHugeSvgFile() {
	mStyleX(table, { display: 'flex', 'flex-flow': 'row wrap' });
	let ftext = '';
	let di = symbolDict;
	let MAX = 0; let cnt = 0;
	for (const k in symbolDict) {
		if (MAX && cnt > MAX) break; cnt += 1;
		let info = symbolDict[k];
		if (info.type != 'emo') continue;
		//console.log(info)
		for (const dir of ['openmoji', 'twemoji']) {

			let hex = info.hexcode;
			if (dir == 'openmoji' && hex.indexOf('-') == 2) hex = '00' + hex;
			let path = '/assets/svg/' + dir + '/' + hex + '.svg';

			let text = await loadAsText(path);
			text = stringBefore(text, '<!-- Code');
			text += '</svg>';
			// let d = mDiv(table, { w: 100, h: 100 });
			// d.innerHTML = text;
			symbolDict[k][dir.substring(0, 2) + 'Svg'] = text;
			console.log('svg', k, text.substring(0, 20))
		}
	}
	downloadAsYaml(symbolDict, 'symbolDict');
	console.log('DONE!')
}
async function makeHugeSvgFile2(isOmoji = true) {
	mStyleX(table, { display: 'flex', 'flex-flow': 'row wrap' });
	let ftext = '';
	let di = symbolDict;
	let MAX = 10; let cnt = 0;
	for (const k in symbolDict) {
		if (cnt > MAX) break; cnt += 1;
		let info = symbolDict[k];
		if (info.type != 'emo') continue;
		//console.log(info)
		let dir = isOmoji ? 'openmoji' : 'twemoji';
		let hex = info.hexcode;
		if (isOmoji && hex.indexOf('-') == 2) hex = '00' + hex;
		let path = '/assets/svg/' + dir + '/' + hex + '.svg';

		let text = await loadAsText(path);
		text = stringBefore(text, '<!-- Code');
		text += '</svg>';
		let d = mDiv(table, { w: 100, h: 100 });
		d.innerHTML = text;

		let prefix = isOmoji ? 'o' : 'tw';
		info[prefix + 'Svg'] = text;
		//console.log(text);
		ftext += text + '\n';
	}

	downloadTextFile(ftext, 'omojis', 'svg');
	downloadAsYaml(symbolDict, 'symbolDict');
}



async function makeHugeSvgFile1(isOmoji = true) {
	mStyleX(table, { display: 'flex', 'flex-flow': 'row wrap' });
	let ftext = '';
	let di = symbolDict;
	for (const info of symListByType['emo']) {
		console.log(info)
		let dir = isOmoji ? 'openmoji' : 'twemoji';
		let hex = info.hexcode;
		if (isOmoji && hex.indexOf('-') == 2) hex = '00' + hex;
		let path = '/assets/svg/' + dir + '/' + hex + '.svg';

		let text = await loadAsText(path);
		text = stringBefore(text, '<!-- Code');
		text += '</svg>';
		let d = mDiv(table, { w: 100, h: 100 });
		d.innerHTML = text;
		//console.log(text);
		ftext += text + '\n';
	}

	console.log('HAAAAAAAAAAAAAAALLLLLLLLLLLLLLLLLLLOOOOOOOOOOOOOOOOOOOOOOO')
	downloadTextFile(ftext, 'omojis', 'svg')
}


//#endregion









