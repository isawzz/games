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
	let lstShow = ['type', 'pool', 'oid', 'data', 'content'];
	let lstOmit = ['source', '_id', '_ref', '_source', 'uid'];
	//show('contROOT');
	d = mBy(area);
	let level = 0;

	let depth = 10;
	let dLevel = [];
	for (let i = 0; i < depth; i++) {
		let d1 = dLevel[i] = mDiv(d);
		mColor(d1, colorTrans('black',.3));// randomColor());

	}

	maxLevel = 1 + recPresent(n, 0, dLevel, lstFlatten, lstShow);
	//console.log('tree has depth',maxLevel);

	//console.log()
	//let longRoot = mNode(n, { dParent: mBy('buttons'), listOfProps: lstFlatten, omitProps: lstOmit });
	//mFont(longRoot,10);
}
function filterByKey(o, desiredKeys) {
	let o1 = {};
	for (const k of desiredKeys) {
		if (isdef(o[k])) {
			o1[k] = o[k];
		}
	}
	return o1;
}
function recPresent(n, level, dLevel, lstFlatten, lstShow) {
	let n1 = filterByKey(n, lstShow); // ['type', 'pool', 'oid', 'data', 'content']);
	// let n1={};
	// for(const k of ['type','pool','oid','data','content']){
	// 	if (isdef(n[k])){
	// 		n1[k]=n[k];
	// 	}
	// }
	//let d=dLevel[level];
	mNode(n1, { dParent: dLevel[level], listOfProps: lstFlatten });
	if (nundef(n.children)) return level;
	let max = 0;
	for (const x of n.children) {
		let newMax = recPresent(x, level + 1, dLevel, lstFlatten, lstShow);
		if (newMax > max) max = newMax;
	}
	return max;
}

function presentGeneration(sp, area) {
	let d = mBy(area);
	//console.log(d)
	for (const [k, v] of Object.entries(sp)) {
		mNode(v, { title: k, dParent: d, listOfProps: ['type', 'source', 'pool'] });
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

