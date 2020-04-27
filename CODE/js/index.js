function presentSpecDataDefsAsInConfig(SPEC, sData, DEFS) {
	let lst = ['type', '_id', '_ref', '_source', 'pool', 'neutral', 'source', 'content', 'storage', 'buildings', 'hand'];
	let lstOmit = ['source'];

	let d = mBy('SPEC');
	if (d && SHOW_SPEC) { mNode(SPEC, { dParent: d, listOfProps: lst, omitProps: lstOmit }); } else { hide('contSPEC'); }

	d = mBy('SERVERDATA');
	if (d && SHOW_SERVERDATA) { mNode(sData, { dParent: d, listOfProps: lst }); } else { hide('contSERVERDATA'); }

	d = mBy('DEFS');
	if (d && SHOW_DEFS) { mNode(DEFS, { dParent: d, listOfProps: lst }); } else { hide('contDEFS'); }
}

function presentRoot(n, area) {
	let lstFlatten = ['type', 'pool', 'source', 'data', 'content'];
	let lstShow = ['type', 'oid', 'data', 'content', 'pool'];
	let lstOmit = ['bi', 'panels', '_id', '_ref', 'children', 'source', 'specKey', 'params', 'cssParams', 'typParams', 'stdParams', 'uid', 'ui'];
	//show('contROOT');
	d = mBy(area);
	let level = 0;
	let depth = 10;
	let dLevel = [];
	for (let i = 0; i < depth; i++) {
		let d1 = dLevel[i] = mDiv(d);
		mColor(d1, colorTrans('black', i * .1));
	}

	maxLevel = 1 + recPresentFilter(n, 0, dLevel, { lstFlatten: lstFlatten, lstShow: lstShow, lstOmit: lstOmit });
	//console.log('tree has depth',maxLevel);

	removeInPlace(lstOmit,'children');
	showNodeInfo(R.ROOT,'root',null,lstOmit);

	//console.log()
	//let longRoot = mNode(n, { dParent: mBy('buttons'), listOfProps: lstFlatten, omitProps: lstOmit });
	//mFont(longRoot,10);
}

function presentGenerations(indices,area,R){
	d = mBy(area);
	let level = 0;
	let depth = 10;
	let dLevel = [];
	for (let i = 0; i < depth; i++) {
		let d1 = dLevel[i] = mDiv(d);
		mSize(d1,'100%','auto');
		mFlexWrap(d1)
		mColor(d1, colorTrans('black', i * .1));
	}

	let di=0;
	for(const i of indices){
		let div = dLevel[di];di++;
		presentGeneration(R.gens[i],div);
	}
}

function presentGeneration(n, area) {
	let lstFlatten = ['type', 'pool', 'source', 'data', 'content'];
	let lstShow = ['type','cond', 'oid', 'data', 'content', 'pool', 'panels','_id','uid'];
	let lstOmit = ['bi', '_ref', 'source', 'specKey', 'params', 'cssParams', 'typParams', 'stdParams', 'ui'];
	let d = isString(area)? mBy(area):area;

	console.log(n)
	for (const k in n){
		mNodeFilter(n[k],{dParent:d,title:k,lstFlatten:lstFlatten,lstShow:lstShow,lstOmit:lstOmit});
	}
	// for (const [k, v] of Object.entries(n)) {
	// 	maxLevel = 1 + recPresentFilter(n, 0, d, { lstFlatten: lstFlatten, lstShow: lstShow, lstOmit: lstOmit });
	// }
}

