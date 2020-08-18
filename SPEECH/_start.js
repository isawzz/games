window.onload = SPEECHStart;

function mPara(txt,parent){
	let p=mCreate('p');
	p.innerHTML=txt;
	if (isdef(parent)) mAppend(parent,p);
	return p;
}
function test01(){
	let em='🖱️';
	em='&#x1F5B1;';
	em = String.fromCodePoint(0x1F5B1);
	let table=mBy('table');
	table.style.backgroundColor='red';
	//mTextDiv('hallo',table);
	table.style.fontSize='100px';
	mTextDiv(em,table);
	mPara(em,table);
	// let p=mCreate('p');
	// p.innerHTML = em;
	// mInsertFirst(table,p);
	// p.style.fontSize='68pt';
	return;
}
function test02(){
	let k='1F5B1';
	let d=mBy('table');
	//d.style.fontSize='100pt';
	let x=mEmoTrial2('computer mouse',table,{align:'center',width:250,border:'4px solid red',rounding:14,bg:'yellow',fontSize:50});
}
async function SPEECHStart() {
	//let x='hal_l_'.indexOf('_');	console.log(x);return;

	await loadAssets();
	// test02();return;

	// let x=multiSplit('hallo-das ist! ein string',[' ','-','!']);
	// console.log(x)

	console.log('WAAAAAAAAAAAAAAAAAAAAAAAAAS?')
	//testSidebar();
	// let x=simpleWordListFromString('" hallo das, ist gut');
	// console.log(x);	return;
	//console.log(emojiChars)
	addEventListener('keyup', keyUpHandler);
	testSpeech();
}
function keyUpHandler(ev) {
	//console.log('key released!', ev);
	console.log('*** keyUpHandler: status',status,'key',ev.keyCode, 'input vis',isdef(inputBox)?isVisible(inputBox):'no','mode',interactMode)
	if (ev.keyCode == '13' && interactMode == 'write' && !isVisible(inputBox)) {
		console.log('******* FIRING!!!!!!!!!!!!!!!!!!!!')
		fireClick(mBy('bStart'));
		//nextWord();// && isButtonActive()) { fireClick(mBy('bStart')); }
	}
	//if (ev.keyCode == '13' && status=='wait' && !pauseAfterInput) nextWord();// && isButtonActive()) { fireClick(mBy('bStart')); }
	 //if (ev.keyCode == '13' && isButtonActive()) { nextWord();}//fireClick(mBy('bStart')); }
}













