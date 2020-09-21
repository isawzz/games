//#region reconstructX_
var TESTMAX=20000;
async function reconstructX() {
	//console.log('start rec 0');
	await symbolDictFromCsv(false);
	// 	setTimeout(reconstructX1, 0);

	// }
	// function reconstructX1() {
	// 	symByType = symBySet = null;
	// 	//console.log('start rec 1');
	addAnnotationsToSymbolDict(false);
	// 	setTimeout(reconstructX2, 0);
	// }
	// function reconstructX2() {
	// 	//console.log('start rec 2');
	let list = symbolKeys;
	let cnt=0;//let list1 = firstNCond(TESTMAX, list, x => symbolDict[x].type == 'emo');
	for (const k of list) {
		cnt+=1;if (TESTMAX && cnt>TESTMAX) break;

		addElemsForMeasure(k);
	}
	setTimeout(reconstructX3, 2000);
}
function reconstructX3() {
	//console.log('start rec 3');
	let toBeRemoved = [];
	let list = symbolKeys;
	let cnt=0;//let list1 = firstNCond(TESTMAX, list, x => symbolDict[x].type == 'emo');
	for (const k of list) {
		cnt+=1;if (TESTMAX && cnt>TESTMAX) break;
		let info = symbolDict[k];
		if (isString(info)) toBeRemoved.push(k);
		else berechnungen(symbolDict[k]);
	}
	for (const k of toBeRemoved) delete symbolDict[k];
	setTimeout(reconstructX4, 0);
}
function reconstructX4() {
	USE_LOCAL_STORAGE = true;
	saveSymbolDict();
	SIGI = true;
}
//#endregion











function getSvgKeyFor(key,isOmoji){
	ensureSvgDict();
	return  0;
}
function saveSvgFor(twodi,k,isOmoji,text){
	let dir = isOmoji?'openmoji':'twemoji';

}

async function makeExtraSvgFiles() {
	mStyleX(table, { display: 'flex', 'flex-flow': 'row wrap' });
	let ftext = '';
	let di = symbolDict;
	let twodi={}; //let twdi={};
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
			lookupSet(twodi,[k,dir.substring(0, 2) + 'Svg'],text);
			console.log('svg',k,text.substring(0, 20))
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
			console.log('svg',k,text.substring(0, 20))
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












