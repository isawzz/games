function presentSpecDataDefsAsInConfig(SPEC, sData, DEFS) {
	let lst = ['type', '_id', '_ref', '_source', 'pool', 'neutral', 'source', 'content', 'storage', 'buildings', 'hand'];
	let lstOmit = ['source'];

	// let d = mBy('SPEC');
	// console.log(d,SHOW_SPEC)
	// if (d && SHOW_SPEC) { mNodeFilter(SPEC, { dParent: d, lstFlatten: lst, omitProps: lstOmit }); } else { hide('contSPEC'); }

	d = mBy('SERVERDATA');
	if (d && SHOW_SERVERDATA) { mNodeFilter(sData, { dParent: d, lstFlatten: lst }); } else { hide('contSERVERDATA'); }

	d = mBy('DEFS');
	if (d && SHOW_DEFS) { mNodeFilter(DEFS, { dParent: d, lstFlatten: lst }); } else { hide('contDEFS'); }
}

function presentDictTree(nDict, uidStart, area, treeProperty, R, lf, ls, lo, styles) {
	if (nundef(nDict)) {
		console.log('presentDictTree: cannot present nDict!!!');
		return;
	}
	//console.log(nDict, '\nlf', lf, '\nls', ls, '\nlo', lo)
	d = mBy(area);

	let depth = 10;
	let dLevel = [];
	for (let i = 0; i < depth; i++) {
		let d1 = dLevel[i] = mDiv(d);
		mColor(d1, colorTrans('black', i * .1));
		if (isdef(styles)) mStyle(d1, styles);
	}

	maxLevel = 1 + recPresent(nDict[uidStart], 0, dLevel, nDict, treeProperty,
		{ lstFlatten: lf, lstShow: ls, lstOmit: lo });
}

function presentNodes(sp, area, lf, ls, lo) {
	for (const k in sp) {
		presentAddNode(sp[k], k, area, lf, ls, lo);
	}
}

function presentOidNodes(R, area, lf, ls, lo) {
	for (const oid in R.oidNodes) {
		for (const k in R.oidNodes[oid]) {
			presentAddNode(R.oidNodes[oid][k], oid, area, lf, ls, lo);
		}
	}
}
function presentAddNode(n, title, area, lf, ls, lo) {
	if (nundef(lo)) lo=[];
	addIf(lo,'act');
	addIf(lo,'ui');
	let d = isString(area) ? mBy(area) : area;
	mNodeFilter(n, { dParent: d, title: title, lstFlatten: lf, lstShow: ls, lstOmit: lo });
}
