
function testRegexSplit(){
	let res='\nfunction function hallo(){return "hallo";}\nfunction hallo1(){return "hallo1";}'
	let regex=new RegExp('\nasync|\nfunction|\nvar|\nconst|\nclass','g');
	let fcode=res.split(regex);
	console.log(fcode);
}

async function testIconViewer(){
	await loadAssets();
	let d = mDiv(mBy('table'));
	//mSize(d, 200, 200);
	mColor(d, 'orange');
	mFlexWrap(d);
	// let d=mFlexWrap(mBy('table'));
	// mSize(d,100,100);
	// mColor(d,'blue');
	let n=4;
	for(const k in iconChars){
		let pic=createPictoX(d,{'text-align':'center',border:'1px solid red',margin:4,'background-color':'green'},null,{s:k},{key:k},{s:k});
		n-=1;
		if (n<=0) break;
	}
}
function testMultiline(){
	let d = mDiv(mBy('table'));
	mSize(d, 200, 200);
	mColor(d, 'orange');

	//let s=' hallo\n  das\n   ist\n    da'; //ok
	let s=' hallo\n\tdas\n   ist\n\t\tda';
	let dMulti = mMultiline(s,2,d); //ok

}
function testIndenting(){
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
	let html='';
	for (let i = 0; i < lines.length; i+=1) {
		let line = lines[i];
		let n=countIndent(line,4);
		console.log('_____________n='+n,line);
		//console.log('n',n);
		let x = spc.repeat(n) + line;
		html+=x+'<br>';
		console.log(x)
	}
	let d1 = mTextDiv(html, d)
}

function mMultiline(s,tabvalue,dParent,styles,classes){
	let spc = '&nbsp;';
	let lines = s.split('\n');
	let html='';
	for (let i = 0; i < lines.length; i+=1) {
		let line = lines[i];
		let n=countIndent(line,tabvalue);
		//console.log('_____________n='+n,line);
		let x = spc.repeat(n) + line;
		html+=x+'<br>';
	}
	let d1 = mTextDiv(html, dParent);
	if (isdef(styles)) mStyle(d1,styles);
	if (isdef(classes)) mClass(d1,...classes);


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
	if (nundef(RCREATE[n.type])) ui=mDefault(n,area,R);
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






