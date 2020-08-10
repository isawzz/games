var emoSets = [
	{ name: 'emotion', f: o => o.group == 'smileys-emotion' },
	{ name: 'hand', f: o => o.group == 'people-body' && o.subgroups.includes('hand') },
	//o=>o.group == 'people-body' && o.subgroups.includes('role'),
	{ name: 'body', f: o => o.group == 'people-body' && o.subgroups == 'body-parts' },
	{ name: 'person', f: o => o.group == 'people-body' && o.subgroups == 'person' },
	{ name: 'gesture', f: o => o.group == 'people-body' && o.subgroups == 'person-gesture' },
	{ name: 'role', f: o => o.group == 'people-body' && o.subgroups == 'person-role' },
	{ name: 'fantasy', f: o => o.group == 'people-body' && o.subgroups == 'person-fantasy' },
	{ name: 'activity', f: o => o.group == 'people-body' && (o.subgroups == 'person-activity' || o.subgroups == 'person-resting') },
	{ name: 'sport', f: o => o.group == 'people-body' && o.subgroups == 'person-sport' },
	{ name: 'family', f: o => o.group == 'people-body' && o.subgroups == 'family' },
	{ name: 'animal', f: o => startsWith(o.group, 'animal') && startsWith(o.subgroups, 'animal') },
	{ name: 'plant', f: o => startsWith(o.group, 'animal') && startsWith(o.subgroups, 'plant') },
	{ name: 'fruit', f: o => o.group == 'food-drink' && o.subgroups == 'food-fruit' },
	{ name: 'vegetable', f: o => o.group == 'food-drink' && o.subgroups == 'food-vegetable' },
	{ name: 'food', f: o => o.group == 'food-drink' && startsWith(o.subgroups, 'food') },
	{ name: 'drink', f: o => o.group == 'food-drink' && o.subgroups == 'drink' },

	//objects:
	{
		name: 'object', f: o => (o.group == 'food-drink' && o.subgroups == 'dishware')
			|| (o.group == 'travel-places' && o.subgroups == 'time')
			|| (o.group == 'activities' && o.subgroups == 'event')
			|| (o.group == 'activities' && o.subgroups == 'award-medal')
			|| (o.group == 'activities' && o.subgroups == 'sport')
			|| (o.group == 'activities' && o.subgroups == 'game')
			|| (o.group == 'objects')
			|| (o.group == 'activities' && o.subgroups == 'event')
			|| (o.group == 'travel-places' && o.subgroups == 'sky-weather')
	},

	{ name: 'place', f: o => startsWith(o.subgroup, 'place') },
	{ name: 'transport', f: o => startsWith(o.subgroup, 'transport') },
	{ name: 'symbols', f: o => o.group == 'symbols' },
	{ name: 'shapes', f: o => o.group == 'symbols' && o.subgroups == 'geometric' },
	{ name: 'sternzeichen', f: o => o.group == 'symbols' && o.subgroups == 'zodiac' },

	//toolbar buttons:
	{
		name: 'toolbar', f: o => (o.group == 'symbols' && o.subgroups == 'warning')
			|| (o.group == 'symbols' && o.subgroups == 'arrow')
			|| (o.group == 'symbols' && o.subgroups == 'av-symbol')
			|| (o.group == 'symbols' && o.subgroups == 'other-symbol')
			|| (o.group == 'symbols' && o.subgroups == 'keycap')
	},

	{ name: 'math', f: o => o.group == 'symbols' && o.subgroups == 'math' },
	{ name: 'punctuation', f: o => o.group == 'symbols' && o.subgroups == 'punctuation' },
	{ name: 'misc', f: o => o.group == 'symbols' && o.subgroups == 'other-symbol' },

]


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

//#region collections of words
var farben = ['rot', 'gruen', 'blau', 'gelb', 'braun', 'violett', 'rosa', 'orange', 'schwarz', 'weiss'];
var colors = ['red', 'green', 'blue', 'yellow', 'brown', 'violet', 'pink', 'orange', 'black', 'white'];
//var tiere = ['Tiger', 'Giraffe', 'Hund', 'Katze', 'Pferd', 'Elephant', 'Kuh', 'Ziege', 'Loewe'];
var animals = ['tiger', 'giraffe', 'dog', 'cat', 'horse', 'elefant', 'cow', 'goat', 'lion'];

