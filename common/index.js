function presentSpecDataDefsAsInConfig(SPEC,sData,DEFS){
	let d = mBy('SPEC');
	if (d && SHOW_SPEC) { d.innerHTML = '<pre>' + jsonToYaml(SPEC) + '</pre>'; }
	else {hide('contSPEC');}
	d = mBy('DEFS');
	if (d && SHOW_DEFS) { d.innerHTML = '<pre>' + jsonToYaml(DEFS) + '</pre>'; }
	else {hide('contDEFS');}
	d = mBy('SERVERDATA');
	if (d && SHOW_SERVERDATA) { d.innerHTML = '<pre>' + jsonToYaml(sData) + '</pre>'; }
	else {hide('contSERVERDATA');}


}