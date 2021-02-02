function isTimeForAddon() {
	if (nundef(AD)) return false; //Username != 'nil' 
	if (nundef(AD.isActive)) AD.isActive = true; //starts with this setting!
	else if (AD.isActive == true) AD.isActive = false;
	else if (isdef(AD.instance)) AD.isActive = AD.instance.isTimeForAddon();
	console.log('isTimeForAddon returns',AD.isActive);
	return AD.isActive;
}
function deactivateAddon() { AD.instance.clear(); AD.instance = null; }

function exitToAddon(callback) {
	AD.callback = callback;
	enterInterruptState();
	if (nundef(AD.instance)) {
		let aKey = chooseRandom(AD.activeList);
		AD.instance = new AD.cl[aKey]();
	}
	addonScreen();
}
function addonScreen() {
	show(mBy('dAddons'));
	AD.div = mScreen(mBy('dAddons'), { bg: 'silver', fg: 'dimgray', fz: 24, display: 'flex', layout: 'vcs' });
	let dContent = mDiv(AD.div, { matop: 150, display: 'flex', layout: 'vcs' });
	AD.instance.present(dContent);
}
function promptAddon() {
	//hier wird schon user gefragt um das password!!!	
	//console.log('hhhhhhhhhhhhhhhhhaaaaaaaaaaaaaaaaaaaaaaallllllllllllllloooooooooooooooo'); 

	clearElement(AD.div);
	let dContent = mDiv(AD.div, { matop: 50, display: 'flex', layout: 'vcs' });
	AD.instance.prompt(dContent);

}
function addonActivateUi() {
	Selected = null;
	uiActivated = true;
	AD.instance.activate();
	console.log('ui should be activated!!!')
}
function addonEvaluate() {
	//console.log('addonEvaluate');
	if (!uiActivated) return;
	uiActivated = false;
	console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyeah', arguments)
	let isCorrect = AD.instance.eval(...arguments);
	if (isCorrect) {
		AD.instance.positive();
		resumeGame();
		//AD.callback();
	} else {
		AD.instance.negative();
		addonTrialPrompt(0);
	}

}
function resumeGame() {
	console.log('*** CLICK! *** ...resuming');
	auxOpen = false;
	hide('dAddons')
	AD.callback();
}
function addonHint(i, dParent) {
	let pwd = Goal.label;

}


function showPasscode(dParent) {
	//console.log('KeySets',KeySets,KeySets.nemo);
	let keys = choose(KeySets.nemo, 1);
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
	mText('hallo1', AD.div);
	mText('hallo1', AD.div);
	mGap(AD.div, 100);
	// mText('_',AD.div,{fg:'transparent',h:100})
	//mLinebreak(AD.div,10);
	mText('hallo1', AD.div);

}















