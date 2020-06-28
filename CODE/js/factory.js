function makeRandomTree(){
	let r={rNodes:{},uiNodes:{},defs:DEFS};
	let n = r.tree = addRandomNode(null,r);
	recPopulateTree(n,r,3);
	return r;
}
function makeTree33(){
	let r={rNodes:{},uiNodes:{},defs:DEFS};
	let n = r.tree = addRandomNode(null,r);
	
	let n1;
	for(let i=0;i<3;i++){
		n1=addRandomNode(n,r);
	}
	for(let i=0;i<3;i++){
		addRandomNode(n1,r);
	}

	return r;
}
function makeSimplestTree(){
	let r={rNodes:{},uiNodes:{},defs:DEFS};
	let n = r.tree = addRandomNode(null,r);
	addRandomNode(n,r);
	return r;
}














