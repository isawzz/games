
function testRegexSplit() {
	let res = '\nfunction \nfunction hallo(){return "hallo";}\nasync function hallo1(){return "hallo1";}'
	let regex = new RegExp('\nasync function|\nfunction|\nvar|\nconst|\nclass', 'g');
	let fcode = res.split(regex);
	console.log(fcode);
	//jetzt muss ich aber ein dict machen in dem zu jeder func or async func
	//alle empty matches weg damit
	//die nicht empty trim
	//die trimmed take first word (das ist der func name)
	//in jedem parseFile mach dieses dict und gib jedem funcDict ein property code
}

async function testIconViewer() {
	await loadAssets();
	let d = mDiv(mBy('table'));
	//mSize(d, 200, 200);
	mColor(d, 'orange');
	mFlexWrap(d);
	// let d=mFlexWrap(mBy('table'));
	// mSize(d,100,100);
	// mColor(d,'blue');
	let n = 4;
	for (const k in iconChars) {
		let pic = createPictoX(d, { 'text-align': 'center', border: '1px solid red', margin: 4, 'background-color': 'green' }, null, { s: k }, { key: k }, { s: k });
		//n -= 1; if (n <= 0) break;
	}
}
function testMultiline() {
	let d = mDiv(mBy('table'));
	mSize(d, 200, 200);
	mColor(d, 'orange');

	//let s=' hallo\n  das\n   ist\n    da'; //ok
	let s = ' hallo\n\tdas\n   ist\n\t\tda';
	let dMulti = mMultiline(s, 2, d); //ok

}
function testIndenting() {
	let spc = '&nbsp;';

	let d = mDiv(mBy('table'));
	mSize(d, 200, 200);
	mColor(d, 'orange');

	let s = `
	hallo
		das ist
		 ein
	 string
		1
		 2
			3`;

	s = s.replace('\t', '  ');
	let startLine = true;
	let lines = s.split('\n');
	//console.log(lines)
	let lineInfo = {};
	let html = '';
	for (let i = 0; i < lines.length; i += 1) {
		let line = lines[i];
		let n = countIndent(line, 4);
		console.log('_____________n=' + n, line);
		//console.log('n',n);
		let x = spc.repeat(n) + line;
		html += x + '<br>';
		console.log(x)
	}
	let d1 = mText(html, d)
}

function mMultiline(s, tabvalue, dParent, styles, classes) {
	let spc = '&nbsp;';
	let lines = s.split('\n');
	let html = '';
	for (let i = 0; i < lines.length; i += 1) {
		let line = lines[i];
		let n = countIndent(line, tabvalue);
		//console.log('_____________n='+n,line);
		let x = spc.repeat(n) + line;
		html += x + '<br>';
	}
	let d1 = mText(html, dParent);
	if (isdef(styles)) mStyle(d1, styles);
	if (isdef(classes)) mClass(d1, ...classes);


	return d1;
}

