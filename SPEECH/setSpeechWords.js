function getColoredHearts() {
	let m = [
		{ key: 'red heart', words: ['red', 'love', 'heart'] },
		{ key: 'blue heart', words: ['blue', 'love', 'heart'] },
		{ key: 'green heart', words: ['green', 'love', 'heart'] },
	];
	let choice = chooseRandom(m);
	choice.lang = 'E';
	return choice;
}
function getGermanAnimals() {
	let m = tiere;
	let choice = chooseRandom(m);
	if (nundef(choice.words)) choice.words = [choice.key];
	choice.words = choice.words.map(x => capitalize(x));
	choice.lang = 'D';
	return choice;
}
function allEnglishWords() {
	// let os=takeFromTo(emojiChars,100,103);let o = os[0];

	let key = chooseRandomKey(isdef(emoGroup) ? emoDict : emojiChars);
	//key='1F1E6-1F1FC';
	let o = emojiChars[key];
	console.log('_________\nkey',key,'\no',o)
	let toBeRemoved = ['marine', 'forest', 'mammal', 'medium', 'parts', 'medium-light', 'medium-dark', 'dark', 'light', 'skin', 'tone', 'on', 'button'];
	toBeRemoved.push(emoGroup.toLowerCase());

	let anno = o.annotation;
	anno = stringBefore(anno, ':');
	if (anno.length>MAXWORDLENGTH){
		console.log('problem word:',anno,key,o)
	}

	let tags = sepWordListFromString(o.tags, [' ', ',']);
	let etags = sepWordListFromString(o.openmoji_tags, [' ', ',']);
	let other = sepWordListFromString(anno, [' ', ',']);
	let subgroups = [];//sepWordListFromString(o.subgroups, [' ', ',', '-']);

	let words = union(union(union(subgroups, etags), other), tags);
	addIf(words, anno);
	words = words.filter(x => !toBeRemoved.includes(x.toLowerCase()));
	words = words.map(x => x.replace(':', ''));

	words = words.filter(x => x.length <= MAXWORDLENGTH);
	if (isEmpty(words)) { delete emoDict[key]; return allEnglishWords(); }
	return { words: words, key: o.annotation, lang: 'E' };

}
function getEmoSetWords_dep(lang='E') {
	let key = chooseRandomKey(isdef(emoGroup) ? emoDict : emojiChars);

	//key = '1F5B1'; // mouse '1FA79'; //bandage '1F48E'; // gem '1F4E3';//megaphone '26BE'; //baseball '1F508'; //speaker low volume
	// key='26BE'; // baseball '26BD'; //soccer '1F988'; //shark '1F41C'; //ant '1F1E6-1F1FC';
	let o = emojiChars[key];
	//console.log('_________\nkey',key,'\no',o)
	//console.log('_________\nkey',key,'\no',o)
	let toBeRemoved = ['marine', 'forest', 'mammal', 'medium', 'parts', 'medium-light', 'medium-dark', 'dark', 'light', 'skin', 'tone', 'on', 'button'];
	toBeRemoved.push(emoGroup.toLowerCase());

	let oValid=o[lang+'_valid_sound'];
	//console.log('_____ oValid',oValid);
	let valid;
	if (isEmpty(oValid)) valid = []; else valid = sepWordListFromString(o[lang+'_valid_sound'], ['|']);
	//valid=isEmpty(valid)?[]:[valid];
	//console.log('valid sound',valid);

	let words=[];//isEmpty(valid)?[]:[valid];
	if (isEnglish(lang)){
		//console.log('o.E',o.E,'\no.D',o.D)

		words = words.concat(sepWordListFromString(o.E, ['|']));
	} else words = words.concat(sepWordListFromString(o.D, ['|']));

	words = words.filter(x => x.length <= MAXWORDLENGTH);
	if (isEmpty(words)) { delete emoDict[key]; return getEmoSetWords(); }
	return { valid: valid, words: words, key: o.annotation, lang: lang, record: o };

}

function groupSizeTest(){
	//mach alle legalen records!
	let groupNames = selectedEmoSetNames; //emoSets.map(x=>x.name);
	console.log(groupNames);

}

