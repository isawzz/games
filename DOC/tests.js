var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var words,grammar,lang,matchingWords,recognition,speechRecognitionList,hintMessage,resultMessage;

function onClickStartButton(){
	hide('bStart');
	speechEngineGo(lang,matchingWords);
}
//function 

async function testSpeech(){
	await loadAssets();

	hide('floatingMenu');
	let table=mBy('table');
	//hier kommen words, choose random word


	let e=mEmo('red heart',table,200);
	e.style.color = 'red';

	mFlexLinebreak(table);

	 lang='E';
	 matchingWords=['heart'];
	if (isEnglish(lang)){
		mInstruction('Say the word in English', table);
	}else{
		mInstruction('Sag das Wort auf Deutsch', table);
	}
	mFlexLinebreak(table);
	hintMessage = mHeading('HALLO',table,1,'hint');
	mFlexLinebreak(table);
	resultMessage = mText('jajaja',table); 
	resultMessage.id ='result';
	resultMessage.style.marginTop='200px';
	resultMessage.style.fontSize='20pt';

	//start the engine!

	//speechEngineGo(lang,matchingWords);
}
function speechEngineGo(lang,matchingWords){
	words = matchingWords;
	grammar = '#JSGF V1.0; grammar colors; public <color> = ' + words.join(' | ') + ' ;'
	
	recognition = new SpeechRecognition();
	speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	recognition.continuous = false;
	recognition.lang = isEnglish(lang) ?'en-US':'de-DE'; //'en-US';
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;

	recognition.onresult = function (event) {
		let word = event.results[0][0].transcript;
		resultMessage.textContent = 'Result received: ' + word + '.';
		//bg.style.backgroundColor = color;
		console.log('Confidence: ' + event.results[0][0].confidence);
		recognition.stop();
		let b=mBy('bStart');
		b.innerHTML='NEXT';
		show('bStart');
	}
	
	recognition.onspeechend = function () {
		console.log('onSpeechEnd happened!')
		recognition.stop();
	}
	
	recognition.onnomatch = function (event) {
		resultMessage.textContent = "I didn't recognise that word! - try again";
		//da muss ein hint kommen!!!
		recognition.stop();
	}
	
	recognition.onerror = function (event) {
		resultMessage.textContent = 'Error occurred in recognition: ' + event.error;
		recognition.stop();
	}

	// resultMessage = document.querySelector('.output');
	// var bg = document.querySelector('html');
	// var hints = document.querySelector('.hints');
	
	// var colorHTML = '';
	// words.forEach(function (v, i, a) {
	// 	console.log(v, i);
	// 	colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
	// });
	// hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';
	
	document.body.onclick = function () {
		recognition.start();
		console.log('Ready to receive a color command.');
	}
	
	
}
function mInstruction(msg,dParent){
	let p=mCreate('h2');
	p.innerHTML=msg+'!';
	mAppend(dParent,p);
	return p;
}
function mHeading(msg,dParent,level,id){
	let p=mCreate('h'+level);
	if (!isEmpty(msg)) p.innerHTML=msg;
	if (isdef(id)) p.id=id;
	mAppend(dParent,p);
	return p;
}
// function mText_(msg,dParent,id){
// 	let p=mCreate('div');
// 	if (!isEmpty(msg)) p.innerHTML=msg;
// 	if (isdef(id)) p.id=id;
// 	mAppend(dParent,p);
// 	return p;
// }
async function testFetchCsvAsTextAndSearch() {
	// let x = await (await fetch('/assets/openmoji.csv')).text();
	// let res = processCsvData(x);
	// let records = emojiChars = res.records;
	// let byName = emojiKeys = res.recordsByName;
	// let num = numEmojis = Object.keys(byName).length;
	timit = new TimeIt('*timer', TIMIT_SHOW);

	await loadAssets();

	timit.show();
	mEmo('blue heart','table',100);

	mFlexLinebreak('table');

	for(const k of ['cat', 'lion', 'tiger', 'leopard','horse','zebra','deer','ox','cow']){
		let emo = mEmo(k,'table',50);
	}
}

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
	mColor(d, 'orange');
	mFlexWrap(d);
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
	console.log(s)
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

	let x = await (await fetch('/RSG/js')).text();

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
	request.open('GET', '/RSG/', true);

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
function isEnglish(lang){	return startsWith(lang.toLowerCase(),'e');}



