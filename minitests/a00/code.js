var buildingProcess = null;
var autoplay = false;
async function a00(sp, data) {

	//prelim: select active nodes: for now all nodes are selected
	//using meta info

	//start at ROOT node

	buildingProcess = new mBuildingProcess(sp, data, DEFS, 'message','processed','dicts', 'viewer', 'table1');

	await onClickStep();
	await onClickStep();

	autoplay = false;
	while (autoplay) {
		let result = await onClickStep();
		autoplay = result;
	}

	//set default type


}