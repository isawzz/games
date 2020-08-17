window.onload = SPEECHStart;

async function SPEECHStart() {


	//let x='hal_l_'.indexOf('_');	console.log(x);return;

	await loadAssets();

	// let x=multiSplit('hallo-das ist! ein string',[' ','-','!']);
	// console.log(x)

	//console.log('WAAAAAAAAAAAAAAAAAAAAAAAAAS?')
	//testSidebar();
	// let x=simpleWordListFromString('" hallo das, ist gut');
	// console.log(x);	return;
	//console.log(emojiChars)
	addEventListener('keyup', keyUpHandler);
	testSpeech();
}
function keyUpHandler(ev) {
	//console.log('key released!', ev);
	console.log('*** keyUpHandler: status',status,'key',ev.keyCode, 'input vis',isVisible(inputBox),'mode',interactMode)
	if (ev.keyCode == '13' && interactMode == 'write' && !isVisible(inputBox)) {
		fireClick(mBy('bStart'));
		//nextWord();// && isButtonActive()) { fireClick(mBy('bStart')); }
	}
	//if (ev.keyCode == '13' && status=='wait' && !pauseAfterInput) nextWord();// && isButtonActive()) { fireClick(mBy('bStart')); }
	 //if (ev.keyCode == '13' && isButtonActive()) { nextWord();}//fireClick(mBy('bStart')); }
}













