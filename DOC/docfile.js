//#region vault
async function createVault(){
	//zuerst vault holen und zwar aus index.html!
	//fetch index.html als text
	let sIndex = await fetchFileAsText('/CODE/index.html');

	// wie krieg ich vault?
	let lines = sIndex.split('\n');
	//console.log(lines)
	let res = skipToLine(lines, 0, '#region loading:');
	//console.log(lines[res.index]);

	let resend = skipToLine(lines, res.index, '#endregion');
	//console.log(lines[resend.index]);
	
	//alle
	let listOfFiles = lines.slice(res.index,resend.index);
	listOfFiles = listOfFiles.map(x=>stringBetween(x,'"'));
	listOfFiles = listOfFiles.filter(x=>!isEmpty(x.trim()));
	listOfFiles.sort();	
	listOfFiles = Array.from(listOfFiles);
	//console.log(typeof listOfFiles, listOfFiles)
	//vault.map(x=>//console.log(x));
	let vault = await documentVault(listOfFiles);
	return vault;
}


async function documentVault(pathlist) {
	//console.log('pathlist',pathlist);
	let res = {};
	for (const p of pathlist) {
		//console.log(p)
		res[p] = await documentFile(p);
	}
	return res;
}
async function documentFile(url) {
	//#region doc
	/*
	return a dictionary {signature:commentBlock} for each function in url 
	*/
	//#endregion
	let res = await fetchFileAsText(url);
	let lines = res.split('\n');
	let i = 0;
	let akku = {};
	let lastKey;
	while (i < lines.length) {
		let res = skipToLine(lines, i, ['function', '//#region doc ']);
		if (nundef(res.option)) { break; }
		if (res.option == 'function') {
			//what if find function?
			let line = lines[res.index];
			let lineTrimmed = line.trim();
			if (startsWith(lineTrimmed, 'function') || startsWith(lineTrimmed, 'async')) {
				let line1 = stringAfter(line, 'function ');
				line1 = stringBefore(line1, '{').trim();
				akku[line1] = '';
				lastKey = line1;
				//console.log(line1);
			}
		} else {
			//what if find //#region doc?
			//console.log(res.option,lastKey,lines[res.index])
			let iStart = res.index + 1;
			let resend = skipToLine(lines, iStart, ['//#endregion']);
			let iEnd = resend.index;
			let block = copyLinesFromTo(lines, iStart, iEnd, '/*', '*/');
			if (lastKey) akku[lastKey] = block;
			lastKey = null;

		}
		i = res.index + 1;
	}
	return akku;
}
function test0000000() {
	//#region doc
	/*
	return a blablabl
	blablabl

	bla bla bla
	*/
	//#endregion
	return 4;
}
//#endregion

