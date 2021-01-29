function showGotItButton() {
	mLinebreak(dTable);
	mButton('Got it!', doOtherStuff, dTable, { fz: 42 });
}
function doOtherStuff() {
	// test04_subGame();	
	//test04_justABlankPage();
	test04_blankPageWithMessageAndCountdown('think about the passcode!');
}

var AUTIOCONTEXT=new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em

function beep(vol, freq, duration){
  v=a.createOscillator()
  u=a.createGain()
  v.connect(u)
  v.frequency.value=freq
  v.type="square"
  u.connect(a.destination)
  u.gain.value=vol*0.01
  v.start(a.currentTime)
  v.stop(a.currentTime+duration*0.001)
}
function test04_blankPageWithMessageAndCountdown(msg) {
	show(mBy('dExperiment')); //show a freezer
	let d = mBy('dExpContent');
	clearElement(d);
	mText(msg, d, { family: 'AlgerianRegular', fz: 36, fg: 'indigo' });
	mLinebreak(d);
	let d1 = mDiv(d, { fg: 'black', bg: 'red', align: 'center' });
	//let cd = new CountdownTimer(G.timeout, d1, backToPasscode);
	if (nundef(TOList)) TOList = {};
	startTimeCD(d1,G.timeout,backToPasscode);
	//show countdown timer!
	// setTimeout(backToPasscode, G.timeout);
}
function test04_blankPageWithMessage(msg) {
	show(mBy('dExperiment')); //show a freezer
	let d = mBy('dExpContent');
	clearElement(d);
	mText(msg, d, { family: 'AlgerianRegular', fz: 36, fg: 'indigo' });
	//show countdown timer!
	setTimeout(backToPasscode, G.timeout);
}
function test04_justABlankPage() {
	show(mBy('dExperiment')); //show a freezer
	let d = mBy('dExpContent');
	clearElement(d);
	mText('think about the passcode!', d, { family: 'AlgerianRegular', fz: 36, fg: 'indigo' });
	//show countdown timer!
	setTimeout(backToPasscode, G.timeout);
}
function getRandomKeys(n) { return choose(G.keys, n); }
function backToPasscode() {
	hide('dExperiment')
	console.log('enter the passcode now!!!');
	//need to add more pictures
	//need to remove the button! 
	clearElement(dTable);
	let keys = [Goal.key].concat(getRandomKeys(G.numPics));
	shuffle(keys);
	let iGoal = keys.indexOf(Goal.key);
	GroupCounter = 0;

	showPicturesSpeechTherapyGames(evaluate, undefined, undefined, keys);
	//console.log('Pictures',Pictures);
	setGoal(iGoal);
	//console.log('Goal',Goal)
	let wort = (Settings.language == 'E' ? 'the passcode' : 'das Codewort');
	showInstruction('', 'click ' + wort + '!!!', dTitle, true);
	Pictures.map(x => x.div.style.cursor = 'pointer')
	activateUi();

}
function onClickExperiment() {
	console.log('clicked on experimental screen!!!')
}



function test04_subGame() {
	//play one of the other games with special settings
	Data = { settings: jsCopy(Settings), user: jsCopy(U) };

	setRandomGameRound()

	U.avGames = ['gTouchPic', 'gAbacus'];
	console.log('Settings', Settings, '\nU', U);
	U.lastGame = 'gTouchPic';
	setGame(U.lastGame);
	Settings.samplesPerGame = 1;
	Settings.minutesPerUnit = .05;
	startGame();
	//problem ist: every time


}




























function maShowCards(keys, labels, dParent, onClickPictureHandler, { showRepeat, containerForLayoutSizing, lang, border, picSize, bgs, colorKeys, contrast, repeat = 1, sameBackground, shufflePositions = true } = {}, { sCont, sPic, sText } = {}) {
	Pictures = [];

	//zInno('Steam Engine',dParent); return;

	keys = zInnoRandom(10); // ['Gunpowder']; //zInnoRandom(10); 
	keys.map(x => zInno(x, dParent)); //console.log(keys); 	

	let cards = [];
	for (const k of keys) {
		let card = zInno(k, dParent);
		cards.push(card);
		zMeasure(card);
	}

	//test09_zViewer(); return;;
	//test10_zViewerClockCrownFactory(); return;
	//test08_towerAndOtherSymbols(dParent); return;
	//test07_showDeck(dParent);
	//test06_showCards(dParent); 
	//test05_ElectricitySuburbia(dParent);
	//test04_Electricity(dParent); return;
	//test03_lighbulb(dParent); return;
	//test00_oldMaPic(dParent); 
	//test02_zPic(dParent);test01_oldMaPicAusgleichVonPadding(dParent); return;
	// let c=card52();	console.log(c);	
	// showSingle52(dParent);


	//showAllInnoCards(dParent);

	return;

	mLinebreak(dParent);

	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'green' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'blue' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'yellow' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'purple' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
}






