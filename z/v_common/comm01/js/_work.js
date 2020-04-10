var buildingProcess = null;
var autoplay = false;
async function run00(sp, data) {
	//testLookupSetOverride(sp);

	buildingProcess = new mBuildingProcess(sp, data, DEFS, 'message','processed','dicts','forward', 'viewer', 'table1');

	let stage=0;
	while(stage != STAGES.static){
		stage = await onClickStep();
		//console.log(stage);
		if (!stage) break;
	}
	console.log('stage',stage);
	//await onClickStep();

	autoplay = false;
	while (autoplay) {
		let result = await onClickStep();
		autoplay = result;
	}

	//set default type


}