const SHOW_FREEZER = false; // !IS_TESTING;
//const CLEAR_LOCAL_STORAGE = true;
const ALLOW_CALIBRATION = false;

var QuestionCounter = 0;
var lastPosition;
var WordProblems;
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
	add: 'addiere', subtract: 'subtrahiere', multiply: 'mutipliziere', plus: 'plus', minus: 'minus', times: 'mal',
	'divided by': 'dividiert durch', excellent: 'sehr gut', very: 'sehr', good: 'gut',
	'to the previous number': 'zur vorhergehenden zahl',
	'from the previous number': 'von der vorhergehenden zahl',
	'multiply the previous number by': 'multipliziere die vorhergehende zahl mit',
	'divide the previous number by': 'dividiere die vorhergehende zahl durch',
	'the previous number': 'die vorhergehende zahl', is: 'ist', what: 'was', equals: 'ist gleich', enter: "tippe",
	'to the power of': 'hoch', or: 'oder', less: 'kleiner', greater: 'grösser', than: 'als', equal: 'gleich', and: 'und',
	not: 'nicht', click: 'click', press: 'tippe', quite: 'ziemlich', 'not quite': 'nicht ganz', 
	say: 'sage', write: 'schreibe', complete: 'ergänze', 'unequal': 'ungleich', except: 'ausser', EXCEPT: 'AUSSER',
	number: 'Zahl', color: 'farbe', eliminate: 'eliminiere', all: 'alle', with: 'mit', true: 'wahr', false: 'falsch',
	build: 'bilde', count: 'zähle', 'the red dots': 'die roten Punkte',
};
const OPS = { //die muessen vals in settings.games[game] sein!
	'first': { cmd: 'add', link: 'to', wr: '+', sp: 'plus', f: (a, b) => (a + b), min: 20, max: 100 },
	'plus': { cmd: 'add', link: 'to', wr: '+', sp: 'plus', f: (a, b) => (a + b), min: 3, max: 30 },
	'minus': { cmd: 'subtract', link: 'from', wr: '-', sp: 'minus', f: (a, b) => (a - b), min: 1, max: 10 },
	'div': { cmd: 'divide', link: 'by', wr: ':', sp: 'divided by', f: (a, b) => (a / b), min: 2, max: 10 },
	'intdiv': { cmd: 'divide', link: 'by', wr: 'div', sp: 'divided by', f: (a, b) => (Math.floor(a / b)), min: 1, max: 10 },
	'mult': { cmd: 'multiply', link: 'by', wr: 'x', sp: 'times', f: (a, b) => (a * b), min: 2, max: 10 },
	// '**':{wr:'^',sp:'to the power of',f:(a,b)=>(Math.pow(a,b))},
	'pow': { cmd: 'build', link: 'to the power of', wr: '^', sp: 'to the power of', f: (a, b) => (Math.pow(a, b)), min: 0, max: 20 },
	'mod': { cmd: 'build', link: 'modulo', wr: '%', sp: 'modulo', f: (a, b) => (a % b), min: 0, max: 20 },
	'l': { cmd: 'true or false?', link: 'less than', wr: '<', sp: 'less than', f: (a, b) => (a < b) },
	'g': { cmd: 'true or false?', link: 'greater than', wr: '>', sp: 'greater than', f: (a, b) => (a > b) },
	'leq': { cmd: 'true or false?', link: 'less or equal', wr: '<=', sp: 'less or equal', f: (a, b) => (a <= b) },
	'geq': { cmd: 'true or false?', link: 'greater or equal', wr: '>=', sp: 'greater or equal', f: (a, b) => (a >= b) },
	'eq': { cmd: 'true or false?', link: 'equal', wr: '=', sp: 'equal', f: (a, b) => (a == b) },
	'neq': { cmd: 'true or false?', link: 'unequal', wr: '#', sp: 'unequal', f: (a, b) => (a != b) },
	'and': { cmd: 'true or false?', link: 'and', wr: '&&', sp: 'and', f: (a, b) => (a && b) },
	'or': { cmd: 'true or false?', link: 'or', wr: '||', sp: 'or', f: (a, b) => (a || b) },
	'nand': { cmd: 'true or false?', link: 'nand', wr: 'nand', sp: 'nand', f: (a, b) => (!(a && b)) },
	'nor': { cmd: 'true or false?', link: 'nor', wr: 'nor', sp: 'nor', f: (a, b) => (!(a || b)) },
	'xor': { cmd: 'true or false?', link: 'xor', wr: 'xor', sp: 'xor', f: (a, b) => (a && !b || !a && b) },
}

const GirlNames=['Adrianna','Amanda','Ashley','Cassandra','Charlene','Erica','Gudrun',
'Jenny','Lana','Lillian','Martha','Maurita','Melissa','Micha','Milda','Natalie','Natasha',
'Rebecca','Stacy'];

const BoyNames=['Aaron','Ariel','Billy','Cayley','Erik',
'Felix','Gunter','Gilbert','Henry','Jacob','Jaime','John','Leo',
'Marshall','Matthew','Nathan',
'Robert','Shad','Thomas','Tim','William'];




