var IS_TESTING = true;
var currentGame = 'gMissingLetter'; // gWritePic | gTouchPic | gSayPic | gMissingLetter
var currentLanguage = 'E';
var WORD_GROUPS = ['nosymbols']; // 
var MAX_WORD_LENGTH = [3, 4, 5, 7, 10, 111];
var SHOW_LABEL_UP_TO_LEVEL = 0;
var PICS_PER_LEVEL = 10;
USE_LOCAL_STORAGE = true;
const immediateStart = true; //has to be true for now!!! fires onClickStartButton_ 

var SAMPLES_PER_LEVEL = new Array(20).fill(PICS_PER_LEVEL);// [1, 1, 2, 2, 80, 100];
var MAXLEVEL = 7;
var DELAY = 1000;

const STATES = {
	STARTING: -1, GAME_INITIALIZED: -2, ROUND_INITIALIZED: -3, NONE: 0,
	BOUNDARY: 1, GROUPCHANGE: 2, LEVELCHANGE: 3, GAMEOVER: 4, CORRECT: 5, INCORRECT: 6, NEXTTRIAL: 7
};
var GameState;

//to be set by each game in init:
var NumPics;
var MaxNumTrials;

//vars for round to round:
var Pictures = [];
var Goal, Selected;

var level = 0;
var numCorrectAnswers = 0, numTotalAnswers = 0, percentageCorrect = 100;
let badges = [];

var iGROUP = -1;
var lastPosition = 0;
var trialNumber;
var keySet;
var boundary;

//ui state flags
const uiHaltedMask = 1 << 0; //eg. when entering settings
const beforeActivationMask = 1 << 1;
const hasClickedMask = 1 << 2;
var uiPausedStack = [];
var uiPaused = 0;

const levelColors = [LIGHTGREEN, LIGHTBLUE, YELLOW, 'orange', RED,
	GREEN, BLUE, PURPLE, YELLOW2, 'deepskyblue',
	'deeppink', TEAL, ORANGE, 'seagreen', FIREBRICK, OLIVE,
	// '#911eb4', '#42d4f4', '#f032e6',	'#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#aaffc3', 
	'#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', 'gold', 'orangered', 'skyblue', 'pink', 'deeppink',
	'palegreen', '#e6194B'];
//['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'];
let levelKeys = ['island', 'justice star', 'materials science', 'mayan pyramid', 'medieval gate',
	'great pyramid', 'meeple', 'smart', 'stone tower', 'trophy cup', 'viking helmet',
	'flower star', 'island', 'justice star', 'materials science', 'mayan pyramid',];

//sidebar
var dLeiste;

//table
var dLineTopOuter, dLineTop, dLineTopLeft, dLineTopRight, dLineTopMiddle;
var dLineTitleOuter, dLineTitle, dLineTitleLeft, dLineTitleRight, dLineTitleMiddle;
var dLineTableOuter, dLineTable, dLineTableLeft, dLineTableRight, dLineTableMiddle;
var dLineBottomOuter, dLineBottom, dLineBottomLeft, dLineBottomRight, dLineBottomMiddle;
var dHint, dFeedback, dInstruction, dScore, dLevel;
var inputBox;
var defaultFocusElement;
var dTable, dTitle;

//settings
var dSettings = mBy('dSettings');

//speaker
var synth, inputForm, inputTxt, voiceSelect, pitch, pitchValue, rate, rateValue, voices, utterance;

//recog: see recog.js

//feedback
var score, hintWord, bestWord, answerCorrect, currentInfo;

//testing
var timit;

//defaults per game
const DEFAULTS_PER_GAME = {
	testLevels: {
		PICS_PER_LEVEL: 1,
		WORD_GROUPS: ['nosymbols'],
		MAX_WORD_LENGTH: [100],
		MAXLEVEL: 6,
		SHOW_LABEL_UP_TO_LEVEL: 0,
	},
	gMissingLetter: {
		PICS_PER_LEVEL: 20,
		WORD_GROUPS: ['nosymbols'],
		MAX_WORD_LENGTH: [100],
		MAXLEVEL: 6,
		SHOW_LABEL_UP_TO_LEVEL: 2,
	},
	gTouchPic: {
		PICS_PER_LEVEL: 10,
		WORD_GROUPS: ['nosymbols'],
		MAX_WORD_LENGTH: [4, 6, 100],
		MAXLEVEL: 6,
		SHOW_LABEL_UP_TO_LEVEL: 2,
	},
	gWritePic: {
		PICS_PER_LEVEL: 5,
		WORD_GROUPS: ['nosymbols'],
		MAX_WORD_LENGTH: [3, 4, 5, 7, 10, 111],
		MAXLEVEL: 6,
		SHOW_LABEL_UP_TO_LEVEL: 2,
	},
	gSayPic: {
		PICS_PER_LEVEL: 15,
		WORD_GROUPS: ['nosymbols'],
		MAX_WORD_LENGTH: [4, 6, 8, 100],
		MAXLEVEL: 6,
		SHOW_LABEL_UP_TO_LEVEL: 2,
	}
}
function setDefaults(game) {
	PICS_PER_LEVEL = DEFAULTS_PER_GAME[game].PICS_PER_LEVEL;
	WORD_GROUPS = DEFAULTS_PER_GAME[game].WORD_GROUPS;
	MAX_WORD_LENGTH = DEFAULTS_PER_GAME[game].MAX_WORD_LENGTH;
	MAXLEVEL = DEFAULTS_PER_GAME[game].MAXLEVEL;
	SAMPLES_PER_LEVEL = new Array(20).fill(PICS_PER_LEVEL);
}










