//#region vault
async function createVault() {
	//zuerst vault holen und zwar aus index.html!
	//fetch index.html als text
	let sIndex = await fetchFileAsText('/RSG/index.html');

	// wie krieg ich vault?
	let lines = sIndex.split('\n');
	//console.log(lines)
	let res = skipToLine(lines, 0, '#region loading:');
	//console.log(lines[res.index]);

	let resend = skipToLine(lines, res.index, '#endregion');
	//console.log(lines[resend.index]);

	//alle
	let listOfFiles = lines.slice(res.index, resend.index);
	listOfFiles = listOfFiles.map(x => stringBetween(x, '"'));
	listOfFiles = listOfFiles.filter(x => !isEmpty(x.trim()));
	listOfFiles.sort();
	listOfFiles = Array.from(listOfFiles);
	//console.log(typeof listOfFiles, listOfFiles)
	//vault.map(x=>//console.log(x));

	listOfFiles = ['/CODE/helpers.js','/RSG/js/_rParse.js'];
	//console.log(listOfFiles)
	let vault = await documentVault(listOfFiles);
	return vault;
}


async function documentVault(pathlist) {
	//console.log('pathlist',pathlist);
	let res = {};
	for (const p of pathlist) {
		//console.log(p)
		let fileInfo = await documentFile(p);
		res[p] = { filename: stringAfterLast(p, '/'), funcDict: fileInfo.funcDict, topComment: fileInfo.topComment };
		//let pathEntry= await documentFile(p);
	}
	return res;
}
async function documentFile(url) {
	//#region doc
	/*
	return a dictionary {signature:commentBlock} for each function in url 
	*/
	//#endregion

	//console.log('url',url)

	let res = await fetchFileAsText(url);

	let regex=new RegExp('\nasync function|\nfunction|\nvar|\nconst|\nclass','g');
	let fcode=res.split(regex);
	//fcode.map(x=>console.log(x));
	let code={};
	for(const w of fcode){
		let trimmed = w.trim();
		let name = firstWord(trimmed);
		//console.log('first word of',trimmed,'is',name);
		//console.log('first word is',name);
		if (!isEmpty(name)) code[name]=trimmed;
	}



	let lines = res.split('\n');
	let i = 0;
	let iFunc = 0;
	let akku = {};
	let lastKey;
	let topComment = '';
	while (i < lines.length) {
		let res = skipToLine(lines, i, ['function', '//#region doc ']);
		if (nundef(res.option)) {
			//rest must be collected!
			break;
		} else if (res.option == 'function') {
			//what if find function?
			let line = lines[res.index];
			let lineTrimmed = line.trim();
			if (startsWith(lineTrimmed, 'function') || startsWith(lineTrimmed, 'async')) {
				let line1 = stringAfter(line, 'function ');
				line1 = stringBefore(line1, '{').trim();
				//akku[line1] = '';

				let entry = akku[line1] = { name: firstWord(line1), index: iFunc, comments: '', path: url }; 
				if (isdef(code[entry.name])) entry.code = code[entry.name];
				iFunc += 1;

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
			if (lastKey) akku[lastKey].comments = block;
			else topComment = block;//this MUST be top of file comment!!!

			lastKey = null;

		}
		i = res.index + 1;
	}
	//console.log(akku)
	return { funcDict: akku, topComment: topComment };
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

