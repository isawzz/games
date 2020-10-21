function groupSizeTest() {
	//mach alle legalen records!
	let groupNames = Object.keys(symKeysBySet); //selectedEmoSetNames; //Object.keys(emoSets).map(x=>x.name);
	//console.log(groupNames);
	let groupDict = {};
	for (const name of groupNames) {
		let infolist = symListBySet[name];
		//console.log('group', name, 'has', infolist.length, 'entries')
		//groupDict[name]=emoSets[name];
	}
	//console.log('__________');
	let edict = {};
	for (const honame in higherOrderEmoSetNames) {
		let infolist = [];
		for (const name of (higherOrderEmoSetNames[honame])) {
			for (const k in symBySet[name]) {
				addIf(infolist, symbolDict[k]);
			}
			//groupDict[name]=emoSets[name];
		}
		edict[honame] = infolist;
		//console.log('group', honame, 'has', infolist.length, 'entries')
	}

	ensureSymByType();
	//edict.all = symListByType.emo;
	//console.log('group all has', edict.all.length, 'entries');
	//console.log(arrMinus(symListByType.emo,edict.all));
}
function getEmoSetWords(lang = 'E') {

	//console.log('emoGroup', emoGroup);
	if (nundef(emoGroup)) setGroup('animal');
	let key = chooseRandom(emoGroupKeys);

	//#region individual keys for test
	//key = 'fever'; //fever
	//key= 'onion'; //onion
	//key = 'mouse'; // mouse '1FA79'; //bandage '1F48E'; // gem '1F4E3';//megaphone '26BE'; //baseball '1F508'; //speaker low volume
	// key='baseball'; // baseball '26BD'; //soccer '1F988'; //shark '1F41C'; //ant '1F1E6-1F1FC';
	//key = 'adhesive bandage';
	//key = 'hippopotamus';
	// key = 'llama';
	//key = "chess pawn";
	//key='briefcase';
	//key = 'four-thirty';
	//key='chopsticks';
	//key='orangutan';
	//key = 'person with veil';
	//key='medal';
	//key='leopard';
	//key='telephone';
	//#endregion

	let info = jsCopy(picInfo(key));
	console.log(info);

	let valid, words;
	let oValid = info[lang + '_valid_sound'];
	if (isEmpty(oValid)) valid = []; else valid = sepWordListFromString(oValid, ['|']);
	let oWords = info[lang];
	if (isEmpty(oWords)) words = []; else words = sepWordListFromString(oWords, ['|']);
	//console.log('_____ oValid',oValid,'\noWords',oWords);

	let dWords = info.D;
	if (isEmpty(dWords)) dWords = []; else dWords = sepWordListFromString(dWords, ['|']);
	let dWordsShort = dWords.filter(x => x.length <= MAXWORDLENGTH);
	let eWords = info.E;
	if (isEmpty(eWords)) eWords = []; else eWords = sepWordListFromString(eWords, ['|']);
	let eWordsShort = eWords.filter(x => x.length <= MAXWORDLENGTH);

	//hier muss ich was tun!!!
	if (isEmpty(dWordsShort) || isEmpty(eWordsShort)) { delete emoGroupKeys[key]; return getEmoSetWords(); }

	words = isEnglish(lang) ? eWords : dWords;
	info.eWords = eWords;
	info.dWords = dWords;
	info.words = words;
	info.valid = valid;

	//console.log(words,eWords,dWords)

	return info;

}
function lastUnderMaxLength(lst) {
	console.log(lst)
	for (let i = lst.length - 1; i >= 0; i--) {
		if (lst[i].length <= MAXWORDLENGTH) return lst[i];
	}
	return last(lst);
}
function setLanguageWords(language, info) {

	let valid;
	let oValid = info[language + '_valid_sound'];
	if (isEmpty(oValid)) valid = []; else valid = sepWordListFromString(oValid, ['|']);

	info.words = matchingWords = isEnglish(language) ? info.eWords : info.dWords;
	console.log(matchingWords, getTypeOf(matchingWords))
	info.valid = validSounds = valid;

	bestWord = lastUnderMaxLength(matchingWords);

	bestWord = last(matchingWords);
	hintWord = '_'.repeat(bestWord.length);
	if (isdef(hintMessage)) clearElement(hintMessage);

	instructionMessage.innerHTML = getPrompt();

}
function setGroup(group) {
	console.log('setting group to', group)

	//unselect previous group button
	let button = mBy('b_' + emoGroup);

	if (isdef(button)) mClassRemove(button, 'selectedGroupButton');

	emoGroup = group;
	emoGroupKeys = [];

	//select new group button
	button = mBy('b_' + emoGroup);
	if (isdef(button)) mClass(mBy('b_' + emoGroup), 'selectedGroupButton');

	emoGroupKeys = jsCopy(symKeysBySet[emoGroup]);
}










