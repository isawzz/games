function isTimeForAddon(){return false; }//G.id!='gPasscode';}// false;}
function exitToAddon(callback){
	enterInterruptState();
	

	//here I must perform some kind of addon, eg., show some screen where user has to enter the passcode

	console.log('waiting for resume after addon...');
	setTimeout(()=>resumeGame(callback),2000);
}
function resumeGame(callback){
	auxOpen=false;
	callback();
}















