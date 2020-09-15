
async function makeHugeSvgFile() {
	mStyleX(table, { display: 'flex', 'flex-flow': 'row wrap' });
	let ftext = '';
	let di = symbolDict;
	let MAX = 10; let cnt = 0;
	for (const k in symbolDict) {
		if (cnt > MAX) break; cnt += 1;
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
			let d = mDiv(table, { w: 100, h: 100 });
			d.innerHTML = text;
			info[dir.substring(0, 2) + 'Svg'] = text;
		}
	}
	downloadAsYaml(symbolDict, 'symbolDict');
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












