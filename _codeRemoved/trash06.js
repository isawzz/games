//#region july14
async function documentFile(url) {
	let res = await fetchFileAsText(url);
	let lines = res.split('\n');

	//let res1 = skipTo(lines, 5, ['function', '//#region doc']); 	console.log(res1,lines[res1.index]);	return res1;

	let i = 0;
	let akku = {};
	
	let MAXMAX = 5;
	let MAX = 0;
	let lastKey;
	while (i < lines.length) {
		//MAX += 1; if (MAX > MAXMAX) break;
		
		let res = skipToLine(lines, i, ['function', '//#region doc']);
		// console.log(res,lines[res.index])
		if (nundef(res.option)) { break; }
		if (res.option == 'function') {
			//function without doc has been found! just doc signature!
			let line = lines[res.index];
			let line1 = stringAfter(line, 'function ');
			line1 = stringBefore(line1, '{');
			akku[line1]='';
			lastKey=line1;
			//console.log(line1);
		} else {
			//what if find //#region doc?
			let iStart = res.index + 1;
			//console.log(lines[iStart]);
			let resend = skipToLine(lines, iStart, ['//#endregion']);
			let iEnd = resend.index;

			let block = copyLinesFromTo(lines,iStart,iEnd);
			// //from iStart to iEnd is doc block, however start it after /* and before */
			// let block = stringAfter(lines[iStart], '/*');
			// while (iStart < iEnd) {
			// 	block += '\n' + lines[iStart];
			// 	iStart += 1;
			// }
			// block = stringBefore(block, '*/');
			//console.log('block',block);
			akku[lastKey] = block;

		}
		i = res.index + 1;
	}

	let keys=Object.keys(akku);
	keys.sort();
	keys.map(x => console.log(x,akku[x]));

	// console.log(entries);
	// return entries;


}
async function documentFile_dep(url) {
	let res = await fetchFileAsText(url);


	let lines = res.split('\n');
	//console.log(lines);

	let i = 0;
	let akku = [];
	let entries = [];
	while (i < lines.length) {

		//find next line that includes 'function'
		let line = lines[i];
		i += 1;
		if (isEmpty(line)) continue;
		if (line.includes('function')) {
			let line1 = stringAfter(line, 'function ');
			line1 = stringBefore(line1, '{');
			akku.push(line1);
			//console.log(line1); //'line',typeof line,line);
			//take only the word after function and the 

			let comments = [];
			let topComment = [];
			line = lines[i];
			while (i < lines.length && !lines[i].includes('function')) {
				let cline = lines[i];
				if (cline.includes('//@')) comments.push(cline);
				else if (startsWith(cline, '//# region doc')) {
					i = readDoc(lines, i, topComment)
				}
				i += 1;
			}
			entries.push({ title: line1, body: comments });
		}
	}
	akku.sort();
	akku.map(x => console.log(x));

	console.log(entries);
	return entries;


}










