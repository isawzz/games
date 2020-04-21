

function deepmergeTest(){
	//=> all 3 objects are different copies!!!
	let o1={a:1,c:1};
	let o2={a:2,b:2};

	let o3=deepmerge(o1,o2);
	logVals('___\no1',o1);	logVals('o2',o2);	logVals('o3',o3);

	o1.a=11;
	logVals('___\no1',o1);	logVals('o2',o2);	logVals('o3',o3);

	o2.a=22;
	logVals('___\no1',o1);	logVals('o2',o2);	logVals('o3',o3);

	o3.a=33;
	logVals('___\no1',o1);	logVals('o2',o2);	logVals('o3',o3);
}
function logVals(title,o){
	let s=title+':  ';
	for(const k in o){s+=k+':'+o[k]+' ';}
	console.log(s);
}
















