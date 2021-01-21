
function getColorDictColor(c) { return isdef(ColorDict[c]) ? ColorDict[c].c : c; }

function showCards52(arr){
	let items = arr.map(x=>Card52.getItem(x));

	console.log(items)
}
function splayout(items,dParent,containerStyles={bg:GREEN,rounding:12,padding:10},overlap='20%',orientation='h'){
	//phase 1: schon gemacht!
	//phase 2: items are sized and row,col (das ist aber nur fuer grid layout!)
	//supposedly, items should have div,w,h
	//phase 3: prep container for items!
	let d=mDiv(dParent,containerStyles);
	


}






