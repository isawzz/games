function infoToItem(x) { return { info: x, key: x.key }; }
function detectItems(n){
	if (isNumber(n)) n=choose(SymKeys,n);
	if (isString(n[0])) n=n.map(x=>Syms[x]);
	if (nundef(n[0].info)) n=n.map(x=>infoToItem(x));
	return n;
}
function showPictureGrid(n=9,dParent,ifs={},options={}){
	//k could actually be number,key list,info list or item list
	let items = detectItems(n);
	console.log('items',items)
}




















