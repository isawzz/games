function allEnglishWords() {

	let key = chooseRandomKey(isdef(emoGroup) ? emoDict : emojiChars);

	//key='1F1E6-1F1FC';

	let o = emojiChars[key];
	console.log('_________\nkey', key, '\no', o)
	let toBeRemoved = ['marine', 'forest', 'mammal', 'medium', 'parts', 'medium-light', 'medium-dark', 'dark', 'light', 'skin', 'tone', 'on', 'button'];
	toBeRemoved.push(emoGroup.toLowerCase());

	let anno = o.annotation;
	anno = stringBefore(anno, ':');
	if (anno.length > MAXWORDLENGTH) {
		console.log('problem word:', anno, key, o)
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
function getEmoSetWords_dep(lang = 'E') {
	let key = chooseRandomKey(isdef(emoGroup) ? emoDict : emojiChars);

	//key = '1F5B1'; // mouse '1FA79'; //bandage '1F48E'; // gem '1F4E3';//megaphone '26BE'; //baseball '1F508'; //speaker low volume
	// key='26BE'; // baseball '26BD'; //soccer '1F988'; //shark '1F41C'; //ant '1F1E6-1F1FC';
	let o = emojiChars[key];
	//console.log('_________\nkey',key,'\no',o)
	//console.log('_________\nkey',key,'\no',o)
	let toBeRemoved = ['marine', 'forest', 'mammal', 'medium', 'parts', 'medium-light', 'medium-dark', 'dark', 'light', 'skin', 'tone', 'on', 'button'];
	toBeRemoved.push(emoGroup.toLowerCase());

	let oValid = o[lang + '_valid_sound'];
	//console.log('_____ oValid',oValid);
	let valid;
	if (isEmpty(oValid)) valid = []; else valid = sepWordListFromString(o[lang + '_valid_sound'], ['|']);
	//valid=isEmpty(valid)?[]:[valid];
	//console.log('valid sound',valid);

	let words = [];//isEmpty(valid)?[]:[valid];
	if (isEnglish(lang)) {
		//console.log('o.E',o.E,'\no.D',o.D)

		words = words.concat(sepWordListFromString(o.E, ['|']));
	} else words = words.concat(sepWordListFromString(o.D, ['|']));

	words = words.filter(x => x.length <= MAXWORDLENGTH);
	if (isEmpty(words)) { delete emoDict[key]; return getEmoSetWords(); }
	return { valid: valid, words: words, key: o.annotation, lang: lang, record: o };

}

