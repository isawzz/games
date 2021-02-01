var addonActive = true;
var dAddon;
var Password;
var CallbackAfterAddon;
var ActiveAddons = ['aPasscode'];
var Adinst;

function isTimeForAddon() {
	if (Username != 'nil' || isEmpty(ActiveAddons)) return false;
	addonActive = (!addonActive);
	//console.log('addonActive', addonActive);
	return addonActive;
}
function exitToAddon(callback) {
	CallbackAfterAddon = callback;
	enterInterruptState();

	let aKey = chooseRandom(ActiveAddons);
	Adinst = new Daat.AddonClasses[aKey]();

	addonScreen();
}
function addonScreen() {
	show(mBy('dAddons'));
	dAddon = mScreen(mBy('dAddons'), { bg: 'silver', fg: 'dimgray', fz: 24, display: 'flex', layout: 'vcs' });

	let dContent = mDiv(dAddon, { matop: 150, display: 'flex', layout: 'vcs' });
	Adinst.present(dContent);

}
function promptAddon() {
	
	console.log('hhhhhhhhhhhhhhhhhaaaaaaaaaaaaaaaaaaaaaaallllllllllllllloooooooooooooooo'); 

	clearElement(dAddon);
	let dContent = mDiv(dAddon, { matop: 50, display: 'flex', layout: 'vcs' });
	Adinst.prompt(dContent);
	return;

	console.log('enter the passcode now!!!');
	clearElement('dAddons');
	let keys = [Goal.key].concat(getRandomKeys(3));
	shuffle(keys);
	let iGoal = keys.indexOf(Goal.key);
	GroupCounter = 0;

	showPicturesSpeechTherapyGames(addonEvaluate, undefined, undefined, keys);
	//console.log('Pictures',Pictures);
	setGoal(iGoal);
	//console.log('Goal',Goal)
	let wort = (Settings.language == 'E' ? 'the passcode' : 'das Codewort');
	showInstruction('', 'click ' + wort + '!!!', dTitle, true);
	Pictures.map(x => x.div.style.cursor = 'pointer');
	addonActivateUi();


}
function addonActivateUi() {
	Selected = null;
	uiActivated = true;
	Adinst.activate();
}
function addonEvaluate(){
	if (!canAct()) return;
	uiActivated = false;
	let isCorrect = Adinst.eval(...arguments);
	if (isCorrect) Adinst.positive(); else Adinst.negative();

}


function showPasscode(dParent) {
	let keys = getRandomKeys(1);
	let res = getPictureItems(null, { border: '3px solid pink' }, { rows: 1 }, keys);
	Pictures = res.items;
	Goal = Pictures[0];

	let w = (Settings.language == 'E' ? 'the passcode' : 'das Codewort');
	let d_title = mDiv(dParent);
	showInstruction(Goal.label, w + (Settings.language == 'E' ? ' is' : ' ist'), d_title, true);

	let d_pics = mDiv(dParent);
	presentItems(Pictures, d_pics, res.rows);
	mRemoveClass(d_pics, 'flexWrap')
	return d_pics;
}


function showTest00() {
	mText('hallo1', dAddon);
	mText('hallo1', dAddon);
	mGap(dAddon, 100);
	// mText('_',dAddon,{fg:'transparent',h:100})
	//mLinebreak(dAddon,10);
	mText('hallo1', dAddon);

}
function resumeGame(callback) {
	console.log('*** CLICK! *** ...resuming');
	auxOpen = false;
	hide('dAddons')
	callback();
}















