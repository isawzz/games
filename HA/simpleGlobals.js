const SETTINGS_KEY = IS_TESTING ? 'settingsTEST' : 'settings';
const CLEAR_LOCAL_STORAGE = false;

var Speech;

var TaskChain, ChainExecutionCanceled, ChainTimeout;

var Pictures, Goal, Selected, Score;

const GAME = {
	touch: { friendly: 'Pictures!', logo: 'computer mouse', color: 'deepskyblue', },
	colors: { friendly: 'Colors!', logo: 'artist palette', color: RED, }, //'orange', //LIGHTBLUE, //'#bfef45',
	write: { friendly: 'Type it!', logo: 'keyboard', color: 'orange', }, //LIGHTGREEN, //'#bfef45',
	letters: { friendly: 'Letters!', logo: 'black nib', color: 'gold', },
	say: { friendly: 'Speak up!', logo: 'microphone', color: BLUE, }, //'#4363d8',
	preMem: { friendly: 'Premem!', logo: 'hammer and wrench', color: LIGHTGREEN, }, //'deeppink',
	steps: { friendly: 'Steps!', logo: 'stairs', color: PURPLE, }, //'#911eb4',
	mem: { f: gTouch, friendly: 'Memory!', logo: 'memory', color: GREEN, }, //'#3cb44b'
};
