function t01_fractions(){
	console.log(math.add(math.fraction(0.1), math.fraction(0.2))) // Fraction, 0.3
	console.log(math.divide(math.fraction(0.3), math.fraction(0.2))) // Fraction, 1.5
	console.log(math.subtract(math.fraction(0.1), math.fraction(0.2))) // Fraction, 0.3
	
}
function t01_numbers() {
	var array1 = [0, 1, 2];
	var array2 = [3, 4, 5];
	let x=numbers.matrix.addition(array1, array2);
	console.log(x);
	numbers.matrix.transpose(x);
	console.log(numbers.prime.simple(171));

}
function t01_getTextForFraction() { mText('you have 5 ' + getTextForFraction(1, 2) + ' muffins', dTable, { fz: 100 }); }
async function t00_wpInstantiate() {
	let wp = await route_path_yaml_dict('../assets/math/allWP.yaml');
	let p = firstCond(wp, x => x.index == 40); // chooseRandom(arrTake(wp,24));
	instantiateWP(p);
}
async function t00_makeWordProblemsDict() { let wp = await makeWordProblemsDict(); }
async function t00_timitTests() {
	timit.show('*'); console.assert(isdef(DB));
	// test call here!
	timit.show('DONE')
}
async function t00_oldTests() {

	//test10_syms(); timit.show('DONE'); return;

	//let x='hallo'.substring(0,100); console.log('x',x)
	//saveListOfWords();//updateGroupInfo(); //updateSymbolDict();//addVocabTo2020Syms();	//addCatsToKeys();	//allWordsAndKeysLowerCase(); updateSymbolDict();
	//return;

	//let keys = ['fly']; //fromKeySet('nemo',9);
	//showPictureGrid(keys,dTable);return;

	//show('freezer');
	//console.log('English to German Nouns:', EdDict);
	//recomputeBestED();
	//generateWordFiles(); //step 1 works!!!
	//let symNew = await makeNewSyms(); downloadAsYaml(symNew,'symNew')
	//return;

	//console.log('hallo');	mText('&#129427;',dTable,{fz:100,family:'segoe UI symbol'}); 	return;
	//showPicsS(null, {}, {}, ['zebra'], ['zebra']); return;

	//test04_textItems(); return;
	//let x=substringOfMinLength(' ha a ll adsdsd',3,3);console.log('|'+x+'|');return;
	// test06_submit(); return;
	//addonScreen(); return;
	//onclick=()=>test05_popup('think about the passcode!',24001); return;
	//test05_popup(); return; //test04_blankPageWithMessageAndCountdownAndBeep();return;
	// test12_vizOperationOhneParentDiv(); return;
	//test12_vizNumberOhneParentDiv();return;
	//test12_vizArithop(); return;
	//test11_zViewerCircleIcon(); return;
	//test11_zItemsX(); return;
	//test03_maShowPictures(); return;
	//let keys = symKeysByType.icon;	keys=keys.filter(x=>x.includes('tower'));	console.log(keys);	iconViewer(keys);	return;

	//onClickTemple(); return;

}









