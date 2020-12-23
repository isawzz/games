const SHOW_FREEZER = false; // !IS_TESTING;
const CLEAR_LOCAL_STORAGE = false;

//reserved names: dName for div with id dName (dName = mBy('dName'))

const levelColors = [LIGHTGREEN, LIGHTBLUE, YELLOW, 'orange', RED,
	GREEN, BLUE, PURPLE, YELLOW2, 'deepskyblue', 'deeppink', //** MAXLEVEL 10 */
	TEAL, ORANGE, 'seagreen', FIREBRICK, OLIVE, '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', 'gold', 'orangered', 'skyblue', 'pink', 'palegreen', '#e6194B'];
var levelKeys = ['island', 'justice star', 'materials science', 'mayan pyramid', 'medieval gate',
	'great pyramid', 'meeple', 'smart', 'stone tower', 'trophy cup', 'viking helmet',
	'flower star', 'island', 'justice star', 'materials science', 'mayan pyramid',];

const DD = {
	yellow: 'gelb', green: 'grün', blue: 'blau', red: 'rot', pink: 'rosa', orange: 'orange', black: 'schwarz',
	white: 'weiss', violet: 'violett', '1st': 'erste', '2nd': 'zweite', '3rd': 'dritte', '4th': 'vierte', '5th': 'fünfte',
	add:'addiere',subtract:'subtrahiere',multiply:'mutipliziere',plus:'plus',minus:'minus',times:'mal','divided by':'dividiert durch',
	'to the previous number':'zur vorhergehenden zahl',
	'from the previous number':'von der vorhergehenden zahl',
	'multiply the previous number by':'multipliziere die vorhergehende zahl mit',
	'divide the previous number by':'dividiere die vorhergehende zahl durch',
	say:'sage',write:'schreibe',complete:'ergänze',
};

const ColorDict = {
	lgreen: { c: LIGHTGREEN, E: 'lightgreen', D: 'hellgrün' },
	lblue: { c: LIGHTBLUE, E: 'lightblue', D: 'hellblau' },
	yellow: { c: YELLOW, E: 'yellow', D: 'gelb' },
	orange: { c: ORANGE, E: 'orange', D: 'orange' },
	red: { c: RED, E: 'red', D: 'rot' },
	green: { c: GREEN, E: 'green', D: 'grün' },
	blue: { c: BLUE, E: 'blue', D: 'blau' },
	purple: { c: PURPLE, E: 'purple', D: 'lila' },
	// yellow2: { c: YELLOW2, E: 'yellow', D: 'gelb' },
	skyblue: { c: 'deepskyblue', E: 'skyblue', D: 'himmelblau' },
	pink: { c: 'deeppink', E: 'pink', D: 'rosa' },
	teal: { c: 'teal', E: 'teal', D: 'blaugrün' },
	gold: { c: 'gold', E: 'gold', D: 'golden' },
};








