//#region addon funcs
function initAddons(){
	if (USE_ADDONS) {
		AD = { activeList: ['aPasscode','aAddress'] };
		AD.cl = {
			aPasscode: APasscode,
			aAddress: AAddress,
			aExercise: APasscode,
			aMeditation: APasscode,
		}
	}
}
function isTimeForAddon() {
	if (nundef(AD)) return false; //Username != 'nil' 
	if (nundef(AD.isActive)) AD.isActive = true; //starts with this setting!
	else if (AD.isActive == true) AD.isActive = false; //min 1 Q between addon runs
	else if (isdef(AD.instance)) AD.isActive = AD.instance.isTimeForAddon(); //once an addon has startet, it will set next time!
	//console.log('isTimeForAddon returns', AD.isActive);
	return AD.isActive;
}
function loadAddon(aKey){ copyKeys(DB.addons[aKey],AD);}
function selectAddon(){return 'aPasscode';}// aPasscode | aAddress
function exitToAddon(callback) {
	AD.callback = callback;
	enterInterruptState();
	if (nundef(AD.instance)) {
		let aKey = selectAddon();//'aAddress'; //chooseRandom(AD.activeList);
		loadAddon(aKey);
		AD.instance = new AD.cl[aKey]();
	}
	addonScreen();
	//console.log('Addon is',AD)
}
function deactivateAddon() { AD.instance.clear(); AD.instance = null; }
//#endregion

//addon ablauf:
function addonScreen() {
	show(mBy('dAddons'));
	let bg = colorTrans('silver',.25);
	if (nundef(AD.div)) AD.div = mScreen(mBy('dAddons'), { bg: bg, display: 'flex', layout: 'vcc' });
	let dContent = addonContentDiv(AD.hIntro); // mDiv(AD.div, { matop: 150, display: 'flex', layout: 'vcs', fg: 'contrast', fz: 24, bg:'navy', padding:25, w:'100vw' });
	AD.instance.present(dContent); // AD.instance.present(dContent);
}
function promptAddon() {
	//hier wird schon user gefragt um das password!!!	
	clearElement(AD.div);
	let dContent = addonContentDiv(AD.hPrompt); // mDiv(AD.div, { matop: 50, display: 'flex', layout: 'vcs', fg: 'contrast', fz: 24, bg:'navy', padding:25, w:'100vw'  });
	AD.instance.prompt(dContent);

}
function addonShowHint(written, spoken) {

	if (nundef(AD.dHint)) AD.dHint = mDiv(getContentDiv(), { fz: 24, h:28, bg:'green' });
	AD.dHint.innerHTML = written;
	if (isdef(spoken)) sayRandomVoice(spoken);
	//console.log(AD.dHint)
	return AD.dHint;
}
function addonActivateUi() {
	Selected = null;
	uiActivated = true;
	AD.instance.activate();
	//console.log('ui should be activated!!!')
}
function addonEvaluate() {
	//console.log('addonEvaluateddddddddddddddddddddddddddddddddddddddddddd');
	if (!uiActivated) return;
	uiActivated = false;
	//console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyeah', arguments)
	let isCorrect = AD.instance.eval(...arguments);
	if (isCorrect) {
		AD.instance.positive();
		resumeGame();
		//AD.callback();
	} else {
		AD.instance.negative();
		AD.instance.trialPrompt();
	}

}
function resumeGame() {
	//console.log('*** CLICK! *** ...resuming');
	auxOpen = false;
	//clearElement(AD.div)
	hide('dAddons');
	AD.instance.clear();
	AD.callback();
}



function showPasscodeAddress(dParent) {

	//brauche eine buchstbier function
	//brauche eine finction die nur die zahlen in einem satz buchstabiert
	//

	Goal = { label: '17448 NE 98th Way Redmond 98052' };
	Speech.setLanguage('E')
	let wr = 'your address is:';
	let sp = 'your address is 1 7 4 4 8 - North-East 98th Way - Redmond, 9 8 0 5 2';
	let d_title = mDiv(dParent, { fz: 12 });
	showInstruction(Goal.label, wr, d_title, true, sp, 12);
	let d_pics = mDiv(dParent);
	Goal.div = mText(Goal.label, d_pics, { fz: 40 });
	return d_pics;
}







//#region addon helpers


function showPasscode(dParent) {
	//console.log('KeySets',KeySets,KeySets.nemo);
	let keys = getRandomKeysFromGKeys(1); // choose(KeySets.nemo, 1);
	let res = getPictureItems(null, {}, { rows: 1 }, keys);
	Pictures = res.items;
	Goal = Pictures[0];

	console.log('Goal', Goal)

	let w = (Settings.language == 'E' ? 'the passcode' : 'das Codewort');
	let d_title = mDiv(dParent);
	showInstruction(Goal.label, w + (Settings.language == 'E' ? ' is' : ' ist'), d_title, true);

	let d_pics = mDiv(dParent);
	presentItems(Pictures, d_pics, res.rows);
	mRemoveClass(d_pics, 'flexWrap')
	return d_pics;
}
function addonContentDiv(hPercent=80){
	return mDiv(AD.div, { display: 'flex', 
	layout: 'vcs', fg: 'contrast', fz: 24, bg:'silver', patop:50, pabottom:50,matop:-50, w:'100vw' });
	// return mDiv(AD.div, { h:''+hPercent+'vh', matop:''+(100-hPercent)/3+'vh', display: 'flex', 
	// layout: 'vcs', fg: 'contrast', fz: 24, bg:'silver', patop:50, w:'100vw' });
}
function getContentDiv(){return AD.div.children[0];}
//#endregion









