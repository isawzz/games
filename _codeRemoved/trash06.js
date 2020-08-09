//#region july17
async function loadIcons() {
	vidCache = new LazyCache(true);
	iconCharsC = await vidCache.load('iconChars', route_iconChars);
	iconChars = vidCache.asDict('iconChars');
	iconKeys = Object.keys(iconChars);
	numIcons = iconKeys.length;
}
function processCsvData(allText) {
	var numHeadings = 5;  // or however many elements there are in each row
	var allTextLines = allText.split(/\r\n|\n/);
	//console.log('found',allTextLines.length,'text lines!!!')
	var headings = allTextLines[0].split(',');
	numHeadings = headings.length;
	//console.log('headings',numHeadings,headings);
	let entries = allTextLines.splice(1);
	//entries = entries.slice(0,10);
	//entries.map(x=>console.log(x)); 
	var records = { headings: headings };
	var recordsByName = {};
	for (const e of entries) {
		let o = {};
		let values = e.split(',');
		for (let i = 0; i < numHeadings; i++) {
			let k = headings[i];
			o[k] = values[i];
		}
		records[o.hexcode] = o;
		recordsByName[o.annotation] = o.hexcode;
	}
	//console.log('recordsByName',recordsByName)
	return { records: records, recordsByName: recordsByName };
}

//#region july16
function activateCollapsibles(isOpen = true) {
	let coll = document.getElementsByClassName("collapsible");
	for (let i = 0; i < coll.length; i++) {
		//coll[i].addEventListener("click", toggleCollapsible);
		if (isOpen) fireClick(coll[i]);
	}
}

//#region july15
function countStarting(s, sub) {

	let i = 0;
	let len = sub.length;
	while (startsWith(s, sub) || startsWith(s, '\t')) {
		i += 1;
		s = s.slice(len);
		console.log(s)
	}
	return i;
}
function addComment_dep(s, dParent) {
	for (const ch of s) { console.log('ch=' + ch) }
	s = s.replace('\t', '  ');
	let el = mCreate('pre');
	el.innerHTML = s;
	mAppend(dParent, el);
	//el.style.whiteSpace = 'pre'
	convertPre2(el);
	//convertPre1(el)
	return el;
}
function convertPre(pre) {
	//var pre= document.querySelector('pre');

	//insert a span in front of the first letter.  (the span will automatically close.)
	pre.innerHTML = pre.textContent.replace(/(\w)/, '<span>$1');
	console.log(pre);

	//get the new span's left offset:
	var left = pre.querySelector('span').getClientRects()[0].left;

	//move the code to the left, taking into account the body's margin:
	pre.style.marginLeft = (-left + pre.getClientRects()[0].left) + 'px';
}
function convertPre1(el) {
	// get block however you want.
	var block = el; //document.getElementById("the-code");

	// remove leading and trailing white space.
	var code = block.innerHTML
		.split('\n')
		.filter(l => l.trim().length > 0)
		.join('\n');

	// find the first non-empty line and use its
	// leading whitespace as the amount that needs to be removed
	var firstNonEmptyLine = block.textContent
		.split('\n')
		.filter(l => l.trim().length > 0)[0];

	// using regex get the first capture group
	var leadingWhiteSpace = firstNonEmptyLine.match(/^([ ]*)/);

	// if the capture group exists, then use that to
	// replace all subsequent lines.
	if (leadingWhiteSpace && leadingWhiteSpace[0]) {
		var whiteSpace = leadingWhiteSpace[0];
		code = code.split('\n')
			.map(l => l.replace(new RegExp('^' + whiteSpace + ''), ''))
			.join('\n');
	}

	// update the inner HTML with the edited code
	block.innerHTML = code;
}
function convertPre2(el) {
	var html = el.innerHTML;
	var pattern = html.match(/\s*\n[\t\s]*/);
	let x = html.replace(new RegExp(pattern, "g"), '\n');
	el.innerHTML = x;
}


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
			akku[line1] = '';
			lastKey = line1;
			//console.log(line1);
		} else {
			//what if find //#region doc?
			let iStart = res.index + 1;
			//console.log(lines[iStart]);
			let resend = skipToLine(lines, iStart, ['//#endregion']);
			let iEnd = resend.index;

			let block = copyLinesFromTo(lines, iStart, iEnd);
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

	let keys = Object.keys(akku);
	keys.sort();
	keys.map(x => console.log(x, akku[x]));

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










