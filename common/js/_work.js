var buildingProcess = null;
var autoplay = false;
async function run00(sp, data) {
	//testLookupSetOverride(sp);

	buildingProcess = new mBuildingProcess(sp, data, DEFS, 
		'message','protos','dicts','forward', 'backward','tree', 'table1');
	//return;
	let stage=0;
	while(stage != STAGES.backward){
		stage = await onClickStep();
		//console.log(stage);
		if (!stage) break;
	}
	console.log('stage',stage);
}

function recModTypeToString(n){
	if (isList(n)){n.map(x=>recModTypeToString(x));}
	else if (isDict(n)){
		if(isdef(n.type)){n.type=n.type.join(' ');}
		for(const k in n){recModTypeToString(n[k]);}
	}
}
function findKey(dict,val){for(const k in dict){if (dict[k]==val) return k;}}