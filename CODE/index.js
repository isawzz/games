function presentSpecDataDefsAsInConfig(SPEC, sData, DEFS) {
	let lst = ['type', '_id', '_ref', '_source'];
	let className = 'node';

	let d = mBy('SPEC');
	if (d && SHOW_SPEC) { mNode(SPEC, d, lst, className); } else { hide('contSPEC'); }

	d = mBy('SERVERDATA');
	if (d && SHOW_SERVERDATA) { mNode(sData, d, lst, className); } else { hide('contSERVERDATA'); }

	d = mBy('DEFS');
	if (d && SHOW_DEFS) { mNode(DEFS, d, lst, className); } else { hide('contDEFS'); }


}
