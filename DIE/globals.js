const SHOW_FREEZER = false; // !IS_TESTING;
const CLEAR_LOCAL_STORAGE = true;
const ALLOW_CALIBRATION = false;

var QuestionCounter = 0;
var lastPosition;

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
	add:'addiere',subtract:'subtrahiere',multiply:'mutipliziere',plus:'plus',minus:'minus',times:'mal',
	'divided by':'dividiert durch',
	'to the previous number':'zur vorhergehenden zahl',
	'from the previous number':'von der vorhergehenden zahl',
	'multiply the previous number by':'multipliziere die vorhergehende zahl mit',
	'divide the previous number by':'dividiere die vorhergehende zahl durch',
	'the previous number':'die vorhergehende zahl',is:'ist',what:'was',equals:'ist gleich',enter:"tippe",
	'to the power of':'hoch',or:'oder',less:'kleiner',greater:'grösser',than:'als',equal:'gleich',and:'und',not:'nicht',
	say:'sage',write:'schreibe',complete:'ergänze','unequal':'ungleich',except:'ausser',EXCEPT:'AUSSER',
	number:'Zahl',color:'farbe',eliminate:'eliminiere',all:'alle',with:'mit',
};
const OPS = {
	'+':{wr:'+',sp:'plus',f:(a,b)=>(a+b)},
	'-':{wr:'-',sp:'minus',f:(a,b)=>(a+b)},
	'/':{wr:':',sp:'divided by',f:(a,b)=>(a/b)},
	'//':{wr:'div',sp:'divided by',f:(a,b)=>(Math.floor(a/b))},
	'*':{wr:'x',sp:'times',f:(a,b)=>(a*b)},
	'**':{wr:'^',sp:'to the power of',f:(a,b)=>(Math.pow(a,b))},
	'pow':{wr:'^',sp:'to the power of',f:(a,b)=>(Math.pow(a,b))},
	'mod':{wr:'%',sp:'modulo',f:(a,b)=>(a%b)},
	'<':{wr:'<',sp:'less than',f:(a,b)=>(a<b)},
	'>':{wr:'>',sp:'greater than',f:(a,b)=>(a>b)},
	'<=':{wr:'<=',sp:'less or equal',f:(a,b)=>(a<=b)},
	'>=':{wr:'>=',sp:'greater or equal',f:(a,b)=>(a>=b)},
	'=':{wr:'=',sp:'equal',f:(a,b)=>(a==b)},
	'!=':{wr:'#',sp:'unequal',f:(a,b)=>(a!=b)},
	'and':{wr:'&&',sp:'and',f:(a,b)=>(a&&b)},
	'or':{wr:'||',sp:'or',f:(a,b)=>(a||b)},
	'nand':{wr:'nand',sp:'nand',f:(a,b)=>(!(a&&b))},
	'nor':{wr:'nor',sp:'nor',f:(a,b)=>(!(a||b))},
	'xor':{wr:'xor',sp:'xor',f:(a,b)=>(a && !b || !a && b)},
}







