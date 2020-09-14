var currentLanguage = 'E';
var interactMode = 'speak'; // speak | write
var pauseAfterInput = false;
const startingCategory = 'animal';
const immediateStart = true; //fires onClickStartButton 
var MAXWORDLENGTH = 8;
var level = 0;

var timit;
var finalResult, matchingWords, validSounds, recognition, isRunning;
var status = 'init'; // init | wait | prompt | result | error | nomatch | end
var hintMessage, feedbackMessage, instructionMessage, score, level, inputBox;
var hintWord, bestWord, answerCorrect, currentInfo;
var RESTARTING;
var speakMode = interactMode == 'speak';
var emoGroup,emoGroupKeys;


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