function getEmoSetWords(lang='E') {


	if (isdef(emoGroup)){
		let keys =Object.keys(emoDict);
		console.log(keys);
		//if 
	}
	let key = chooseRandomKey(isdef(emoGroup) ? emoDict : emojiChars);

	//key = '1F5B1'; // mouse '1FA79'; //bandage '1F48E'; // gem '1F4E3';//megaphone '26BE'; //baseball '1F508'; //speaker low volume
	// key='26BE'; // baseball '26BD'; //soccer '1F988'; //shark '1F41C'; //ant '1F1E6-1F1FC';
	let o = emojiChars[key];
	
	//console.log('_________\nkey',key,'\no',o)

	let valid,words;
	let oValid = o[lang+'_valid_sound'];
	if (isEmpty(oValid)) valid = []; else valid = sepWordListFromString(oValid, ['|']);
	let oWords = o[lang];
	if (isEmpty(oWords)) words = []; else words = sepWordListFromString(oWords, ['|']);
	//console.log('_____ oValid',oValid,'\noWords',oWords);

	let dWords = o.D;
	if (isEmpty(dWords)) dWords = []; else dWords = sepWordListFromString(dWords, ['|']);
	dWords = dWords.filter(x => x.length <= MAXWORDLENGTH);
	let eWords = o.E;
	if (isEmpty(eWords)) eWords = []; else eWords = sepWordListFromString(eWords, ['|']);
	eWords = eWords.filter(x => x.length <= MAXWORDLENGTH);

	//cond
	if (isEmpty(dWords)||isEmpty(eWords)) { delete emoDict[key]; return getEmoSetWords(); }

	words = isEnglish(lang)?eWords:dWords;

	return { valid: valid, words: words,D:dWords,E:eWords, key: o.annotation, lang: lang, record: o };

}
function setLanguageWords(language,record){

	//console.log('record',record,'language',language)

	let valid;
	let oValid = record[language+'_valid_sound'];
	if (isEmpty(oValid)) valid = []; else valid = sepWordListFromString(oValid, ['|']);
	// let oWords = o[lang];
	// if (isEmpty(oWords)) words = []; else words = sepWordListFromString(oWords, ['|']);
	//console.log('_____ oValid',oValid);//,'\noWords',oWords);

	matchingWords = isEnglish(language)?record.eWords:record.dWords;
	validSounds = valid;
	bestWord = last(matchingWords);
	hintWord = '_'.repeat(bestWord.length);
	if (isdef(hintMessage)) clearElement(hintMessage);
	
}
function setSpeechWords(lang='E') {
	let table = mBy('table');
	clearElementFromChildIndex(table, 4);
	//clearElement(table);

	//hier kommen {words,key,lang} 
	let data = getEmoSetWords(lang);// getGermanAnimals | getColoredHearts
	//console.log('example data:', data.words)

	lang = data.lang;
	matchingWords = data.words;
	validSounds = data.valid;
	bestWord = last(matchingWords);
	hintWord = '_'.repeat(bestWord.length);
	currentRecord = data.record;

	//picture
	let e = mEmoTrial2(data.key, table, {"font-size":200}); //,bg:'green'});
	//e.style.color = 'red';
	mFlexLinebreak(table);

	//hint
	hintMessage = mHeading('', table, 1, 'hint');
	hintMessage.style.fontSize = '40pt';
	mFlexLinebreak(table);

	//prompt = feedback
	let msg = getPrompt();
	instructionMessage = mInstruction(msg, table);
	// if (isEnglish(lang)) {
	// 	if (interactMode == 'speak') instructionMessage = mInstruction('Say the word in English', table);
	// 	else instructionMessage = mInstruction('Type the word in English', table);
	// } else {
	// 	if (interactMode == 'speak') instructionMessage = mInstruction('Sag das Wort auf Deutsch', table);
	// 	else instructionMessage = mInstruction("Schreib' das Wort auf Deutsch", table);
	// }
	mFlexLinebreak(table);

	inputBox = mCreate('input');
	inputBox.id = 'inputBox';
	inputBox.style.fontSize = '20pt';
	//const node = document.getElementsByClassName("input")[0];
	inputBox.addEventListener("keyup", function (event) {
		//event.stopPropagation = true;
		if (pauseAfterInput) event.cancelBubble = true;
		//console.log(event);
		if (event.key === "Enter") {
			let word = finalResult = inputBox.value;
			answerCorrect = evaluateAnswer(word);
			setStatus('result');
			// setStatus('result');
			// console.log('Result received: ' + word); // + '.\nConfidence: ' + event.results[0][0].confidence);
			inputBox.value = '';
			if (answerCorrect) {
				hide(inputBox);
				//hide(hintMessage);
				nextWord();
			} else if (hintWord == bestWord) {
				console.log('==>', answerCorrect, '\nwords', matchingWords, '\nbest', bestWord, '\ngot', word); // + '.\nConfidence: ' + event.results[0][0].confidence);
				hide(inputBox);
				nextWord();
			} else {
				nextWord(false);
			}
		}
	});
	mAppend(table, inputBox);

	//console.log('interactMode',interactMode)
	if (interactMode == 'speak') {
		hide(inputBox);
	} else {
		inputBox.focus();
	}

	feedbackMessage = instructionMessage; //mHeading('', table, 2, 'feedback');



}



function setGroup(group) {
	//console.log('setting group to',group)
	emoGroup = group.toUpperCase();
	let f = firstCond(emoSets, x => x.name == group).f;
	//console.log(emoGroup)
	emoDict = {};
	for (const k in emojiChars) {
		let o = emojiChars[k];

		if (nundef(o.group)) continue;
		let passt = f(o);
		if (!passt) continue;
		//console.log('_______',o);
		//console.log('o.E',o.E,'\no.D',o.D)
		if (passt) emoDict[k] = emojiChars[k];

		// if (isdef(o.group) && o.group.toUpperCase() == emoGroup)
		// 	console.log('adding emoji')
		// 	emoDict[k] = emojiChars[k];
	}
	//console.log(emoDict);
}










