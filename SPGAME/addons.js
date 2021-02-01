var addonActive = true;
var dAddon;
var Password;

function isTimeForAddon() {
	if (Username == 'gul') return false;
	addonActive = (!addonActive);
	console.log('addonActive', addonActive);
	return addonActive;
}
function exitToAddon(callback) {
	enterInterruptState();

	//here I must perform some kind of addon, eg., show some screen where user has to enter the passcode
	addonScreen();
	//if (isdef(callback)) mBy('freezer').onclick =  () => resumeGame(callback);//, mBy('freezer'), { position: 'fixed', fz: 60 });
}
function addonScreen() {
	//console.log('waiting for resume after addon...');

	show(mBy('freezer'));
	dAddon = mScreen(mBy('freezer'), { bg: 'silver', fg: 'dimgray', fz: 24, display: 'flex', layout: 'v' });

	showPasscode();//showTest00();


	let d_button = mDiv(dAddon);
	TOMain = setTimeout(anim1, 300, Goal, 500, () => {
		//mGap(dAddon,20);
		mButton('Got it!', null, d_button, { fz: 42, matop: 40 });
	});

}
function showTest00() {
	mText('hallo1', dAddon);
	mText('hallo1', dAddon);
	mGap(dAddon, 100);
	// mText('_',dAddon,{fg:'transparent',h:100})
	//mLinebreak(dAddon,10);
	mText('hallo1', dAddon);

}
function showPasscode() {
	let keys = getRandomKeys(1);
	let res = getPictureItems(null, { border: '3px solid pink' }, { rows: 1 }, keys);
	Pictures = res.items;

	Goal = Pictures[0];

	//mGap(dAddon, 120);

	let w = (Settings.language == 'E' ? 'the passcode' : 'das Codewort');
	let d_title = mDiv(dAddon);
	showInstruction(Goal.label, w + (Settings.language == 'E' ? ' is' : ' ist'), d_title, true);

	let d_pics = mDiv(dAddon);
	let res1=presentItems(Pictures, d_pics, res.rows);
	let dGrid = res1.dGrid;
	console.log(dGrid);
	mRemoveClass(dGrid,'mFflexWrap');
	let sz = res1.sz;
	console.log('gridSize',res1.sz);
	mRemoveClass(d_pics,'flexWrap')
	mSize(d_pics,sz.w,sz.h);

	let x=dGrid.parentNode;
	console.log(x);
	console.log(d_pics)
	//console.log(Pictures)
	//console.log('===>Goal',Goal);



}
function addonScreen_v0(callback) {
	//console.log('waiting for resume after addon...');

	show(mBy('freezer'));
	dAddon = mScreen(mBy('freezer'), { bg: 'silver', fg: 'blue', fz: 24, display: 'flex', layout: 'v' });
	mText('hallo1', dAddon);
	mText('hallo1', dAddon);
	mGap(dAddon, 100);
	// mText('_',dAddon,{fg:'transparent',h:100})
	//mLinebreak(dAddon,10);
	mText('hallo1', dAddon);

	if (isdef(callback)) mBy('freezer').onclick = () => resumeGame(callback);//, mBy('freezer'), { position: 'fixed', fz: 60 });

}
function resumeGame(callback) {
	console.log('*** CLICK! *** ...resuming');
	auxOpen = false;
	hide('freezer')
	callback();
}















