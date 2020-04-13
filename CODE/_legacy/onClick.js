function onClickSizeBig() { let d = mBy('table'); mSize(d, 700, 500); mColor(d, 'blue'); }
function onClickSizeSmall() { let d = mBy('table'); mSize(d, 400, 300); mColor(d, 'blue'); }
async function onClickStep(){
	//console.log('click')
	return;
	if (buildingProcess) {
		let state = await buildingProcess.step();
		//console.log('.');
		return state;
	}
	return false;
}