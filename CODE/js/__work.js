var R = null;
function run02(sp, defaults, sdata) {

	R = new RSG(sp, defaults, sdata);

	R.gen1();

	presentGeneration(R.lastGen(),'results');
	presentServerData(sData,'addedData');

	//first, sources are made for each sp object


}




