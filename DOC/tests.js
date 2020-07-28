
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
		console.log('_____________n='+n,line);
		let x = spc.repeat(n) + line;
		html+=x+'<br>';
	}
	let d1 = mTextDiv(html, dParent);
	if (isdef(styles)) mStyle(d1,styles);
	if (isdef(classes)) mClass(d1,...classes);


	return d1;
}







