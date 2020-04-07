function testLookupAddToList(sp){
	let x=sp.ROOT;
	let q1=lookupAddToList(x,['panels',1,0],3);
	console.log(x,q1);
	return;

}

function testLookupSetOverride(sp){
	let x=sp.ROOT;
	let q1=lookupSetOverride(x,['panels',1,'_id'],3);
	console.log(x,q1);
	return;

}













//#region parse spec tests
function test00() {
	let gg = parseSpecRoot('table', SPEC, ['staticSpec', 'root00']);
	console.log(gg);

	let g1 = parseSpecRoot('market_loc_table', SPEC, ['staticSpec', 'rootloc']);
	console.log(g1);

}

function testLayout01() { let d = mBy('table'); mColor(d, 'blue'); }
