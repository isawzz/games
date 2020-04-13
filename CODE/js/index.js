function presentSpecDataDefsAsInConfig(SPEC, sData, DEFS) {
	let lst = ['type', '_id', '_ref', '_source'];

	let d = mBy('SPEC');
	if (d && SHOW_SPEC) { mNode(SPEC, {dParent:d, listOfProps:lst}); } else { hide('contSPEC'); }

	d = mBy('SERVERDATA');
	if (d && SHOW_SERVERDATA) { mNode(sData, {dParent:d, listOfProps:lst}); } else { hide('contSERVERDATA'); }

	d = mBy('DEFS');
	if (d && SHOW_DEFS) { mNode(DEFS, {dParent:d, listOfProps:lst}); } else { hide('contDEFS'); }
}
function presentGeneration(sp, area) {
	let d = mBy(area);
	//console.log(d)
	for (const [k, v] of Object.entries(sp)) {
		mNode(v, { title: k, dParent: d, listOfProps: ['type', 'source', 'pool']});
	}
}

function presentServerData(sdata, area) {
	let d = mBy(area);
	clearElement(d);
	//console.log(d)
	for (const [k, v] of Object.entries(sdata)) {
		mNode(v, { title: k, dParent: d, omitEmpty: true });
	}
}