var animalKeys = ['monkey', 'gorilla', 'orangutan', 'dog', 'cat', 'tiger', 'leopard', 'horse', 'deer', 'ox', 'cow', 'pig',
	'goat', 'ewe', 'camel', 'elephant', 'rhinoceros', 'hippopotamus', 'mouse', 'rat', 'rabbit', 'hedgehog', 'bat', 'sloth',
	'otter', 'skunk', 'kangaroo', 'rooster', 'penguin', 'dove', 'eagle', 'duck', 'swan', 'owl', 'flamingo', 'peacock', 'parrot',
	'crocodile', 'frog', 'turtle', 'lizard', 'snake', 'dolphin', 'fish', 'shark', 'octopus', 'snail', 'butterfly', 'bug',
	'ant', 'honeybee', 'lady beetle', 'cricket', 'spider', 'scorpion', 'mosquito', 'whale'];
var tiere = [{ key: 'monkey', words: ['affe'], lang: 'G' }, { key: 'gorilla', lang: 'G' },
{ key: 'orangutan', lang: 'G' }, { key: 'dog', words: ['hund'], lang: 'G' },
{ key: 'cat', words: ['katze'], lang: 'G' }, { key: 'tiger', lang: 'G' }, { key: 'leopard', lang: 'G' },
{ key: 'horse', words: ['pferd'], lang: 'G' },
{ key: 'deer', words: ['hirsch', 'elch'], lang: 'G' }, { key: 'ox', words: ['ochs', 'bueffel', 'stier'], lang: 'G' },
{ key: 'cow', words: ['kuh'], lang: 'G' },
{ key: 'pig', words: ['schwein'] }, { key: 'goat', words: ['ziege'] }, { key: 'ewe', words: ['schaf'] },
{ key: 'camel', words: ['kamel'], lang: 'G' }, { key: 'elephant', words: ['elephant', 'elefant'], lang: 'G' },
{ key: 'rhinoceros', words: ['rhinozeros', 'nashorn'], lang: 'G' },
{ key: 'hippopotamus', words: ['nilpferd', 'hippo', 'hippopotamus'], lang: 'G' },
{ key: 'mouse', words: ['maus'], lang: 'G' }, { key: 'rat', words: ['ratte'], lang: 'G' },
{ key: 'rabbit', words: ['kaninchen', 'hase'], lang: 'G' },
{ key: 'hedgehog', words: ['igel'], lang: 'G' }, { key: 'bat', words: ['fledermaus'], lang: 'G' },
{ key: 'sloth', words: ['faultier'], lang: 'G' },
{ key: 'otter', lang: 'G' }, { key: 'skunk', words: ['stinktier'], lang: 'G' }, { key: 'kangaroo', words: ['kaenguru'], lang: 'G' },
{ key: 'rooster', words: ['hahn'], lang: 'G' },
{ key: 'penguin', words: ['pinguin'], lang: 'G' }, { key: 'dove', words: ['taube'], lang: 'G' },
{ key: 'eagle', words: ['adler'], lang: 'G' }, { key: 'duck', words: ['ente'], lang: 'G' },
{ key: 'swan', words: ['schwan'], lang: 'G' }, { key: 'owl', words: ['eule'], lang: 'G' }, { key: 'flamingo', lang: 'G' },
{ key: 'peacock', words: ['pfau'], lang: 'G' }, { key: 'parrot', words: ['papagei', 'vogel'] },
{ key: 'crocodile', words: ['krokodil'], lang: 'G' }, { key: 'frog', words: ['frosch'], lang: 'G' },
{ key: 'turtle', words: ['schildkroete', 'wasserschidkroete'], lang: 'G' }, { key: 'lizard', words: ['eidechse'], lang: 'G' },
{ key: 'snake', words: ['schlange'], lang: 'G' },
{ key: 'dolphin', words: ['delfin', 'delphin', 'fisch'], lang: 'G' }, { key: 'fish', words: ['fisch'], lang: 'G' },
{ key: 'shark', words: ['hai', 'haifisch', 'fisch'], lang: 'G' },
{ key: 'octopus', lang: 'G' }, { key: 'snail', words: ['schnecke'], lang: 'G' },
{ key: 'butterfly', words: ['schmetterling'], lang: 'G' }, { key: 'bug', words: ['kaefer', 'insekt'], lang: 'G' },
{ key: 'ant', words: ['ameise'], lang: 'G' }, { key: 'honeybee', words: ['biene'], lang: 'G' },
{ key: 'lady beetle', words: ['kaefer', 'marienkaefer'], lang: 'G' },
{ key: 'cricket', words: ['grashupfer', 'heuschrecke', 'heuschreck'], lang: 'G' }, { key: 'spider', words: ['spinne'], lang: 'G' },
{ key: 'scorpion', words: ['skorpion'], lang: 'G' }, { key: 'mosquito', words: ['gelse', 'insekt', 'mosquito'], lang: 'G' },
{ key: 'whale', words: ['wal', 'fisch'], lang: 'G' }];

