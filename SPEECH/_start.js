window.onload = SPEECHStart;
var timit;

function multiSplit(s,seplist){
	let res = [s];
	for(const sep of seplist){
		let resNew = [];
		for(const s1 of res){
			let parts= s1.split(sep);
			resNew= resNew.concat(parts);
		}
		res = resNew;
	}
	return res.filter(x=>!isEmpty(x));
}

async function SPEECHStart() {
	await loadAssets();

	// let x=multiSplit('hallo-das ist! ein string',[' ','-','!']);
	// console.log(x)

	//console.log('WAAAAAAAAAAAAAAAAAAAAAAAAAS?')
	//testSidebar();
	// let x=simpleWordListFromString('" hallo das, ist gut');
	// console.log(x);	return;
	testSpeech(); 
}













