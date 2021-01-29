function anim1(item, ms, callback) {

	//console.log(item,ms,callback)
	//let a = aTranslateBy(item.div, 100,100, ms);
	//let a = aRotate(item.div, ms);
	let a = aRotateAccel(item.div, ms);
	a.onfinish = callback;
}
function repDone(){console.log('DONE!!!');}

function presentAlternatives(){
	console.log('DONE!!!');
	showPicturesSpeechTherapyGames(null,
	{ border: '3px solid #ffffff80' },
	{ repeat: G.numRepeat, sameBackground: true });
}