//ewe ist ein female sheep
//#endregion

function getGermanAnimals() {
	let m = tiere;
	let choice = chooseRandom(m);
	if (nundef(choice.words)) choice.words = [choice.key];
	choice.words = choice.words.map(x => capitalize(x));
	choice.lang = 'D';
	return choice;
}
function sepWordListFromString(s, seplist) {
	let words = multiSplit(s, seplist);
	return words.map(x => x.replace('"', '').trim());
}
function simpleWordListFromString(s, sep = [' ']) {
	let lst = listFromString(s);
	let res = [];
	for (const w of lst) {
		let parts = w.split(sep);
		parts.map(x => addIf(res, x));
	}
	return res;
}
function listFromString(s) {
	//let tags=s.replace('"','').trim();
	let words = s.split(',');
	return words.map(x => x.replace('"', '').trim());
}
function setGroup(group) {
	emoGroup = group.toUpperCase();
	emoDict = {};
	for (const k in emojiChars) {
		let o = emojiChars[k];
		if (isdef(o.group) && o.group.toUpperCase() == emoGroup)
			emoDict[k] = emojiChars[k];
	}
	console.log(emoDict);
}
function setGroup_dep(group) {
	emoGroup = group.toUpperCase();
	emoDict = {};
	for (const k in emojiChars) {
		let o = emojiChars[k];
		if (isdef(o.group) && o.group.toUpperCase() == emoGroup)
			emoDict[k] = emojiChars[k];
	}
	console.log(emoDict);
}
function allEnglishWords() {
	//console.log(emojiChars, emojiKeys);

	//test
	// let os=takeFromTo(emojiChars,100,103);
	// console.log('_______');
	// os.map(x=>console.log(x,x.tags,x.openmoji_tags))
	//let o = os[0];

	let key = chooseRandomKey(isdef(emoGroup) ? emoDict : emojiChars);
	//console.log('_______________', key);
	let o = emojiChars[key];
	//console.log('emoji object', o);
	let tags = sepWordListFromString(o.tags, [' ', ',']);
	let etags = sepWordListFromString(o.openmoji_tags, [' ', ',']);
	let other = sepWordListFromString(o.annotation, [' ', ',']);
	let subgroups = sepWordListFromString(o.subgroups, [' ', ',', '-']);
	let words = union(union(tags, etags), other);
	//console.log('words', words);

	return { words: words, key: o.annotation, lang: 'E' };

}

function setSpeechWords() {
	let table = mBy('table');
	clearElement(table);

	//hier kommen {words,key,lang} 
	let data = getGermanAnimals(); //allEnglishWords(); //getGermanAnimals(); //getColoredHearts();
	console.log('example data:', data)

	lang = data.lang;
	matchingWords = data.words;
	bestWord = last(matchingWords);
	hintWord = '_'.repeat(bestWord.length);

	//picture
	let e = mEmo(data.key, table, 200);
	e.style.color = 'red';
	mFlexLinebreak(table);

	//hint
	hintMessage = mHeading('', table, 1, 'hint');
	hintMessage.style.fontSize = '40pt';
	mFlexLinebreak(table);

	//prompt = feedback
	if (isEnglish(lang)) {
		if (interactMode == 'speak') instructionMessage = mInstruction('Say the word in English', table);
		else instructionMessage = mInstruction('Type the word in English', table);
	} else {
		if (interactMode == 'speak') instructionMessage = mInstruction('Sag das Wort auf Deutsch', table);
		else instructionMessage = mInstruction("Schreib' das Wort auf Deutsch", table);
	}
	mFlexLinebreak(table);
	feedbackMessage = instructionMessage; //mHeading('', table, 2, 'feedback');

}