function createIndependentUi(n, area) {
	if (nundef(n.type)) { n.type = inferType(n); }

	//if (n.type == 'manual00') { if (isdef(n.children)) { n.type = 'panel'; } else { n.type = 'info'; } }
	//console.log('hallo',n.uid,n.type)

	R.registerNode(n);

	decodeParams(n, R, {});

	calcIdUiParent(n, R, area);

	//console.log('create ui for',n.uid,n.type,n.content,n.uidParent,n.idUiParent)
	let ui;
	if (nundef(RCREATE[n.type])) ui = mDefault(n, area, R);
	else ui = RCREATE[n.type](n, R, area);

	if (nundef(n.uiType)) n.uiType = 'd'; // d, g, h (=hybrid)

	if (n.uiType == 'NONE') return ui;

	if (n.uiType != 'childOfBoardElement') {
		if (isBoard(n.uid, R)) { delete n.cssParams.padding; }
		applyCssStyles(n.uiType == 'h' ? mBy(n.uidStyle) : ui, n.cssParams);
	}

	if (!isEmpty(n.stdParams)) {
		//console.log('rsg std params!!!', n.stdParams);
		switch (n.stdParams.show) {
			case 'if_content': if (!n.content) hide(ui); break;
			case 'hidden': hide(ui); break;
			default: break;
		}
	}

	R.setUid(n, ui);

	// let b=getBounds(ui,true);console.log('________createUi: ',n.uid,'\n',ui,'\nbounds',b.width,b.height);

	return ui;

}
function testDec(){
	let x=hexStringToDecimal('F');
	console.log('x',x);
	console.log('x',hexStringToDecimal('FFFF'));
	console.log('x',hexStringToDecimal('1A'));
	console.log('x',hexStringToDecimal('1F499'));
	console.log('x',hexStringToDecimal('1F981'));
}
async function testFetchCsvAsTextAndSearch() {
	let x = await (await fetch('/assets/openmoji.csv')).text();
	let res = processCsvData(x);

	let records = emojiChars = res.records;
	let byName = emojiKeys = res.recordsByName;
	let num = numEmojis = Object.keys(byName).length;

	mEmo('blue heart','table',100);

	mFlexLinebreak('table');

	for(const k of ['cat', 'lion', 'tiger', 'leopard','horse','zebra','deer','ox','cow']){
		let emo = mEmo(k,'table',50);
		//if (k!='cow') mFlexChild(emo);
	}
	//mFlexLinebreak('table');
	//mEmoSimple(129409, 'table', 60); //loewe
	//mEmoSimple(decCode, 'table', 60); //loewe

	return;

	let table = mBy('table');
	let d = mDiv(table);
	//let family = 'emoColor';
	//d.style.fontFamily = 'emoColor';
	let s1 = ' \u1F499';
	s1 = 'U+1F436';
	s1 = '\u{1F436}';
	s1 = String.fromCharCode(0xD83D, 0xDE04);
	s1 = '&#129409;'; //'\u{1F436}';
	d.innerHTML = s1;
	d.style.fontSize = '40pt';

	// elem = document.createElement('p')
	// elem.innerHTML = "&#x1f604"
	// value = elem.innerHTML;
	// d.appendChild(elem);



	//let emo=createEmoji({key:'blue heart',w:150,bg:'green',padding:25,parent:'table'})


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
async function testFetchIndexHtmlAsTextAndSearch() {
	let x = await (await fetch('/EMOJI/indexTest.html')).text();
	let syms = x.split("copyToClipboard('");

	syms = syms.slice(1, syms.length - 2);
	//syms.map(x=>console.log(x));
	let emoChars = {};
	for (const s of syms) {
		let t = stringAfter(s, 'title="');
		t = stringBefore(t, '"');
		let name = stringBefore(t, ' - ');
		let unicode = stringAfter(t, ' - ');
		//console.log('name',name,'unicode',unicode);
		let fname = unicode; //stringAfter(s,'src="');	fname=stringBefore(t,'"');
		emoChars[name] = unicode;
		if (unicode.length > 5 || unicode == '1F425') {
			console.log(s);
		}
	}
	console.log(emoChars);
	await loadAssets();
	console.log(iconChars);
}

async function testDirList() {

	let x = await (await fetch('/CODE/js')).text();

	//console.log('x',stringAfter(x,'<a href="/'));
	while (!isEmpty(x)) {
		word = stringBefore(x, '"');
		console.log('______________word:', word);
		x = stringAfter(x, '<a href="/');
	}

	return;
	var regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
	var match, files = [];

	let max = 5;
	while ((match = regexp.exec(x)) != null) {
		files.push(match.index);
		max -= 1; if (max <= 0) break;
	}

	console.log('________________', files);
	return;

	var request = new XMLHttpRequest();
	request.open('GET', '/CODE/', true);

	let resp;
	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			resp = request.responseText;
		}
	};

	request.send();
	let directory_listing = resp;
	var regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
	var match, files = [];

	while ((match = regexp.exec(resp)) != null) {
		files.push(match.index);
	}

	console.log(files);

}



