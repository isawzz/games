var addonActive = true;

function isTimeForAddon() {
	if (Username == 'gul') return false;
	addonActive = (!addonActive);
	console.log('addonActive', addonActive); 
	return addonActive;
}
function exitToAddon(callback) {
	enterInterruptState();


	//here I must perform some kind of addon, eg., show some screen where user has to enter the passcode

	console.log('waiting for resume after addon...');
	show('freezer');
	mBy('freezer').onclick = null;
	mBy('freezer').onclick =  () => resumeGame(callback);//, mBy('freezer'), { position: 'fixed', fz: 60 });

}
function resumeGame(callback) {
	console.log('...resuming');
	auxOpen = false;
	hide('freezer')
	callback();
}















