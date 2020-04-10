//#region functions that are deprecated but code might be reused
function presentObjectAsYamlIf(o,outerContName,innerContName,cond){
	//von frueher:
	// let d = mBy('SERVERDATA');
	// if (d && SHOW_SERVERDATA) { d.innerHTML = '<pre>' + jsonToYaml(sData) + '</pre>'; }
	// else {hide('contSERVERDATA');}

	let d = mBy(innerContName);
	if (d && cond) { d.innerHTML = '<pre>' + jsonToYaml(o) + '</pre>'; }
	else {hide(outerContName);}

}


























