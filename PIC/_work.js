var infoDictionary;


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









