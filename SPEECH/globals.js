var lang = 'E';
var interactMode = 'speak'; // speak | write
var pauseAfterInput = false;
const startingCategory = 'animal';
var selectedEmoSetNames = ['animal', 'drink', 'food', 'fruit','game', 'kitchen', 'object', 'place', 'plant', 'sports', 'time', 'transport', 'vegetable'];
var MAXWORDLENGTH = 12;
var level = 0;

var timit;
var finalResult, emoGroup, emoDict, matchingWords, validSounds, recognition, isRunning;
var status = 'init'; // init | wait | prompt | result | error | nomatch | end
var hintMessage, feedbackMessage, instructionMessage, score, level, inputBox;
var hintWord, bestWord, answerCorrect;
var RESTARTING;
var speakMode = interactMode == 'speak';

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
	{ name: 'drink', f: o => o.group == 'food-drink' && o.subgroups == 'drink' },
	{ name: 'food', f: o => o.group == 'food-drink' && startsWith(o.subgroups, 'food') },
	{ name: 'fruit', f: o => o.group == 'food-drink' && o.subgroups == 'food-fruit' },
	{ name: 'game', f: o => (o.group == 'activities' && o.subgroups == 'game') },
	{ name: 'kitchen', f: o => o.group == 'food-drink' && o.subgroups == 'dishware' },
	{ name: 'place', f: o => startsWith(o.subgroups, 'place') },
	{ name: 'plant', f: o => startsWith(o.group, 'animal') && startsWith(o.subgroups, 'plant') },
	{ name: 'sports', f: o => (o.group == 'activities' && o.subgroups == 'sport') },
	{ name: 'time', f: o => (o.group == 'travel-places' && o.subgroups == 'time') },
	{ name: 'transport', f: o => startsWith(o.subgroups, 'transport') && o.subgroups != 'transport-sign' },
	{ name: 'vegetable', f: o => o.group == 'food-drink' && o.subgroups == 'food-vegetable' },

	//objects:
	{
		name: 'object', f: o =>
			(o.group == 'food-drink' && o.subgroups == 'dishware')
			|| (o.group == 'travel-places' && o.subgroups == 'time')
			|| (o.group == 'activities' && o.subgroups == 'event')
			|| (o.group == 'activities' && o.subgroups == 'award-medal')
			|| (o.group == 'activities' && o.subgroups == 'arts-crafts')
			|| (o.group == 'activities' && o.subgroups == 'sport')
			|| (o.group == 'activities' && o.subgroups == 'game')
			|| (o.group == 'objects')
			|| (o.group == 'activities' && o.subgroups == 'event')
			|| (o.group == 'travel-places' && o.subgroups == 'sky-weather')
	},

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

];

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
{ key: 'octopus', words: ['octopus', 'oktopus'], lang: 'G' }, { key: 'snail', words: ['schnecke'], lang: 'G' },
{ key: 'butterfly', words: ['schmetterling'], lang: 'G' }, { key: 'bug', words: ['kaefer', 'insekt'], lang: 'G' },
{ key: 'ant', words: ['ameise'], lang: 'G' }, { key: 'honeybee', words: ['biene'], lang: 'G' },
{ key: 'lady beetle', words: ['kaefer', 'marienkaefer'], lang: 'G' },
{ key: 'cricket', words: ['grashupfer', 'heuschrecke', 'heuschreck'], lang: 'G' }, { key: 'spider', words: ['spinne'], lang: 'G' },
{ key: 'scorpion', words: ['skorpion'], lang: 'G' }, { key: 'mosquito', words: ['gelse', 'insekt', 'mosquito'], lang: 'G' },
{ key: 'whale', words: ['wal', 'fisch'], lang: 'G' }];

//ewe ist ein female sheep
//#endregion













