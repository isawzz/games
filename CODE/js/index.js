function presentSpecDataDefsAsInConfig(SPEC, sData, DEFS) {
	let lst = ['type', '_id', '_ref', '_source', 'pool','source','content'];

	let d = mBy('SPEC');
	if (d && SHOW_SPEC) { mNode(SPEC, { dParent: d, listOfProps: lst }); } else { hide('contSPEC'); }

	d = mBy('SERVERDATA');
	if (d && SHOW_SERVERDATA) { mNode(sData, { dParent: d, listOfProps: lst }); } else { hide('contSERVERDATA'); }

	d = mBy('DEFS');
	if (d && SHOW_DEFS) { mNode(DEFS, { dParent: d, listOfProps: lst }); } else { hide('contDEFS'); }
}

function presentRoot(n,area) {
	let lst = ['type', '_id', '_ref', '_source', 'pool','source','content'];
	//show('contROOT');
	d = mBy(area);
	let level=0;

	let depth=10;
	let dLevel=[];
	for(let i=0;i<depth;i++){
		let d1=dLevel[i]=mDiv(d);
		mColor(d1,randomColor());

	}

	maxLevel=recPresent(n,0,dLevel,lst);
	console.log('tree has depth',maxLevel);

	console.log()
	mNode(n,{dParent:mBy('buttons'),listOfProps:lst});

}
function recPresent(n,level,dLevel,lst){
	let max=level;
	let n1={};
	let d=dLevel[level];
	for(const k of ['type','pool','oid','data','content']){
		if (isdef(n[k])){
			n1[k]=n[k];
		}
	}
	mNode(n1,{dParent:dLevel[level],listOfProps:lst});
	if (nundef(n.children)) return max;
	let newMax=0;
	for(const x of n.children){
		let newNewMax = max+recPresent(x,level+1,dLevel,lst);
		if (newNewMax>newMax) newMax=newNewMax;
	}
	return newMax;
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

